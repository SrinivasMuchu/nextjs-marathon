import React from "react";
import styles from "./CadHome.module.css";
import heroStyles from "./CadViewerHero.module.css";
import CadDropZoneWrapper from "./CadDropZoneWrapper";
import CommonSampleViewer from "@/Components/CommonJsx/CommonSampleViewer";
import ToolsPageBanner from "@/Components/CadServicesBanners/ToolsPageBanner";
import CadSupportedFormatsTable from "./CadSupportedFormatsTable";
import { getSupportedInputFormatsLabel } from "@/data/cadFormatViewerPages";

function CadHomeDropZone({ isStyled, allowedFormats, type, cadType, designVariant, dropzoneId }) {
  const isHeroDark = designVariant === "heroDark";
  const supportedInputLabel = type && cadType ? getSupportedInputFormatsLabel(cadType) : null;
  const formatsLine = supportedInputLabel
    || (type && Array.isArray(allowedFormats) && allowedFormats.length
      ? `Supported input formats: ${allowedFormats.join(", ")}`
      : null);

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
          <CadDropZoneWrapper isStyled={isStyled} type={type} cadType={cadType} designVariant={designVariant} dropzoneId={dropzoneId}>
            {dropzoneInner}
          </CadDropZoneWrapper>
          {formatsLine ? (
            <p className={heroStyles.formatsBelow}>{formatsLine}</p>
          ) : (
            <CadSupportedFormatsTable />
          )}
          <CommonSampleViewer variant="dark" />
        </div>
      ) : (
        <>
          <CadDropZoneWrapper isStyled={isStyled} type={type} cadType={cadType} designVariant={designVariant} dropzoneId={dropzoneId}>
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
