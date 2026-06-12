import { NextResponse } from "next/server";
import { onlineDb } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Fetch from PostgreSQL (VPN) - Wso table
    let records = await onlineDb.wso.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Also fetch from Submission table
    const submissions = await onlineDb.submission.findMany({
      orderBy: { createdAt: "desc" },
    });

    const fmtDate = (d: Date) => {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const day = String(d.getDate()).padStart(2, "0");
      return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
    };

    const fmtReportName = (orderId: number) => {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const yymm = `${year}${month}`;
      return `${yymm}-${String(orderId).padStart(4, "0")}`;
    };

    // Merge submission data as customers
    const submissionCustomers = submissions.map((sub) => ({
      id: 10000 + sub.id,
      name: sub.name,
      email: sub.email,
      company: sub.companyName || "-",
      phone: sub.phone,
      lineId: "-",
      totalOrders: 1,
      lastOrderId: 10000 + sub.id,
      reportName: fmtReportName(10000 + sub.id),
      lastOrderDate: fmtDate(new Date(sub.createdAt)),
      status: "active" as const,
    }));

    // Format Wso records
    const wsoCustomers = records.map((wso) => ({
      id: wso.id,
      name: wso.name,
      email: wso.email,
      company: wso.companyName || "-",
      phone: wso.phone,
      lineId: wso.lineId || "-",
      totalOrders: 1,
      lastOrderId: wso.id,
      reportName: fmtReportName(wso.id),
      lastOrderDate: fmtDate(new Date(wso.createdAt)),
      status: "active" as const,
    }));

    // Combine and sort by date desc
    const allCustomers = [...wsoCustomers, ...submissionCustomers].sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );

    // Filter by search term if provided
    const filtered = search
      ? allCustomers.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search),
        )
      : allCustomers;

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
