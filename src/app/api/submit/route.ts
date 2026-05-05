import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. จัดการอัปโหลดไฟล์
    const files = formData.getAll("files") as File[];
    const fileUrls: string[] = [];

    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(uploadDir, uniqueName), buffer);
        fileUrls.push(`/uploads/${uniqueName}`);
      }
    }

    // 2. บันทึกข้อมูลลงฐานข้อมูล
    const submission = await prisma.submission.create({
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        companyName: (formData.get("companyName") as string) || null,
        phone: formData.get("phone") as string,
        productType: (formData.get("productType") as string) || "ไม่ระบุประเภท",
        fabricType: formData.get("fabricType") as string,
        specs: formData.get("specs") as string,
        sizeDetails: JSON.parse(formData.get("sizeDetails") as string || "{}"),
        totalQuantity: formData.get("totalQuantity") as string,
        printPoints: formData.get("printPoints") as string,
        embroideryPositions: formData.get("embroideryPositions") as string,
        additionalNeeds: formData.get("additionalNeeds") as string,
        fileUrls: fileUrls,
      },
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}