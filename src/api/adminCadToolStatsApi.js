import axios from "axios";
import { BASE_URL } from "@/config";

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

export async function getAdminCadToolStats({ range = "today" } = {}) {
  const { data } = await axios.get(`${BASE_URL}/v1/admin-pannel/get-cad-tool-stats`, {
    params: { range },
    headers: adminHeaders(),
    timeout: 30_000,
  });
  return unwrap(data);
}

export async function getAdminCadToolStatsDetail({
  type,
  range = "today",
  date,
  page = 1,
  limit = 20,
} = {}) {
  const params = { type, range, page, limit };
  if (date) params.date = date;

  const { data } = await axios.get(`${BASE_URL}/v1/admin-pannel/get-cad-tool-stats-detail`, {
    params,
    headers: adminHeaders(),
    timeout: 30_000,
  });
  return unwrap(data);
}
