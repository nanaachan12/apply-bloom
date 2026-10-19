import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { PLANT_STAGES } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalApplications,
    interviewsCount,
    offersCount,
    pendingCount,
    weeklyCount,
    profile,
    upcomingReminders,
  ] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.application.count({
      where: {
        userId,
        OR: [{ status: "INTERVIEW" }, { status: "ASSESSMENT" }],
      },
    }),
    prisma.application.count({ where: { userId, status: "OFFER" } }),
    prisma.application.count({
      where: {
        userId,
        status: { in: ["WISHLIST", "APPLIED", "SCREENING", "ASSESSMENT"] },
      },
    }),
    prisma.application.count({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.gamificationProfile.findUnique({ where: { userId } }),
    prisma.reminder.findMany({
      where: {
        application: { userId },
        completedAt: null,
      },
      orderBy: { dueAt: "asc" },
      take: 4,
      include: {
        application: {
          select: {
            company: true,
            position: true,
            status: true,
          },
        },
      },
    }),
  ]);

  const plantStage = profile?.plantStage ?? 0;
  const plantMeta = PLANT_STAGES[plantStage] || PLANT_STAGES[0];

  return NextResponse.json({
    data: {
      totalApplications,
      interviewsCount,
      offersCount,
      pendingCount,
      weeklyCount,
      plantStage,
      plantStageName: plantMeta.name,
      level: profile?.level ?? 1,
      totalXp: profile?.totalXp ?? 0,
      currentStreak: profile?.currentStreak ?? 1,
      longestStreak: profile?.longestStreak ?? 1,
      upcomingReminders,
    },
  });
}
