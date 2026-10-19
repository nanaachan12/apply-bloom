import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { createApplicationSchema } from "@/schemas";
import { awardXp } from "@/lib/gamification";
import { XP_RULES } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const employmentType = searchParams.get("employmentType");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
  const sortBy = searchParams.get("sortBy") || "updatedAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const where: any = {
    userId: session.id,
  };

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (employmentType && employmentType !== "ALL") {
    where.employmentType = employmentType;
  }

  if (search && search.trim() !== "") {
    where.OR = [
      { company: { contains: search } },
      { position: { contains: search } },
      { location: { contains: search } },
      { notes: { contains: search } },
    ];
  }

  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: {
            events: true,
            reminders: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    data: applications,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Data lamaran tidak valid" },
        { status: 400 }
      );
    }

    const {
      company,
      position,
      location,
      employmentType,
      salaryMin,
      salaryMax,
      currency,
      source,
      jobUrl,
      status,
      appliedAt,
      notes,
    } = parsed.data;

    const appliedDate = appliedAt
      ? new Date(appliedAt)
      : status === "APPLIED" || status === "INTERVIEW" || status === "ASSESSMENT"
      ? new Date()
      : null;

    // Create application and initial event in database transaction
    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.application.create({
        data: {
          userId: session.id,
          company,
          position,
          location: location || null,
          employmentType: employmentType || null,
          salaryMin: salaryMin || null,
          salaryMax: salaryMax || null,
          currency: currency || "IDR",
          source: source || null,
          jobUrl: jobUrl || null,
          status,
          appliedAt: appliedDate,
          notes: notes || null,
          events: {
            create: {
              fromStatus: null,
              toStatus: status,
              description: `Lamaran dibuat dengan status ${status}`,
            },
          },
        },
      });
      return app;
    });

    // Award +10 XP for creating a valid application
    const xpResult = await awardXp({
      userId: session.id,
      sourceType: "APPLICATION_CREATED",
      sourceId: application.id,
      amount: XP_RULES.APPLICATION_CREATED,
    });

    return NextResponse.json(
      {
        message: "Lamaran berhasil disimpan! +10 XP 🌿",
        data: application,
        gamification: xpResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan lamaran" },
      { status: 500 }
    );
  }
}
