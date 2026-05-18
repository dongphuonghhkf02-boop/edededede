import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Document2 from "../components/figma/document2";
import FrameComponent6 from "../components/figma/frame-component6";
import Image2 from "../components/figma/image2";
import TabGroup1, { TabKey } from "../components/figma/tab-group1";
import TextBlock1 from "../components/figma/text-block1";
import FrameComponent8 from "../components/figma/frame-component8";
import LogisticsSection from "../components/figma/logistics-section";
import FrameComponent9 from "../components/figma/frame-component9";
import CombinedProducts from "../components/figma/combined-products";
import CtaSection1 from "../components/figma/cta-section1";
import Footer1 from "../components/figma/footer1";
import { getProduct, type Product, type TabBlock } from "../lib/products-api";
import styles from "./desktop1.module.css";

/* ----- Tiny HTML helper (renders trusted admin-authored HTML) ----- */
const Html: React.FC<{ html?: string; className?: string }> = ({ html, className }) =>
  html ? (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  ) : null;

const Desktop1: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("opis");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getProduct(slug)
      .then((p) => { if (!cancelled) setProduct(p); })
      .catch((e) => { if (!cancelled) setError(e?.response?.data?.detail || "Товар не знайдено"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  /* ============================================================
     ОПИС — original Figma design (Image2 hero + Problem/Solution)
     ============================================================ */
  const renderOpis = () => {
    const d = product?.description;
    const heroImage = d?.hero_image || "/tree.webp";
    const titleLine1 = d?.title_line1 || "Відновлення";
    const titleLine2 = d?.title_line2 || "після стресу.";
    const titleSubline = d?.title_subline || "Стабільний врожай.";
    const chips = d?.chips;
    const problem = d?.problem;
    const solution = d?.solution;

    return (
      <>
        <Image2
          heroImage={heroImage}
          heroAlt={product ? `${product.name} — ${product.short_desc}` : "Дерево — відновлення після стресу"}
          chips={chips && chips.length > 0 ? chips : undefined}
        />
        <section className={styles.featureColumnWrapper}>
          <div className={styles.featureColumn}>
            <h1 className={styles.h1}>
              <span className={styles.span}>
                <span>{titleLine1}</span>
              </span>
              <span className={styles.span2}>
                <span className={styles.span}>{` `}</span>
                <span>{titleLine2}</span>
                <span className={styles.span4}>{` `}</span>
              </span>
            </h1>
            <h2 className={styles.h2}>{titleSubline}</h2>
          </div>
        </section>
        <section className={styles.textBlockWrapper}>
          <div className={styles.textBlock}>
            <TextBlock1
              prop={(problem?.title || "Проблема") + " "}
              intro={<Html html={problem?.intro_html} />}
              prop1={<Html html={problem?.outro_html} />}
            />
            <TextBlock1
              prop={(solution?.title || "Рішення") + " "}
              textBlockAlignItems="flex-end"
              lineHeight="312px"
              lineBorderRight="2px solid #b3d217"
              textContentGap="24px"
              headingsBackgroundColor="#f7fae8"
              h3Color="unset"
              intro={<Html html={solution?.intro_html} />}
              h3Content={<Html html={solution?.outro_html} />}
            />
          </div>
        </section>
      </>
    );
  };

  /* ============================================================
     Дозування / Склад / Сумісність / Характеристика — структуровані картки
     ============================================================ */
  const renderRichTab = (
    block: TabBlock | undefined,
    fallbackTitle: string,
    accent: "lime" | "olive" | "earth" | "sand",
    icon: React.ReactNode,
  ) => {
    const title = block?.title || fallbackTitle;
    const intro = block?.intro || "";
    const items = block?.items || [];
    const note  = block?.note || "";
    return (
      <section className={styles.richTabWrapper} data-accent={accent}>
        <div className={styles.richTabHead}>
          <div className={styles.richTabIcon} aria-hidden="true">{icon}</div>
          <div className={styles.richTabHeadText}>
            <h2 className={styles.richTabTitle}>{title}</h2>
            {intro ? <p className={styles.richTabIntro}>{intro}</p> : null}
          </div>
        </div>
        {items.length > 0 && (
          <ul className={styles.richTabList}>
            {items.map((it, i) => (
              <li key={i} className={styles.richTabItem}>
                <span className={styles.richTabBullet} aria-hidden="true">•</span>
                <span
                  className={styles.richTabItemText}
                  dangerouslySetInnerHTML={{ __html: it.text }}
                />
              </li>
            ))}
          </ul>
        )}
        {note ? (
          <div className={styles.richTabNoteBox}>
            <div className={styles.richTabNoteLabel}>Примітка</div>
            <p className={styles.richTabNote}>{note}</p>
          </div>
        ) : null}
      </section>
    );
  };

  const renderSpecsTab = () => {
    const block = product?.specs;
    const title = block?.title || "Характеристика";
    const intro = block?.intro || "";
    const items = block?.items || [];
    const note  = block?.note || "";

    /* Try to split each "label: value" item into label + value for a clean table */
    const rows = items.map((it) => {
      const text = it.text || "";
      // Find first " — " or ": " separator
      const m = text.match(/^(.*?)(?:\s—\s|:\s)(.*)$/);
      if (m) return { label: m[1].trim(), value: m[2].trim() };
      return { label: text, value: "" };
    });

    return (
      <section className={styles.richTabWrapper} data-accent="sand">
        <div className={styles.richTabHead}>
          <div className={styles.richTabIcon} aria-hidden="true">{IconChart}</div>
          <div className={styles.richTabHeadText}>
            <h2 className={styles.richTabTitle}>{title}</h2>
            {intro ? <p className={styles.richTabIntro}>{intro}</p> : null}
          </div>
        </div>
        {rows.length > 0 && (
          <div className={styles.specsTableWrap}>
            <table className={styles.specsTable}>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <th scope="row" dangerouslySetInnerHTML={{ __html: r.label }} />
                    <td dangerouslySetInnerHTML={{ __html: r.value || "—" }} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {note ? (
          <div className={styles.richTabNoteBox}>
            <div className={styles.richTabNoteLabel}>Примітка</div>
            <p className={styles.richTabNote}>{note}</p>
          </div>
        ) : null}
      </section>
    );
  };

  /* ---------- Inline icons (matched to design system) ---------- */
  const IconDrop = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
  const IconBacteria = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9.5" cy="11" r="0.9" fill="currentColor" />
      <circle cx="14" cy="13.5" r="0.9" fill="currentColor" />
      <circle cx="12" cy="9.5" r="0.7" fill="currentColor" />
      <path d="M5 5l2 2M19 5l-2 2M5 19l2-2M19 19l-2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
  const IconShield = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 3v6c0 4.5-3.5 8.3-8 9-4.5-.7-8-4.5-8-9V6l8-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const IconChart = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dosage":
        return renderRichTab(product?.dosage, "Дозування", "lime", IconDrop);
      case "composition":
        return renderRichTab(product?.composition, "Склад", "olive", IconBacteria);
      case "compatibility":
        return renderRichTab(product?.compatibility, "Сумісність", "earth", IconShield);
      case "specs":
        return renderSpecsTab();
      case "opis":
      default:
        return renderOpis();
    }
  };

  if (loading) {
    return (
      <div className={styles.desktop}>
        <Document2 />
        <div style={{ padding: 80, textAlign: "center", color: "#6b6b66" }}>Завантаження…</div>
        <Footer1 device="Desktop" />
      </div>
    );
  }

  if (error && slug) {
    return (
      <div className={styles.desktop}>
        <Document2 />
        <div style={{ padding: 80, textAlign: "center" }}>
          <h2 style={{ color: "#2c2c27", marginBottom: 12 }}>Товар не знайдено</h2>
          <p style={{ color: "#6b6b66" }}>{error}</p>
        </div>
        <Footer1 device="Desktop" />
      </div>
    );
  }

  return (
    <div className={styles.desktop}>
      <Seo
        title={product ? (product.seo_title || `${product.name} — TAMIS АГРО`) : "Біопрепарат — деталі товару"}
        description={product ? (product.seo_description || product.short_desc) : "Детальний опис біопрепарату ТАМІС АГРО: склад, дозування, культури, відгуки. Замовлення з безкоштовною доставкою по Україні."}
        canonical={product ? `/product/${product.slug}` : "/product"}
        type="product"
      />
      <Document2 />
      <FrameComponent6 product={product} />
      <main className={styles.describeSectionWrapper}>
        <div className={styles.describeSection}>
          <TabGroup1 activeTab={activeTab} onTabChange={setActiveTab} />
          {renderTabContent()}
        </div>
      </main>
      <FrameComponent8 />
      <section className={styles.chaineSectionWrapper}>
        <div className={styles.chaineSection}>
          <LogisticsSection />
        </div>
      </section>
      <FrameComponent9 />
      <CombinedProducts />
      <CtaSection1 />
      <Footer1 device="Desktop" />
    </div>
  );
};

export default Desktop1;
