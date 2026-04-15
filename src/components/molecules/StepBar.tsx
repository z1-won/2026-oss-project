import React from "react";
import styles from "./StepBar.module.css";

const STEPS = ["01 본인 인증", "02 증빙 자료 제출", "03 최종 확인하기"];

interface StepBarProps {
  currentStep: number; // 1, 2, 3
}

export default function StepBar({ currentStep }: StepBarProps) {
  return (
    <div className={styles.container}>
      {STEPS.map((step, index) => (
        <div
          key={step}
          className={[
            styles.step,
            currentStep === index + 1 ? styles.active : styles.inactive,
          ].join(" ")}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
