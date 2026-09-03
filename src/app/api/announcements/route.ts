import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (category && category !== "ALL") {
      where.category = category;
    }

    const announcements = await db.announcement.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ ok: true, announcements });
  } catch (error) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, category, isPinned } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required." },
        { status: 400 }
      );
    }

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const announcement = await db.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category,
        isPinned: Boolean(isPinned),
        publishedBy: session.role === "ADMIN" ? "School Administration" : session.name,
        date: formattedDate,
      },
    });

    return NextResponse.json({ ok: true, announcement });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
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
      return NextResponse.json({ error: "Announcement ID is required." }, { status: 400 });
    }

    await db.announcement.delete({ where: { id } });
    return NextResponse.json({ ok: true, message: "Announcement deleted" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
