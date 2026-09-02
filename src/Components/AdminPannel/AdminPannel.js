"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { MdMenu } from 'react-icons/md'
import AdminSidebar from './AdminSidebar'
import DesignTable from './DesignTable'
import PaymentsTable from './PaymentsTable'
import ViewedList from './ViewedList'
import DownloadedList from './DownloadedList'
import SearchedList from './SearchedList'
import RatingsList from './RatingsList'
import LikesList from './LikesList'
import CadServiceRequestsTable from './CadServiceRequestsTable'
import TechDrawJobsTable from './TechDrawJobsTable'
import AdminControlsPanel from './AdminControlsPanel'
import VendorsTable from './VendorsTable'
import styles from './AdminPannel.module.css'
import AdminPannelAuthentication from './AdminPannelAuthentication'
import {
  adminHrefForTab,
  adminTabFromSearchParams,
  DEFAULT_ADMIN_TAB,
  isValidAdminTab,
} from './adminTabConfig'

function AdminPannel({ children, initialTab = DEFAULT_ADMIN_TAB }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMainAdminPage = pathname === '/admin'

  const tabFromUrl = isMainAdminPage ? adminTabFromSearchParams(searchParams) : initialTab
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(
    isValidAdminTab(initialTab) ? initialTab : tabFromUrl,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const adminUuid = localStorage.getItem('admin-uuid')
    if (adminUuid) {
      setIsAuthenticated(true)
    } else {
      setShowLogin(true)
    }
  }, [])

  useEffect(() => {
    if (isMainAdminPage) {
      setActiveTab(adminTabFromSearchParams(searchParams))
      return
    }
    if (isValidAdminTab(initialTab)) {
      setActiveTab(initialTab)
    }
  }, [initialTab, isMainAdminPage, searchParams])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [activeTab, pathname])

  useEffect(() => {
    if (!mobileNavOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  const handleSelectTab = useCallback(
    (tab) => {
      if (!isValidAdminTab(tab)) return
      setMobileNavOpen(false)

      if (isMainAdminPage) {
        router.replace(adminHrefForTab(tab), { scroll: false })
        return
      }

      router.push(adminHrefForTab(tab))
    },
    [isMainAdminPage, router],
  )

  if (showLogin) {
    return <AdminPannelAuthentication setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} />
  }

  if (!isAuthenticated) {
    return null
  }

  const getTitle = () => {
    switch(activeTab) {
      case 'designs':
        return 'Designs'
      case 'payments':
        return 'Payments'
      case 'controls':
        return 'Controls'
      case 'viewed-list':
        return 'Top Viewed'
      case 'downloaded-list':
        return 'Top Downloaded'
      case 'searched-list':
        return 'Search Logs'
      case 'ratings-list':
        return 'Ratings'
      case 'likes-list':
        return 'Likes'
      case 'cad-service-requests':
        return ''
      case 'techdraw-jobs':
        return 'TechDraw Uploads'
      case 'vendors':
        return 'Vendors'
      default:
        return 'Admin Panel'
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'designs':
        return <DesignTable />
      case 'payments':
        return <PaymentsTable />
      case 'controls':
        return <AdminControlsPanel />
      case 'viewed-list':
        return <ViewedList />
      case 'downloaded-list':
        return <DownloadedList />
      case 'searched-list':
        return <SearchedList />
      case 'ratings-list':
        return <RatingsList />
      case 'likes-list':
        return <LikesList />
      case 'cad-service-requests':
        return <CadServiceRequestsTable />
      case 'techdraw-jobs':
        return <TechDrawJobsTable />
      case 'vendors':
        return <VendorsTable />
      default:
        return <DesignTable />
    }
  }

  const title = getTitle()

  const content = (
    <div className={styles.content}>
      {title ? (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      ) : null}
      {renderContent()}
    </div>
  )

  return (
    <div className={`${styles.container} ${mobileNavOpen ? styles.mobileNavOpen : ''}`}>
      <div className={styles.mobileTopBar}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open admin menu"
        >
          <MdMenu size={22} />
        </button>
        <span className={styles.mobileTopTitle}>{title || 'Admin'}</span>
      </div>

      {mobileNavOpen ? (
        <button
          type="button"
          className={styles.sidebarScrim}
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileNavOpen}
        activeTab={activeTab}
        onToggle={() => setCollapsed((v) => !v)}
        onCloseMobile={() => setMobileNavOpen(false)}
        onSelect={handleSelectTab}
      />
      <div className={styles.mainContent}>
        {children ?? content}
      </div>
    </div>
  )
}

export default AdminPannel
