import React from "react";
import Input from "../common/Input";
import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  placeholder?: string;
  type?: "text" | "date" | "file";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
