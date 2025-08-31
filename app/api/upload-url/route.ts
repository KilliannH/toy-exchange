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
