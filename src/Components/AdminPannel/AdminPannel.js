"use client"
import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import DesignTable from './DesignTable'
import PaymentsTable from './PaymentsTable'
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

  const content = (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 className={styles.title}>{activeTab === 'designs' ? 'Designs' : 'Payments'}</h2>
      </div>
      {activeTab === 'designs' ? <DesignTable /> : <PaymentsTable />}
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
      <div style={{height:'90vh',overFlow:'auto'}} >

        {children ?? content}
      </div>
      
    </div>
  )
}

export default AdminPannel