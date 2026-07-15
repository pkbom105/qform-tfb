import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const client = new Client({ connectionString: process.env.ONLINE_DATABASE_URL });

  try {
    await client.connect();

    const tablesResult = await client.query<{ tablename: string }>(
      `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename`
    );

    const tableInfo = [] as Array<{ name: string; records: number }>;

    for (const row of tablesResult.rows) {
      const countResult = await client.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM "${row.tablename}"`
      );
      tableInfo.push({
        name: row.tablename,
        records: Number(countResult.rows[0]?.count || 0),
      });
    }

    return NextResponse.json({ success: true, tables: tableInfo });
  } catch (error: any) {
    console.error("Failed to fetch PostgreSQL tables:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await client.end().catch(() => undefined);
  }
}