import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT_SET";

  // Mask password but show structure
  const masked = dbUrl.replace(/:[^:@]+@/, ":***@");

  // Check password encoding (show first/last chars only)
  const pwMatch = dbUrl.match(/:([^:@]+)@/);
  const password = pwMatch?.[1] || "";
  const pwInfo = {
    length: password.length,
    hasPercent: password.includes("%"),
    first3: password.slice(0, 3),
    last3: password.slice(-3),
    // Check for common URL encoding issues
    hasDoublePercent: password.includes("%%"),
    hasNewline: password.includes("\n") || password.includes("\\n"),
  };

  // Check username format
  const userMatch = dbUrl.match(/\/\/([^:]+):/);
  const username = userMatch?.[1] || "";

  return NextResponse.json({
    masked_url: masked,
    url_length: dbUrl.length,
    username: username,
    username_length: username.length,
    password_info: pwInfo,
    contains_pooler: dbUrl.includes("pooler.supabase"),
    contains_pgbouncer: dbUrl.includes("pgbouncer"),
    port: dbUrl.match(/:(\d+)\//)?.[1] || "unknown",
    region: dbUrl.match(/aws-0-([^.]+)/)?.[1] || "unknown",
    // Check for any trailing whitespace
    ends_with_whitespace: /\s$/.test(dbUrl),
    last_char_code: dbUrl.charCodeAt(dbUrl.length - 1),
  });
}
