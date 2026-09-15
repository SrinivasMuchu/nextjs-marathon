import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

/**
 * Server-side STEP upload for BOM extraction: presign + PUT to S3 + queue Kafka.
 */
export async function POST(request) {
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

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json(
      { meta: { success: false, message: "STEP file is required." } },
      { status: 400 },
    );
  }

  const fileName = file.name || "model.step";
  const filesize = file.size || 0;
  const headers = {
    "Content-Type": "application/json",
    "user-uuid": userUuid,
  };

  try {
    const uploadRes = await fetch(`${API_BASE}/v1/cad-step-bom/upload-url`, {
      method: "POST",
      headers,
      body: JSON.stringify({ file_name: fileName, filesize }),
      cache: "no-store",
    });
    const uploadJson = await uploadRes.json();
    if (!uploadJson?.meta?.success) {
      return NextResponse.json(uploadJson, { status: uploadRes.status });
    }

    const { put_url, input_file_url, s3_bucket, s3_key, file_name, key } = uploadJson.data || {};
    if (!put_url) {
      return NextResponse.json(
        { meta: { success: false, message: "Server did not return an upload URL." } },
        { status: 502 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const s3Res = await fetch(put_url, {
      method: "PUT",
      headers: { "Content-Type": "application/step" },
      body: buffer,
    });
    if (!s3Res.ok) {
      return NextResponse.json(
        { meta: { success: false, message: `Storage upload failed (${s3Res.status}).` } },
        { status: 502 },
      );
    }

    const submitRes = await fetch(`${API_BASE}/v1/cad-step-bom/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        file_name: file_name || fileName,
        input_file_url,
        s3_bucket,
        s3_key: s3_key || key,
      }),
      cache: "no-store",
    });
    const submitJson = await submitRes.json();
    return NextResponse.json(submitJson, { status: submitRes.status });
  } catch (err) {
    console.error("step-bom-upload:", err);
    return NextResponse.json(
      { meta: { success: false, message: err?.message || "Upload proxy failed." } },
      { status: 500 },
    );
  }
}
