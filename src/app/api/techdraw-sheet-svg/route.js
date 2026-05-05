import { NextResponse } from "next/server";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");
const DESIGN_ID_RE = /^[a-f0-9]{24}$/;

export async function GET(request) {
  const url = new URL(request.url);
  const designId = String(url.searchParams.get("designId") || "").trim();
  const sheet = Number(url.searchParams.get("sheet"));

  if (!DESIGN_ID_RE.test(designId) || !Number.isInteger(sheet) || sheet < 1) {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }

  const target = `${PREFIX}/${designId}/svg/sheet_${sheet}.svg`;
  let upstream;
  try {
    upstream = await fetch(target, { next: { revalidate: 120 } });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "not found" }, { status: upstream.status });
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=120, s-maxage=120",
    },
  });
}

