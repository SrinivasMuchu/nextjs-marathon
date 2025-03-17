
import React from "react";
import styles from './WhyUs.module.css'
import WhyUsCards from "./WhyUsCards";
import WhyUsWrapper from "./WhyUsWrapper";

function WhyUs() {

    return (
        <WhyUsWrapper styles={styles}>

            <div id="" className={styles["whyus-page-head"]} style={{ margin: '0px' }}>
                <h1 className={styles["whyus-head"]}>Why Marathon-OS?</h1>
                <p className={styles["whyus-desc"]}>Build Product Faster with Accurate Data. Manage CAD, Parts,<br/> Documents,
                    Bill of Materials, Vendors, Inventories & Purchases</p>
            </div>

            <WhyUsCards styles={styles} />
        </WhyUsWrapper>


    )
}

export default WhyUs