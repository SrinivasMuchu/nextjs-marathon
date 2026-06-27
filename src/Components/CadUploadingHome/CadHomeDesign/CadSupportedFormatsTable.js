import React from 'react';
import Link from 'next/link';
import cadStyles from './CadHome.module.css';
import heroStyles from './CadViewerHero.module.css';

const FORMAT_ROWS = [
  {
    format: 'STEP',
    extensions: '.step, .stp',
    actions: [
      { label: 'View STEP files', href: '/tools/step-file-viewer' },
      { label: 'convert STEP to STL', href: '/tools/convert-step-to-stl' },
    ],
  },
  {
    format: 'IGES',
    extensions: '.igs, .iges',
    actions: [
      { label: 'View IGES files', href: '/tools/iges-file-viewer' },
      { label: 'convert IGES to STEP', href: '/tools/convert-iges-to-step' },
    ],
  },
  {
    format: 'STL',
    extensions: '.stl',
    actions: [
      { label: 'View STL files', href: '/tools/stl-file-viewer' },
      { label: 'convert STL to STEP', href: '/tools/convert-stl-to-step' },
    ],
  },
  {
    format: 'OBJ',
    extensions: '.obj',
    actions: [{ label: 'View OBJ files', href: '/tools/obj-file-viewer' }],
  },
  {
    format: 'PLY',
    extensions: '.ply',
    actions: [{ label: 'View PLY files', href: '/tools/ply-file-viewer' }],
  },
  {
    format: 'OFF',
    extensions: '.off',
    actions: [{ label: 'View OFF files', href: '/tools/off-file-viewer' }],
  },
  {
    format: 'BREP',
    extensions: '.brp, .brep',
    actions: [{ label: 'View BREP files', href: '/tools/brep-file-viewer' }],
  },
];

function CadSupportedFormatsTable() {
  return (
    <div className={heroStyles.formatsTableWrap}>
      <div className={`${cadStyles['cad-conversion-table']} ${cadStyles['cad-conversion-table--dark']} ${heroStyles.formatsTable}`}>
        <table>
          <thead>
            <tr>
              <th>Format</th>
              <th>Extensions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {FORMAT_ROWS.map((row) => (
              <tr key={row.format}>
                <td data-label="Format">{row.format}</td>
                <td data-label="Extensions">{row.extensions}</td>
                <td data-label="Action">
                  {row.actions.map((action, index) => (
                    <React.Fragment key={action.href}>
                      {index > 0 ? ', ' : null}
                      <Link href={action.href} className={heroStyles.formatsTableLink}>
                        {action.label}
                      </Link>
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CadSupportedFormatsTable;
