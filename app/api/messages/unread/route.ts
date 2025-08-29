// app/api/messages/unread/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ count: 0 }); // Retourner 0 si l'utilisateur n'est pas connecté
  }

  const userId = session.user.id;

  try {
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    return NextResponse.json({ error: 'Failed to fetch unread count' }, { status: 500 });
  }
}