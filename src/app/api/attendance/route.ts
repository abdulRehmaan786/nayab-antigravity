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

function getCurrentTimeString(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || getTodayString();
    const className = searchParams.get("className");
    const studentId = searchParams.get("studentId");

    // If searching for a specific student's full attendance history
    if (studentId) {
      const records = await db.attendanceRecord.findMany({
        where: { studentId },
        orderBy: { date: "desc" },
        take: 30,
      });

      const totalDays = records.length;
      const presentDays = records.filter((r) => r.status === "PRESENT").length;
      const lateDays = records.filter((r) => r.status === "LATE").length;
      const absentDays = records.filter((r) => r.status === "ABSENT").length;
      const leaveDays = records.filter((r) => r.status === "LEAVE").length;
      const percentage =
        totalDays > 0 ? Number((((presentDays + lateDays) / totalDays) * 100).toFixed(1)) : 100;

      const todayRec = records.find((r) => r.date === date);

      return NextResponse.json({
        ok: true,
        records,
        summary: {
          totalDays,
          presentDays,
          lateDays,
          absentDays,
          leaveDays,
          percentage,
          todayStatus: todayRec
            ? {
                status: todayRec.status,
                checkInTime: todayRec.checkInTime,
                deviceId: todayRec.deviceId,
                deviceType: todayRec.deviceType,
              }
            : { status: "NOT_RECORDED" },
        },
      });
    }

    // Class or school-wide daily register
    const studentWhere: Record<string, unknown> = {};
    if (className && className !== "all" && className !== "All Classes") {
      studentWhere.className = className;
    }

    const students = await db.student.findMany({
      where: studentWhere,
      orderBy: [{ className: "asc" }, { rollNumber: "asc" }],
      include: {
        attendances: {
          where: { date },
        },
      },
    });

    const items = students.map((s) => {
      const att = s.attendances[0] || null;
      return {
        studentId: s.id,
        rollNumber: s.rollNumber,
        name: s.name,
        fatherName: s.fatherName,
        className: s.className,
        section: s.section,
        attendanceId: att?.id || null,
        status: att?.status || "NOT_MARKED",
        checkInTime: att?.checkInTime || null,
        deviceId: att?.deviceId || null,
        deviceType: att?.deviceType || null,
        remarks: att?.remarks || null,
      };
    });

    const totalStudents = items.length;
    const presentCount = items.filter((i) => i.status === "PRESENT").length;
    const lateCount = items.filter((i) => i.status === "LATE").length;
    const absentCount = items.filter((i) => i.status === "ABSENT").length;
    const leaveCount = items.filter((i) => i.status === "LEAVE").length;
    const notMarkedCount = items.filter((i) => i.status === "NOT_MARKED").length;
    const attendancePercentage =
      totalStudents > 0
        ? Number((((presentCount + lateCount) / totalStudents) * 100).toFixed(1))
        : 0;

    return NextResponse.json({
      ok: true,
      date,
      className: className || "All Classes",
      items,
      summary: {
        totalStudents,
        presentCount,
        lateCount,
        absentCount,
        leaveCount,
        notMarkedCount,
        attendancePercentage,
      },
    });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    // Allow simulation / punch by staff or direct device webhook
    const body = await req.json();
    const {
      rollNumber,
      className,
      studentId: directStudentId,
      deviceId = "BIO-GATE-01",
      deviceType = "BIOMETRIC_FINGERPRINT",
      date = getTodayString(),
      customTime,
      forcedStatus,
    } = body;

    let targetStudent = null;
    if (directStudentId) {
      targetStudent = await db.student.findUnique({ where: { id: directStudentId } });
    } else if (rollNumber && className) {
      targetStudent = await db.student.findFirst({
        where: {
          rollNumber: String(rollNumber).trim(),
          className: String(className).trim(),
        },
      });
    }

    if (!targetStudent) {
      return NextResponse.json(
        { error: "Student not found with specified Roll Number and Class." },
        { status: 404 }
      );
    }

    // Determine check-in time
    const checkInTime = customTime || getCurrentTimeString();

    // Determine status (cutoff: 8:15 AM)
    let status = forcedStatus || "PRESENT";
    if (!forcedStatus) {
      // Parse hour and minute from checkInTime
      const match = checkInTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const meridian = match[3]?.toUpperCase();
        if (meridian === "PM" && h !== 12) h += 12;
        if (meridian === "AM" && h === 12) h = 0;

        // Cut-off is 8:15 AM (8 * 60 + 15 = 495 mins)
        const totalMinutes = h * 60 + m;
        if (totalMinutes > 495) {
          status = "LATE";
        } else {
          status = "PRESENT";
        }
      }
    }

    const remarks =
      status === "LATE"
        ? `Late punch at ${checkInTime} via ${deviceId}`
        : `Verified biometric punch at ${checkInTime}`;

    const record = await db.attendanceRecord.upsert({
      where: {
        studentId_date: {
          studentId: targetStudent.id,
          date,
        },
      },
      update: {
        status,
        checkInTime,
        deviceId,
        deviceType,
        remarks,
      },
      create: {
        studentId: targetStudent.id,
        date,
        status,
        checkInTime,
        deviceId,
        deviceType,
        remarks,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `Biometric Punch Verified: ${targetStudent.name} (${targetStudent.className}, Roll ${targetStudent.rollNumber}) marked as ${status}.`,
      student: {
        id: targetStudent.id,
        name: targetStudent.name,
        rollNumber: targetStudent.rollNumber,
        className: targetStudent.className,
        section: targetStudent.section,
      },
      record,
    });
  } catch (error) {
    console.error("Biometric punch error:", error);
    return NextResponse.json({ error: "Failed to process biometric punch" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, date = getTodayString(), status, remarks } = body;

    if (!studentId || !status) {
      return NextResponse.json({ error: "Student ID and status are required." }, { status: 400 });
    }

    const record = await db.attendanceRecord.upsert({
      where: {
        studentId_date: {
          studentId,
          date,
        },
      },
      update: {
        status,
        remarks: remarks || `Manual override by ${session.name}`,
      },
      create: {
        studentId,
        date,
        status,
        checkInTime: status === "PRESENT" ? getCurrentTimeString() : null,
        deviceType: "MANUAL",
        deviceId: "ADMIN-CONSOLE",
        remarks: remarks || `Manual entry by ${session.name}`,
      },
    });

    return NextResponse.json({ ok: true, record });
  } catch (error) {
    console.error("Manual attendance update error:", error);
    return NextResponse.json({ error: "Failed to update attendance record" }, { status: 500 });
  }
}
