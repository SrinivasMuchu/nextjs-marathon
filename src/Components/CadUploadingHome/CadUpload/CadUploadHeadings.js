"use client"
import React from 'react'
import cadStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import { getCadViewerFormatConfig, getViewerHeroCopy } from '@/data/cadFormatViewerPages'

function CadUploadHeadings({ variant, cadType }) {
    const config = getCadViewerFormatConfig(cadType)
    const h1 = config?.h1 || 'Free Online CAD File Viewer'
    const heroCopy = getViewerHeroCopy(cadType) || ''
    const isDark = variant === 'dark'

    return (
        <div className={isDark ? heroStyles.heroDynamicBlock : cadStyles['cad-landing-left-content']}>
            <h1 className={isDark ? heroStyles.title : cadStyles['cad-landing-heading']}>
              {h1}
            </h1>
            {heroCopy ? (
              <p className={isDark ? heroStyles.description : cadStyles['cad-landing-description']}>
                {heroCopy}
              </p>
            ) : null}
        </div>
    )
}

export default CadUploadHeadings
