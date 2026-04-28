"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DesignStats from "../CommonJsx/DesignStats";
import styles from "./IndustryDesign.module.css";
import { BASE_URL } from "@/config";

import DownloadClientButton from "../CommonJsx/DownloadClientButton";

function getOrCreateUuid() {
  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    uuid = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("uuid", uuid);
  }
  return uuid;
}

export default function IndustryDesignHeader({ design, designData, type }) {
  const [isRequestingViewer, setIsRequestingViewer] = useState(false);
  const router = useRouter();

  const handleRequestGlbViewer = async () => {
    const formatType = designData?.file_type ? designData.file_type.toLowerCase() : "step";
    if (designData?.is_glb) {
      router.push(`/tools/cad-renderer?designId=${designData?._id}&glb=true&ready=true`);
      return;
    }
    try {
      setIsRequestingViewer(true);
      const response = await axios.post(
        `${BASE_URL}/v1/cad/request-glb-viewer`,
        {
          design_id: designData?._id,
          format_type: formatType,
        },
        {
          headers: {
            "user-uuid": getOrCreateUuid(),
          },
        }
      );

      if (response?.data?.meta?.success) {
        const successMessage = response?.data?.meta?.message || "Viewer request submitted.";
        toast.success(successMessage);
        const isAlreadyReady = /already available/i.test(successMessage);
        router.push(
          `/tools/cad-renderer?designId=${designData?._id}&glb=true${isAlreadyReady ? "&ready=true" : ""}`
        );
      } else {
        toast.error(response?.data?.meta?.message || "Failed to submit viewer request.");
      }
    } catch (error) {
      console.error("Error requesting GLB viewer:", error);
      toast.error("Failed to submit viewer request.");
    } finally {
      setIsRequestingViewer(false);
    }
  };

  return (
    
     
     
      <div className={styles["industry-design-header-viewer"]}>
         {/* <EditableFields initialTitle={designData.response.page_title} initialDesc={designData.page_description} fileId={designData._id} orgId={designData._id}/> */}
        {/* <span>Experience in 3-D</span> */}
        <div style={{width:'100%',display:'flex',alignItems:'flex-start',}}>
          {designData.price? <p style={{fontSize:'24px',fontWeight:'500'}}>${designData.price}<span style={{fontSize:'16px',fontWeight:'400',color:'#001325'}}>/download</span></p>:<p style={{fontSize:'24px',fontWeight:'500'}}>Free</p>}
        </div>
      
        <div className={styles.statsCont}>
            <DownloadClientButton custumDownload={true} 
          folderId={designData._id} isDownladable={designData.is_downloadable} step={true} filetype={designData.file_type ? designData.file_type : 'step'} 
          designPrice={designData?.price} designDetails={{
                                        title: designData.page_title, // You can pass actual design title here
                                        description: designData.page_description, // You can pass actual design description here
                                        price: designData.price, // Use the designPrice prop
                                        // Add other design details as needed
                                    }}/>
        {designData.file_type !== 'dxf' && designData.file_type !== 'dwg' && (
        <button
          type="button"
          className={styles.viewerButton}
          onClick={handleRequestGlbViewer}
          disabled={isRequestingViewer}
        >
          {isRequestingViewer ? "Opening 3D viewer..." : "Open in 3D viewer"}
        </button>
        )}
        </div>
        <div style={{width:'100%',display:'flex',alignItems:'flex-start',}}>
    <DesignStats
            views={designData.total_design_views}
            downloads={designData.total_design_downloads}
            ratings={{ average: designData.average_rating, total: designData.rating_count }} />


        </div>
        
      </div>
  
  );
}
