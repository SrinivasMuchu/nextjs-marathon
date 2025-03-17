import React from "react";
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import ParallaxWrapper from "./ParallaxWrapper";

const cardData = [
  {
    image: IMAGEURLS.allInOne,
    alt: "All-in-One platform",
    title: "All-in-One platform",
    description:
      "Marathon-OS seamlessly integrates every stage of the hardware product lifecycle. From part design and engineering to manufacturing, supply chain management, and maintenance.",
  },
  {
    image: IMAGEURLS.carManufac,
    alt: "Tailored for hardware companies",
    title: "Tailored for hardware companies",
    description:
      "Marathon-OS provides industry-specific tools, such as BOM management, production scheduling, and CAD data integration, ensuring your operations are optimized for hardware workflows.",
  },
  {
    image: IMAGEURLS.cloud,
    alt: "Cloud-based realtime collaboration",
    title: "Cloud-based realtime collaboration",
    description:
      "With real-time updates, check-in/check-out features, and unlimited cloud storage, Marathon-OS ensures everyone is on the same page, reducing errors and miscommunication.",
  },
  {
    image: IMAGEURLS.customised,
    alt: "Customizable & scalable",
    title: "Customizable & scalable to your needs",
    description:
      "Customize workflows, templates, and processes to fit your specific requirements. As your business grows, Marathon-OS scales with you, offering a seamless, flexible solution.",
  },
];

function WhyUsCards({ styles }) {
  return (
    <div className={styles["whyus-conts"]}>
      {cardData.map((card, index) => (
        <ParallaxWrapper
        key={index}
          styles={styles}
        >
          <div>
            <Image src={card.image} alt={card.alt} width={68} height={68} />
          </div>
          <div className={styles["whyus-cont-text"]}>
            <h6 className={styles["whyus-cont-head"]}>{card.title}</h6>
            <p className={styles["whyus-cont-desc"]}>{card.description}</p>
          </div>
        </ParallaxWrapper>
      ))}
    </div>
  );
}

export default WhyUsCards;
