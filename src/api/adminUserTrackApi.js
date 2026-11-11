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

export async function getAdminUserTrack(query) {
  const { data } = await axios.get(`${BASE_URL}/v1/admin-pannel/get-user-track`, {
    params: { q: query },
    headers: adminHeaders(),
    timeout: 30_000,
  });
  return unwrap(data);
}

export async function getAdminUserTrackDetail({
  orgId,
  section,
  window: windowId = "all",
  status = "all",
  page = 1,
  limit = 20,
} = {}) {
  const { data } = await axios.get(`${BASE_URL}/v1/admin-pannel/get-user-track-detail`, {
    params: {
      org_id: orgId,
      section,
      window: windowId,
      status,
      page,
      limit,
    },
    headers: adminHeaders(),
    timeout: 30_000,
  });
  return unwrap(data);
}
