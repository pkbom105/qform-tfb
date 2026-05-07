import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. รับค่าจากฟอร์ม (ข้อมูลพื้นฐาน)
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const companyName = formData.get("companyName") as string;
    const phone = formData.get("phone") as string;
    const lineId = formData.get("lineId") as string;

    // 2. ข้อมูลสินค้าและไซซ์
    const productType = formData.get("productType") as string;
    const fabricType = formData.get("fabricType") as string;
    const specs = formData.get("specs") as string;
    const sizeDetails = formData.get("sizeDetails") as string; // รับมาเป็น JSON string
    const finalTotal = formData.get("finalTotal") as string;

    // 3. งานตกแต่งและหมายเหตุ
    const printTitle = formData.get("printTitle") as string;
    const printSize = formData.get("printSize") as string;
    const embroideryTitle = formData.get("embroideryTitle") as string;
    const embroiderySize = formData.get("embroiderySize") as string;
    const additionalNeeds = formData.get("additionalNeeds") as string;

    // 4. จัดการเรื่องรูปภาพ (Attachments)
    const files = formData.getAll("files") as File[];
    
    // --- จุดที่แก้ไข: ประกาศตัวแปรอาร์เรย์เพื่อเก็บชื่อไฟล์ก่อนเริ่มลูป ---
    const uploadedFileNames: string[] = []; 

    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // สร้างโฟลเดอร์ถ้ายังไม่มี
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Folder already exists or other error
      }

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // ตั้งชื่อไฟล์ใหม่เพื่อกันชื่อซ้ำ (timestamp + originalName)
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        uploadedFileNames.push(`/uploads/${fileName}`); // เก็บ Path ไว้ลง DB
      }
    }

    // 5. บันทึกลงฐานข้อมูล PostgreSQL ผ่าน Prisma
    const newQuotation = await prisma.quotation.create({
      data: {
        name,
        email,
        companyName,
        phone,
        lineId,
        productType,
        fabricType,
        specs,
        sizeDetails: JSON.parse(sizeDetails), // แปลงกลับเป็น Object ก่อนลง DB
        totalQuantity: parseInt(finalTotal) || 0,
        printTitle,
        printSize,
        embroideryTitle,
        embroiderySize,
        additionalNeeds,
        // เก็บรายชื่อไฟล์เป็น JSON หรือ String แยกกัน (ขึ้นอยู่กับ Schema ของคุณ)
        images: JSON.stringify(uploadedFileNames), 
      },
    });

    return NextResponse.json({ success: true, data: newQuotation });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}