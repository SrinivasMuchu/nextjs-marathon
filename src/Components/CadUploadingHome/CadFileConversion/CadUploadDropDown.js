"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import cadStyles from "../CadHomeDesign/CadHome.module.css";
import heroStyles from "../CadHomeDesign/CadViewerHero.module.css";
import { textLettersLimit } from "./../../../common.helper";
import Link from "next/link";
import { ArrowLeftRight, Info } from "lucide-react";
import {
  fetchConverterPricingInfo,
  isConverterConversionFree,
} from "@/lib/converterPricing";
import {
  ConverterPricingBadge,
  ConverterPricingBanner,
} from "./ConverterPricingDisplay";
import { CONVERTER_HUB_PAGE } from "@/data/converterHubPage";

const FORMAT_ALIASES = {
  stp: "step",
  igs: "iges",
  brp: "brep",
};

/** Normalize format keys from URL/state (e.g. ".stl", "STL", "stp" -> canonical value key) */
function normalizeFormatKey(v) {
  if (v == null || v === "") return "";
  const s = String(v).toLowerCase().trim();
  const noDot = s.startsWith(".") ? s.slice(1) : s;
  return FORMAT_ALIASES[noDot] || noDot;
}

const FORMAT_FIELD_LABELS = {
  step: "STEP (.step, .stp)",
  stp: "STEP (.step, .stp)",
  stl: "STL (.stl)",
  iges: "IGES (.iges, .igs)",
  igs: "IGES (.iges, .igs)",
  brep: "BREP (.brep)",
  brp: "BREP (.brep)",
  obj: "OBJ (.obj)",
  ply: "PLY (.ply)",
  off: "OFF (.off)",
  "3dm": "3DM (.3dm)",
  dwg: "DWG (.dwg)",
  dxf: "DXF (.dxf)",
};

function formatFieldLabel(key) {
  const normalized = normalizeFormatKey(key);
  if (!normalized) return "";
  return FORMAT_FIELD_LABELS[normalized] || `${normalized.toUpperCase()} (.${normalized})`;
}

