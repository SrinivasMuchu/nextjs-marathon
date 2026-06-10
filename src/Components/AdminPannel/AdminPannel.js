"use client"
import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import DesignTable from './DesignTable'
import PaymentsTable from './PaymentsTable'
import ViewedList from './ViewedList'
import DownloadedList from './DownloadedList'
import SearchedList from './SearchedList'
import RatingsList from './RatingsList'
import LikesList from './LikesList'
import CadServiceRequestsTable from './CadServiceRequestsTable'
import styles from './AdminPannel.module.css'
import AdminPannelAuthentication from './AdminPannelAuthentication'


function AdminPannel({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('designs') // 'designs' | 'payments'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
 

  useEffect(() => {
    // Check if admin UUID exists in localStorage
    const adminUuid = localStorage.getItem('admin-uuid')
    if (adminUuid) {
      setIsAuthenticated(true)
    } else {
      setShowLogin(true)
    }
  }, [])



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
      default:
        return <DesignTable />
    }
  }

  const content = (
    <div className={styles.content}>
      {getTitle() ? (
        <div className={styles.header}>
          <h2 className={styles.title}>{getTitle()}</h2>
        </div>
      ) : null}
      {renderContent()}
    </div>
  )

  return (
    <div className={styles.container}>
      <AdminSidebar
        collapsed={collapsed}
        activeTab={activeTab}
        onToggle={() => setCollapsed(v => !v)}
        onSelect={setActiveTab}
      />
      <div className={styles.mainContent}>
        {children ?? content}
      </div>
      
    </div>
  )
}

export default AdminPannel