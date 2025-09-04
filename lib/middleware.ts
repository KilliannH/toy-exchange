import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  // Pas connecté → login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Vérifie la ville seulement sur /dashboard
  if (url.pathname.startsWith("/dashboard")) {
    const user = await prisma.user.findUnique({
      where: { id: token.sub! },
      select: { city: true, lat: true, lng: true },
    });

    if (!user?.city || !user?.lat || !user?.lng) {
      url.pathname = "/onboarding/city";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // 👈 middleware appliqué uniquement au dashboard
};