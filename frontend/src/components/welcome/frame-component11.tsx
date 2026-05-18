import React, { useMemo, useState } from "react";
import CardItem1 from "./card-item1";
import PrimaryButton1 from "./primary-button1";
import { useCart } from "../../context/CartContext";
import styles from "./frame-component11.module.css";

export type FrameComponent11Type = {
  className?: string;
};

/* ----------------------------- Catalog --------------------------------- */
type Product = {
  id: string;
  photo: string;
  name: string;
  desc: string;
  showTag2: boolean;
  price: number;
  volume: string;
};

const PRODUCTS: Product[] = [
  { id: "ksaladan",       photo: "/Photo@2x.webp",  name: "Ксаладан",       desc: "макро та мікро елементи для обробки зернобобових та технічних культур",       showTag2: true,  price: 420, volume: "5 Л" },
  { id: "venator",        photo: "/Photo1@2x.webp", name: "Венатор",        desc: "макро та мікро елементи для обробки зернобобових та технічних культур",       showTag2: true,  price: 540, volume: "5 Л" },
  { id: "plantonit-fruit",photo: "/Photo2@2x.webp", name: "Plantonit Fruit",desc: "макро та мікроелементи для плодових культур, концентрат",                    showTag2: false, price: 480, volume: "5 Л" },
  { id: "avangard",       photo: "/Photo@2x.webp",  name: "Авангард",       desc: "комплексне мікродобриво для зернових та олійних культур",                     showTag2: true,  price: 460, volume: "5 Л" },
  { id: "helatyn-bor",    photo: "/Photo1@2x.webp", name: "Хелатин Бор",    desc: "хелатне мікродобриво з підвищеним вмістом бору для соняшнику",                showTag2: true,  price: 510, volume: "5 Л" },
  { id: "plantonit-soil", photo: "/Photo2@2x.webp", name: "Plantonit Soil", desc: "збалансоване добриво для відновлення родючості ґрунту",                       showTag2: false, price: 490, volume: "5 Л" },
  { id: "megafol",        photo: "/Photo@2x.webp",  name: "Мегафол",        desc: "біостимулятор з амінокислотами для овочевих і ягідних культур",               showTag2: true,  price: 560, volume: "5 Л" },
  { id: "radifarm",       photo: "/Photo1@2x.webp", name: "Радіфарм",       desc: "стимулятор кореневої системи для розсади та саджанців",                       showTag2: false, price: 530, volume: "5 Л" },
  { id: "plantonit-vita", photo: "/Photo2@2x.webp", name: "Plantonit Vita", desc: "комплекс мікроелементів для підвищення стійкості до стресу",                  showTag2: false, price: 470, volume: "5 Л" },
];

const CARDS_PER_PAGE = 3;
const CARD_WIDTH = 544;
const CARD_GAP = 24;
const PAGE_STRIDE = CARDS_PER_PAGE * CARD_WIDTH + CARDS_PER_PAGE * CARD_GAP; // 3*544 + 3*24 = 1704
const TOTAL_PAGES = Math.ceil(PRODUCTS.length / CARDS_PER_PAGE);

