/**
 * Optional “Explore components” link rows keyed by industry `route` from API.
 * Fallback uses generic library CTAs for any industry without a curated list.
 */
const LIBRARY = '/library';

const AUTOMOTIVE_LINKS = [
  { href: LIBRARY, label: 'View engine block models in 3D', title: 'Engine Block' },
  { href: LIBRARY, label: 'View cylinder head models in 3D', title: 'Cylinder Head' },
  { href: LIBRARY, label: 'View crankshaft models in 3D', title: 'Crankshaft' },
  { href: LIBRARY, label: 'View brake caliper models in 3D', title: 'Brake Caliper' },
  { href: LIBRARY, label: 'View transmission housing models in 3D', title: 'Transmission Housing' },
  { href: LIBRARY, label: 'View steering knuckle models in 3D', title: 'Steering Knuckle' },
];

const AUTOMOTIVE_SECONDARY = ['Suspension Arm', 'Turbocharger', 'Radiator', 'Differential Gear'];

function genericLinks(industry) {
  const i = industry || 'your field';
  return [
    { href: LIBRARY, label: `Browse 3D CAD library for ${i}`, title: 'Component library' },
    { href: LIBRARY, label: `Explore assemblies for ${i}`, title: 'Assemblies' },
    { href: LIBRARY, label: `Review supplier STEP/IGES for ${i}`, title: 'Supplier files' },
    { href: LIBRARY, label: `Preview mesh models for ${i}`, title: 'Mesh previews' },
    { href: LIBRARY, label: `Inspect solids online for ${i}`, title: 'Solid models' },
    { href: LIBRARY, label: `Share 3D views for ${i}`, title: 'Collaboration' },
  ];
}

export function getIndustryExploreLinks(route, industryLabel) {
  if (route === 'automotive-industry') {
    return { primary: AUTOMOTIVE_LINKS, secondary: AUTOMOTIVE_SECONDARY };
  }
  return { primary: genericLinks(industryLabel), secondary: [] };
}
