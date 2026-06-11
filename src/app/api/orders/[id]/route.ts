import { NextResponse } from "next/server";
import { localDb } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    const order = await localDb.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Parse size data
    let sizeData: Record<string, { qty: string; chest: string }> = {};
    try {
      sizeData = JSON.parse(order.sizeData || "{}");
    } catch {
      sizeData = {};
    }

    // Parse images
    let images: string[] = [];
    try {
      images = JSON.parse(order.images || "[]");
    } catch {
      images = [];
    }

    // Build quotation data in the format A4 report expects
    const quotationData = {
      customer_profile: {
        name: order.customer?.name || "-",
        email: order.customer?.email || "-",
        company: order.customer?.companyName || "Toffy Boutique",
        contact: order.customer?.phone || "-",
        line_id: order.customer?.lineId || "-",
      },
      product_specification: {
        category: order.productType || "ยังไม่ได้เลือก",
        material: order.fabricType || "-",
        details: order.specs || "-",
        size_breakdown: sizeData,
        total_qty: order.manualTotal || order.totalQuantity || 0,
      },
      decoration_details: {
        printing_title: order.printTitle || "ไม่มี",
        printing_size: order.printSize || "-",
        printing_pos2_title: order.printPos2Title || "ไม่มี",
        printing_pos2_size: order.printPos2Size || "-",
        printing_pos3_title: order.printPos3Title || "ไม่มี",
        printing_pos3_size: order.printPos3Size || "-",
        printing_pos4_title: order.printPos4Title || "ไม่มี",
        printing_pos4_size: order.printPos4Size || "-",
        embroidery_title: order.embroideryTitle || "ไม่มี",
        embroidery_size: order.embroiderySize || "-",
        embroidery_pos2_title: order.embroideryPos2Title || "ไม่มี",
        embroidery_pos2_size: order.embroideryPos2Size || "-",
        embroidery_pos3_title: order.embroideryPos3Title || "ไม่มี",
        embroidery_pos3_size: order.embroideryPos3Size || "-",
        embroidery_pos4_title: order.embroideryPos4Title || "ไม่มี",
        embroidery_pos4_size: order.embroideryPos4Size || "-",
        additional: order.additionalNeeds || "-",
      },
      design_images: images,
    };

    return NextResponse.json({
      success: true,
      data: quotationData,
    });
  } catch (error: any) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}