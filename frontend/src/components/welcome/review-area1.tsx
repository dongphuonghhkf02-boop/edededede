import React, { useState, useMemo } from "react";
import CardReview1 from "./card-review1";
import styles from "./review-area1.module.css";

export type ReviewArea1Type = {
  className?: string;
};

const CARD_WIDTH = 541; // px
const CARD_GAP = 24; // px

type ReviewItem = {
  category: string;
  body: string;
  author: string;
};

const REVIEW_BODY =
  'Спочатку ставився скептично, звикли "гасити" проблеми жорсткою хімією. Але минулий рік був посушливий, і хімічні фунгіциди просто палили кукурудзу. Спробували вашу схему з Тріходерміном по листу. Рослина не стресувала, стояла зелена до самих жнив. У підсумку отримали +4,5 ц/га на контрольних ділянках.';

const reviewsData: ReviewItem[] = [
  { category: "Біоінсектициди", body: REVIEW_BODY, author: "Аграрна компанія м.Львів" },
  { category: "Біоінсектициди", body: REVIEW_BODY, author: "Аграрна компанія м.Львів" },
  { category: "Біоінсектициди", body: REVIEW_BODY, author: "Аграрна компанія м.Львів" },
  { category: "Біоінсектициди", body: REVIEW_BODY, author: "Аграрна компанія м.Львів" },
  { category: "Біоінсектициди", body: REVIEW_BODY, author: "Аграрна компанія м.Львів" },
];

const PAGES = 3; // 3 logical pages → 3 dots
const MAX_STEP = PAGES - 1;
const SLIDE_PX = CARD_WIDTH + CARD_GAP; // 565

const ReviewArea1: React.FC<ReviewArea1Type> = ({ className = "" }) => {
  const [step, setStep] = useState(0);

  const trackStyle = useMemo<React.CSSProperties>(
    () => ({ transform: `translate3d(${-step * SLIDE_PX}px, 0, 0)` }),
    [step],
  );

  const canPrev = step > 0;
  const canNext = step < MAX_STEP;

  const handlePrev = () => {
    if (canPrev) setStep((s) => s - 1);
  };
  const handleNext = () => {
    if (canNext) setStep((s) => s + 1);
  };

  return (
    <section className={[styles.reviewArea, className].join(" ")} data-testid="reviews-section">
      <div className={styles.reviewSection}>
        {/* Title */}
        <div className={styles.headlineButton}>
          <div className={styles.div}>
            <span className={styles.span}>
              <span className={styles.span2}>Фермери</span>
              <span className={styles.span3}>{` `}</span>
            </span>
            <span className={styles.span4}>обирають нас</span>
          </div>
        </div>

        {/* Image + cards row, gap=79 to controls below */}
        <div className={styles.reviewGroup}>
          <div className={styles.imageRow}>
            <img loading="lazy" decoding="async"
              className={styles.imageIcon}
              width={504}
              height={404}
              alt=""
              src="/image4@2x.webp"
            />
            <div className={styles.viewport}>
              <div className={styles.track} style={trackStyle} data-testid="reviews-track">
                {reviewsData.map((review, idx) => (
                  <CardReview1
                    key={idx}
                    category={review.category}
                    body={review.body}
                    author={review.author}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls: dots centered, arrows right */}
          <div className={styles.controlsRow}>
            <div className={styles.dotsCell}>
              <SliderDots active={step} total={PAGES} onSelect={(i) => setStep(i)} />
            </div>
            <div className={styles.arrowsCell}>
              <div className={styles.arrowsBar}>
                {/* PREV — uses Right-active mirrored when active, Left-disabled as-is when disabled */}
                <button
                  className={styles.arrowBtn}
                  onClick={handlePrev}
                  disabled={!canPrev}
                  aria-label="Previous review"
                  type="button"
                  data-testid="reviews-prev"
                >
                  {canPrev ? (
                    <img loading="lazy" decoding="async"
                      className={`${styles.arrowImg} ${styles.arrowImgFlip}`}
                      src="/arrow-right-active.png"
                      alt=""
                      width={36}
                      height={36}
                      draggable={false}
                    />
                  ) : (
                    <img loading="lazy" decoding="async"
                      className={styles.arrowImg}
                      src="/arrow-left-disabled.png"
                      alt=""
                      width={36}
                      height={36}
                      draggable={false}
                    />
                  )}
                </button>

                {/* NEXT — uses Right-active as-is, Left-disabled mirrored when disabled */}
                <button
                  className={styles.arrowBtn}
                  onClick={handleNext}
                  disabled={!canNext}
                  aria-label="Next review"
                  type="button"
                  data-testid="reviews-next"
                >
                  {canNext ? (
                    <img loading="lazy" decoding="async"
                      className={styles.arrowImg}
                      src="/arrow-right-active.png"
                      alt=""
                      width={36}
                      height={36}
                      draggable={false}
                    />
                  ) : (
                    <img loading="lazy" decoding="async"
                      className={`${styles.arrowImg} ${styles.arrowImgFlip}`}
                      src="/arrow-left-disabled.png"
                      alt=""
                      width={36}
                      height={36}
                      draggable={false}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Dots: 96×36 wrapper, justify-content: space-between, active=24×12 fill, others=12×12 outline */
const SliderDots: React.FC<{
  active: number;
  total: number;
  onSelect?: (i: number) => void;
}> = ({ active, total, onSelect }) => {
  const dots = Array.from({ length: total }, (_, i) => i);
  return (
    <div
      style={{
        width: "96px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {dots.map((i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect?.(i)}
            aria-label={`Page ${i + 1}`}
            data-testid={`reviews-dot-${i}`}
            style={{
              cursor: "pointer",
              background: "transparent",
              border: 0,
              padding: 0,
              height: "36px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "block",
                height: "12px",
                width: isActive ? "24px" : "12px",
                borderRadius: "50px",
                backgroundColor: isActive ? "#1b4332" : "transparent",
                border: isActive ? "none" : "1px solid #1b4332",
                transition:
                  "width 240ms ease, background-color 240ms ease, border-color 240ms ease",
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ReviewArea1;
