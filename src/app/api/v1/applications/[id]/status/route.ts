import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { updateStatusSchema } from "@/schemas";
import { awardXp, checkAndAwardBadges } from "@/lib/gamification";
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
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Status tidak valid" },
        { status: 400 }
      );
    }

    const { status: newStatus, description } = parsed.data;
    const oldStatus = application.status;

    if (oldStatus === newStatus) {
      return NextResponse.json({
        message: "Status tidak berubah",
        data: application,
      });
    }

    // Atomic transaction: update application status + write ApplicationEvent
    const [updatedApp, newEvent] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          status: newStatus,
          // If status changes from wishlist to applied, set appliedAt if not yet set
          appliedAt:
            oldStatus === "WISHLIST" && !application.appliedAt
              ? new Date()
              : application.appliedAt,
        },
      }),
      prisma.applicationEvent.create({
        data: {
          applicationId: id,
          fromStatus: oldStatus,
          toStatus: newStatus,
          description:
            description ||
            `Status diubah dari ${oldStatus} menjadi ${newStatus}`,
        },
      }),
    ]);

    // Gamification rules:
    // 1. Award +15 XP for reaching INTERVIEW or ASSESSMENT stage (idempotent per app)
    let gamificationResult = null;
    if (newStatus === "INTERVIEW" || newStatus === "ASSESSMENT") {
      gamificationResult = await awardXp({
        userId: session.id,
        sourceType: "INTERVIEW_RECORDED",
        sourceId: id,
        amount: XP_RULES.INTERVIEW_RECORDED,
      });
    }

    // 2. If status is OFFER, check offer-bloom badge
    if (newStatus === "OFFER") {
      await checkAndAwardBadges(session.id);
    }

    return NextResponse.json({
      message: `Status berhasil diubah ke ${newStatus}`,
      data: {
        application: updatedApp,
        event: newEvent,
      },
      gamification: gamificationResult,
    });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status lamaran" },
      { status: 500 }
    );
  }
}
