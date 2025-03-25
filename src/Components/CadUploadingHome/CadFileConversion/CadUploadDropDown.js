"use client";
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import cadStyles from '../CadHomeDesign/CadHome.module.css'


function CadDropDown({ file, selectedFileFormate, setSelectedFileFormate, CadFileConversion }) {
    const [uploadingMessage, setUploadingMessage] = useState('');
 

    const formatOptions = [
        { value: '.stl', label: '.stl' },
        { value: '.step', label: '.step' },
        { value: '.obj', label: '.obj' },
    ];

   
   


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
                            <Select
                                onChange={(selectedOption) => setSelectedFileFormate(selectedOption.value)}
                                options={formatOptions}
                                className={cadStyles['cad-conversion-select']}
                            />
                        </td>
                        <td>Uploaded</td>
                        <td>
                            {/* Convert Button - only enabled when file format is selected */}
                            <button
                                className={cadStyles['cad-conversion-button']}
                                onClick={CadFileConversion}
                                disabled={selectedFileFormate === ''}
                                style={selectedFileFormate === '' ? { background: 'black' } : {}}
                            >
                                Convert
                            </button>

                            {/* Download Button - only shown when upload is completed AND file format is selected */}
                            {uploadingMessage === 'COMPLETED' && selectedFileFormate !== '' && (
                                <button
                                    className={cadStyles['cad-conversion-button']}
                                    // onClick={CadFileConversion}
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

