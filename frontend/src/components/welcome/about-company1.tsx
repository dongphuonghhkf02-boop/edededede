import React from "react";
import ArrowRight1 from "./arrow-right1";
import styles from "./about-company1.module.css";

export type AboutCompany1Type = {
  className?: string;
};

const AboutCompany1: React.FC<AboutCompany1Type> = ({ className = "" }) => {
  return (
    <section
      className={[styles.aboutCompany, className].join(" ")}
      data-testid="about-company-section"
    >
      {/* LEFT — green panel */}
      <div className={styles.leftPanel}>
        {/* Top quote (W 902 × H ~372) at top:163, left:100 */}
        <h1 className={styles.quote}>
          <span className={styles.quoteAccent}>
            «Ціна помилки в агро —{" "}
          </span>
          <span className={styles.quoteWhite}>
            не просто цифри у звіті, це здоров'я землі на роки вперед. Хімія
            дає ілюзію швидкості, часто ціною опіків та виснаження ґрунту.»
          </span>
        </h1>

        {/* Body block — left:323 */}
        <div className={styles.body}>
          {/* "Наша місія…" — Subtitle Small 24px */}
          <p className={styles.missionLine}>
            <span className={styles.accentGreen}>Наша місія</span>
            <span className={styles.cream}> — шлях без компромісів:</span>
          </p>

          {/* Mission detail — Body Large 28px */}
          <p className={styles.missionDetail}>
            <span className={styles.cream}>
              ми інтегруємо мікробіологію в існуючі технології так, щоб ви
              отримали і{" "}
            </span>
            <span className={styles.accentGreen}>рекордний врожай</span>
            <span className={styles.cream}>, і </span>
            <span className={styles.accentGreen}>
              чистий продукт з високою ринковою цінністю.
            </span>
          </p>

          {/* "Біопрепарати сьогодні…" — 60px from missionDetail */}
          <p className={styles.bioInvestment}>
            <span className={styles.accentGreen}>Біопрепарати сьогодні</span>
            <span className={styles.cream}>
              {" "}— найрозумніша інвестиція в землю та{" "}
            </span>
            <span className={styles.accentGreen}>
              життя майбутнього покоління.
            </span>
          </p>

          {/* Founder block — 156px from bioInvestment */}
          <div className={styles.founder}>
            <h2 className={styles.founderName}>Михайло Севастьянов</h2>
            <p className={styles.founderRole}>Засновник &amp; власник</p>
          </div>

          {/* CTA button — 37px from founder role */}
          <button
            type="button"
            className={styles.ctaButton}
            data-testid="about-company-cta"
          >
            <span className={styles.ctaLabel}>Про Таміс Агро</span>
            <ArrowRight1 size={20} />
          </button>
        </div>
      </div>

      {/* RIGHT — leaf image (855 × 1282) */}
      <img decoding="async"
        className={styles.leafImage}
        loading="lazy"
        width={855}
        height={1282}
        alt=""
        src="/close-up-green-leaf-nerves-with-water-drops-2@2x.png"
      />
    </section>
  );
};

export default AboutCompany1;
