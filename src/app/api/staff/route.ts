import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const staff = await db.staffMember.findMany({
      orderBy: { name: "asc" },
      include: {
        attendances: {
          orderBy: { date: "desc" },
          take: 5,
        },
        salaries: {
          orderBy: { month: "desc" },
          take: 2,
        },
      },
    });

    return NextResponse.json({ ok: true, staff });
  } catch (error) {
    console.error("Fetch staff error:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, role, designation, phone, cnic, monthlySalary } = body;

    if (!name || !role || !designation) {
      return NextResponse.json({ error: "Name, role, and designation are required." }, { status: 400 });
    }

    const staff = await db.staffMember.create({
      data: {
        name: name.trim(),
        role,
        designation: designation.trim(),
        phone: phone || null,
        cnic: cnic || null,
        monthlySalary: Number(monthlySalary) || 15000,
      },
    });

    return NextResponse.json({ ok: true, staff });
  } catch (error) {
    console.error("Create staff error:", error);
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, role, designation, phone, cnic, monthlySalary, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required." }, { status: 400 });
    }

    const updated = await db.staffMember.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(role && { role }),
        ...(designation && { designation: designation.trim() }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(cnic !== undefined && { cnic: cnic || null }),
        ...(monthlySalary !== undefined && { monthlySalary: Number(monthlySalary) }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ ok: true, staff: updated });
  } catch (error) {
    console.error("Update staff error:", error);
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required." }, { status: 400 });
    }

    await db.staffMember.delete({ where: { id } });
    return NextResponse.json({ ok: true, message: "Staff member removed." });
  } catch (error) {
    console.error("Delete staff error:", error);
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 });
  }
}
