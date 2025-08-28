import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { v4 as uuid } from "uuid";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export async function GET(req: NextRequest) {
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
