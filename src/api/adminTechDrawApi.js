import axios from "axios";
import { BASE_URL } from "@/config";
import { TechDrawPollError } from "@/api/cadDrawingPipelineApi";

const POLL_INTERVAL_MS = 3_000;
const STATUS_REQUEST_TIMEOUT_MS = 60_000;
const MAX_POLL_TRANSIENT_ERRORS = 24;

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

export async function getAdminTechDrawJobs({ page = 1, limit = 10, q = "", action = "all" } = {}) {
  const params = { page, limit, q };
  if (action !== "all") params.action = action;

  const { data } = await axios.get(`${BASE_URL}/v1/admin-pannel/get-techdraw-jobs`, {
    params,
    headers: adminHeaders(),
    timeout: 30_000,
  });

  return unwrap(data);
}

export async function getAdminTechDrawJobStatus(jobId) {
  const { data } = await axios.get(`${BASE_URL}/v1/admin-pannel/get-techdraw-job/${jobId}`, {
    headers: adminHeaders(),
    timeout: STATUS_REQUEST_TIMEOUT_MS,
  });

  const payload = unwrap(data);
  return { job: payload.job };
}

function isTransientPollError(err) {
  if (axios.isAxiosError(err)) {
    const code = err.code;
    if (code === "ECONNABORTED" || code === "ERR_NETWORK" || code === "ETIMEDOUT") return true;
    const status = err.response?.status;
    if (status === 502 || status === 503 || status === 504 || status === 429) return true;
  }
  return false;
}

export async function pollAdminTechDrawJobUntilDone(jobId, opts = {}) {
  let consecutiveErrors = 0;

  while (true) {
    if (opts.signal?.aborted) {
      throw new TechDrawPollError("Polling cancelled", { jobId, transient: true });
    }

    try {
      const { job } = await getAdminTechDrawJobStatus(jobId);
      consecutiveErrors = 0;
      opts.onJob?.(job);

      if (job?.status === "COMPLETED") {
        return job;
      }

      if (job?.status === "FAILED") {
        throw new TechDrawPollError(job.error_message || "Pipeline failed on the server.", {
          jobId,
          job,
          transient: false,
        });
      }
    } catch (err) {
      if (err instanceof TechDrawPollError && !err.transient) {
        throw err;
      }

      consecutiveErrors += 1;
      if (consecutiveErrors >= MAX_POLL_TRANSIENT_ERRORS) {
        throw new TechDrawPollError(
          "Could not reach the status API. The pipeline may still be running on the server.",
          { jobId, transient: true },
        );
      }

      if (!isTransientPollError(err) && !(err instanceof TechDrawPollError)) {
        throw new TechDrawPollError(err?.message || "Status check failed", {
          jobId,
          transient: consecutiveErrors < MAX_POLL_TRANSIENT_ERRORS,
        });
      }
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

export async function waitForAdminTechDrawJob(jobId, onPhase) {
  onPhase?.("processing");
  const job = await pollAdminTechDrawJobUntilDone(jobId, {
    onJob: (j) => onPhase?.("status", j),
  });
  return { job, jobId };
}

export function adminTechDrawPipelineStatusPath(jobId) {
  const id = String(jobId || "").trim();
  return `/admin/techdraw/${encodeURIComponent(id)}/pipeline-status`;
}

export function adminTechDrawDesignPath(jobId) {
  const id = String(jobId || "").trim();
  return `/admin/techdraw/${encodeURIComponent(id)}/design`;
}
