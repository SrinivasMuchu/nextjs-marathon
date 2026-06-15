"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminPannel from "@/Components/AdminPannel/AdminPannel";
import { adminHrefForTab } from "@/Components/AdminPannel/adminTabConfig";
import CadDrawingPipelineStatus from "@/Components/CadDrawingPipeline/CadDrawingPipelineStatus";
import TechDrawJobRouteGuard from "@/Components/CadDrawingPipeline/TechDrawJobRouteGuard";
import {
  adminTechDrawDesignPath,
  adminTechDrawPipelineStatusPath,
  getAdminTechDrawJobStatus,
  waitForAdminTechDrawJob,
} from "@/api/adminTechDrawApi";

export default function AdminTechDrawPipelineStatusPage() {
  return (
    <Suspense fallback={null}>
      <AdminTechDrawPipelineStatusContent />
    </Suspense>
  );
}

function AdminTechDrawPipelineStatusContent() {
  const params = useParams();
  const jobId = params?.job_id ? String(params.job_id) : "";

  if (!jobId) {
    return (
      <AdminPannel initialTab="techdraw-jobs">
        <p style={{ padding: 24, fontFamily: "system-ui" }}>
          Missing job id.{" "}
          <Link href={adminHrefForTab("techdraw-jobs")} style={{ color: "#610bee" }}>
            Back to admin
          </Link>
        </p>
      </AdminPannel>
    );
  }

  return (
    <AdminPannel initialTab="techdraw-jobs">
      <div style={{ padding: "0 8px 24px" }}>
        <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={adminHrefForTab("techdraw-jobs")} style={{ color: "#610bee", fontSize: 14 }}>
            ← Admin panel
          </Link>
          <Link
            href={adminTechDrawDesignPath(jobId)}
            style={{ color: "#610bee", fontSize: 14 }}
          >
            View design
          </Link>
        </div>
        <TechDrawJobRouteGuard
          jobId={jobId}
          mode="pipeline"
          fetchJobStatus={getAdminTechDrawJobStatus}
          getDesignPath={adminTechDrawDesignPath}
          getPipelineStatusPath={adminTechDrawPipelineStatusPath}
        >
          <CadDrawingPipelineStatus
            jobId={jobId}
            fetchJobStatus={getAdminTechDrawJobStatus}
            waitForJob={waitForAdminTechDrawJob}
            autoRedirectToDesign={false}
            getDesignPath={adminTechDrawDesignPath}
            adminMode
          />
        </TechDrawJobRouteGuard>
      </div>
    </AdminPannel>
  );
}
