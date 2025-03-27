"use client";
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import cadStyles from '../CadHomeDesign/CadHome.module.css'
import { DESIGN_GLB_PREFIX_URL } from '@/config';


function CadDropDown({ file, selectedFileFormate, folderId,
    baseName, setSelectedFileFormate, CadFileConversion, uploadingMessage, handleFileConvert, disableSelect, to }) {


    const formatOptions = [
        { value: 'step', label: '.step' },
        { value: 'brep', label: '.brep' },
        { value: 'iges', label: '.iges' },
        { value: 'obj', label: '.obj' },
        { value: 'ply', label: '.ply' },
        { value: 'stl', label: '.stl' },
        { value: 'off', label: '.off' },
    ];

    useEffect(() => {
        if (!file) return
        handleFileConvert(file)
    }, [file])

 
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
                    {/* {files.map((file, index) => ( */}
                    <tr >
                        <td>{file.name}</td>
                        <td>{file.name.slice(file.name.lastIndexOf(".")).toLowerCase()}</td>
                        <td>
                            {to ? `.${to}` : <Select
                                onChange={(selectedOption) =>
                                    setSelectedFileFormate(selectedOption.value)}
                                options={formatOptions.filter(option => {
                                    const fileExt = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();

                                    // Exclude "step" if file is "step" or "stp"
                                    if (fileExt === "step" || fileExt === "stp") {
                                        return option.value !== "step";
                                    }

                                    // Exclude "iges" if file is "iges" or "igs"
                                    if (fileExt === "iges" || fileExt === "igs") {
                                        return option.value !== "iges";
                                    }

                                    // Exclude "brep" if file is "brep" or "brp"
                                    if (fileExt === "brep" || fileExt === "brp") {
                                        return option.value !== "brep";
                                    }

                                    return option.value !== fileExt; // General exclusion for other formats
                                })}
                                className={cadStyles['cad-conversion-select']}
                                isDisabled={disableSelect}
                            />
                            }

                        </td>
                        <td>{uploadingMessage}</td>
                        <td>
                            {/* Convert Button - Only enabled when a file format is selected */}
                            {(!disableSelect && (to || selectedFileFormate)) && (
                                <button
                                    className={cadStyles['cad-conversion-button']}
                                    onClick={CadFileConversion}
                                    disabled={disableSelect}
                                    style={(disableSelect) ? { opacity: '0.5' } : {}}
                                >
                                    Convert
                                </button>
                            )}

                            {/* Download Button - Only shown when upload is completed AND file format is selected */}
                            {uploadingMessage === 'COMPLETED' && (to || selectedFileFormate) && (
                                <button className={cadStyles['cad-conversion-button']}
                                    onClick={() =>
                                        window.open(`${DESIGN_GLB_PREFIX_URL}${folderId}/${baseName}.${to ? to : selectedFileFormate}`, '_blank')
                                    }
                                >
                                    Download
                                </button>
                            )}
                        </td>

                    </tr>

                </tbody>
            </table>
        </div>
    )
}


export default CadDropDown

