/* ===== Shared Utilities, Navigation & Language ===== */

const WHATSAPP_NUMBER = "966XXXXXXXXX";

/* --- SVG Logo --- */
function getMLogoSVG(color) {
  color = color || '#B8907E';
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#C9A25D;stop-opacity:1"/>
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="100" height="100" rx="24" fill="url(#mGrad)" opacity="0.1"/>
    <text x="60" y="82" text-anchor="middle" font-family="'Playfair Display',serif" font-size="68" font-weight="700" fill="url(#mGrad)">M</text>
  </svg>`;
}

function getSplashLogoSVG() {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="spGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#B8907E;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#C9A25D;stop-opacity:1"/>
      </linearGradient>
      <filter id="spGlow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="28" fill="none" stroke="url(#spGrad)" stroke-width="3" opacity="0.3"/>
    <rect x="16" y="16" width="88" height="88" rx="20" fill="url(#spGrad)" opacity="0.08"/>
    <text x="60" y="84" text-anchor="middle" font-family="'Playfair Display',serif" font-size="66" font-weight="700" fill="url(#spGrad)" filter="url(#spGlow)">M</text>
  </svg>`;
}

/* --- Language System --- */
const Lang = {
  current: "ar",

  init() {
    this.current = localStorage.getItem(LANG_KEY) || "ar";
    this.applyDirection();
    this.applyTranslations();
  },

  get(key) {
    if (!T[key]) return key;
    return T[key][this.current] || T[key]["ar"] || key;
  },

  set(lang) {
    this.current = lang;
    localStorage.setItem(LANG_KEY, lang);
    this.applyDirection();
    this.applyTranslations();
  },

  toggle() {
    this.set(this.current === "ar" ? "en" : "ar");
  },

  isAr() {
    return this.current === "ar";
  },

  applyDirection() {
    const html = document.documentElement;
    html.setAttribute("lang", this.current);
    html.setAttribute("dir", this.isAr() ? "rtl" : "ltr");
    document.body.style.fontFamily = this.isAr()
      ? "var(--font-arabic-body)"
      : "var(--font-english-body)";
  },

  applyTranslations() {
    document.querySelectorAll("[data-t]").forEach(el => {
      const key = el.getAttribute("data-t");
      const text = this.get(key);
      if (text) el.textContent = text;
    });
    document.querySelectorAll("[data-t-ph]").forEach(el => {
      const key = el.getAttribute("data-t-ph");
      const text = this.get(key);
      if (text) el.placeholder = text;
    });
    document.querySelectorAll("[data-t-html]").forEach(el => {
      const key = el.getAttribute("data-t-html");
      const text = this.get(key);
      if (text) el.innerHTML = text;
    });
    document.querySelectorAll("[data-t-aria]").forEach(el => {
      const key = el.getAttribute("data-t-aria");
      const text = this.get(key);
      if (text) el.setAttribute("aria-label", text);
    });
  }
};

/* --- Helpers --- */
function t(key) {
  return Lang.get(key);
}

function getWhatsAppLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function formatDateAr(dateStr) {
  const d = new Date(dateStr);
  if (Lang.isAr()) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return d.toLocaleDateString("ar-SA", options);
  }
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return d.toLocaleDateString("en-US", options);
}

function formatDateShort(dateStr) {
  return dateStr;
}

function showModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function hideModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
}

function showAlert(containerId, type, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => { container.innerHTML = ""; }, 5000);
}

function showLoading(containerId, text) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">${text || t("cal_loading")}</div>
    </div>`;
}

/* --- Header --- */
function renderHeader(activePage) {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const session = Auth.getSession();
  const navLinks = [];

  if (session) {
    if (session.role === "admin") {
      navLinks.push({ href: "admin.html", label: t("nav_admin"), key: "admin" });
    } else {
      navLinks.push({ href: "photography.html", label: t("nav_photography"), key: "photography" });
    }
    navLinks.push({ href: "#", label: t("nav_logout"), key: "logout", onclick: "Auth.logout(); return false;" });
  }

  const langLabel = Lang.isAr() ? "EN" : "عربي";
  const langOnclick = "Lang.toggle(); renderHeader('" + activePage + "'); renderFooter(); return false;";

  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="header-logo">
        <div class="m-logo">${getMLogoSVG()}</div>
        <div class="header-logo-text">
          <span class="brand-name english-heading">${t("brand_name")}</span>
          <span class="brand-sub">${t("brand_sub")}</span>
        </div>
      </a>
      <nav class="header-nav">
        <a href="index.html" class="${activePage === 'home' ? 'nav-active' : ''}">${t("nav_home")}</a>
        <a href="chalet.html" class="${activePage === 'chalet' ? 'nav-active' : ''}">${t("nav_chalet")}</a>
        <a href="salon.html" class="${activePage === 'salon' ? 'nav-active' : ''}">${t("nav_salon")}</a>
        <a href="about.html" class="${activePage === 'about' ? 'nav-active' : ''}">${t("nav_about")}</a>
        ${navLinks.map(l => `<a href="${l.href}" class="${activePage === l.key ? 'nav-active' : ''}" ${l.onclick ? `onclick="${l.onclick}"` : ''}>${l.label}</a>`).join("")}
        <a href="#" class="lang-toggle" onclick="${langOnclick}">${langLabel}</a>
      </nav>
    </div>`;
}

/* --- Footer --- */
function renderFooter() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-logo-wrap">${getMLogoSVG()}</div>
      <div class="footer-brand english-heading">${t("brand_name")}</div>
      <div class="footer-tagline">${t("brand_sub")}</div>
      <div class="footer-links">
        <a href="index.html">${t("nav_home")}</a>
        <a href="chalet.html">${t("nav_chalet")}</a>
        <a href="salon.html">${t("nav_salon")}</a>
        <a href="about.html">${t("nav_about")}</a>
        <a href="photography.html">${t("nav_photography")}</a>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-copyright">&copy; ${year} Marshmallow — Photo Chalet & Events. ${t("footer_rights")}.</div>
      <div class="footer-staff-link">
        <a href="login.html">${t("footer_staff")}</a>
      </div>
    </div>`;
}

/* --- Init Page --- */
function initPage(activePage) {
  Lang.init();
  renderHeader(activePage);
  renderFooter();

  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("active");
    });
  });

  // Splash screen
  const splashLogo = document.getElementById("splashLogo");
  if (splashLogo) splashLogo.innerHTML = getSplashLogoSVG();

  const splash = document.getElementById("splash");
  if (splash) {
    setTimeout(() => {
      splash.classList.add("hide");
      setTimeout(() => splash.remove(), 700);
    }, 2400);
  }
}
