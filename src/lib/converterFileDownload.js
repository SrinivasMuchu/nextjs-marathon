import { getConverterDownloadUrl, recordConverterDownload } from "@/api/converterPaymentApi";
import { converterJobParams, sendGAtagEvent } from "@/common.helper";
import { buildCadConverterOutputUrlCandidates, CAD_CONVERTER_EVENT, toCadOutputCdnUrl } from "@/config";

/**
 * FileSaver waits this long before revokeObjectURL. Revoking in the same turn
 * as click() cancels the save in Safari.
 */
const BLOB_URL_REVOKE_MS = 40_000;

function convertedDownloadName(file, override) {
  if (override) return override;
  const original = String(file?.file_name || "design").split(/[\\/]/).pop();
  const dot = original.lastIndexOf(".");
  const stem = (dot > 0 ? original.slice(0, dot) : original).trim() || "design";
  const ext = String(file?.output_format || "cad").replace(/^\./, "") || "cad";
  return `${stem}_converted.${ext}`;
}

function downloadErrorLabel(error) {
  const status = Number(error?.status || error?.response?.status);
  if (Number.isInteger(status) && status >= 400) return String(status);
  if (error?.reason) return String(error.reason);
  const fromMessage = String(error?.message || "").match(/status:\s*(\d{3})\b/);
  if (fromMessage) return fromMessage[1];
  if (error?.name && error.name !== "Error") return error.name;
  return "Error";
}

function trackConverterDownloadFailed(file, error) {
  const job = converterJobParams(file || {});
  sendGAtagEvent({
    event_name: "converter_download_failed",
    event_category: CAD_CONVERTER_EVENT,
    format_out: job.format_out || "unknown",
    size_bucket: job.size_bucket || "unknown",
    error: downloadErrorLabel(error),
  });
}

function trackConverterDownloadSucceeded() {
  sendGAtagEvent({
    event_name: "converter_file_upload_download",
    event_category: CAD_CONVERTER_EVENT,
  });
}

/** Signing endpoint missing or not configured: the public file URL may still work. */
function canUsePublicFileUrl(error) {
  const message = String(error?.message || "");
  if (message === "Download signing is not configured.") return true;
  const status = error?.response?.status;
  if (status === 404 || status === 501) return true;
  if (!error?.response && (error?.code === "ERR_NETWORK" || error?.request)) return true;
  return false;
}

function handOffBlob(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function handOffRemote(url) {
  // Cross-origin `download` is ignored. Content-Disposition on the object
  // names the file, and the browser streams it instead of leaving the page.
  window.location.assign(url);
}

function httpError(status) {
  const err = new Error(`HTTP error! status: ${status}`);
  err.status = status;
  err.name = "HttpError";
  return err;
}

/**
 * Confirm the CDN host answers before handing the URL to the browser.
 * A blocked host fails both requests. A CORS-hidden status still hands off,
 * because the file itself is not read.
 */
async function assertHostReachable(url) {
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    // HEAD is not always enabled. GET is what the browser will send.
    if (response.status === 405 || response.status === 501) return;
    if (!response.ok) throw httpError(response.status);
    return;
  } catch (error) {
    if (error?.name === "HttpError") throw error;
  }

  try {
    await fetch(url, { method: "HEAD", mode: "no-cors", cache: "no-store" });
  } catch (error) {
    if (error instanceof Error) throw error;
    const err = new Error("Download failed.");
    err.name = "TypeError";
    throw err;
  }
}

function downloadBlob(blob, filename) {
  const downloadUrl = window.URL.createObjectURL(blob);
  handOffBlob(downloadUrl, filename);
  window.setTimeout(() => window.URL.revokeObjectURL(downloadUrl), BLOB_URL_REVOKE_MS);
}

async function downloadFirstReachableBlob(urls, filename) {
  if (!urls.length) {
    const err = new Error("Download URL is missing for this conversion.");
    err.name = "MissingUrl";
    throw err;
  }

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const err = new Error(`HTTP error! status: ${response.status}`);
        err.status = response.status;
        err.name = "HttpError";
        lastError = err;
        continue;
      }
      downloadBlob(await response.blob(), filename);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Download failed.");
}

async function signedDownload(file) {
  if (!file?._id) return null;
  try {
    const data = await getConverterDownloadUrl(file._id);
    const urls = Array.isArray(data?.urls) && data.urls.length
      ? data.urls.filter(Boolean)
      : (data?.url ? [data.url] : []);
    if (!urls.length) {
      const err = new Error("Download URL is missing for this conversion.");
      err.name = "MissingUrl";
      throw err;
    }
    return { urls, fileName: data?.file_name || "" };
  } catch (error) {
    if (canUsePublicFileUrl(error)) return null;
    throw error;
  }
}

function publicOutputUrl(file) {
  const raw = file?.output_file_url;
  if (!raw || typeof raw !== "string") return "";
  return toCadOutputCdnUrl(raw) || raw;
}

function noteSaved(file) {
  trackConverterDownloadSucceeded();
  recordConverterDownload(file?._id);
}

async function handOffDirect(url, file) {
  await assertHostReachable(url);
  noteSaved(file);
  handOffRemote(url);
}

/**
 * Save a converted CAD file.
 * One confirmed file URL is handed to the browser, which streams it to disk.
 * The blob path remains for unsigned or unconfirmed keys, and its object URL
 * stays alive long enough for Safari to finish the save.
 */
export async function downloadConvertedCadFile(file) {
  const filename = convertedDownloadName(file);
  try {
    const signed = await signedDownload(file);
    if (signed?.urls?.length === 1) {
      await handOffDirect(signed.urls[0], file);
    } else if (signed?.urls?.length > 1) {
      await downloadFirstReachableBlob(signed.urls, convertedDownloadName(file, signed.fileName));
      noteSaved(file);
    } else {
      const direct = publicOutputUrl(file);
      let handedOff = false;
      let directError = null;
      if (direct) {
        try {
          await handOffDirect(direct, file);
          handedOff = true;
        } catch (error) {
          // The stored key can be stale. Other known keys are tried below.
          if (error?.name !== "HttpError") throw error;
          directError = error;
        }
      }
      if (!handedOff) {
        const candidates = buildCadConverterOutputUrlCandidates(file)
          .filter((url) => url !== direct);
        if (!candidates.length) {
          throw directError || Object.assign(new Error("Download URL is missing for this conversion."), { name: "MissingUrl" });
        }
        await downloadFirstReachableBlob(candidates, filename);
        noteSaved(file);
      }
    }
  } catch (error) {
    trackConverterDownloadFailed(file, error);
    throw error;
  }
}
