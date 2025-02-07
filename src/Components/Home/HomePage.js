"use client";
import React, { useState, Suspense,lazy } from "react";


import HomeTopNav from "../HomePages/HomepageTopNav/HomeTopNav";
import WorkFlow from "../HomePages/Workflow/WorkFlow";
const WhyUs = lazy(() => import("../HomePages/WhyUs/WhyUs"));
const Capabilities = lazy(() => import("../HomePages/Capabilities/Capabilities"));
const SneakPeak = lazy(() => import("../HomePages/SneakPeak/SneakPeak"));
const Subscription = lazy(() => import("../HomePages/Subscription/Subscription"));
const Security = lazy(() => import("../HomePages/Security/Security"));
const Footer = lazy(() => import("../HomePages/Footer/Footer"));
// import styles from "./Home.module.css";
import RequestDemo from "../HomePages/Workflow/RequestDemo";
import ThanksPopUp from "../HomePages/Workflow/ThanksPopUp";

const HomePage = () => {
  const [openDemoForm, setOpenDemoForm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  return (
    <>
      {/* <div className={styles["desktop-view"]}> */}
      <div>
        <HomeTopNav
          openDemoForm={openDemoForm}
          setOpenDemoForm={setOpenDemoForm}
          setOpenSuccess={setOpenSuccess}
        />
        <WorkFlow
          openDemoForm={openDemoForm}
          setOpenDemoForm={setOpenDemoForm}
          setOpenSuccess={setOpenSuccess}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <WhyUs />
          <Capabilities />
          <SneakPeak />
          <Subscription />
          <Security openDemoForm={openDemoForm} setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess} />
          <Footer setOpenDemoForm={setOpenDemoForm} setOpenSuccess={setOpenSuccess} />
        </Suspense>
      </div>
      {/* </div> */}
      {openDemoForm && <RequestDemo onclose={() => setOpenDemoForm(!openDemoForm)} setOpenSuccess={setOpenSuccess} />}
      {openSuccess && <ThanksPopUp onclose={() => setOpenSuccess(!openSuccess)} />}
    </>
  );
};


export default HomePage;



