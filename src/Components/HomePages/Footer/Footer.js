"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMAGEURLS } from "@/config";
import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footerPage}>
      <div className={styles.footerShell}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logoLink} aria-label="Marathon home">
              <Image
                src={IMAGEURLS.logo}
                alt="Marathon Logo"
                width={500}
                height={500}
                className={styles.footerLogo}
              />
            </Link>
            <p>
              The specialist CAD conversion platform for engineering, mesh and drawing workflows.
            </p>
            <Link className={styles.footerPrimary} href="/tools/3d-cad-file-converter">
              Start a conversion
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Convert</strong>
            <Link href="/tools/3d-cad-file-converter">All 60+ conversion tools</Link>
            <Link href="/tools/convert-step-to-stl">STEP to STL</Link>
            <Link href="/tools/convert-stl-to-step">STL to STEP</Link>
            <Link href="/tools/convert-iges-to-step">IGES to STEP</Link>
            <Link href="/tools/convert-dwg-to-dxf">DWG to DXF</Link>
            <Link href="/tools/cad-drawing-pipeline">STEP or STP to 2D</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Products</strong>
            <Link href="/library">3D CAD Products</Link>
            <Link href="/library/2d-technical-drawings">2D CAD Products</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Tools and services</strong>
            <Link href="/tools">All CAD Tools</Link>
            <Link href="/tools/3d-cad-viewer">3D CAD Viewer</Link>
            <Link href="/cad-services">Hire a CAD Designer</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Company</strong>
            <Link href="/">Home</Link>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact-us">Contact Us</Link>
          </div>

          <div className={styles.footerColumn}>
            <strong>Legal</strong>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {year} Marathon OS. All rights reserved.</span>
          <span>Convert precisely. Download confidently. Keep moving.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
