import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getBucket } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const bucket = getBucket();
  const type = req.nextUrl.searchParams.get("type") || "image/jpeg";
  const fileName = `${uuid()}.${type.split("/")[1]}`;
  const file = bucket.file(fileName);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 5 * 60 * 1000, // 5 min
    contentType: type,
  });

  return NextResponse.json({ url, fileName });
}

export async function POST(req: Request) {
  const bucket = getBucket();
  try {
    const { fileName, fileType } = await req.json();
    const uniqueFileName = `avatars/${Date.now()}-${fileName}`;
    const file = bucket.file(uniqueFileName);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      contentType: fileType,
    });

    return NextResponse.json({
      url,
      publicUrl: `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${uniqueFileName}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur génération URL signée" }, { status: 500 });
  }
}