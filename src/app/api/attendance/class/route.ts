import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || getTodayString();
    let className = searchParams.get("className");

    // If teacher doesn't specify class, use their designated classTeacherOf
    if (!className && session.role === "TEACHER" && session.classTeacherOf) {
      className = session.classTeacherOf;
    }

    if (!className) {
      return NextResponse.json(
        { error: "Class name is required or you are not assigned as a Class Teacher." },
        { status: 400 }
      );
    }

    // If session is a TEACHER, verify they are either the class teacher or admin
    if (session.role === "TEACHER" && session.classTeacherOf !== className) {
      return NextResponse.json(
        {
          error: `Permission denied. You are designated as Class Teacher for ${session.classTeacherOf || "None"}, not ${className}.`,
        },
        { status: 403 }
      );
    }

    // Fetch students of the class with their attendance for this date
    const students = await db.student.findMany({
      where: { className },
      orderBy: { rollNumber: "asc" },
      include: {
        attendances: {
          where: { date },
        },
      },
    });

    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let notMarkedCount = 0;

    const list = students.map((s) => {
      const att = s.attendances[0] || null;
      const status = att ? att.status : "NOT_MARKED";

      if (status === "PRESENT") presentCount++;
      else if (status === "LATE") lateCount++;
      else if (status === "ABSENT") absentCount++;
      else if (status === "LEAVE") leaveCount++;
      else notMarkedCount++;

      return {
        studentId: s.id,
        rollNumber: s.rollNumber,
        grNumber: s.grNumber || null,
        name: s.name,
        fatherName: s.fatherName,
        className: s.className,
        section: s.section,
        gender: s.gender,
        attendanceId: att?.id || null,
        status,
        checkInTime: att?.checkInTime || null,
        remarks: att?.remarks || null,
      };
    });

    const totalStudents = students.length;
    const markedDays = presentCount + lateCount;
    const totalConsidered = presentCount + lateCount + absentCount;
    const attendancePercentage =
      totalConsidered > 0
        ? Number(((markedDays / totalConsidered) * 100).toFixed(1))
        : 100;

    return NextResponse.json({
      ok: true,
      className,
      date,
      totalStudents,
      summary: {
        totalStudents,
        presentCount,
        lateCount,
        absentCount,
        leaveCount,
        notMarkedCount,
        attendancePercentage,
      },
      students: list,
    });
  } catch (error) {
    console.error("Fetch class attendance error:", error);
    return NextResponse.json(
      { error: "Failed to fetch class attendance list." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 401 });
    }

    const body = await req.json();
    const { className, date, records } = body;

    if (!className || !date || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "Class name, date, and attendance records list are required." },
        { status: 400 }
      );
    }

    // Verification: if teacher, must be classTeacherOf this class
    if (session.role === "TEACHER" && session.classTeacherOf !== className) {
      return NextResponse.json(
        {
          error: `Permission denied. You can only record attendance for ${session.classTeacherOf || "your designated classroom"}.`,
        },
        { status: 403 }
      );
    }

    // Save/Upsert records in database
    const operations = records.map((r: {
      studentId: string;
      status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE";
      checkInTime?: string | null;
      remarks?: string | null;
    }) => {
      const defaultCheckInTime =
        r.status === "PRESENT" || r.status === "LATE"
          ? (r.checkInTime || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }))
          : null;

      const remarksText = r.remarks?.trim()
        ? r.remarks.trim()
        : `Recorded by Class Teacher (${session.name})`;

      return db.attendanceRecord.upsert({
        where: {
          studentId_date: {
            studentId: r.studentId,
            date,
          },
        },
        update: {
          status: r.status,
          checkInTime: defaultCheckInTime,
          deviceType: "MANUAL",
          deviceId: "CLASS_TEACHER_PORTAL",
          remarks: remarksText,
        },
        create: {
          studentId: r.studentId,
          date,
          status: r.status,
          checkInTime: defaultCheckInTime,
          deviceType: "MANUAL",
          deviceId: "CLASS_TEACHER_PORTAL",
          remarks: remarksText,
        },
      });
    });

    await db.$transaction(operations);

    return NextResponse.json({
      ok: true,
      message: `Successfully saved attendance for ${records.length} students of ${className} on ${date}.`,
      count: records.length,
    });
  } catch (error) {
    console.error("Save class attendance error:", error);
    return NextResponse.json(
      { error: "Failed to save class attendance records." },
      { status: 500 }
    );
  }
}
