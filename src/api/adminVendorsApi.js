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

export async function sendCadVendorMail(payload) {
  const response = await axios.post(
    `${ADMIN_VENDORS_BASE}/cad-vendor-mail`,
    payload,
    { headers: adminHeaders() },
  )
  return response.data
}
