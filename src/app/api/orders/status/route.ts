import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "processing", "producing", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
