import { NextResponse } from "next/server";
import { localDb, onlineDb } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    // Try local SQLite first (for synced data)
    let order = await localDb.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    // If not found in SQLite, try PostgreSQL (VPN) Wso table
    if (!order) {
      const wso = await onlineDb.wso.findUnique({
        where: { id: orderId },
      });

      if (wso) {
        // Parse size details
        let sizeData: Record<string, { qty: string; chest: string }> = {};
        try {
          sizeData = JSON.parse(typeof wso.sizeDetails === 'string' ? wso.sizeDetails : JSON.stringify(wso.sizeDetails));
        } catch {
          sizeData = {};
        }

        // Parse images
        let images: string[] = [];
        try {
          images = JSON.parse(typeof wso.images === 'string' ? wso.images : JSON.stringify(wso.images));
        } catch {
          images = [];
        }

        return NextResponse.json({
          success: true,
          data: {
            customer_profile: {
              name: wso.name || "-",
              email: wso.email || "-",
              company: wso.companyName || "Toffy Boutique",
              contact: wso.phone || "-",
              line_id: wso.lineId || "-",
            },
            product_specification: {
              category: wso.productType || "ยังไม่ได้เลือก",
              material: wso.fabricType || "-",
              details: wso.specs || "-",
              size_breakdown: sizeData,
              total_qty: wso.totalQuantity || 0,
            },
            decoration_details: {
              printing_title: wso.printTitle || "ไม่มี",
              printing_size: wso.printSize || "-",
              printing_pos2_title: "ไม่มี",
              printing_pos2_size: "-",
              printing_pos3_title: "ไม่มี",
              printing_pos3_size: "-",
              printing_pos4_title: "ไม่มี",
              printing_pos4_size: "-",
              embroidery_title: wso.embroideryTitle || "ไม่มี",
              embroidery_size: wso.embroiderySize || "-",
              embroidery_pos2_title: "ไม่มี",
              embroidery_pos2_size: "-",
              embroidery_pos3_title: "ไม่มี",
              embroidery_pos3_size: "-",
              embroidery_pos4_title: "ไม่มี",
              embroidery_pos4_size: "-",
              additional: wso.additionalNeeds || "-",
            },
            design_images: images,
          },
        });
      }

      // Try Submission table as last resort
      const subId = orderId >= 10000 ? orderId - 10000 : null;
      if (subId) {
        const sub = await onlineDb.submission.findUnique({
          where: { id: subId },
        });
        if (sub) {
          return NextResponse.json({
            success: true,
            data: {
              customer_profile: {
                name: sub.name || "-",
                email: sub.email || "-",
                company: sub.companyName || "Toffy Boutique",
                contact: sub.phone || "-",
                line_id: "-",
              },
              product_specification: {
                category: sub.productType || "ยังไม่ได้เลือก",
                material: sub.fabricType || "-",
                details: sub.specs || "-",
                size_breakdown: {},
                total_qty: sub.totalQuantity || 0,
              },
              decoration_details: {
                printing_title: "ไม่มี",
                printing_size: "-",
                printing_pos2_title: "ไม่มี",
                printing_pos2_size: "-",
                printing_pos3_title: "ไม่มี",
                printing_pos3_size: "-",
                printing_pos4_title: "ไม่มี",
                printing_pos4_size: "-",
                embroidery_title: "ไม่มี",
                embroidery_size: "-",
                embroidery_pos2_title: "ไม่มี",
                embroidery_pos2_size: "-",
                embroidery_pos3_title: "ไม่มี",
                embroidery_pos3_size: "-",
                embroidery_pos4_title: "ไม่มี",
                embroidery_pos4_size: "-",
                additional: sub.additionalNeeds || "-",
              },
              design_images: sub.fileUrls || [],
            },
          });
        }
      }

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
        printing_pos5_title: order.printPos5Title || "ไม่มี",
        printing_pos5_size: order.printPos5Size || "-",
        embroidery_title: order.embroideryTitle || "ไม่มี",
        embroidery_size: order.embroiderySize || "-",
        embroidery_pos2_title: order.embroideryPos2Title || "ไม่มี",
        embroidery_pos2_size: order.embroideryPos2Size || "-",
        embroidery_pos3_title: order.embroideryPos3Title || "ไม่มี",
        embroidery_pos3_size: order.embroideryPos3Size || "-",
        embroidery_pos4_title: order.embroideryPos4Title || "ไม่มี",
        embroidery_pos4_size: order.embroideryPos4Size || "-",
        embroidery_pos5_title: order.embroideryPos5Title || "ไม่มี",
        embroidery_pos5_size: order.embroideryPos5Size || "-",
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
