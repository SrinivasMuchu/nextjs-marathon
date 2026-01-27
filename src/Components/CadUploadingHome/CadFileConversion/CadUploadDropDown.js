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
    // { value: 'glb', label: '.glb' },
  ];

  // Set initial format when 'to' prop changes
  useEffect(() => {
    if (to && !selectedFileFormate) {
      const targetFormat = Array.isArray(to) ? to[0] : to;
      setSelectedFileFormate(targetFormat);
    }
  }, [to, selectedFileFormate, setSelectedFileFormate]);
  const router = useRouter();
  // Get filtered options based on file extension
  const getFilteredOptions = () => {
    if (!file) return formatOptions;

    const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();

    return formatOptions.filter(option => {
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
  const isSelectDisabled = uploadingMessage || disableSelect;



  

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
                options={getFilteredOptions()}
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
                  disabled={isSelectDisabled}
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