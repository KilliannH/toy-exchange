import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const toys = await prisma.toy.findMany({
    where: { status: "AVAILABLE" },
    include: { images: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(toys);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const toy = await prisma.toy.create({ data: body });
  return NextResponse.json(toy);
}