import { NextResponse } from "next/server";
import { localDb } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Fetch customers with their order count
    const customers = await localDb.customer.findMany({
      include: {
        _count: { select: { orders: true } },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Filter by search term if provided
    const filtered = search
      ? customers.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.companyName &&
              c.companyName.toLowerCase().includes(search.toLowerCase())) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search),
        )
      : customers;

    const totalCount = filtered.length;

    // Format response
    const formatted = filtered.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      company: customer.companyName || "-",
      phone: customer.phone,
      lineId: customer.lineId || "-",
      totalOrders: customer._count.orders,
      lastOrderId: customer.orders[0]?.id ?? null,
      lastOrderDate: customer.orders[0]
        ? new Date(customer.orders[0].createdAt).toLocaleDateString("th-TH")
        : "-",
      status: customer.totalOrders > 0 ? "active" : "inactive",
    }));

    return NextResponse.json({
      success: true,
      data: {
        customers: formatted,
        total: totalCount,
      },
    });
  } catch (error: any) {
    console.error("Customers API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}