// app/api/conversations/[toyId]/messages/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Storage } from "@google-cloud/storage";
import { sendNewMessageEmail } from "@/lib/mail"; // 👈 helper Nodemailer (Mailtrap/Namecheap)

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

// GET all messages in a specific conversation
export async function GET(request: Request, { params }: { params: Promise<{ toyId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const toyParams = await params;
  const userId = session.user.id;
  const toyId = toyParams.toyId;

  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');

    if (!partnerId) {
      return NextResponse.json({ error: "partnerId is required" }, { status: 400 });
    }

    // Fetch toy details once for the entire conversation, including donation status
    const toy = await prisma.toy.findUnique({
      where: { id: toyId },
      select: {
        id: true,
        title: true,
        pointsCost: true,
        mode: true,
        status: true,
        userId: true, // Pour savoir qui est le propriétaire du jouet
      },
    });

    if (!toy) {
      return NextResponse.json({ error: "Toy not found" }, { status: 404 });
    }

    const exchange = await prisma.exchange.findFirst({
      where: {
        toyId,
        OR: [
          { requesterId: userId },
          { requesterId: partnerId },
        ],
      },
      include: {
        reviews: {
          where: { reviewerId: userId }, // 👈 seulement ma review
        },
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

    // Fetch messages without including toy details for each message
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
        proposedToy: {
          select: {
            id: true,
            title: true,
            images: { select: { url: true }, take: 1 },
          },
        },
      },
    });

    // On génère les signed URLs
    const messagesWithSignedUrls = await Promise.all(
      messages.map(async (msg) => {
        const img0 = msg.proposedToy?.images?.[0];
        const fileName = img0?.url;
        if (fileName) {
          const [signedUrl] = await bucket.file(fileName).getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
          });
          return {
            ...msg,
            proposedToy: {
              ...msg.proposedToy,
              images: [{ url: fileName, signedUrl }],
            },
          };
        }
        return msg;
      })
    );

    return NextResponse.json({ messages: messagesWithSignedUrls, toy, exchange });
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
  const { content, receiverId, proposedToyId } = await request.json();

  if (!content || !receiverId) {
    return NextResponse.json({ error: "Content and receiverId are required" }, { status: 400 });
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        toyId,
        content,
        proposedToyId: proposedToyId || null,
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        proposedToy: {
          select: {
            id: true,
            title: true,
            images: { select: { url: true }, take: 1 },
          },
        },
      },
    });

    // on notifie par email
    try {
      const toy = await prisma.toy.findUnique({
        where: { id: toyId },
        select: { id: true, title: true },
      });

      const toEmail = newMessage.receiver?.email;
      if (toEmail) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
        const conversationUrl = `${appUrl}/messages/${toyId}?partnerId=${userId}`;
        const preview = (content || "").slice(0, 160);

        await sendNewMessageEmail({
          to: toEmail,
          name: newMessage.receiver?.name,
          toyTitle: toy?.title ?? "Votre jouet",
          preview,
          conversationUrl,
        });
      }
    } catch (mailErr) {
      console.warn("⚠️ Email notification failed:", mailErr);
      // on ne jette pas : l'envoi de mail ne doit pas casser l'API
    }

    // 👉 on génère aussi la signed URL à la volée
    let signedUrlMessage = newMessage;
    const img0 = newMessage.proposedToy?.images?.[0];
    const fileName = img0?.url;
    if (fileName) {
      const [signedUrl] = await bucket.file(fileName).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000,
      });
      signedUrlMessage = {
        ...newMessage,
        proposedToy: {
          ...newMessage.proposedToy,
          images: [{ url: fileName, signedUrl }],
        },
      };
    }

    return NextResponse.json(signedUrlMessage, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
