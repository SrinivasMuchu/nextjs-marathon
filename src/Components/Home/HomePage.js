
import React from "react";
import HomeLandingNew from "../HomePages/HomeLandingNew/HomeLandingNew";
import ConversionTypes from "../HomePages/ConversionTypes/ConversionTypes";
import ConversionExpertise from "../HomePages/ConversionExpertise/ConversionExpertise";
import ConverterDirectory from "../HomePages/ConverterDirectory/ConverterDirectory";
import FormatExpertise from "../HomePages/FormatExpertise/FormatExpertise";
import ConversionPricing from "../HomePages/ConversionPricing/ConversionPricing";
import ConversionWorkflow from "../HomePages/ConversionWorkflow/ConversionWorkflow";
import ConversionPrivacy from "../HomePages/ConversionPrivacy/ConversionPrivacy";
import CadProductsShowcase from "../HomePages/CadProductsShowcase/CadProductsShowcase";
import CadDrawingsShowcase from "../HomePages/CadDrawingsShowcase/CadDrawingsShowcase";
import ConversionDesignerCta from "../HomePages/ConversionDesignerCta/ConversionDesignerCta";
import ConversionFinalCta from "../HomePages/ConversionFinalCta/ConversionFinalCta";
import RecentlyAddedDesigns from "../HomePages/RecentlyAddedDesigns/RecentlyAddedDesigns";
import WhyUsNew from "../HomePages/NewWhyUs/WhyUsNew";
import FreeTools from "../HomePages/FreeTools/FreeTools";
import CreatorsContent from "../HomePages/CreatorsContent/CreatorsContent";
import Security from "../HomePages/Security/Security";
import Faq from "../HomePages/Faq/Faq";
import Footer from "../HomePages/Footer/Footer";
import styles from "./HomePage.module.css";
import CadOutsourcingBanner from "../CadServicesBanners/CadOutsourcingBanner";

// Page heading structure: 1 h1 (HomeLandingNew), 2 h2s (DesignHub, RecentlyAddedDesigns), rest h3 (WhyUsNew, FreeTools, CreatorsContent, Security, Faq).
const HomePage = () => {
  return (
      <div className={styles.homeRoot}>
        <div className={styles.mainContent}>
          {/* <HomeTopNav /> */}
          {/* <WorkFlow /> */}
          <HomeLandingNew />
          <ConversionTypes />
          <ConversionExpertise />
          <ConverterDirectory />
          <FormatExpertise />
          <ConversionPricing />
          <ConversionWorkflow />
          <ConversionPrivacy />
          {/* <CadOutsourcingBanner /> */}
          <CadProductsShowcase />
          <CadDrawingsShowcase />
          <ConversionDesignerCta />
          <ConversionFinalCta />
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



