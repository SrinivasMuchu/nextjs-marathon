import React from 'react'
import { LuWallet } from "react-icons/lu";
import { HiOutlineGlobe } from "react-icons/hi";
import { LuShieldCheck } from "react-icons/lu";
import styles from './CreatorsDashboard.module.css'

const publishArray = [
  {
    icon: <LuWallet className="h-5 w-5 text-white" />,
    title: "Monetize Your Creativity",
    description: "Earn when others download your files."
  },
  {
    icon: <HiOutlineGlobe className="h-5 w-5 text-white" />,
    title: "Join a global network",
    description: "Connect with makers, engineers, and companies."
  },
  {
    icon: <LuShieldCheck className="h-5 w-5 text-white" />,
    title: "You own your rights",
    description: "Keep full control over your designs."
  }
];

function PublishItems() {
  return (
    <ul className={styles.publishItemsContainer}>
      {publishArray.map((item, index) => (
        <li key={index} className="flex items-start gap-3" style={{width:'300px'}}>
          <span className="inline-flex rounded-xl bg-white/10 p-2">
            {item.icon}
          </span>
          <div >
            <p style={{textAlign:'left'}} className="text-white font-semibold">{item.title}</p>
            <p style={{textAlign:'left'}} className="text-violet-100 text-sm" >{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PublishItems