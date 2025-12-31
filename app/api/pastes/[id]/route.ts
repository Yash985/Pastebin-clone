import { NextRequest, NextResponse } from "next/server";
import { redis, Paste, getCurrentTime } from "@/lib/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await redis.get<Paste>(`paste:${id}`);
  const now = getCurrentTime(req.headers);

  if (!paste) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  if (paste.expires_at && new Date(paste.expires_at).getTime() <= now) {
    await redis.del(`paste:${id}`);
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (typeof paste.remaining_views === "number") {
    if (paste.remaining_views <= 0)
      return NextResponse.json({ error: "No views left" }, { status: 404 });
    paste.remaining_views -= 1;
    await redis.set(`paste:${id}`, paste);
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at,
  });
}
