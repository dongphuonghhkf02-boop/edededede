import React, { useState } from "react";
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
import styles from "./frame-component6.module.css";

export type FrameComponent6Type = {
  className?: string;
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

const FrameComponent6: React.FC<FrameComponent6Type> = ({ className = "" }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(1); // 5Л
  const [quantity, setQuantity] = useState(1);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const { addItem, openCart } = useCart();

  const current = PRODUCT_IMAGES[activeImage];
  const selectedVolume = VOLUME_OPTIONS[selectedVolumeIndex];
  const totalPrice = selectedVolume.price * quantity;

  const handleAddToCart = () => {
    addItem({
      id: `flores-${selectedVolume.label}`,
      productId: "flores",
      name: "Антистресант \"ФЛОРЕС\" (FLORES)",
      category: "макро та мікроелементи",
      volume: selectedVolume.label.replace("Л", " Л"),
      price: selectedVolume.price,
      quantity,
      image: PRODUCT_IMAGES[0].main,
    });
    openCart();
  };

  return (
    <section className={[styles.productSectionWrapper, className].join(" ")}>
      <div className={styles.productSection}>
        {/* === BREADCRUMBS ============================================== */}
        <div className={styles.productHeader}>
          <div className={styles.breadcrumb}>Головна/</div>
          <div className={styles.breadcrumb}>Макро та мікроелементи/</div>
          <div className={styles.flores}>
            Антистресант зі стимулюючим ефектом "ФЛОРЕС" (FLORES)
          </div>
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
              {PRODUCT_IMAGES.map((img, i) => (
                <button
                  key={img.thumb}
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
                      <div className={styles.ratingNumber}>4.9 (100)</div>
                    </div>
                  </div>
                  <h1 className={styles.title}>
                    <span>{`Антистресант `}</span>
                    <span className={styles.titleAccent}>
                      зі стимулюючим ефектом "ФЛОРЕС" (FLORES)
                    </span>
                  </h1>
                </div>
                <div className={styles.description}>
                  Удосконалений органічний стимулятор росту для підвищення
                  врожайності сільськогосподарських культур. Cприяє швидкому
                  відновленню біохімічних процесів у рослині.
                </div>
              </section>

              {/* === PARAMETERS CARD 748 × 449 ========================== */}
              <div className={styles.featureGroup}>
                <div className={styles.featureRowParent}>
                  <div className={styles.featureRow}>
                    <div className={styles.featureCell}>
                      <Cube1 size={20} />
                      <div className={styles.featureText}>
                        <div className={styles.featureLabel}>Культури</div>
                        <div className={styles.featureValue}>Всі культури</div>
                      </div>
                    </div>
                    <div className={styles.featureCell}>
                      <Drop1 size={20} dropHeight="20px" dropWidth="20px" />
                      <div className={styles.featureText}>
                        <div className={styles.featureLabel}>Доза</div>
                        <div className={styles.featureValue}>0,5-1,0 л/га</div>
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
                        <div className={styles.featureLabel}>Бактерії роду</div>
                        <div className={styles.featureValue}>Bacillus subtilis</div>
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
                      {VOLUME_OPTIONS.map((item, index) => (
                        <VolumeChip1
                          key={item.label}
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
                  <div className={styles.availabilityStatus}>
                    <div className={styles.availabilityDot} />
                    <div className={styles.availabilityText}>в наявності</div>
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
