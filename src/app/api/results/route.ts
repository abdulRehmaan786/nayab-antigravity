import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import { calculateGrade, calculateSubjectGrade } from "@/lib/grading";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    const studentId = searchParams.get("studentId");
    const examTerm = searchParams.get("examTerm");

    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;
    if (examTerm) where.examTerm = examTerm;
    if (className && className !== "all") {
      where.student = { className };
    }

    const results = await db.examResult.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
      },
    });

    const parsedResults = results.map((r) => {
      let subjectMarks = [];
      try {
        subjectMarks = JSON.parse(r.subjectMarks);
      } catch {
        subjectMarks = [];
      }
      return {
        ...r,
        subjectMarks,
      };
    });

    return NextResponse.json({ ok: true, results: parsedResults });
  } catch (error) {
    console.error("Fetch results error:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, examTerm, academicYear, subjects, remarks, targetSubject } = body;

    if (!studentId || !examTerm || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        { error: "Student, Exam Term, and at least one subject with marks are required." },
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await db.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    // Check teacher permission for this subject
    if (session.role === "TEACHER" && targetSubject) {
      const isAllowed = session.assignedSubjects?.some(
        (as) =>
          as.className.toLowerCase() === student.className.toLowerCase() &&
          (as.subject.toLowerCase() === targetSubject.toLowerCase() || as.subject.toLowerCase() === "all subjects")
      );

      if (!isAllowed) {
        return NextResponse.json(
          {
            error: `Access denied. You are not assigned to grade "${targetSubject}" for ${student.className}.`,
          },
          { status: 403 }
        );
      }
    }

    // Process incoming subject marks
    const processedIncoming = subjects.map((sub: { subject: string; maxMarks: number; obtainedMarks: number; remarks?: string }) => {
      const max = Number(sub.maxMarks) || 100;
      const obtained = Number(sub.obtainedMarks) || 0;
      const grade = calculateSubjectGrade(obtained, max);
      return {
        subject: sub.subject,
        maxMarks: max,
        obtainedMarks: obtained,
        grade,
        remarks: sub.remarks || "",
      };
    });

    // Check if result already exists for this student and exam term
    const existing = await db.examResult.findFirst({
      where: {
        studentId,
        examTerm,
      },
    });

    let mergedSubjects: Array<{ subject: string; maxMarks: number; obtainedMarks: number; grade: string; remarks: string }> = [];

    if (existing) {
      try {
        mergedSubjects = JSON.parse(existing.subjectMarks);
      } catch {
        mergedSubjects = [];
      }

      // Merge incoming subject marks into existing, replacing only the subjects being submitted
      for (const inc of processedIncoming) {
        const existingIdx = mergedSubjects.findIndex(
          (m) => m.subject.toLowerCase() === inc.subject.toLowerCase()
        );
        if (existingIdx >= 0) {
          mergedSubjects[existingIdx] = inc;
        } else {
          mergedSubjects.push(inc);
        }
      }
    } else {
      mergedSubjects = processedIncoming;
    }

    // Compute grand total, percentage, overall grade, and pass/fail across all merged subjects
    const totalMarks = mergedSubjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const obtainedMarks = mergedSubjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
    const percentage = totalMarks > 0 ? Number(((obtainedMarks / totalMarks) * 100).toFixed(1)) : 0;

    const { grade: overallGrade, isPass } = calculateGrade(percentage);
    const status = isPass ? "PASS" : "FAIL";

    let savedResult;
    if (existing) {
      savedResult = await db.examResult.update({
        where: { id: existing.id },
        data: {
          academicYear: academicYear || existing.academicYear || "2024-2025",
          subjectMarks: JSON.stringify(mergedSubjects),
          totalMarks,
          obtainedMarks,
          percentage,
          overallGrade,
          status,
          remarks: remarks ?? existing.remarks,
          publishedAt: new Date(),
        },
      });
    } else {
      savedResult = await db.examResult.create({
        data: {
          studentId,
          examTerm,
          academicYear: academicYear || "2024-2025",
          subjectMarks: JSON.stringify(mergedSubjects),
          totalMarks,
          obtainedMarks,
          percentage,
          overallGrade,
          status,
          remarks: remarks || "Result verified by subject teacher.",
        },
      });
    }

    return NextResponse.json({
      ok: true,
      result: {
        ...savedResult,
        subjectMarks: mergedSubjects,
      },
      updatedSubject: targetSubject || null,
    });
  } catch (error) {
    console.error("Save result error:", error);
    return NextResponse.json({ error: "Failed to save examination result" }, { status: 500 });
  }
}
