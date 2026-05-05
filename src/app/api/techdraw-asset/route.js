import { NextResponse } from "next/server";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";

const ALLOW_PREFIX = TECH_DRAW_LIBRARY_PREFIX.replace(/\/$/, "");

function sniffSvg(ct, urlStr, u8) {
  if (ct.includes("svg")) return "image/svg+xml";
  if (urlStr.endsWith(".svg")) return "image/svg+xml";
  const head = new TextDecoder("utf-8", { fatal: false })
    .decode(u8.slice(0, 400))
    .trimStart();
  if (head.startsWith("<svg") || head.startsWith("<?xml")) return "image/svg+xml";
  return ct;
}

export async function GET(request) {
  const target = new URL(request.url).searchParams.get("u");
  if (!target) {
    return NextResponse.json({ error: "missing u" }, { status: 400 });
  }
  if (!target.startsWith(`${ALLOW_PREFIX}/`)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      headers: { Accept: "*/*" },
      next: { revalidate: 120 },
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: upstream.statusText },
      { status: upstream.status }
    );
  }

  let ct = upstream.headers.get("content-type") || "application/octet-stream";
  const ab = await upstream.arrayBuffer();
  const u8 = new Uint8Array(ab);

  if (ct.includes("octet-stream") || ct.includes("binary")) {
    ct = sniffSvg(ct, target, u8);
  }

  return new NextResponse(ab, {
    status: 200,
    headers: {
      "Content-Type": ct,
      "Cache-Control": "public, max-age=120, s-maxage=120",
      "Content-Disposition": "inline",
    },
  });
}
