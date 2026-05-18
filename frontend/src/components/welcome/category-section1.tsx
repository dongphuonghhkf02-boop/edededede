import React from "react";
import CategoryCard from "./category-card";
import styles from "./category-section1.module.css";

export type CategorySection1Type = {
  className?: string;
};

/**
 * Данные категорий. Размеры иконок зафиксированы согласно дизайну Figma.
 * Иконка всегда вписывается ВНУТРЬ круга (140×140).
 */
const CATEGORIES: Array<{
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  title: string;
  description: string;
}> = [
  {
    iconSrc: "/@2x.webp",
    iconWidth: 138,
    iconHeight: 106,
    title: "Біоінсектициди",
    description:
      "Знищують шкідників без хімічного навантаження на ґрунт. Безпечні для бджіл та корисних комах.",
  },
  {
    iconSrc: "/5@2x.webp",
    iconWidth: 125,
    iconHeight: 126,
    title: "Мікро/Макроелементи",
    description:
      "Усувають приховані дефіцити, що гальмують урожайність. Швидке засвоєння через хелатну форму.",
  },
  {
    iconSrc: "/9@2x.webp",
    iconWidth: 102,
    iconHeight: 119,
    title: "Інокулянти",
    description:
      "Фіксують атмосферний азот - менше витрат на мінеральні добрива.",
  },
  {
    iconSrc: "/sunflower.png",
    iconWidth: 112,
    iconHeight: 87,
    title: "Допоміжні речовини",
    description:
      "Підсилюють дію основних препаратів - покращують змочування, прилипання та проникнення діючих речовин.",
  },
  {
    iconSrc: "/20@2x.webp",
    iconWidth: 105,
    iconHeight: 125,
    title: "Родентициди",
    description:
      "Захищають посіви та зерносховища від гризунів з високою ефективністю.",
  },
  {
    iconSrc: "/22@2x.webp",
    iconWidth: 99,
    iconHeight: 93,
    title: "Органічні добрива",
    description:
      "Відновлюють гумусний шар та мікробіом ґрунту для стабільної врожайності.",
  },
];

const CategorySection1: React.FC<CategorySection1Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.categorySection, className].join(" ")}>
      <div className={styles.parent}>
        <div className={styles.div}>
          <div className={styles.titleLine}>
            <span className={styles.span}>Біотехнології</span>
            <span className={styles.span2}>{` `}</span>
            <span className={styles.span3}>захисту</span>
          </div>
          <div className={styles.titleLine}>
            <span className={styles.span3}>та живлення</span>
          </div>
        </div>
        <div className={styles.wrapper}>
          <h3 className={styles.h3}>
            Інноваційні препарати для кожного етапу вегетації. Безпечно для
            ґрунту, безжально до шкідників.
          </h3>
        </div>
      </div>

      <div className={styles.frameParent}>
        <div className={styles.categoryColumnOneParent}>
          {CATEGORIES.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>

        <div className={styles.categoryAction}>
          {/*
            Primary Button «Переглянути каталог».
            Figma spec:
              • W Fixed 540px  /  H Hug 60px
              • Padding 18 (top/bottom) · 16 (left/right)
              • Layout: Horizontal, text + arrow → centered together
              • Text: Golos Text Medium 16px #FFFFFF
              • Background: #1B4332 (brand-accent-secondary-default)
              • Border-radius: 6
          */}
          <button
            type="button"
            className={styles.catalogButton}
            data-testid="catalog-cta-button"
          >
            <span className={styles.catalogButtonLabel}>Переглянути каталог</span>
            <span className={styles.catalogButtonArrow} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection1;
