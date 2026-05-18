import React from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderSearch from "./header-search";
import User1 from "./user1";
import Cart1 from "./cart1";
import PrimaryButton1 from "./primary-button1";
import { useCart } from "../../context/CartContext";
import { useUserDrawer } from "../../context/UserDrawerContext";
import { useCallbackModal } from "../../context/CallbackContext";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import styles from "./navbar1.module.css";

/* =================================================================
   Navbar1
     • Three header icon buttons (round 40×40): search, user, cart
     • User icon now opens the side UserDrawer (slide from right),
       same UX pattern as the cart. Chevron has been removed —
       the icon is the trigger.
     • Old <UserDropdown> dropdown is kept in the codebase as a
       reserve (components/figma/user-dropdown.tsx).
   ================================================================= */

export type Navbar1Type = {
  className?: string;
  size?: any;
  size1?: any;
  size2?: any;

  /** Variant props */
  device?: any;
  state?: any;
};

const Navbar1: React.FC<Navbar1Type> = ({
  className = "",
  device = "Desktop",
  state = "Default",
  size = 20,
}) => {
  const { count, openCart } = useCart();
  const { openUserDrawer } = useUserDrawer();
  const { openModal: openCallback } = useCallbackModal();
  const { isAuthed } = useAuth();
  const { openAuth } = useAuthModal();

  const { pathname } = useLocation();
  // Helper: build classNames for a nav link with hover-underline + active state
  const navLinkCls = (path: string, base: string) => {
    // Prefix match so /catalog/123 also marks "Каталог" as active
    const isActive =
      pathname === path ||
      (path !== "/" && pathname.startsWith(path + "/")) ||
      // Manual aliases used in routes
      (path === "/about" && pathname === "/o-nas") ||
      (path === "/cultures" && pathname === "/kultury");
    return [styles.navLink, base, isActive ? styles.navLinkActive : ""]
      .filter(Boolean)
      .join(" ");
  };

  const handleUserClick = () => {
    if (isAuthed) openUserDrawer();
    else openAuth("login");
  };

  return (
    <header
      className={[styles.navbar, className].join(" ")}
      data-device={device}
      data-state={state}
    >
      <div className={styles.mainContent}>
        <div className={styles.leftContant}>
          <Link
            to="/"
            aria-label="На головну"
            style={{ display: "inline-flex", textDecoration: "none" }}
          >
            <img decoding="async"
              className={styles.logoIcon}
              loading="lazy"
              width={116}
              height={82}
              alt="Торговий дім ТАМІС АГРО"
              src="/logo@2x.png"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>
        <nav className={styles.link}>
            <Link
              to="/catalog"
              className={navLinkCls("/catalog", styles.div)}
              data-testid="navbar-catalog-link"
            >
              Каталог
            </Link>
            <Link
              to="/cultures"
              className={navLinkCls("/cultures", styles.div2)}
              data-testid="navbar-cultures-link"
            >
              Культури
            </Link>
            <Link
              to="/about"
              className={navLinkCls("/about", styles.div3)}
              data-testid="navbar-about-link"
            >
              Про нас
            </Link>
            <Link
              to="/blog"
              className={navLinkCls("/blog", styles.div3)}
              data-testid="navbar-blog-link"
            >
              Блог
            </Link>
            <Link
              to="/contacts"
              className={navLinkCls("/contacts", styles.div4)}
              data-testid="navbar-contacts-link"
            >
              Контакти
            </Link>
        </nav>
        <div className={styles.rightContent}>
          <div className={styles.iconButton}>
            <HeaderSearch size={size} />

            {/* User icon — opens auth modal (guest) or side drawer (authed) */}
            <button
              type="button"
              className={styles.iconButtons2}
              onClick={handleUserClick}
              aria-label={isAuthed ? "Особистий кабінет" : "Увійти до акаунту"}
              data-testid="navbar-user-trigger"
            >
              <User1 size={16} />
            </button>

            {/* Cart icon */}
            <button
              type="button"
              className={styles.iconButtons3}
              onClick={openCart}
              aria-label="Відкрити кошик"
              data-testid="navbar-cart-trigger"
            >
              <Cart1 size={16} />
              {count > 0 && (
                <span className={styles.cartBadge} data-testid="navbar-cart-count">
                  {count}
                </span>
              )}
            </button>
          </div>
          <PrimaryButton1
            state="Default"
            type="Filled"
            prop="Замовити дзвінок"
            showCall
            size="24"
            onClick={openCallback}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar1;
