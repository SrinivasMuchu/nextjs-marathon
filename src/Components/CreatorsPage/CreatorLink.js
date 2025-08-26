"use client"
import Link from 'next/link';
import React,{useContext} from 'react';
import { FaGlobe } from "react-icons/fa";
import { contextState } from '../CommonJsx/ContextProvider';
import styles from './Creators.module.css'

function CreatorLink() {
    const { user} = useContext(contextState);
    return (
        <div className={styles.creatorLink}>
            <FaGlobe style={{fontSize:'24px',color:'#610bee'}}/>
            <div className={styles.creatorLinkCont}>
                <span>
                    Your profile is visible to public at:
                </span>
                <Link href={`/creator/${user._id}`}>
                    https://marathon-os.com/creator/{user._id}
                </Link> 

            </div>
        </div>
    );
}

export default CreatorLink;