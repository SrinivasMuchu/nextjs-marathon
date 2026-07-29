"use client";

import React from "react";
import { FUNNEL_STEPS, funnelStepIndex } from "@/lib/converterMeshSettings";
import styles from "./ConverterFunnel.module.css";

function ConverterFunnelStepper({ currentStep = "upload" }) {
  const active = funnelStepIndex(currentStep);

  return (
    <ol className={styles.stepper} aria-label="Conversion steps">
      {FUNNEL_STEPS.map((step, index) => {
        const done = index < active;
        const current = index === active;
        return (
          <li
            key={step.id}
            className={`${styles.stepperItem} ${done ? styles.stepperDone : ""} ${
              current ? styles.stepperCurrent : ""
            }`}
          >
            <span className={styles.stepperDot} aria-hidden>
              {index + 1}
            </span>
            <span className={styles.stepperLabel}>{step.label}</span>
            {index < FUNNEL_STEPS.length - 1 ? (
              <span className={styles.stepperLine} aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export default ConverterFunnelStepper;
