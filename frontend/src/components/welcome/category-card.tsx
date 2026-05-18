import React from "react";
import styles from "./category-card.module.css";

export type CategoryCardProps = {
  /** Картинка-иконка (PNG/SVG из /public). Помещается внутри зелёного круга. */
  iconSrc: string;
  /** Точный размер иконки внутри круга — фикс согласно дизайну. */
  iconWidth: number;
  iconHeight: number;
  /** Заголовок категории */
  title: string;
  /** Краткое описание */
  description: string;
  /** Текст ссылки в подвале карточки */
  ctaLabel?: string;
  /** Куда ведёт «Детальніше» */
  href?: string;
  className?: string;
};

/**
 * Карточка категории биопрепаратов.
 * Структура: круг с иконкой → заголовок → описание → CTA «Детальніше →».
 * Иконка ВСЕГДА центрируется внутри круга и не выходит за его границы.
 */
const CategoryCard: React.FC<CategoryCardProps> = ({
  iconSrc,
  iconWidth,
  iconHeight,
  title,
  description,
  ctaLabel = "Детальніше",
  href = "#",
  className = "",
}) => {
  return (
    <article className={[styles.card, className].join(" ")} data-testid="category-card">
      <div className={styles.iconCircle} aria-hidden="true">
        <img decoding="async"
          className={styles.iconImg}
          src={iconSrc}
          alt=""
          width={iconWidth}
          height={iconHeight}
          loading="lazy"
          style={{ width: `${iconWidth}px`, height: `${iconHeight}px` }}
        />
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <a href={href} className={styles.cta} data-testid="category-card-cta">
        <span className={styles.ctaText}>{ctaLabel}</span>
        <span className={styles.ctaArrow} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
              stroke="#1b4332"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </article>
  );
};

export default CategoryCard;
