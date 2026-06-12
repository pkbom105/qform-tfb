import { localDb } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/settings - Fetch all settings as key-value map
export async function GET() {
  try {
    const settings = await localDb.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return NextResponse.json({ success: true, data: map });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Upsert settings (body: { key: string, value: string })
export async function PUT(request: Request) {
  try {
    const { key, value } = await request.json();
    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing key or value" },
        { status: 400 }
      );
    }

    await localDb.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save setting" },
      { status: 500 }
    );
  }
}