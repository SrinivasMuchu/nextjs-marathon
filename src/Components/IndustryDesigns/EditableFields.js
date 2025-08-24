"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { ASSET_PREFIX_URL, BASE_URL, CAD_PUBLISH_EVENT } from "@/config";
import styles from "./IndustryDesign.module.css";

// optional: import sendGAtagEvent if available
// import { sendGAtagEvent } from "@/utils/analytics";

export default function EditableFields({ initialTitle, initialDesc, fileId, orgId }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");
  const [desc, setDesc] = useState(initialDesc || "");
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isEditable, setIsEditable] = useState(true)
  // /check-cad-editable

  useEffect(() => {
    if (!orgId || !fileId) return;

    const checkEditable = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/v1/cad/check-cad-editable`, {
          params: { cad_id: fileId },
          headers: {
            "user-uuid": localStorage.getItem("uuid"),
          },
        });

        console.log("Check Editable Response:", result.data);

        // if (result.data.meta.success) {
        //   setIsEditable(true)
        // } else {
        //   setIsEditable(false)

        // }
      } catch (error) {
        console.error("Error checking editable:", error);
      }
    };

    checkEditable();
  }, [orgId, fileId]);


  const handleUpdate = async (fieldType) => {
    setUploading(true);

    // Build payload dynamically
    let payload = { file_id: fileId, tags: [], is_downloadable: true, title: title, description: desc };



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
         setIsEditingTitle(false);
         setIsEditingDesc(false);
      } else {
        let newFormErrors = { ...formErrors };
        const validationErrors = response.data?.meta?.validationErrors;

        if (validationErrors) {
          // if (fieldType === "title") {
            newFormErrors.title = validationErrors.title || "";
          // }
          // if (fieldType === "description") {
            newFormErrors.description = validationErrors.description || "";
          // }
        } else if (response?.data?.meta?.message) {
           newFormErrors.title = response.data.meta.message;
           newFormErrors.description = response.data.meta.message;
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
            <button onClick={() => { setIsEditingTitle(false), setTitle(initialTitle) }} disabled={uploading}>
              <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16} />
            </button>
          </>
        ) : (
          <>
            <h1>{title}</h1>
            {isEditable &&
              <button onClick={() => setIsEditingTitle(true)}>
                <Image src={`${ASSET_PREFIX_URL}edit-ticket.png`} alt="edit" width={16} height={16} />
              </button>}
          </>
        )}
                    {formErrors.title && <p className={styles["error-text"]} style={{ color: 'red', fontSize: '14px' }}>{formErrors.title}</p>}

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
            <button onClick={() => { handleUpdate("description"), setDesc(initialDesc) }} disabled={uploading}>
              <Image src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={16} height={16} />
            </button>
            <button onClick={() => setIsEditingDesc(false)} disabled={uploading}>
              <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16} />
            </button>
          </>
        ) : (
          <>
            <p>{desc}</p>
            {isEditable &&
              <button onClick={() => setIsEditingDesc(true)}>
                <Image src={`${ASSET_PREFIX_URL}edit-ticket.png`} alt="edit" width={16} height={16} />
              </button>}
          </>
        )}
                    {formErrors.description && <p className={styles["error-text"]} style={{ color: 'red', fontSize: '14px' }}>{formErrors.description}</p>}

      </div>
    </>
  );
}
