"use client";
import { BASE_URL, BUCKET } from '@/config';
import axios from 'axios';
import React, { useState } from 'react'

function PartUpload() {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    async function multiUpload(data, file, headers,fileSizeMB) {
        console.log(data, file, headers,fileSizeMB)
        const parts = [];
      
        for (let i = 0; i < data.total_parts; i++) {
          const start = i * data.part_size;
          const end = Math.min(start + data.part_size, file.size);
          const part = file.slice(start, end);
      
          console.log(`Uploading part ${i + 1}/${data.total_parts}`);
          console.log('Part size:', part.size);
      
          parts.push(uploadPart(i, part, data, file));
        }
      
        try {
          // Wait for all parts to upload
          const uploadedParts = await Promise.all(parts);
          console.log(uploadedParts);
          await completeMultipartUpload(data, uploadedParts, headers,fileSizeMB);
          console.log('All parts uploaded successfully');
        } catch (error) {
          console.error('Error uploading parts:', error);
          throw error;
        }
      }
      const uploadPart = async (partNumber, part, data, file) => {
        try {
          const { url } = data.url[partNumber]; // Use partNumber to get the correct URL
          console.log(`Uploading part ${partNumber + 1} to ${url}`);
      
          const result = await axios.put(url, part, {
            headers: {
              "Content-Type": file.type,
            },
          });
          console.log('Response Headers:', result.headers);
          const etag = result.headers.get('etag') || result.headers.get('ETag');
          console.log(`Part ${partNumber + 1} uploaded successfully`, etag);
          return { ETag: etag, PartNumber: partNumber + 1 };
        } catch (error) {
          console.error(`Error uploading part ${partNumber + 1}:`, error);
          throw error;
        }
      };
      const completeMultipartUpload = async (data, parts, headers,fileSizeMB) => {
        console.log(data, parts, headers,fileSizeMB)
        try {
          const file = {
            key: data.key,
            upload_id: data.upload_id,
            parts: parts
          }
          const preSignedURL = await axios.post(
            `${BASE_URL}/v1/cad/get-next-presigned-url`,
            { bucket_name: BUCKET, file, category: 'complete_mutipart',org_id: localStorage.getItem('org_id'),filesize:fileSizeMB },
            { headers: headers }
          );
          if (
            preSignedURL.data.meta.code === 200 &&
            preSignedURL.data.meta.message === "SUCCESS"
          ) {
            return true;
          }
        } catch (error) {
          console.error('Error completing multipart upload:', error);
        }
      };
     async function simpleUpload(data, file) {
        const result = await axios.put(data.url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        console.log(result)
      }
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        handleFile(file);
    };

    const handleFile = async (file) => {

        const fileSizeMB = file.size / (1024 * 1024); // size in MB
        
        //fetch pre signed URL

        try {
            const headers = {
                "x-auth-token": localStorage.getItem("token"),
            };
            const preSignedURL = await axios.post(
                `${BASE_URL}/v1/cad/get-next-presigned-url`,
                { bucket_name: BUCKET, file: file.name, category: 'designs_upload', filesize: fileSizeMB, org_id: localStorage.getItem('org_id') },

            );
            if (
                preSignedURL.data.meta.code === 200 &&
                preSignedURL.data.meta.message === "SUCCESS" &&
                preSignedURL.data.data.url
            ) {
                if (preSignedURL.data.data.is_mutipart) {
                    await Promise.all([multiUpload(preSignedURL.data.data, file, headers,fileSizeMB),
                        axios.post(
                            `${BASE_URL}/v1/cad/create-cad`,
                            { cad_view_link: preSignedURL.data.data.url[0].url, 
                                
                                organization_id: localStorage.getItem('org_id') },
            
                        )
                    ]);

                } else {
                    await Promise.all([simpleUpload(preSignedURL.data.data, file,fileSizeMB), axios.post(
                        `${BASE_URL}/v1/cad/create-cad`,
                        { cad_view_link: preSignedURL.data.data.url, organization_id: localStorage.getItem('org_id') },
        
                    )]);
                }
                file.name = preSignedURL.data.data.file_name;
             
                // setFileFormat(getFileFormat(file.name));
                setUploadedFiles((prevUploadedFiles) => [
                    ...prevUploadedFiles,
                    { name: file.name, key: preSignedURL.data.data.key },
                ]);
            } else {
                alert("Error generating signed URL");
            }
        } catch (e) {
            console.log(e);

        } finally {
            // Set isLoading back to false after upload (whether success or failure)

        }
    };
    return (
        <div>
            <input
                type="file"
                onChange={(e) => handleFileInputChange(e)}
                
                // ref={inputRef}
                // style={{ display: "none" }}
            />
            
        </div>
    )
}

export default PartUpload