import React from 'react'
import styles from './Industry.module.css'
import Image from 'next/image'
import { IMAGEURLS } from '@/config'

function UseOfCAD({ industryData = {} }) {
  // Convert comma-separated strings to arrays
  const rolesWithAccess = industryData.roles_view_cad_files 
    ? industryData.roles_view_cad_files.split(',').map(role => role.trim())
    : [];
  
  const rolesWithoutAccess = industryData.limited_cad_access 
    ? industryData.limited_cad_access.split(',').map(role => role.trim())
    : [];

  return (
    <div className={styles['use-of-cad']}>
      <div className={styles['use-of-cad-top']}>
        <div className={styles['use-of-cad-top-head']}>
          <h2>Who uses CAD files?</h2>
          <div>
            {rolesWithAccess.length > 0 ? (
              rolesWithAccess.map((role, index) => (
                <React.Fragment key={index}>
                  <div className={styles['use-of-cad-top-points']}>
                    <Image src={IMAGEURLS.check} alt='check' width={24} height={24} />
                    <span>{role}</span>
                  </div>
                  {index < rolesWithAccess.length - 1 && (
                    <div className={styles['use-of-cad-bot-line']}></div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className={styles['use-of-cad-top-points']}>
                <Image src={IMAGEURLS.check} alt='check' width={24} height={24} />
                <span>No roles specified</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles['use-of-cad-top-line']}></div>
        
        <div className={styles['use-of-cad-top-head']}>
          <h2>Who should view CAD but often can't?</h2>
          <div className={styles['use-of-cad-top-content']}>
            {rolesWithoutAccess.length > 0 ? (
              rolesWithoutAccess.map((role, index) => (
                <React.Fragment key={index}>
                  <div className={styles['use-of-cad-top-points']}>
                    <Image src={IMAGEURLS.unCheck} alt='unCheck' width={24} height={24} />
                    <span>{role}</span>
                  </div>
                  {index < rolesWithoutAccess.length - 1 && (
                    <div className={styles['use-of-cad-bot-line']}></div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className={styles['use-of-cad-top-points']}>
                <Image src={IMAGEURLS.unCheck} alt='unCheck' width={24} height={24} />
                <span>No roles specified</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles['use-of-cad-bottom']}>
        <h6>Why they can't view CAD files?</h6>
        <p>
          {industryData.cannot_view_cad_files_reason}
        </p>
      </div>
    </div>
  )
}

export default UseOfCAD