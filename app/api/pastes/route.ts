import { Paste, redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const id = nanoid(10);
  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000).toISOString()
    : null;

  const paste: Paste = {
    id,
    content,
    max_views,
    remaining_views: max_views ?? null,
    expires_at: expiresAt,
  };

  await redis.set(`paste:${id}`, paste, { ex: ttl_seconds });

  const host = req.headers.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  return NextResponse.json(
    { id, url: `${protocol}://${host}/p/${id}` },
    { status: 201 }
  );
}
