import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export type Role = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserWithRole {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export async function getCurrentUser(): Promise<UserWithRole | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });

  return user;
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    USER: 1,
    MODERATOR: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}

export async function requireRole(requiredRole: Role) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Authentification requise");
  }

  if (!hasRole(user.role, requiredRole)) {
    throw new Error("Permissions insuffisantes");
  }

  return user;
}

// Helper pour les API routes
export async function withAuth(
  handler: (req: NextRequest, user: UserWithRole) => Promise<NextResponse>,
  requiredRole: Role = 'USER'
) {
  return async (req: NextRequest) => {
    try {
      const user = await requireRole(requiredRole);
      return handler(req, user);
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === "Authentification requise" ? 401 : 403 }
      );
    }
  };
}