import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        onboardingComplete: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user.id, user.email);

    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
          error: "Database error during login",
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
      { error: "Failed to login", debug: errorMessage },
      { status: 500 }
    );
  }
}
