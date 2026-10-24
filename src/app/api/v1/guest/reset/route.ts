import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { resetGuestData } from "@/lib/guestSimulation";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.email !== "guest@applybloom.com") {
      return NextResponse.json(
        { error: "Fitur reset hanya tersedia untuk Mode Guest" },
        { status: 403 }
      );
    }

    await resetGuestData(user.id);

    return NextResponse.json({
      message: "Data simulasi guest berhasil direset ke kondisi awal.",
    });
  } catch (error: any) {
    console.error("Error resetting guest data:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mereset data simulasi" },
      { status: 500 }
    );
  }
}
