import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT_SET";

  // Mask password for security
  const masked = dbUrl.replace(/:[^:@]+@/, ":***@");

  return NextResponse.json({
    masked_url: masked,
    length: dbUrl.length,
    contains_pooler: dbUrl.includes("pooler.supabase"),
    contains_pgbouncer: dbUrl.includes("pgbouncer"),
    port: dbUrl.match(/:(\d+)\//)?.[1] || "unknown",
    region: dbUrl.match(/aws-0-([^.]+)/)?.[1] || "unknown",
  });
}
