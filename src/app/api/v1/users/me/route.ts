import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { updateProfileSchema } from "@/schemas";

export async function PATCH(req: NextRequest) {
  const session = await getSessionUser(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Input tidak valid" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        timezone: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil pengguna" },
      { status: 500 }
    );
  }
}
