import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Navbar1 from "../components/figma/navbar1";
import Footer1 from "../components/figma/footer1";
import CardBlog1 from "../components/welcome/card-blog1";
import InlineContactForm from "../components/blog/InlineContactForm";
import { useEmailModal } from "../context/EmailModalContext";
import { useCallbackModal } from "../context/CallbackContext";
import { getPost, getRelated, type BlogPost } from "../lib/blog-api";
import styles from "./blog-post.module.css";

/* =====================================================================
   /blog/:slug — Сторінка окремої статті.
   Містить hero (фото + meta: категорія / дата / час на прочитання),
   вміст (дано як HTML з редактора), теги, рекомендовані статті та
   блок зв'язку внизу.
   ===================================================================== */

function formatDateLong(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const months = [
      "січня", "лютого", "березня", "квітня",
      "травня", "червня", "липня", "серпня",
      "вересня", "жовтня", "листопада", "грудня",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

function formatDateShort(iso?: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const months = [
      "Січень", "Лютий", "Березень", "Квітень",
      "Травень", "Червень", "Липень", "Серпень",
      "Вересень", "Жовтень", "Листопад", "Грудень",
    ];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return "";
  }
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openEmailModal } = useEmailModal();
  const { openModal: openCallback } = useCallbackModal();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPost(null);
    setRelated([]);
    Promise.all([getPost(slug), getRelated(slug, 3)])
      .then(([p, r]) => {
        if (cancelled) return;
        setPost(p);
        setRelated(r.items);
        // Scroll to top on slug change
        window.scrollTo(0, 0);
      })
      .catch((e) => {
        if (cancelled) return;
        const code = e?.response?.status;
        if (code === 404) setError("Статтю не знайдено.");
        else setError(e?.response?.data?.detail || "Не вдалося завантажити статтю");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const tags = useMemo(() => post?.tags || [], [post]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar1 device="Desktop" state="Default" size="20" size1="20" size2="16" />
        <main className={styles.main}>
          <div className={styles.inner}>
            <p className={styles.loading}>Завантаження статті…</p>
          </div>
        </main>
        <Footer1 device="Desktop" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.page}>
        <Navbar1 device="Desktop" state="Default" size="20" size1="20" size2="16" />
        <main className={styles.main}>
          <div className={styles.inner}>
            <div className={styles.errorBox}>
              <h1 className={styles.errorTitle}>Ой, щось не так</h1>
              <p className={styles.errorText}>{error || "Стаття недоступна."}</p>
              <Link to="/blog" className={styles.errorBtn}>« Назад до блогу</Link>
            </div>
          </div>
        </main>
        <Footer1 device="Desktop" />
      </div>
    );
  }

  const coverImg = post.cover_image || "/Image-Container@2x.webp";

  return (
    <div className={styles.page} data-testid="blog-post-page">
      <Seo
        title={post.seo_title || `${post.title} — TAMIS АГРО`}
        description={post.seo_description || post.excerpt}
        canonical={`/blog/${post.slug}`}
        image={coverImg.startsWith("http") ? coverImg : coverImg}
      />

      <Navbar1 device="Desktop" state="Default" size="20" size1="20" size2="16" />

      <main className={styles.main}>
        <div className={styles.inner}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link to="/" className={styles.bcLink}>Головна</Link>
            <span className={styles.bcSep}>/</span>
            <Link to="/blog" className={styles.bcLink}>Блог</Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcCurrent}>{post.title}</span>
          </nav>

          {/* Hero meta */}
          <header className={styles.hero}>
            <div className={styles.metaRow}>
              <button
                type="button"
                className={styles.metaCategory}
                onClick={() => navigate(`/blog?category=${encodeURIComponent(post.category)}`)}
                data-testid="post-category"
              >
                {post.category}
              </button>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M3 9h18M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                {formatDateLong(post.published_at)}
              </span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaItem} data-testid="post-reading-minutes">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {post.reading_minutes} хв на прочитання
              </span>
              {post.views > 0 && (
                <>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                    {post.views} переглядів
                  </span>
                </>
              )}
            </div>
            <h1 className={styles.title} data-testid="post-title">{post.title}</h1>
            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          </header>

          {/* Cover image */}
          <figure className={styles.coverWrap}>
            <img
              className={styles.cover}
              src={coverImg}
              alt={post.cover_alt || post.title}
              width={1280}
              height={720}
            />
          </figure>

          {/* Article content */}
          <article
            className={styles.content}
            data-testid="post-content"
            dangerouslySetInnerHTML={{ __html: post.content_html || "<p>Вміст статті буде додано невдовзі.</p>" }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className={styles.tagsRow} data-testid="post-tags">
              <span className={styles.tagsLabel}>Теми:</span>
              {tags.map((t) => (
                <Link
                  key={t}
                  to={`/blog?tag=${encodeURIComponent(t)}`}
                  className={styles.tagChip}
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}

          {/* CTA / Contact block */}
          <section className={styles.ctaBlock} data-testid="post-cta">
            <div className={styles.ctaLeft}>
              <h2 className={styles.ctaTitle}>Потрібна консультація агронома?</h2>
              <p className={styles.ctaText}>
                Напишіть нам питання про біопрепарати, дозування або керування полем — наш
                агроном відповість протягом одного робочого дня.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <button
                type="button"
                className={styles.ctaPrimary}
                onClick={() =>
                  openEmailModal({
                    defaultSubject: `Питання до статті: ${post.title}`,
                  })
                }
                data-testid="post-cta-email"
              >
                Написати на пошту
              </button>
              <button
                type="button"
                className={styles.ctaSecondary}
                onClick={() => openCallback()}
                data-testid="post-cta-callback"
              >
                Замовити дзвінок
              </button>
            </div>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className={styles.related} data-testid="post-related">
              <h2 className={styles.relatedTitle}>Читайте також</h2>
              <div className={styles.relatedGrid}>
                {related.map((r) => (
                  <CardBlog1
                    key={r.id}
                    slug={r.slug}
                    image={r.cover_image || "/Image-Container@2x.webp"}
                    title={r.title}
                    description={r.excerpt}
                    category={r.category}
                    readingMinutes={r.reading_minutes}
                    date={formatDateShort(r.published_at)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Inline contact form */}
          <InlineContactForm defaultSubject={`Питання до статті: ${post.title}`} />
        </div>
      </main>

      <Footer1 device="Desktop" />
    </div>
  );
};

export default BlogPostPage;
