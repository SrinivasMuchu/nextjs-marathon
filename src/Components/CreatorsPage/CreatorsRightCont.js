"use client"
import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import FileHistoryCards from '../History/FileHistoryCards'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function CreatorsRightCont() {
  const [value, setValue] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Tab configuration
  const tabs = [
    { label: "My CAD Files", cadType: "USER_CADS" },
    { label: "CAD Viewer", cadType: "CAD_VIEWER" },
    { label: "CAD Convertor", cadType: "CAD_CONVERTER" },
    // { label: "Downloads", cadType: "Downloads" }
  ]

  useEffect(() => {
    const cadType = searchParams.get('cad_type')
    
    // Set active tab based on URL parameter
    if (cadType === 'CAD_CONVERTER') {
      setValue(2)
    } else if (cadType === 'CAD_VIEWER') {
      setValue(1)
    } else if (cadType === 'USER_CADS') {
      setValue(0)
    } else {
      setValue(0) // Default to My CAD Files
    }
  }, [searchParams])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setCurrentPage(1)
    setTotalPages(1)
    
    // Update URL with corresponding cad_type
    const selectedTab = tabs[newValue]
    router.push(`/creator?cad_type=${selectedTab.cadType}`)
  }

  const getCurrentCadType = () => {
    return tabs[value]?.cadType || 'USER_CADS'
  }

  return (
    <Box sx={{ width: '100%',marginTop:'32px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="creators tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#666',
              '&.Mui-selected': {
                color: '#610bee',
              },
              '&:hover': {
                color: '#610bee',
                opacity: 0.8,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#610bee',
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        <FileHistoryCards 
          cad_type="USER_CADS"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        <FileHistoryCards 
          cad_type="CAD_VIEWER"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        <FileHistoryCards 
          cad_type="CAD_CONVERTER"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      </TabPanel>
    </Box>
  )
}

export default CreatorsRightCont