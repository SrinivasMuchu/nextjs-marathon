export const CAD_SERVICE_STATUSES = [
  {
    value: 'pending',
    label: 'Pending',
    color: '#9ca3af',
    description: 'Request submitted, not yet reviewed by admin.',
  },
  {
    value: 'sent_to_agency',
    label: 'Sent to agency',
    color: '#3b82f6',
    description: 'Admin has forwarded the request to a CAD agency for review.',
  },
  {
    value: 'quotation_sent',
    label: 'Quotation sent',
    color: '#a855f7',
    description: 'Agency has responded with a quote; client needs to review and accept.',
  },
  {
    value: 'clarification_needed',
    label: 'Clarification needed',
    color: '#ec4899',
    description: 'Agency has sent questions back — client must respond before work can begin.',
  },
  {
    value: 'in_progress',
    label: 'In progress',
    color: '#14b8a6',
    description: 'Agency is actively working on the CAD deliverable.',
  },
  {
    value: 'revision_requested',
    label: 'Revision requested',
    color: '#f97316',
    description: 'Client reviewed deliverable and asked for changes.',
  },
  {
    value: 'delivered',
    label: 'Delivered',
    color: '#9ca3af',
    description: 'Final files sent to client. Awaiting approval or revision feedback.',
  },
  {
    value: 'approved',
    label: 'Approved',
    color: '#22c55e',
    description: 'Client accepted the deliverable. Request is closed successfully.',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: '#ef4444',
    description: 'Request declined — either by admin at intake or by client after delivery.',
  },
]

export const CAD_SERVICE_STATUS_MAP = Object.fromEntries(
  CAD_SERVICE_STATUSES.map((status) => [status.value, status])
)

export function normalizeCadServiceStatus(status) {
  if (!status) return 'pending'
  return CAD_SERVICE_STATUS_MAP[status] ? status : 'pending'
}

export function getCadServiceStatusLabel(status) {
  return CAD_SERVICE_STATUS_MAP[normalizeCadServiceStatus(status)]?.label || 'Pending'
}

export function getCadServiceStatusColor(status) {
  return CAD_SERVICE_STATUS_MAP[normalizeCadServiceStatus(status)]?.color || '#9ca3af'
}
