import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month"); // e.g. "2025-09"
    let staffId = searchParams.get("staffId");

    // If teacher, strictly scope to their own staff member profile
    let teacherStaffProfile = null;
    if (session.role === "TEACHER") {
      teacherStaffProfile = await db.staffMember.findFirst({
        where: {
          OR: [
            { userId: session.userId },
            { name: { contains: session.name.split(" ")[1] || session.name } },
          ],
        },
        include: {
          salaries: {
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      });

      if (!teacherStaffProfile) {
        return NextResponse.json({ ok: true, records: [], profile: null });
      }
      staffId = teacherStaffProfile.id;
    } else if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const where: Record<string, unknown> = {};
    if (date) where.date = date;
    if (month) where.date = { startsWith: month };
    if (staffId) where.staffId = staffId;

    const records = await db.staffAttendance.findMany({
      where,
      orderBy: { date: "asc" },
      include: { staff: true },
    });

    return NextResponse.json({
      ok: true,
      records,
      profile: teacherStaffProfile,
    });
  } catch (error) {
    console.error("Fetch staff attendance error:", error);
    return NextResponse.json({ error: "Failed to fetch staff attendance" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { staffId, date, status, checkInTime, remarks } = body;

    if (!staffId || !date || !status) {
      return NextResponse.json({ error: "Staff ID, date, and status are required." }, { status: 400 });
    }

    const record = await db.staffAttendance.upsert({
      where: {
        staffId_date: { staffId, date },
      },
      update: {
        status,
        checkInTime: checkInTime || null,
        remarks: remarks || null,
      },
      create: {
        staffId,
        date,
        status,
        checkInTime: checkInTime || null,
        remarks: remarks || null,
      },
    });

    return NextResponse.json({ ok: true, record });
  } catch (error) {
    console.error("Save staff attendance error:", error);
    return NextResponse.json({ error: "Failed to save staff attendance" }, { status: 500 });
  }
}
