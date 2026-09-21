import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const staffId = searchParams.get("staffId");

    const where: Record<string, unknown> = {};
    if (month) where.month = month;
    if (staffId) where.staffId = staffId;

    const salaries = await db.staffSalary.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { staff: true },
    });

    return NextResponse.json({ ok: true, salaries });
  } catch (error) {
    console.error("Fetch salaries error:", error);
    return NextResponse.json({ error: "Failed to fetch salaries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { staffId, month, basicSalary, allowances, deductions, paymentMethod, notes } = body;

    if (!staffId || !month) {
      return NextResponse.json({ error: "Staff ID and month are required." }, { status: 400 });
    }

    const base = Number(basicSalary) || 0;
    const allow = Number(allowances) || 0;
    const deduct = Number(deductions) || 0;
    const netSalary = base + allow - deduct;

    const salary = await db.staffSalary.upsert({
      where: {
        staffId_month: { staffId, month },
      },
      update: {
        basicSalary: base,
        allowances: allow,
        deductions: deduct,
        netSalary,
        paymentMethod: paymentMethod || null,
        notes: notes || null,
      },
      create: {
        staffId,
        month,
        basicSalary: base,
        allowances: allow,
        deductions: deduct,
        netSalary,
        status: "PENDING",
        paymentMethod: paymentMethod || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ ok: true, salary });
  } catch (error) {
    console.error("Create salary error:", error);
    return NextResponse.json({ error: "Failed to create salary record" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, paidDate, paymentMethod, receiptNumber, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Salary ID and status are required." }, { status: 400 });
    }

    const updated = await db.staffSalary.update({
      where: { id },
      data: {
        status,
        paidDate: status === "PAID" ? (paidDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })) : null,
        paymentMethod: paymentMethod || (status === "PAID" ? "CASH" : null),
        receiptNumber: receiptNumber || (status === "PAID" ? `SAL-REC-${Date.now().toString(36).toUpperCase()}` : null),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ ok: true, salary: updated });
  } catch (error) {
    console.error("Update salary error:", error);
    return NextResponse.json({ error: "Failed to update salary status" }, { status: 500 });
  }
}
