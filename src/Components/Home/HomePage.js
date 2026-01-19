
import React from "react";
import HomeTopNav from "../HomePages/HomepageTopNav/HomeTopNav";
import WorkFlow from "../HomePages/Workflow/WorkFlow";
import WhyUs from "../HomePages/WhyUs/WhyUs";
import Capabilities from "../HomePages/Capabilities/Capabilities";
import SneakPeak from "../HomePages/SneakPeak/SneakPeak";
import Subscription from "../HomePages/Subscription/Subscription";
import Security from "../HomePages/Security/Security";
import Footer from "../HomePages/Footer/Footer";
import Tools from "../HomePages/Tools/Tools";
import LibraryDetails from "../HomePages/LibraryTools/LibraryDetails";
import DesignHub from "../HomePages/DesignHub/DesignHub";
import RecentlyAddedDesigns from "../HomePages/RecentlyAddedDesigns/RecentlyAddedDesigns";
import CreatorsContent from "../HomePages/CreatorsContent/CreatorsContent";
import WhyUsNew from "../HomePages/NewWhyUs/WhyUsNew";
import FreeTools from "../HomePages/FreeTools/FreeTools";
import HomeLandingNew from "../HomePages/HomeLandingNew/HomeLandingNew";
import Faq from "../HomePages/Faq/Faq";
const HomePage = () => {
  

  return (
    <div>
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
      <Footer />
    </div >
  );
};


export default HomePage;



