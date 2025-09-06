import DesignStats from "../CommonJsx/DesignStats";
import Link from "next/link";
import { ASSET_PREFIX_URL } from "@/config";
import EditableFields from "./EditableFields"; // client part
import styles from "./IndustryDesign.module.css";
import { org } from './../OrganizationHome/OrgHome';
import DownloadClientButton from "../CommonJsx/DownloadClientButton";

export default function IndustryDesignHeader({ design, designData, type }) {
  return (
    
     

      <div className={styles["industry-design-header-viewer"]}>
        {/* <span>Experience in 3-D</span> */}
        <div style={{width:'100%',display:'flex',alignItems:'flex-start',}}>
    <DesignStats
            views={designData.total_design_views}
            downloads={designData.total_design_downloads}
            ratings={{ average: designData.average_rating, total: designData.total_ratings }} />


        </div>
      
        <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'10px',justifyContent:'center',width:'100%'}}>
            <DownloadClientButton custumDownload={true}
          folderId={designData._id} isDownladable={designData.is_downloadable} step={true} filetype={designData.file_type ? designData.file_type : 'step'} />
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
