import DesignStats from "../CommonJsx/DesignStats";
import Link from "next/link";// client part
import styles from "./IndustryDesign.module.css";

import DownloadClientButton from "../CommonJsx/DownloadClientButton";

export default function IndustryDesignHeader({ design, designData, type }) {

  return (
    
     
     
      <div className={styles["industry-design-header-viewer"]}>
         {/* <EditableFields initialTitle={designData.response.page_title} initialDesc={designData.page_description} fileId={designData._id} orgId={designData._id}/> */}
        {/* <span>Experience in 3-D</span> */}
        <div style={{width:'100%',display:'flex',alignItems:'flex-start',}}>
    <DesignStats
            views={designData.total_design_views}
            downloads={designData.total_design_downloads}
            ratings={{ average: designData.average_rating, total: designData.rating_count }} />


        </div>
      
        <div className={styles.statsCont} style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',width:'100%'}}>
            <DownloadClientButton custumDownload={true} 
          folderId={designData._id} isDownladable={designData.is_downloadable} step={true} filetype={designData.file_type ? designData.file_type : 'step'} 
          designPrice={designData?.price} />
 <Link
          href={`/tools/cad-renderer?fileId=${designData._id}&format=${
            designData.file_type ? designData.file_type : "step"
          }`}
          rel="nofollow"
        >
          <button>Open in 3D viewer</button>
        </Link>
       
        </div>
        
      </div>
  
  );
}
