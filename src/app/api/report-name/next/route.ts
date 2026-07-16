import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get the highest order ID from PostgreSQL
    const maxOrder = await prisma.order.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });

    const nextOrderId = (maxOrder?.id || 0) + 1;

    // Generate the report name
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const yymm = `${year}${month}`;
    const OFFSET = 59;
    const runningNumber = String(nextOrderId + OFFSET).padStart(4, "0");
    const reportName = `TFB-OrderForm-${yymm}-${runningNumber}`;

    return NextResponse.json({
      success: true,
      reportName,
      nextOrderId,
    });
  } catch (error: any) {
    console.error("Failed to get next report name:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}