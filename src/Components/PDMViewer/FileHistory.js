"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config';

function FileHistory({getStatus}) {
    const [fileHistory, setFileHistory] = useState([]);

    useEffect(() => {
       
        const uuid = localStorage.getItem('uuid');
        const fetchFileHistory = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
                    params: { uuid }
                });

                if (response.data.meta.success) {
                    setFileHistory(response.data.data.cad_viewer_files);
                } 
            } catch (err) {
              
                console.error('Error fetching file history:', err);
            }
        };

        fetchFileHistory();
    }, []);

    return (
        <div>
            <h1>File History</h1>
            {fileHistory.length > 0 ? (
                <ul>
                    {fileHistory.map((file, index) => (
                        <li 
                        key={index} 
                        onClick={() => {
                          localStorage.setItem("last_viewed_cad_key", file._id);
                          getStatus();
                        }}
                      >
                        File ID: {file._id}
                      </li>
                    ))}
                </ul>
            ) : (
                <p>No file history found</p>
            )}
        </div>
    );
}

export default FileHistory;