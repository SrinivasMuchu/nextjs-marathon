"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminPannel from "@/Components/AdminPannel/AdminPannel";
import { adminHrefForTab } from "@/Components/AdminPannel/adminTabConfig";
import TechDrawJobRouteGuard from "@/Components/CadDrawingPipeline/TechDrawJobRouteGuard";
import TechDrawJobDesignView from "@/Components/CadDrawingPipeline/TechDrawJobDesignView";
import {
  adminTechDrawDesignPath,
  adminTechDrawPipelineStatusPath,
  getAdminTechDrawJobStatus,
} from "@/api/adminTechDrawApi";

export default function AdminTechDrawDesignPage() {
  return (
    <Suspense fallback={null}>
      <AdminTechDrawDesignContent />
    </Suspense>
  );
}

function AdminTechDrawDesignContent() {
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
            href={adminTechDrawPipelineStatusPath(jobId)}
            style={{ color: "#610bee", fontSize: 14 }}
          >
            View pipeline logs
          </Link>
        </div>
        <TechDrawJobRouteGuard
          jobId={jobId}
          mode="design"
          fetchJobStatus={getAdminTechDrawJobStatus}
          getDesignPath={adminTechDrawDesignPath}
          getPipelineStatusPath={adminTechDrawPipelineStatusPath}
        >
          <TechDrawJobDesignView
            jobId={jobId}
            fetchJobStatus={getAdminTechDrawJobStatus}
            adminMode
            getPipelineStatusPath={adminTechDrawPipelineStatusPath}
            getDesignPath={adminTechDrawDesignPath}
          />
        </TechDrawJobRouteGuard>
      </div>
    </AdminPannel>
  );
}
