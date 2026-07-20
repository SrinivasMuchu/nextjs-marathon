import React from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, BookOpen, Layers, Headphones, Box, AppWindow } from 'lucide-react'
import styles from './ConverterResources.module.css'

const RESOURCES = [
  {
    label: 'Open CAD Viewer',
    description: 'Inspect geometry, scale and orientation before or after conversion.',
    href: '/tools/3d-cad-viewer',
    icon: Eye,
  },
  {
    label: 'Browse CAD models',
    description: 'Explore downloadable engineering models across multiple categories.',
    href: '/library',
    icon: BookOpen,
  },
  {
    label: 'Browse 2D drawings',
    description: 'Find technical drawings for components, assemblies and manufacturing.',
    href: '/library/2d-technical-drawings',
    icon: Layers,
  },
  {
    label: 'Get CAD design support',
    description: 'Work with vetted designers on production-ready engineering files.',
    href: '/cad-services',
    icon: Headphones,
  },
  {
    label: 'Explore 3D printing files',
    description: 'Find ready-to-use models for prototyping and additive manufacturing.',
    href: '/library/tag/3d-printing',
    icon: Box,
  },
  {
    label: 'View all engineering tools',
    description: 'Access viewers, drawing pipelines and related browser-based utilities.',
    href: '/tools',
    icon: AppWindow,
  },
]

function ConverterResources() {
  return (
    <section className={styles.section} aria-labelledby="converter-resources-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Continue your CAD workflow</p>
          <h2 id="converter-resources-heading" className={styles.heading}>
            Explore Marathon OS CAD resources
          </h2>
          <p className={styles.intro}>
            Preview a model, find an existing file, open a technical drawing, or get expert support
            when conversion is not enough.
          </p>
        </header>

        <div className={styles.grid}>
          {RESOURCES.map((resource) => {
            const Icon = resource.icon
            return (
              <Link key={resource.href} href={resource.href} className={styles.card}>
                <span className={styles.iconBox} aria-hidden>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <div className={styles.cardBody}>
                  <h3>{resource.label}</h3>
                  <p>{resource.description}</p>
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
