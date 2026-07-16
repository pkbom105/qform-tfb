import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDisplayReportName } from "@/lib/reportNameGenerator";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // Read orders with customers from PostgreSQL
    const orders = await prisma.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    const fmtDate = (d: Date) => {
      const thaiMonths = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
      const day = String(d.getDate()).padStart(2, "0");
      const buddhistYear = d.getFullYear() + 543;
      return `${day} ${thaiMonths[d.getMonth()]} ${buddhistYear}`;
    };

    const getSetCount = (order: any): number => {
      try {
        const sets = JSON.parse(order.decorationSets || "[]");
        return Array.isArray(sets) ? sets.length : 1;
      } catch {
        return 1;
      }
    };

    // Build customer records from orders
    const customers = orders.map((order) => {
      const cust = order.customer;
      return {
        id: order.id,
        name: cust?.name || "-",
        email: cust?.email || "-",
        company: cust?.companyName || "-",
        phone: cust?.phone || "-",
        lineId: cust?.lineId || "-",
        totalOrders: 1,
        lastOrderId: order.id,
        reportName: getDisplayReportName(order.id),
        lastOrderDate: fmtDate(new Date(order.createdAt)),
        status: order.status || "pending",
        setCount: getSetCount(order),
      };
    });

    // Sort by date desc
    const sorted = customers.sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );

    // Apply filters
    let filtered = sorted;

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (startDate || endDate) {
      const thaiMonths = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
      filtered = filtered.filter((c) => {
        const parts = c.lastOrderDate.split(" ");
        if (parts.length !== 3) return false;
        const day = parseInt(parts[0], 10);
        const monthIndex = thaiMonths.indexOf(parts[1]);
        const year = parseInt(parts[2], 10) - 543;
        if (isNaN(day) || monthIndex === -1 || isNaN(year)) return false;
        const orderDate = new Date(year, monthIndex, day);

        if (startDate) {
          const sd = new Date(startDate);
          if (orderDate < sd) return false;
        }
        if (endDate) {
          const ed = new Date(endDate);
          if (orderDate > ed) return false;
        }
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        customers: filtered,
        total: filtered.length,
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