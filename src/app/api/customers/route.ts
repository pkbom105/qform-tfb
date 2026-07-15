import { NextResponse } from "next/server";
import { localDb, onlineDb } from "@/lib/prisma";
import { getDisplayReportName } from "@/lib/reportNameGenerator";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // Primary source: Local SQLite orders table (has correct reportName/offset)
    const localOrders = await localDb.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });

    // Secondary source: PostgreSQL (VPN) - Wso table (for orders not yet synced)
    let wsoRecords = await onlineDb.wso.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Also Submission table
    const submissions = await onlineDb.submission.findMany({
      orderBy: { createdAt: "desc" },
    });

    const fmtDate = (d: Date) => {
      const thaiMonths = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
      const day = String(d.getDate()).padStart(2, "0");
      const buddhistYear = d.getFullYear() + 543;
      return `${day} ${thaiMonths[d.getMonth()]} ${buddhistYear}`;
    };

    // Helper to parse decorationSets count
    const getSetCount = (order: any): number => {
      try {
        const sets = JSON.parse(order.decorationSets || "[]");
        return Array.isArray(sets) ? sets.length : 1;
      } catch {
        return 1;
      }
    };

    // Build customer records from local SQLite orders (primary source)
    const localCustomersMap = new Map<string, any>();
    for (const order of localOrders) {
      const cust = order.customer;
      if (!cust) continue;
      const key = order.id; // use order.id as key for unique rows per order
      localCustomersMap.set(`local-${key}`, {
        id: order.id,
        name: cust.name,
        email: cust.email,
        company: cust.companyName || "-",
        phone: cust.phone,
        lineId: cust.lineId || "-",
        totalOrders: 1,
        lastOrderId: order.id,
        reportName: getDisplayReportName(order.id),
        lastOrderDate: fmtDate(new Date(order.createdAt)),
        status: order.status || "pending",
        setCount: getSetCount(order),
      });
    }

    // Add Wso records that are NOT in local SQLite
    const existingLocalIds = new Set(localOrders.map((o) => o.id));
    for (const wso of wsoRecords) {
      if (existingLocalIds.has(wso.id)) continue;
      localCustomersMap.set(`wso-${wso.id}`, {
        id: wso.id,
        name: wso.name,
        email: wso.email,
        company: wso.companyName || "-",
        phone: wso.phone,
        lineId: wso.lineId || "-",
        totalOrders: 1,
        lastOrderId: wso.id,
        reportName: getDisplayReportName(wso.id),
        lastOrderDate: fmtDate(new Date(wso.createdAt)),
        status: "pending",
        setCount: 1,
      });
    }

    // Add Submission records (id offset 10000)
    for (const sub of submissions) {
      const subId = 10000 + sub.id;
      if (existingLocalIds.has(subId)) continue;
      localCustomersMap.set(`sub-${subId}`, {
        id: subId,
        name: sub.name,
        email: sub.email,
        company: sub.companyName || "-",
        phone: sub.phone,
        lineId: "-",
        totalOrders: 1,
        lastOrderId: subId,
        reportName: getDisplayReportName(subId),
        lastOrderDate: fmtDate(new Date(sub.createdAt)),
        status: "pending",
        setCount: 1,
      });
    }

    // Convert to array and sort by date desc
    const allCustomers = Array.from(localCustomersMap.values()).sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );

    // Apply filters sequentially
    let filtered = allCustomers;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search),
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Filter by date range (parse Thai date format back to compare)
    if (startDate || endDate) {
      // Convert YYYY-MM-DD to Date object for comparison
      filtered = filtered.filter((c) => {
        // Parse Thai date string like "15 ก.ค. 2569"
        const thaiMonths = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
        const parts = c.lastOrderDate.split(" ");
        if (parts.length !== 3) return false;
        const day = parseInt(parts[0], 10);
        const monthIndex = thaiMonths.indexOf(parts[1]);
        const year = parseInt(parts[2], 10) - 543; // Convert Buddhist year to CE
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
