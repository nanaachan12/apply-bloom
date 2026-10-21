import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { awardXp } from "@/lib/gamification";

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // Check how many times the user has already watered today
  const countToday = await prisma.xpTransaction.count({
    where: {
      userId,
      sourceType: "WATER_PLANT",
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  if (countToday >= 3) {
    return NextResponse.json(
      {
        error: "Siram tanaman sudah habis, kembali lagi besok",
        canWater: false,
        waterCountToday: countToday,
        maxWaterPerDay: 3,
        remainingWater: 0,
      },
      { status: 400 }
    );
  }

  const nextIndex = countToday + 1;
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const sourceId = `water_${dateStr}_${nextIndex}`;

  const xpResult = await awardXp({
    userId,
    sourceType: "WATER_PLANT",
    sourceId,
    amount: 5,
  });

  const remainingWater = Math.max(0, 3 - nextIndex);

  return NextResponse.json({
    success: true,
    awardedXp: 5,
    totalXp: xpResult.totalXp,
    level: xpResult.level,
    plantStage: xpResult.plantStage,
    waterCountToday: nextIndex,
    maxWaterPerDay: 3,
    remainingWater,
    canWater: remainingWater > 0,
    message:
      remainingWater === 0
        ? "Siram tanaman sudah habis, kembali lagi besok"
        : `Tanaman berhasil disiram! +5 XP (Sisa hari ini: ${remainingWater}x)`,
  });
}
