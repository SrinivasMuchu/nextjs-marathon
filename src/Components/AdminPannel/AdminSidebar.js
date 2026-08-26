"use client"
import React from 'react'
import styles from './AdminPannel.module.css'
import { MdOutlineDesignServices } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { MdDownload } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdStar } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { MdEngineering } from "react-icons/md";
import { MdDraw } from "react-icons/md";
import { MdTune } from "react-icons/md";
import { MdStorefront } from "react-icons/md";
import { MdClose } from "react-icons/md";

function Chevron({ direction = 'left' }) {
  const rotate = direction === 'left' ? '0' : '180'
  return (
    <svg className={styles.icon} style={{ transform: `rotate(${rotate}deg)` }} viewBox="0 0 24 24" fill="none">
      <path d="M14.5 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const NAV_ITEMS = [
  { id: 'designs', label: 'Designs', title: 'Designs', Icon: MdOutlineDesignServices },
  { id: 'payments', label: 'Payments', title: 'Payments', Icon: MdOutlinePayments },
  { id: 'controls', label: 'Controls', title: 'Controls', Icon: MdTune },
  { id: 'viewed-list', label: 'Top Viewed', title: 'Top Viewed', Icon: MdVisibility },
  { id: 'downloaded-list', label: 'Top Downloaded', title: 'Top Downloaded', Icon: MdDownload },
  { id: 'searched-list', label: 'Search Logs', title: 'Search Logs', Icon: MdSearch },
  { id: 'ratings-list', label: 'Ratings', title: 'Ratings', Icon: MdStar },
  { id: 'likes-list', label: 'Likes', title: 'Likes', Icon: MdFavorite },
  { id: 'cad-service-requests', label: 'CAD Requests', title: 'CAD Service Requests', Icon: MdEngineering },
  { id: 'techdraw-jobs', label: 'TechDraw', title: 'TechDraw Uploads', Icon: MdDraw },
  { id: 'vendors', label: 'Vendors', title: 'Vendors', Icon: MdStorefront },
]

function AdminSidebar({ collapsed, mobileOpen, activeTab, onToggle, onCloseMobile, onSelect }) {
  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.sidebarMobileOpen : ''}`}
    >
      <div className={styles.sidebarHeader}>
        {(!collapsed || mobileOpen) && (
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
        <button
          type="button"
          className={styles.mobileCloseBtn}
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          <MdClose size={20} />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ id, label, title, Icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.navItem} ${activeTab === id ? styles.active : ''}`}
            onClick={() => onSelect(id)}
            title={title}
          >
            <Icon />
            {(!collapsed || mobileOpen) && <span className={styles.label}>{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
