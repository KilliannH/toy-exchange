// app/api/conversations/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json([]);
  }

  const userId = session.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        toyId: true,
        senderId: true,
        receiverId: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        createdAt: true,
        content: true,
        isRead: true,
      },
    });

    if (messages.length === 0) {
      console.log("⚠️ Aucun message trouvé pour cet utilisateur");
      return NextResponse.json([]);
    }

    const conversationsMap = new Map();

    for (const message of messages) {
      const partner =
        message.sender.id === userId ? message.receiver : message.sender;
      const conversationKey = `${partner.id}-${message.toyId}`;

      if (!conversationsMap.has(conversationKey)) {
        const toy = await prisma.toy.findUnique({
          where: { id: message.toyId },
          select: {
            id: true,
            title: true,
            images: {
              select: { url: true, offsetYPercentage: true },
              take: 1,
            },
          },
        });

        conversationsMap.set(conversationKey, {
          ...message,
          partner,
          toy,
        });
      }
    }

    let conversations = Array.from(conversationsMap.values());

    // Génération des signed URLs
    conversations = await Promise.all(
      conversations.map(async (conv) => {
        if (conv.toy?.images.length > 0) {
          const img = conv.toy.images[0];
          const fileName = img.url; // 👈 fallback sur url
          if (!fileName) {
            console.warn("⚠️ Image sans fileName ni url pour toy", conv.toy.id);
            return conv;
          }
          const file = bucket.file(fileName);
          const [signedUrl] = await file.getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
          });
          return {
            ...conv,
            toy: { ...conv.toy, images: [{ ...img, signedUrl }] },
          };
        }
        return conv;
      })
    );

    // Tri
    conversations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json([]);
  }
}
