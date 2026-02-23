
import React from "react";
import HomeLandingNew from "../HomePages/HomeLandingNew/HomeLandingNew";
import DesignHub from "../HomePages/DesignHub/DesignHub";
import RecentlyAddedDesigns from "../HomePages/RecentlyAddedDesigns/RecentlyAddedDesigns";
import WhyUsNew from "../HomePages/NewWhyUs/WhyUsNew";
import FreeTools from "../HomePages/FreeTools/FreeTools";
import CreatorsContent from "../HomePages/CreatorsContent/CreatorsContent";
import Security from "../HomePages/Security/Security";
import Faq from "../HomePages/Faq/Faq";
import Footer from "../HomePages/Footer/Footer";
import styles from "./HomePage.module.css";

// Page heading structure: 1 h1 (HomeLandingNew), 2 h2s (DesignHub, RecentlyAddedDesigns), rest h3 (WhyUsNew, FreeTools, CreatorsContent, Security, Faq).
const HomePage = () => {
  return (
    <div className={styles.homeRoot}>
      <div className={styles.mainContent}>
        {/* <HomeTopNav /> */}
        {/* <WorkFlow /> */}
        <HomeLandingNew />
        <DesignHub />
        <RecentlyAddedDesigns />
        <WhyUsNew />
        <FreeTools />
        <CreatorsContent />
        {/* <WhyUs />
        <Capabilities /> */}
        
        {/* <SneakPeak /> */}
        {/* <Subscription /> */}
       
        {/* <Tools/>
        <LibraryDetails/> */}
        <Security />
        <Faq />
      </div>
      <Footer />
    </div>
  );
};


export default HomePage;



