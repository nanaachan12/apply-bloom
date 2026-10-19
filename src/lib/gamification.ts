import { prisma } from "@/lib/prisma";
import { XP_RULES, PLANT_STAGES } from "@/lib/constants";

export interface AwardXpResult {
  awarded: boolean;
  amount: number;
  totalXp: number;
  level: number;
  plantStage: number;
  leveledUp: boolean;
  plantEvolved: boolean;
  newBadgesEarned: string[];
}

export function calculatePlantStage(level: number): number {
  if (level >= 10) return 4;
  if (level >= 7) return 3;
  if (level >= 4) return 2;
  if (level >= 2) return 1;
  return 0;
}

export async function awardXp(params: {
  userId: string;
  sourceType: string;
  sourceId: string;
  amount: number;
}): Promise<AwardXpResult> {
  const { userId, sourceType, sourceId, amount } = params;

  // 1. Idempotency check: see if XP already awarded for this exact source
  const existingTx = await prisma.xpTransaction.findUnique({
    where: {
      userId_sourceType_sourceId: {
        userId,
        sourceType,
        sourceId,
      },
    },
  });

  if (existingTx) {
    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });
    return {
      awarded: false,
      amount: 0,
      totalXp: profile?.totalXp ?? 0,
      level: profile?.level ?? 1,
      plantStage: profile?.plantStage ?? 0,
      leveledUp: false,
      plantEvolved: false,
      newBadgesEarned: [],
    };
  }

  // 2. Fetch or create user profile
  let currentProfile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });

  if (!currentProfile) {
    currentProfile = await prisma.gamificationProfile.create({
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

  const oldLevel = currentProfile.level;
  const oldStage = currentProfile.plantStage;

  const newTotalXp = currentProfile.totalXp + amount;
  const newLevel = Math.floor(newTotalXp / 100) + 1;
  const newStage = calculatePlantStage(newLevel);

  // 3. Streak calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let newCurrentStreak = currentProfile.currentStreak;
  let newLongestStreak = currentProfile.longestStreak;

  if (currentProfile.lastActiveDate) {
    const lastDate = new Date(currentProfile.lastActiveDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive day!
      newCurrentStreak += 1;
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    } else if (diffDays > 1) {
      // Streak broken, restart
      newCurrentStreak = 1;
    }
    // If diffDays === 0, keep same streak
  } else {
    newCurrentStreak = 1;
    newLongestStreak = 1;
  }

  // 4. Atomic transaction: create XpTransaction & update GamificationProfile
  await prisma.$transaction([
    prisma.xpTransaction.create({
      data: {
        userId,
        sourceType,
        sourceId,
        amount,
      },
    }),
    prisma.gamificationProfile.update({
      where: { userId },
      data: {
        totalXp: newTotalXp,
        level: newLevel,
        plantStage: newStage,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: new Date(),
      },
    }),
  ]);

  // 5. Evaluate and unlock badges
  const newBadgesEarned = await checkAndAwardBadges(userId, {
    totalApplications: await prisma.application.count({ where: { userId } }),
    currentStreak: newCurrentStreak,
  });

  return {
    awarded: true,
    amount,
    totalXp: newTotalXp,
    level: newLevel,
    plantStage: newStage,
    leveledUp: newLevel > oldLevel,
    plantEvolved: newStage > oldStage,
    newBadgesEarned,
  };
}

export async function checkAndAwardBadges(
  userId: string,
  hints?: { totalApplications?: number; currentStreak?: number }
): Promise<string[]> {
  const earnedBadgeCodes: string[] = [];

  // Get all system badges
  const allBadges = await prisma.badge.findMany();
  const existingUserBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const ownedBadgeIds = new Set(existingUserBadges.map((b) => b.badgeId));

  const totalApps =
    hints?.totalApplications ??
    (await prisma.application.count({ where: { userId } }));

  const interviewsCount = await prisma.application.count({
    where: {
      userId,
      OR: [{ status: "INTERVIEW" }, { status: "ASSESSMENT" }],
    },
  });

  const offersCount = await prisma.application.count({
    where: { userId, status: "OFFER" },
  });

  const profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });
  const streak = hints?.currentStreak ?? profile?.currentStreak ?? 0;

  for (const badge of allBadges) {
    if (ownedBadgeIds.has(badge.id)) continue;

    let qualifies = false;

    switch (badge.code) {
      case "first-step":
        if (totalApps >= 1) qualifies = true;
        break;
      case "getting-started":
        if (totalApps >= 5) qualifies = true;
        break;
      case "interview-ready":
        if (interviewsCount >= 1) qualifies = true;
        break;
      case "consistent-grower":
        if (streak >= 7) qualifies = true;
        break;
      case "offer-bloom":
        if (offersCount >= 1) qualifies = true;
        break;
    }

    if (qualifies) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });
      earnedBadgeCodes.push(badge.code);
    }
  }

  return earnedBadgeCodes;
}
