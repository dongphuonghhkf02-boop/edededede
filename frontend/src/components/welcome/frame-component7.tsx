import React from "react";
import Navbar1 from "../figma/navbar1";
import styles from "./frame-component7.module.css";

export type FrameComponent7Type = {
  className?: string;
};

const FrameComponent7: React.FC<FrameComponent7Type> = ({ className = "" }) => {
  return (
    <section className={[styles.heroSectionWrapper, className].join(" ")}>
      <div className={styles.heroSection}>
        {/* Декоративный watermark позади текста */}
        <img loading="lazy" decoding="async"
          className={styles.watermarkIcon}
          width={1132}
          height={1132}
          alt=""
          src="/watermark.svg"
        />

        {/* БОЛЬШОЙ ЗАГОЛОВОК — 145px / weight 600 / Commissioner Display
            top = 114 (хедер) + 160 (gap) = 274
            Строки разбиты явно: "Час біорішень" / "Настав" */}
        <h1 className={styles.heroTitle}>
          <span className={styles.heroTitleLine}>Час біорішень</span>
          <span className={styles.heroTitleLine}>Настав</span>
        </h1>

        {/* ПОДЗАГОЛОВОК — 44px / weight 500 / Commissioner H4
            top = 114 (хедер) + 600 (gap) = 714 */}
        <h2 className={styles.heroSubtitle}>
          Майбутнє в новій силі твоєї землі
        </h2>

        {/* Header / Navbar — canonical figma version (shared across all pages) */}
        <Navbar1
          device="Desktop"
          state="Default"
          size="20"
          size1="20"
          size2="24"
        />
      </div>
    </section>
  );
};

export default FrameComponent7;
