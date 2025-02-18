
import React from "react";
import styles from './WhyUs.module.css'
import WhyUsCards from "./WhyUsCards";
import WhyUsWrapper from "./WhyUsWrapper";

function WhyUs() {

    return (
        <WhyUsWrapper styles={styles}>

            <div id="" className={styles["whyus-page-head"]} style={{ margin: '0px' }}>
                <span className={styles["whyus-head"]}>Why Marathon-OS?</span>
                <span className={styles["whyus-desc"]}>Build Product Faster with Accurate Data. Manage CAD, Parts,<br/> Documents,
                    Bill of Materials, Vendors, Inventories & Purchases</span>
            </div>

            <WhyUsCards styles={styles} />
        </WhyUsWrapper>


    )
}

export default WhyUs