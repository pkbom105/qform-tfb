import { NextResponse } from "next/server";
import { localDb } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get order and customer stats
    const totalOrders = await localDb.order.count();
    const pendingOrders = await localDb.order.count({ where: { status: "pending" } });
    const completedOrders = await localDb.order.count({ where: { status: "completed" } });
    const totalCustomers = await localDb.customer.count();

    // Get recent orders with customer info
    const recentOrders = await localDb.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    });

    // Get product type distribution
    const allOrders = await localDb.order.findMany({
      select: { productType: true },
    });

    // Count by product type for popular products
    const productCount = new Map<string, number>();
    allOrders.forEach((o) => {
      productCount.set(o.productType, (productCount.get(o.productType) || 0) + 1);
    });
    const popularProducts = Array.from(productCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Format recent orders for display
    const formattedOrders = recentOrders.map((order) => ({
      id: order.id,
      customerName: order.customer?.name || "ไม่ระบุ",
      company: order.customer?.companyName || "-",
      productType: order.productType,
      quantity: order.totalQuantity || 0,
      status: order.status,
      createdAt: new Date(order.createdAt).toLocaleDateString("th-TH"),
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
        recentOrders: formattedOrders,
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