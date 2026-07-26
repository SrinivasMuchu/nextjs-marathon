/** Form option lists for CAD service brief. Mapped to existing API fields:
 * service → what_do_you_need
 * modelUse (timeline) → model_use
 * budget → budget
 * softwareFormat → software_format
 */

export const SERVICE_OPTIONS = [
  { value: '', label: 'Select the closest option' },
  { value: 'Mechanical part or component', label: 'Mechanical part or component' },
  { value: 'Assembly', label: 'Assembly' },
  { value: 'Technical drawing or drafting', label: 'Technical drawing or drafting' },
  { value: 'Product enclosure', label: 'Product enclosure' },
  { value: 'Manufacturing-ready CAD', label: 'Manufacturing-ready CAD' },
  { value: 'Reverse engineering', label: 'Reverse engineering' },
  { value: 'File conversion', label: 'File conversion' },
  { value: 'BIM or architectural CAD', label: 'BIM or architectural CAD' },
  { value: 'Other', label: 'Other' },
]

export const MODEL_USE_OPTIONS = [
  { value: '', label: 'Select timeline' },
  { value: '7 days', label: '7 days' },
  { value: '15 days', label: '15 days' },
  { value: '1 month', label: '1 month' },
  { value: '2 months', label: '2 months' },
  { value: '3 months', label: '3 months' },
  { value: '> 3 months', label: '> 3 months' },
]

export const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget' },
  { value: '<20k', label: '<20k' },
  { value: '20k-50k', label: '20k-50k' },
  { value: '50k-1L', label: '50k-1L' },
  { value: '1L-2L', label: '1L-2L' },
  { value: '2-3', label: '2-3' },
  { value: '3-4', label: '3-4' },
  { value: '4-5', label: '4-5' },
  { value: '>5', label: '>5' },
]

export const SOFTWARE_FORMAT_OPTIONS = [
  { value: '', label: 'No preference or not sure' },
  { value: 'SOLIDWORKS', label: 'SOLIDWORKS' },
  { value: 'Fusion 360', label: 'Fusion 360' },
  { value: 'AutoCAD', label: 'AutoCAD' },
  { value: 'Creo', label: 'Creo' },
  { value: 'CATIA', label: 'CATIA' },
  { value: 'Onshape', label: 'Onshape' },
  { value: 'Inventor', label: 'Inventor' },
  { value: 'Siemens NX', label: 'Siemens NX' },
  { value: 'Other', label: 'Other' },
]
