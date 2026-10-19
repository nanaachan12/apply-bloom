import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "upcoming"; // upcoming, completed, all
  const type = searchParams.get("type");

  const where: any = {
    application: {
      userId: session.id, // Security isolation
    },
  };

  if (filter === "upcoming") {
    where.completedAt = null;
  } else if (filter === "completed") {
    where.completedAt = { not: null };
  }

  if (type && type !== "ALL") {
    where.type = type;
  }

  const reminders = await prisma.reminder.findMany({
    where,
    orderBy: { dueAt: "asc" },
    include: {
      application: {
        select: {
          id: true,
          company: true,
          position: true,
          status: true,
        },
      },
    },
  });

  return NextResponse.json({ data: reminders });
}
