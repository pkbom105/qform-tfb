// src/app/api/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { localDb } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { getReportName } from "@/lib/reportNameGenerator";

// บอก Next.js ว่าห้ามทำ Static Prefetch สำหรับไฟล์นี้
export const dynamic = "force-dynamic";

/**
 * Parse decorationTabs JSON from FormData.
 * Returns parsed array or empty array.
 */
function parseDecorationTabs(formData: FormData): any[] {
  try {
    const raw = String(formData.get("decorationTabs") || "[]");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("[submit] Received form submission");
    console.log("[submit] form keys:", Array.from(formData.keys()));

    // 1. Parse all decoration tabs/sets from the submitted JSON
    const decorationTabs = parseDecorationTabs(formData);

    // 2. Use first tab data for main order fields (backward compatible)
    const firstTab = decorationTabs[0] || {};

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "no-reply@example.com");
    const companyName = String(formData.get("companyName") || "Toffy Boutique");
    const phone = String(formData.get("phone") || "");
    const lineId = String(formData.get("lineId") || "");

    const productType = firstTab.productType || String(formData.get("productType") || "ไม่ระบุ");
    const fabricType = firstTab.fabricType || String(formData.get("fabricType") || "ไม่ระบุ");
    const specs = firstTab.specs || String(formData.get("specs") || "");
    const sizeDetails = firstTab.sizeData ? JSON.stringify(firstTab.sizeData) : String(formData.get("sizeDetails") || "{}");
    const finalTotal = firstTab.manualTotal || firstTab.totalQuantity || String(formData.get("finalTotal") || "0");

    const printTitle = firstTab.printTitle || "";
    const printSize = firstTab.printSize || "";
    const embroideryTitle = firstTab.embroideryTitle || "";
    const embroiderySize = firstTab.embroiderySize || "";
    const additionalNeeds = firstTab.additionalNeeds || String(formData.get("additionalNeeds") || "");

    // 2. ไฟล์แนบ — บันทึกไปยังโฟลเดอร์บนเซิร์ฟเวอร์
    // Images separated by set: uploadedUrls["set-1"] = [...], uploadedUrls["set-2"] = [...]
    const uploadedUrlsBySet: Record<string, string[]> = {};
    const allUploadedUrls: string[] = [];
    const HOST_UPLOAD_ROOT = "/home/qform/uploads";
    const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.mkdir(publicUploadsDir, { recursive: true });
    } catch (err) {
      console.error("Could not ensure public uploads dir:", err);
    }

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("files-")) continue;
      // Extract set ID from key: "files-set-1" -> "set-1", "files-set-2" -> "set-2"
      const setKey = key.slice("files-".length);
      if (!uploadedUrlsBySet[setKey]) uploadedUrlsBySet[setKey] = [];
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
          uploadedUrlsBySet[setKey].push(`/uploads/${filename}`);
          allUploadedUrls.push(`/uploads/${filename}`);
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
    console.log("[submit] uploaded urls:", allUploadedUrls);

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

    // Store all decoration tabs as JSON (sets 1-5) with per-set images
    const decorationSets = decorationTabs.map((tab: any, idx: number) => {
      const setKey = `set-${idx + 1}`;
      return {
        setNumber: idx + 1,
        productType: tab.productType || "",
        fabricType: tab.fabricType || "",
        specs: tab.specs || "",
        sizeData: tab.sizeData || {},
        totalQuantity: tab.totalQuantity || 0,
        manualTotal: tab.manualTotal || "",
        printTitle: tab.printTitle || "",
        printSize: tab.printSize || "",
        printPos2Title: tab.printPos2Title || "",
        printPos2Size: tab.printPos2Size || "",
        printPos3Title: tab.printPos3Title || "",
        printPos3Size: tab.printPos3Size || "",
        printPos4Title: tab.printPos4Title || "",
        printPos4Size: tab.printPos4Size || "",
        embroideryTitle: tab.embroideryTitle || "",
        embroiderySize: tab.embroiderySize || "",
        embroideryPos2Title: tab.embroideryPos2Title || "",
        embroideryPos2Size: tab.embroideryPos2Size || "",
        embroideryPos3Title: tab.embroideryPos3Title || "",
        embroideryPos3Size: tab.embroideryPos3Size || "",
        embroideryPos4Title: tab.embroideryPos4Title || "",
        embroideryPos4Size: tab.embroideryPos4Size || "",
        additionalNeeds: tab.additionalNeeds || "",
        images: uploadedUrlsBySet[setKey] || [],
      };
    });

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
        images: JSON.stringify(allUploadedUrls),
        decorationSets: JSON.stringify(decorationSets),
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
          images: allUploadedUrls,
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
        urls: allUploadedUrls,
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