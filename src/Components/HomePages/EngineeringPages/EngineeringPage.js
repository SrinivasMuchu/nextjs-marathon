"use client";
import { useState } from 'react';
import styles from './EngineeringPage.module.css';

function EngineeringPage({type}) {

    let defaultvalue;
    if(type === 'engineering'){
        defaultvalue = 'Parts'
    }
    if(type === 'supply'){
        defaultvalue = 'supplier'
    }
    if(type === 'manufacturing'){
        defaultvalue = 'pci'
    }
    const [activeTab, setActiveTab] = useState(defaultvalue);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className={styles["engineering-page"]}>
            {type === 'engineering' && <div className={styles["engineering-page-head"]}>
                <span className={styles["engineering-page-head-title"]}>Engineering Management</span>
                <span className={styles["engineering-page-head-desc"]}>
                    Enable real-time teamwork across your engineering teams. Marathon keeps everyone aligned, no matter where they are.
                </span>
            </div>}
            {type === 'supply' && <div className={styles["engineering-page-head"]}>
                <span className={styles["engineering-page-head-title"]}>Supply-chain Management</span>
                <span className={styles["engineering-page-head-desc"]}>
                Optimize your supply chain with Marathon&apos;s end-to-end management tools. From inventory to supplier collaboration, keep your operations running smoothly and efficiently.
                </span>
            </div>}
            {type === 'manufacturing' && <div className={styles["engineering-page-head"]}>
                <span className={styles["engineering-page-head-title"]}>Manufacturing</span>
                <span className={styles["engineering-page-head-desc"]}>
                Enable real-time teamwork across your engineering teams. Marathon keeps everyone aligned, no matter where they are.
                </span>
            </div>}
            
            <div className={styles["engineering-page-bottom"]}>
            {type === 'engineering' &&  <div className={styles["engineering-page-bottom-tabs"]}>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'Parts' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('Parts')}
                    >
                        Parts Creation
                    </span>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'Engg' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('Engg')}
                    >
                        Engg. Change, Deviations & EBOM
                    </span>
                </div>}
                {type === 'supply' &&  <div className={styles["engineering-page-bottom-tabs"]}>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'supplier' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('supplier')}
                    >
                        Supplier Management
                    </span>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'po' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('po')}
                    >
                        Purchase Orders and GRN
                    </span>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'inventry' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('inventry')}
                    >
                        Inventory Management
                    </span>
                </div>}
                {type === 'manufacturing' &&  <div className={styles["engineering-page-bottom-tabs"]}>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'pci' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('pci')}
                    >
                        Production Change & Implementation-MBOM
                    </span>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'production' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('production')}
                    >
                        Production Planning
                    </span>
                    <span
                        className={`${styles["engineering-tab"]} ${activeTab === 'material' ? styles["active-tab"] : ''}`}
                        onClick={() => handleTabClick('material')}
                    >
                        Material Planning
                    </span>
                </div>}
               
                {activeTab === 'Parts' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Effortlessly manage and locate every part </span>
                            <span className={styles["active-tab-data-head-desc"]}>Easily create, organize, and track every component with Marathon’s intuitive parts database. 
                                Find what you need in seconds with advanced search and filtering.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>

                        </div>
                    </div>
                }
                {activeTab === 'Engg' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Effortlessly manage and locate Engg. Change, Deviations & EBOM </span>
                            <span className={styles["active-tab-data-head-desc"]}>Easily create, organize, and track every component with Marathon’s intuitive parts database. 
                                Find what you need in seconds with advanced search and filtering.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>
                    
                        </div>
                    </div>
                }
                {activeTab === 'supplier' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Keep your supplier relationships strong </span>
                            <span className={styles["active-tab-data-head-desc"]}>Marathon centralizes all supplier data, performance metrics, and communication, ensuring smooth collaboration.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>
                    
                        </div>
                    </div>
                }
                {activeTab === 'po' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Effortlessly manage and locate Engg. Change, Deviations & EBOM </span>
                            <span className={styles["active-tab-data-head-desc"]}>Easily create, organize, and track every component with Marathon’s intuitive parts database. 
                                Find what you need in seconds with advanced search and filtering.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>
                    
                        </div>
                    </div>
                }
                {activeTab === 'inventry' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Effortlessly manage and locate Engg. Change, Deviations & EBOM </span>
                            <span className={styles["active-tab-data-head-desc"]}>Easily create, organize, and track every component with Marathon’s intuitive parts database. 
                                Find what you need in seconds with advanced search and filtering.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>
                    
                        </div>
                    </div>
                }
                {activeTab === 'pci' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Effortlessly manage and locate Engg. Change, Deviations & EBOM </span>
                            <span className={styles["active-tab-data-head-desc"]}>Easily create, organize, and track every component with Marathon’s intuitive parts database. 
                                Find what you need in seconds with advanced search and filtering.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>
                    
                        </div>
                    </div>
                }
                {activeTab === 'production' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Effortlessly manage and locate Engg. Change, Deviations & EBOM </span>
                            <span className={styles["active-tab-data-head-desc"]}>Easily create, organize, and track every component with Marathon’s intuitive parts database. 
                                Find what you need in seconds with advanced search and filtering.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>
                    
                        </div>
                    </div>
                }
                {activeTab === 'material' &&
                    <div className={styles["active-tab-data"]}>
                        <div className={styles["active-tab-data-head"]}>
                            <span className={styles["active-tab-data-head-title"]}>Effortlessly manage and locate Engg. Change, Deviations & EBOM </span>
                            <span className={styles["active-tab-data-head-desc"]}>Easily create, organize, and track every component with Marathon’s intuitive parts database. 
                                Find what you need in seconds with advanced search and filtering.</span>
                        </div>
                        <div className={styles["active-tab-data-img"]}>
                    
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default EngineeringPage;
