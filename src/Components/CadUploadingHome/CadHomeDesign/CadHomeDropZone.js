import React from "react";
import styles from "./CadHome.module.css";
import heroStyles from "./CadViewerHero.module.css";
import CadDropZoneWrapper from "./CadDropZoneWrapper";
import CommonSampleViewer from "@/Components/CommonJsx/CommonSampleViewer";
import ToolsPageBanner from "@/Components/CadServicesBanners/ToolsPageBanner";
import CadSupportedFormatsTable from "./CadSupportedFormatsTable";
import { getSupportedInputFormatsLabel } from "@/data/cadFormatViewerPages";
import { getUniqueViewerPage } from "@/data/viewerUniquePages";

function CadHomeDropZone({ isStyled, allowedFormats, type, cadType, designVariant, dropzoneId }) {
  const uniquePage = getUniqueViewerPage(cadType, { isHub: !type && !cadType });
  const isHeroDark = designVariant === "heroDark";
  const supportedInputLabel = uniquePage?.acceptedFormatsLabel
    || (type && cadType ? getSupportedInputFormatsLabel(cadType) : null);
  const formatsLine = supportedInputLabel
    || (type && Array.isArray(allowedFormats) && allowedFormats.length
      ? `Supported input formats: ${allowedFormats.join(", ")}`
      : null);

  const dropzoneInner = (
    <div
      className={isHeroDark ? heroStyles.heroUploadPanelContent : styles["cad-dropzone-content"]}
      style={isStyled && !isHeroDark ? { textAlign: "center", alignItems: "center" } : {}}
    >
      {uniquePage?.dropzoneHead ? (
        <p className={isHeroDark ? heroStyles.heroUploadPanelHead : styles["cad-dropzone-head"]}>
          {uniquePage.dropzoneHead}
        </p>
      ) : (
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
      )}
      {isHeroDark ? (
        <p className={heroStyles.heroUploadPanelHint}>{uniquePage?.dropzoneHint || "or click to browse files"}</p>
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
          <CommonSampleViewer
            variant="dark"
            prompt={uniquePage?.samplePrompt}
            sampleLabel={uniquePage?.sampleCta}
            sampleFormat={uniquePage?.sampleFormat}
            sampleGallery={uniquePage?.sampleGallery}
          />
        </div>
      ) : (
        <>
          <CadDropZoneWrapper isStyled={isStyled} type={type} cadType={cadType} designVariant={designVariant} dropzoneId={dropzoneId}>
            {dropzoneInner}
          </CadDropZoneWrapper>
          <CommonSampleViewer
            prompt={uniquePage?.samplePrompt}
            sampleLabel={uniquePage?.sampleCta}
            sampleFormat={uniquePage?.sampleFormat}
            sampleGallery={uniquePage?.sampleGallery}
          />
        </>
      )}
      {uniquePage?.skipHeroDesigner ? null : (
        <ToolsPageBanner
          title={uniquePage?.designerTitle}
          description={uniquePage?.designerBody}
          primaryLabel={uniquePage?.designerCta}
        />
      )}
    </>
  );
}

export default CadHomeDropZone;
