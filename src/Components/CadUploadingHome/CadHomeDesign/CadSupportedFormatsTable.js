import React from 'react';
import Link from 'next/link';
import { Box, ChevronRight, Info } from 'lucide-react';
import styles from './CadSupportedFormatsTable.module.css';

const FORMAT_ROWS = [
  {
    format: 'STEP',
    description: 'Standard for the Exchange of Product model data',
    extensions: '.step, .stp',
    iconBg: 'rgba(124, 58, 237, 0.28)',
    iconFg: '#d8c4ff',
    actions: [
      { label: 'View STEP files', href: '/tools/step-file-viewer' },
      { label: 'convert STEP to STL', href: '/tools/convert-step-to-stl' },
    ],
  },
  {
    format: 'IGES',
    description: 'Initial Graphics Exchange Specification',
    extensions: '.igs, .iges',
    iconBg: 'rgba(34, 197, 94, 0.24)',
    iconFg: '#b8f5cc',
    actions: [
      { label: 'View IGES files', href: '/tools/iges-file-viewer' },
      { label: 'convert IGES to STEP', href: '/tools/convert-iges-to-step' },
    ],
  },
  {
    format: 'STL',
    description: 'Stereolithography mesh for 3D printing',
    extensions: '.stl',
    iconBg: 'rgba(59, 130, 246, 0.26)',
    iconFg: '#c5dcff',
    actions: [
      { label: 'View STL files', href: '/tools/stl-file-viewer' },
      { label: 'convert STL to STEP', href: '/tools/convert-stl-to-step' },
    ],
  },
  {
    format: 'OBJ',
    description: 'Wavefront 3D object with materials',
    extensions: '.obj',
    iconBg: 'rgba(249, 115, 22, 0.26)',
    iconFg: '#ffd4b0',
    actions: [{ label: 'View OBJ files', href: '/tools/obj-file-viewer' }],
  },
  {
    format: 'PLY',
    description: 'Polygon file format for 3D scans',
    extensions: '.ply',
    iconBg: 'rgba(236, 72, 153, 0.24)',
    iconFg: '#ffc4e2',
    actions: [{ label: 'View PLY files', href: '/tools/ply-file-viewer' }],
  },
  {
    format: 'OFF',
    description: 'Object File Format polygon mesh',
    extensions: '.off',
    iconBg: 'rgba(20, 184, 166, 0.24)',
    iconFg: '#b6f3ea',
    actions: [{ label: 'View OFF files', href: '/tools/off-file-viewer' }],
  },
  {
    format: 'BREP',
    description: 'Boundary representation CAD solid',
    extensions: '.brp, .brep',
    iconBg: 'rgba(234, 179, 8, 0.24)',
    iconFg: '#ffe9a3',
    actions: [{ label: 'View BREP files', href: '/tools/brep-file-viewer' }],
  },
  {
    format: '3DM',
    description: 'Rhinoceros 3D model format',
    extensions: '.3dm',
    iconBg: 'rgba(6, 182, 212, 0.24)',
    iconFg: '#b8f3ff',
    actions: [
      { label: 'View 3DM files', href: '/tools/3dm-file-viewer' },
      { label: 'convert STEP to 3DM', href: '/tools/convert-step-to-3dm' },
      { label: 'convert 3DM to STEP', href: '/tools/convert-3dm-to-step' },
    ],
  },
];

function CadSupportedFormatsTable() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.head} aria-hidden="true">
          <span>Format</span>
          <span>Extensions</span>
          <span className={styles.headAction}>Action</span>
        </div>

        <ul className={styles.list}>
          {FORMAT_ROWS.map((row) => {
            const primaryHref = row.actions[0]?.href || '/tools/3d-cad-file-converter';
            return (
              <li key={row.format} className={styles.row}>
                <div className={styles.format}>
                  <span
                    className={styles.icon}
                    style={{ '--icon-bg': row.iconBg, '--icon-fg': row.iconFg }}
                    aria-hidden
                  >
                    <Box size={18} strokeWidth={2.1} />
                  </span>
                  <div className={styles.formatCopy}>
                    <strong>{row.format}</strong>
                    <p>{row.description}</p>
                  </div>
                </div>

                <p className={styles.ext}>{row.extensions}</p>

                <div className={styles.actions}>
                  {row.actions.map((action, index) => (
                    <React.Fragment key={action.href}>
                      {index > 0 ? <span className={styles.sep}>, </span> : null}
                      <Link href={action.href} className={styles.link}>
                        {action.label}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>

                <Link
                  href={primaryHref}
                  className={styles.chevron}
                  aria-label={`${row.format} actions`}
                >
                  <ChevronRight size={16} strokeWidth={2.4} />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.note}>
          <Info size={15} strokeWidth={2.2} aria-hidden />
          <p>Supported file formats for 3D models. Secure, fast and easy conversions.</p>
        </div>
      </div>
    </div>
  );
}

export default CadSupportedFormatsTable;
