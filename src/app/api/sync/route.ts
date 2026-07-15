import { localDb, onlineDb } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Fetch data from PostgreSQL (VPN)
    const wsoRecords = onlineDb
      ? await onlineDb.wso.findMany({
          orderBy: { createdAt: "desc" },
        })
      : [];
    const submissions = onlineDb
      ? await onlineDb.submission.findMany({
          orderBy: { createdAt: "desc" },
        })
      : [];

    let synced = 0;

    // Sync Wso records to local Customer + Order
    for (const wso of wsoRecords) {
      // Upsert customer
      const customer = await localDb.customer.upsert({
        where: { id: wso.id },
        update: {
          name: wso.name,
          email: wso.email,
          companyName: wso.companyName,
          phone: wso.phone,
          lineId: wso.lineId,
        },
        create: {
          id: wso.id,
          name: wso.name,
          email: wso.email,
          companyName: wso.companyName,
          phone: wso.phone,
          lineId: wso.lineId,
          totalOrders: 1,
        },
      });

      // Upsert order
      await localDb.order.upsert({
        where: { id: wso.id },
        update: {
          customerId: customer.id,
          productType: wso.productType,
          fabricType: wso.fabricType,
          specs: wso.specs,
          sizeData: JSON.stringify(wso.sizeDetails),
          totalQuantity: wso.totalQuantity,
          printTitle: wso.printTitle,
          printSize: wso.printSize,
          printPos2Title: wso.printPos2Title,
          printPos2Size: wso.printPos2Size,
          printPos3Title: wso.printPos3Title,
          printPos3Size: wso.printPos3Size,
          printPos4Title: wso.printPos4Title,
          printPos4Size: wso.printPos4Size,
          printPos5Title: wso.printPos5Title,
          printPos5Size: wso.printPos5Size,
          embroideryTitle: wso.embroideryTitle,
          embroiderySize: wso.embroiderySize,
          embroideryPos2Title: wso.embroideryPos2Title,
          embroideryPos2Size: wso.embroideryPos2Size,
          embroideryPos3Title: wso.embroideryPos3Title,
          embroideryPos3Size: wso.embroideryPos3Size,
          embroideryPos4Title: wso.embroideryPos4Title,
          embroideryPos4Size: wso.embroideryPos4Size,
          embroideryPos5Title: wso.embroideryPos5Title,
          embroideryPos5Size: wso.embroideryPos5Size,
          additionalNeeds: wso.additionalNeeds,
          images: JSON.stringify(wso.images),
          createdAt: wso.createdAt,
        },
        create: {
          id: wso.id,
          customerId: customer.id,
          productType: wso.productType,
          fabricType: wso.fabricType || "",
          specs: wso.specs,
          sizeData: JSON.stringify(wso.sizeDetails),
          totalQuantity: wso.totalQuantity,
          printTitle: wso.printTitle,
          printSize: wso.printSize,
          printPos2Title: wso.printPos2Title,
          printPos2Size: wso.printPos2Size,
          printPos3Title: wso.printPos3Title,
          printPos3Size: wso.printPos3Size,
          printPos4Title: wso.printPos4Title,
          printPos4Size: wso.printPos4Size,
          printPos5Title: wso.printPos5Title,
          printPos5Size: wso.printPos5Size,
          embroideryTitle: wso.embroideryTitle,
          embroiderySize: wso.embroiderySize,
          embroideryPos2Title: wso.embroideryPos2Title,
          embroideryPos2Size: wso.embroideryPos2Size,
          embroideryPos3Title: wso.embroideryPos3Title,
          embroideryPos3Size: wso.embroideryPos3Size,
          embroideryPos4Title: wso.embroideryPos4Title,
          embroideryPos4Size: wso.embroideryPos4Size,
          embroideryPos5Title: wso.embroideryPos5Title,
          embroideryPos5Size: wso.embroideryPos5Size,
          additionalNeeds: wso.additionalNeeds,
          images: JSON.stringify(wso.images),
          createdAt: wso.createdAt,
        },
      });

      synced++;
    }

    // Sync Submissions as customers + orders
    for (const sub of submissions) {
      const baseId = 10000 + sub.id;
      const customer = await localDb.customer.upsert({
        where: { id: baseId },
        update: {
          name: sub.name,
          email: sub.email,
          companyName: sub.companyName,
          phone: sub.phone,
        },
        create: {
          id: baseId,
          name: sub.name,
          email: sub.email,
          companyName: sub.companyName,
          phone: sub.phone,
          totalOrders: 1,
        },
      });

      await localDb.order.upsert({
        where: { id: baseId },
        update: {
          customerId: customer.id,
          productType: sub.productType,
          fabricType: sub.fabricType || "",
          specs: sub.specs,
          additionalNeeds: sub.additionalNeeds,
          createdAt: sub.createdAt,
        },
        create: {
          id: baseId,
          customerId: customer.id,
          productType: sub.productType,
          fabricType: sub.fabricType || "",
          specs: sub.specs,
          additionalNeeds: sub.additionalNeeds,
          totalQuantity: parseInt(sub.totalQuantity || "0") || 0,
          createdAt: sub.createdAt,
        },
      });

      synced++;
    }

    return NextResponse.json({
      success: true,
      message: `ซิงค์ข้อมูลสำเร็จ: ${synced} รายการ`,
      synced,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}