import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, getCookieOptions } from "@/lib/auth";
import { registerSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Input tidak valid" },
        { status: 400 }
      );
    }

    const { name, email, password, timezone } = parsed.data;

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Atomically create User and GamificationProfile
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          timezone,
          profile: {
            create: {
              totalXp: 0,
              level: 1,
              currentStreak: 1,
              longestStreak: 1,
              plantStage: 0,
              lastActiveDate: new Date(),
            },
          },
        },
        include: {
          profile: true,
        },
      });
      return user;
    });

    const tokenPayload = {
      id: result.id,
      name: result.name,
      email: result.email,
      timezone: result.timezone,
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json(
      {
        message: "Registrasi berhasil! Selamat datang di ApplyBloom",
        data: {
          user: tokenPayload,
          profile: result.profile,
          token,
        },
      },
      { status: 201 }
    );

    const cookieOpts = getCookieOptions();
    response.cookies.set(cookieOpts.name, token, cookieOpts);

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat registrasi" },
      { status: 500 }
    );
  }
}
