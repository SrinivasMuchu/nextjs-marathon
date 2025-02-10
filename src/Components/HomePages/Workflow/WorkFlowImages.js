import React from 'react'

import Image from "next/image";
import { IMAGEURLS } from "@/config";

function WorkFlowImages({styles}) {
  return (
    <div className={styles["workflow-imgs"]}>
    <div className={styles["workflow-img-outer"]}>
        <div className={styles["workflow-img"]}>

           <Image
                src={IMAGEURLS.carLogo}
                alt="Automotive"
                width={100}
                height={100}
                layout="responsive"
            />
            <span>Automotive</span>
        </div>
    </div>

    <div className={styles["workflow-img-outer"]}>
        <div className={styles["workflow-img"]}>

           <Image
                src={IMAGEURLS.latopLogo}
                alt="Consumer Electronics"
                width={180}
                height={180}
                layout="responsive"
            />
            <span>Consumer</span>
        </div>
    </div>


    <div className={styles["workflow-img-outer"]}>
        <div className={styles["workflow-img"]}>

           <Image
                src={IMAGEURLS.droneLogo}
                alt="Aerospace"
                width={160}
                height={100}
                layout="responsive"
            />
            <span>Aerospace</span>
        </div>
    </div>


    <div className={styles["workflow-img-outer"]}>
        <div className={styles["workflow-img"]}>

           <Image
                src={IMAGEURLS.robotLogo}
                alt="Medical Equipments"
                width={160}
                height={140}
                layout="responsive"
            />
            <span>Medical</span>
        </div>
    </div>


    <div className={styles["workflow-img-outer"]}>
        <div className={styles["workflow-img"]}>

           <Image
                src={IMAGEURLS.craneLogo}
                alt="Machinery"
                width={152}
                height={180}
                className={styles["workflow-crane-img"]}
                layout="responsive"
            />
            <span>Machinery</span>
        </div>
    </div>
</div>
  )
}

export default WorkFlowImages