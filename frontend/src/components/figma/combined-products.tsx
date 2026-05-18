import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./combined-products.module.css";

type Product = {
  id: string;
  photo: string;
  hit: boolean;
  category?: string;       // "Захист рослин" etc. (optional)
  title: string;
  body: string;
  rating: number;          // 0–5
  ratingCount: number;     // e.g. 100
  tara: string;            // "1, 5, 10 л"
  norma: string;           // "1.5-2 л/га"
  priceFrom: string;       // "від 420 ₴/л"
};

const PRODUCTS: Product[] = [
  { id: "ksaladan", photo: "/Photo@2x.webp",  hit: true, category: "Захист рослин",
    title: "Ксаладан",
    body: "макро та мікро елементи для обробки зернобобових та технічних культур",
    rating: 4.9, ratingCount: 100, tara: "1, 5, 10 л", norma: "1.5-2 л/га", priceFrom: "від 420 ₴/л" },
  { id: "venator",  photo: "/Photo1@2x.webp", hit: true, category: "Захист рослин",
    title: "Венатор",
    body: "макро та мікро елементи для обробки зернобобових та технічних культур",
    rating: 4.9, ratingCount: 100, tara: "1, 5, 10 л", norma: "1.5-2 л/га", priceFrom: "від 420 ₴/л" },
  { id: "plantonit", photo: "/Photo2@2x.webp", hit: true,
    title: "Plantonit Fruit",
    body: "макро та мікроелементи для плодових культур, концентрат",
    rating: 4.9, ratingCount: 100, tara: "1, 5, 10 л", norma: "1.5-2 л/га", priceFrom: "від 420 ₴/л" },
  { id: "ksaladan-2", photo: "/Photo@2x.webp", hit: true, category: "Захист рослин",
    title: "Ксаладан 2",
    body: "макро та мікро елементи для обробки зернобобових та технічних культур",
    rating: 4.9, ratingCount: 100, tara: "1, 5, 10 л", norma: "1.5-2 л/га", priceFrom: "від 420 ₴/л" },
  { id: "venator-2",  photo: "/Photo1@2x.webp", hit: true, category: "Захист рослин",
    title: "Венатор 2",
    body: "макро та мікро елементи для обробки зернобобових та технічних культур",
    rating: 4.9, ratingCount: 100, tara: "1, 5, 10 л", norma: "1.5-2 л/га", priceFrom: "від 420 ₴/л" },
  { id: "plantonit-2", photo: "/Photo2@2x.webp", hit: true,
    title: "Plantonit Fruit 2",
    body: "макро та мікроелементи для плодових культур, концентрат",
    rating: 4.9, ratingCount: 100, tara: "1, 5, 10 л", norma: "1.5-2 л/га", priceFrom: "від 420 ₴/л" },
];

const VISIBLE = 3; // how many cards are visible in one "page"

const Star: React.FC<{ filled?: boolean }> = ({ filled = true }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#ACB14F" : "none"} stroke="#ACB14F" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 2.5l2.94 6.57 7.06.75-5.32 4.86 1.55 7.07L12 17.94l-6.23 3.81 1.55-7.07L2 9.82l7.06-.75L12 2.5z" />
  </svg>
);

const TaraIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C2C27" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 7h12l-1.2 12.4a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 7z"/>
    <path d="M9 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>
  </svg>
);

const DropIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C2C27" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>
  </svg>
);

const HitIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C2C27" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2c1 4 6 5 6 10a6 6 0 0 1-12 0c0-3 2-4 3-6 .5 1 1 2 2 2 1 0 1-1 1-6z"/>
  </svg>
);

const LeafIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 19c0-7 7-13 16-14 0 9-6 16-14 16-1 0-2 0-2-2z"/>
    <path d="M5 19c3-3 6-5 11-7"/>
  </svg>
);

