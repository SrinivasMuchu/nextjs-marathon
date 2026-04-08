import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL, BUCKET, CAD_VIEWER_EVENT } from "@/config";
import { sendGAtagEvent } from "@/common.helper";

function sendSizeGATags(fileSizeMB) {
  if (fileSizeMB < 5) {
    sendGAtagEvent({ event_name: "viewer_file_upload_under_5mb", event_category: CAD_VIEWER_EVENT });
  } else if (fileSizeMB < 10) {
    sendGAtagEvent({ event_name: "viewer_file_upload_5_10mb", event_category: CAD_VIEWER_EVENT });
  } else if (fileSizeMB < 50) {
    sendGAtagEvent({ event_name: "viewer_file_upload_10_50mb", event_category: CAD_VIEWER_EVENT });
  } else if (fileSizeMB < 100) {
    sendGAtagEvent({ event_name: "viewer_file_upload_50_100mb", event_category: CAD_VIEWER_EVENT });
  } else if (fileSizeMB < 200) {
    sendGAtagEvent({ event_name: "viewer_file_upload_100_200mb", event_category: CAD_VIEWER_EVENT });
  } else if (fileSizeMB < 300) {
    sendGAtagEvent({ event_name: "viewer_file_upload_200_300mb", event_category: CAD_VIEWER_EVENT });
  } else {
    sendGAtagEvent({ event_name: "viewer_file_upload_size_exceeded", event_category: CAD_VIEWER_EVENT });
  }
}

async function createCad(uploadFile, link, { setUploadingMessage, setIsLoading, setUploadProgressPercent, onSuccess, onFailure }) {
  try {
    setIsLoading(true);
    const HEADERS = { "user-uuid": localStorage.getItem("uuid") };
    setUploadingMessage("UPLOADINGFILE");
    const response = await axios.post(
      `${BASE_URL}/v1/cad/create-cad`,
      {
        cad_view_link: link,
        file_name: uploadFile.name,
        s3_bucket: "design-glb",
        uuid: localStorage.getItem("uuid"),
      },
      { headers: HEADERS }
    );

    if (response.data.meta.success) {
      onSuccess(String(response.data.data));
    } else {
      setUploadingMessage("");
      toast.error(response.data.meta.message);
      onFailure();
    }
  } catch (error) {
    console.log(error);
    setIsLoading(false);
    setUploadProgressPercent(null);
    onFailure();
  }
}

async function completeMultipartUpload(data, parts, fileSizeMB, uploadFile, ctx) {
  const { setIsLoading, setUploadingMessage, setUploadProgressPercent, onFailure } = ctx;
  try {
    setIsLoading(true);
    setUploadingMessage("UPLOADINGFILE");
    const multipartPayload = {
      key: data.key,
      upload_id: data.upload_id,
      parts,
    };

    const preSignedURL = await axios.post(
      `${BASE_URL}/v1/cad/get-next-presigned-url`,
      {
        bucket_name: BUCKET,
        file: multipartPayload,
        category: "complete_mutipart",
        uuid: localStorage.getItem("uuid"),
        filesize: fileSizeMB,
      },
      { headers: { "user-uuid": localStorage.getItem("uuid") } }
    );

    if (preSignedURL.data.meta.code === 200 && preSignedURL.data.meta.message === "SUCCESS") {
      sendGAtagEvent({ event_name: "viewer_file_upload_success", event_category: CAD_VIEWER_EVENT });
      await createCad(uploadFile, preSignedURL.data.data.Location, ctx);
      return true;
    }
    setIsLoading(false);
    setUploadProgressPercent(null);
    onFailure();
  } catch (error) {
    console.error("Error completing multipart upload:", error);
    setIsLoading(false);
    setUploadProgressPercent(null);
    onFailure();
  }
}

