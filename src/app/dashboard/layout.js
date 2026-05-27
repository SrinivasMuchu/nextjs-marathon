/** Applies to /dashboard and nested routes (e.g. /dashboard/2d-technical-drawing/[id], …/pipeline-status/[id]). */
export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({ children }) {
  return children;
}
