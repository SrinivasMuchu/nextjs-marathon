/** Form option lists for CAD service brief. Mapped to existing API fields:
 * service → what_do_you_need
 * modelUse (timeline) → model_use
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
  { value: 'As soon as possible', label: 'As soon as possible' },
  { value: 'Within 1 week', label: 'Within 1 week' },
  { value: 'Within 2 to 4 weeks', label: 'Within 2 to 4 weeks' },
  { value: 'More than 1 month', label: 'More than 1 month' },
  { value: 'Ongoing support', label: 'Ongoing support' },
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
