"use client";
import React from 'react'
import styles from './FileHistory.module.css';
import { IMAGEURLS } from '@/config';
import Image from 'next/image';
import Loading from '../CommonJsx/Loaders/Loading';
import { IoAddSharp } from "react-icons/io5";
import FileStatus from '../CommonJsx/FileStatus';
import Link from 'next/link';
import { textLettersLimit } from '@/common.helper';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';

function CadViewerFiles({ loading, cadViewerFileHistory, searchTerm,
  setSearchTerm, getFileHref, setIsEmailVerify }) {
  return (
    <div className={styles.cadViewerContainerContent}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '24px',
          padding: '8px 16px',
          border: '1px solid #e9ecef',
          minWidth: '280px',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              flex: 1,
              fontSize: '14px',
              color: '#495057'
            }}
          />
        </div>
        {/* <button className={styles.cadUploadingButton}  */}
        {/* > */}
        <Link href='/tools//3D-cad-viewer'
          // style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          style={{
            borderRadius: '8px',
            border: '2px solid #610BEE',
            background: 'white',
            color: '#610BEE',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}

          onMouseEnter={(e) => {
            e.target.style.background = '#610BEE';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = '#610BEE';
          }}><IoAddSharp /> New file</Link>
        {/* </button> */}
      </div>
      {loading ? <Loading smallScreen={true} /> : <>

        {cadViewerFileHistory.length > 0 ? (
          <>


            <div className={styles.historyContainer}>

              {cadViewerFileHistory.map((file, index) => (
                <a
                  key={index}
                  href={getFileHref(file)}
                  className={styles.historyItem}
                  style={{ width: '310px', position: 'relative' }}
                  onClick={e => {
                    if (!localStorage.getItem('is_verified')) {
                      e.preventDefault();
                      setIsEmailVerify(true); // <-- call this here, not in getFileHref
                      return;
                    }
                    if (file.status !== 'COMPLETED') {
                      e.preventDefault();
                      return;
                    }
                    // localStorage.setItem("last_viewed_cad_key", file._id);
                  }}
                >

                  <div style={{ position: 'absolute', top: '10px' }}>
                    <FileStatus status={file.status} />
                  </div>
                  {file.status === 'COMPLETED' ? <HoverImageSequence design={{ _id: file._id, page_title: file.file_name }} width={300} height={160} /> : <div style={{ width: '100%', height: '160px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                  {/* <div style={{ width: '100%', height: '2px', background: '#e6e4f0', marginBottom: '5px' }}></div> */}

                  <div className={styles.historyFileDetails}>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>{textLettersLimit(file.file_name, 20)}</span></div>
                  <div style={{ width: '75px', fontSize: '12px' }}>
                    <DesignDetailsStats
                      fileType={file?.file_name && file.file_name.includes(".")
                        ? `.${file.file_name.split(".").pop().toLowerCase()}`
                        : ".step"}
                      text={file?.file_name && file.file_name.includes(".")
                        ? `.${file.file_name.split(".").pop().toUpperCase()}`
                        : ".STEP"}
                    />



                  </div>

                  {/* <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Status</span> <span style={{ color: 'green' }}>{file.status}</span></div> */}
                  <div className={styles.historyFileDetails}> <span style={{ color: 'rgba(0, 19, 37, 0.50)', fontSize: '12px', fontWeight: '400' }}>{file.createdAtFormatted}</span></div>

                  {/* <div className={styles.historyFileDetailsbtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <button onClick={() => handleViewDesign(file)} disabled={file.status !== 'COMPLETED'} style={{
                            background: file.status !== 'COMPLETED' ? '#a270f2' : '#610bee',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}>View design</button>
                        </div> */}
                </a>
              ))}
            </div>
          </>

        ) : (
          <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', flexDirection: 'column',
            width: '300px', textAlign: 'center', gap: '40px'

          }}>
            <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
            <span>You don’t have any projects yet.<br />
              <Link href='/tools//3D-cad-viewer' style={{ color: 'blue' }}>Upload</Link> your project files
            </span>
            {/* <Link href='/publish-cad' style={{ color: 'blue' }}>Click here</Link> */}
          </div>

        )}
      </>}
    </div>
  )
}

export default CadViewerFiles