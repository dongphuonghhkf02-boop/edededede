import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Navbar1 from "../components/figma/navbar1";
import Footer1 from "../components/figma/footer1";
import styles from "./cultures.module.css";
import { listCulturesPublic, type Culture } from "../lib/cultures-api";

/* =====================================================================
   /cultures — Cultures (Культури) page.
   Built strictly from the Figma design (1920px width, scaled by
   <ScaledShell>). Navbar1 + Footer1 are project-shared and untouched.

   Картки секції «Знайдіть рішення для вашої культури» повністю
   керовані з адмінки (/admin/cultures) через API /api/cultures.
   ===================================================================== */

const TABS = [
  { key: "bt", label: "Bacillus thuringiensis" },
  { key: "trichoderma", label: "Trichoderma" },
  { key: "azot", label: "Азотфіксуючі бактерії" },
  { key: "humat", label: "Гумати" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

/* === Slides for the "Порахуйте вигоду" comparison block === */
type CompareCard = { num: string; label: string };
type CompareSlide = {
  id: string;
  title: string;
  image: string;
  chem: { name: string; rows: CompareCard[] };
  bio: { name: string; rows: CompareCard[] };
};

const COMPARE_SLIDES: CompareSlide[] = [
  {
    id: "year-1",
    title: "Рік 1: точка відліку.",
    image: "/u9976363322-Generate-a-field-with-agriculture-should-be-separ-eb554260-9dc3-4126-84b3-a7305fd2ca9e-1-1-1@2x.webp",
    chem: {
      name: "Хімія",
      rows: [
        { num: "8.5 тис грн", label: "витрати/га" },
        { num: "0%", label: "врожайність" },
        { num: "Норма", label: "стан ґрунту" },
      ],
    },
    bio: {
      name: "Біозахист",
      rows: [
        { num: "9.2 тис грн", label: "витрати/га" },
        { num: "0%", label: "врожайність" },
        { num: "Норма", label: "стан ґрунту" },
      ],
    },
  },
  {
    id: "year-3",
    title: "Рік 3: ознаки стресу",
    image: "/year3-field.webp",
    chem: {
      name: "Хімія",
      rows: [
        { num: "12.4 тис грн", label: "витрати/га" },
        { num: "-8%", label: "врожайність" },
        { num: "Виснажений", label: "стан ґрунту" },
      ],
    },
    bio: {
      name: "Біозахист",
      rows: [
        { num: "7.8 тис грн", label: "витрати/га" },
        { num: "+12%", label: "врожайність" },
        { num: "Відновлений", label: "стан ґрунту" },
      ],
    },
  },
  {
    id: "year-5",
    title: "Рік 5: екологічна катастрофа",
    image: "/year5-field.webp",
    chem: {
      name: "Хімія",
      rows: [
        { num: "18.6 тис грн", label: "витрати/га" },
        { num: "-22%", label: "врожайність" },
        { num: "Деградований", label: "стан ґрунту" },
      ],
    },
    bio: {
      name: "Біозахист",
      rows: [
        { num: "6.2 тис грн", label: "витрати/га" },
        { num: "24%", label: "врожайність" },
        { num: "Здоровий", label: "стан ґрунту" },
      ],
    },
  },
];

const TAB_CONTENT: Record<TabKey, { title: string; text: React.ReactNode }> = {
  bt: {
    title: "Біологічний інсектицид №1 у світі",
    text: (
      <>
        Природна бактерія, яка знищує шкідників зсередини – личинки совки,
        молі та листокрутки перестають живитися протягом кількох годин
        після контакту. Діє точково: вражає тільки цільових шкідників,
        не чіпає бджіл, сонечок та інших корисних комах. <br />
        Повністю розкладається в ґрунті без токсичних залишків.
      </>
    ),
  },
  trichoderma: {
    title: "Гриб-антагоніст для захисту ґрунту",
    text: (
      <>
        Trichoderma пригнічує патогенні гриби (фузаріум, пітіум, ризоктонію)
        й одночасно стимулює ріст коренів. Виділяє ферменти, що розкладають
        органіку та підвищують доступність елементів живлення.
      </>
    ),
  },
  azot: {
    title: "Азот без витрат на хімію",
    text: (
      <>
        Бульбочкові й вільноживучі бактерії перетворюють атмосферний азот
        на доступну для рослин форму. Економить до 30% дози мінеральних
        добрив без втрати врожайності.
      </>
    ),
  },
  humat: {
    title: "Активатор ґрунту та антистресант",
    text: (
      <>
        Гумати посилюють кореневу систему, поліпшують структуру ґрунту,
        зв'язують важкі метали. Працюють як «активатор» для решти
        біопрепаратів у баковій суміші.
      </>
    ),
  },
};

const STEPS = [
  {
    n: "01. Оберіть препарат",
    d: `Визначте задачу – захист від шкідників, живлення чи стимуляція.\nПідберіть препарат під вашу культуру та фазу вегетації.\nАбо залиште це нашому спеціалісту – безкоштовна консультація за 15 хвилин.`,
    img: "/step-1-tablet.webp",
  },
  {
    n: "02. Підготуйте розчин",
    d: `Розведіть препарат у воді згідно з таблицею дозування. Стандартний бак, стандартна вода, без спеціальних умов.\nБільшість біопрепаратів можна змішувати в одному баку з добривами та навіть хімічними засобами.`,
    img: "/step-2-pour.webp",
  },
  {
    n: "03. Обробіть поле",
    d: `Обприскування тим самим обладнанням, що вже стоїть у вас на базі.\nОптимальний час – ранок або вечір, без прямого сонця.\nБіоагенти починають діяти в перші години після нанесення.`,
    img: "/step-3-spray.webp",
  },
  {
    n: "04. Збирайте результат",
    d: `Здоровий ґрунт, чистий врожай без залишків пестицидів, відповідність нормам ЄС. З кожним сезоном ефективність зростає – мікрофлора ґрунту відновлюється та працює на вас.`,
    img: "/step-4-harvest.webp",
  },
];

const FEATURES = [
  {
    title: "100% органічно",
    desc: "Натуральні інгредієнти для сталого\nсільського господарства",
    icon: "leaf",
  },
  {
    title: "Легке застосування",
    desc: "Водорозчинні формули\nдля зручного використання",
    icon: "drop",
  },
  {
    title: "Всі сезони",
    desc: "Ефективний на різних стадіях росту",
    icon: "calendar",
  },
] as const;

const WHY_CARDS = [
  {
    title: "Ефективність",
    desc: "85-92% проти основних шкідників. Біоагенти діють точково - знищують ціль, а не все живе на полі. І головне: шкідники не виробляють резистентність, на відміну від хімії, де кожен сезон потрібна нова діюча речовина.",
  },
  {
    title: "Ціна",
    desc: "Менше обробок за сезон - менша вартість на гектар. Біопрепарати не потребують додаткових витрат на відновлення ґрунту, детоксикацію та повторні обробки через резистентність. Порахуйте повний цикл - різниця на вашому боці.",
  },
  {
    title: "Застосування",
    desc: "Той самий обприскувач, та сама техніка, ті ж фази обробки. Змінюється тільки те, що ви заливаєте в бак. Більшість біопрепаратів сумісні з хімічними схемами захисту - можна інтегрувати поступово, без різких змін.",
  },
];

/* ===== Icons ===== */
const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MinusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const ArrowRight: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
const LeafIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.5c1 1.5 1 5-2 7.5C16 5.5 11 4.5 11 4.5s-1 5 2.5 6c0 0 1 4-2.5 6.5s-1.5 3-1.5 3z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
);
const DropIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
const CalendarIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const PhoneIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.71 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.71A2 2 0 0 1 22 16.92z" />
  </svg>
);
const ClockIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Cultures: React.FC = () => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [openCultureId, setOpenCultureId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabKey>("bt");
  const [loadingCultures, setLoadingCultures] = useState(true);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // refs for parallax effect on the "Choose culture" section bg
  const chooseSectionRef = React.useRef<HTMLElement>(null);
  const chooseBgRef = React.useRef<HTMLImageElement>(null);
  // ref for the comparison section — scroll-lock pagination
  const calcSectionRef = React.useRef<HTMLElement>(null);
  // ref to current active slide index (for wheel handler closure)
  const activeSlideRef = React.useRef<number>(0);
  React.useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await listCulturesPublic();
        if (!mounted) return;
        setCultures(list);
        // Open the one marked as default, or the first
        const def = list.find((c) => c.is_default_open) || list[0];
        if (def) setOpenCultureId(def.id);
      } catch (e) {
        // silent failure — page still renders other sections
        if (mounted) setCultures([]);
      } finally {
        if (mounted) setLoadingCultures(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // === Parallax effect ===
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = chooseSectionRef.current;
      const bg = chooseBgRef.current;
      if (!section || !bg) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // distance from viewport center to section center (positive when section is below viewport)
      const dist = rect.top + rect.height / 2 - vh / 2;
      // move bg slower than scroll
      const offset = -dist * 0.18;
      bg.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const toggleCulture = (id: string) =>
    setOpenCultureId((prev) => (prev === id ? "" : id));

  // === Scroll-lock slider — wheel inside the calc section paginates slides ===
  useEffect(() => {
    const section = calcSectionRef.current;
    if (!section) return;

    let lock = false;     // throttle between slide changes
    let unlockTimer: number | null = null;

    const onWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Only intercept when the section roughly fills the viewport
      const isFullyVisible = rect.top <= 8 && rect.bottom >= vh - 8;
      if (!isFullyVisible) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const cur = activeSlideRef.current;
      const last = COMPARE_SLIDES.length - 1;

      // If at first slide and scrolling up — let page scroll up
      if (direction < 0 && cur === 0) return;
      // If at last slide and scrolling down — let page scroll down
      if (direction > 0 && cur === last) return;

      // Otherwise lock page scroll and paginate slides
      e.preventDefault();
      if (lock) return;
      lock = true;

      const next = Math.min(last, Math.max(0, cur + direction));
      setActiveSlide(next);

      if (unlockTimer) window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        lock = false;
      }, 750);
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      section.removeEventListener("wheel", onWheel as any);
      if (unlockTimer) window.clearTimeout(unlockTimer);
    };
  }, []);

  const featureIcon = (name: string) => {
    if (name === "leaf") return <LeafIcon />;
    if (name === "drop") return <DropIcon />;
    return <CalendarIcon />;
  };

  return (
    <div className={styles.page} data-testid="cultures-page">
      <Seo
        title="Культури — Біорішення для зернових, бобових та технічних"
        description="Знайдіть оптимальне біорішення для своєї культури: пшениця, кукурудза, соя, соняшник, ріпак та інші. Bacillus thuringiensis, Trichoderma, азотфіксуючі бактерії."
        canonical="/cultures"
      />
      <Navbar1 device="Desktop" state="Default" size="20" size1="20" size2="16" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero} data-testid="cultures-hero">
        <img decoding="async" className={styles.heroImg} src="/image@2x.webp" alt="" loading="eager" />
        <div className={styles.heroOverlay} />
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Головна</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>Культури</span>
        </div>
        <h1 className={styles.heroHeadline}>
          <span className={styles.heroLine1}>Ефективні рішення:</span>
          <span className={styles.heroLine2}>від поля до саду</span>
        </h1>
      </section>

      {/* ============ 2. CHOOSE CULTURE ============ */}
      <section
        className={styles.chooseSection}
        data-testid="cultures-choose"
        ref={chooseSectionRef}
      >
        <img loading="lazy" decoding="async"
          className={styles.chooseBg}
          src="/41-2@2x.png"
          alt=""
          ref={chooseBgRef}
        />

        <div className={styles.chooseHead}>
          <h2 className={styles.chooseTitle} data-testid="cultures-choose-title">
            <span className={styles.chooseTitleGrey}>Знайдіть рішення</span>
            <span className={styles.chooseTitleBold}>для вашої культури</span>
          </h2>

          <div className={styles.chooseHintRow}>
            <p className={styles.chooseHint}>
              <b>Оберіть культуру</b>
              <span> - ми покажемо перевірені препарати та схеми застосування</span>
            </p>
          </div>
        </div>

        <div className={styles.cardGroup} data-testid="cultures-cards">
          {loadingCultures ? (
            <div className={styles.cardsLoading}>Завантаження культур…</div>
          ) : cultures.length === 0 ? (
            <div className={styles.cardsEmpty}>
              Поки немає жодної культури. Додайте їх через адмінку.
            </div>
          ) : (
            cultures.map((c) => {
              const isOpen = openCultureId === c.id;
              return (
                <div
                  className={isOpen ? styles.cardOpen : styles.cardClosed}
                  data-testid={`culture-${c.slug}`}
                  key={c.id}
                >
                  <div className={styles.cardHead}>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => toggleCulture(c.id)}
                      aria-label={isOpen ? "Закрити" : "Відкрити"}
                      data-testid={`toggle-${c.slug}`}
                    >
                      {isOpen ? <MinusIcon /> : <PlusIcon />}
                    </button>
                  </div>

                  {isOpen && (
                    <>
                      <div className={styles.cardDivider} />
                      <div className={styles.cardBody}>
                        <div className={styles.cardLeftCol}>
                          {c.problem_text && (
                            <div className={styles.problemText}>{c.problem_text}</div>
                          )}

                          <div className={styles.cardTwoColInner}>
                            {c.treatment_types.length > 0 && (
                              <div className={styles.typeRow}>
                                <div className={styles.label}>Типи препаратів:</div>
                                <div className={styles.chipsRow}>
                                  {c.treatment_types.map((t) => (
                                    <span className={styles.chip} key={t}>
                                      <span className={styles.dot} />
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {c.effective_for.length > 0 && (
                              <div className={styles.efRow}>
                                <div className={styles.label}>Ефективно для:</div>
                                <div className={styles.tagRow}>
                                  {c.effective_for.map((x) => (
                                    <span className={styles.tag} key={x}>
                                      {x}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <Link
                            to={c.catalog_url || "/catalog"}
                            className={styles.viewLineBtn}
                            data-testid={`view-line-${c.slug}`}
                          >
                            {c.button_label || "Переглянути лінійку"} <ArrowRight />
                          </Link>
                        </div>

                        {c.image_url && (
                          <div className={styles.cardRightImage}>
                            <img loading="lazy" decoding="async"
                              className={styles.cardImg}
                              src={c.image_url}
                              alt={c.image_alt || c.title}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ============ 3 + 4. CALC SECTION (1920×1463) ============
           Top 524px : cream bg, two-row heading
           Bottom 939: green field image with title + 2 metric cards + dots
           ============================================================ */}
      <section
        className={styles.calcSection}
        data-testid="cultures-calc-section"
        ref={calcSectionRef}
      >
        {/* ----- TOP : heading 524px ----- */}
        <div className={styles.calcTop}>
          <h2
            className={styles.calcHeading}
            data-testid="cultures-counter-heading"
          >
            <span className={styles.calcLineBold}>Порахуйте вигоду</span>
            <span className={styles.calcLineLight}>переходу на біозахист</span>
          </h2>
        </div>

        {/* ----- BOTTOM : slider 1920×939 ----- */}
        <div className={styles.calcSlider} data-testid="cultures-slider">
          {/* Slides stack — each slide absolute-positioned, animated via opacity */}
          {COMPARE_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlide;
            return (
              <div
                key={slide.id}
                className={`${styles.calcSlide} ${isActive ? styles.calcSlideActive : ""}`}
                data-testid={`slide-${slide.id}`}
                aria-hidden={!isActive}
              >
                <img loading="lazy" decoding="async"
                  className={styles.sliderBg}
                  src={slide.image}
                  alt={slide.title}
                />
                <div className={styles.sliderOverlay} />

                <h3 className={styles.slideTitle}>
                  {slide.title.toUpperCase()}
                </h3>

                <div className={styles.metricCardsRow}>
                  <div className={styles.metricCard} data-testid={`metric-card-chem-${idx}`}>
                    <span className={styles.metricCardLabel}>{slide.chem.name}</span>
                    {slide.chem.rows.map((r) => (
                      <div className={styles.metricStat} key={`${slide.id}-c-${r.label}`}>
                        <span className={styles.metricNum}>{r.num}</span>
                        <span className={styles.metricSub}>{r.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.metricCard} data-testid={`metric-card-bio-${idx}`}>
                    <span className={styles.metricCardLabel}>{slide.bio.name}</span>
                    {slide.bio.rows.map((r) => (
                      <div className={styles.metricStat} key={`${slide.id}-b-${r.label}`}>
                        <span className={styles.metricNum}>{r.num}</span>
                        <span className={styles.metricSub}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dots — shared across slides */}
          <div className={styles.sliderDots} role="tablist" aria-label="Слайдер порівняння років">
            {COMPARE_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`${styles.sliderDot} ${idx === activeSlide ? styles.sliderDotActive : ""}`}
                aria-label={`Слайд ${idx + 1}: ${slide.title}`}
                aria-selected={idx === activeSlide}
                role="tab"
                onClick={() => setActiveSlide(idx)}
                data-testid={`slider-dot-${idx}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. WHY CHOOSE BIO (1920×1843) ============ */}
      <section className={styles.whyWrap} data-testid="cultures-why">
        <img loading="lazy" decoding="async" className={styles.whyVectorBg} src="/why-plant-vector.png" alt="" />

        <h2 className={styles.whyHeading}>
          <span className={styles.whyHeadCream}>Чому агрономи</span>{" "}
          <span className={styles.whyHeadGrey}>переходять на біопрепарати</span>
        </h2>

        <div className={styles.whyGrid}>
          {/* Top-left : lead paragraphs (NOT a card) */}
          <div className={styles.whyLead} data-testid="why-lead">
            <p className={styles.leadPara}>
              Продукція без залишків пестицидів{" "}
              <span className={styles.leadAccent}>відповідає нормам ЄС</span>{" "}
              та відкриває{" "}
              <span className={styles.leadAccent}>преміальні ринки збуту.</span>
            </p>
            <p className={styles.leadPara}>
              Чистий врожай ={" "}
              <span className={styles.leadAccent}>вища ціна закупки.</span>
            </p>
            <p className={styles.leadPara}>
              Біопідхід - не компроміс, а конкурентна перевага.
            </p>
          </div>

          {/* Top-right : Ефективність */}
          <div className={styles.whyCard} data-testid="why-card-efektyvnist">
            <h3 className={styles.whyCardTitle}>{WHY_CARDS[0].title}</h3>
            <p className={styles.whyCardText}>{WHY_CARDS[0].desc}</p>
          </div>

          {/* Bottom-left : Ціна */}
          <div className={styles.whyCard} data-testid="why-card-cina">
            <h3 className={styles.whyCardTitle}>{WHY_CARDS[1].title}</h3>
            <p className={styles.whyCardText}>{WHY_CARDS[1].desc}</p>
          </div>

          {/* Bottom-right : Застосування */}
          <div className={styles.whyCard} data-testid="why-card-zastosuvannya">
            <h3 className={styles.whyCardTitle}>{WHY_CARDS[2].title}</h3>
            <p className={styles.whyCardText}>{WHY_CARDS[2].desc}</p>
          </div>
        </div>
      </section>

      {/* ============ 6. INSIDE TABS ============ */}
      <section className={styles.insideWrap} data-testid="cultures-inside">
        <div className={styles.inside}>
          <div className={styles.insideLeft}>
            <h2 className={styles.insideTitle}>
              Зазирни
              <br />
              <span className={styles.italic}>всередину</span>
            </h2>
            <div className={styles.tabsGroup}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`${styles.tab} ${activeTab === t.key ? "" : styles.tabInactive}`}
                  onClick={() => setActiveTab(t.key)}
                  data-testid={`tab-${t.key}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className={styles.insideTextBlock}>
              <h3 className={styles.insideH2}>{TAB_CONTENT[activeTab].title}</h3>
              <div className={styles.insideDesc}>{TAB_CONTENT[activeTab].text}</div>
            </div>
          </div>

          <div className={styles.insideRight}>
            <img loading="lazy" decoding="async"
              className={styles.insideRightImg}
              src="/inside-bacillus.webp"
              alt={TABS.find((t) => t.key === activeTab)?.label || ""}
            />
          </div>
        </div>
      </section>

      {/* ============ 7. HOW IT WORKS ============ */}
      <section className={styles.howWrap} data-testid="cultures-how">
        <div className={styles.how}>
          <h2 className={styles.howTitle}>
            Як працюють{" "}
            <span className={styles.italic}>біопрепарати?</span>
          </h2>

          <div className={styles.timeline}>
            <div className={styles.tlLine} />
            <div className={styles.tlDot} />
          </div>

          <div className={styles.stepsList}>
            {STEPS.map((s) => (
              <div className={styles.stepRow} key={s.n}>
                <div className={styles.stepText}>
                  <h3 className={styles.stepTitle}>{s.n}</h3>
                  <p className={styles.stepDesc}>{s.d}</p>
                </div>
                <img decoding="async" className={styles.stepImg} src={s.img} alt={s.n} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. ICON FEATURES ============ */}
      <section className={styles.iconsWrap} data-testid="cultures-features">
        <div className={styles.iconsRow}>
          <div className={styles.iconCol}>
            <div className={styles.iconCircle}><img loading="lazy" decoding="async" src="/feature-leaf.png" alt="" /></div>
            <div className={styles.ftTextContent}>
              <h3 className={styles.iconColTitle}>100% органічно</h3>
              <div className={styles.iconColDesc}>Натуральні інгредієнти для сталого<br />сільського господарства</div>
            </div>
          </div>
          <div className={styles.iconCol}>
            <div className={styles.iconCircle}><img loading="lazy" decoding="async" src="/feature-drop.png" alt="" /></div>
            <div className={styles.ftTextContent}>
              <h3 className={styles.iconColTitle}>Легке застосування</h3>
              <div className={styles.iconColDesc}>Водорозчинні формули<br />для зручного використання</div>
            </div>
          </div>
          <div className={styles.iconCol}>
            <div className={styles.iconCircle}><img loading="lazy" decoding="async" src="/feature-calendar.png" alt="" /></div>
            <div className={styles.ftTextContent}>
              <h3 className={styles.iconColTitle}>Всі сезони</h3>
              <div className={styles.iconColDesc}>Ефективний на різних стадіях росту</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 9. CONSULTATION (exact design positions) ============ */}
      <section className={styles.consultWrap} data-testid="cultures-consult">
        {/* Background image: bottom half, behind everything */}
        <img loading="lazy" decoding="async" className={styles.consultImage} src="/image1@2x.webp" alt="" />
        <div className={styles.consultGradient} />

        {/* Heading: top 86, left 120 */}
        <h2 className={styles.consultHeading}>
          Не знайшли{" "}
          <span className={styles.italic}>вашу культуру?</span>
        </h2>

        {/* Text "Опишіть культуру..." — top 264, left 120, width 824 */}
        <div className={styles.consultText}>
          Опишіть культуру та задачу - ми підготуємо безкоштовно{" "}
          <b>індивідуальну схему біозахисту</b> з розрахунком витрат на ваші угіддя
        </div>

        {/* Button — top 264, left 963 */}
        <button className={styles.consultBtn} data-testid="consult-btn">
          <PhoneIcon size={24} />
          Отримати консультацію
        </button>

        {/* Phone — top 360, left 1108 */}
        <div className={styles.consultPhone}>+380 (50) 937-56-57</div>

        {/* 24 год card — top 614, left 120, 494x176 */}
        <div className={styles.cart24}>
          <span className={styles.ico}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M3.33 20C3.33 10.795 10.795 3.33 20 3.33C29.205 3.33 36.67 10.795 36.67 20C36.67 29.205 29.205 36.67 20 36.67C10.795 36.67 3.33 29.205 3.33 20Z" stroke="#F9F7F2" strokeWidth="1.67" strokeLinecap="square"/>
              <path d="M20 10.83V20L25 25" stroke="#F9F7F2" strokeWidth="1.67" strokeLinecap="square"/>
            </svg>
          </span>
          <div>
            <div className={styles.label}>24 год</div>
            <span className={styles.body}>Середній час відповіді нашого консультанта</span>
          </div>
        </div>
      </section>

      <Footer1 device="Desktop" />
    </div>
  );
};

export default Cultures;
