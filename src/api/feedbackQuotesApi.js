import { BASE_URL } from "@/config";

const FEEDBACK_API_BASE = "/v1/cad/feedback";

/** Flow 8: published quotes and the honest average for a converter page (server or client). */
export async function getPublicQuotes({ route, family } = {}) {
  const params = new URLSearchParams();
  if (route) params.set("route", route);
  if (family) params.set("family", family);
  const res = await fetch(`${BASE_URL}${FEEDBACK_API_BASE}/quotes?${params.toString()}`, {
    next: { revalidate: 3600 }, // a withdrawn quote leaves the page within the hour (promise: 24 h)
    signal: AbortSignal.timeout(5000), // never hold up a page render or a build on the API
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.meta?.success ? json.data : null;
}
