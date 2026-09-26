import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const studentId = searchParams.get("studentId");
    const query = searchParams.get("q")?.toLowerCase();

    // Specific SLC by ID
    if (id) {
      const slc = await db.schoolLeavingCertificate.findUnique({
        where: { id },
        include: {
          student: {
            include: {
              results: { orderBy: { createdAt: "desc" }, take: 1 },
              fees: { orderBy: { createdAt: "desc" }, take: 1 },
            },
          },
        },
      });

      if (!slc) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
      }

      return NextResponse.json({ ok: true, certificate: slc });
    }

    // Specific SLC by studentId
    if (studentId) {
      const slc = await db.schoolLeavingCertificate.findUnique({
        where: { studentId },
        include: { student: true },
      });
      return NextResponse.json({ ok: true, certificate: slc });
    }

    // List all SLCs
    const where: Record<string, unknown> = {};
    if (query) {
      where.OR = [
        { certificateNumber: { contains: query } },
        { studentName: { contains: query } },
        { fatherName: { contains: query } },
        { grNumber: { contains: query } },
        { leavingClass: { contains: query } },
        { leavingReason: { contains: query } },
      ];
    }

    const certificates = await db.schoolLeavingCertificate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            id: true,
            rollNumber: true,
            grNumber: true,
            name: true,
            fatherName: true,
            className: true,
            section: true,
            status: true,
            phone: true,
            dateOfBirth: true,
            address: true,
          },
        },
      },
    });

    // Compute key statistics
    const totalCertificates = await db.schoolLeavingCertificate.count();
    const totalActive = await db.student.count({ where: { status: "ACTIVE" } });
    const totalLeft = await db.student.count({ where: { status: "LEFT" } });
    
    const currentYear = new Date().getFullYear().toString();
    const issuedThisYear = certificates.filter(c => c.issueDate.includes(currentYear)).length;

    // Generate recommended next certificate number e.g. SLC-2025-001
    const nextSeq = totalCertificates + 1;
    const nextCertificateNumber = `SLC-${currentYear}-${String(nextSeq).padStart(3, "0")}`;

    return NextResponse.json({
      ok: true,
      certificates,
      stats: {
        totalCertificates,
        totalActive,
        totalLeft,
        issuedThisYear,
        nextCertificateNumber,
      },
    });
  } catch (error) {
    console.error("Fetch SLC error:", error);
    return NextResponse.json({ error: "Failed to fetch school leaving certificates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      studentId,
      certificateNumber,
      grNumber,
      studentName,
      fatherName,
      casteOrSurname,
      nationality,
      religion,
      dateOfBirth,
      dateOfBirthInWords,
      admissionDate,
      admissionClass,
      leavingDate,
      leavingClass,
      leavingClassInWords,
      subjectsStudied,
      lastExamResult,
      qualifiedForPromotion,
      duesClearedMonth,
      feeConcession,
      totalWorkingDays,
      daysAttended,
      generalConduct,
      leavingReason,
      remarks,
      issueDate,
      preparedBy,
      checkedBy,
      headmasterName,
    } = body;

    if (!studentId || !studentName || !fatherName || !leavingClass || !leavingReason) {
      return NextResponse.json(
        { error: "Student ID, Name, Father Name, Leaving Class, and Leaving Reason are required." },
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: { slc: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Selected student does not exist." }, { status: 404 });
    }

    // Check if student already has an SLC
    if (student.slc) {
      return NextResponse.json(
        {
          error: `This student has already been issued School Leaving Certificate #${student.slc.certificateNumber}.`,
        },
        { status: 409 }
      );
    }

    // Generate certificate number if not provided
    let finalCertNumber = certificateNumber?.trim();
    if (!finalCertNumber) {
      const currentYear = new Date().getFullYear().toString();
      const count = await db.schoolLeavingCertificate.count();
      finalCertNumber = `SLC-${currentYear}-${String(count + 1).padStart(3, "0")}`;
    }

    // Check if certificateNumber is already taken
    const existingCert = await db.schoolLeavingCertificate.findUnique({
      where: { certificateNumber: finalCertNumber },
    });
    if (existingCert) {
      const currentYear = new Date().getFullYear().toString();
      finalCertNumber = `SLC-${currentYear}-${Date.now().toString().slice(-4)}`;
    }

    const todayStr = getTodayDateString();

    // Create SLC and update student status to LEFT in transaction
    const [certificate] = await db.$transaction([
      db.schoolLeavingCertificate.create({
        data: {
          certificateNumber: finalCertNumber,
          studentId,
          grNumber: grNumber || student.grNumber || null,
          studentName: studentName.trim(),
          fatherName: fatherName.trim(),
          casteOrSurname: casteOrSurname ? casteOrSurname.trim() : null,
          nationality: nationality || "Pakistani",
          religion: religion || "Islam",
          dateOfBirth: dateOfBirth || student.dateOfBirth || null,
          dateOfBirthInWords: dateOfBirthInWords || null,
          admissionDate: admissionDate || null,
          admissionClass: admissionClass || "Class 1",
          leavingDate: leavingDate || todayStr,
          leavingClass: leavingClass.trim(),
          leavingClassInWords: leavingClassInWords || null,
          subjectsStudied:
            subjectsStudied ||
            "English, Mathematics, General Science, Urdu, Islamiyat, Sindhi, Computer Science, Pakistan Studies",
          lastExamResult: lastExamResult || "Passed",
          qualifiedForPromotion: qualifiedForPromotion || "Yes, Promoted to next higher class",
          duesClearedMonth: duesClearedMonth || "All School Dues Cleared",
          feeConcession: feeConcession || "None",
          totalWorkingDays: Number(totalWorkingDays) || 210,
          daysAttended: Number(daysAttended) || 198,
          generalConduct: generalConduct || "Good & Moral Character",
          leavingReason: leavingReason.trim(),
          remarks: remarks || "A sincere, obedient and hardworking student. We wish him/her the best of success.",
          issueDate: issueDate || todayStr,
          preparedBy: preparedBy || "Admin Office",
          checkedBy: checkedBy || "Academic Coordinator",
          headmasterName: headmasterName || "Principal / Headmaster",
        },
      }),
      db.student.update({
        where: { id: studentId },
        data: {
          status: "LEFT",
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "School Leaving Certificate issued successfully. Student archived as LEFT.",
      certificate,
    });
  } catch (error) {
    console.error("Create SLC error:", error);
    return NextResponse.json({ error: "Failed to issue school leaving certificate" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: "Certificate ID is required." }, { status: 400 });
    }

    const updated = await db.schoolLeavingCertificate.update({
      where: { id },
      data: {
        ...updateFields,
        totalWorkingDays: updateFields.totalWorkingDays ? Number(updateFields.totalWorkingDays) : undefined,
        daysAttended: updateFields.daysAttended ? Number(updateFields.daysAttended) : undefined,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Certificate updated successfully.",
      certificate: updated,
    });
  } catch (error) {
    console.error("Update SLC error:", error);
    return NextResponse.json({ error: "Failed to update school leaving certificate" }, { status: 500 });
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
      return NextResponse.json({ error: "Certificate ID is required." }, { status: 400 });
    }

    const cert = await db.schoolLeavingCertificate.findUnique({
      where: { id },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    // In transaction: Delete certificate and restore student status to ACTIVE
    await db.$transaction([
      db.schoolLeavingCertificate.delete({
        where: { id },
      }),
      db.student.update({
        where: { id: cert.studentId },
        data: {
          status: "ACTIVE",
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Certificate cancelled successfully. Student record restored to ACTIVE status.",
    });
  } catch (error) {
    console.error("Cancel SLC error:", error);
    return NextResponse.json({ error: "Failed to cancel certificate" }, { status: 500 });
  }
}
