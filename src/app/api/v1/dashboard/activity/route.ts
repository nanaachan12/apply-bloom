import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;

  // Fetch recent application events
  const events = await prisma.applicationEvent.findMany({
    where: {
      application: { userId },
    },
    orderBy: { occurredAt: "desc" },
    take: 10,
    include: {
      application: {
        select: {
          id: true,
          company: true,
          position: true,
        },
      },
    },
  });

  // Fetch recent badges earned
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    orderBy: { earnedAt: "desc" },
    take: 5,
    include: { badge: true },
  });

  return NextResponse.json({
    data: {
      events,
      recentBadges: userBadges,
    },
  });
}
