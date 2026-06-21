import React from 'react';
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css';

/** Parse conversion segment (e.g. "stl-to-step") to { from, to } on the server. */
export function parseConversionParams(conversionParams) {
  if (!conversionParams || typeof conversionParams !== 'string') return { from: '', to: '' };
  const segment = conversionParams.split('/').filter(Boolean).pop() || conversionParams;
  const parts = segment.split(/-to-|_to_|_/i);
  const from = (parts[0] || '').replace(/\.\w+$/, '');
  const to = (parts[1] || '').replace(/\.\w+$/, '');
  return { from, to };
}

/**
 * Server-rendered H1 + intro for /tools/convert-{from}-to-{to} pages.
 * Keeps SEO copy out of the client component tree.
 */
function ConvertPageHeroHeading({ conversionParams }) {
  const { from, to } = parseConversionParams(conversionParams);
  const fromUpper = from ? from.toUpperCase() : '';
  const toUpper = to ? to.toUpperCase() : '';

  return (
    <div className={heroStyles.heroDynamicBlock}>
      <h1 className={heroStyles.title}>
        Free Online {fromUpper} to {toUpper}{' '}
        <span className={heroStyles.titleAccent}>Converter</span>
      </h1>
      <p className={heroStyles.description}>
        {from && to
          ? `Easily convert your .${from} files to .${to} format using our powerful online 3D CAD converter—no downloads or installations required.`
          : 'Easily convert your 3D files using our powerful online 3D CAD converter—no downloads or installations required.'}
      </p>
    </div>
  );
}

export default ConvertPageHeroHeading;
