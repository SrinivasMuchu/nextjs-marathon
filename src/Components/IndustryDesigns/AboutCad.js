import React from 'react'
import styles from './IndustryDesign.module.css'
import { textLettersLimit } from '@/common.helper'

function AboutCad({ cadReport }) {
  if (!cadReport) {
    return (
      <div className={styles['industry-design-about-cad']}>
        <h2>About CAD</h2>
        <p>No CAD report data available</p>
      </div>
    )
  }

  const sections = [
    {
      title: '📁 File Information',
      rows: [
        ['File Name', textLettersLimit(cadReport.file_info.file_name,15)  ],
        ['File Type', cadReport.file_info.file_type],
        ['Units', cadReport.file_info.units],
        
      ]
    },
    {
      title: '🔍 Geometry',
      rows: [
        ['Faces', cadReport.geometry.faces],
        ['Edges', cadReport.geometry.edges],
        ['Vertices', cadReport.geometry.vertices],
        ['Solids', cadReport.geometry.solids]
      ]
    },
    {
      title: '🧱 Surfaces',
      rows: [
        ['Planar', cadReport.surfaces.planar],
        ['Cylindrical', cadReport.surfaces.cylindrical],
        ['Conical', cadReport.surfaces.conical],
        ['Spherical', cadReport.surfaces.spherical],
        ['Toroidal', cadReport.surfaces.toroidal],
        ['Other', cadReport.surfaces.other]
      ]
    },
    {
      title: '🧱 Surface Orientations',
      rows: [
        ['X Axis', cadReport.surfaces.orientations.x_axis],
        ['Y Axis', cadReport.surfaces.orientations.y_axis],
        ['Z Axis', cadReport.surfaces.orientations.z_axis],
        ['Other', cadReport.surfaces.orientations.other]
      ]
    },
    {
      title: '📏 Bounding Box',
      rows: [
        ['Width', `${cadReport.bounding_box.width.toFixed(2)} mm`],
        ['Height', `${cadReport.bounding_box.height.toFixed(2)} mm`],
        ['Depth', `${cadReport.bounding_box.depth.toFixed(2)} mm`]
      ]
    },
    {
      title: '🧮 Volumes',
      rows: [
        ['Max Volume', `${cadReport.volumes.max.toFixed(2)} mm³`],
        ['Min Volume', `${cadReport.volumes.min.toFixed(2)} mm³`],
        ['Average Volume', `${cadReport.volumes.average.toFixed(2)} mm³`],
        ['Total Volume', `${cadReport.volumes.total.toFixed(2)} mm³`]
      ]
    }
  ]

  return (
    <div className={styles['industry-design-about-cad']}>
      <div className={styles['industry-design-about-cad-intro']}>
        <h2>About CAD</h2>
        <p>
          Computer-Aided Design (CAD) is a technology used for creating precision drawings or
          technical illustrations in 2D and 3D. This report provides detailed technical
          specifications about the CAD model.
        </p>
      </div>
      <div className={styles['industry-design-about-cad-details']}>
        {sections.map((section, i) => (
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