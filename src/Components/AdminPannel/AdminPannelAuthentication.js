"use client"
import React,{useState} from 'react'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config'
import { isTestingServerHost, persistTestingAdminSession } from '@/lib/testingServerGate'

function AdminPannelAuthentication({setIsAuthenticated,setShowLogin, title = 'Admin Login', subtitle = '', solid = false}) {
     // 'designs' | 'payments'
    //   const [isAuthenticated, setIsAuthenticated] = useState(false)
    //   const [showLogin, setShowLogin] = useState(false)
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState('')
    
    const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    let signedIn = false

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${BASE_URL}/v1/admin-pannel/admin-login`, {
        admin_email:email,
        password,
      })

      if (response.data.meta.success) {
        const adminUuid = response.data.data.admin_uuid
        localStorage.setItem('admin-uuid', adminUuid)
        if (solid || isTestingServerHost(window.location.hostname)) {
          persistTestingAdminSession(adminUuid)
        }
        signedIn = true
        setIsAuthenticated(true)
        setShowLogin(false)
      } else {
        setError(response.data?.meta?.message || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error?.response?.data?.meta?.message || 'Invalid credentials')
    } finally {
      if (!signedIn) setLoading(false)
    }
  }
   return (
      <div className={solid ? `${styles.loginOverlay} ${styles.loginOverlaySolid}` : styles.loginOverlay}>
        <div className={styles.loginPopup}>
          <h2>{title}</h2>
          {subtitle ? <p className={styles.loginSubtitle}>{subtitle}</p> : null}
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
            {error ? <p className={styles.loginError}>{error}</p> : null}
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Logging in...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    )
}

export default AdminPannelAuthentication