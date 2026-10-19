import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { createReminderSchema } from "@/schemas";
import { awardXp } from "@/lib/gamification";
import { XP_RULES } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership of the parent application
  const application = await prisma.application.findFirst({
    where: { id, userId: session.id },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Data lamaran tidak ditemukan atau akses ditolak" },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createReminderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Input tidak valid" },
        { status: 400 }
      );
    }

    const reminder = await prisma.reminder.create({
      data: {
        applicationId: id,
        title: parsed.data.title,
        type: parsed.data.type,
        dueAt: new Date(parsed.data.dueAt),
      },
      include: {
        application: {
          select: {
            company: true,
            position: true,
            status: true,
          },
        },
      },
    });

    let gamificationResult = null;
    if (parsed.data.type === "INTERVIEW" || parsed.data.type === "ASSESSMENT") {
      gamificationResult = await awardXp({
        userId: session.id,
        sourceType: "INTERVIEW_RECORDED",
        sourceId: id,
        amount: XP_RULES.INTERVIEW_RECORDED,
      });
    }

    return NextResponse.json(
      {
        message: "Jadwal pengingat berhasil ditambahkan! ⏰",
        data: reminder,
        gamification: gamificationResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create reminder error:", error);
    return NextResponse.json(
      { error: "Gagal membuat reminder" },
      { status: 500 }
    );
  }
}
