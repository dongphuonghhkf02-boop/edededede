import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Tag1 from "./tag1";
import Star1 from "./star1";
import Cube1 from "./cube1";
import Drop1 from "./drop1";
import Temperature1 from "./temperature1";
import Calendar1 from "./calendar1";
import Bacteria1 from "./bacteria1";
import VolumeChip1 from "./volume-chip1";
import Counter1 from "./counter1";
import PrimaryButton1 from "./primary-button1";
import SecondaryButton1 from "./secondary-button1";
import ShieldError1 from "./shield-error1";
import Clock1 from "./clock1";
import { useCart } from "../../context/CartContext";
import { useCallbackModal } from "../../context/CallbackContext";
import type { Product } from "../../lib/products-api";
import styles from "./frame-component6.module.css";

export type FrameComponent6Type = {
  className?: string;
  /**
   * Optional dynamic product fetched from the API.
   * When provided, every visible field on the page is sourced from it.
   * Without it the component falls back to the static demo (ФЛОРЕС).
   */
  product?: Product | null;
};

/* Изображения товара: main = крупное фото, thumb = миниатюра 64x64
   Кликая по миниатюре пользователь переключает крупное фото. */
const PRODUCT_IMAGES = [
  { main: "/Frame-4@3x.webp",   thumb: "/Frame-190@2x.png", alt: "ФЛОРЕС загальний вигляд" },
  { main: "/Frame-1@3x.webp",   thumb: "/Frame-193@2x.png", alt: "ФЛОРЕС лист" },
  { main: "/Frame-190@2x.png", thumb: "/Frame-194@2x.png", alt: "ФЛОРЕС у склянці" },
  { main: "/Frame-193@2x.png", thumb: "/Frame-195@2x.png", alt: "ФЛОРЕС етикетка" },
];

const STAR_ITEMS = Array.from({ length: 5 }, () => ({
  size: 16 as const,
  star: "/Star.svg",
  starHeight: "16px" as const,
  starWidth: "16px" as const,
}));

/* Опции объёма с базовыми ценами (5Л = 2400 ₴ по дефолту) */
const VOLUME_OPTIONS: Array<{ label: string; price: number; perLitre: number }> = [
  { label: "1Л",  price: 480,  perLitre: 480 },
  { label: "5Л",  price: 2400, perLitre: 480 },
  { label: "10Л", price: 4500, perLitre: 450 },
];

