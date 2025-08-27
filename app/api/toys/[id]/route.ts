import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const toy = await prisma.toy.findUnique({
    where: { id: params.id },
    include: { images: true, user: true },
  });

  if (!toy) {
    return NextResponse.json({ error: "Toy not found" }, { status: 404 });
  }

  return NextResponse.json(toy);
}
