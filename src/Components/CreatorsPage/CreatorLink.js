"use client"
import Link from 'next/link';
import React,{useContext} from 'react';
import { FaGlobe } from "react-icons/fa";
import { contextState } from '../CommonJsx/ContextProvider';
import styles from './Creators.module.css'

function CreatorLink() {
    const { user } = useContext(contextState);

    return (
        <div className={styles.creatorLink}>
            <FaGlobe className={styles.icon}/>
            <div className={styles.creatorLinkCont}>
                <span className={styles.label}>
                    Your profile is visible to public at:
                </span>
                {user?.name ? (
                    <Link href={`/creator/${user.username}`} className={styles.link}>
                        www.marathon-os.com/creator/{user.username}
                    </Link>
                ) : (
                    <span className={styles.warning}>
                        To view your public URL, please update your full name.
                    </span>
                )}
            </div>
        </div>
    );
}

export default CreatorLink;
