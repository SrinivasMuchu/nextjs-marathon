"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from './OrgFaq.module.css';
import { IMAGEURLS } from "@/config";


function OrgFaq({faqQuestions,description}) {
    

    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className={styles.faqpage}>
            <div className={styles["faqpage-left-container"]}>
                <span className={styles["faq-title"]}>FAQ</span>
                <span className={styles["faqpage-visit"]}>
                    {description}
                    

                </span>
                
            </div>
            <div className={styles["faqpage-right-container"]}>
                {faqQuestions.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles["faqpage-questions"]} ${openIndex === index ? styles.open : ""
                            }`}
                    >
                        {/* Use Next.js Image component with appropriate height and width */}
                        <Image src={IMAGEURLS.openAnswer} alt="Open Answer Icon" width={20} height={20} onClick={() => handleToggle(index)}
                            className={styles["faqpage-icon"]} />

                        <div className={styles["faq-ques-ans"]}>
                            <span className={styles["faq-answer"]}>{item.question}</span>
                            {openIndex === index && (
                                <span className={styles["faq-answer"]} style={{ color: "#8d8c8c" }}>
                                    {item.answer}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrgFaq;