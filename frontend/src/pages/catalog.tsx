import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Document2 from "../components/figma/document2";
import CtaSection1 from "../components/figma/cta-section1";
import Footer1 from "../components/figma/footer1";
import { useCart } from "../context/CartContext";
import { useCallbackModal } from "../context/CallbackContext";
import {
  listProducts,
  listPublicCategories,
  pickProductCover,
  type Product,
  type ProductCategory,
} from "../lib/products-api";
import styles from "./catalog.module.css";

/* =================================================================
   /catalog — fed by /api/products. Filter taxonomy comes from
   /api/products/categories (admin-configurable).
   ================================================================= */

const STOCK_OPTIONS = [
  { id: "all", label: "Усі" },
  { id: "in",  label: "На складі" },
  { id: "pre", label: "Попереднє замовлення" },
] as const;

const SORT_OPTIONS = [
  { id: "rec",  label: "рекомендовані" },
  { id: "asc",  label: "Від дешевих до дорогих" },
  { id: "desc", label: "Від дорогих до дешевих" },
  { id: "new",  label: "Новинки" },
  { id: "az",   label: "За назвою А-Я" },
] as const;

/* ================== Icons ================== */
const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease" }}>
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#2C2C27" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="6" stroke="#93928C" strokeWidth="1.6" />
    <path d="M14 14L17 17" stroke="#93928C" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const JerryIcon: React.FC = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
    <path d="M3 2H6V3" stroke="#2C2C27" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 2.4L9.5 1.2" stroke="#2C2C27" strokeWidth="1.1" strokeLinecap="round"/>
    <rect x="2" y="3" width="7.5" height="9.5" rx="0.8" stroke="#2C2C27" strokeWidth="1.1"/>
    <rect x="4" y="6.5" width="3.5" height="3.5" stroke="#2C2C27" strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);

const DropIcon: React.FC = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
    <path d="M5.5 1.2C5.5 1.2 1.5 5.6 1.5 8.8C1.5 11 3.3 12.8 5.5 12.8C7.7 12.8 9.5 11 9.5 8.8C9.5 5.6 5.5 1.2 5.5 1.2Z"
      stroke="#2C2C27" strokeWidth="1.1" strokeLinejoin="round"/>
  </svg>
);

const DropTagIcon: React.FC = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
    <path d="M5.5 1.2C5.5 1.2 1.5 5.6 1.5 8.8C1.5 11 3.3 12.8 5.5 12.8C7.7 12.8 9.5 11 9.5 8.8C9.5 5.6 5.5 1.2 5.5 1.2Z"
      stroke="#ACB14F" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
);

const CartGlyph: React.FC = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" aria-hidden="true">
    <path d="M3 4H5L6.6 12.5C6.7 13 7.1 13.3 7.6 13.3H15C15.5 13.3 15.9 13 16 12.5L17.5 6.5H6.2"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9"  cy="16.5" r="1.2" fill="currentColor"/>
    <circle cx="15" cy="16.5" r="1.2" fill="currentColor"/>
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3.5 5.5C3.5 4.4 4.4 3.5 5.5 3.5h1.7c.5 0 .9.3 1 .8l.6 2.4c.1.4-.1.8-.4 1l-1.3 1c.9 2 2.6 3.7 4.6 4.6l1-1.3c.2-.3.6-.5 1-.4l2.4.6c.5.1.8.5.8 1V14c0 1.1-.9 2-2 2C9.2 16 4 10.8 4 4.5c0-.4 0-.6 0-1Z"
      stroke="#1B4332" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Star: React.FC<{ fill?: number; gradId: string }> = ({ fill = 100, gradId }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
        <stop offset={`${fill}%`} stopColor="#ACB14F" />
        <stop offset={`${fill}%`} stopColor="#E7EBE7" />
      </linearGradient>
    </defs>
    <path
      d="M8 1.5L9.85 5.4L14.2 6.04L11.1 9.05L11.84 13.34L8 11.32L4.16 13.34L4.9 9.05L1.8 6.04L6.15 5.4L8 1.5Z"
      fill={`url(#${gradId})`}
    />
  </svg>
);

