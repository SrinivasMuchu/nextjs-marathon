"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from './OrgFaq.module.css';
import { IMAGEURLS } from "@/config";
function OrgFaq() {
    const array = [
        {
            question: "What is Marathon OS Chart Builder?",
            answer: "Marathon OS Chart Builder is a simple, secure, and scalable tool that helps you create, manage, and share organizational charts effortlessly—no training required.",
        },
        {
            question: "Can I import and export data in Excel?",
            answer: "Yes! You can easily import employee and department details from Excel and export your org chart in the same format for seamless integration.",
        },
        {
            question: "Is Marathon OS Chart Builder free to use?",
            answer: "Yes! Our free plan supports up to 50 members and 20 departments, making it ideal for small teams and growing businesses.",
        },
        {
            question: "How is my data stored and secured?",
            answer: "Your data is securely stored for 24 hours before automatic deletion, ensuring privacy and security without long-term storage concerns.",
        },
        {
            question: "Do I need any training to use the tool?",
            answer: "No training is required! Marathon OS Chart Builder is designed with a zero-learning curve—just enter your data, generate your org chart, and export it in minutes.",
        },
        {
            question: "Can I create charts with departments as separate entities?",
            answer: "Yes! Our tool allows you to structure both employees and departments clearly for better visualization and organizational planning.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className={styles.faqpage}>
            <div className={styles["faqpage-left-container"]}>
                <span className={styles["faq-title"]}>FAQ</span>
                <span className={styles["faqpage-visit"]}>
                    Find answers to common questions about Marathon OS Chart Builder. Whether you're getting started or looking for advanced features, we've got you covered.

                </span>
                
            </div>
            <div className={styles["faqpage-right-container"]}>
                {array.map((item, index) => (
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