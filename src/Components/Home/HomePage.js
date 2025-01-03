"use client";
import React, { useEffect, useRef,useState } from "react";
import { Lenis, useLenis } from "@studio-freight/react-lenis";
import HomeTopNav from "../HomePages/HomepageTopNav/HomeTopNav";
import WorkFlow from "../HomePages/Workflow/WorkFlow";
import WhyUs from "../HomePages/WhyUs/WhyUs";
import Capabilities from "../HomePages/Capabilities/Capabilities";
import SneakPeak from "../HomePages/SneakPeak/SneakPeak";
import Subscription from "../HomePages/Subscription/Subscription";
import Security from "../HomePages/Security/Security";
import Footer from "../HomePages/Footer/Footer";
import styles from "./Home.module.css";
import WorkFlowGrids from "../HomePages/Workflow/WorkFlowGrids";
import RequestDemo from "../HomePages/Workflow/RequestDemo";

const HomePage = () => {
   const [openDemoForm, setOpenDemoForm] = useState(false)
  const sectionRefs = useRef({});

  // Optimized scroll listener
  const handleScroll = () => {
    Object.keys(sectionRefs.current).forEach((sectionName) => {
      const sectionRef = sectionRefs.current[sectionName];
      if (!sectionRef) return;

      const bounding = sectionRef.getBoundingClientRect();
      if (bounding.top < window.innerHeight * 0.8 && bounding.bottom > 0) {
        sectionRef.classList.add(styles.inView); // Apply animation
      } else {
        sectionRef.classList.remove(styles.inView); // Remove animation
      }
    });
  };

  useLenis((lenis) => {
    lenis.on("scroll", () => {
      requestAnimationFrame(handleScroll); // Use requestAnimationFrame for smooth updates
    });
  });

  // Trigger handleScroll on initial render
  useEffect(() => {
    handleScroll();
  }, []);

  const sections = [
    { name: "whyUs", component: <WhyUs /> },
    { name: "capabilities", component: <Capabilities /> },
    { name: "sneakPeak", component: <SneakPeak /> },
    { name: "subscription", component: <Subscription /> },
    { name: "security", component: <Security openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm}/> },
    { name: "footer", component: <Footer /> },
  ];

  return (
    <>
     <Lenis root>
      <div>
        <HomeTopNav openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm}/>
        <WorkFlow openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm}/>
        <WorkFlowGrids/>
        {/* <Security /> */}
        {sections.map((section) => (
          <div
            key={section.name}
            ref={(el) => (sectionRefs.current[section.name] = el)}
            className={`${styles.scrollSection}`}
            style={{ background: "white" }}
          >
            {section.component}
          </div>
        ))}
      </div>
    </Lenis>
    {openDemoForm && <RequestDemo onclose={()=>setOpenDemoForm(!openDemoForm)}/>}
    </>
   
  );
};

export default HomePage;
