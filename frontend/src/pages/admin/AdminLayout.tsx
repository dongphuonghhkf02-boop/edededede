import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./AdminLayout.module.css";

/* =====================================================================
   AdminLayout — хедер зліва (сайдбар), основний контент справа.
   Якщо користувач не авторизований або не admin — показуємо форму входу.
   ===================================================================== */

const IconDashboard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg>;
const IconPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.97 18.33a2.5 2.5 0 0 1-2.5 2.5C9.95 20.83 3.17 14.05 3.17 4.53a2.5 2.5 0 0 1 2.5-2.5h2.5a1 1 0 0 1 1 .79l.95 4.27a1 1 0 0 1-.27.93l-1.7 1.7a14.5 14.5 0 0 0 6.13 6.13l1.7-1.7a1 1 0 0 1 .93-.27l4.27.95a1 1 0 0 1 .79 1v2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
const IconCard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5.5" width="19" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.6"/></svg>;
const IconDoc = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 3H6a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V9.5L14 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M14 3v6h5.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
const IconBox = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3.5 7L12 3l8.5 4v10L12 21 3.5 17V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M3.5 7L12 11l8.5-4M12 11v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
const IconFaq = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M9.5 9.5a2.5 2.5 0 1 1 4 2c-.9.5-1.5 1.2-1.5 2v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="17" r="0.9" fill="currentColor"/></svg>;
const IconContact = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
const IconBlog = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 4v3h3M8 11h8M8 15h8M8 7h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 4V3a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 3 3v18a1.5 1.5 0 0 0 1.5 1.5h8A1.5 1.5 0 0 0 14 21v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M9 12h12m0 0l-3.5-3.5M21 12l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconExternal = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6M20 4l-9 9M10 6H5.5A1.5 1.5 0 0 0 4 7.5v11A1.5 1.5 0 0 0 5.5 20h11A1.5 1.5 0 0 0 18 18.5V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const pageTitles: Record<string, { title: string; sub?: string }> = {
  "/admin":               { title: "Дашборд",       sub: "Загальний огляд активності TAMIS АГРО" },
  "/admin/callbacks":     { title: "Заявки на дзвінок", sub: "Обробка вхідних заявок від клієнтів" },
  "/admin/notifications": { title: "Налаштування сповіщень", sub: "Канали для отримання заявок (Telegram / Email)" },
  "/admin/faq":           { title: "Часті запитання",  sub: "Управління FAQ на сторінці Контакти" },
  "/admin/cultures":      { title: "Культури",         sub: "Картки секції «Знайдіть рішення для вашої культури»" },
  "/admin/partners":      { title: "Партнери / Нам довіряють", sub: "Логотипи на сторінках Головна та Про нас" },
  "/admin/blog":          { title: "Блог",            sub: "Управління статтями блогу — створення, редагування, публікація" },
  "/admin/blog/new":      { title: "Нова стаття",     sub: "Створення нової статті блогу" },
  "/admin/payments":      { title: "Платежі",        sub: "Управління фінансами" },
  "/admin/content":       { title: "Контент",        sub: "Сторінки, блог, категорії" },
  "/admin/products":      { title: "Товари",         sub: "Картки товарів та їх наповнення" },
};

