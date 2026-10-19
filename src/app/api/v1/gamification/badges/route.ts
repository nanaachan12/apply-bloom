import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;

  const [allBadges, userBadges, totalApps, interviewsCount, offersCount, profile] =
    await Promise.all([
      prisma.badge.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.userBadge.findMany({ where: { userId } }),
      prisma.application.count({ where: { userId } }),
      prisma.application.count({
        where: {
          userId,
          OR: [{ status: "INTERVIEW" }, { status: "ASSESSMENT" }],
        },
      }),
      prisma.application.count({ where: { userId, status: "OFFER" } }),
      prisma.gamificationProfile.findUnique({ where: { userId } }),
    ]);

  const earnedMap = new Map<string, string>();
  userBadges.forEach((ub) => {
    earnedMap.set(ub.badgeId, ub.earnedAt.toISOString());
  });

  const streak = profile?.currentStreak ?? 0;

  const badgesWithProgress = allBadges.map((badge) => {
    const isUnlocked = earnedMap.has(badge.id);
    let currentProgress = 0;

    switch (badge.code) {
      case "first-step":
        currentProgress = Math.min(1, totalApps);
        break;
      case "getting-started":
        currentProgress = Math.min(5, totalApps);
        break;
      case "interview-ready":
        currentProgress = Math.min(1, interviewsCount);
        break;
      case "consistent-grower":
        currentProgress = Math.min(7, streak);
        break;
      case "offer-bloom":
        currentProgress = Math.min(1, offersCount);
        break;
    }

    return {
      id: badge.id,
      code: badge.code,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      threshold: badge.threshold,
      isUnlocked,
      earnedAt: earnedMap.get(badge.id) || null,
      currentProgress,
    };
  });

  return NextResponse.json({
    data: badgesWithProgress,
    meta: {
      total: allBadges.length,
      unlockedCount: userBadges.length,
    },
  });
}
