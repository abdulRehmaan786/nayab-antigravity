import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className")?.trim();
    const rollNumber = searchParams.get("rollNumber")?.trim();

    if (!className || !rollNumber) {
      return NextResponse.json(
        { error: "Please provide both Class and Roll Number" },
        { status: 400 }
      );
    }

    const classVariants = [className];
    if (className.toLowerCase() === "class 1" || className.toLowerCase() === "class 1st" || className.toLowerCase() === "1st") {
      classVariants.push("Class 1", "Class 1st", "1st");
    }

    const rollVariants = [rollNumber];
    const unpadded = rollNumber.replace(/^0+/, "");
    if (unpadded && !rollVariants.includes(unpadded)) {
      rollVariants.push(unpadded);
    }
    if (unpadded.length === 1) {
      rollVariants.push(`0${unpadded}`);
    }

    const student = await db.student.findFirst({
      where: {
        OR: [
          {
            className: { in: classVariants },
            rollNumber: { in: rollVariants },
          },
          {
            className: { in: classVariants },
            grNumber: rollNumber,
          },
          {
            grNumber: rollNumber,
          },
          {
            grNumber: `GR-${rollNumber}`,
          },
        ],
      },
      include: {
        results: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        fees: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        attendances: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          error: `No student record found for ${className} with Roll / G.R. Number "${rollNumber}". Please verify your roll number or contact the school office.`,
        },
        { status: 404 }
      );
    }

    // Parse subjectMarks JSON string
    let latestResult = null;
    if (student.results && student.results.length > 0) {
      const rawResult = student.results[0];
      let parsedMarks = [];
      try {
        parsedMarks = JSON.parse(rawResult.subjectMarks);
      } catch {
        parsedMarks = [];
      }
      latestResult = {
        ...rawResult,
        subjectMarks: parsedMarks,
      };
    }

    // Calculate Biometric Attendance Summary
    const attendances = student.attendances || [];
    const totalDays = attendances.length;
    const presentDays = attendances.filter((a) => a.status === "PRESENT").length;
    const lateDays = attendances.filter((a) => a.status === "LATE").length;
    const absentDays = attendances.filter((a) => a.status === "ABSENT").length;
    const leaveDays = attendances.filter((a) => a.status === "LEAVE").length;
    const percentage =
      totalDays > 0 ? Number((((presentDays + lateDays) / totalDays) * 100).toFixed(1)) : 100;

    const latestPunch = attendances[0] || null;

    const attendanceSummary = {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      leaveDays,
      percentage,
      todayStatus: latestPunch
        ? {
            status: latestPunch.status,
            checkInTime: latestPunch.checkInTime,
            deviceId: latestPunch.deviceId,
            deviceType: latestPunch.deviceType,
            date: latestPunch.date,
          }
        : { status: "NOT_RECORDED" },
    };

    // Also get active announcements
    const recentAnnouncements = await db.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 3,
    });

    return NextResponse.json({
      ok: true,
      student: {
        id: student.id,
        rollNumber: student.rollNumber,
        grNumber: student.grNumber,
        name: student.name,
        fatherName: student.fatherName,
        className: student.className,
        section: student.section,
        gender: student.gender,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        address: student.address,
      },
      latestResult,
      fees: student.fees,
      attendanceSummary,
      recentAnnouncements,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error while searching record" },
      { status: 500 }
    );
  }
}
