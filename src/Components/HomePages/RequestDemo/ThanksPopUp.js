import React from 'react'

import Image from "next/image";
import { IMAGEURLS } from "@/config";

function ThanksPopUp({ onclose,styles }) {
    return (
        <div className={styles['demo-popup']}>
            <div className={styles['thanks-popup-cont']}>
                <Image
                    // className={styles['thanks-popup-check']}
                    src={IMAGEURLS.points}
                    alt="Thank you!"
                    width={100}
                    height={100}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <span className={styles['thanks-title']}>Thank you!</span>
                    <span className={styles['thanks-desc']}>We have received your query successfully.</span>
                </div>
                <button onClick={() => onclose()}>OK</button>

            </div>
        </div>
    )
}

export default ThanksPopUp