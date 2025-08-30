"use client";
import React from 'react'
import styles from './FileHistory.module.css';
import { IMAGEURLS } from '@/config';
import Image from 'next/image';
import Loading from '../CommonJsx/Loaders/Loading';
import EastIcon from '@mui/icons-material/East';
import { textLettersLimit } from '@/common.helper';
import FileStatus from '../CommonJsx/FileStatus';
import { SiConvertio } from "react-icons/si";
import Link from 'next/link';

function CadConvertorFiles({loading,cadConverterFileHistory,downloading,handleDownload,searchTerm, setSearchTerm}) {
  return (
    <div className={styles.cadViewerContainerContent}>
 <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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
                    <Link
                    href='/tools/3d-file-converter' 
                      className={styles.cadUploadingButton}
                      style={{
                        borderRadius: '24px',
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
                      }}
                    >
                      <SiConvertio style={{ fontSize: '16px' }} />
                      Convert file
                    </Link>
                  </div>
            {loading ? <Loading smallScreen={true}/> : <>
 
            
              {(cadConverterFileHistory.length) > 0 ? (
                <div className={styles.historyContainer}>
                 

                  <div className={styles['industry-design-files']}>
                    <div className={styles['industry-design-files-bottom']}>
                      <span className={styles['industry-design-files-count']}>Files {cadConverterFileHistory.length}</span>
                      <table className={styles['industry-design-files-list']}>
                        <thead>
                          <tr>
                            <th style={{ width: '25%' }}>File Name</th>
                            <th style={{ width: '20%' }}>Conversion</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '20%' }}>Created</th>
                            <th style={{ width: '20%' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cadConverterFileHistory.map((file, index) => (
                            <tr key={index}>
                              <td data-label="File Name">
                                {textLettersLimit(file.file_name, 20)}
                              </td>
                              <td data-label="Conversion">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span>{file.input_format}</span>
                                  <EastIcon style={{ fontSize: '16px', color: '#6c757d' }} />
                                  <span>{file.output_format}</span>
                                </div>
                              </td>
                              <td data-label="Status">
                                <FileStatus status={file.status} />
                              </td>
                              <td data-label="Created">
                                {file.createdAtFormatted}
                              </td>
                              <td data-label="Action">
                                {file.status === 'COMPLETED' ? (
                                  <button
                                    className={styles['industry-design-files-btn']}
                                    onClick={() => handleDownload(file, index)}
                                    disabled={downloading[index]}
                                  >
                                    {downloading[index] ? 'Downloading...' : 'Download'}
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className={styles['industry-design-files-btn']}
                                    style={{
                                      background: '#a270f2',
                                      cursor: 'not-allowed'
                                    }}
                                  >
                                    Download
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  alignItems: 'center', flexDirection: 'column',
                  width: '300px', textAlign: 'center', gap: '40px'

                }}>
                  <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
                  <span>You don&apos;t have any projects yet.<br />
                    <Link href='/tools/3d-file-converter' style={{ color: 'blue' }}>Upload</Link> your project files
                  </span>
                </div>

              )}
            </>
            }
          </div>
  )
}

export default CadConvertorFiles