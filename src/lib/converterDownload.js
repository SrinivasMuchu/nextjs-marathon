import { CAD_CONVERTER_EVENT } from "@/config";
import { sendGAtagEvent } from "@/common.helper";
import { getConverterDownloadUrl, recordConverterDownload } from "@/api/converterPaymentApi";

/**
 * Download a converted file. The file is private: the server checks ownership and
 * payment / credit / free claim, then returns a short-lived signed URL. The object
 * carries its own Content-Disposition (`<name>_converted.<ext>`), so the browser
 * saves it without leaving the page.
 */
export async function downloadConverterFile(file) {
  if (!file?._id) throw new Error("Download URL is missing for this conversion.");
  const { url } = await getConverterDownloadUrl(file._id);
  if (!url) throw new Error("Download URL is missing for this conversion.");

  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  sendGAtagEvent({
    event_name: "converter_file_upload_download",
    event_category: CAD_CONVERTER_EVENT,
  });
  recordConverterDownload(file._id);
}
