import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { APPLICATION_STATUS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;

  // 1. Status breakdown
  const applications = await prisma.application.findMany({
    where: { userId },
    select: { status: true, createdAt: true },
  });

  const statusCounts: Record<string, number> = {};
  Object.values(APPLICATION_STATUS).forEach((st) => {
    statusCounts[st] = 0;
  });

  applications.forEach((app) => {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  });

  // 2. Past 7 days trends
  const days: { date: string; label: string; count: number }[] = [];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 1);

    const count = applications.filter((app) => {
      const appDate = new Date(app.createdAt);
      return appDate >= d && appDate < nextD;
    }).length;

    days.push({
      date: d.toISOString().split("T")[0],
      label: `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`,
      count,
    });
  }

  return NextResponse.json({
    data: {
      weeklyTrends: days,
      statusBreakdown: statusCounts,
    },
  });
}
