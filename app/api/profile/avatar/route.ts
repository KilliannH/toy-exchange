import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getBucket } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  if (!user?.image) {
    return NextResponse.json({ image: null });
  }

  const bucket = getBucket();

  const objectPath = user.image.replace(
    `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/`,
    ""
  );

  const file = bucket.file(objectPath);
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 5 * 60 * 1000, // 5 min
  });

  return NextResponse.json({ image: url });
}
