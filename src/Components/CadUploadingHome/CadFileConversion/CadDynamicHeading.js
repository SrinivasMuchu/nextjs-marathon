import styles from '../CadHomeDesign/CadHome.module.css';
import CadDynamicHeaderWrapper from './CadDynamicHeaderWrapper'

function CadDynamicHeading({paramsText}) {
 


  return (
    <CadDynamicHeaderWrapper>
    <div className={styles['cad-landing-left-content']}>
      <h1 className={styles['cad-landing-heading']}>
        Free Online {paramsText.from.toUpperCase()} to {paramsText.to.toUpperCase()} Converter – Fast, Secure & Cloud-Based
      </h1>
      <p className={styles['cad-landing-description']}>
        Easily convert your .{paramsText.from} files to .{paramsText.to} format using our powerful online 3D CAD converter—no downloads or installations required.
      </p>
    </div>
    </CadDynamicHeaderWrapper>

  );
}

export default CadDynamicHeading;