const AdminLayout: React.FC = () => {
  const { user, isAuthed, loading, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Невірний логін або пароль");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loginShell}>
        <div className={styles.loginCard}>
          <p style={{textAlign:"center", color:"#5e5e57", margin:0}}>Завантаження…</p>
        </div>
      </div>
    );
  }

  // Не авторизований або не admin — форма входу
  if (!isAuthed || user?.role !== "admin") {
    return (
      <div className={styles.loginShell}>
        <div className={styles.loginCard}>
          <div className={styles.loginBrand}>
            <div className={styles.brandMark}>TA</div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>TAMIS АГРО</span>
              <span className={styles.brandSub}>Admin Panel</span>
            </div>
          </div>
          <h1 className={styles.loginTitle}>Вхід в адмінпанель</h1>
          <p className={styles.loginSub}>Введіть облікові дані адміністратора.</p>
          <form className={styles.loginForm} onSubmit={onSubmit}>
            <label className={styles.loginLabel}>
              Пошта
              <input
                className={styles.loginInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tamis.ua"
                autoFocus
                data-testid="admin-login-email"
                required
              />
            </label>
            <label className={styles.loginLabel}>
              Пароль
              <input
                className={styles.loginInput}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                data-testid="admin-login-password"
                required
              />
            </label>
            {error && <div className={styles.loginError} data-testid="admin-login-error">{error}</div>}
            {isAuthed && user?.role !== "admin" && (
              <div className={styles.loginError}>
                Цей акаунт не має прав адміністратора. Увійдіть як admin.
              </div>
            )}
            <button type="submit" className={styles.loginSubmit} disabled={submitting} data-testid="admin-login-submit">
              {submitting ? "Вхід…" : "Увійти"}
            </button>
          </form>
          <div className={styles.loginHint}>
            Демо: <code>admin@tamis.ua</code> / <code>admin1234</code>
          </div>
          <Link to="/" className={styles.backLink}>← На головну</Link>
        </div>
      </div>
    );
  }

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/admin";
  const meta = pageTitles[pathname] || { title: "Адмін" };
  const initials = `${(user?.firstName?.[0] || "A").toUpperCase()}${(user?.lastName?.[0] || "").toUpperCase()}`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>TA</div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>TAMIS АГРО</span>
            <span className={styles.brandSub}>Admin Panel</span>
          </div>
        </div>

        <nav className={styles.navGroup}>
          <div className={styles.navGroupTitle}>Огляд</div>
          <NavLink to="/admin" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
            <span className={styles.navIcon}><IconDashboard /></span>Дашборд
          </NavLink>
        </nav>

        <nav className={styles.navGroup}>
          <div className={styles.navGroupTitle}>Клієнти</div>
          <NavLink to="/admin/callbacks" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`} data-testid="admin-nav-callbacks">
            <span className={styles.navIcon}><IconPhone /></span>Заявки на дзвінок
          </NavLink>
        </nav>

        <nav className={styles.navGroup}>
          <div className={styles.navGroupTitle}>Контент</div>
          <NavLink to="/admin/faq" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`} data-testid="admin-nav-faq">
            <span className={styles.navIcon}><IconFaq /></span>Часті запитання
          </NavLink>
          <NavLink to="/admin/cultures" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`} data-testid="admin-nav-cultures">
            <span className={styles.navIcon}><IconBox /></span>Культури
          </NavLink>
          <NavLink to="/admin/partners" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`} data-testid="admin-nav-partners">
            <span className={styles.navIcon}><IconBox /></span>Нам довіряють
          </NavLink>
          <NavLink to="/admin/blog" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`} data-testid="admin-nav-blog">
            <span className={styles.navIcon}><IconBlog /></span>Блог
          </NavLink>
        </nav>

        <nav className={styles.navGroup}>
          <div className={styles.navGroupTitle}>Налаштування</div>
          <NavLink to="/admin/notifications" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`} data-testid="admin-nav-notifications">
            <span className={styles.navIcon}><IconBell /></span>Сповіщення
          </NavLink>
          <NavLink to="/admin/contact-info" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`} data-testid="admin-nav-contact-info">
            <span className={styles.navIcon}><IconPhone /></span>Контактна інформація
          </NavLink>
          <NavLink to="/admin/payments" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
            <span className={styles.navIcon}><IconCard /></span>Платежі
          </NavLink>
          <NavLink to="/admin/content" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
            <span className={styles.navIcon}><IconDoc /></span>Контент
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
            <span className={styles.navIcon}><IconBox /></span>Товари
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userText}>
              <span className={styles.userName}>{user?.firstName} {user?.lastName}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>
          <button type="button" className={styles.logout} onClick={handleLogout} data-testid="admin-logout">
            <IconLogout /> Вихід
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.topbarTitle}>{meta.title}</h1>
            {meta.sub && <p className={styles.topbarSub}>{meta.sub}</p>}
          </div>
          <div className={styles.topbarRight}>
            <Link to="/" className={styles.linkSite} target="_blank" rel="noreferrer">
              <IconExternal /> Відкрити сайт
            </Link>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
