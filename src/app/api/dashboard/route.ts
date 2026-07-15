import { NextResponse } from "next/server";
import { localDb, onlineDb } from "@/lib/prisma";
import { getDisplayReportName } from "@/lib/reportNameGenerator";

export const dynamic = "force-dynamic";

const fmtDate = (d: Date) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

export async function GET() {
  try {
    // Primary source: Local SQLite
    const localOrders = await localDb.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    // Secondary source: PostgreSQL (VPN) - Wso table
    let wsoRecords: Array<{ id: number; productType: string; totalQuantity: number; name: string; companyName?: string | null; createdAt: Date }> = [];
    let submissions: Array<{ id: number; productType: string; totalQuantity: string | null; name: string; companyName?: string | null; createdAt: Date }> = [];

    if (onlineDb && typeof onlineDb === "object") {
      try {
        wsoRecords = await onlineDb.wso.findMany({
          orderBy: { createdAt: "desc" },
        });
      } catch (error) {
        console.warn("Online WSO fetch skipped:", error);
      }

      try {
        submissions = await onlineDb.submission.findMany({
          orderBy: { createdAt: "desc" },
        });
      } catch (error) {
        console.warn("Online submission fetch skipped:", error);
      }
    }

    // Combine stats
    const totalOrders = localOrders.length + wsoRecords.length + submissions.length;
    const totalCustomers = totalOrders;
    const pendingOrders = totalOrders;
    const completedOrders = 0;

    // Get popular products from Wso + Local
    const productCount = new Map<string, number>();
    localOrders.forEach((o) => {
      productCount.set(o.productType, (productCount.get(o.productType) || 0) + 1);
    });
    wsoRecords.forEach((w) => {
      productCount.set(w.productType, (productCount.get(w.productType) || 0) + 1);
    });
    submissions.forEach((s) => {
      productCount.set(s.productType, (productCount.get(s.productType) || 0) + 1);
    });

    const popularProducts = Array.from(productCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Format recent orders (take 8)
    const existingLocalIds = new Set(localOrders.map((o) => o.id));
    type RecordType = {
      id: number;
      orderNumber: string;
      customerName: string;
      company: string;
      productType: string;
      quantity: number;
      status: string;
      createdAt: string;
    };
    const allRecords: RecordType[] = [
      ...localOrders.map((o) => ({
        id: o.id,
        orderNumber: getDisplayReportName(o.id),
        customerName: o.customer?.name || "-",
        company: o.customer?.companyName || "-",
        productType: o.productType,
        quantity: parseInt(String(o.manualTotal || o.totalQuantity || 0), 10),
        status: o.status as "active" | "inactive",
        createdAt: fmtDate(new Date(o.createdAt)),
      })),
      ...wsoRecords
        .filter((w) => !existingLocalIds.has(w.id))
        .map((w) => ({
          id: w.id,
          orderNumber: getDisplayReportName(w.id),
          customerName: w.name,
          company: w.companyName || "-",
          productType: w.productType,
          quantity: w.totalQuantity,
          status: "active" as const,
          createdAt: fmtDate(new Date(w.createdAt)),
        })),
      ...submissions
        .filter((s) => {
          const subId = 10000 + s.id;
          return !existingLocalIds.has(subId);
        })
        .map((s) => {
          const subId = 10000 + s.id;
          return {
            id: subId,
            orderNumber: getDisplayReportName(subId),
            customerName: s.name,
            company: s.companyName || "-",
            productType: s.productType,
            quantity: parseInt(s.totalQuantity || "0") || 0,
            status: "active" as const,
            createdAt: fmtDate(new Date(s.createdAt)),
          };
        }),
    ].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 8);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalCustomers,
        },
        popularProducts,
        recentOrders: allRecords,
      },
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
