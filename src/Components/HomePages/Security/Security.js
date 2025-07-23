
import React from "react";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import styles from "./Security.module.css";
import TopNavRequestBtn from "@/Components/CommonJsx/TopNavRequestBtn";
import SecurityWrapper from "./SecurityWrapper";


function Security() {

  return (

    <SecurityWrapper styles={styles}>

      <div className={styles["security-container-div"]}></div>
      <div className={styles["security-content"]}>
        <h2 className={styles["security-head"]}>Designed for Security</h2>
        <p className={styles["security-desc"]}>
          Capturing everything you see, say, and hear means trust and privacy
          is more important than anything else.
        </p>
        <div className={styles["security-btn"]}>
          <TopNavRequestBtn />
          {/* <button onClick={()=>setOpenDemoForm(!openDemoForm)}>Request a demo</button> */}
        </div>
      </div>
      <div className={styles["security-points"]}>
        <div className={styles["security-points-1"]}>
          <div className={styles["security-internal-points"]}>
            {/* Use Next.js Image component for optimized image loading */}
            <Image
              src={IMAGEURLS.points} // Ensure the correct path is set
              alt="points"
              width={40} // Adjust the width and height as necessary
              height={40}
            />
            <p className={styles["security-desc-points"]}>Encryption at rest</p>
          </div>
          <div className={styles["security-internal-points"]}>
            <Image
              src={IMAGEURLS.points}
              alt="points"
              width={40}
              height={40}
            />
            <p className={styles["security-desc-points"]}>Encryption in transit</p>
          </div>
          <div className={styles["security-internal-points"]}>
            <Image
              src={IMAGEURLS.points}
              alt="points"
              width={40}
              height={40}
            />
            <p className={styles["security-desc-points"]}>Single-sign on</p>
          </div>
          {/* <div className={styles["security-internal-points"]}>
                <Image
                  src={IMAGEURLS.points}
                  alt="Multi-factor Authentication"
                  width={40}
                  height={40}
                />
                <span className={styles["security-desc-points"]}>Multi-factor Authentication</span>
              </div> */}
        </div>
        <div className={styles["security-points-1"]}>
          <div className={styles["security-internal-points"]}>
            <Image
              src={IMAGEURLS.points}
              alt="points"
              width={40}
              height={40}
            />
            <p className={styles["security-desc-points"]}>Role-based access controls</p>
          </div>
          <div className={styles["security-internal-points"]}>
            <Image
              src={IMAGEURLS.points}
              alt="points"
              width={40}
              height={40}
            />
            <p className={styles["security-desc-points"]}>Logging, auditing and monitoring features</p>
          </div>
          <div className={styles["security-internal-points"]}>
            <Image
              src={IMAGEURLS.points}
              alt="points"
              width={40}
              height={40}
            />
            <p className={styles["security-desc-points"]}>Features to enhance privacy of personal data</p>
          </div>
        </div>
      </div>
    </SecurityWrapper>
         


   
     
  

  );
}

export default Security;
