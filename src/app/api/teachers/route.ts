import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const teachers = await db.user.findMany({
      where: { role: "TEACHER" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        assignedClasses: true,
        assignedSubjects: true,
        classTeacherOf: true,
        createdAt: true,
      },
    });

    const parsed = teachers.map((t) => {
      let classes: string[] = [];
      let subjects: { className: string; subject: string }[] = [];
      try {
        if (t.assignedClasses) classes = JSON.parse(t.assignedClasses);
      } catch {}
      try {
        if (t.assignedSubjects) subjects = JSON.parse(t.assignedSubjects);
      } catch {}

      return {
        ...t,
        assignedClasses: classes,
        assignedSubjects: subjects,
        classTeacherOf: t.classTeacherOf || null,
      };
    });

    return NextResponse.json({ ok: true, teachers: parsed });
  } catch (error) {
    console.error("Fetch teachers error:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, assignedClasses, assignedSubjects, classTeacherOf } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A staff account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "TEACHER",
        assignedClasses: JSON.stringify(assignedClasses || []),
        assignedSubjects: JSON.stringify(assignedSubjects || []),
        classTeacherOf: classTeacherOf ? String(classTeacherOf).trim() : null,
      },
    });

    return NextResponse.json({
      ok: true,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        assignedClasses: assignedClasses || [],
        assignedSubjects: assignedSubjects || [],
        classTeacherOf: teacher.classTeacherOf || null,
      },
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    return NextResponse.json({ error: "Failed to create teacher account" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, assignedClasses, assignedSubjects, password, classTeacherOf } = body;

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      assignedClasses: JSON.stringify(assignedClasses || []),
      assignedSubjects: JSON.stringify(assignedSubjects || []),
    };

    if (classTeacherOf !== undefined) {
      updateData.classTeacherOf = classTeacherOf ? String(classTeacherOf).trim() : null;
    }

    if (name) updateData.name = name.trim();
    if (password && password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updated = await db.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ok: true,
      teacher: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        assignedClasses: assignedClasses || [],
        assignedSubjects: assignedSubjects || [],
        classTeacherOf: updated.classTeacherOf || null,
      },
    });
  } catch (error) {
    console.error("Update teacher error:", error);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required." }, { status: 400 });
    }

    await db.user.delete({ where: { id } });
    return NextResponse.json({ ok: true, message: "Teacher account removed." });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
