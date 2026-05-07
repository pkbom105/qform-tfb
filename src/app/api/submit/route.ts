// src/app/api/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// บอก Next.js ว่าห้ามทำ Static Prefetch สำหรับไฟล์นี้
export const dynamic = 'force-dynamic'; 

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. รับค่าจากฟอร์ม
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const companyName = formData.get("companyName") as string;
    const phone = formData.get("phone") as string;
    const lineId = formData.get("lineId") as string;

    const productType = formData.get("productType") as string;
    const fabricType = formData.get("fabricType") as string;
    const specs = formData.get("specs") as string;
    const sizeDetails = formData.get("sizeDetails") as string;
    const finalTotal = formData.get("finalTotal") as string;

    const printTitle = formData.get("printTitle") as string;
    const printSize = formData.get("printSize") as string;
    const embroideryTitle = formData.get("embroideryTitle") as string;
    const embroiderySize = formData.get("embroiderySize") as string;
    const additionalNeeds = formData.get("additionalNeeds") as string;

    // 2. จัดการไฟล์แนบ (คืนค่าตัวแปรที่หายไป)
    const files = formData.getAll("files") as File[];
    const uploadedFileNames: string[] = []; 

    if (files && files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) { /* folder exists */ }

      for (const file of files) {
        if (file.name === 'undefined' || file.size === 0) continue;
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        uploadedFileNames.push(`/uploads/${fileName}`);
      }
    }

    // 3. บันทึกลง Database
    const newQuotation = await prisma.quotation.create({
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
        images: uploadedFileNames, // ต้องมั่นใจว่ารัน npx prisma generate แล้ว
      },
    });

    return NextResponse.json({ success: true, data: newQuotation });

  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}