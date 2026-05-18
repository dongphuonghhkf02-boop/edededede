import React, { useState } from "react";
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
import styles from "./desktop1.module.css";

const Desktop1: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("opis");

  /* ----- Tab content blocks ----- */
  const renderOpis = () => (
    <>
      <Image2 />
      <section className={styles.featureColumnWrapper}>
        <div className={styles.featureColumn}>
          <h1 className={styles.h1}>
            <span className={styles.span}>
              <span>Відновлення</span>
            </span>
            <span className={styles.span2}>
              <span className={styles.span}>{` `}</span>
              <span>після стресу.</span>
              <span className={styles.span4}>{` `}</span>
            </span>
          </h1>
          <h2 className={styles.h2}>Стабільний врожай.</h2>
        </div>
      </section>
      <section className={styles.textBlockWrapper}>
        <div className={styles.textBlock}>
          <TextBlock1
            prop="Проблема "
            intro={
              <>
                <span>{`Протягом вегетаційного періоду рослини піддаються впливу `}</span>
                <b>великої кількості стресових факторів</b>
                <span>{`: пестицидні навантаження, несприятливі погодні умови (температура, вологість), механічні пошкодження, градобій, погіршення живлення та ін. `}</span>
              </>
            }
            prop1="Це призводить до погіршення росту рослин, зниженню їх продуктивності, а іноді й до їх загибелі."
          />
          <TextBlock1
            prop="Рішення "
            textBlockAlignItems="flex-end"
            lineHeight="312px"
            lineBorderRight="2px solid #b3d217"
            textContentGap="24px"
            headingsBackgroundColor="#f7fae8"
            h3Color="unset"
            intro={
              <>
                <span>{`Антистресант зі стимулюючим ефектом на основі `}</span>
                <b>бактерій Bacillus subtilis</b>
                <span>{`, амінокислот та мікроелементів. Препарат відновлює біохімічні процеси у рослині після впливу стресових факторів. Активізує поділ клітин кореневої системи, завдяки чому рослина через молоді кореневі волоски інтенсивно поглинає елементи живлення та вологу.`}</span>
              </>
            }
            h3Content={
              <>
                <span>{`Рослина `}</span>
                <span style={{ color: "#b3d217" }}>швидше виходить зі стресу</span>
                <span>{` і спрямовує енергію на ріст та формування врожаю. `}</span>
                <span style={{ color: "#b3d217" }}>Врожай стабільніший</span>
                <span>{` навіть у складні сезони.`}</span>
              </>
            }
          />
        </div>
      </section>
    </>
  );

  const renderDosage = () => (
    <section className={styles.tabContentWrapper}>
      <div className={styles.tabContentInner}>
        <h2 className={styles.tabContentTitle}>Дозування</h2>
        <ul className={styles.tabList}>
          <li>Польові культури — <b>0,5–1,0 л/га</b></li>
          <li>Овочеві культури — <b>0,3–0,7 л/га</b></li>
          <li>Плодові та ягідні — <b>0,7–1,2 л/га</b></li>
          <li>Кратність обробок: 2–3 рази за вегетацію</li>
        </ul>
        <p className={styles.tabContentNote}>
          Обробку проводити в ранкові або вечірні години при температурі 15–25°C, у безвітряну погоду.
        </p>
      </div>
    </section>
  );

  const renderComposition = () => (
    <section className={styles.tabContentWrapper}>
      <div className={styles.tabContentInner}>
        <h2 className={styles.tabContentTitle}>Склад</h2>
        <ul className={styles.tabList}>
          <li><b>Bacillus subtilis</b> — 1×10⁹ КУО/мл</li>
          <li>Амінокислоти рослинного походження — 12%</li>
          <li>Гумінові кислоти — 3%</li>
          <li>Мікроелементи (Zn, Mn, Cu, Mo, B) — у хелатній формі</li>
          <li>Стабілізатор pH-балансу — органічного походження</li>
        </ul>
      </div>
    </section>
  );

  const renderCompatibility = () => (
    <section className={styles.tabContentWrapper}>
      <div className={styles.tabContentInner}>
        <h2 className={styles.tabContentTitle}>Сумісність</h2>
        <p className={styles.tabContentNote}>
          Препарат сумісний з більшістю засобів захисту рослин та водорозчинних добрив. Рекомендовано перед змішуванням провести тест на сумісність у малих об'ємах.
        </p>
        <ul className={styles.tabList}>
          <li>Сумісний: фунгіциди, інсектициди, водорозчинні добрива</li>
          <li>Не сумісний: засоби з лужною реакцією (pH &gt; 8)</li>
          <li>Інтервал застосування з гербіцидами — мінімум 5 днів</li>
        </ul>
      </div>
    </section>
  );

  const renderSpecs = () => (
    <section className={styles.tabContentWrapper}>
      <div className={styles.tabContentInner}>
        <h2 className={styles.tabContentTitle}>Характеристика</h2>
        <ul className={styles.tabList}>
          <li>Форма випуску: рідкий концентрат</li>
          <li>Колір: світло-коричневий</li>
          <li>pH розчину: 6,5–7,5</li>
          <li>Термін придатності: 24 місяці</li>
          <li>Температура зберігання: +5…+25°C</li>
          <li>Фасування: 1 л / 5 л / 10 л / 20 л</li>
          <li>Сертифікація: придатний для органічного землеробства</li>
        </ul>
      </div>
    </section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dosage":
        return renderDosage();
      case "composition":
        return renderComposition();
      case "compatibility":
        return renderCompatibility();
      case "specs":
        return renderSpecs();
      case "opis":
      default:
        return renderOpis();
    }
  };

  return (
    <div className={styles.desktop}>
      <Seo
        title="Біопрепарат — деталі товару"
        description="Детальний опис біопрепарату ТАМІС АГРО: склад, дозування, культури, відгуки. Замовлення з безкоштовною доставкою по Україні."
        canonical="/product"
        type="product"
      />
      <Document2 />
      <FrameComponent6 />
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
