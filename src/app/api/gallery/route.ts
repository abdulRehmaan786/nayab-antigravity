import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const query = searchParams.get("query");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};

    if (category && category !== "ALL" && category !== "All") {
      where.category = category.toUpperCase();
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (query && query.trim()) {
      where.OR = [
        { title: { contains: query.trim() } },
        { description: { contains: query.trim() } },
        { date: { contains: query.trim() } },
      ];
    }

    const items = await db.galleryItem.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error("Fetch gallery items error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, imageUrl, category = "CAMPUS", date, featured = false } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and Image URL or uploaded file are required." },
        { status: 400 }
      );
    }

    const item = await db.galleryItem.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl.trim(),
        category: category.toUpperCase().trim(),
        date: date?.trim() || null,
        featured: Boolean(featured),
        uploadedBy: session.name,
      },
    });

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("Create gallery item error:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, description, imageUrl, category, date, featured } = body;

    if (!id) {
      return NextResponse.json({ error: "Gallery item ID is required." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (imageUrl) updateData.imageUrl = imageUrl.trim();
    if (category) updateData.category = category.toUpperCase().trim();
    if (date !== undefined) updateData.date = date?.trim() || null;
    if (featured !== undefined) updateData.featured = Boolean(featured);

    const updated = await db.galleryItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error) {
    console.error("Update gallery item error:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
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
      return NextResponse.json({ error: "Gallery item ID is required." }, { status: 400 });
    }

    const existing = await db.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    // If it's a locally uploaded file, delete it from disk safely
    if (existing.imageUrl && existing.imageUrl.startsWith("/uploads/gallery/")) {
      try {
        const filepath = path.join(process.cwd(), "public", existing.imageUrl);
        await fs.unlink(filepath);
      } catch (err) {
        // File may already be deleted or not found
      }
    }

    await db.galleryItem.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Gallery photo deleted successfully." });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json({ error: "Failed to delete gallery photo" }, { status: 500 });
  }
}
