/**
 * CAD TechDraw pipeline — local STEP upload, backend runs the script.
 * Backend should accept multipart POST and start processing (sync or async response).
 *
 * Expected route (adjust on server to match): POST /v1/cad/techdraw-pipeline
 * Form fields: step (File), title (optional), description (optional)
 */
import axios from "axios";
import { BASE_URL } from "@/config";

export const TECHDRAW_PIPELINE_PATH = "/v1/cad/techdraw-pipeline";

/** Long-running job: backend may keep connection open until script finishes or returns job id quickly. */
const CLIENT_TIMEOUT_MS = 600_000;

function userUuidHeader() {
  if (typeof window === "undefined") return {};
  const uuid = localStorage.getItem("uuid");
  return uuid ? { "user-uuid": uuid } : {};
}

/**
 * @param {{ file: File, title?: string, description?: string }} params
 * @returns {Promise<any>} Raw API response body (shape depends on backend)
 */
export async function startCadDrawingPipeline({ file, title = "", description = "" }) {
  if (!file) {
    throw new Error("No file selected");
  }

  const form = new FormData();
  form.append("step", file);
  if (title) form.append("title", title);
  if (description) form.append("description", description);

  const { data } = await axios.post(`${BASE_URL}${TECHDRAW_PIPELINE_PATH}`, form, {
    headers: {
      ...userUuidHeader(),
    },
    timeout: CLIENT_TIMEOUT_MS,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return data;
}
