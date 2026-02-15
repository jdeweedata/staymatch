import { NextResponse } from "next/server";
import prisma from "@/lib/db";

interface TableCheck {
  name: string;
  exists: boolean;
  error?: string;
}

function analyzeConnectionUrl(url: string) {
  const masked = url.replace(/:[^:@]+@/, ":***@");
  return {
    masked,
    length: url.length,
    usesPooler: url.includes("pooler.supabase"),
    port: url.match(/:(\d+)\//)?.[1] || "unknown",
    hasPgbouncer: url.includes("pgbouncer=true"),
    endsWithWhitespace: /\s$/.test(url),
    hasNewline: url.includes("\n") || url.includes("\r"),
  };
}

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const checks: {
    connected: boolean;
    connectionError?: string;
    connectionUrl?: ReturnType<typeof analyzeConnectionUrl>;
    tables: TableCheck[];
    extensions: { name: string; installed: boolean }[];
    env: {
      databaseUrlSet: boolean;
      directUrlSet: boolean;
      jwtSecretSet: boolean;
    };
  } = {
    connected: false,
    connectionUrl: dbUrl ? analyzeConnectionUrl(dbUrl) : undefined,
    tables: [],
    extensions: [],
    env: {
      databaseUrlSet: !!dbUrl,
      directUrlSet: !!process.env.DIRECT_URL,
      jwtSecretSet: !!process.env.JWT_SECRET,
    },
  };

  if (!dbUrl) {
    return NextResponse.json(
      {
        status: "error",
        message: "DATABASE_URL is not set",
        checks,
        fix: "Set DATABASE_URL in your environment variables (Vercel dashboard or .env file).",
      },
      { status: 503 }
    );
  }

  // Test database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.connected = true;
  } catch (error) {
    checks.connected = false;
    checks.connectionError =
      error instanceof Error ? error.message : "Unknown connection error";
    return NextResponse.json(
      {
        status: "error",
        message: "Cannot connect to database",
        checks,
        fix: "Verify DATABASE_URL is correct. For Supabase, use the pooler URL (port 6543) with ?pgbouncer=true for serverless.",
      },
      { status: 503 }
    );
  }

  // Check required tables by attempting a lightweight query on each
  const tableQueries: [string, Promise<unknown>][] = [
    ["User", prisma.user.findFirst({ select: { id: true } })],
    ["Session", prisma.session.findFirst({ select: { id: true } })],
  ];

  for (const [name, query] of tableQueries) {
    try {
      await query;
      checks.tables.push({ name, exists: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Check failed";
      const tableNotFound = msg.includes("does not exist") || msg.includes("P2021");
      checks.tables.push({
        name,
        exists: !tableNotFound,
        error: msg,
      });
    }
  }

  // Check extensions
  const requiredExtensions = ["uuid-ossp", "vector"];
  for (const ext of requiredExtensions) {
    try {
      const result = await prisma.$queryRawUnsafe<{ count: number }[]>(
        `SELECT COUNT(*)::int as count FROM pg_extension WHERE extname = $1`,
        ext
      );
      checks.extensions.push({
        name: ext,
        installed: (result[0]?.count ?? 0) > 0,
      });
    } catch {
      checks.extensions.push({ name: ext, installed: false });
    }
  }

  const missingTables = checks.tables.filter((t) => !t.exists);
  const missingExtensions = checks.extensions.filter((e) => !e.installed);
  const allHealthy =
    missingTables.length === 0 && missingExtensions.length === 0;

  return NextResponse.json({
    status: allHealthy ? "healthy" : "degraded",
    message: allHealthy
      ? "Database is healthy — auth tables exist"
      : `Issues: ${missingTables.length} missing tables, ${missingExtensions.length} missing extensions`,
    checks,
    ...(missingTables.length > 0 && {
      fix: "Run `npx prisma db push` with DIRECT_URL set to your Supabase direct connection (port 5432).",
    }),
    ...(missingExtensions.length > 0 && {
      extensionFix:
        "Enable missing extensions in Supabase dashboard: Database > Extensions. Enable 'uuid-ossp' and 'vector'.",
    }),
  });
}
