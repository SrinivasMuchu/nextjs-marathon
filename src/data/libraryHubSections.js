/** Hub section copy — tag rows are loaded from the backend (rank-sorted). */

export const LIBRARY_BROWSE_PARTS_META = {
  title: 'Browse by part & function',
  subtitle:
    'The axis engineers actually search on — pick a part type to filter the catalog.',
  seeAllHref: '/library/tags',
  seeAllLabel: 'See all parts',
};

export const TWO_D_BROWSE_PARTS_META = {
  title: 'Browse by part & function',
  subtitle:
    'The axis engineers actually search on — pick a part type to filter the 2D drawings catalog.',
  seeAllHref: '/library/2d-technical-drawings/tags',
  seeAllLabel: 'See all parts',
};

export const LIBRARY_BUILD_KITS_META = {
  title: 'Build kits',
  subtitle:
    'Curated systems with verified mating parts — download the whole assembly at once.',
  seeAllHref: '/library',
  seeAllLabel: 'All collections',
};

export const LIBRARY_BUILD_KITS = [
  {
    id: 'nema-17-motion-kit',
    kitType: 'MOTION KIT',
    title: 'NEMA 17 Motion Kit',
    description:
      'Motor, coupler, shafts & mounts for tabletop CNC, 3D printer & robotics builds.',
    partCount: 5,
    extraParts: 1,
    pairsVerified: true,
    href: '/library',
    // partLogos: [],
  },
  {
    id: 'nema-23-motion-kit',
    kitType: 'MOTION KIT',
    title: 'NEMA 23 Motion Kit',
    description:
      'Heavier stepper, coupler, shafts & brackets for larger CNC routers & automation rigs.',
    partCount: 5,
    extraParts: 2,
    pairsVerified: true,
    href: '/library',
    // partLogos: [],
  },
  {
    id: 'm5-hardware-kit',
    kitType: 'HARDWARE KIT',
    title: 'M5 Hardware Kit',
    description:
      'Bolts, nuts, washers & standoffs sized for NEMA mounts, extrusions & plate assemblies.',
    partCount: 8,
    extraParts: 37,
    pairsVerified: true,
    href: '/library',
    // partLogos: [],
  },
];