async function multiUpload(data, uploadFile, headers, fileSizeMB, ctx) {
  const partLoaded = Array.from({ length: data.total_parts }, () => 0);
  const { setUploadProgressPercent } = ctx;

  const uploadPart = async (partNumber, part) => {
    const { url } = data.url[partNumber];
    const result = await axios.put(url, part, {
      headers: uploadFile.type ? { "Content-Type": uploadFile.type } : {},
      onUploadProgress: (ev) => {
        partLoaded[partNumber] = ev.loaded;
        const sum = partLoaded.reduce((a, b) => a + b, 0);
        const pct = uploadFile.size ? Math.min(100, Math.round((sum / uploadFile.size) * 100)) : 0;
        setUploadProgressPercent(pct);
      },
    });
    const etag = result.headers["etag"] || result.headers["ETag"];
    return { ETag: etag, PartNumber: partNumber + 1 };
  };

  const parts = [];
  for (let i = 0; i < data.total_parts; i++) {
    const start = i * data.part_size;
    const end = Math.min(start + data.part_size, uploadFile.size);
    const part = uploadFile.slice(start, end);
    parts.push(uploadPart(i, part));
  }

  try {
    const uploadedParts = await Promise.all(parts);
    setUploadProgressPercent(100);
    await completeMultipartUpload(data, uploadedParts, fileSizeMB, uploadFile, ctx);
  } catch (error) {
    console.error("Error uploading parts:", error);
    setUploadProgressPercent(null);
    throw error;
  }
}

async function simpleUpload(data, uploadFile, ctx) {
  const { setUploadingMessage, setUploadProgressPercent } = ctx;
  setUploadingMessage("UPLOADINGFILE");
  setUploadProgressPercent(0);
  const result = await axios.put(data.url, uploadFile, {
    headers: uploadFile.type ? { "Content-Type": uploadFile.type } : {},
    onUploadProgress: (ev) => {
      if (!uploadFile.size) return;
      const total = ev.total || uploadFile.size;
      const pct = Math.min(100, Math.round(((ev.loaded ?? 0) / total) * 100));
      setUploadProgressPercent(pct);
    },
  });
  setUploadProgressPercent(100);
  sendGAtagEvent({ event_name: "viewer_file_upload_success", event_category: CAD_VIEWER_EVENT });
  await createCad(uploadFile, data.url, ctx);
}

/**
 * Presign → S3 (simple or multipart) → create-cad.
 * @param {File} file
 * @param {{ setUploadProgressPercent: Function, setUploadingMessage: Function, setIsLoading: Function, onSuccess: (fileId: string) => void, onFailure: () => void }} handlers
 */
export async function uploadCadViewerFile(file, handlers) {
  const { setUploadProgressPercent, setUploadingMessage, setIsLoading, onSuccess, onFailure } = handlers;

  const fail = () => {
    setIsLoading(false);
    setUploadProgressPercent(null);
    onFailure();
  };

  if (!file) {
    console.error("uploadCadViewerFile: no file");
    fail();
    return;
  }

  const fileSizeMB = file.size / (1024 * 1024);

  try {
    setIsLoading(true);
    setUploadingMessage("UPLOADINGFILE");
    setUploadProgressPercent(0);
    sendGAtagEvent({ event_name: "viewer_file_upload_start", event_category: CAD_VIEWER_EVENT });
    sendSizeGATags(fileSizeMB);

    const headers = {
      "user-uuid": localStorage.getItem("uuid"),
    };

    const preSignedURL = await axios.post(
      `${BASE_URL}/v1/cad/get-next-presigned-url`,
      {
        bucket_name: BUCKET,
        file: file.name,
        category: "designs_upload",
        filesize: fileSizeMB,
      },
      { headers }
    );

    if (
      preSignedURL.data.meta.code === 200 &&
      preSignedURL.data.meta.message === "SUCCESS" &&
      preSignedURL.data.data.url
    ) {
      const ctx = { setUploadProgressPercent, setUploadingMessage, setIsLoading, onSuccess, onFailure: fail };
      if (preSignedURL.data.data.is_mutipart) {
        await multiUpload(preSignedURL.data.data, file, headers, fileSizeMB, ctx);
      } else {
        await simpleUpload(preSignedURL.data.data, file, ctx);
      }
    } else {
      sendGAtagEvent({ event_name: "viewer_file_signedurl_error", event_category: CAD_VIEWER_EVENT });
      toast.error("⚠️ Error generating signed URL.");
      setIsLoading(false);
      setUploadProgressPercent(null);
      onFailure();
    }
  } catch (e) {
    sendGAtagEvent({ event_name: "viewer_file_upload_error", event_category: CAD_VIEWER_EVENT });
    setIsLoading(false);
    setUploadProgressPercent(null);
    onFailure();
  }
}
