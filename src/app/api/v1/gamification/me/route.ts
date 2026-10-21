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

  let profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.gamificationProfile.create({
      data: {
        userId,
        totalXp: 0,
        level: 1,
        currentStreak: 1,
        longestStreak: 1,
        plantStage: 0,
        lastActiveDate: new Date(),
      },
    });
  }

  const currentLevelXpFloor = (profile.level - 1) * 100;
  const nextLevelXpTarget = profile.level * 100;
  const xpInCurrentLevel = profile.totalXp - currentLevelXpFloor;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / 100) * 100)));

  const currentStageMeta = PLANT_STAGES[profile.plantStage] || PLANT_STAGES[0];
  const nextStageMeta = PLANT_STAGES[Math.min(PLANT_STAGES.length - 1, profile.plantStage + 1)];

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const waterCountToday = await prisma.xpTransaction.count({
    where: {
      userId,
      sourceType: "WATER_PLANT",
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  const maxWaterPerDay = 3;
  const remainingWater = Math.max(0, maxWaterPerDay - waterCountToday);
  const canWater = remainingWater > 0;

  return NextResponse.json({
    data: {
      totalXp: profile.totalXp,
      level: profile.level,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      plantStage: profile.plantStage,
      stageMeta: currentStageMeta,
      nextStageMeta,
      xpInCurrentLevel,
      xpNeededForNextLevel: 100 - xpInCurrentLevel,
      progressPercent,
      lastActiveDate: profile.lastActiveDate,
      waterCountToday,
      maxWaterPerDay,
      remainingWater,
      canWater,
    },
  });
}
