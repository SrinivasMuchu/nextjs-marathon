import React from 'react'
import styles from './IndustryDesign.module.css'

function AboutCadPara({cadReport}) {
  if (!cadReport) {
    return (
      <div className={styles['industry-design-about-cad']}>
        <p style={{ fontSize: '20px' }}>No CAD report data available for this model.</p>
      </div>
    )
  }

  const safeGet = (obj, path, defaultVal = null) => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultVal), obj)
  }

  // Extract all the data we need
  const faces = safeGet(cadReport, ['geometry', 'faces'])
  const edges = safeGet(cadReport, ['geometry', 'edges'])
  const vertices = safeGet(cadReport, ['geometry', 'vertices'])
  const solids = safeGet(cadReport, ['geometry', 'solids'])

  // Surface data
  const planarSurfaces = safeGet(cadReport, ['surfaces', 'planar'])
  const cylindricalSurfaces = safeGet(cadReport, ['surfaces', 'cylindrical'])
  const conicalSurfaces = safeGet(cadReport, ['surfaces', 'conical'])
  const sphericalSurfaces = safeGet(cadReport, ['surfaces', 'spherical'])
  const toroidalSurfaces = safeGet(cadReport, ['surfaces', 'toroidal'])
  const otherSurfaces = safeGet(cadReport, ['surfaces', 'other'])

  // Orientation data
  const xAxisOrientations = safeGet(cadReport, ['surfaces', 'orientations', 'x_axis'])
  const yAxisOrientations = safeGet(cadReport, ['surfaces', 'orientations', 'y_axis'])
  const zAxisOrientations = safeGet(cadReport, ['surfaces', 'orientations', 'z_axis'])
  const otherOrientations = safeGet(cadReport, ['surfaces', 'orientations', 'other'])

  // Bounding box data
  const width = cadReport.bounding_box?.width
  const height = cadReport.bounding_box?.height
  const depth = cadReport.bounding_box?.depth

  // Volume data
  const maxVolume = cadReport.volumes?.max
  const minVolume = cadReport.volumes?.min
  const avgVolume = cadReport.volumes?.average
  const totalVolume = cadReport.volumes?.total

  // Helper function to check if surface data is available
  const hasSurfaceData = () => {
    return planarSurfaces !== null || cylindricalSurfaces !== null || 
           conicalSurfaces !== null || sphericalSurfaces !== null || 
           toroidalSurfaces !== null || otherSurfaces !== null
  }

  // Helper function to check if orientation data is available
  const hasOrientationData = () => {
    return xAxisOrientations !== null || yAxisOrientations !== null || 
           zAxisOrientations !== null || otherOrientations !== null
  }

  // Helper function to check if volume data is available
  const hasVolumeData = () => {
    return maxVolume !== null || minVolume !== null || 
           avgVolume !== null || totalVolume !== null
  }

  // Helper function to check if bounding box data is available
  const hasBoundingBoxData = () => {
    return width !== null || height !== null || depth !== null
  }

  // Helper function to make values bold
  const makeBold = (value) => {
    return `<strong>${value}</strong>`
  }

  // Generate the appropriate text based on available data
  const generateText = () => {
    // Check what data we have
    const hasSurfaces = hasSurfaceData()
    const hasOrientations = hasOrientationData()
    const hasVolumes = hasVolumeData()
    const hasBoundingBox = hasBoundingBoxData()

    // Template 1: Complete Data Available
    if (hasSurfaces && hasOrientations && hasVolumes && hasBoundingBox) {
      return `The CAD model comprises ${makeBold(faces || 0)} faces, ${makeBold(edges || 0)} edges, and ${makeBold(vertices || 0)} vertices. It consists of ${makeBold(solids || 0)} solids, with surface types including ${makeBold(planarSurfaces || 0)} planar, ${makeBold(cylindricalSurfaces || 0)} cylindrical, ${makeBold(conicalSurfaces || 0)} conical, ${makeBold(sphericalSurfaces || 0)} spherical, ${makeBold(toroidalSurfaces || 0)} toroidal, and ${makeBold(otherSurfaces || 0)} other surfaces. Its orientations include ${makeBold(xAxisOrientations || 0)} along the X-axis, ${makeBold(yAxisOrientations || 0)} along the Y-axis, ${makeBold(zAxisOrientations || 0)} along the Z-axis, and ${makeBold(otherOrientations || 0)} with various orientations. The model dimensions are approximately ${makeBold(width?.toFixed(2) || 0)} mm wide, ${makeBold(height?.toFixed(2) || 0)} mm high, and ${makeBold(depth?.toFixed(2) || 0)} mm deep. Volumetric data includes a maximum volume of ${makeBold(maxVolume?.toFixed(2) || 0)} mm³, minimum volume of ${makeBold(minVolume?.toFixed(2) || 0)} mm³, and average volume of ${makeBold(avgVolume?.toFixed(2) || 0)} mm³, with a total volume of ${makeBold(totalVolume?.toFixed(2) || 0)} mm³.`
    }

    // Template 2: Missing Surface Details
    if (!hasSurfaces && hasOrientations && hasVolumes && hasBoundingBox) {
      return `The CAD model comprises ${makeBold(faces || 0)} faces, ${makeBold(edges || 0)} edges, and ${makeBold(vertices || 0)} vertices distributed among ${makeBold(solids || 0)} solid bodies. Specific surface details are currently unavailable. Orientation-wise, it includes ${makeBold(xAxisOrientations || 0)} X-axis, ${makeBold(yAxisOrientations || 0)} Y-axis, and ${makeBold(zAxisOrientations || 0)} Z-axis orientations. Its approximate dimensions are ${makeBold(width?.toFixed(2) || 0)} mm wide, ${makeBold(height?.toFixed(2) || 0)} mm high, and ${makeBold(depth?.toFixed(2) || 0)} mm deep. Volumes range from ${makeBold(maxVolume?.toFixed(2) || 0)} mm³ (maximum) to ${makeBold(minVolume?.toFixed(2) || 0)} mm³ (minimum), averaging ${makeBold(avgVolume?.toFixed(2) || 0)} mm³ for a cumulative total of ${makeBold(totalVolume?.toFixed(2) || 0)} mm³.`
    }

    // Template 3: Missing Orientation Data
    if (hasSurfaces && !hasOrientations && hasVolumes && hasBoundingBox) {
      return `The CAD model comprises ${makeBold(faces || 0)} faces, ${makeBold(edges || 0)} edges, and ${makeBold(vertices || 0)} vertices, forming ${makeBold(solids || 0)} solid components. Surface classifications include ${makeBold(planarSurfaces || 0)} planar, ${makeBold(cylindricalSurfaces || 0)} cylindrical, ${makeBold(conicalSurfaces || 0)} conical, ${makeBold(sphericalSurfaces || 0)} spherical, ${makeBold(toroidalSurfaces || 0)} toroidal, and ${makeBold(otherSurfaces || 0)} other surfaces. Orientation details are unavailable. Dimensions measure approximately ${makeBold(width?.toFixed(2) || 0)} mm wide, ${makeBold(height?.toFixed(2) || 0)} mm high, and ${makeBold(depth?.toFixed(2) || 0)} mm deep. The volume characteristics include a maximum of ${makeBold(maxVolume?.toFixed(2) || 0)} mm³, minimum of ${makeBold(minVolume?.toFixed(2) || 0)} mm³, and average volume of ${makeBold(avgVolume?.toFixed(2) || 0)} mm³, totaling ${makeBold(totalVolume?.toFixed(2) || 0)} mm³.`
    }

    // Template 4: Minimal Data (Generalized Template)
    return `The CAD model comprises ${makeBold(faces || 0)} faces, ${makeBold(edges || 0)} edges, and ${makeBold(vertices || 0)} vertices distributed over ${makeBold(solids || 0)} solids. ${!hasSurfaces && !hasOrientations ? 'Additional surface and orientation data are currently unavailable. ' : ''}${hasBoundingBox ? `The model measures approximately ${makeBold(width?.toFixed(2) || 0)} mm in width, ${makeBold(height?.toFixed(2) || 0)} mm in height, and ${makeBold(depth?.toFixed(2) || 0)} mm in depth. ` : ''}${hasVolumes ? `Volumes span from ${makeBold(maxVolume?.toFixed(2) || 0)} mm³ (maximum) to ${makeBold(minVolume?.toFixed(2) || 0)} mm³ (minimum), averaging ${makeBold(avgVolume?.toFixed(2) || 0)} mm³, with a total volume of ${makeBold(totalVolume?.toFixed(2) || 0)} mm³.` : ''}`
  }

  return (
    // <div className={styles['industry-design-about-cad']} style={{textAlign: 'left'}}>
      <p  dangerouslySetInnerHTML={{ __html: generateText() }}></p>
    // </div>
  )
}

export default AboutCadPara