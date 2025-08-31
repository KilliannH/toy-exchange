import { NextResponse } from "next/server";
import { getBucket } from "@/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const bucket = getBucket();
  const fileParams = await params;
  const file = bucket.file(fileParams.file);

  const [signedUrl] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 min
  });

  return NextResponse.json({ url: signedUrl });
}