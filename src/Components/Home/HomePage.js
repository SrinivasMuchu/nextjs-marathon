"use client";
import React, { useEffect, useRef, useState } from "react";
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
import RequestDemo from "../HomePages/Workflow/RequestDemo";
import ThanksPopUp from "../HomePages/Workflow/ThanksPopUp";

const HomePage = () => {
  const [openDemoForm, setOpenDemoForm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState(null);
  const debounceTimeout = useRef(null);
  const [isLenisEnabled, setIsLenisEnabled] = useState(false); // Default value, will update in useEffect

  // Ensure `window` is available before accessing it
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLenisEnabled(window.innerWidth > 750);

      const handleResize = () => {
        setIsLenisEnabled(window.innerWidth > 750);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Scroll to center the section for large screens only
  const scrollToCenter = (sectionName) => {
    if (!isLenisEnabled) return; // Skip if smooth scrolling is disabled

    const section = sectionRefs.current[sectionName];
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Handle scroll logic for triggering animations and centering
  const handleScroll = () => {
    let newActiveSection = null;

    Object.keys(sectionRefs.current).forEach((sectionName) => {
      const sectionRef = sectionRefs.current[sectionName];
      if (!sectionRef) return;

      const bounding = sectionRef.getBoundingClientRect();
      const isInView =
        bounding.top < window.innerHeight * 0.5 &&
        bounding.bottom > window.innerHeight * 0.5;

      if (isInView) {
        newActiveSection = sectionName;
        sectionRef.classList.add(styles.inView);
      } else {
        sectionRef.classList.remove(styles.inView);
      }
    });

    if (newActiveSection && newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);
      scrollToCenter(newActiveSection);
    }
  };

  // Debounced scroll handler
  const debouncedHandleScroll = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleScroll();
    }, 10);
  };

  // Lenis for smooth scrolling (only if enabled)
  useLenis(
    (lenis) => {
      if (isLenisEnabled) {
        lenis.on("scroll", () => {
          requestAnimationFrame(debouncedHandleScroll);
        });
      }
    },
    [isLenisEnabled] // Re-run when screen size changes
  );

  useEffect(() => {
    handleScroll();
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  // Sections data
  const sections = [
    { name: "whyUs", component: <WhyUs /> },
    { name: "capabilities", component: <Capabilities /> },
    { name: "sneakPeak", component: <SneakPeak /> },
    { name: "subscription", component: <Subscription /> },
    {
      name: "security",
      component: <Security openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess}/>,
    },
    { name: "footer", component: <Footer setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess}/> },
  ];

  return (
    <>
      <div className={styles["desktop-view"]}>
        {isLenisEnabled ? (
          <Lenis root>
            <div>
              <HomeTopNav openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess}/>
              <WorkFlow openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess}/>
              {sections.map((section) => (
                <div
                  key={section.name}
                  ref={(el) => (sectionRefs.current[section.name] = el)}
                  className={`${styles.scrollSection} ${activeSection === section.name ? styles.active : ""
                    }`}
                  style={{ background: "white" }}
                >
                  {section.component}
                </div>
              ))}
            </div>
          </Lenis>
        ) : (
          <div>
            <HomeTopNav openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess}/>
            <WorkFlow openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess}/>
            {sections.map((section) => (
              <div
                key={section.name}
                ref={(el) => (sectionRefs.current[section.name] = el)}
                className={styles.scrollSection}
                style={{ background: "white" }}
              >
                {section.component}
              </div>
            ))}
          </div>
        )}
      </div>

      {openDemoForm && <RequestDemo onclose={() => setOpenDemoForm(!openDemoForm)} setOpenSuccess={setOpenSuccess}/>}
      {openSuccess && <ThanksPopUp onclose={() => setOpenSuccess(!openSuccess)} />}
    </>
  );
};

export default HomePage;
