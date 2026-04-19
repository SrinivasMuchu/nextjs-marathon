import React from "react";
import styles from "./CadHome.module.css";
import heroStyles from "./CadViewerHero.module.css";
import CadDropZoneWrapper from "./CadDropZoneWrapper";
import CommonSampleViewer from "@/Components/CommonJsx/CommonSampleViewer";
import ToolsPageBanner from "@/Components/CadServicesBanners/ToolsPageBanner";

const DEFAULT_FORMATS_COPY =
  "Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj)";

function CadHomeDropZone({ isStyled, allowedFormats, type, designVariant, dropzoneId }) {
  const isHeroDark = designVariant === "heroDark";

  const formatsLine = type && Array.isArray(allowedFormats)
    ? `Supported formats:${allowedFormats.join(", ")}`
    : DEFAULT_FORMATS_COPY;

  const dropzoneInner = (
    <div
      className={isHeroDark ? heroStyles.heroUploadPanelContent : styles["cad-dropzone-content"]}
      style={isStyled && !isHeroDark ? { textAlign: "center", alignItems: "center" } : {}}
    >
      <p className={isHeroDark ? heroStyles.heroUploadPanelHead : styles["cad-dropzone-head"]}>
        Drag &amp; drop your 3D{" "}
        <span
          className={isHeroDark ? heroStyles.heroUploadPanelFile : styles["cad-dropzone-file"]}
          style={{ cursor: "pointer" }}
        >
          files
        </span>{" "}
        here
      </p>
      {isHeroDark ? (
        <p className={heroStyles.heroUploadPanelHint}>or click to browse files</p>
      ) : (
        <p className={styles["cad-dropzone-desc"]} style={isStyled ? { width: "80%", textAlign: "center" } : {}}>
          {formatsLine}
        </p>
      )}
    </div>
  );

  return (
    <>
      {isHeroDark ? (
        <div className={heroStyles.uploadSection}>
          <CadDropZoneWrapper isStyled={isStyled} type={type} designVariant={designVariant} dropzoneId={dropzoneId}>
            {dropzoneInner}
          </CadDropZoneWrapper>
          <p className={heroStyles.formatsBelow}>{formatsLine}</p>
          <CommonSampleViewer variant="dark" />
        </div>
      ) : (
        <>
          <CadDropZoneWrapper isStyled={isStyled} type={type} designVariant={designVariant} dropzoneId={dropzoneId}>
            {dropzoneInner}
          </CadDropZoneWrapper>
          <CommonSampleViewer />
        </>
      )}
      <ToolsPageBanner />
    </>
  );
}

export default CadHomeDropZone;
