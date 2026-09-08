import axios from 'axios';
import { BASE_URL } from '@/config';
import {
  cadConverterStatusPath,
  saveCadConverterJobPreview,
} from '@/lib/cadConverterRoutes';
import {
  hideConverterLoadingOverlay,
  persistConverterLoadingOverlay,
  showConverterLoadingOverlay,
} from '@/lib/converterLoadingOverlay';

function userUuidHeader() {
  if (typeof window === 'undefined') return {};
  const uuid = window.localStorage.getItem('uuid');
  return uuid ? { 'user-uuid': uuid } : {};
}

/**
 * Resolve a library design CAD file for converter / drawing-pipeline tools.
 * Returns a long-lived CloudFront signed URL + file metadata.
 */
export async function fetchLibrarySourceForTool(designId) {
  const id = String(designId || '').trim();
  if (!id) throw new Error('design_id is required');

  const { data } = await axios.get(
    `${BASE_URL}/v1/cad/library-source-for-tool?design_id=${encodeURIComponent(id)}`,
    {
      headers: userUuidHeader(),
      timeout: 30_000,
    },
  );

  if (!data?.meta?.success || !data?.data?.download_url) {
    throw new Error(data?.meta?.message || 'Could not load library file for conversion.');
  }

  return data.data;
}

/**
 * Fetch library CAD bytes via same-origin proxy (avoids CloudFront CORS in the browser).
 * Used by the 2D drawing pipeline which needs a File for S3 upload.
 */
export async function fetchLibrarySourceFile(designId) {
  const id = String(designId || '').trim();
  if (!id) throw new Error('design_id is required');

  const res = await fetch(`/api/library-cad-file?designId=${encodeURIComponent(id)}`, {
    headers: userUuidHeader(),
  });

  if (!res.ok) {
    let message = 'Could not load library file.';
    try {
      const body = await res.json();
      message = body?.meta?.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const fileName =
    res.headers.get('x-file-name') ||
    decodeURIComponent(
      (res.headers.get('content-disposition') || '').match(/filename="?([^"]+)"?/)?.[1] || '',
    ) ||
    `library-model.${(res.headers.get('x-file-type') || 'step').toLowerCase()}`;
  const pageTitle = res.headers.get('x-page-title')
    ? decodeURIComponent(res.headers.get('x-page-title'))
    : '';

  return {
    file: new File([blob], fileName, { type: blob.type || 'application/octet-stream' }),
    fileName,
    pageTitle,
    fileType: (res.headers.get('x-file-type') || 'step').toLowerCase(),
  };
}

/**
 * Create converter job from library design, then caller navigates to
 * /cad-convertor?fileid= (pending / not-converted status page).
 */
export async function startLibraryFormatConversion({
  designId,
  outputFormat,
  showOverlay = true,
} = {}) {
  const id = String(designId || '').trim();
  const output = String(outputFormat || '')
    .toLowerCase()
    .replace(/^\./, '');
  if (!id) throw new Error('design_id is required');
  if (!output) throw new Error('output_format is required');

  if (typeof window !== 'undefined' && !window.localStorage.getItem('is_verified')) {
    const err = new Error('Please verify your email to convert files.');
    err.code = 'AUTH_REQUIRED';
    throw err;
  }

  const headers = userUuidHeader();

  const limitRes = await axios.get(`${BASE_URL}/v1/cad/validate-operations`, {
    headers,
    timeout: 30_000,
  });
  if (!limitRes.data?.meta?.success) {
    const err = new Error(limitRes.data?.meta?.message || 'Conversion limit reached.');
    err.code = 'LIMIT_EXCEEDED';
    throw err;
  }

  if (showOverlay) {
    showConverterLoadingOverlay({
      uploadingMessage: 'PENDING',
      fileName: `library → ${output.toUpperCase()}`,
      outputFormat: output,
      isSampleFile: false,
    });
  }

  try {
    const { data } = await axios.post(
      `${BASE_URL}/v1/cad/convert-from-library`,
      { design_id: id, output_format: output },
      { headers, timeout: 60_000 },
    );

    if (!data?.meta?.success || !data?.data?.job_id) {
      throw new Error(data?.meta?.message || 'Could not start conversion.');
    }

    const jobId = String(data.data.job_id);
    saveCadConverterJobPreview({
      fileId: jobId,
      fileName: data.data.file_name || '',
      outputFormat: data.data.output_format || output,
      fileSize: null,
      isSampleFile: false,
    });
    persistConverterLoadingOverlay();

    return {
      jobId,
      statusPath: cadConverterStatusPath(jobId),
      fileName: data.data.file_name || '',
      outputFormat: data.data.output_format || output,
      pageTitle: data.data.page_title || '',
    };
  } catch (error) {
    hideConverterLoadingOverlay();
    throw error;
  }
}
