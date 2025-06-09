'use client'
import React, { useEffect, useState } from 'react'
import styles from './CommonStyles.module.css';
import ClearIcon from '@mui/icons-material/Clear';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { textLettersLimit } from './../../common.helper';

function CadFileLimitExceedPopUp({ setCheckLimit }) {
    const [cadFilesUploaded, setCadFilesUploaded] = useState([])

    const validationFileUpload = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/v1/cad/validate-operations`,
                {
                headers: {
                    "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security

                }
            }
            )
            if (!response.data.meta.success) {
                setCadFilesUploaded(response.data.data.cad_files)
                console.log('cadFilesUploaded', response.data.data.cad_files)
            } else {
                console.log('u can upload')
            }
        }
        catch (error) {
            console.error("Error checking file upload limit:", error);
        }
    }

    useEffect(() => {
        validationFileUpload()
    }, [])
    return (
        <div className={styles.popUpMain}>
            <div style={{
                width: '60%', display: 'flex',
                flexDirection: 'column', gap: '16px'
            }} className="relative w-full bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <ClearIcon onClick={() => setCheckLimit(false)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h6 style={{ fontWeight: '700', fontSize: '18px' }}>Job Limit Reached</h6>
                    </div>

                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <p style={{ opacity: '0.5' }}>
                        You’ve already submitted 2 jobs in the last 3 hours, which is the maximum allowed.</p>
                    {/* You can only do a maximum of 2 jobs at a time */}
                </div>
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    padding: '18px 10px', background: 'rgba(195, 195, 195, 0.5)', borderRadius: '8px', textAlign: 'left', gap: '8px'
                }}>
                    {
                        cadFilesUploaded.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ listStyleType: 'decimal', paddingLeft: '20px', margin: 0 }}>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                       File name: {textLettersLimit(item.file_name,15)} - {item.cad_type} - <span style={{color:'blue'}}>{item.status}</span>
                                    </span>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <button onClick={() => setCheckLimit(false)} style={{ border: '2px solid #610bee', color: '#610bee', borderRadius: '10px', padding: '4px 6px' }}>Close</button>
                </div>
            </div>

        </div>
    )
}

export default CadFileLimitExceedPopUp


