import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { updateReminderSchema } from "@/schemas";
import { awardXp } from "@/lib/gamification";
import { XP_RULES } from "@/lib/constants";

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
  const existing = await prisma.reminder.findFirst({
    where: {
      id,
      application: { userId: session.id },
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Reminder tidak ditemukan atau akses ditolak" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const parsed = updateReminderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Input tidak valid" },
        { status: 400 }
      );
    }

    const { title, type, dueAt, isCompleted } = parsed.data;
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (dueAt !== undefined) updateData.dueAt = new Date(dueAt);

    let xpResult = null;

    if (isCompleted !== undefined) {
      if (isCompleted) {
        updateData.completedAt = new Date();
        // Award +5 XP for completing reminder
        xpResult = await awardXp({
          userId: session.id,
          sourceType: "REMINDER_COMPLETED",
          sourceId: id,
          amount: XP_RULES.REMINDER_COMPLETED,
        });
      } else {
        updateData.completedAt = null;
      }
    }

    const updated = await prisma.reminder.update({
      where: { id },
      data: updateData,
      include: {
        application: {
          select: {
            id: true,
            company: true,
            position: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: isCompleted
        ? "Reminder selesai! +5 XP"
        : "Reminder berhasil diperbarui",
      data: updated,
      gamification: xpResult,
    });
  } catch (error) {
    console.error("Update reminder error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui reminder" },
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
  const existing = await prisma.reminder.findFirst({
    where: {
      id,
      application: { userId: session.id },
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Reminder tidak ditemukan atau akses ditolak" },
      { status: 404 }
    );
  }

  await prisma.reminder.delete({ where: { id } });

  return NextResponse.json({
    message: "Reminder berhasil dihapus",
    data: { id },
  });
}
