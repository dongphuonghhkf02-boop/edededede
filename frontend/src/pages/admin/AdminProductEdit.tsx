import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetProduct,
  adminListCategories,
  adminPatchProduct,
  adminUploadProductImage,
  type BulletItem,
  type DescriptionBlock,
  type FeatureChip,
  type Product,
  type ProductCategory,
  type TabBlock,
} from "../../lib/products-api";
import styles from "./AdminProductEdit.module.css";

const EMPTY_TAB = (title: string): TabBlock => ({ title, intro: "", items: [], note: "" });

const EMPTY_DESCRIPTION = (): DescriptionBlock => ({
  hero_image: "/tree.webp",
  title_line1: "Відновлення",
  title_line2: "після стресу.",
  title_subline: "Стабільний врожай.",
  chips: [
    { icon: "lightning", title: "Швидке відновлення",       body: "",  variant: "green" },
    { icon: "eco",       title: "Ідеальний pH-баланс води", body: "",  variant: "dark"  },
    { icon: "drop",      title: "Покращення поглинання",    body: "",  variant: "cream" },
  ],
  problem:  { title: "Проблема", intro_html: "", outro_html: "" },
  solution: { title: "Рішення",  intro_html: "", outro_html: "" },
});

type FormState = {
  name: string;
  slug: string;
  short_desc: string;
  category: string;
  photo: string;
  photos: string[];
  packing: string;
  norm: string;
  default_volume: string;
  price: number;
  in_stock: boolean;
  rating: number;
  reviews: number;
  is_hit: boolean;
  is_new: boolean;
  sort_order: number;
  description_html: string;
  description_image: string;
  description: DescriptionBlock;
  dosage: TabBlock;
  composition: TabBlock;
  compatibility: TabBlock;
  specs: TabBlock;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published";
};

const BASE: FormState = {
  name: "",
  slug: "",
  short_desc: "",
  category: "",
  photo: "",
  photos: [],
  packing: "1, 5, 10 л",
  norm: "",
  default_volume: "5 Л",
  price: 0,
  in_stock: true,
  rating: 4.7,
  reviews: 0,
  is_hit: false,
  is_new: false,
  sort_order: 0,
  description_html: "",
  description_image: "",
  description: EMPTY_DESCRIPTION(),
  dosage: EMPTY_TAB("Дозування"),
  composition: EMPTY_TAB("Склад"),
  compatibility: EMPTY_TAB("Сумісність"),
  specs: EMPTY_TAB("Характеристика"),
  seo_title: "",
  seo_description: "",
  status: "published",
};

