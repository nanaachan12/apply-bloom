import { NextResponse } from "next/server";
import { getCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout berhasil",
  });

  const cookieOpts = getCookieOptions();
  response.cookies.set(cookieOpts.name, "", {
    ...cookieOpts,
    maxAge: 0,
  });

  return response;
}
