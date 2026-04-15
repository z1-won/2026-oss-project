import React from "react";
import Input from "../common/Input";
import styles from "./FileSection.module.css";

interface FileSectionProps {
  onCoverChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInnerChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileSection({
  onCoverChange,
  onInnerChange,
}: FileSectionProps) {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>파일 제출</h2>
      <Input
        label="표지 제출"
        type="file"
        placeholder="파일을 제출하시오. (pdf Only)"
        onChange={onCoverChange}
      />
      <Input
        label="내지 제출"
        type="file"
        placeholder="파일을 제출하시오. (pdf Only)"
        onChange={onInnerChange}
      />
    </div>
  );
}
