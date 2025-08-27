import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const toys = await prisma.toy.findMany({
    where: { status: "AVAILABLE" },
    include: { images: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(toys);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  const toy = await prisma.toy.create({
    data: {
      ...body,
      userId: session.user.id, // récupéré via callback session
    },
  });

  return NextResponse.json(toy);
}