"use client";
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import cadStyles from '../CadHomeDesign/CadHome.module.css'
import { DESIGN_GLB_PREFIX_URL } from '@/config';


function CadDropDown({ file, selectedFileFormate,folderId, 
    baseName, setSelectedFileFormate, CadFileConversion, uploadingMessage, handleFileConvert, disableSelect, to }) {


    const formatOptions = [
        { value: 'step', label: '.step' },
        { value: 'stp', label: '.stp' },
        { value: 'brep', label: '.brep' },
        { value: 'brp', label: '.brp' },
        { value: 'iges', label: '.iges' },
        { value: 'igs', label: '.igs' },
        { value: 'obj', label: '.obj' },
        { value: 'ply', label: '.ply' },
        { value: 'stl', label: '.stl' },
        { value: 'off', label: '.off' },
    ];

console.log(to)
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
                                options={formatOptions.filter(option =>
                                        option.value !== file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase() // Remove dot before filtering
                                    )}
                                className={cadStyles['cad-conversion-select']}
                                isDisabled={disableSelect}
                            />}

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
                                onClick={()=>
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

