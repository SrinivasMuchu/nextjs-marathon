import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

export async function GET(request, { params }) {
  if (!API_BASE) {
    return NextResponse.json(
      { meta: { success: false, message: "NEXT_PUBLIC_BASE_URL is not set." } },
      { status: 500 },
    );
  }

  const userUuid = request.headers.get("user-uuid") || "";
  if (!userUuid) {
    return NextResponse.json(
      { meta: { success: false, message: "user-uuid header is required." } },
      { status: 400 },
    );
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json(
      { meta: { success: false, message: "job id is required." } },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${API_BASE}/v1/cad-step-bom/status/${id}`, {
      headers: { "user-uuid": userUuid, Accept: "application/json" },
      cache: "no-store",
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { meta: { success: false, message: err?.message || "Status proxy failed." } },
      { status: 500 },
    );
  }
}
