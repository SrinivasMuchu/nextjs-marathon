"use client";

import { useSearchParams } from "next/navigation";
import AdminPannelAuthentication from "@/Components/AdminPannel/AdminPannelAuthentication";
import { safeNextPath } from "@/lib/testingServerGate";

export default function TestingAccessGate() {
  const searchParams = useSearchParams();

  const continueToSite = () => {
    // Full load so the new admin cookie is sent. Client-side replace
    // was replaying the cached redirect back to this login page.
    window.location.replace(safeNextPath(searchParams.get("next") || "/"));
  };

  return (
    <AdminPannelAuthentication
      setIsAuthenticated={continueToSite}
      setShowLogin={() => {}}
      title="Testing server"
      subtitle="Sign in with your admin account to open this site."
      solid
    />
  );
}
