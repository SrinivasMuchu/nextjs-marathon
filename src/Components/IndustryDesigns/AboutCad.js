import React from 'react'
import styles from './IndustryDesign.module.css'
import { textLettersLimit } from '@/common.helper'
import AboutCadPara from './AboutCadPara'
import {
  RiFileTextLine,
  RiBox3Line,
  RiCircleLine,
  RiCompass3Line,
  RiRuler2Line,
  RiStackLine
} from 'react-icons/ri'

function AboutCad({ cadReport, filetype }) {
  if (!cadReport) {
    return (
      <div className={styles['industry-design-about-cad']}>
        <h2>About CAD</h2>
        <p>No CAD report data available</p>
      </div>
    )
  }

  const safeGet = (obj, path, defaultVal = '') =>
    path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultVal), obj)

  const formatNum = (v) => (v != null && v !== '' ? (Number(v).toLocaleString ? Number(v).toLocaleString() : String(v)) : '')
  const formatMm = (v) => (v != null && v !== '' ? `${Number(v).toFixed(2)} mm` : '')
  const formatMm3 = (v) => (v != null && v !== '' ? `${Number(v).toFixed(2)} mm³` : '')

  const sections = [
    {
      title: 'File Information',
      icon: RiFileTextLine,
      rows: [
        ['File Name', textLettersLimit(safeGet(cadReport, ['file_info', 'file_name']), 25)],
        ['File Type', filetype ? filetype.toUpperCase().replace(/^\./, '') : 'STEP'],
        ['Units', safeGet(cadReport, ['file_info', 'units']) || 'mm']
      ]
    },
    {
      title: 'Geometry',
      icon: RiBox3Line,
      rows: [
        ['Faces', formatNum(safeGet(cadReport, ['geometry', 'faces']))],
        ['Edges', formatNum(safeGet(cadReport, ['geometry', 'edges']))],
        ['Vertices', formatNum(safeGet(cadReport, ['geometry', 'vertices']))],
        ['Solids', formatNum(safeGet(cadReport, ['geometry', 'solids']))]
      ]
    },
    {
      title: 'Surfaces',
      icon: RiCircleLine,
      rows: [
        ['Planar', formatNum(safeGet(cadReport, ['surfaces', 'planar']))],
        ['Cylindrical', formatNum(safeGet(cadReport, ['surfaces', 'cylindrical']))],
        ['Conical', formatNum(safeGet(cadReport, ['surfaces', 'conical']))],
        ['Spherical', formatNum(safeGet(cadReport, ['surfaces', 'spherical']))],
        ['Toroidal', formatNum(safeGet(cadReport, ['surfaces', 'toroidal']))],
        ['Other', formatNum(safeGet(cadReport, ['surfaces', 'other']))]
      ]
    },
    {
      title: 'Surface Orientations',
      icon: RiCompass3Line,
      rows: [
        ['X Axis', formatNum(safeGet(cadReport, ['surfaces', 'orientations', 'x_axis']))],
        ['Y Axis', formatNum(safeGet(cadReport, ['surfaces', 'orientations', 'y_axis']))],
        ['Z Axis', formatNum(safeGet(cadReport, ['surfaces', 'orientations', 'z_axis']))],
        ['Other', formatNum(safeGet(cadReport, ['surfaces', 'orientations', 'other']))]
      ]
    },
    {
      title: 'Bounding Box',
      icon: RiRuler2Line,
      rows: [
        ['Width', formatMm(cadReport.bounding_box?.width)],
        ['Height', formatMm(cadReport.bounding_box?.height)],
        ['Depth', formatMm(cadReport.bounding_box?.depth)]
      ]
    },
    {
      title: 'Volumes',
      icon: RiStackLine,
      rows: [
        ['Max Volume', formatMm3(cadReport.volumes?.max)],
        ['Min Volume', formatMm3(cadReport.volumes?.min)],
        ['Average Volume', formatMm3(cadReport.volumes?.average)],
        ['Total Volume', formatMm3(cadReport.volumes?.total)]
      ]
    }
  ]

  const filteredSections = sections
    .map(section => ({
      ...section,
      rows: section.rows.filter(([, value]) => value !== '' && value !== null && value !== undefined)
    }))
    .filter(section => section.rows.length > 0)

  if (filteredSections.length === 0) return null

  return (
    <div className={styles['industry-design-about-cad']}>
      <div className={styles['industry-design-about-cad-intro']}>
        <h2>About CAD</h2>
        <AboutCadPara cadReport={cadReport} />
      </div>

      <div className={styles['industry-design-about-cad-cards']}>
        {filteredSections.map((section, i) => {
          const Icon = section.icon
          return (
            <div key={i} className={styles['industry-design-about-cad-card']}>
              <div className={styles['industry-design-about-cad-card-head']}>
                <span className={styles['industry-design-about-cad-card-icon']}>
                  <Icon />
                </span>
                <span className={styles['industry-design-about-cad-card-title']}>{section.title}</span>
              </div>
              <div className={styles['industry-design-about-cad-card-body']}>
                {section.rows.map(([key, value], j) => (
                  <div key={j} className={styles['industry-design-about-cad-card-row']}>
                    <span className={styles['industry-design-about-cad-key']}>{key}</span>
                    <span className={styles['industry-design-about-cad-value']}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AboutCad
