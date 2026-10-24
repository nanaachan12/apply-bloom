import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, getCookieOptions } from "@/lib/auth";
import { resetGuestData } from "@/lib/guestSimulation";

export async function POST(req: NextRequest) {
  try {
    // Look for existing guest user or legacy demo user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: "guest@applybloom.com" },
          { email: "bloom@applybloom.com" },
        ],
      },
      include: { profile: true },
    });

    if (!user) {
      const passwordHash = await hashPassword("GuestPassword123!");
      user = await prisma.user.create({
        data: {
          name: "Guest",
          email: "guest@applybloom.com",
          passwordHash,
          timezone: "Asia/Jakarta",
          profile: {
            create: {
              totalXp: 185,
              level: 2,
              currentStreak: 4,
              longestStreak: 5,
              plantStage: 1,
              lastActiveDate: new Date(),
            },
          },
        },
        include: { profile: true },
      });
    } else {
      // Ensure name is strictly Guest and email is guest@applybloom.com
      if (user.name !== "Guest" || user.email !== "guest@applybloom.com") {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: "Guest",
            email: "guest@applybloom.com",
          },
          include: { profile: true },
        });
      }
    }

    // Always reset guest data to pristine demo state upon guest login
    // This ensures data is neat, clean, and prevents permanent guest storage
    await resetGuestData(user.id);

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      message: "Selamat datang di ApplyBloom, Guest!",
      data: {
        user: tokenPayload,
        profile: user.profile,
        token,
      },
    });

    const cookieOpts = getCookieOptions();
    response.cookies.set(cookieOpts.name, token, cookieOpts);

    return response;
  } catch (error: any) {
    console.error("Guest login error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal masuk sebagai Guest" },
      { status: 500 }
    );
  }
}
