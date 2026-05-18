import React from "react";
import { type CSSProperties } from "react";
import styles from "./plus1.module.css";

export type Plus1Type = {
  className?: string;

  /** Variant props */
  size?: any;
};

const Plus1: React.FC<Plus1Type> = ({ className = "", size = 20 }) => {
  return (
    <div className={[styles.iconPlus, className].join(" ")} data-size={size}>
      <img loading="lazy" decoding="async"
        className={styles.vectorIcon}
        width={7.5}
        height={7.5}
        alt=""
        src="/Vector11.svg"
      />
    </div>
  );
};

export default Plus1;
