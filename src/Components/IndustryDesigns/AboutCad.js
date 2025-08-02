import React from 'react'
import styles from './IndustryDesign.module.css'
import { textLettersLimit } from '@/common.helper'
import AboutCadPara from './AboutCadPara'

function AboutCad({ cadReport,filetype }) {
 
  if (!cadReport) {
    return (
      <div className={styles['industry-design-about-cad']}>
        <h2>About CAD</h2>
        <p>No CAD report data available</p>
      </div>
    )
  }

  const safeGet = (obj, path, defaultVal = '') => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultVal), obj)
  }

  const sections = [
    {
      title: '📁 File Information',
      rows: [
        ['File Name', textLettersLimit(safeGet(cadReport, ['file_info', 'file_name']), 15)],
        ['File Type', filetype?filetype:'.step'],
        ['Units', safeGet(cadReport, ['file_info', 'units'])]
      ]
    },
    {
      title: '🔍 Geometry',
      rows: [
        ['Faces', safeGet(cadReport, ['geometry', 'faces'])],
        ['Edges', safeGet(cadReport, ['geometry', 'edges'])],
        ['Vertices', safeGet(cadReport, ['geometry', 'vertices'])],
        ['Solids', safeGet(cadReport, ['geometry', 'solids'])]
      ]
    },
    {
      title: '🧱 Surfaces',
      rows: [
        ['Planar', safeGet(cadReport, ['surfaces', 'planar'])],
        ['Cylindrical', safeGet(cadReport, ['surfaces', 'cylindrical'])],
        ['Conical', safeGet(cadReport, ['surfaces', 'conical'])],
        ['Spherical', safeGet(cadReport, ['surfaces', 'spherical'])],
        ['Toroidal', safeGet(cadReport, ['surfaces', 'toroidal'])],
        ['Other', safeGet(cadReport, ['surfaces', 'other'])]
      ]
    },
    {
      title: '🧱 Surface Orientations',
      rows: [
        ['X Axis', safeGet(cadReport, ['surfaces', 'orientations', 'x_axis'])],
        ['Y Axis', safeGet(cadReport, ['surfaces', 'orientations', 'y_axis'])],
        ['Z Axis', safeGet(cadReport, ['surfaces', 'orientations', 'z_axis'])],
        ['Other', safeGet(cadReport, ['surfaces', 'orientations', 'other'])]
      ]
    },
    {
      title: '📏 Bounding Box',
      rows: [
        ['Width', cadReport.bounding_box?.width != null ? `${cadReport.bounding_box.width.toFixed(2)} mm` : ''],
        ['Height', cadReport.bounding_box?.height != null ? `${cadReport.bounding_box.height.toFixed(2)} mm` : ''],
        ['Depth', cadReport.bounding_box?.depth != null ? `${cadReport.bounding_box.depth.toFixed(2)} mm` : '']
      ]
    },
    {
      title: '🧮 Volumes',
      rows: [
        ['Max Volume', cadReport.volumes?.max != null ? `${cadReport.volumes.max.toFixed(2)} mm³` : ''],
        ['Min Volume', cadReport.volumes?.min != null ? `${cadReport.volumes.min.toFixed(2)} mm³` : ''],
        ['Average Volume', cadReport.volumes?.average != null ? `${cadReport.volumes.average.toFixed(2)} mm³` : ''],
        ['Total Volume', cadReport.volumes?.total != null ? `${cadReport.volumes.total.toFixed(2)} mm³` : '']
      ]
    }
  ]

  // Filter sections where at least one value exists
  const filteredSections = sections
    .map(section => ({
      ...section,
      rows: section.rows.filter(([, value]) => value !== '' && value !== null && value !== undefined)
    }))
    .filter(section => section.rows.length > 0)

  // Check if only File Information section exists, and if so, don't render the component
  if (filteredSections.length === 1 && filteredSections[0].title === '📁 File Information') {
    return null
  }

  // If no sections have data, don't render the component
  if (filteredSections.length === 0) {
    return null
  }

  return (
    <div className={styles['industry-design-about-cad']}>
      <div className={styles['industry-design-about-cad-intro']}>
        <h2>About CAD</h2>
        <AboutCadPara cadReport={cadReport}/>
      </div>
      <div className={styles['industry-design-about-cad-details']}>
        {filteredSections.map((section, i) => (
          <div key={i} className={styles['industry-design-about-cad-sub-content']}>
            <h3 className={styles['industry-design-about-cad-sub-head']}>{section.title}</h3>
            {section.rows.map(([key, value], j) => (
              <div key={j} className={styles['industry-design-about-cad-sub-details']}>
                <span className={styles['industry-design-about-cad-key']}>{key}</span>
                <span className={styles['industry-design-about-cad-value']}>{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AboutCad
