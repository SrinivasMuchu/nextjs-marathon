"use client";
import { usePathname } from 'next/navigation';
import styles from '../CadHomeDesign/CadHome.module.css';

function CadDynamicHeading() {
  const pathname = usePathname();
  
  // Debugging: Log the full pathname
  console.log("Full Pathname:", pathname);

  // Split path and get all segments
  const pathSegments = pathname.split('/').filter(Boolean);

  // Debugging: Log extracted segments
  console.log("Path Segments:", pathSegments);

  // Get the last segment dynamically
  const formatsSegment = pathSegments.at(-1) ?? '';

  // Debugging: Log the raw segment used for extraction
  console.log("Raw formatsSegment:", formatsSegment);

  // Extract 'from' and 'to' dynamically
  let from = "dwg", to = "stl";
  if (formatsSegment) {
    const extracted = formatsSegment.split(/-to-|_to_|_/i);
    
    // Debugging: Log the split result
    console.log("Extracted Parts:", extracted);
    
    if (extracted.length === 2) {
      [from, to] = extracted;
    }
  }

  // Remove file extensions if present
  from = from.replace(/\.\w+$/, '');
  to = to.replace(/\.\w+$/, '');

  // Debugging: Final extracted values
  console.log('Final Extracted:', { from, to });

  return (
    <div className={styles['cad-landing-left-content']}>
      <h1 className={styles['cad-landing-heading']}>
        Free Online {from.toUpperCase()} to {to.toUpperCase()} Converter – Fast, Secure & Cloud-Based
      </h1>
      <p className={styles['cad-landing-description']}>
        Easily convert your .{from} files to .{to} format using our powerful online 3D CAD converter—no downloads or installations required.
      </p>
    </div>
  );
}

export default CadDynamicHeading;
