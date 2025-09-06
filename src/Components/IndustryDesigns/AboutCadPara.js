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
  const makeBold = (value) => `<strong>${value}</strong>`

  // Helper to conditionally render a label/value pair if value is present and not zero
  const showIf = (value, label, suffix = '', prefix = '') =>
    value && value !== 0 ? `${prefix}${makeBold(value)}${suffix} ${label}` : ''

  // Helper for comma-separated lists, skipping empty
  const joinNonEmpty = (arr) => arr.filter(Boolean).join(', ')

  // Generate the appropriate text based on available data
  const generateText = () => {
    // Check what data we have
    const hasSurfaces = hasSurfaceData()
    const hasOrientations = hasOrientationData()
    const hasVolumes = hasVolumeData()
    const hasBoundingBox = hasBoundingBoxData()

    // Geometry
    const geometryParts = [
      showIf(faces, 'faces'),
      showIf(edges, 'edges'),
      showIf(vertices, 'vertices'),
    ]
    const geometryText = joinNonEmpty(geometryParts)
    const solidsText = showIf(solids, 'solids')

    // Surface types
    const surfaceParts = [
      showIf(planarSurfaces, 'planar'),
      showIf(cylindricalSurfaces, 'cylindrical'),
      showIf(conicalSurfaces, 'conical'),
      showIf(sphericalSurfaces, 'spherical'),
      showIf(toroidalSurfaces, 'toroidal'),
      showIf(otherSurfaces, 'other surfaces'),
    ]
    const surfaceText = joinNonEmpty(surfaceParts)

    // Orientations
    const orientationParts = [
      showIf(xAxisOrientations, 'along the X-axis'),
      showIf(yAxisOrientations, 'along the Y-axis'),
      showIf(zAxisOrientations, 'along the Z-axis'),
      showIf(otherOrientations, 'with various orientations'),
    ]
    const orientationText = joinNonEmpty(orientationParts)

    // Bounding box
    const boundingParts = [
      width && width !== 0 ? `${makeBold(width.toFixed(2))} mm wide` : '',
      height && height !== 0 ? `${makeBold(height.toFixed(2))} mm high` : '',
      depth && depth !== 0 ? `${makeBold(depth.toFixed(2))} mm deep` : '',
    ]
    const boundingText = joinNonEmpty(boundingParts)

    // Volumes
    const volumeParts = [
      maxVolume && maxVolume !== 0 ? `maximum volume of ${makeBold(maxVolume.toFixed(2))} mm³` : '',
      minVolume && minVolume !== 0 ? `minimum volume of ${makeBold(minVolume.toFixed(2))} mm³` : '',
      avgVolume && avgVolume !== 0 ? `average volume of ${makeBold(avgVolume.toFixed(2))} mm³` : '',
      totalVolume && totalVolume !== 0 ? `total volume of ${makeBold(totalVolume.toFixed(2))} mm³` : '',
    ]
    const volumeText = joinNonEmpty(volumeParts)

    // Template 1: Complete Data Available
    if (hasSurfaces && hasOrientations && hasVolumes && hasBoundingBox) {
      return [
        geometryText && `The CAD model comprises ${geometryText}`,
        solidsText && `, ${solidsText}`,
        surfaceText && `. Surface types include ${surfaceText}`,
        orientationText && `. Orientations: ${orientationText}`,
        boundingText && `. Model dimensions: ${boundingText}`,
        volumeText && `. Volumetric data: ${volumeText}`,
      ].filter(Boolean).join('')
    }

    // Template 2: Missing Surface Details
    if (!hasSurfaces && hasOrientations && hasVolumes && hasBoundingBox) {
      return [
        geometryText && `The CAD model comprises ${geometryText}`,
        solidsText && ` distributed among ${solidsText} bodies.`,
        ` Specific surface details are currently unavailable.`,
        orientationText && ` Orientation-wise: ${orientationText}.`,
        boundingText && ` Dimensions: ${boundingText}.`,
        volumeText && ` Volumes: ${volumeText}.`,
      ].filter(Boolean).join('')
    }

    // Template 3: Missing Orientation Data
    if (hasSurfaces && !hasOrientations && hasVolumes && hasBoundingBox) {
      return [
        geometryText && `The CAD model comprises ${geometryText}`,
        solidsText && `, forming ${solidsText} components.`,
        surfaceText && ` Surface classifications: ${surfaceText}.`,
        ` Orientation details are unavailable.`,
        boundingText && ` Dimensions: ${boundingText}.`,
        volumeText && ` Volume characteristics: ${volumeText}.`,
      ].filter(Boolean).join('')
    }

    // Template 4: Minimal Data (Generalized Template)
    return [
      geometryText && `The CAD model comprises ${geometryText}`,
      solidsText && ` distributed over ${solidsText}.`,
      !hasSurfaces && !hasOrientations ? '' : '',
      boundingText && ` Model measures: ${boundingText}.`,
      volumeText && ` Volumes: ${volumeText}.`,
    ].filter(Boolean).join('')
  }

  return (
    // <div className={styles['industry-design-about-cad']} style={{textAlign: 'left'}}>
      <p   dangerouslySetInnerHTML={{ __html: generateText() }}></p>
    // </div>
  )
}

export default AboutCadPara