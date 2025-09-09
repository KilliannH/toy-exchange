import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {searchParams} = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";

  const res = NextResponse.json({ok: true});
  res.cookies.set("locale", locale, {
    path: "/",
    httpOnly: false
  });
  return res;
}