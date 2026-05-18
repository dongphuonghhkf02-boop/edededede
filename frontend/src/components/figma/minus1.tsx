import React from "react";
import { type CSSProperties } from "react";
import styles from "./minus1.module.css";

export type Minus1Type = {
  className?: string;

  /** Variant props */
  size?: any;
};

const Minus1: React.FC<Minus1Type> = ({ className = "", size = 20 }) => {
  return (
    <div className={[styles.iconMinus, className].join(" ")} data-size={size}>
      <img loading="lazy" decoding="async"
        className={styles.vectorIcon}
        width={7.5}
        height={2}
        alt=""
        src="/Vector10.svg"
      />
    </div>
  );
};

export default Minus1;
