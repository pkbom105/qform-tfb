// src/app/api/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { localDb } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { getReportName } from "@/lib/reportNameGenerator";

// บอก Next.js ว่าห้ามทำ Static Prefetch สำหรับไฟล์นี้
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("[submit] Received form submission");
    console.log("[submit] form keys:", Array.from(formData.keys()));

    // 1. รับค่าจากฟอร์ม
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "no-reply@example.com");
    const companyName = String(formData.get("companyName") || "Toffy Boutique");
    const phone = String(formData.get("phone") || "");
    const lineId = String(formData.get("lineId") || "");

    const productType = String(formData.get("productType") || "ไม่ระบุ");
    const fabricType = String(formData.get("fabricType") || "ไม่ระบุ");
    const specs = String(formData.get("specs") || "");
    const sizeDetails = String(formData.get("sizeDetails") || "{}");
    const finalTotal = String(formData.get("finalTotal") || "0");

    const printTitle = String(formData.get("printTitle") || "");
    const printSize = String(formData.get("printSize") || "");
    const embroideryTitle = String(formData.get("embroideryTitle") || "");
    const embroiderySize = String(formData.get("embroiderySize") || "");
    const additionalNeeds = String(formData.get("additionalNeeds") || "");

    // 2. ไฟล์แนบ — บันทึกไปยังโฟลเดอร์บนเซิร์ฟเวอร์
    const uploadedUrls: string[] = [];
    const HOST_UPLOAD_ROOT = "/home/qform/uploads";
    const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.mkdir(publicUploadsDir, { recursive: true });
    } catch (err) {
      console.error("Could not ensure public uploads dir:", err);
    }

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("files-")) continue;
      try {
        // @ts-ignore - file from FormData
        const file: any = value;
        if (typeof file.arrayBuffer !== "function") continue;
        const buf = Buffer.from(await file.arrayBuffer());
        const originalName = file.name || "file";
        const safeName = originalName.replace(/[^a-z0-9.\-_]/gi, "_");
        const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const filename = `${unique}-${safeName}`;
        const publicPath = path.join(publicUploadsDir, filename);
        try {
          await fs.writeFile(publicPath, buf);
          uploadedUrls.push(`/uploads/${filename}`);
        } catch (err) {
          console.error("Error writing to public/uploads:", err);
        }

        try {
          const stat = await fs.stat(HOST_UPLOAD_ROOT).catch(() => null);
          if (stat && stat.isDirectory()) {
            const hostPath = path.join(HOST_UPLOAD_ROOT, filename);
            await fs.copyFile(publicPath, hostPath);
          }
        } catch (err) {
          console.error("Could not copy to host /home/qform/uploads:", err);
        }
      } catch (err) {
        console.error("Error saving uploaded file:", err);
      }
    }

    // 3. บันทึกลง Local Database (SQLite)
    console.log("[submit] uploaded urls:", uploadedUrls);

    // Find or create customer
    let customer = await localDb.customer.findFirst({
      where: { email: email || "" },
    });
    if (!customer) {
      customer = await localDb.customer.create({
        data: {
          name: name || "ไม่ระบุ",
          email: email || "no-reply@example.com",
          companyName: companyName || null,
          phone: phone || "",
          lineId: lineId || null,
        },
      });
    } else {
      // Update existing customer stats
      customer = await localDb.customer.update({
        where: { id: customer.id },
        data: {
          totalOrders: { increment: 1 },
          name: name || customer.name,
          phone: phone || customer.phone,
        },
      });
    }

    // Save to local SQLite database
    const newOrder = await localDb.order.create({
      data: {
        customerId: customer.id,
        productType,
        fabricType,
        specs: specs || "",
        sizeData: sizeDetails || "{}",
        totalQuantity: parseInt(finalTotal) || 0,
        printTitle: printTitle || "",
        printSize: printSize || "",
        embroideryTitle: embroideryTitle || "",
        embroiderySize: embroiderySize || "",
        additionalNeeds: additionalNeeds || "",
        images: JSON.stringify(uploadedUrls),
        status: "pending",
      },
    });

    // 4. Sync to Online PostgreSQL (backup)
    try {
      const { onlineDb } = await import("@/lib/prisma");
      await onlineDb.wso.create({
        data: {
          name,
          email,
          companyName: companyName || "Toffy Boutique",
          phone,
          lineId,
          productType,
          fabricType,
          specs,
          sizeDetails: JSON.parse(sizeDetails || "{}"),
          totalQuantity: parseInt(finalTotal) || 0,
          printTitle,
          printSize,
          embroideryTitle,
          embroiderySize,
          additionalNeeds,
          images: uploadedUrls,
        },
      });
    } catch (onlineErr) {
      console.warn("[submit] Online sync skipped:", onlineErr);
    }

    // 5. Append uploads index JSON
    try {
      const hostIndexPath = path.join(HOST_UPLOAD_ROOT, "uploads.json");
      const publicIndexPath = path.join(publicUploadsDir, "uploads.json");
      let indexPath = publicIndexPath;
      const hostStat = await fs.stat(HOST_UPLOAD_ROOT).catch(() => null);
      if (hostStat && hostStat.isDirectory()) indexPath = hostIndexPath;

      let indexData: any[] = [];
      try {
        const raw = await fs.readFile(indexPath, "utf8");
        indexData = JSON.parse(raw || "[]");
      } catch (e: any) {
        if (e && e.code !== "ENOENT")
          console.error("Error reading uploads.json:", e);
        indexData = [];
      }
      indexData.push({
        createdAt: new Date().toISOString(),
        name: name || null,
        urls: uploadedUrls,
      });
      try {
        await fs.writeFile(
          indexPath,
          JSON.stringify(indexData, null, 2),
          "utf8",
        );
      } catch (writeErr) {
        console.error("Failed to write uploads index (write):", writeErr);
      }
    } catch (err) {
      console.error("Failed to write uploads index:", err);
    }

    const reportName = getReportName(newOrder.id);
    return NextResponse.json({
      success: true,
      data: {
        id: newOrder.id,
        reportName,
      },
    });
  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}