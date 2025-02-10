


import React from 'react'
import styles from './WorkFlow.module.css'
import Image from "next/image";
import { IMAGEURLS } from "@/config";


function WorkFlowMobile({ openDemoForm, setOpenDemoForm }) {

    return ( 
        <div>

            <div id='home' className={styles["workflow-page"]}>
               
                <div className={styles["workflow-head"]}>
                    <span className={styles["workflow-head-title"]}>Simplify Your Workflow with Cloud PLM & PDM</span>
                    <span className={styles["workflow-head-desc"]}>Manage files, Designs, Parts, BOMs, inventory, and purchases effortlessly in one platform.</span>
                </div>
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
                                className={styles["workflow-laptop-img"]}
                                alt="Consumer Electronics"
                                width={90}
                                height={90}
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
                <button onClick={() => setOpenDemoForm(!openDemoForm)}>Request demo</button>
            </div>
          

        </div>


    )
}

export default WorkFlowMobile