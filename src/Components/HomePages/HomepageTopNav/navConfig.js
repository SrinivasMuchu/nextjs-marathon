import {
  BookOpen,
  Box,
  Building2,
  Eye,
  FileOutput,
  FileText,
  HelpCircle,
  LayoutGrid,
  Library,
  Network,
  Newspaper,
  RefreshCw,
  SquareStack,
  Users,
  Wrench,
} from "lucide-react";

export const LIBRARY_MENU = [
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

export const BLOGS_MENU = [
  {
    href: "/blog/part-number-nomenclature-guide",
    title: "Part Number Nomenclature Guide",
    subtitle: "How to structure and read part numbers",
    Icon: BookOpen,
  },
];

export const TOOLS_MENU = [
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
    Icon: RefreshCw,
  },
  {
    href: "/tools/cad-drawing-pipeline",
    title: "3D to 2D Drawing Pipeline",
    subtitle: "Generate 2D drawings from 3D CAD",
    Icon: FileOutput,
  },
];

export const MOBILE_MAIN_NAV = [
  { id: "why-us", label: "Why us?", href: "/#why-us", type: "anchor", anchor: "why-us", Icon: HelpCircle },
  { id: "dashboard", label: "Dashboard", href: "/dashboard", type: "link", Icon: LayoutGrid },
  { id: "library", label: "Library", type: "submenu", items: LIBRARY_MENU, Icon: Library },
  {
    id: "hire",
    label: "Hire Designers",
    href: "/cad-services",
    type: "link",
    highlight: true,
    Icon: Users,
  },
  { id: "tools", label: "Tools", type: "submenu", items: TOOLS_MENU, Icon: Wrench },
  { id: "resources", label: "Resources", href: "/resources", type: "link", Icon: FileText },
  { id: "blogs", label: "Blogs", type: "submenu", items: BLOGS_MENU, Icon: Newspaper },
];
