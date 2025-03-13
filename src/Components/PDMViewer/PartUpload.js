"use client";
import { BASE_URL, BUCKET } from '@/config';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import CubeLoader from '../CommonJsx/Loaders/CubeLoader';

function PartUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingMessage, setUploadingMessage] = useState('');


  async function multiUpload(data, file, headers, fileSizeMB) {
    console.log(data, file, headers, fileSizeMB)
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
      await completeMultipartUpload(data, uploadedParts, headers, fileSizeMB);
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
  const completeMultipartUpload = async (data, parts, headers, fileSizeMB) => {
    console.log(data, parts, headers, fileSizeMB)
    try {
      const file = {
        key: data.key,
        upload_id: data.upload_id,
        parts: parts
      }
      const preSignedURL = await axios.post(
        `${BASE_URL}/v1/cad/get-next-presigned-url`,
        { bucket_name: BUCKET, file, category: 'complete_mutipart', org_id: localStorage.getItem('org_id'), filesize: fileSizeMB },
        { headers: headers }
      );
      if (
        preSignedURL.data.meta.code === 200 &&
        preSignedURL.data.meta.message === "SUCCESS"
      ) {

        CreateCad(preSignedURL.data.data.Location)
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
          await multiUpload(preSignedURL.data.data, file, headers, fileSizeMB);

        } else {
          await Promise.all([simpleUpload(preSignedURL.data.data, file, fileSizeMB), CreateCad(preSignedURL.data.data.url)

          ]);
        }
        console.log(preSignedURL.data.data)
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

    }
  };
  useEffect(() => {
    if ( uploadingMessage === 'FAILED'||uploadingMessage === '') return;
    const interval = setInterval(() => {
      getStatus();
    }, 10000); 

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [uploadingMessage]);

  const getStatus = async () => {
    try {
      setLoading(true)
      // const HEADERS = { "x-auth-token": localStorage.getItem('token') };
      const response = await axios.get(BASE_URL + '/v1/cad/get-status', {
        params: { org_id: localStorage.getItem('org_id') },

      });
      if (response.data.meta.success) {
        if (response.data.data.status === 'COMPLETED') {
          window.location.href = "/tools/cad-viewer/design-view";
        } else if (response.data.data.status !== 'COMPLETED' && response.data.data.status !== 'FAILED') {
          setUploadingMessage(response.data.data.status)
          console.log(response.data.data.status)
        } else if(response.data.data.status === 'FAILED') {
          setUploadingMessage(response.data.data.status)
          toast.error(response.data.data.status)
          setLoading(false)
        }
        
      } else {
        setUploadingMessage('FAILED')
        toast.error(response.data.meta.message)
        setLoading(false)
      }

     
    } catch (error) {
      setUploadingMessage('FAILED')
      console.error("Error fetching data:", error);
      setLoading(false)
    } 
  };
  const UpdateToDocker = async (link,key) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad/file-process`,
        { file_url: link, org_id: localStorage.getItem('org_id'),key,s3_bucket:'design-glb' })
      // /design-view
      if (response.data.meta.success) {
        setUploadingMessage('uploaded')
      } else {
        toast.error(response.data.meta.message)
      }

    } catch (error) {
      console.log(error)
    }
  }
  const CreateCad = async (link) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad/create-cad`,
        { cad_view_link: link, organization_id: localStorage.getItem('org_id') })
      // /design-view
      if (response.data.meta.success) {
       
        UpdateToDocker(link,response.data.data)
      } else {
        toast.error(response.data.meta.message)
      }

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleFileInputChange(e)}

      // ref={inputRef}
      // style={{ display: "none" }}
      />
      {loading && <CubeLoader uploadingMessage={uploadingMessage}/>}

    </div>
  )
}

export default PartUpload