"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { ASSET_PREFIX_URL, BASE_URL, CAD_PUBLISH_EVENT } from "@/config";
import styles from "./IndustryDesign.module.css";

// optional: import sendGAtagEvent if available
// import { sendGAtagEvent } from "@/utils/analytics";

export default function EditableFields({ initialTitle, initialDesc, fileId }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");
  const [desc, setDesc] = useState(initialDesc || "");
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleUpdate = async (fieldType) => {
  setUploading(true);

  // Build payload dynamically
  let payload = { file_id: fileId, tags: [], is_downloadable: true,title : title, description : desc };

  

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/cad/create-user-cad-file`,
      payload,
      {
        headers: {
          "user-uuid": localStorage.getItem("uuid"),
        },
      }
    );

    if (response.data.meta.success) {
      if (fieldType === "title") setIsEditingTitle(false);
      if (fieldType === "description") setIsEditingDesc(false);
    } else {
      let newFormErrors = { ...formErrors };
      const validationErrors = response.data?.meta?.validationErrors;

      if (validationErrors) {
        if (fieldType === "title") {
          newFormErrors.title = validationErrors.title || "";
        }
        if (fieldType === "description") {
          newFormErrors.description = validationErrors.description || "";
        }
      } else if (response?.data?.meta?.message) {
        if (fieldType === "title") newFormErrors.title = response.data.meta.message;
        if (fieldType === "description") newFormErrors.description = response.data.meta.message;
      } else {
        newFormErrors[fieldType] = "Failed to update. Please try again.";
      }
      setFormErrors(newFormErrors);
    }
  } catch (err) {
    console.error("Error updating:", err);
  }

  setUploading(false);
};


  return (
    <>
      {/* Title */}
      <div className={styles["title-container"]}>
        {isEditingTitle ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles["edit-input"]}
              disabled={uploading}
            />
            <button onClick={() => handleUpdate("title")} disabled={uploading}>
              <Image src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={16} height={16} />
            </button>
            <button onClick={() =>{ setIsEditingTitle(false),setTitle(initialTitle)}} disabled={uploading}>
              <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16} />
            </button>
            {formErrors.title && <p className={styles["error-text"]} style={{color:'red',fontSize:'14px'}}>{formErrors.title}</p>}
          </>
        ) : (
          <>
            <h1>{title}</h1>
            <button onClick={() => setIsEditingTitle(true)}>
              <Image src={`${ASSET_PREFIX_URL}edit-ticket.png`} alt="edit" width={16} height={16} />
            </button>
          </>
        )}
      </div>

      {/* Description */}
      <div className={styles["description-container"]}>
        {isEditingDesc ? (
          <>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={styles["edit-textarea"]}
              disabled={uploading}
            />
            <button onClick={() => {handleUpdate("description"),setDesc(initialDesc)}} disabled={uploading}>
              <Image src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={16} height={16} />
            </button>
            <button onClick={() => setIsEditingDesc(false)} disabled={uploading}>
              <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16} />
            </button>
            {formErrors.description && <p className={styles["error-text"]} style={{color:'red',fontSize:'14px'}}>{formErrors.description}</p>}
          </>
        ) : (
          <>
            <p>{desc}</p>
            <button onClick={() => setIsEditingDesc(true)}>
              <Image src={`${ASSET_PREFIX_URL}edit-ticket.png`} alt="edit" width={16} height={16} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
