import { CAD_CONVERTER_EVENT } from "@/config";
import { sendGAtagEvent } from "@/common.helper";
import { getConverterDownloadUrl, recordConverterDownload } from "@/api/converterPaymentApi";
import { requestFeedbackPrompt } from "@/lib/feedbackPrompt";

function saveBlob(blob, fileName) {
  const href = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(href);
}

function openUrl(url) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function fallbackFileName(file) {
  const original = file?.file_name || "design";
  const dot = original.lastIndexOf(".");
  const stem = dot > 0 ? original.slice(0, dot) : original;
  return `${stem}_converted.${file?.output_format || "cad"}`;
}

/**
 * Download a converted file. The file is private: the server checks ownership and
 * payment / credit / free slot, then returns short-lived signed URL(s).
 * The file is fetched and saved as `<name>_converted.<ext>`, the same as before, so
 * old files (stored without a download name) and new ones save the same way.
 * If the browser can't fetch it (network / CORS), the signed link is opened instead.
 */
export async function downloadConverterFile(file, { prompt = true } = {}) {
  if (!file?._id) throw new Error("Download URL is missing for this conversion.");
  await fetchAndSaveConverterFile(file);
  // Ask only after the file has actually saved (D6). Card payments pass prompt:false —
  // those stars are already on the success screen.
  if (prompt) requestFeedbackPrompt({ jobId: file._id, jobType: "converter" });
}

async function fetchAndSaveConverterFile(file) {
  const data = await getConverterDownloadUrl(file._id);
  const urls = (Array.isArray(data?.urls) && data.urls.length ? data.urls : [data?.url]).filter(Boolean);
  if (!urls.length) throw new Error("Download URL is missing for this conversion.");
  const fileName = data?.file_name || fallbackFileName(file);

  let blob = null;
  let fetchBlocked = false;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        blob = await response.blob();
        break;
      }
    } catch {
      // Network or CORS error: the link itself may still work in the browser.
      fetchBlocked = true;
    }
  }

  if (blob) {
    saveBlob(blob, fileName);
  } else if (fetchBlocked) {
    openUrl(urls[0]);
  } else {
    throw new Error("Download failed.");
  }

  sendGAtagEvent({
    event_name: "converter_file_upload_download",
    event_category: CAD_CONVERTER_EVENT,
  });
  recordConverterDownload(file._id);
}
