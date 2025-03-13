"use client";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import styles from "./CadHome.module.css";
import { toast } from "react-toastify";
import { BASE_URL, BUCKET } from "@/config";
import axios from "axios";
import {  usePathname } from "next/navigation";


function CadHomeDropZone({ isStyled, type }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false)
  const [allowedFormats, setAllowedFormats] = useState([".step", ".stp", ".stl", ".ply", ".off", ".igs", ".iges", ".brp", ".brep"])
  const pathname = usePathname();
 
  const maxFileSizeMB = 300; // Max file size in MB
  
  const cadFile = pathname.split("/")[2];
  console.log(cadFile)
  useEffect(() => {
    if (type && cadFile) {
      formateAcceptor(cadFile);
    }
  }, [type, cadFile]);
  const formateAcceptor = (cadFile)=>{
    if(cadFile === 'step'){
      setAllowedFormats ([".step", ".stp"])
    }
    if(cadFile === 'iges'){
      setAllowedFormats ([".igs", ".iges"])
    }
    if(cadFile === 'stl'){
      setAllowedFormats ([".stl"])
    }
    if(cadFile === 'ply'){
      setAllowedFormats ([".ply"])
    }
    if(cadFile === 'off'){
      setAllowedFormats ([".off"])
    }
    if(cadFile === 'brep'){
      setAllowedFormats ([".brp", ".brep"])
    }
  }
 

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateAndProcessFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateAndProcessFile(file);
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB

    if (!allowedFormats.includes(fileExtension)) {
      toast.error("❌ Invalid file format! Please upload a supported 3D file.");
      return;
    }

    if (fileSizeMB > maxFileSizeMB) {
      toast.error(`⚠️ File size too large! Maximum allowed size is ${maxFileSizeMB}MB.`);
      return;
    }

    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFile = async (file) => {



    const fileSizeMB = file.size / (1024 * 1024); // Size in MB

    try {
      setUploading(true)
      const headers = {
        "x-auth-token": localStorage.getItem("token"),
      };
      const preSignedURL = await axios.post(
        `${BASE_URL}/v1/cad/get-next-presigned-url`,
        { bucket_name: BUCKET, file: file.name, category: "designs_upload", filesize: fileSizeMB, org_id: localStorage.getItem("org_id") }
      );

      if (
        preSignedURL.data.meta.code === 200 &&
        preSignedURL.data.meta.message === "SUCCESS" &&
        preSignedURL.data.data.url
      ) {
        if (preSignedURL.data.data.is_mutipart) {
          await multiUpload(preSignedURL.data.data, file, headers, fileSizeMB);
        } else {
          await Promise.all([simpleUpload(preSignedURL.data.data, file, fileSizeMB), CreateCad(preSignedURL.data.data.url)]);
        }
      } else {
        toast.error("⚠️ Error generating signed URL.");
        setUploading(false)
      }
    } catch (e) {
      console.error(e);
      setUploading(false)
    }
  };
  const UpdateToDocker = async (link, key) => {
    try {
      setUploading(true)
      const response = await axios.post(
        `${BASE_URL}/v1/cad/file-process`,
        { file_url: link, org_id: localStorage.getItem('org_id'), key, s3_bucket: 'design-glb' })
      // /design-view
      if (response.data.meta.success) {
        window.location.href = "/tools/cad-viewer/design-view";
      } else {
        toast.error(response.data.meta.message)
        setUploading(false)
      }

    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }
  const CreateCad = async (link) => {
    try {
      setUploading(true)
      const response = await axios.post(
        `${BASE_URL}/v1/cad/create-cad`,
        { cad_view_link: link, organization_id: localStorage.getItem('org_id') })
      // /design-view
      if (response.data.meta.success) {

        UpdateToDocker(link, response.data.data)
      } else {
        toast.error(response.data.meta.message)
        setUploading(false)
      }

    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }
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
      setUploading(true)
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
      setUploading(false)
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
  
  return (
    <>
   
      {uploading ? <div className={styles["cad-dropzone"]}>
        <span>Please wait uploading your file...</span>
      </div> : <div
        className={styles["cad-dropzone"]}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}

        style={isStyled ? { flexDirection: "column-reverse" } : {}}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept={allowedFormats.join(", ")} // Restrict input to allowed file types
          onChange={handleFileChange}
        />
        <div className={styles["cad-dropzone-content"]} style={isStyled ? { textAlign: "center", alignItems: 'center' } : {}}>
          <p className={styles['cad-dropzone-head']}>
            Drag & drop your 3D <span className={styles['cad-dropzone-file']} style={{ cursor: 'pointer' }}>files</span> here
          </p>
          <span className={styles['cad-dropzone-desc']} style={isStyled ? { width: "80%", textAlign: "center" } : {}}>
            {type ?  `Supported formats:${allowedFormats.join(", ")}` : "Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep)"}

          </span>

        </div>
        <Image
          src={IMAGEURLS.uploadIcon}
          alt="upload"
          width={68}
          height={68}
          style={{ cursor: "pointer" }}
        />
      </div>}

    </>




  );
}

export default CadHomeDropZone;
