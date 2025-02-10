"use client"
import React, { useState } from 'react'

function SubscriptionSwitch({styles}) {
    const [isOn, setIsOn] = useState(false);

    const toggleSwitch = () => {
        setIsOn((prevState) => !prevState);
    };
    return (
        <div className={styles['subscription-page-payment']}>
            <div className={styles['subscription-page-switch']}>
                <span>Monthly</span>
                <div className={styles.switchContainer} onClick={toggleSwitch}>
                    <div className={`${styles.switch} ${isOn ? styles.switchOn : styles.switchOff}`}>
                        <div className={styles.switchCircle}></div>
                    </div>

                </div>
                <span>Yearly</span>
            </div>
            <div className={styles['subscription-page-cost']}>
                <span>{isOn ? "₹15000 per user" : "₹1500 per user"}</span>
            </div>
        </div>
    )
}

export default SubscriptionSwitch