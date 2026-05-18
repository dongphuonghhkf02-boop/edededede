import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Document2 from "../components/figma/document2";
import FrameComponent6 from "../components/figma/frame-component6";
import TabGroup1, { TabKey } from "../components/figma/tab-group1";
import FrameComponent8 from "../components/figma/frame-component8";
import LogisticsSection from "../components/figma/logistics-section";
import FrameComponent9 from "../components/figma/frame-component9";
import CombinedProducts from "../components/figma/combined-products";
import CtaSection1 from "../components/figma/cta-section1";
import Footer1 from "../components/figma/footer1";
import { getProduct, type Product, type TabBlock } from "../lib/products-api";
import styles from "./desktop1.module.css";

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
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.response?.data?.detail || "Товар не знайдено");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* ---------- Tab renderers (DATA-DRIVEN when product loaded) ---------- */
  const renderHtml = (html: string) => (
    <div
      className={styles.richTabBody}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  const renderTabBlock = (block: TabBlock | undefined, fallbackTitle: string) => {
    const title = block?.title || fallbackTitle;
    const intro = block?.intro || "";
    const items = block?.items || [];
    const note  = block?.note || "";
    return (
      <section className={styles.tabContentWrapper}>
        <div className={styles.tabContentInner}>
          <h2 className={styles.tabContentTitle}>{title}</h2>
          {intro ? <p className={styles.tabContentNote}>{intro}</p> : null}
          {items.length > 0 && (
            <ul className={styles.tabList}>
              {items.map((it, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: it.text }} />
              ))}
            </ul>
          )}
          {note ? <p className={styles.tabContentNote}>{note}</p> : null}
        </div>
      </section>
    );
  };

  const renderOpis = () => {
    if (product) {
      return (
        <section className={styles.tabContentWrapper}>
          <div className={styles.tabContentInner}>
            <h2 className={styles.tabContentTitle}>Опис</h2>
            {product.description_image ? (
              <img
                src={product.description_image}
                alt={product.name}
                className={styles.tabImage}
                loading="lazy"
              />
            ) : null}
            {product.description_html ? (
              renderHtml(product.description_html)
            ) : (
              <p className={styles.tabContentNote}>{product.short_desc}</p>
            )}
          </div>
        </section>
      );
    }
    // Fallback (no slug → demo page) — keep legacy “ФЛОРЕС” block
    return (
      <section className={styles.tabContentWrapper}>
        <div className={styles.tabContentInner}>
          <h2 className={styles.tabContentTitle}>Опис</h2>
          <p className={styles.tabContentNote}>
            Удосконалений органічний стимулятор росту для підвищення врожайності
            сільськогосподарських культур.
          </p>
        </div>
      </section>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dosage":
        return renderTabBlock(product?.dosage, "Дозування");
      case "composition":
        return renderTabBlock(product?.composition, "Склад");
      case "compatibility":
        return renderTabBlock(product?.compatibility, "Сумісність");
      case "specs":
        return renderTabBlock(product?.specs, "Характеристика");
      case "opis":
      default:
        return renderOpis();
    }
  };

  if (loading) {
    return (
      <div className={styles.desktop}>
        <Document2 />
        <div style={{ padding: 80, textAlign: "center", color: "#6b6b66" }}>
          Завантаження…
        </div>
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
