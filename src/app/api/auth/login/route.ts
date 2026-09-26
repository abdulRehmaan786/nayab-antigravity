import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    let assignedClasses: string[] = [];
    try {
      if (user.assignedClasses) {
        assignedClasses = JSON.parse(user.assignedClasses);
      }
    } catch {
      assignedClasses = [];
    }

    let assignedSubjects: any[] = [];
    try {
      if (user.assignedSubjects) {
        assignedSubjects = JSON.parse(user.assignedSubjects);
      }
    } catch {
      assignedSubjects = [];
    }

    const sessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "ADMIN" | "TEACHER",
      assignedClasses,
      assignedSubjects,
      classTeacherOf: user.classTeacherOf || null,
    };

    const token = await createAuthToken(sessionPayload);

    const response = NextResponse.json({
      ok: true,
      user: sessionPayload,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const errMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Internal server error during authentication", details: errMessage },
      { status: 500 }
    );
  }
}
