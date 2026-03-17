import React from 'react'
import { Briefcase, Package, Truck, Cpu, Archive, Home, Layers, Printer } from 'lucide-react'
import RequestQuoteButton from '../RequestQuoteButton/RequestQuoteButton'
import styles from './Industries.module.css'

const INDUSTRIES = [
  { icon: Briefcase, name: 'Manufacturing' },
  { icon: Package, name: 'Consumer Products' },
  { icon: Truck, name: 'Automotive Suppliers' },
  { icon: Cpu, name: 'Industrial Equipment' },
  { icon: Archive, name: 'Furniture' },
  { icon: Home, name: 'Architecture & Construction' },
  { icon: Layers, name: 'D2C Hardware Startups' },
  { icon: Printer, name: '3D Printing & Prototyping' },
]

function Industries() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Industries</span>
        <h2 className={styles.title}>Built for every industry</h2>
        <p className={styles.sub}>
          Whether you&apos;re prototyping a consumer device or designing factory equipment, we have the specialist for your domain.
        </p>
      </div>
      <div className={styles.grid}>
        {INDUSTRIES.map((industry) => {
          const Icon = industry.icon
          return (
            <div key={industry.name} className={styles.card}>
              <div className={styles.icon}>
                <Icon size={26} strokeWidth={1.8} color="#7C3AED" />
              </div>
              <h4 className={styles.cardTitle}>{industry.name}</h4>
            </div>
          )
        })}
      </div>
      <div className={styles.ctaWrap}>
        <RequestQuoteButton variant="light" />
      </div>
    </section>
  )
}

export default Industries
