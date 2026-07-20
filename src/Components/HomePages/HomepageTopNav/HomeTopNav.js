"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  Box,
  Building2,
  Eye,
  FileOutput,
  LayoutGrid,
  Network,
  SquareStack,
} from "lucide-react";
import styles from "./HomeTopNav.module.css";
import TopNavProfileButton from "../../CommonJsx/TopNavProfileButton";
import MenuButton from "@/Components/CommonJsx/MenuButton";

const TOOLS_MENU = [
  {
    href: "/tools",
    title: "All tools",
    subtitle: "Browse every Marathon tool",
    Icon: LayoutGrid,
  },
  {
    href: "/tools/industries",
    title: "All industries",
    subtitle: "Explore by industry category",
    Icon: Building2,
  },
  {
    href: "/tools/org-hierarchy",
    title: "Org Hierarchy",
    subtitle: "Map parts to organization structure",
    Icon: Network,
  },
  {
    href: "/tools/3d-cad-viewer",
    title: "CAD Viewer",
    subtitle: "Open the online model viewer",
    Icon: Eye,
  },
  {
    href: "/tools/3d-cad-file-converter",
    title: "CAD File Convert",
    subtitle: "STEP ⇄ STL ⇄ IGES ⇄ DXF",
    Icon: ArrowLeftRight,
  },
  {
    href: "/tools/cad-drawing-pipeline",
    title: "3D to 2D Drawing Pipeline",
    subtitle: "Generate 2D drawings from 3D CAD",
    Icon: FileOutput,
  },
];

const LIBRARY_MENU = [
  {
    href: "/library",
    title: "3D Library",
    subtitle: "Browse and manage 3D CAD models",
    Icon: Box,
  },
  {
    href: "/library/2d-technical-drawings",
    title: "2D Library",
    subtitle: "Browse 2D technical drawings",
    Icon: SquareStack,
  },
];

const BLOGS_MENU = [
  {
    href: "/blog/part-number-nomenclature-guide",
    title: "Part Number Nomenclature Guide",
    subtitle: "How to structure and read part numbers",
    Icon: BookOpen,
  },
];

function renderNavDropdownMenu(items, label, onClose) {
  return (
    <div className={styles.toolsDropdownMenu} role="menu" aria-label={label}>
      {items.map(({ href, title, subtitle, Icon }) => (
        <Link
          key={href}
          href={href}
          role="menuitem"
          className={styles.toolsDropdownCard}
          onClick={onClose}
        >
          <span className={styles.toolsDropdownIcon} aria-hidden="true">
            <Icon size={20} strokeWidth={2} />
          </span>
          <span className={styles.toolsDropdownText}>
            <span className={styles.toolsDropdownTitle}>{title}</span>
            <span className={styles.toolsDropdownSubtitle}>{subtitle}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function HomeTopNav() {
  const [openDropdown, setOpenDropdown] = useState(null); // Store dropdown name
  const topNavRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!openDropdown) return undefined;

    const handleClickOutside = (event) => {
      if (topNavRef.current && !topNavRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault();
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleDropdown = (e,dropdownName) => {
    e.stopPropagation()
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleNavHover = (dropdownName = null) => {
    setOpenDropdown(dropdownName);
  };

  // Add this handler inside your component
  const handleDashboardClick = () => {
    setOpenDropdown(null);
    router.refresh();
  };

  return (
    <div
      ref={topNavRef}
      className={styles["home-page-top"]}
      onClick={() => setOpenDropdown(null)}
    >
      <Link href="/">
        <Image
          src={IMAGEURLS.logo}
          alt="Marathon Logo"
          width={500}
          height={500}
          className={styles["home-page-top-logo"]}
          priority
        />
      </Link>

      <div className={styles["home-page-navs"]}>
        <Link
          href="#why-us"
          onMouseEnter={() => handleNavHover(null)}
          onClick={(e) => handleAnchorClick(e, "why-us")}
        >
          Why us?
        </Link>
        {/* <Link href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Capabilities</Link>
        <Link href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</Link>
        <Link href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</Link> */}
        {/* <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a> */}

        {/* Dropdown for Tools */}
      

        <Link
          href="/dashboard"
          rel="nofollow"
          onMouseEnter={() => handleNavHover(null)}
          onClick={handleDashboardClick}
        >
          Dashboard
        </Link>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => handleNavHover("library")}
        >
          <Link
            href="/library"
            className={styles["nav-dropdown-trigger"]}
            onClick={() => setOpenDropdown(null)}
          >
            Library <span aria-hidden>▼</span>
          </Link>
          {openDropdown === "library" &&
            renderNavDropdownMenu(LIBRARY_MENU, "Library", () => setOpenDropdown(null))}
        </div>
        <Link
          href="/cad-services"
          className={styles.topCta}
          aria-label="Hire Designers"
          onMouseEnter={() => handleNavHover(null)}
        >
          <span className={styles.topCtaDot} />
          Hire Designers <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => handleNavHover("tools")}
        >
          <Link
            href="/tools"
            className={styles["nav-dropdown-trigger"]}
            onClick={() => setOpenDropdown(null)}
          >
            Tools <span aria-hidden>▼</span>
          </Link>
          {openDropdown === "tools" &&
            renderNavDropdownMenu(TOOLS_MENU, "Tools", () => setOpenDropdown(null))}
        </div>

        <Link href="/resources" onMouseEnter={() => handleNavHover(null)}>
          Resources
        </Link>

        {/* Dropdown for Blogs */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => handleNavHover("blogs")}
        >
          <span
            className={styles["nav-dropdown-trigger"]}
            role="button"
            tabIndex={0}
            onClick={(e) => toggleDropdown(e,"blogs")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleDropdown(e, "blogs");
            }}
          >
            Blogs <span aria-hidden>▼</span>
          </span>
          {openDropdown === "blogs" &&
            renderNavDropdownMenu(BLOGS_MENU, "Blogs", () => setOpenDropdown(null))}
        </div>
      </div>

      <div className={styles["home-pg-btns"]}>
        <TopNavProfileButton styles={styles} className={"try-demo"} topBar='profile'/>
      </div>

      <div className={styles["home-pg-menu"]}>
        <MenuButton styles={{ styles }} />
      </div>
    </div>
  );
}

export default HomeTopNav;
