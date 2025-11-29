"use client"
import React,{useState} from 'react'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config'

function AdminPannelAuthentication({setIsAuthenticated,setShowLogin}) {
     // 'designs' | 'payments'
    //   const [isAuthenticated, setIsAuthenticated] = useState(false)
    //   const [showLogin, setShowLogin] = useState(false)
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [loading, setLoading] = useState(false)
    
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

export default AdminPannelAuthentication