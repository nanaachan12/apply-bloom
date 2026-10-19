import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { updateApplicationSchema } from "@/schemas";
import { awardXp } from "@/lib/gamification";
import { XP_RULES } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: {
      id,
      userId: session.id, // Security isolation
    },
    include: {
      events: {
        orderBy: { occurredAt: "desc" },
      },
      reminders: {
        orderBy: { dueAt: "asc" },
      },
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Data lamaran tidak ditemukan atau bukan milik Anda" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: application });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.application.findFirst({
    where: { id, userId: session.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Data lamaran tidak ditemukan atau akses ditolak" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const parsed = updateApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Input tidak valid" },
        { status: 400 }
      );
    }

    const updateData: any = { ...parsed.data };
    if (parsed.data.appliedAt !== undefined) {
      updateData.appliedAt = parsed.data.appliedAt ? new Date(parsed.data.appliedAt) : null;
    }

    const updated = await prisma.application.update({
      where: { id },
      data: updateData,
    });

    // If notes were newly added or significantly updated, award +5 XP idempotently
    let gamificationResult = null;
    if (parsed.data.notes && parsed.data.notes.length > 10 && !existing.notes) {
      gamificationResult = await awardXp({
        userId: session.id,
        sourceType: "NOTES_UPDATED",
        sourceId: id,
        amount: XP_RULES.NOTES_UPDATED,
      });
    }

    return NextResponse.json({
      message: "Data lamaran berhasil diperbarui",
      data: updated,
      gamification: gamificationResult,
    });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui lamaran" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.application.findFirst({
    where: { id, userId: session.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Data lamaran tidak ditemukan atau akses ditolak" },
      { status: 404 }
    );
  }

  await prisma.application.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Lamaran berhasil dihapus",
    data: { id },
  });
}
