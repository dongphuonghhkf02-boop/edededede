import React from "react";
import FeatureBlock1 from "./feature-block1";
import styles from "./mission-section1.module.css";

export type MissionSection1Type = {
  className?: string;
};

const MissionSection1: React.FC<MissionSection1Type> = ({ className = "" }) => {
  return (
    <div className={[styles.missionSection, className].join(" ")}>
      {/* Фоновое изображение дерева в поле */}
      <img loading="lazy" decoding="async"
        className={styles.imageIcon}
        alt=""
        src="/image2@2x.webp"
      />

      {/* Градиент-оверлей сверху */}
      <div className={styles.overlay} />

      {/* +20 РОКІВ — Golos Text SemiBold 120px, dark green */}
      <h2 className={styles.years}>+20 років</h2>

      {/* МИ СТВОРЮЄМО КОМПЛЕКСНІ — line 1, right of +20 РОКІВ */}
      <h2 className={styles.headingLine1}>ми створюємо комплексні</h2>

      {/* БІОЛОГІЧНІ РІШЕННЯ ДЛЯ УКРАЇНСЬКИХ ПОЛІВ — line 2, full width */}
      <h2 className={styles.headingLine2}>
        біологічні рішення для&nbsp;&nbsp;українських полів.
      </h2>

      {/* Левый параграф — Golos Text Regular 28px */}
      <p className={styles.paragraphLeft}>
        «Таміс Агро» м'яко інтегрує мікробіологію у ваші звичні технології
        вирощування.
        <br /><br />
        Ми допомагаємо отримувати стабільно високі врожаї, зберігаючи природну
        родючість ґрунту та екологічну рівновагу.
      </p>

      {/* Правый параграф */}
      <p className={styles.paragraphRight}>
        Урожай, вирощений із застосуванням мікробіологічних продуктів, безпечний
        для людей, тварин і корисний для довкілля.
      </p>

      {/*
        Tag — «Суворий температурний контроль кожної партії препаратів».
        Геометрия Figma: left 486, top 1047, width 406, height 138.
        Текст редактируемый — передаётся пропсом `label`.
      */}
      <div className={styles.featureBlockWrapper}>
        <FeatureBlock1 label="Суворий температурний контроль кожної партії препаратів" />
      </div>
    </div>
  );
};

export default MissionSection1;
