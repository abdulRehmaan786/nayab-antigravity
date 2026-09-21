import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    const status = searchParams.get("status");
    const month = searchParams.get("month");
    const studentId = searchParams.get("studentId");

    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;
    if (status && status !== "ALL") where.status = status;
    if (month && month !== "ALL") where.month = month;
    if (className && className !== "all") {
      where.student = { className };
    }

    const fees = await db.feeRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
      },
    });

    return NextResponse.json({ ok: true, fees });
  } catch (error) {
    console.error("Fetch fees error:", error);
    return NextResponse.json({ error: "Failed to fetch fee records" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, paidDate, receiptNumber, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Fee ID and status are required." }, { status: 400 });
    }

    const updated = await db.feeRecord.update({
      where: { id },
      data: {
        status,
        paidDate: status === "PAID" ? paidDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : null,
        receiptNumber: status === "PAID" ? receiptNumber || `NGS-REC-${Date.now().toString().slice(-6)}` : null,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json({ ok: true, fee: updated });
  } catch (error) {
    console.error("Update fee error:", error);
    return NextResponse.json({ error: "Failed to update fee record" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, month, amount, dueDate, status, notes } = body;

    if (!studentId || !month || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Student ID, Month, Amount, and Due Date are required." },
        { status: 400 }
      );
    }

    const newRecord = await db.feeRecord.create({
      data: {
        studentId,
        month,
        amount: Number(amount),
        dueDate,
        status: status || "PENDING",
        paidDate: status === "PAID" ? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : null,
        receiptNumber: status === "PAID" ? `NGS-REC-${Date.now().toString().slice(-6)}` : null,
        notes: notes || "Monthly School Dues",
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json({ ok: true, fee: newRecord });
  } catch (error) {
    console.error("Create fee error:", error);
    return NextResponse.json({ error: "Failed to create fee record" }, { status: 500 });
  }
}
