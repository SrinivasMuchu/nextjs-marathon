"use client"
import React from 'react'
import styles from './AdminPannel.module.css'
import { MdOutlineDesignServices } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";


function Chevron({ direction = 'left' }) {
  const rotate = direction === 'left' ? '0' : '180'
  return (
    <svg className={styles.icon} style={{ transform: `rotate(${rotate}deg)` }} viewBox="0 0 24 24" fill="none">
      <path d="M14.5 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}



function AdminSidebar({ collapsed, activeTab, onToggle, onSelect }) {
  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!collapsed && (
          <div className={styles.brand}>
            <span className={styles.brandIcon}>A</span>
            <span>Admin</span>
          </div>
        )}
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={onToggle}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <Chevron direction={collapsed ? 'right' : 'left'} />
        </button>
      </div>

      <nav className={styles.nav}>
        <button
          type="button"
          className={`${styles.navItem} ${activeTab === 'designs' ? styles.active : ''}`}
          onClick={() => onSelect('designs')}
          title="Designs"
        >
          <MdOutlineDesignServices />
          {!collapsed && <span className={styles.label}>Designs</span>}
        </button>

        <button
          type="button"
          className={`${styles.navItem} ${activeTab === 'payments' ? styles.active : ''}`}
          onClick={() => onSelect('payments')}
          title="Payments"
        >
          <MdOutlinePayments />
          {!collapsed && <span className={styles.label}>Payments</span>}
        </button>
      </nav>
    </aside>
  )
}

export default AdminSidebar