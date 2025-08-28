import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { prisma } from "@/lib/prisma";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const fileParams = await params;
  const file = bucket.file(fileParams.file);

  const [signedUrl] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 min
  });

  return NextResponse.json({ url: signedUrl });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const fileParams = await params;
  const { offsetY } = await request.json();
  
  await prisma.toyImage.update({
    where: { id: fileParams.file },
    data: { offsetY }
  });
  
  return NextResponse.json({ success: true });
}