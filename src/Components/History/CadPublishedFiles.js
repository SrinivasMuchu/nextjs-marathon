import React from 'react'
import { IoAddSharp } from "react-icons/io5";
import Loading from '../CommonJsx/Loaders/Loading';
import { IMAGEURLS } from '@/config';
import Image from 'next/image';
import styles from './FileHistory.module.css';
import FileStatus from '../CommonJsx/FileStatus';
import Link from 'next/link';
import { textLettersLimit } from '@/common.helper';
import DesignStats from '../CommonJsx/DesignStats';
import libraryStyles from '../Library/Library.module.css'
import HoverImageSequence from '../CommonJsx/RotatedImages';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';

function CadPublishedFiles({loading,userCadFiles,type,searchTerm,
setSearchTerm}) {
  return (
    <div className={styles.cadViewerContainerContent}>
            {loading ? <Loading /> : <>
                              {!type && 
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    gap: '16px'
                  }}>
                    {/* Left side - Search */}
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

                    {/* Center - Filter Tabs */}
                    {/* <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center'
                    }}>
                      {['All', 'Mechanical', 'Automotive', 'Industrial', 'Product'].map((filter, index) => (
                        <button
                          key={filter}
                          style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: index === 0 ? '#610BEE' : 'transparent',
                            color: index === 0 ? 'white' : '#6c757d',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (index !== 0) {
                              e.target.style.backgroundColor = '#f8f9fa';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (index !== 0) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div> */}

                    {/* Right side - New Project Button */}
                    <button
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
                      onClick={() => setPublishCadPopUp(true)}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#610BEE';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = '#610BEE';
                      }}
                    >
                      <IoAddSharp style={{ fontSize: '16px' }} />
                      New Project
                    </button>
                  </div>
}
              {userCadFiles.length > 0 ? (
                <div className={styles.historyContainer}>
                  {/* Search and Filter Header */}

                  {/* Projects Grid */}
                  {userCadFiles.map((file, index) => (
                    <Link key={index} href={`/library/${file.route}`} className={libraryStyles["library-designs-items-container"]}
                      onClick={e => !file.is_uploaded && e.preventDefault()}
                    >
                      {/* <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                <FileStatus status={file.is_uploaded ? 'completed' : 'pending'} />
              </div>
              <button style={{ position: 'absolute', right: '10px', top: '10px' }}
                onClick={() => { setPublishCadPopUp(true), serEditDetails(file) }}><Image
                  src={`${ASSET_PREFIX_URL}edit-ticket.png`}
                  alt="edit"
                  width={16}
                  height={16}
                /></button> */}
                      {/* <div className={styles["library-designs-inner"]}> */}
                      <div className={libraryStyles["library-designs-items-container-cost"]}>Free</div>
                      {/* <div className={styles["library-designs-items-container-img"]}>
                            <Image
                          // className={styles["library-designs-items-container-img"]}
                          src={`${DESIGN_GLB_PREFIX_URL}${design._id}/sprite_0_0.webp`}
                          alt={design.page_title}
                          width={300}
                          height={250}
                        />
                        </div> */}
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                          <FileStatus status={!file.is_uploaded?'Pending':'Completed'} />
                        </div>
                      {file.is_uploaded ?
                        <HoverImageSequence design={file} width={300} height={250} />
                        : <div style={{ width: '100%', height: '250px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                      <div className={libraryStyles["design-stats-wrapper"]}>
                        <DesignStats views={file.total_design_views ?? 0}
                          downloads={file.total_design_downloads ?? 0} />
                      </div>
                      <div className={libraryStyles["design-title-wrapper"]}>
                        <h6 title={file.page_title}>{textLettersLimit(file.page_title, 30)}</h6>
                        <p title={file.page_description}>{textLettersLimit(file.page_description, 120)}</p>
                        <div className={libraryStyles["design-title-text"]} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* {design.industry_name &&<DesignDetailsStats  text={design.industry_name} />} */}
                          {file.category_labels && file.category_labels.map((label, index) => (
                            <DesignDetailsStats key={index} text={label} />
                          ))}
                          {file.tag_labels && file.tag_labels.map((label, index) => (
                            <DesignDetailsStats key={index} text={label} />
                          ))}
                          <DesignDetailsStats fileType={file.file_type ? `.${file.file_type.toLowerCase()}` : '.STEP'} text={file.file_type ? `.${file.file_type.toUpperCase()}` : '.STEP'} />
                        </div>
                        <span className={libraryStyles["design-title-wrapper-price"]}>Free</span>

                      </div>


                      {/* </div> */}
                    </Link>

                    // {file.is_uploaded === true && <DesignStats views={file.total_design_views} downloads={file.total_design_downloads} />}
                    // </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  alignItems: 'center', flexDirection: 'column',
                  width: '300px', textAlign: 'center', gap: '40px'

                }}>
                  <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
                  {type ? <>
                   <span>You don't have any projects yet.<br />
                    <button onClick={() => setPublishCadPopUp(true)} style={{ color: 'blue' }}>Upload</button> your project files
                  </span>
                  </>:<>
                   <span>You have no downloads yet<br />
                    <Link href="/library">Explore</Link>
                  </span>
                  </>}
                 
                </div>

              )}
            </>}
          </div>
        
  )
}

export default CadPublishedFiles