const TabEditor: React.FC<{
  block: TabBlock;
  onChange: (next: TabBlock) => void;
  label: string;
}> = ({ block, onChange, label }) => {
  const setField = (key: keyof TabBlock, value: any) => onChange({ ...block, [key]: value });
  const addItem = () => onChange({ ...block, items: [...(block.items || []), { text: "" }] });
  const setItem = (i: number, text: string) => {
    const next = (block.items || []).slice();
    next[i] = { text };
    onChange({ ...block, items: next });
  };
  const removeItem = (i: number) => {
    const next = (block.items || []).filter((_, j) => j !== i);
    onChange({ ...block, items: next });
  };
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = (block.items || []).slice();
    const ni = i + dir;
    if (ni < 0 || ni >= next.length) return;
    [next[i], next[ni]] = [next[ni], next[i]];
    onChange({ ...block, items: next });
  };
  return (
    <div className={styles.tabEditor}>
      <div className={styles.tabEditorHeader}>{label}</div>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Заголовок</span>
        <input className={styles.input} value={block.title || ""} onChange={(e) => setField("title", e.target.value)} />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Вступний абзац (необов'язково)</span>
        <textarea className={styles.textarea} rows={2} value={block.intro || ""} onChange={(e) => setField("intro", e.target.value)} />
      </label>
      <div className={styles.fieldLabel}>Пункти списку (підтримує вбудований HTML — наприклад &lt;b&gt;..&lt;/b&gt;)</div>
      <div className={styles.bullets}>
        {(block.items || []).map((it: BulletItem, i: number) => (
          <div key={i} className={styles.bulletRow}>
            <input
              className={styles.input}
              value={it.text}
              placeholder={`Пункт ${i + 1}`}
              onChange={(e) => setItem(i, e.target.value)}
            />
            <div className={styles.bulletActions}>
              <button type="button" className={styles.miniBtn} onClick={() => moveItem(i, -1)} disabled={i === 0} title="Вище">↑</button>
              <button type="button" className={styles.miniBtn} onClick={() => moveItem(i, +1)} disabled={i === (block.items || []).length - 1} title="Нижче">↓</button>
              <button type="button" className={styles.miniBtnDanger} onClick={() => removeItem(i)} title="Видалити">×</button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.addBulletBtn} onClick={addItem}>+ Додати пункт</button>
      </div>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Примітка під списком (необов'язково)</span>
        <textarea className={styles.textarea} rows={2} value={block.note || ""} onChange={(e) => setField("note", e.target.value)} />
      </label>
    </div>
  );
};

const AdminProductEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const [form, setForm] = useState<FormState>(BASE);
  const [original, setOriginal] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dosage" | "composition" | "compatibility" | "specs">("dosage");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  /* Load categories + product if editing */
  useEffect(() => {
    let cancelled = false;
    adminListCategories()
      .then((r) => { if (!cancelled) setCategories(r.items); })
      .catch(() => {});
    if (!isNew && id) {
      setLoading(true);
      adminGetProduct(id)
        .then((p) => {
          if (cancelled) return;
          setOriginal(p);
          setForm({
            name: p.name || "",
            slug: p.slug || "",
            short_desc: p.short_desc || "",
            category: p.category || "",
            photo: p.photo || "",
            photos: p.photos || [],
            packing: p.packing || "",
            norm: p.norm || "",
            default_volume: p.default_volume || "5 Л",
            price: Number(p.price || 0),
            in_stock: !!p.in_stock,
            rating: Number(p.rating || 4.7),
            reviews: Number(p.reviews || 0),
            is_hit: !!p.is_hit,
            is_new: !!p.is_new,
            sort_order: Number(p.sort_order || 0),
            description_html: p.description_html || "",
            description_image: p.description_image || "",
            dosage: p.dosage || EMPTY_TAB("Дозування"),
            composition: p.composition || EMPTY_TAB("Склад"),
            compatibility: p.compatibility || EMPTY_TAB("Сумісність"),
            specs: p.specs || EMPTY_TAB("Характеристика"),
            seo_title: p.seo_title || "",
            seo_description: p.seo_description || "",
            status: (p.status || "published") as any,
          });
        })
        .catch((e) => { if (!cancelled) setError(e?.response?.data?.detail || "Не вдалося завантажити товар"); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }
    return () => { cancelled = true; };
  }, [id, isNew]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (statusOverride?: "draft" | "published") => {
    if (saving) return;
    if (!form.name.trim()) { setError("Назва обов'язкова"); return; }
    if (!form.category) { setError("Оберіть категорію"); return; }
    setSaving(true);
    setError(null);
    const payload: any = { ...form };
    if (statusOverride) payload.status = statusOverride;
    try {
      let res: Product;
      if (isNew) {
        res = await adminCreateProduct(payload);
        navigate(`/admin/products/${res.id}/edit`, { replace: true });
      } else if (id) {
        res = await adminPatchProduct(id, payload);
      } else { return; }
      setOriginal(res);
      setForm((prev) => ({ ...prev, slug: res.slug }));
      setSavedAt(new Date().toLocaleTimeString("uk-UA"));
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Не вдалося зберегти");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Видалити цей товар?")) return;
    try {
      await adminDeleteProduct(id);
      navigate("/admin/products");
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Не вдалося видалити");
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const r = await adminUploadProductImage(file);
      setForm((prev) => {
        const photos = prev.photos.includes(r.url) ? prev.photos : [...prev.photos, r.url];
        return { ...prev, photos, photo: prev.photo || r.url };
      });
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Не вдалося завантажити фото");
    } finally {
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleUploadDescImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const r = await adminUploadProductImage(file);
      setForm((prev) => ({ ...prev, description_image: r.url }));
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Не вдалося завантажити");
    } finally {
      if (descInputRef.current) descInputRef.current.value = "";
    }
  };

  const removePhoto = (url: string) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p !== url),
      photo: prev.photo === url ? (prev.photos.find((p) => p !== url) || "") : prev.photo,
    }));
  };

  const setCover = (url: string) => setForm((prev) => ({ ...prev, photo: url }));

  const activeTabBlock = useMemo(() => form[activeTab], [form, activeTab]);

  if (loading) return <div className={styles.loading}>Завантаження…</div>;

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <Link to="/admin/products" className={styles.backLink}>← До списку</Link>
        <div className={styles.topActions}>
          {savedAt && <span className={styles.savedAt}>Збережено в {savedAt}</span>}
          {!isNew && (
            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>Видалити</button>
          )}
          <button type="button" className={styles.draftBtn} onClick={() => handleSave("draft")} disabled={saving}>Зберегти чернетку</button>
          <button type="button" className={styles.publishBtn} onClick={() => handleSave("published")} disabled={saving} data-testid="admin-product-save">
            {saving ? "Збереження…" : "Опублікувати"}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {/* ============ LEFT ============ */}
        <div className={styles.colLeft}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Основна інформація</h3>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Назва товару *</span>
              <input className={styles.input} value={form.name} onChange={(e) => setField("name", e.target.value)} data-testid="admin-product-name" />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Короткий опис (під назвою на карточці)</span>
              <input className={styles.input} value={form.short_desc} onChange={(e) => setField("short_desc", e.target.value)} placeholder="наприклад: потужний біоінсектицид широкого спектру" />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Slug (авто — якщо порожнє)</span>
              <input className={styles.input} value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="наприклад: venator" />
            </label>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Опис товару (вкладка «Опис»)</h3>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Зображення для вкладки Опис</span>
              <div className={styles.imageRow}>
                {form.description_image ? (
                  <div className={styles.imagePreview}>
                    <img src={form.description_image} alt="Опис" />
                    <button type="button" className={styles.removeImg} onClick={() => setField("description_image", "")}>×</button>
                  </div>
                ) : null}
                <input ref={descInputRef} type="file" accept="image/*" onChange={handleUploadDescImage} style={{ display: "none" }} id="desc-img" />
                <label htmlFor="desc-img" className={styles.uploadBtn}>+ Завантажити</label>
                <input className={styles.input} placeholder="або URL" value={form.description_image} onChange={(e) => setField("description_image", e.target.value)} />
              </div>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Основний опис (HTML) — відображається як річ текст</span>
              <textarea className={styles.textarea} rows={8} value={form.description_html} onChange={(e) => setField("description_html", e.target.value)} placeholder="&lt;p&gt;&lt;b&gt;Проблема.&lt;/b&gt; ...&lt;/p&gt;&#10;&lt;p&gt;&lt;b&gt;Рішення.&lt;/b&gt; ...&lt;/p&gt;" />
            </label>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Продуктові вкладки</h3>
            <div className={styles.tabBar}>
              {[
                ["dosage", "Дозування"],
                ["composition", "Склад"],
                ["compatibility", "Сумісність"],
                ["specs", "Характеристика"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === key ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab(key as any)}
                >{label}</button>
              ))}
            </div>
            <TabEditor
              block={activeTabBlock}
              onChange={(next) => setField(activeTab, next)}
              label={`Редагування вкладки`}
            />
          </section>
        </div>

        {/* ============ RIGHT ============ */}
        <aside className={styles.colRight}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Публікація</h3>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={form.status === "published"} onChange={(e) => setField("status", e.target.checked ? "published" : "draft")} />
              <span>Опубліковано</span>
            </label>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={form.in_stock} onChange={(e) => setField("in_stock", e.target.checked)} />
              <span>В наявності</span>
            </label>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={form.is_hit} onChange={(e) => setField("is_hit", e.target.checked)} />
              <span>Хіт продажу (HOT)</span>
            </label>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={form.is_new} onChange={(e) => setField("is_new", e.target.checked)} />
              <span>Новинка</span>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Порядок сортування</span>
              <input className={styles.input} type="number" value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value) || 0)} />
            </label>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Ціна і обсяг</h3>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Ціна, ₴/л</span>
                <input className={styles.input} type="number" step="0.01" value={form.price} onChange={(e) => setField("price", Number(e.target.value) || 0)} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Дефолтний обсяг</span>
                <input className={styles.input} value={form.default_volume} onChange={(e) => setField("default_volume", e.target.value)} />
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Тара (наприклад: 1, 5, 10 л)</span>
              <input className={styles.input} value={form.packing} onChange={(e) => setField("packing", e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Норма витрати</span>
              <input className={styles.input} value={form.norm} onChange={(e) => setField("norm", e.target.value)} placeholder="наприклад: 0,5–1,0 л/га" />
            </label>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Категорія</h3>
            <select className={styles.input} value={form.category} onChange={(e) => setField("category", e.target.value)} data-testid="admin-product-category">
              <option value="">— Оберіть категорію —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.label} ({c.slug})</option>
              ))}
            </select>
            <Link to="/admin/product-categories" className={styles.linkSmall}>Налаштувати категорії →</Link>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Фотографії (перше = обкладинка)</h3>
            <div className={styles.gallery}>
              {form.photos.map((p) => (
                <div key={p} className={`${styles.galleryItem} ${form.photo === p ? styles.galleryItemActive : ""}`}>
                  <img src={p} alt="" />
                  <div className={styles.galleryActions}>
                    <button type="button" className={styles.miniBtn} onClick={() => setCover(p)} disabled={form.photo === p}>Обклад.</button>
                    <button type="button" className={styles.miniBtnDanger} onClick={() => removePhoto(p)}>×</button>
                  </div>
                </div>
              ))}
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handleUploadPhoto} style={{ display: "none" }} id="photo-up" />
            <label htmlFor="photo-up" className={styles.uploadBtn} data-testid="admin-product-upload-photo">+ Завантажити фото</label>
            <input className={styles.input} placeholder="або URL фото" value="" onChange={(e) => {
              const v = e.target.value.trim();
              if (v) setForm((prev) => ({ ...prev, photos: [...prev.photos, v], photo: prev.photo || v }));
            }} />
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Рейтинг</h3>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Оцінка</span>
                <input className={styles.input} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setField("rating", Number(e.target.value) || 0)} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Відгуків</span>
                <input className={styles.input} type="number" min="0" value={form.reviews} onChange={(e) => setField("reviews", Number(e.target.value) || 0)} />
              </label>
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>SEO</h3>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>SEO Title</span>
              <input className={styles.input} value={form.seo_title} onChange={(e) => setField("seo_title", e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>SEO Description</span>
              <textarea className={styles.textarea} rows={3} value={form.seo_description} onChange={(e) => setField("seo_description", e.target.value)} />
            </label>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default AdminProductEdit;
