import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        onboardingComplete: true,
      },
    });

    // Create session — non-fatal if it fails so user isn't stuck
    let sessionError: string | null = null;
    try {
      await createSession(user.id, user.email);
    } catch (sessErr) {
      console.error("Session creation failed after registration:", sessErr);
      sessionError =
        sessErr instanceof Error ? sessErr.message : "Session creation failed";
    }

    return NextResponse.json({
      user,
      message: sessionError
        ? "Account created but auto-login failed. Please sign in manually."
        : "Account created successfully",
      ...(sessionError && { sessionError }),
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific Prisma errors for actionable messages
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      if (error.code === "P2021") {
        return NextResponse.json(
          {
            error: "Database tables not found. Run `npx prisma db push` to initialize the database.",
            code: error.code,
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error: "Database error during registration",
          code: error.code,
          debug: error.message,
        },
        { status: 500 }
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        {
          error: "Cannot connect to database. Check DATABASE_URL configuration.",
          code: "P1001",
          debug: error.message,
        },
        { status: 503 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to create account",
        debug: errorMessage,
      },
      { status: 500 }
    );
  }
}
