"use client"
import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import DesignTable from './DesignTable'
import PaymentsTable from './PaymentsTable'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config'

function AdminPannel({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('designs') // 'designs' | 'payments'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if admin UUID exists in localStorage
    const adminUuid = localStorage.getItem('admin-uuid')
    if (adminUuid) {
      setIsAuthenticated(true)
    } else {
      setShowLogin(true)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${BASE_URL}/v1/admin-pannel/admin-login`, {
        admin_email:email,
        password,
      })

      if (response.data.meta.success) {
       
        localStorage.setItem('admin-uuid', response.data.data.admin_uuid)
        setIsAuthenticated(true)
        setShowLogin(false)
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
    
    } finally {
      setLoading(false)
    }
  }

  if (showLogin) {
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginPopup}>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Logging in...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    )
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