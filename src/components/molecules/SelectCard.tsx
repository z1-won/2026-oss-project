import React from "react";
import styles from "./SelectCard.module.css";

interface SelectCardProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function SelectCard({
  label,
  selected = false,
  onClick,
}: SelectCardProps) {
  return (
    <div
      className={[styles.card, selected ? styles.selected : ""].join(" ")}
      onClick={onClick}
    >
      <span className={styles.label}>{label}</span>
    </div>
  );
}
