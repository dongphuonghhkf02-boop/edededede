import React from "react";
import { Link } from "react-router-dom";
import { useContactInfo } from "../../context/ContactInfoContext";
import { useEmailModal } from "../../context/EmailModalContext";
import styles from "./footer-container1.module.css";

export type FooterContainer1Type = {
  className?: string;
};

const FooterContainer1: React.FC<FooterContainer1Type> = ({
  className = "",
}) => {
  const { info } = useContactInfo();
  const { openEmailModal } = useEmailModal();
  return (
    <div className={[styles.footerContainer, className].join(" ")}>
      <div className={styles.mainRow}>
        <img loading="lazy" decoding="async"
          className={styles.logoIcon}
          width={366}
          height={261}
          alt=""
          src="/logo@2x.png"
        />
        <div className={styles.colum}>
          <div className={styles.navColumn}>
            <b className={styles.b}>Нашим клієнтам:</b>
            <div className={styles.navLinks}>
              <Link to="/catalog" className={`${styles.div} ${styles.navLink}`}>
                Товари та послуги
              </Link>
              <Link to="/about" className={`${styles.div} ${styles.navLink}`}>
                Про нас
              </Link>
              <Link
                to="/blog"
                className={`${styles.div} ${styles.navLink}`}
                data-testid="footer-blog-link"
              >
                Блог
              </Link>
              <Link to="/contacts" className={`${styles.div} ${styles.navLink}`}>
                Повернення товару
              </Link>
            </div>
          </div>
          <div className={styles.navColumn}>
            <b className={styles.b}>Наша адреса:</b>
            <div className={styles.b}>
              {info.address.split(",").map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part.trim()}
                  {i < arr.length - 1 ? "," : ""}
                  {i < arr.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className={styles.navColumn}>
            <b className={styles.b}>Контакти:</b>
            <div className={styles.b}>
              <a
                href={`tel:${info.phone_primary_tel}`}
                className={styles.contactLink}
                data-testid="footer-phone-1"
              >
                {info.phone_primary}
              </a>
              <br />
              <a
                href={`tel:${info.phone_secondary_tel}`}
                className={styles.contactLink}
                data-testid="footer-phone-2"
              >
                {info.phone_secondary}
              </a>
              <br />
              <a
                href={`mailto:${info.email}`}
                className={styles.contactLink}
                data-testid="footer-email"
                onClick={(e) => {
                  e.preventDefault();
                  openEmailModal({ defaultSubject: "" });
                }}
              >
                {info.email}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copyrightContainer}>
        <div className={styles.copyrightInner}>
          <img decoding="async"
            className={styles.antDesigncopyrightCircleOuIcon}
            loading="lazy"
            width={18}
            height={18}
            alt=""
            src="/ant-design-copyright-circle-outlined.svg"
          />
          <div className={styles.div6}>2026. Всі права захищено</div>
        </div>
      </div>
    </div>
  );
};

export default FooterContainer1;
