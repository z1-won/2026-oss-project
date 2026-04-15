import React from "react";
import styles from "./Input.module.css";

type InputType = "text" | "date" | "file";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  label?: string;
  placeholder?: string;
}

export default function Input({
  type = "text",
  label,
  placeholder,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={[
          styles.input,
          type === "file" ? styles.file : "",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
}
