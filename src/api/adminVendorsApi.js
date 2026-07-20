import axios from 'axios'
import { BASE_URL } from '@/config'

const ADMIN_VENDORS_BASE = `${BASE_URL}/v1/admin-pannel`

function adminHeaders() {
  return { 'admin-uuid': localStorage.getItem('admin-uuid') }
}

export async function fetchVendorCategories(q = '') {
  const response = await axios.get(`${ADMIN_VENDORS_BASE}/vendor-categories`, {
    params: q ? { q } : undefined,
    headers: adminHeaders(),
  })
  return response.data
}

export async function createVendorCategory(name) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/vendor-categories`,
    { action: 'create', name },
    { headers: adminHeaders() },
  )
  return response.data
}

export async function fetchVendors(params = {}) {
  const response = await axios.get(`${ADMIN_VENDORS_BASE}/vendors`, {
    params,
    headers: adminHeaders(),
  })
  return response.data
}

export async function fetchVendorById(vendorId) {
  const response = await axios.get(`${ADMIN_VENDORS_BASE}/vendors`, {
    params: { vendor_id: vendorId },
    headers: adminHeaders(),
  })
  return response.data
}

export async function createVendor(payload) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/vendors`,
    { action: 'create', ...payload },
    { headers: adminHeaders() },
  )
  return response.data
}

export async function updateVendor(payload) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/vendors`,
    { action: 'update', ...payload },
    { headers: adminHeaders() },
  )
  return response.data
}

export async function deleteVendor(vendorId) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/vendors`,
    { action: 'delete', vendor_id: vendorId },
    { headers: adminHeaders() },
  )
  return response.data
}

export async function fetchCadVendorMailPreview(requestId) {
  const response = await axios.get(`${ADMIN_VENDORS_BASE}/cad-vendor-mail`, {
    params: { request_id: requestId },
    headers: adminHeaders(),
  })
  return response.data
}

export async function previewCadVendorMail({ request_id, subject, content }) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/cad-vendor-mail`,
    { action: 'preview', request_id, subject, content },
    { headers: adminHeaders() },
  )
  return response.data
}

export async function sendCadVendorMail(payload) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/cad-vendor-mail`,
    payload,
    { headers: adminHeaders() },
  )
  return response.data
}

export async function uploadCadServiceReferenceFile(file, requestId, signal) {
  const presignedResponse = await axios.post(
    `${ADMIN_VENDORS_BASE}/get-cad-service-reference-presigned-url`,
    {
      request_id: requestId,
      file: file.name,
      filesize: file.size,
      content_type: file.type || 'application/octet-stream',
    },
    { headers: adminHeaders(), signal },
  )

  if (!presignedResponse.data?.meta?.success || !presignedResponse.data?.data?.url) {
    throw new Error(
      presignedResponse.data?.meta?.message || 'Failed to get reference file upload URL',
    )
  }

  const { url, key, content_type } = presignedResponse.data.data
  await axios.put(url, file, {
    headers: { 'Content-Type': content_type || file.type || 'application/octet-stream' },
    signal,
  })

  const updateResponse = await axios.post(
    `${ADMIN_VENDORS_BASE}/update-cad-service-reference-file`,
    { request_id: requestId, key },
    { headers: adminHeaders(), signal },
  )

  return updateResponse.data
}

export async function fetchCadServiceQuotations(requestId, vendorId) {
  const params = { request_id: requestId }
  if (vendorId) params.vendor_id = vendorId

  const response = await axios.get(`${ADMIN_VENDORS_BASE}/cad-service-quotations`, {
    params,
    headers: adminHeaders(),
  })
  return response.data
}

export async function getQuotationPresignedUrl({ file, filesize, content_type, request_id }) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/get-quotation-presigned-url`,
    { file, filesize, content_type, request_id },
    { headers: adminHeaders() },
  )
  return response.data
}

export async function uploadQuotationFile(file, requestId, signal) {
  const presigned = await getQuotationPresignedUrl({
    file: file.name,
    filesize: file.size,
    content_type: file.type || 'application/octet-stream',
    request_id: requestId,
  })

  if (!presigned?.meta?.success || !presigned?.data?.url) {
    throw new Error(presigned?.meta?.message || 'Failed to get quotation upload URL')
  }

  const { url, key, file_url, content_type } = presigned.data
  await axios.put(url, file, {
    headers: { 'Content-Type': content_type || file.type || 'application/octet-stream' },
    signal,
  })

  return {
    name: file.name,
    type: content_type || file.type || 'application/octet-stream',
    size: file.size,
    key,
    url: file_url,
  }
}

export async function createCadServiceQuotation(payload) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/cad-service-quotations`,
    { action: 'create', ...payload },
    { headers: adminHeaders() },
  )
  return response.data
}

export async function fetchCadServiceActivity(requestId) {
  const response = await axios.get(`${ADMIN_VENDORS_BASE}/cad-service-activity`, {
    params: { request_id: requestId },
    headers: adminHeaders(),
  })
  return response.data
}

export async function addCadServiceNote(requestId, note) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/cad-service-activity`,
    { request_id: requestId, note },
    { headers: adminHeaders() },
  )
  return response.data
}
