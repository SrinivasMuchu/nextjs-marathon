
import React from "react";
import HomeTopNav from "../HomePages/HomepageTopNav/HomeTopNav";
import WorkFlow from "../HomePages/Workflow/WorkFlow";
import WhyUs from "../HomePages/WhyUs/WhyUs";
import Capabilities from "../HomePages/Capabilities/Capabilities";
import SneakPeak from "../HomePages/SneakPeak/SneakPeak";
import Subscription from "../HomePages/Subscription/Subscription";
import Security from "../HomePages/Security/Security";
import Footer from "../HomePages/Footer/Footer";
import styles from "./Home.module.css";


const HomePage = () => {





  return (


    <div>

      <HomeTopNav />

      <WorkFlow />

      <WhyUs />
      <Capabilities />
      <SneakPeak />
      <Subscription />
      <Security />
      <Footer />

    </div >


  );
};


export default HomePage;



