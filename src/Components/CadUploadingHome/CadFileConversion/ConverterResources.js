import React from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, BookOpen, Layers, Headphones, FileText } from 'lucide-react'
import { CONVERTER_HUB_PAGE } from '@/data/converterHubPage'
import styles from './ConverterResources.module.css'

const RESOURCE_ICONS = [Eye, BookOpen, Layers, FileText, Headphones]

function ConverterResources() {
  return (
    <section className={styles.section} aria-labelledby="converter-resources-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="converter-resources-heading" className={styles.heading}>
            {CONVERTER_HUB_PAGE.resourcesHeading}
          </h2>
          <p className={styles.intro}>{CONVERTER_HUB_PAGE.resourcesIntro}</p>
        </header>

        <div className={styles.grid} data-nosnippet>
          {CONVERTER_HUB_PAGE.resources.map((resource, index) => {
            const Icon = RESOURCE_ICONS[index] || Eye
            return (
              <Link key={resource.href} href={resource.href} className={styles.card}>
                <span className={styles.iconBox} aria-hidden>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <div className={styles.cardBody}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <strong>{resource.cta}</strong>
                </div>
                <span className={styles.arrow} aria-hidden>
                  <ArrowRight size={15} strokeWidth={2.2} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ConverterResources
