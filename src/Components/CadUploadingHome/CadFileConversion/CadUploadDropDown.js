"use client";
import React, { useEffect } from 'react';
import Select from 'react-select';
import cadStyles from '../CadHomeDesign/CadHome.module.css';
import { useRouter } from "next/navigation";
import { DESIGN_GLB_PREFIX_URL } from '@/config';
import {  textLettersLimit } from './../../../common.helper';
import Link from 'next/link';
function CadDropDown({
  file,
  selectedFileFormate,
  folderId,
  baseName,
  setSelectedFileFormate,
  uploadingMessage,
  handleFileConvert,
  disableSelect,
  to, s3Url,
  setDisableSelect
}) {
  const formatOptions = [
    { value: 'step', label: '.step' },
    { value: 'brep', label: '.brep' },
    { value: 'iges', label: '.iges' },
    { value: 'obj', label: '.obj' },
    { value: 'ply', label: '.ply' },
    { value: 'stl', label: '.stl' },
    { value: 'off', label: '.off' },
    { value: 'dxf', label: '.dxf' },
    { value: 'dwg', label: '.dwg' },
    // { value: 'glb', label: '.glb' },
  ];

  // Set initial format when 'to' prop changes
  useEffect(() => {
    if (to && !selectedFileFormate) {
      const targetFormat = Array.isArray(to) ? to[0] : to;
      setSelectedFileFormate(targetFormat);
    }
  }, [to, selectedFileFormate, setSelectedFileFormate]);

  // Auto-select format for DXF/DWG files when only one option is available
  useEffect(() => {
    if (file) {
      const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      if ((fileExt === "dxf" || fileExt === "dwg") && !selectedFileFormate) {
        // Auto-select the other format (if input is DXF, select DWG and vice versa)
        const otherFormat = fileExt === "dxf" ? "dwg" : "dxf";
        setSelectedFileFormate(otherFormat);
      }
    }
  }, [file, selectedFileFormate, setSelectedFileFormate]);

  const router = useRouter();
  // Get filtered options based on file extension
  const getFilteredOptions = () => {
    if (!file) return formatOptions;

    const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();

    // Special handling for DXF and DWG: can only convert to DXF or DWG
    if (fileExt === "dxf" || fileExt === "dwg") {
      return formatOptions.filter(option => {
        // Only show DXF and DWG options, excluding the input format
        return (option.value === "dxf" || option.value === "dwg") && option.value !== fileExt;
      });
    }

    return formatOptions.filter(option => {
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
  };

  // Get the currently selected option
  const getSelectedOption = () => {
    if (selectedFileFormate) {
      return formatOptions.find(option => option.value === selectedFileFormate);
    }
    return null;
  };

  const handleSelectFileFormat = (selectedOption) => {
    if (selectedOption) {
      setSelectedFileFormate(selectedOption.value);
      setDisableSelect(false);
    }
  };

  const handleConvert = () => {
    if (!selectedFileFormate) {
      console.error("No format selected for conversion");
      return;
    }
    setDisableSelect(true);
    if (s3Url) {
      handleFileConvert('', s3Url);
    } else {
      handleFileConvert(file);
    }

  };

  const isConvertButtonVisible = !!selectedFileFormate;
  
  // Get filtered options once
  const filteredOptions = getFilteredOptions();
  
  // Check if input file is DXF or DWG
  const fileExt = file?.name?.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
  const isDxfOrDwg = fileExt === "dxf" || fileExt === "dwg";
  
  // Disable dropdown if DXF/DWG input and only one option available (or if already disabled)
  // When DXF/DWG is input, there's only one output option (the other format), so disable the dropdown
  const isSelectDisabled = uploadingMessage || disableSelect || (isDxfOrDwg && filteredOptions.length === 1);
  
  // Convert button should only be disabled during upload/conversion, not because of DXF/DWG restriction
  const isConvertButtonDisabled = uploadingMessage || disableSelect;



  

  return (
    <div className={cadStyles['cad-conversion-table']}>
      <table>
        <thead>
          <tr>
            <th>File Name</th>

            <th>File Format</th>
            <th>Convert To</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="File Name">{textLettersLimit(file?.name, 35)}</td>
            <td data-label="File Format">{file?.name?.slice(file.name.lastIndexOf(".")).toLowerCase()}</td>
            <td data-label="Convert To">
              <Select
                value={getSelectedOption()}
                onChange={handleSelectFileFormat}
                options={filteredOptions}
                className={cadStyles['cad-conversion-select']}
                isDisabled={isSelectDisabled}
                isSearchable={false}
              />
            </td>
            <td data-label="Status">{uploadingMessage}</td>
            <td data-label="Action">
              {isConvertButtonVisible && !uploadingMessage && (
                <button
                  className={cadStyles['cad-conversion-button']}
                  onClick={handleConvert}
                  disabled={isConvertButtonDisabled}
                >
                  Convert
                </button>
              )}

              {uploadingMessage === 'COMPLETED' && (
                <Link href='/dashboard?cad_type=CAD_CONVERTER' className={cadStyles['cad-conversion-button']}>
                
                    Download from dashboard
                  
                </Link>

              )}
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  );
}

export default CadDropDown;