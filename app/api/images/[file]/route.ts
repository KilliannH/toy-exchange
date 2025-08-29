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
  { params }: { params: { file: string } }
) {
  const { offsetYPercentage } = await request.json(); // New property name

  // Basic validation to ensure the value is a number and within a reasonable range
  if (typeof offsetYPercentage !== 'number' || offsetYPercentage < -100 || offsetYPercentage > 100) {
    return NextResponse.json({ error: 'Invalid offsetYPercentage value' }, { status: 400 });
  }
  
  await prisma.toyImage.update({
    where: { id: params.file },
    data: { offsetYPercentage } // Update the new field in your database model
  });

  return NextResponse.json({ success: true });
}