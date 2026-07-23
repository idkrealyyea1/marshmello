/* ===== Shared Utilities, Navigation & Language ===== */

const WHATSAPP_NUMBER = "966XXXXXXXXX";

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
        <img src="images/logo.png" alt="Marshmallow" onerror="this.style.display='none'">
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
      <img src="images/logo.png" alt="Marshmallow" class="footer-logo" onerror="this.style.display='none'">
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
}
