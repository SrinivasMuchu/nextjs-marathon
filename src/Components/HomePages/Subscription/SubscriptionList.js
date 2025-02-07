import React from 'react';
import styles from './Subscription.module.css';
import Image from "next/image";
import { IMAGEURLS } from "@/config";




const SUBSCRIPTIONLIST =[
    {
      title:'Unlimited File Storage',
      description:'Store and manage all your designs, documents, and BOMs securely.'
    },{
      title:'Cloud-Based Realtime Collaboration',
      description:'Collaborate seamlessly with your team, anytime, anywhere.'
    },{
      title:'CAD Data Management',
      description:'Check-in/check-out, revision control.'
    },{
      title:'BOM & Part Management',
      description:'Advanced Muti level BOM management.'
    },{
      title:'Change Management (ECO)',
      description:'Implement and track engineering changes effortlessly.'
    },{
      title:'Inventory & Purchase Management',
      description:'Stay on top of inventory levels and purchase orders.'
    },{
      title:'Production Scheduling',
      description:'Plan and monitor production workflows in real-time'
    },
  ]
function SubscriptionList() {
    return (
        <>
            {SUBSCRIPTIONLIST.map((item, index) => (
                <div key={index}>
                    <div className={styles['subscription-page-list-details']}>
                        <div className={styles['subscription-page-list-details-left']}>
                            <Image
                                src={IMAGEURLS.check}
                                alt={item.title}
                                width={24}
                                height={24}
                            />
                            <span >{item.title}</span>
                        </div>
                        <span className={styles['subscription-page-list-details-right']}>{item.description}</span>
                    </div>
                    
                    {/* Add a line divider */}
                    {index < SUBSCRIPTIONLIST.length - 1 && (
                        <div className={styles['subscription-page-line']}></div>
                    )}
                </div>
            ))}
        </>
    );
}

export default SubscriptionList;
