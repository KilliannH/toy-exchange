// app/api/admin/toys/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const DELETE = withAuth(async (req, user) => {
  const { id } = req.params;
  
  await prisma.toy.delete({
    where: { id }
  });
  
  return NextResponse.json({ message: "Jouet supprimé" });
}, 'ADMIN');