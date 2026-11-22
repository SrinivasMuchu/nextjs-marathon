import axios from "axios";
import { BASE_URL } from "@/config";

const ROOT = `${BASE_URL}/v1/cad/feedback/admin`;

function adminHeaders() {
  if (typeof window === "undefined") return {};
  const adminUuid = localStorage.getItem("admin-uuid");
  return adminUuid ? { "admin-uuid": adminUuid } : {};
}

function unwrap(data) {
  if (!data?.meta?.success) {
    const msg = data?.meta?.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data.data;
}

function cleanParams(params) {
  const out = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") out[key] = value;
  });
  return out;
}

async function get(path, params) {
  const { data } = await axios.get(`${ROOT}${path}`, {
    params: cleanParams(params),
    headers: adminHeaders(),
    timeout: 30_000,
  });
  return unwrap(data);
}

async function send(method, path, body) {
  const { data } = await axios({
    method,
    url: `${ROOT}${path}`,
    data: body || {},
    headers: adminHeaders(),
    timeout: 30_000,
  });
  return unwrap(data);
}

export const FEEDBACK_FAMILY_LABELS = {
  mesh_to_solid: "Mesh → solid",
  solid_to_mesh: "Solid → mesh",
  solid_to_solid: "Solid → solid",
  mesh_to_mesh: "Mesh → mesh",
  dwg_dxf: "DWG / DXF",
  drawing: "3D → 2D drawings",
};

export function familyLabel(family) {
  return FEEDBACK_FAMILY_LABELS[family] || family || "—";
}

export function getFeedbackSummary({ weeks = 4 } = {}) {
  return get("/summary", { weeks });
}

export function getFeedbackRatings({ page = 1, limit = 20, family, moment, max_rating } = {}) {
  return get("/ratings", { page, limit, family, moment, max_rating });
}

export function getFeedbackCases({ status, owner } = {}) {
  const statusParam = Array.isArray(status) ? status.join(",") : status;
  return get("/cases", { status: statusParam, owner });
}

export function updateFeedbackCase(id, { status, note } = {}) {
  const body = {};
  if (status) body.status = status;
  if (note) body.note = note;
  return send("patch", `/cases/${encodeURIComponent(id)}`, body);
}

export function replyFeedbackCase(id, message) {
  return send("post", `/cases/${encodeURIComponent(id)}/reply`, { message });
}

export function markFeedbackCaseFixed(id, { send_email = true, note } = {}) {
  const body = { send_email: Boolean(send_email) };
  if (note) body.note = note;
  return send("post", `/cases/${encodeURIComponent(id)}/fixed`, body);
}

export function getFeedbackTestimonials({ status = "pending" } = {}) {
  return get("/testimonials", { status });
}

export function moderateFeedbackTestimonial(id, { action, reason } = {}) {
  const body = { action };
  if (reason) body.reason = reason;
  return send("post", `/testimonials/${encodeURIComponent(id)}/moderate`, body);
}
