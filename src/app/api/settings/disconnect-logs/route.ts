import { NextResponse } from "next/server";
import { readDisconnectLogs } from "@/lib/disconnectLogger";

export async function GET() {
  try {
    const logs = readDisconnectLogs(50);
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Failed to read disconnect logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read disconnect logs" },
      { status: 500 }
    );
  }
}