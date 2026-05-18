import React from "react";
import Lightning1 from "./lightning1";
import EcoProtection1 from "./eco-protection1";
import Drop1 from "./drop1";
import styles from "./image2.module.css";

export type Image2Type = {
  className?: string;
};

const Image2: React.FC<Image2Type> = ({ className = "" }) => {
  return (
    <div className={[styles.image, className].join(" ")}>
      <div className={styles.imageParent}>
        <img loading="lazy" decoding="async"
          className={styles.imageIcon}
          width={1376}
          height={601}
          alt="Дерево — відновлення після стресу"
          src="/tree.webp"
        />
        <div className={styles.overlay} />
      </div>

      {/* === 3 фичеблока (HTML+CSS, не PNG) — точные градиенты из Figma === */}

      {/* 1) Швидке відновлення — олив-зелёный градиент, белый текст/иконка молнии */}
      <div className={`${styles.chip} ${styles.chip1}`}>
        <div className={styles.chipIcon}>
          <Lightning1 size={36} />
        </div>
        <div className={styles.chipText}>
          <div className={styles.chipTitle}>Швидке відновлення</div>
          <div className={styles.chipBody}>
            Відновлення життєдіяльності рослин після стресу протягом короткого терміну
          </div>
        </div>
      </div>

      {/* 2) Ідеальний pH-баланс води — тёмно-серо-зелёный, белый текст/иконка drop+рука */}
      <div className={`${styles.chip} ${styles.chip2}`}>
        <div className={styles.chipIcon}>
          <EcoProtection1 size={36} />
        </div>
        <div className={styles.chipText}>
          <div className={styles.chipTitle}>Ідеальний pH-баланс води</div>
          <div className={styles.chipBody}>
            Захищає дорогі пестициди від швидкого руйнування у жорсткій воді,
            покращуючи їх сумісність із рослиною.
          </div>
        </div>
      </div>

      {/* 3) Покращення поглинання — кремово-белый, чёрный текст/иконка капли */}
      <div className={`${styles.chip} ${styles.chip3}`}>
        <div className={styles.chipIcon}>
          <Drop1 size={36} dropHeight="36px" dropWidth="36px" />
        </div>
        <div className={styles.chipText}>
          <div className={styles.chipTitle}>Покращення поглинання</div>
          <div className={styles.chipBody}>
            Впливає на рівномірне покриття листя та засвоєння активних речовин
          </div>
        </div>
      </div>
    </div>
  );
};

export default Image2;
