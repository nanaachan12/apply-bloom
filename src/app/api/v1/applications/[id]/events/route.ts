import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const application = await prisma.application.findFirst({
    where: { id, userId: session.id },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Data lamaran tidak ditemukan atau akses ditolak" },
      { status: 404 }
    );
  }

  const events = await prisma.applicationEvent.findMany({
    where: { applicationId: id },
    orderBy: { occurredAt: "desc" },
  });

  return NextResponse.json({ data: events });
}
