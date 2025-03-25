"use client";
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import cadStyles from '../CadHomeDesign/CadHome.module.css'


function CadDropDown({ file, selectedFileFormate, setSelectedFileFormate, CadFileConversion, uploadingMessage, handleFileConvert, disableSelect, to }) {


    const formatOptions = [
        { value: 'stl', label: '.stl' },
        { value: 'step', label: '.step' },
        { value: 'obj', label: '.obj' },
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
                                onChange={(selectedOption) => setSelectedFileFormate(selectedOption.value)}
                                options={formatOptions}

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
                                <button className={cadStyles['cad-conversion-button']}>
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