/* ----------------------------- Chevron --------------------------------- */
const ChevronIcon: React.FC<{ dir: "left" | "right" }> = ({ dir }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d={dir === "left" ? "M12.5 4L6.5 10L12.5 16" : "M7.5 4L13.5 10L7.5 16"}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ----------------------------- Component -------------------------------- */
const FrameComponent11: React.FC<FrameComponent11Type> = ({
  className = "",
}) => {
  const [page, setPage] = useState(0);
  const canPrev = page > 0;
  const canNext = page < TOTAL_PAGES - 1;
  const translateX = -page * PAGE_STRIDE;

  const { addItem, openCart } = useCart();

  const handleAddProduct = (p: Product) => {
    addItem({
      id: `${p.id}-${p.volume}`,
      productId: p.id,
      name: p.name,
      category: p.desc,
      volume: p.volume,
      price: p.price,
      image: p.photo,
    });
    openCart();
  };

  const items = useMemo(
    () =>
      PRODUCTS.map((p) => ({
        device: "Desktop" as const,
        photo: p.photo,
        prop: p.name,
        prop1: p.desc,
        showTag2: p.showTag2,
        showTag1: true,
        cardItemHeight: "725px" as const, // standardize ALL cards
        contentFlex: undefined,
        contentHeight: undefined,
        iconStarSize: 16,
        iconStarSize1: 16,
        iconStarSize2: 16,
        iconStarSize3: 16,
        iconStarSize4: 16,
        iconStar: "/Star.svg",
        iconStar1: "/Star.svg",
        iconStar2: "/Star.svg",
        iconStar3: "/Star.svg",
        iconStar4: "/Star.svg",
        size: 16,
        size1: 16,
        size2: 24,
        size3: 16,
        showFire: true,
        onAddToCart: () => handleAddProduct(p),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <section
      className={[styles.topProductSectionWrapper, className].join(" ")}
    >
      <div className={styles.topProductSection}>
        <div className={styles.headline}>
          <div className={styles.div}>
            <span>
              <span className={styles.span}>Вибір</span>
              <span className={styles.span2}>{` `}</span>
            </span>
            <span className={styles.span3}>{`українських `}</span>
          </div>
          <div className={styles.div2}>
            <span className={styles.span4}>агрономів</span>
            <span className={styles.span5}>{` `}</span>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.carouselBlock}>
            <div className={styles.cardsWrapper}>
              {/* Arrow buttons */}
              <button
                type="button"
                aria-label="Попередній слайд"
                data-testid="carousel-prev"
                disabled={!canPrev}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={[
                  styles.arrowBtn,
                  styles.arrowBtnLeft,
                  canPrev ? styles.arrowActive : styles.arrowInactive,
                ].join(" ")}
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                aria-label="Наступний слайд"
                data-testid="carousel-next"
                disabled={!canNext}
                onClick={() =>
                  setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1))
                }
                className={[
                  styles.arrowBtn,
                  styles.arrowBtnRight,
                  canNext ? styles.arrowActive : styles.arrowInactive,
                ].join(" ")}
              >
                <ChevronIcon dir="right" />
              </button>

              {/* Cards viewport */}
              <div className={styles.cardsViewport}>
                <div
                  className={styles.cardsGroup}
                  style={{ transform: `translate3d(${translateX}px,0,0)` }}
                >
                  {items.map((item, index) => (
                    <div key={index} className={styles.cardSlot}>
                      <CardItem1
                        device={item.device}
                        photo={item.photo}
                        prop={item.prop}
                        prop1={item.prop1}
                        showTag2={item.showTag2}
                        showTag1={item.showTag1}
                        cardItemHeight={item.cardItemHeight}
                        contentFlex={item.contentFlex}
                        contentHeight={item.contentHeight}
                        iconStarSize={item.iconStarSize}
                        iconStarSize1={item.iconStarSize1}
                        iconStarSize2={item.iconStarSize2}
                        iconStarSize3={item.iconStarSize3}
                        iconStarSize4={item.iconStarSize4}
                        iconStar={item.iconStar}
                        iconStar1={item.iconStar1}
                        iconStar2={item.iconStar2}
                        iconStar3={item.iconStar3}
                        iconStar4={item.iconStar4}
                        size={item.size}
                        size1={item.size1}
                        size2={item.size2}
                        size3={item.size3}
                        showFire={item.showFire}
                        onAddToCart={item.onAddToCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination dots */}
            <div className={styles.dots} role="tablist" aria-label="Слайди">
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Слайд ${i + 1}`}
                  data-testid={`carousel-dot-${i}`}
                  onClick={() => setPage(i)}
                  className={[
                    styles.dot,
                    i === page ? styles.dotActive : "",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          <PrimaryButton1
            state="Default"
            type="Filled"
            prop="Переглянути лінійку"
            primaryButtonPadding="18px 16px"
            primaryButtonWidth="540px"
            size="24"
          />
        </div>
      </div>
    </section>
  );
};

export default FrameComponent11;
