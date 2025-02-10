import React from 'react'
import styles from './Popup.module.css'
import Image from "next/image";
import { IMAGEURLS } from "@/config";

function ThanksPopUp({ onclose }) {
    return (
        <div className={styles['demo-popup']}>
            <div className={styles['thanks-popup-cont']}>
                <Image
                    className={styles['thanks-popup-check']}
                    src={IMAGEURLS.points}
                    alt="Thank you!"
                    width={40}
                    height={40} style={{width:'100px',height:'100px'}}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <span className={styles['thanks-title']} style={{fontSize:'24px',color:'black'}}>Thank you!</span>
                    <span className={styles['thanks-desc']} style={{fontSize:'18px',color:'black'}}>We have received your query successfully.</span>
                </div>
                <button onClick={() => onclose()}>OK</button>

            </div>
        </div>
    )
}

export default ThanksPopUp