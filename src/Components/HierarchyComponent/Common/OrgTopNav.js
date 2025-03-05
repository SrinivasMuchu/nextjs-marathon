import React from 'react'
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import MenuButton from '@/Components/CommonJsx.js/MenuButton';
import styles from '../../HomePages/HomepageTopNav/HomeTopNav.module.css';

function OrgTopNav({ orgStyles, handleDownloadExcel }) {
    return (
        <>

            <div className={styles['home-page-top']}>
                <Image src={IMAGEURLS.logo} alt="Marathon Logo" width={500}
                    height={500} className={styles['home-page-top-logo']} />

                <div className={styles['home-pg-btns']}>
                    {/* buttons */}
                    <button className={orgStyles["btn-collab"]} onClick={handleDownloadExcel} >
                        Export
                    </button>
                    <button className={orgStyles["btn-collab"]} style={{ right: '150px' }} onClick={() => document.getElementById("fileupld").click()} >
                        Import
                    </button>

                </div>

                <div className={styles['home-pg-menu']}  >
                <button className={orgStyles["btn-collab"]} onClick={handleDownloadExcel} >
                        Export
                    </button>
                    <button className={orgStyles["btn-collab"]} style={{ right: '150px' }} onClick={() => document.getElementById("fileupld").click()} >
                        Import
                    </button>
                </div>


            </div>



        </>
    );
}

export default OrgTopNav