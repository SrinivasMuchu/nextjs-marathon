import styles from '../CadHomeDesign/CadHome.module.css';
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css';
import CadDynamicHeaderWrapper from './CadDynamicHeaderWrapper'

/** Parse conversion segment (e.g. "step-to-stl") to { from, to } for stable first-paint and CLS */
function parseConversionParams(conversionParams) {
  if (!conversionParams || typeof conversionParams !== 'string') return { from: '', to: '' };
  const segment = conversionParams.split('/').filter(Boolean).pop() || conversionParams;
  const parts = segment.split(/-to-|_to_|_/i);
  let from = (parts[0] || '').replace(/\.\w+$/, '');
  let to = (parts[1] || '').replace(/\.\w+$/, '');
  return { from, to };
}

function CadDynamicHeading({ paramsText, conversionParams, heroTone }) {
  // Use server-known conversionParams for first paint to avoid CLS; context updates after hydration
  const initial = conversionParams ? parseConversionParams(conversionParams) : null;
  const from = (paramsText?.from || initial?.from) || '';
  const to = (paramsText?.to || initial?.to) || '';
  const isDark = heroTone === 'dark';

  return (
    <CadDynamicHeaderWrapper>
    <div className={isDark ? heroStyles.heroDynamicBlock : styles['cad-landing-left-content']}>
      {isDark ? (
        <h1 className={heroStyles.title}>
          Free Online {from ? from.toUpperCase() : ''} to {to ? to.toUpperCase() : ''}{' '}
          <span className={heroStyles.titleAccent}>Converter</span>
        </h1>
      ) : (
        <h1 className={styles['cad-landing-heading']}>
          Free Online {from ? from.toUpperCase() : ''} to {to ? to.toUpperCase() : ''} Converter – Fast, Secure & Cloud-Based
        </h1>
      )}
      <p className={isDark ? heroStyles.description : styles['cad-landing-description']}>
        {from && to
          ? `Easily convert your .${from} files to .${to} format using our powerful online 3D CAD converter—no downloads or installations required.`
          : 'Easily convert your 3D files using our powerful online 3D CAD converter—no downloads or installations required.'}
      </p>
    </div>
    </CadDynamicHeaderWrapper>

  );
}

export default CadDynamicHeading;
