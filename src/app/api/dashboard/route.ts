import { NextResponse } from "next/server";
import { onlineDb } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch from PostgreSQL (VPN) - Wso table
    const wsoRecords = await onlineDb.wso.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Also fetch from Submission table
    const submissions = await onlineDb.submission.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Combine stats
    const totalOrders = wsoRecords.length + submissions.length;
    const totalCustomers = totalOrders; // Each record = 1 customer
    const pendingOrders = totalOrders;
    const completedOrders = 0;

    // Get popular products from Wso
    const productCount = new Map<string, number>();
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

    // Format recent orders (combine Wso + Submission, take 8)
    const allRecords = [
      ...wsoRecords.map((w) => ({
        id: w.id,
        customerName: w.name,
        company: w.companyName || "-",
        productType: w.productType,
        quantity: w.totalQuantity,
        status: "active" as const,
        createdAt: new Date(w.createdAt).toLocaleDateString("th-TH"),
      })),
      ...submissions.map((s) => ({
        id: 10000 + s.id,
        customerName: s.name,
        company: s.companyName || "-",
        productType: s.productType,
        quantity: parseInt(s.totalQuantity || "0") || 0,
        status: "active" as const,
        createdAt: new Date(s.createdAt).toLocaleDateString("th-TH"),
      })),
    ].sort((a, b) => {
      // Sort by date desc
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