function CadDropDown({
  file,
  selectedFileFormate,
  folderId,
  baseName,
  setSelectedFileFormate,
  uploadingMessage,
  handleFileConvert,
  disableSelect,
  to,
  from,
  s3Url,
  isSampleFile = false,
  setDisableSelect,
  designVariant,
}) {
  const [pricingInfo, setPricingInfo] = React.useState(null);
  const pairDefaultAppliedRef = useRef(false);

  const formatFileSize = useCallback((bytes) => {
    const size = Number(bytes);
    if (!Number.isFinite(size) || size <= 0) return "-";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }, []);

  const loadPricing = useCallback(async () => {
    try {
      const info = await fetchConverterPricingInfo();
      setPricingInfo(info);
    } catch {
      setPricingInfo(null);
    }
  }, []);

  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  const isFreeConversion = isConverterConversionFree({
    pricingInfo,
    isSampleFile,
    inputFileSizeBytes: file?.size,
  });
  const cadFormatOptions = useMemo(
    () => [
      { value: "step", label: ".step" },
      { value: "brep", label: ".brep" },
      { value: "iges", label: ".iges" },
      { value: "obj", label: ".obj" },
      { value: "ply", label: ".ply" },
      { value: "stl", label: ".stl" },
      { value: "off", label: ".off" },
      { value: "3dm", label: ".3dm" },
    ],
    []
  );

  const drawingFormatOptions = useMemo(
    () => [
      { value: "dxf", label: ".dxf" },
      { value: "dwg", label: ".dwg" },
    ],
    []
  );

  const formatOptions = useMemo(
    () => [...cadFormatOptions, ...drawingFormatOptions],
    [cadFormatOptions, drawingFormatOptions]
  );

  const selectedKey = normalizeFormatKey(selectedFileFormate);
  const pairTarget = normalizeFormatKey(Array.isArray(to) ? to[0] : to);
  const pairSource = normalizeFormatKey(from);
  const isDrawingPair =
    pairSource === "dxf" ||
    pairSource === "dwg" ||
    pairTarget === "dxf" ||
    pairTarget === "dwg";

  // Individual pair pages: default output to the URL target (e.g. BREP on step-to-brep).
  useEffect(() => {
    if (!pairTarget) {
      pairDefaultAppliedRef.current = false;
      return;
    }
    if (pairDefaultAppliedRef.current) return;
    setSelectedFileFormate(pairTarget);
    pairDefaultAppliedRef.current = true;
  }, [pairTarget, setSelectedFileFormate]);

  // Hub converter: keep output empty until a file is detected, then pick a compatible format.
  useEffect(() => {
    if (designVariant !== "converterHero" || pairTarget) return;

    if (!file) return;
    const fileExt = normalizeFormatKey(
      file.name.slice(file.name.lastIndexOf(".") + 1)
    );

    if (fileExt === "dxf" || fileExt === "dwg") {
      const requiredTarget = fileExt === "dxf" ? "dwg" : "dxf";
      if (selectedKey !== requiredTarget) setSelectedFileFormate(requiredTarget);
      return;
    }

    // DXF/DWG are not valid targets for 3D CAD conversions.
    if (selectedKey === "dxf" || selectedKey === "dwg") {
      setSelectedFileFormate(fileExt === "stl" ? "step" : "stl");
      return;
    }

    if (!selectedKey || selectedKey === fileExt) {
      setSelectedFileFormate(fileExt === "stl" ? "step" : "stl");
    }
  }, [designVariant, file, selectedKey, setSelectedFileFormate, pairTarget]);

  const getFilteredOptions = useCallback(() => {
    // DXF ↔ DWG only: no other formats can convert to/from these 2D drawings.
    if (isDrawingPair) {
      const source = pairSource || (file
        ? normalizeFormatKey(file.name.slice(file.name.lastIndexOf(".") + 1))
        : "");
      const requiredTarget =
        pairTarget ||
        (source === "dxf" ? "dwg" : source === "dwg" ? "dxf" : "");
      if (requiredTarget) {
        return drawingFormatOptions.filter((option) => option.value === requiredTarget);
      }
      return drawingFormatOptions;
    }

    if (!file) return cadFormatOptions;

    const fileExt = normalizeFormatKey(
      file.name.slice(file.name.lastIndexOf(".") + 1)
    );

    // Uploaded DXF/DWG on the general converter: only the complementary drawing format.
    if (fileExt === "dxf" || fileExt === "dwg") {
      return drawingFormatOptions.filter((option) => option.value !== fileExt);
    }

    return cadFormatOptions.filter((option) => {
      if (fileExt === "step" || fileExt === "stp") {
        return option.value !== "step";
      }
      if (fileExt === "iges" || fileExt === "igs") {
        return option.value !== "iges";
      }
      if (fileExt === "brep" || fileExt === "brp") {
        return option.value !== "brep";
      }
      return option.value !== fileExt;
    });
  }, [file, cadFormatOptions, drawingFormatOptions, isDrawingPair, pairSource, pairTarget]);

  const handleNativeChange = (event) => {
    const v = normalizeFormatKey(event.target.value);
    setSelectedFileFormate(v);
    setDisableSelect(false);
  };

  const filteredOptions = useMemo(() => getFilteredOptions(), [getFilteredOptions]);

  const selectedOption =
    selectedKey && formatOptions.find((o) => o.value === selectedKey);
  const optionsForSelect = useMemo(() => {
    if (!selectedOption) return filteredOptions;
    if (filteredOptions.some((o) => o.value === selectedOption.value)) {
      return filteredOptions;
    }
    // Never inject DXF/DWG into 3D target lists (those pairs are drawing-only).
    if (
      !isDrawingPair &&
      (selectedOption.value === "dxf" || selectedOption.value === "dwg")
    ) {
      return filteredOptions;
    }
    return [selectedOption, ...filteredOptions];
  }, [filteredOptions, selectedOption, isDrawingPair]);

  const selectValueAttr =
    selectedKey && optionsForSelect.some((o) => o.value === selectedKey)
      ? selectedKey
      : "";

  const displayLabel = useMemo(() => {
    if (!selectedKey) return CONVERTER_HUB_PAGE.outputPlaceholder;
    return (
      formatOptions.find((o) => o.value === selectedKey)?.label ?? `.${selectedKey}`
    );
  }, [selectedKey, formatOptions]);

  const handleConvert = () => {
    const outputKey = selectValueAttr || pairTarget;
    if (!outputKey) {
      console.error("No format selected for conversion");
      return;
    }
    if (outputKey !== selectedKey) {
      setSelectedFileFormate(outputKey);
    }
    setDisableSelect(true);
    if (s3Url) {
      handleFileConvert("", s3Url);
    } else {
      handleFileConvert(file);
    }
  };

  const fileExt = file?.name?.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
  const isDxfOrDwg = fileExt === "dxf" || fileExt === "dwg";
  const isSelectDisabled =
    uploadingMessage || disableSelect || (isDxfOrDwg && filteredOptions.length === 1);
  const isConvertButtonDisabled = uploadingMessage || disableSelect;
  const isConvertButtonVisible = !!selectedKey;

  if (designVariant === "converterHero") {
    const dedicatedPair = Boolean(pairSource && pairTarget);
    const inputFormatLabel = fileExt
      ? formatFieldLabel(fileExt) || normalizeFormatKey(fileExt).toUpperCase()
      : dedicatedPair
        ? formatFieldLabel(pairSource)
        : "Auto-detect";
    const lockedOutputLabel = dedicatedPair ? formatFieldLabel(pairTarget) : "";
    const outputFormatLabel = dedicatedPair
      ? pairTarget.toUpperCase()
      : displayLabel.replace(".", "").toUpperCase();
    const fromUpper = (pairSource || "").toUpperCase();
    const toUpper = (pairTarget || outputFormatLabel || "").toUpperCase();
    const hubOutputKey = selectValueAttr || pairTarget;
    const hubInputUpper = fileExt
      ? (normalizeFormatKey(fileExt) || fileExt).toUpperCase()
      : "Auto-detect";
    const convertLabel = dedicatedPair
      ? `Convert ${fromUpper} to ${toUpper}`
      : hubOutputKey
        ? `Convert ${hubInputUpper} to ${outputFormatLabel}`
        : CONVERTER_HUB_PAGE.convertBeforeSelection;
    const modernButtonDisabled =
      !file || !(selectValueAttr || pairTarget) || Boolean(uploadingMessage) || disableSelect;

    return (
      <div className={heroStyles.converterControls}>
        <div className={heroStyles.converterFormatRow}>
          <label className={heroStyles.converterFormatField}>
            <span>Input format</span>
            <div className={heroStyles.converterInputFormat}>
              <strong>{inputFormatLabel}</strong>
              {file?.name ? (
                <small>{textLettersLimit(file.name, 28)}</small>
              ) : pairSource ? (
                <small>{`${pairSource.toUpperCase()} file`}</small>
              ) : null}
            </div>
          </label>

          <span className={heroStyles.converterSwapButton} aria-hidden>
            <ArrowLeftRight size={17} strokeWidth={2} />
          </span>

          <label className={heroStyles.converterFormatField}>
            <span>Output format</span>
            {dedicatedPair ? (
              <div className={heroStyles.converterInputFormat}>
                <strong>{lockedOutputLabel}</strong>
                <small>Preselected for this page</small>
              </div>
            ) : (
              <select
                className={heroStyles.converterOutputSelect}
                value={selectValueAttr}
                onChange={handleNativeChange}
                disabled={isSelectDisabled}
                aria-label={`Output file format. ${displayLabel}`}
              >
                <option value="">{CONVERTER_HUB_PAGE.outputPlaceholder}</option>
                {optionsForSelect.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label.replace(".", "").toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </label>
        </div>

        <button
          type="button"
          className={heroStyles.converterActionButton}
          onClick={handleConvert}
          disabled={modernButtonDisabled}
          aria-label={convertLabel}
        >
          {convertLabel}
        </button>

        <div className={heroStyles.converterPricingStatus}>
          {file ? (
            <ConverterPricingBanner
              isFree={isFreeConversion}
              pricing={pricingInfo?.pricing}
              isSampleFile={isSampleFile}
              variant="converterHero"
            />
          ) : (
            <p>
              <Info size={16} aria-hidden />
              {CONVERTER_HUB_PAGE.pricingNote}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cadStyles["cad-conversion-upload-wrap"]}>
      <ConverterPricingBanner
        isFree={isFreeConversion}
        pricing={pricingInfo?.pricing}
        isSampleFile={isSampleFile}
      />
      <div className={`${cadStyles["cad-conversion-table"]} ${cadStyles["cad-conversion-table--dark"]}`}>
        <table>
          <thead>
            <tr>
              <th>File name</th>
              <th>Format</th>
              <th>Input size</th>
              <th>Convert to</th>
              <th>Pricing</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="File name">{textLettersLimit(file?.name, 35)}</td>
              <td data-label="Format">
                {file?.name?.slice(file.name.lastIndexOf(".")).toLowerCase()}
              </td>
              <td data-label="Input size">{formatFileSize(file?.size)}</td>
              <td data-label="Convert to">
                <div
                  className={`${cadStyles["cad-conversion-format-slot"]} ${
                    isSelectDisabled ? cadStyles["cad-conversion-format-slotDisabled"] : ""
                  }`}
                >
                  <select
                    key={file?.name ? `fmt-${file.name}` : "fmt"}
                    className={cadStyles["cad-conversion-format-select"]}
                    value={selectValueAttr}
                    onChange={handleNativeChange}
                    disabled={isSelectDisabled}
                    aria-label={`Output file format. ${displayLabel}`}
                  >
                    <option value="">Select format…</option>
                    {optionsForSelect.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <div className={cadStyles["cad-conversion-format-label"]}>{displayLabel}</div>
                </div>
              </td>
              <td data-label="Pricing">
                <ConverterPricingBadge
                  isFree={isFreeConversion}
                  pricing={pricingInfo?.pricing}
                  variant="dark"
                />
              </td>
              <td data-label="Status">
                {uploadingMessage || "Ready"}
              </td>
              <td data-label="Action">
                {isConvertButtonVisible && !uploadingMessage && (
                  <button
                    type="button"
                    className={cadStyles["cad-conversion-button"]}
                    onClick={handleConvert}
                    disabled={isConvertButtonDisabled}
                  >
                    Convert
                  </button>
                )}

                {uploadingMessage === "COMPLETED" && (
                  <Link
                    href="/dashboard?cad_type=CAD_CONVERTER"
                    className={cadStyles["cad-conversion-button"]}
                  >
                    Download from dashboard
                  </Link>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CadDropDown;
