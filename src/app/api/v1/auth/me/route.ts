import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);

  if (!session) {
    return NextResponse.json({ error: "Sesi tidak ditemukan atau kadaluarsa" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      profile: true,
      userBadges: {
        include: { badge: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      profile: user.profile,
      badgesCount: user.userBadges.length,
    },
  });
}
