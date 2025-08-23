import DesignStats from "../CommonJsx/DesignStats";
import Link from "next/link";
import { ASSET_PREFIX_URL } from "@/config";
import EditableFields from "./EditableFields"; // client part
import styles from "./IndustryDesign.module.css";

export default function IndustryDesignHeader({ design, designData, type }) {
  return (
    <div className={styles["industry-design-header"]}>
      <div className={styles["industry-design-header-content"]}>
        <EditableFields
  initialTitle={designData?.page_title}
  initialDesc={designData?.page_description}
  fileId={designData?._id}
/>

      </div>

      <div className={styles["industry-design-header-viewer"]}>
        <span>Experience in 3-D</span>
        <Link
          href={`/tools/cad-renderer?fileId=${designData._id}&format=${
            designData.file_type ? designData.file_type : "step"
          }`}
          rel="nofollow"
        >
          <button>Open in 3D viewer</button>
        </Link>
        <DesignStats
          views={designData.total_design_views}
          downloads={designData.total_design_downloads}
        />
      </div>
    </div>
  );
}
