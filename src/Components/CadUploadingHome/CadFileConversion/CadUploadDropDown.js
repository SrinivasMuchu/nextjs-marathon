"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import cadStyles from "../CadHomeDesign/CadHome.module.css";
import { textLettersLimit } from "./../../../common.helper";
import Link from "next/link";
import {
  fetchConverterPricingInfo,
  isConverterConversionFree,
} from "@/lib/converterPricing";
import {
  ConverterPricingBadge,
  ConverterPricingBanner,
} from "./ConverterPricingDisplay";

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
  s3Url,
  isSampleFile = false,
  setDisableSelect,
}) {
  const [pricingInfo, setPricingInfo] = React.useState(null);

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

  const formatOptions = useMemo(
    () => [
      { value: "step", label: ".step" },
      { value: "brep", label: ".brep" },
      { value: "iges", label: ".iges" },
      { value: "obj", label: ".obj" },
      { value: "ply", label: ".ply" },
      { value: "stl", label: ".stl" },
      { value: "off", label: ".off" },
      { value: "3dm", label: ".3dm" },
      { value: "dxf", label: ".dxf" },
      { value: "dwg", label: ".dwg" },
    ],
    []
  );

  const selectedKey = normalizeFormatKey(selectedFileFormate);

  useEffect(() => {
    if (to && !selectedKey) {
      const raw = Array.isArray(to) ? to[0] : to;
      const targetFormat = normalizeFormatKey(raw);
      if (targetFormat) setSelectedFileFormate(targetFormat);
    }
  }, [to, selectedKey, setSelectedFileFormate]);

  useEffect(() => {
    if (file) {
      const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      if ((fileExt === "dxf" || fileExt === "dwg") && !selectedKey) {
        const otherFormat = fileExt === "dxf" ? "dwg" : "dxf";
        setSelectedFileFormate(otherFormat);
      }
    }
  }, [file, selectedKey, setSelectedFileFormate]);

  const getFilteredOptions = useCallback(() => {
    if (!file) return formatOptions;

    const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();

    if (fileExt === "dxf" || fileExt === "dwg") {
      return formatOptions.filter(
        (option) =>
          (option.value === "dxf" || option.value === "dwg") && option.value !== fileExt
      );
    }

    return formatOptions.filter((option) => {
      if (option.value === "dxf" || option.value === "dwg") {
        return false;
      }
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
  }, [file, formatOptions]);

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
    if (filteredOptions.some((o) => o.value === selectedOption.value)) return filteredOptions;
    return [selectedOption, ...filteredOptions];
  }, [filteredOptions, selectedOption]);

  const selectValueAttr =
    selectedKey && optionsForSelect.some((o) => o.value === selectedKey)
      ? selectedKey
      : "";

  const displayLabel = useMemo(() => {
    if (!selectedKey) return "Select format…";
    return (
      formatOptions.find((o) => o.value === selectedKey)?.label ?? `.${selectedKey}`
    );
  }, [selectedKey, formatOptions]);

  const handleConvert = () => {
    if (!selectValueAttr) {
      console.error("No format selected for conversion");
      return;
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
