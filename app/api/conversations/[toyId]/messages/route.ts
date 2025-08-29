// app/api/conversations/[toyId]/messages/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all messages in a specific conversation
export async function GET(request: Request, { params }: { params: { toyId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const toyId = params.toyId;

  try {
    // We need to know the conversation partner to filter messages correctly.
    // Let's assume the partner's ID is passed as a query parameter.
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');

    if (!partnerId) {
      return NextResponse.json({ error: "partnerId is required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        toyId: toyId,
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    // Mark messages as read for the current user
    await prisma.message.updateMany({
      where: {
        toyId: toyId,
        receiverId: userId,
        senderId: partnerId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST a new message to a specific conversation
export async function POST(request: Request, { params }: { params: { toyId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const toyId = params.toyId;
  const { content, receiverId } = await request.json();

  if (!content || !receiverId) {
    return NextResponse.json({ error: "Content and receiverId are required" }, { status: 400 });
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: receiverId,
        toyId: toyId,
        content: content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
    
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}