const FrameComponent6: React.FC<FrameComponent6Type> = ({ className = "", product = null }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(1); // 5Л
  const [quantity, setQuantity] = useState(1);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const { addItem, openCart } = useCart();
  const { openModal: openCallback } = useCallbackModal();

  /* ===== Derived product fields (real product overrides demo data) ===== */
  const productImages = useMemo(() => {
    if (product) {
      const photos = (product.photos && product.photos.length > 0)
        ? product.photos
        : (product.photo ? [product.photo] : []);
      if (photos.length > 0) {
        return photos.map((src, i) => ({
          main: src,
          thumb: src,
          alt: `${product.name} — фото ${i + 1}`,
        }));
      }
    }
    return PRODUCT_IMAGES;
  }, [product]);

  const volumeOptions = useMemo(() => {
    if (product && product.variants && product.variants.length > 0) {
      return product.variants.map((v) => {
        const label = (v.volume || "").replace(/\s+/g, "");
        const perLitre = Math.round(v.price);
        return { label, price: v.price, perLitre };
      });
    }
    if (product) {
      // Synthesize tiered prices around base "per litre" — 1Л / 5Л / 10Л
      const perL = Math.round(product.price);
      return [
        { label: "1Л",  price: perL,        perLitre: perL },
        { label: "5Л",  price: perL * 5,    perLitre: perL },
        { label: "10Л", price: Math.round(perL * 10 * 0.95), perLitre: Math.round(perL * 0.95) },
      ];
    }
    return VOLUME_OPTIONS;
  }, [product]);

  const current = productImages[Math.min(activeImage, productImages.length - 1)] || productImages[0];
  const selectedVolume = volumeOptions[Math.min(selectedVolumeIndex, volumeOptions.length - 1)] || volumeOptions[0];
  const totalPrice = selectedVolume.price * quantity;

  const title = product ? product.name : `Антистресант зі стимулюючим ефектом "ФЛОРЕС" (FLORES)`;
  const description = product
    ? product.short_desc
    : "Удосконалений органічний стимулятор росту для підвищення врожайності сільськогосподарських культур. Cприяє швидкому відновленню біохімічних процесів у рослині.";
  const breadcrumbCategoryLabel = product ? (product.category || "Каталог") : "Макро та мікроелементи";
  const ratingNumber = product ? product.rating : 4.9;
  const reviews = product ? product.reviews : 100;
  const inStock = product ? product.in_stock : true;
  const productId = product ? product.id : "flores";

  const handleAddToCart = () => {
    addItem({
      id: `${productId}-${selectedVolume.label}`,
      productId,
      name: title,
      category: breadcrumbCategoryLabel,
      volume: selectedVolume.label.replace("Л", " Л"),
      price: selectedVolume.price,
      quantity,
      image: current?.main || PRODUCT_IMAGES[0].main,
    });
    openCart();
  };

  return (
    <section className={[styles.productSectionWrapper, className].join(" ")}>
      <div className={styles.productSection}>
        {/* === BREADCRUMBS ============================================== */}
        <div className={styles.productHeader}>
          <Link to="/" className={styles.breadcrumb}>Головна/</Link>
          <Link to="/catalog" className={styles.breadcrumb}>{breadcrumbCategoryLabel}/</Link>
          <div className={styles.flores}>{title}</div>
        </div>

        {/* === MAIN CONTENT ROW (1680 × 1136) ============================ */}
        <div className={styles.mainContent}>
          {/* === IMAGE GALLERY 828 × 720 ================================ */}
          <div className={styles.image}>
            <img loading="lazy" decoding="async"
              key={current.main}
              className={styles.mainPhoto}
              src={current.main}
              alt={current.alt}
            />
            <div className={styles.thumbStrip}>
              {productImages.map((img, i) => (
                <button
                  key={`${img.thumb}-${i}`}
                  type="button"
                  className={[
                    styles.thumb,
                    i === activeImage ? styles.thumbActive : "",
                  ].join(" ")}
                  onClick={() => setActiveImage(i)}
                  aria-label={"Перегляд " + (i + 1)}
                >
                  <img loading="lazy" decoding="async" src={img.thumb} alt={img.alt} />
                </button>
              ))}
            </div>
          </div>

          {/* === TEXT BLOCK 828 × 1136 ================================== */}
          <div className={styles.textBlock}>
            <div className={styles.textBlockInner}>
              {/* === TOP ROW: tag+rating + title + description ========== */}
              <section className={styles.topRow}>
                <div className={styles.headlineGroup}>
                  <div className={styles.tagParent}>
                    <Tag1
                      prop="Підсилювач росту "
                      showIcon={false}
                      showTag
                      tagBorder="unset"
                      tagHeight="unset"
                      tagPosition="unset"
                      tagTop="unset"
                      tagLeft="unset"
                      tagBackgroundColor="#f7fae8"
                      divFontSize="12px"
                      size="16"
                      showFire={false}
                    />
                    <div className={styles.rating}>
                      <div className={styles.star}>
                        {STAR_ITEMS.map((item, index) => (
                          <Star1
                            key={index}
                            size={item.size}
                            star={item.star}
                            starHeight={item.starHeight}
                            starWidth={item.starWidth}
                          />
                        ))}
                      </div>
                      <div className={styles.ratingNumber}>{ratingNumber.toFixed(1)} ({reviews})</div>
                    </div>
                  </div>
                  <h1 className={styles.title}>
                    <span>{title}</span>
                  </h1>
                </div>
                <div className={styles.description}>{description}</div>
              </section>

              {/* === PARAMETERS CARD 748 × 449 ========================== */}
              <div className={styles.featureGroup}>
                <div className={styles.featureRowParent}>
                  <div className={styles.featureRow}>
                    <div className={styles.featureCell}>
                      <Cube1 size={20} />
                      <div className={styles.featureText}>
                        <div className={styles.featureLabel}>Тара</div>
                        <div className={styles.featureValue}>{product?.packing || "1, 5, 10 л"}</div>
                      </div>
                    </div>
                    <div className={styles.featureCell}>
                      <Drop1 size={20} dropHeight="20px" dropWidth="20px" />
                      <div className={styles.featureText}>
                        <div className={styles.featureLabel}>Норма витрати</div>
                        <div className={styles.featureValue}>{product?.norm || "0,5-1,0 л/га"}</div>
                      </div>
                    </div>
                    <div className={styles.featureCell}>
                      <Temperature1 size={20} />
                      <div className={styles.featureText}>
                        <div className={styles.featureLabel}>Зберігання</div>
                        <div className={styles.featureValue}>15-25°C</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.featureRow}>
                    <div className={styles.featureCell}>
                      <Calendar1 size={20} />
                      <div className={styles.featureText}>
                        <div className={styles.featureLabel}>Період зберігання</div>
                        <div className={styles.featureValue}>2 роки</div>
                      </div>
                    </div>
                    <div className={styles.featureCell}>
                      <Bacteria1 size={20} />
                      <div className={styles.featureText}>
                        <div className={styles.featureLabel}>Категорія</div>
                        <div className={styles.featureValue}>{breadcrumbCategoryLabel}</div>
                      </div>
                    </div>
                    <div className={styles.featureCell} aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* === OPTIONS / PRICE / BUTTONS  748 × 288 ============== */}
              <section className={styles.purchaseBlock}>
                <div className={styles.optionsRow}>
                  <div className={styles.optionsGroup}>
                    <div className={styles.optionsLabel}>Опції об’єму:</div>
                    <div className={styles.volumeChipGroup}>
                      {volumeOptions.map((item, index) => (
                        <VolumeChip1
                          key={`${item.label}-${index}`}
                          state={index === selectedVolumeIndex ? "Active" : "Inactive"}
                          prop={item.label}
                          onClick={() => setSelectedVolumeIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.counterGroup}>
                    <div className={styles.optionsLabel}>Кількість:</div>
                    <Counter1
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={99}
                      size="20"
                      size1="20"
                    />
                  </div>
                </div>

                <div className={styles.priceRow}>
                  <div className={styles.availabilityStatus} data-instock={inStock ? "true" : "false"}>
                    <div className={styles.availabilityDot} style={!inStock ? { background: "#d9534f" } : undefined} />
                    <div className={styles.availabilityText}>{inStock ? "в наявності" : "передзамовлення"}</div>
                  </div>
                  <div className={styles.priceParent}>
                    <h2 className={styles.price}>
                      {totalPrice.toLocaleString("uk-UA")} ₴
                    </h2>
                    <div className={styles.priceUnit}>
                      від {selectedVolume.perLitre} ₴/л
                    </div>
                  </div>
                </div>

                <div className={styles.buttonsRow}>
                  <PrimaryButton1
                    state="Default"
                    type="Filled"
                    prop="Замовити"
                    showCall={false}
                    onClick={handleAddToCart}
                    primaryButtonPadding="0 16px"
                    primaryButtonWidth="unset"
                    primaryButtonHeight="60px"
                    primaryButtonFlex="1"
                    size="24"
                  />
                  <SecondaryButton1
                    state="Default"
                    type="Outline"
                    prop="Зателефонуйте мені"
                    showIcon
                    size="24"
                    onClick={openCallback}
                  />
                </div>
              </section>

              {/* === DELIVERY ROW ====================================== */}
              <section className={styles.deliveryRow}>
                <div className={styles.deliveryHeading}>Безкоштовна Доставка</div>
                <div className={styles.deliveryLogos}>
                  <div className={styles.deliveryPartner}>
                    <img loading="lazy" decoding="async"
                      className={styles.deliveryIcon}
                      width={50}
                      height={50}
                      alt="Нова Пошта"
                      src="/arcticons-nova-post.svg"
                    />
                    <div className={styles.deliveryName}>Нова Пошта</div>
                  </div>
                  <div className={styles.deliveryPartner}>
                    <img loading="lazy" decoding="async"
                      className={styles.deliveryIcon}
                      width={50}
                      height={50}
                      alt="Укр Пошта"
                      src="/arcticons-ukrposhta.svg"
                    />
                    <div className={styles.deliveryName}>Укр Пошта</div>
                  </div>
                </div>
                <div className={styles.deliveryLink}>
                  <button
                    type="button"
                    className={styles.deliveryToggle}
                    onClick={() => setDeliveryOpen((v) => !v)}
                    aria-expanded={deliveryOpen}
                  >
                    <span>{deliveryOpen ? "Згорнути" : "Детальніше про доставку"}</span>
                    <svg
                      className={[
                        styles.deliveryChevron,
                        deliveryOpen ? styles.deliveryChevronOpen : "",
                      ].join(" ")}
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 5.25L7 8.75L10.5 5.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  className={[
                    styles.deliveryDetails,
                    deliveryOpen ? styles.deliveryDetailsOpen : "",
                  ].join(" ")}
                  aria-hidden={!deliveryOpen}
                >
                  <div className={styles.deliveryDetailsInner}>
                    <ul className={styles.deliveryList}>
                      <li>
                        <strong>Нова Пошта</strong> — відділення, поштомати,
                        кур'єрська доставка по Україні. Безкоштовно при замовленні
                        від 1 500 ₴.
                      </li>
                      <li>
                        <strong>Укрпошта</strong> — стандартна та експрес
                        доставка по всім населеним пунктам України.
                      </li>
                      <li>
                        Самовивіз зі складу <strong>м. Київ, вул. Промислова, 12</strong>
                        — доступний у будні з 9:00 до 18:00.
                      </li>
                      <li>
                        Термін формування замовлення — <strong>1 робочий день</strong>,
                        доставка по Україні — <strong>3-5 робочих днів</strong>.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* === STORAGE / DELIVERY TIME =========================== */}
              <section className={styles.storageInfo}>
                <div className={styles.storageRow}>
                  <ShieldError1 size={20} />
                  <div className={styles.storageText}>
                    Зберігається в прохолодному, сухому місці, захищеному від
                    сонячних променів
                  </div>
                </div>
                <div className={styles.storageRow}>
                  <Clock1 size={20} />
                  <div className={styles.storageText}>
                    Доставка протягом 3-5 робочих днів
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent6;
