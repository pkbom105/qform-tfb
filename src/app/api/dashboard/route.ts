import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDisplayReportName } from "@/lib/reportNameGenerator";

export const dynamic = "force-dynamic";

const fmtDate = (d: Date) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

// Helper to initialize a 12-month array (Jan-Dec) with 0s
const emptyMonthly = (): number[] => Array(12).fill(0);

// Get quantity from order
const getQty = (o: any): number => {
  if (o.manualTotal) return parseInt(o.manualTotal) || 0;
  if (o.totalQuantity) return o.totalQuantity;
  return 0;
};

export async function GET() {
  try {
    // Read all orders from PostgreSQL
    const orders = await prisma.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    // ==================== STATS ====================
    const totalOrders = orders.length;
    const totalCustomers = totalOrders;
    const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "active").length;
    const pendingOrders = totalOrders - completedOrders;

    // ==================== MONTHLY AGGREGATION ====================
    const monthlyOrders = emptyMonthly();
    const monthlyRevenue = emptyMonthly();

    orders.forEach((o) => {
      const m = new Date(o.createdAt).getMonth();
      monthlyOrders[m] += 1;
      monthlyRevenue[m] += getQty(o);
    });

    // ==================== POPULAR PRODUCTS ====================
    const productCount = new Map<string, number>();
    orders.forEach((o) => {
      productCount.set(o.productType, (productCount.get(o.productType) || 0) + 1);
    });

    const popularProducts = Array.from(productCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // ==================== RECENT ORDERS (take 8) ====================
    const recentOrders = orders.slice(0, 8).map((o) => ({
      id: o.id,
      orderNumber: getDisplayReportName(o.id),
      customerName: o.customer?.name || "-",
      company: o.customer?.companyName || "-",
      productType: o.productType,
      quantity: getQty(o),
      status: o.status,
      createdAt: fmtDate(new Date(o.createdAt)),
    }));

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
        recentOrders,
        monthlyOrders,
        revenueData: monthlyRevenue,
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