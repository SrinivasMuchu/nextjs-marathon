import React, { useState, useEffect } from 'react'
import { IoAddSharp } from "react-icons/io5";
import Loading from '../CommonJsx/Loaders/Loading';
import { IMAGEURLS, BASE_URL } from '@/config';
import Image from 'next/image';
import styles from './FileHistory.module.css';
import FileStatus from '../CommonJsx/FileStatus';
import Link from 'next/link';
import { textLettersLimit } from '@/common.helper';
import DesignStats from '../CommonJsx/DesignStats';
import libraryStyles from '../Library/Library.module.css'
import HoverImageSequence from '../CommonJsx/RotatedImages';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import axios from 'axios';
import { RiEdit2Fill } from "react-icons/ri";
import PublishCadPopUp from '../CommonJsx/PublishCadPopUp';



function CadPublishedFiles({loading,userCadFiles,type,searchTerm,
  setSearchTerm,selectedFilter,setSelectedFilter,
  setPublishCadPopUp,creatorId,handlePublishCad}) {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [allFilters, setAllFilters] = useState([]); // Store objects with id and label
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [editDesignPopup, setEditDesignPopup] = useState(false);
  const [selectedDesignForEdit, setSelectedDesignForEdit] = useState(null);
  
  const visibleFilters = allFilters.slice(0, 4);
  const moreFilters = allFilters.slice(4);

  // Fetch CAD tags from API
  useEffect(() => {
    const fetchCadTags = async () => {
      try {
        if(type === 'USER_DOWNLOADS'){
          return
        }
        setLoadingFilters(true);
const tagsResponse = await axios.get(
  `${BASE_URL}/v1/cad-creator/get-cad-tags`,
  {
    headers: {
      "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security
    },
    cache: 'no-store',
  }
);
        
        const allTags = tagsResponse.data?.data?.cad_tags || [];
        
        // Create filter options from API response with both id and label
        const tagOptions = allTags.map((tags) => ({
          id: tags._id,
          label: tags.cad_tag_label
        }));
        
        // Combine 'All' with the fetched tags
        setAllFilters([{ id: 'All', label: 'All' }, ...tagOptions]);
      } catch (error) {
        console.error('Error fetching CAD tags:', error);
        // Fallback to default filters if API fails
        // setAllFilters([
        //   { id: 'All', label: 'All' },
        //   { id: 'mechanical', label: 'Mechanical' },
        //   { id: 'automotive', label: 'Automotive' },
        //   { id: 'industrial', label: 'Industrial' },
        //   { id: 'product', label: 'Product' }
        // ]);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchCadTags();
  }, []);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter); // This will now update the parent component's state with the filter object
    setShowMoreDropdown(false);
  };

  // Handle click on rejected design to open edit popup
  const handleRejectedDesignClick = (e, file) => {
    if (file.status?.toLowerCase() === 'rejected' && file.rejected_message_id) {
      e.preventDefault(); // Prevent navigation
      setSelectedDesignForEdit(file);
      setEditDesignPopup(true);
    }
  };

  // Close edit popup
  const handleCloseEditPopup = () => {
    setEditDesignPopup(false);
    setSelectedDesignForEdit(null);
  };


  
  return (
    <div className={styles.cadViewerContainerContent}>
       {(!type&&!creatorId) && 
          <div style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            
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

            {/* Updated Filter Tabs with More dropdown */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {loadingFilters ? (
                // Show loading skeleton for filters
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '80px',
                        height: '36px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '20px',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {/* Visible filter buttons */}
                  {visibleFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterClick(filter)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        backgroundColor: selectedFilter?.id === filter.id ? '#610BEE' : 'transparent',
                        color: selectedFilter?.id === filter.id ? 'white' : '#6c757d',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFilter?.id !== filter.id) {
                          e.target.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFilter?.id !== filter.id) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}

                  {/* More dropdown */}
                  {moreFilters.length > 0 && (
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: '20px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          backgroundColor: moreFilters.some(f => f.id === selectedFilter?.id) ? '#610BEE' : 'transparent',
                          color: moreFilters.some(f => f.id === selectedFilter?.id) ? 'white' : '#6c757d',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={(e) => {
                          if (!moreFilters.some(f => f.id === selectedFilter?.id)) {
                            e.target.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!moreFilters.some(f => f.id === selectedFilter?.id)) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {moreFilters.find(f => f.id === selectedFilter?.id)?.label || 'More'}
                        <svg
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          style={{
                            transform: showMoreDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}
                        >
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {showMoreDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: '0',
                          marginTop: '4px',
                          backgroundColor: 'white',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          zIndex: 1000,
                          minWidth: '140px'
                        }}>
                          {moreFilters.map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => handleFilterClick(filter)}
                              style={{
                                width: '100%',
                                padding: '8px 16px',
                                border: 'none',
                                backgroundColor: selectedFilter?.id === filter.id ? '#f8f9fa' : 'transparent',
                                color: selectedFilter?.id === filter.id ? '#610BEE' : '#6c757d',
                                fontSize: '14px',
                                fontWeight: selectedFilter?.id === filter.id ? '600' : '400',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                borderRadius: '6px',
                                margin: '2px'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                              }}
                              onMouseLeave={(e) => {
                                if (selectedFilter?.id !== filter.id) {
                                  e.target.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right side - New Project Button */}
            <button
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
              onClick={handlePublishCad}
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
      {loading ? <Loading smallScreen={true}/> : <>
        {userCadFiles.length > 0 ? (
         
            <div className={styles.historyContainer} style={{gap:'0px'}}>
            {/* Projects Grid */}
            {userCadFiles.map((file, index) => (
               <div key={index}
                className={styles["library-designs-items-div"]} 
                style={{
                  borderRadius:'12px',
                  boxSizing:'border-box',
                  width:'315px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  margin: '12px 8px',
                  padding: '0',
                  transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
                  cursor:  file.rejected_message_id ? 'pointer' : 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={(e) => handleRejectedDesignClick(e, file)}
                title={ file.rejected_message_id ? 
                  `Rejected: ${file.rejected_message_id}. Click to edit.` : ''
                }
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
              <Link  href={`/library/${file.route}`}
              style={{boxShadow:'none',background:'white',border:'none',height:'auto',overflow:'hidden'}}
               className={libraryStyles["library-designs-items-container"]}
                onClick={e => (!file.is_live || (file.status?.toLowerCase() === 'rejected' && file.rejected_message_id)) && e.preventDefault()}
              >
                 {/* <div className={libraryStyles["library-designs-items-container-cost"]}>
                  {file.price ? <span>{file.price} </span> : 'Free'}</div> */}
              {/* {!type ?  <div className={libraryStyles["library-designs-items-container-cost"]}>
                  Free</div>:
                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>

                  <FileStatus status={!file.is_uploaded?'Pending':'Completed'} />
                </div>
                  }  */}
                

                 <div style={{ position: 'absolute', top: '10px', left: '10px' }}>  
                   <FileStatus status={file.status} />  
                  
                 </div>
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>  
                  
                   { file.rejected_message_id && (
                     <div style={{
                      //  marginTop: '4px',
                       padding: '4px 8px',
                       backgroundColor: '#fee2e2',
                       border: '1px solid #fca5a5',
                       borderRadius: '4px',
                       fontSize: '20px',
                       color: '#dc2626',
                       fontWeight: '500'
                     }}>
                       <RiEdit2Fill style={{ marginRight: '4px' }} />
                     </div>
                   )}
                 </div>
               
                {file.is_live ?
                  <HoverImageSequence design={file} width={315} height={180} />
                  : <div style={{ width: '100%', height: '180px', background: '#e6e4f0' }} />}
               
                <div className={libraryStyles["design-title-wrapper"]}>
                  <h6 title={file.page_title} style={{height:'55px',fontSize:'16px'}}>{file.page_title}</h6>
                  {/* <p title={file.page_description}>{textLettersLimit(file.page_description, 120)}</p> */}
                  <div className={libraryStyles["design-title-text"]} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {file.category_labels && file.category_labels.map((label, index) => (
                      <DesignDetailsStats key={index} text={label} />
                    ))}
                    {file.tag_labels && file.tag_labels.map((label, index) => (
                      <DesignDetailsStats key={index} text={label} />
                    ))}
                    {/* {file?.average_rating && (
                      <DesignDetailsStats key={index} text={`${file.average_rating}(${file.rating_count})`} />
                    )} */}
                    <DesignDetailsStats fileType={file.file_type ? `.${file.file_type.toLowerCase()}` : '.STEP'} text={file.file_type ? `.${file.file_type.toUpperCase()}` : '.STEP'} />
                     <div className={libraryStyles["design-stats-wrapper"]}>
                  <DesignStats views={file.total_design_views ?? 0}
                    downloads={file.total_design_downloads ?? 0}
                    ratings={{ average: file.average_rating, total: file.rating_count }} />
                </div>
                  </div>
                  <span className={libraryStyles["design-title-wrapper-price"]}>{file.price?`$${file.price}`:'Free'}</span>
                </div>
              </Link>
               </div>
            ))}
         
          </div>
          
        ) : (
          <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', flexDirection: 'column',
            width: '300px', textAlign: 'center', gap: '40px'
          }}>
            <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
            {!type ? <>
             <span>{!creatorId?"You don't have any projects yet.":'No projects yet.'}<br />
             {!creatorId && <> <button onClick={handlePublishCad} style={{ color: 'blue' }}>Upload</button> your project files</>}
            </span>
            </>:<>
             <span>You have no downloads yet<br />
              <Link href="/library" style={{ color: 'blue' }}>Explore</Link>
            </span>
            </>}
          </div>
        )}
      </>}

      {/* Edit Design Popup for Rejected Files */}
      {editDesignPopup && selectedDesignForEdit && 
            <PublishCadPopUp
              editedDetails={selectedDesignForEdit}
              onClose={handleCloseEditPopup}
              rejected={true}
              // type="edit"
              showHeaderClose={true}
           
            />}
    </div>
  )
}

export default CadPublishedFiles