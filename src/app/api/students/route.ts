import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    const query = searchParams.get("q")?.toLowerCase();

    const where: Record<string, unknown> = {};
    if (className && className !== "all") {
      where.className = className;
    }
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { rollNumber: { contains: query } },
        { grNumber: { contains: query } },
        { fatherName: { contains: query } },
      ];
    }

    const students = await db.student.findMany({
      where,
      orderBy: [{ className: "asc" }, { rollNumber: "asc" }],
      include: {
        results: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        fees: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ ok: true, students });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { rollNumber, grNumber, name, fatherName, className, section, gender, phone, dateOfBirth, address } = body;

    if (!rollNumber || !name || !fatherName || !className) {
      return NextResponse.json(
        { error: "Roll Number, Name, Father Name, and Class are required." },
        { status: 400 }
      );
    }

    const existing = await db.student.findFirst({
      where: { className, rollNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A student with Roll Number ${rollNumber} already exists in ${className}.` },
        { status: 409 }
      );
    }

    const student = await db.student.create({
      data: {
        rollNumber: String(rollNumber).trim(),
        grNumber: grNumber ? String(grNumber).trim() : null,
        name: name.trim(),
        fatherName: fatherName.trim(),
        className: className.trim(),
        section: section ? section.trim() : "A",
        gender: gender || "Male",
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        address: address || null,
      },
    });

    return NextResponse.json({ ok: true, student });
  } catch (error) {
    console.error("Create student error:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, rollNumber, grNumber, name, fatherName, className, section, gender, phone, dateOfBirth, address } = body;

    if (!id) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const updated = await db.student.update({
      where: { id },
      data: {
        rollNumber: String(rollNumber).trim(),
        grNumber: grNumber ? String(grNumber).trim() : null,
        name: name.trim(),
        fatherName: fatherName.trim(),
        className: className.trim(),
        section: section ? section.trim() : "A",
        gender: gender || "Male",
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        address: address || null,
      },
    });

    return NextResponse.json({ ok: true, student: updated });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
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
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    await db.student.delete({ where: { id } });
    return NextResponse.json({ ok: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
