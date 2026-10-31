"use client"
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import {
  Box as CadBox,
  ListTree,
  RefreshCw,
  Scan,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BASE_URL } from '@/config'
import FileHistoryCards from '../History/FileHistoryCards'
import TechDrawDashboardCards from '../History/TechDrawDashboardCards'
import StepBomDashboardCards from '../History/StepBomDashboardCards'
import DashboardWorkspace from './DashboardWorkspace'
import mobileStyles from './DashboardMobile.module.css'
import workspaceStyles from './DashboardWorkspace.module.css'

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
        <Box sx={{ p: { xs: 0, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const tabs = [
  { label: "CAD Convertor", cadType: "CAD_CONVERTER", countField: "cadFilesTotal", blurb: "Original and converted files stay together. Download either one at any time.", Icon: RefreshCw },
  { label: "CAD Viewer", cadType: "CAD_VIEWER", countField: "cadFilesTotal", blurb: "Files you opened in the viewer stay saved with this account.", Icon: CadBox },
  { label: "2D Drawings", cadType: "CAD_TECHDRAW", countField: "techdrawFilesTotal", blurb: "Technical drawings generated from your CAD files.", Icon: Scan },
  { label: "STEP BOM", cadType: "CAD_STEP_BOM", countField: "stepBomFilesTotal", blurb: "Bills of materials extracted from your STEP files.", Icon: ListTree },
]

function CreatorsRightCont({
  creatorId }) {
  const [value, setValue] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableSectionRef = useRef(null)

  const scrollMenusToTop = () => {
    requestAnimationFrame(() => {
      const node = document.getElementById('dashboard-menu-anchor')
      const header = document.querySelector('.siteStickyHeader')
      const offset = header?.getBoundingClientRect().height || 0
      if (!node) return
      const top = node.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
  }

  useEffect(() => {
    if (creatorId) return undefined
    let cancelled = false
    const counted = tabs.filter((tab) => tab.countField)
    Promise.all(counted.map(async (tab) => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
          params: { type: tab.cadType, page: 1, limit: 1 },
          headers: { "user-uuid": localStorage.getItem("uuid") },
        })
        const pagination = response.data?.data?.pagination || {}
        return [tab.cadType, Number(pagination[tab.countField]) || 0]
      } catch {
        return [tab.cadType, null]
      }
    })).then((entries) => {
      if (cancelled) return
      const next = {}
      entries.forEach(([cadType, total]) => {
        if (total != null) next[cadType] = total
      })
      setCounts(next)
    })
    return () => {
      cancelled = true
    }
  }, [creatorId])

  useEffect(() => {
    if (creatorId) return undefined
    const applyOffset = () => {
      const header = document.querySelector('.siteStickyHeader')
      const height = header?.getBoundingClientRect().height || 0
      document.documentElement.style.setProperty('--dashboard-menu-stick', `${height}px`)
    }
    applyOffset()
    window.addEventListener('resize', applyOffset)
    return () => window.removeEventListener('resize', applyOffset)
  }, [creatorId])

  useEffect(() => {
    const cadType = searchParams.get('cad_type')
    if (creatorId) {
      setValue(0)
      return
    }

    const index = tabs.findIndex((tab) => tab.cadType === cadType)
    setValue(index >= 0 ? index : 0)
  }, [searchParams, creatorId])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setCurrentPage(1)
    setTotalPages(1)

    // Update URL with corresponding cad_type (keep scroll; don't jump to page top)
    const selectedTab = creatorId ? { cadType: 'USER_CADS' } : tabs[newValue]
    router.push(`/dashboard?cad_type=${selectedTab.cadType}`, { scroll: false })
    if (!creatorId) scrollMenusToTop()
  }

  const getCurrentCadType = () => {
    return tabs[value]?.cadType || 'USER_CADS'
  }

  return (
    <Box
      ref={tableSectionRef}
      id="dashboard-files-table"
      className={!creatorId ? `${mobileStyles.rightWrap} ${workspaceStyles.pagePad}${searchParams.get('cad_type') === 'USER_PROFILE' ? ` ${mobileStyles.hideOnMobile}` : ''}` : undefined}
      sx={{ width: '100%', minWidth: 0, marginTop: creatorId ? '32px' : '8px', scrollMarginTop: '88px' }}
    >
      {!creatorId ?
        <>
          <div className={mobileStyles.workspaceOnly}>
            <DashboardWorkspace />
          </div>
          <div className={workspaceStyles.panel} id="dashboard-menu-anchor">
          <div className={`${workspaceStyles.tabBar} ${mobileStyles.desktopTabs}`} role="tablist" aria-label="Workspace files">
            {tabs.map((tab, index) => {
              const Icon = tab.Icon
              const selected = value === index
              return (
                <button
                  key={tab.cadType}
                  type="button"
                  role="tab"
                  id={`simple-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`simple-tabpanel-${index}`}
                  className={selected ? workspaceStyles.tabActive : workspaceStyles.tab}
                  onClick={() => handleChange(null, index)}
                >
                  <Icon size={15} strokeWidth={1.75} />
                  {tab.label}
                  {counts[tab.cadType] != null ? (
                    <span className={workspaceStyles.count}>{counts[tab.cadType]}</span>
                  ) : null}
                </button>
              )
            })}
          </div>
          {tabs[value]?.cadType !== 'CAD_CONVERTER' ? (
          <div className={`${workspaceStyles.sectionHead} ${mobileStyles.desktopTabs}`}>
            <div>
              <h2>{tabs[value]?.label}</h2>
              <p>{tabs[value]?.blurb}</p>
            </div>
          </div>
          ) : null}
          <TabPanel value={value} index={0} style={{ background: 'transparent', height: '100%' }}>
            <FileHistoryCards
              cad_type="CAD_CONVERTER"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
            />
          </TabPanel>

          <TabPanel value={value} index={1} style={{ background: 'transparent', height: '100%' }}>
            <FileHistoryCards
              cad_type="CAD_VIEWER"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
            />
          </TabPanel>

          <TabPanel value={value} index={2} style={{ background: 'transparent', height: '100%' }}>
            <TechDrawDashboardCards
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
            />
          </TabPanel>
          <TabPanel value={value} index={3} style={{ background: 'transparent', height: '100%' }}>
            <StepBomDashboardCards
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
            />
          </TabPanel>
          </div>
        </> :
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="creators tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
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
            {/* {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))} */}
            <Tab label='Projects' />
          </Tabs>
          <Box sx={{ width: '100%', height: '1.5px', background: '#e0e0e0', mt: '-1px' }} />
          <TabPanel value={value} index={0} style={{ background: '#F6F6F6', height: '100%' }}>
            <FileHistoryCards

              cad_type="USER_CADS"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              creatorId={creatorId}
              profilePageDetails={true}
            />
          </TabPanel>
        </>


      }



    </Box>
  )
}

export default CreatorsRightCont
