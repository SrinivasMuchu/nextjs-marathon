"use client"
import React from "react"
import styles from "./Footer.module.css"
import Image from "next/image"
import { IMAGEURLS } from "@/config"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import FooterForm from "./FooterForm"

function Footer() {
  const pathname = usePathname()
  const router = useRouter()

  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault()

    if (pathname !== "/") {
      router.push(`/#${sectionId}`)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className={styles["footer-page"]}>
      <div className={styles["footer-page-cont"]}>
        {/* <div className={styles["footer-left"]}> */}
          <div className={styles["footer-logo"]}>
            <Image
              src={IMAGEURLS.footerLogo}
              alt="Marathon OS logo"
              width={160}
              height={30}
            />
            <span>Simplifying Cloud PDM &amp; PLM</span>
          </div>

          {/* <div className={styles["footer-navs-group"]}> */}
            <div className={styles["footer-navs"]}>
              <Link href="#home" onClick={(e) => handleAnchorClick(e, "home")}>
                Home
              </Link>
              <Link href="/about-us">About us</Link>
              <Link
                href="#why-us"
                onClick={(e) => handleAnchorClick(e, "why-us")}
              >
                Why us?
              </Link>
              <Link href="/contact-us">Contact us</Link>
              {/* <Link
                href="#product"
                onClick={(e) => handleAnchorClick(e, "product")}
              >
                Product
              </Link>
              <Link
                href="#pricing"
                onClick={(e) => handleAnchorClick(e, "pricing")}
              >
                Pricing
              </Link> */}
            </div>

            <div className={styles["footer-navs"]}>
             
              <Link href="/library">Library</Link>
              <Link href="/tools/org-hierarchy">Org Hierarchy</Link>
            
              <Link href="/tools/cad-viewer">CAD Viewer</Link>
              <Link href="/tools/3d-file-converter">CAD Converter</Link>
            </div>
          {/* </div> */}
        {/* </div> */}

        <FooterForm styles={styles} />
      </div>

      <div className={styles["footer-bottom"]}>
        <div className={styles["footer-bottom-links"]}>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <span>|</span>
          <Link href="/terms-and-conditions">Terms of Service</Link>
          <span>|</span>
          <Link href="/refund-policy">Refund Policy</Link>
          <span>|</span>
          <Link
            href="https://www.linkedin.com/company/marathon-os/"
            aria-label="Marathon OS LinkedIn"
            target="_blank"
          >
            <LinkedInIcon style={{ width: "20px", height: "20px" }} />
          </Link>
        </div>
        <div className={styles["footer-bottom-right"]}>
          
          <span>© Marathon 2025 All Rights Reserved</span>
        </div>
      </div>
    </div>
  )
}

export default Footer