const CombinedProducts: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activePage, setActivePage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(PRODUCTS.length / VISIBLE));

  const updateActivePage = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) {
      setActivePage(0);
      return;
    }
    // page width corresponds to one full viewport of cards
    const pageWidth = el.clientWidth;
    const idx = Math.round(el.scrollLeft / pageWidth);
    setActivePage(Math.min(idx, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateActivePage();
    el.addEventListener("scroll", updateActivePage, { passive: true });
    window.addEventListener("resize", updateActivePage);
    return () => {
      el.removeEventListener("scroll", updateActivePage);
      window.removeEventListener("resize", updateActivePage);
    };
  }, [updateActivePage]);

  const scrollByPage = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const scrollToPage = (page: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className={styles.section} data-testid="combined-products-section">
      {/* Header row: heading + nav arrows */}
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>
          <span className={styles.headingPrimary}>Товари,</span>
          <span className={styles.headingGap}> </span>
          <span className={styles.headingSecondary}>які купують разом</span>
        </h2>
        <div className={styles.navArrows} aria-label="Перемикання карток">
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnLeft}`}
            aria-label="Попередні товари"
            onClick={() => scrollByPage(-1)}
            disabled={activePage === 0}
            data-testid="carousel-prev"
          >
            <img loading="lazy" decoding="async" src="/carousel-arrow-right.png" alt="" className={styles.navIcon} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            aria-label="Наступні товари"
            onClick={() => scrollByPage(1)}
            disabled={activePage >= pageCount - 1}
            data-testid="carousel-next"
          >
            <img loading="lazy" decoding="async" src="/carousel-arrow-right.png" alt="" className={styles.navIcon} />
          </button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollerRef}
        className={styles.scroller}
        data-testid="combined-products-scroller"
        role="region"
        aria-label="Каталог рекомендованих товарів"
      >
        <ul className={styles.track}>
          {PRODUCTS.map((p) => (
            <li key={p.id} className={styles.card}>
              {/* Top badges */}
              <div className={styles.topBadges}>
                {p.hit && (
                  <span className={styles.badgeHit}>
                    <HitIcon />
                    <span>Хіт продажу</span>
                  </span>
                )}
                {p.category && (
                  <span className={styles.badgeCategory}>
                    <LeafIcon />
                    <span>{p.category}</span>
                  </span>
                )}
              </div>

              {/* Photo */}
              <div className={styles.photoWrap}>
                <img loading="lazy" decoding="async" src={p.photo} alt={p.title} className={styles.photo} />
              </div>

              {/* Rating */}
              <div className={styles.rating}>
                <span className={styles.stars} aria-label={`Рейтинг ${p.rating} з 5`}>
                  {[0,1,2,3,4].map((i) => <Star key={i} filled />)}
                </span>
                <span className={styles.ratingText}>{p.rating.toFixed(1)} ({p.ratingCount})</span>
              </div>

              {/* Title + body */}
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardBody}>{p.body}</p>

              {/* Meta list */}
              <ul className={styles.metaList}>
                <li className={styles.metaItem}>
                  <TaraIcon />
                  <span>Тара: {p.tara}</span>
                </li>
                <li className={styles.metaItem}>
                  <DropIcon />
                  <span>Норма: {p.norma}</span>
                </li>
              </ul>

              {/* Spacer fills the rest so the footer sticks to bottom */}
              <div className={styles.spacer} />

              {/* Footer: price + add to cart */}
              <div className={styles.cardFooter}>
                <span className={styles.price}>{p.priceFrom}</span>
                <button type="button" className={styles.addBtn} aria-label={`Додати ${p.title} в кошик`}>
                  <span className={styles.addText}>Додати в кошик</span>
                  <img loading="lazy" decoding="async" src="/cart-arrow.png" alt="" className={styles.addIcon} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination dots */}
      <div className={styles.dots} role="tablist" aria-label="Сторінки">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === activePage}
            aria-label={`Сторінка ${i + 1}`}
            className={`${styles.dot} ${i === activePage ? styles.dotActive : ""}`}
            onClick={() => scrollToPage(i)}
            data-testid={`carousel-dot-${i}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CombinedProducts;
