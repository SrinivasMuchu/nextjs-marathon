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
          {designData.price? <p style={{fontSize:'24px',fontWeight:'500'}}>${designData.price}<span style={{fontSize:'16px',fontWeight:'400',color:'#001325'}}>/download</span></p>:<p style={{fontSize:'24px',fontWeight:'500'}}>Free</p>}
        </div>
      
        <div className={styles.statsCont} style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',width:'100%'}}>
            <DownloadClientButton custumDownload={true} 
          folderId={designData._id} isDownladable={designData.is_downloadable} step={true} filetype={designData.file_type ? designData.file_type : 'step'} 
          designPrice={designData?.price} designDetails={{
                                        title: designData.page_title, // You can pass actual design title here
                                        description: designData.page_description, // You can pass actual design description here
                                        price: designData.price, // Use the designPrice prop
                                        // Add other design details as needed
                                    }}/>
 <Link 
          href={`/tools/cad-renderer?fileId=${designData._id}&format=${
            designData.file_type ? designData.file_type : "step"
          }`}
          rel="nofollow"
        >
          <button style={{ 
                              
                              color: 'white', 
                              fontSize: '20px',
                              background: '#610BEE',
                              borderRadius: '4px',
                              height: '48px',
                              padding: '10px 20px',
                              border: 'none',
                              width: 'auto'
                            }}>Open in 3D viewer</button>
          <button style={{ 
                              
                              color: 'white', 
                              fontSize: '20px',
                              background: '#610BEE',
                              borderRadius: '4px',
                              height: '48px',
                              padding: '10px 20px',
                              border: 'none',
                              width: 'auto'
                            }}>Open in 3D viewer</button>
        </Link>
       
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
