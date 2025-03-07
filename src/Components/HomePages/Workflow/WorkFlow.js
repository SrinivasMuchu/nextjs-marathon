
import React from 'react'
import styles from './WorkFlow.module.css'
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import TopNavRequestBtn from '@/Components/CommonJsx/TopNavRequestBtn';
import BoxesConditional from './BoxesConditional';
import WorkFlowImages from './WorkFlowImages';

function WorkFlow() { 

    return (
        <div>

            <div id='home' className={styles["workflow-page"]} style={{ position: 'relative' }}>
               <BoxesConditional/>
                <div className={styles["workflow-head"]}>
                    <span className={styles["workflow-head-title"]}>Simplify Your Workflow with Cloud PLM & PDM</span>
                    <span className={styles["workflow-head-desc"]}>Manage files, Designs, Parts, BOMs, inventory, and purchases effortlessly in one platform.</span>
                </div>
                <WorkFlowImages styles={styles}/>
                <TopNavRequestBtn styles={styles} className={'workflow-page-button'}/>
              
            </div>
          

        </div>


    )
}

export default WorkFlow