const StarRow: React.FC<{ rating: number; ariaId: string }> = ({ rating, ariaId }) => {
  const r = Math.max(0, Math.min(5, rating));
  return (
    <div className={styles.stars} aria-label={`Рейтинг ${r.toFixed(1)} з 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const v = Math.max(0, Math.min(1, r - i));
        return <Star key={i} fill={Math.round(v * 100)} gradId={`${ariaId}-${i}`} />;
      })}
    </div>
  );
};

/* ================== Card ================== */
const CatalogCard: React.FC<{ p: Product; onAdd: () => void }> = ({ p, onAdd }) => (
  <article className={styles.card} data-testid="catalog-card">
    <div className={styles.cardImageWrap}>
      <div className={styles.cardImageBg} aria-hidden="true" />
      <div className={styles.cardTags}>
        {p.is_hit && (
          <div className={styles.tagHit}>
            <DropTagIcon /> <span>Хіт продажу</span>
          </div>
        )}
        {p.is_new && (
          <div className={styles.tagNew}>
            <span>Новинка</span>
          </div>
        )}
        {!p.in_stock && (
          <div className={styles.tagPre}>
            <span>Передзамовлення</span>
          </div>
        )}
      </div>
      <div className={styles.cardPhoto}>
        <img decoding="async" src={pickProductCover(p)} alt={p.name} loading="lazy" width={316} height={307} />
      </div>
    </div>

    <div className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <div className={styles.cardTitleBlock}>
          <div className={styles.rating}>
            <StarRow rating={p.rating} ariaId={`s-${p.id}`} />
            <div className={styles.ratingLabel}>
              {p.rating.toFixed(1)} ({p.reviews})
            </div>
          </div>
          <div className={styles.titleGroup}>
            <Link to={`/product/${p.slug}`} className={styles.cardName}>{p.name}</Link>
            <div className={styles.cardDesc}>{p.short_desc}</div>
          </div>
        </div>
        <div className={styles.specs}>
          <div className={styles.specRow}><JerryIcon /><span>Тара: {p.packing}</span></div>
          <div className={styles.specRow}><DropIcon /><span>Норма: {p.norm}</span></div>
        </div>
      </div>
      <div className={styles.priceRow}>
        <b className={styles.price}>від {p.price} ₴/л</b>
        <button
          type="button"
          className={styles.addBtn}
          onClick={onAdd}
          aria-label={`Додати ${p.name} в кошик`}
          data-testid="catalog-card-add"
        >
          <CartGlyph />
        </button>
      </div>
    </div>
  </article>
);

/* =============================== Page =============================== */
const Catalog: React.FC = () => {
  const { addItem, openCart } = useCart();
  const { openModal: openCallback } = useCallbackModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [stock, setStock] = useState<string>("all");
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState<string>("rec");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [stockOpen, setStockOpen] = useState(false);
  const [page, setPage] = useState<number>(1);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const PAGE_SIZE = 9;
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const sortBoxRef = useRef<HTMLDivElement>(null);

  /* --- Load categories once --- */
  useEffect(() => {
    let cancelled = false;
    listPublicCategories()
      .then((r) => { if (!cancelled) setCategories(r.items); })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, []);

  /* --- Reflect ?q= and ?category= incoming URL params --- */
  useEffect(() => {
    const incomingQ = searchParams.get("q") ?? "";
    if (incomingQ !== query) setQuery(incomingQ);
    const incomingCat = searchParams.get("category") ?? "";
    if (incomingCat) {
      setSelectedCategories(new Set(incomingCat.split(",").filter(Boolean)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* --- Persist query to URL --- */
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (query.trim() === current) return;
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set("q", query.trim()); else next.delete("q");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /* --- Fetch products on every filter change --- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params: any = {
      sort,
      limit: 100,
    };
    if (selectedCategories.size > 0) params.category = Array.from(selectedCategories).join(",");
    if (stock !== "all") params.stock = stock;
    if (query.trim()) params.q = query.trim();
    listProducts(params)
      .then((r) => {
        if (cancelled) return;
        setProducts(r.items);
        setTotal(r.total);
      })
      .catch(() => { if (!cancelled) { setProducts([]); setTotal(0); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedCategories, stock, query, sort]);

  /* close suggestion / sort menus on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (sortBoxRef.current && !sortBoxRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* reset page when narrowing the result set */
  useEffect(() => { setPage(1); }, [selectedCategories, stock, query, sort]);

  /* Suggestions (local from already-loaded products to keep it simple) */
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) || p.short_desc.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, products]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [products, currentPage]
  );

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleAdd = (p: Product) => {
    addItem({
      id: `${p.id}-${p.default_volume}`,
      productId: p.id,
      name: p.name,
      category: p.short_desc,
      volume: p.default_volume,
      price: p.price,
      image: pickProductCover(p),
    });
    openCart();
  };

  const handlePickSuggestion = (p: Product) => {
    setQuery(p.name);
    setSearchOpen(false);
  };

  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.id === sort)?.label ?? SORT_OPTIONS[0].label;

  const highlight = (text: string, q: string): React.ReactNode => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className={styles.suggestionMark}>{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className={styles.catalogPage}>
      <Seo
        title="Каталог біопрепаратів"
        description="Повний каталог біопрепаратів ТАМІС АГРО: біоінокулянти, біофунгіциди, біостимулятори, мікродобрива. Пошук за культурами та категоріями. Безкоштовна доставка по Україні."
        canonical="/catalog"
      />
      <Document2 />

      <section className={styles.catalogSectionWrapper}>
        <div className={styles.catalogSection}>
          <nav className={styles.breadcrumb} aria-label="Хлібні крихти">
            <Link to="/" className={styles.breadcrumbLink}>Головна</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Каталог</span>
          </nav>

          <div className={styles.catalogHeadline}>
            <h1 className={styles.h1}>
              <span className={styles.h1Bold}>Каталог</span>
              <span className={styles.h1Light}>&nbsp;рішень</span>
            </h1>
            <p className={styles.headlineCaption}>
              Комплексні рішення для кожного етапу вегетації: від обробки
              насіння до захисту врожаю у сховищі.
            </p>
          </div>

          <div className={styles.catalogContent}>
            {/* ============ SIDEBAR ============ */}
            <aside className={styles.sidebar}>
              <div className={styles.filterCard}>
                <div className={styles.filterGroup} data-expanded={filtersOpen}>
                  <button
                    type="button"
                    className={styles.filterHeader}
                    onClick={() => setFiltersOpen((v) => !v)}
                    data-testid="catalog-filter-category-toggle"
                  >
                    <span>За категорією</span>
                    <ChevronIcon open={filtersOpen} />
                  </button>
                  {filtersOpen && (
                    <div className={styles.filterOptions}>
                      {categories.map((opt) => (
                        <label key={opt.id} className={styles.optionRow}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selectedCategories.has(opt.slug)}
                            onChange={() => toggleCategory(opt.slug)}
                            data-testid={`filter-cat-${opt.slug}`}
                          />
                          <span className={styles.optionLabel}>{opt.label}</span>
                          <span className={styles.optionCount}>{opt.count ?? 0}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.filterGroup} data-expanded={stockOpen}>
                  <button
                    type="button"
                    className={styles.filterHeader}
                    onClick={() => setStockOpen((v) => !v)}
                    data-testid="catalog-filter-stock-toggle"
                  >
                    <span>За наявністю</span>
                    <ChevronIcon open={stockOpen} />
                  </button>
                  {stockOpen && (
                    <div className={styles.filterOptions}>
                      {STOCK_OPTIONS.map((opt) => (
                        <label key={opt.id} className={styles.optionRow}>
                          <input
                            type="radio"
                            name="stock"
                            className={styles.radio}
                            checked={stock === opt.id}
                            onChange={() => setStock(opt.id)}
                            data-testid={`filter-stock-${opt.id}`}
                          />
                          <span className={styles.optionLabel}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className={styles.sidebarCta}
                data-testid="catalog-sidebar-cta"
                onClick={openCallback}
              >
                <PhoneIcon />
                <span>Замовити дзвінок</span>
              </button>
            </aside>

            {/* ============ MAIN ============ */}
            <div className={styles.catalogMain}>
              <section className={styles.toolbar}>
                <h3 className={styles.toolbarCount}>{total} продуктів</h3>

                <div className={styles.toolbarRight}>
                  <div
                    ref={searchBoxRef}
                    className={styles.searchInput}
                    data-open={searchOpen && suggestions.length > 0 ? "true" : "false"}
                  >
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Пошук продуктів..."
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                      onFocus={() => setSearchOpen(true)}
                      data-testid="catalog-search"
                    />
                    {query && (
                      <button
                        type="button"
                        className={styles.searchClear}
                        onClick={() => { setQuery(""); setSearchOpen(false); }}
                        aria-label="Очистити пошук"
                        data-testid="catalog-search-clear"
                      >
                        ×
                      </button>
                    )}

                    {searchOpen && query.trim().length >= 2 && (
                      <div className={styles.suggestions} role="listbox" data-testid="catalog-search-suggestions">
                        {suggestions.length === 0 ? (
                          <div className={styles.suggestionEmpty}>Нічого не знайдено</div>
                        ) : (
                          suggestions.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className={styles.suggestionItem}
                              onClick={() => handlePickSuggestion(p)}
                              data-testid={`catalog-suggest-${p.id}`}
                            >
                              <img loading="lazy" decoding="async" src={pickProductCover(p)} alt="" width={40} height={40} />
                              <div className={styles.suggestionText}>
                                <div className={styles.suggestionName}>{highlight(p.name, query.trim())}</div>
                                <div className={styles.suggestionDesc}>{highlight(p.short_desc, query.trim())}</div>
                              </div>
                              <div className={styles.suggestionPrice}>від {p.price} ₴/л</div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div ref={sortBoxRef} className={styles.sortWrap}>
                    <button
                      type="button"
                      className={styles.sortBtn}
                      onClick={() => setSortOpen((v) => !v)}
                      data-testid="catalog-sort-toggle"
                    >
                      <span className={styles.sortLabel}>Сортувати:</span>
                      <span className={styles.sortValue}>{activeSortLabel}</span>
                      <ChevronIcon open={sortOpen} />
                    </button>
                    {sortOpen && (
                      <div className={styles.sortMenu} role="menu">
                        {SORT_OPTIONS.map((opt) => (
                          <label key={opt.id} className={styles.optionRow}>
                            <input
                              type="radio"
                              name="sort"
                              className={styles.radio}
                              checked={sort === opt.id}
                              onChange={() => { setSort(opt.id); setSortOpen(false); }}
                              data-testid={`catalog-sort-${opt.id}`}
                            />
                            <span className={styles.optionLabel}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className={styles.cardsGrid} data-testid="catalog-grid">
                {loading ? (
                  <div className={styles.emptyState}>Завантаження…</div>
                ) : pageItems.length === 0 ? (
                  <div className={styles.emptyState}>
                    За обраними фільтрами товарів не знайдено.
                  </div>
                ) : (
                  pageItems.map((p) => (
                    <CatalogCard key={p.id} p={p} onAdd={() => handleAdd(p)} />
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <nav className={styles.pagination} aria-label="Пагінація" data-testid="catalog-pagination">
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Попередня сторінка"
                    data-testid="catalog-page-prev"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <button
                        key={n}
                        type="button"
                        className={[
                          styles.pageBtn,
                          n === currentPage ? styles.pageBtnActive : "",
                        ].join(" ").trim()}
                        onClick={() => setPage(n)}
                        aria-current={n === currentPage ? "page" : undefined}
                        data-testid={`catalog-page-${n}`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Наступна сторінка"
                    data-testid="catalog-page-next"
                  >
                    ›
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>

      <CtaSection1 />
      <Footer1 />
    </div>
  );
};

export default Catalog;
