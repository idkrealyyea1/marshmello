/* =========================================================
   GRAND ÉLYSÉE — Luxury Event Hall v2.0
   Vanilla JavaScript — Enhanced Interactive Experience
   ========================================================= */

'use strict';

/* ─── LOADING SCREEN ─────────────────────────────────────── */
(function initLoader() {
  const screen  = document.getElementById('loading-screen');
  const letters = document.querySelectorAll('.loader-letter');

  letters.forEach((l, i) => {
    l.style.animationDelay = (i * 0.075 + 0.25) + 's';
  });

  setTimeout(() => {
    if (screen) {
      screen.classList.add('hidden');
      screen.addEventListener('transitionend', () => screen.remove(), { once: true });
    }
    document.body.style.overflow = '';
  }, 3000);

  document.body.style.overflow = 'hidden';
})();


/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if ('ontouchstart' in window) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  })();

  const hoverSel = 'a, button, .gallery-item, .stat-card, .testimonial-card, .faq-question, .booking-perk, .service-item, .gallery-filter, .social-link';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
  });
})();


/* ─── NAVIGATION ─────────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // Glass effect
    navbar.classList.toggle('scrolled', y > 60);
    // Auto-hide on scroll down
    if (y > 300) {
      navbar.style.transform = y > lastY ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-mobile-open');
      toggle.classList.toggle('open', isOpen);
    });
    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-mobile-open');
        toggle.classList.remove('open');
      });
    });
  }
})();


/* ─── ACTIVE NAV HIGHLIGHTING ────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => observer.observe(el));
})();


/* ─── PARALLAX HERO ──────────────────────────────────────── */
(function initParallax() {
  const bg = document.querySelector('.hero-bg-img');
  if (!bg || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bg.style.transform = `translateY(${y * 0.4}px) scale(1.05)`;
  }, { passive: true });
})();


/* ─── HERO PARTICLES ─────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = window.innerWidth > 768 ? 50 : 24;
  const colors = ['#c9a963', '#e8d5a3', '#9a7a3a', '#fff'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 3 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 25}%;
      width: ${size}px; height: ${size}px;
      background: ${color};
      --duration: ${Math.random() * 10 + 7}s;
      --delay: -${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();


/* ─── ANIMATED COUNTERS ──────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let done = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const start = performance.now();
    function update(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease out quart
      el.textContent = Math.floor(eased * target);
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting) && !done) {
      done = true;
      counters.forEach(animateCounter);
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();


/* ─── GALLERY FILTER ─────────────────────────────────────── */
(function initGalleryFilter() {
  const filters = document.querySelectorAll('.gallery-filter');
  const items   = document.querySelectorAll('.gallery-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.opacity = '1';
          item.style.transform = '';
          item.style.pointerEvents = '';
        } else {
          item.style.opacity = '0.2';
          item.style.transform = 'scale(0.96)';
          item.style.pointerEvents = 'none';
        }
      });
    });
  });
})();


/* ─── GALLERY LIGHTBOX ───────────────────────────────────── */
(function initGallery() {
  const items    = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  const lbBackdrop = document.getElementById('lightbox-backdrop');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');

  const gallery = [];
  items.forEach(item => {
    const img = item.querySelector('img');
    const label = item.querySelector('.gallery-overlay-text');
    if (img) gallery.push({ src: img.src, alt: img.alt, label: label ? label.textContent : '' });
  });

  let current = 0;

  function open(idx) {
    current = idx;
    const g = gallery[idx];
    if (!g || !lbImg) return;
    lbImg.src = g.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=90');
    lbImg.alt = g.alt;
    if (lbCap) lbCap.textContent = g.label;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (lbImg) lbImg.src = ''; }, 400);
  }

  function prev() { open((current - 1 + gallery.length) % gallery.length); }
  function next() { open((current + 1) % gallery.length); }

  items.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => open(i));
  });

  lbClose && lbClose.addEventListener('click', close);
  lbBackdrop && lbBackdrop.addEventListener('click', close);
  lbPrev && lbPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });
  lbNext && lbNext.addEventListener('click', e => { e.stopPropagation(); next(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch/swipe
  let touchStartX = 0;
  lightbox && lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox && lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) diff > 0 ? next() : prev();
  });
})();


/* ─── BOOKING CALENDAR ────────────────────────────────────── */
(function initCalendar() {
  const calDays    = document.getElementById('cal-days');
  const calMonthYr = document.getElementById('cal-month-year');
  const prevBtn    = document.getElementById('cal-prev');
  const nextBtn    = document.getElementById('cal-next');
  const selDisplay = document.getElementById('cal-selected-display');
  const selText    = document.getElementById('cal-selected-text');
  if (!calDays) return;

  const bookedDays = [3, 7, 12, 14, 19, 21, 26, 28];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();
  let selectedDate = null;

  function renderCalendar() {
    calDays.innerHTML = '';
    calMonthYr.textContent = `${months[viewMonth]} ${viewYear}`;

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day empty';
      calDays.appendChild(el);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      const thisDate = new Date(viewYear, viewMonth, d);
      const isToday   = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
      const isBooked  = bookedDays.includes(d);
      const isPast    = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSel     = selectedDate && selectedDate.d === d && selectedDate.m === viewMonth && selectedDate.y === viewYear;

      if (isBooked || isPast) el.classList.add('booked');
      else                    el.classList.add('available');
      if (isToday)  el.classList.add('today');
      if (isSel)    el.classList.add('selected');

      el.textContent = d;

      if (!isBooked && !isPast) {
        el.addEventListener('click', () => {
          selectedDate = { d, m: viewMonth, y: viewYear };
          renderCalendar();
          if (selDisplay) selDisplay.style.display = 'block';
          if (selText)    selText.textContent = `${months[viewMonth]} ${d}, ${viewYear}`;
        });
      }
      calDays.appendChild(el);
    }
  }

  prevBtn && prevBtn.addEventListener('click', () => {
    if (--viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  nextBtn && nextBtn.addEventListener('click', () => {
    if (++viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();
})();


/* ─── BOOKING TABS ────────────────────────────────────────── */
function switchToForm() {
  const tabs   = document.querySelectorAll('.booking-tab');
  const tabCal = document.getElementById('tab-calendar');
  const tabForm = document.getElementById('tab-form');
  tabs.forEach((t, i) => t.classList.toggle('active', i === 1));
  if (tabCal)  tabCal.style.display  = 'none';
  if (tabForm) tabForm.style.display = 'block';
}

(function initBookingTabs() {
  const tabs    = document.querySelectorAll('.booking-tab');
  const tabCal  = document.getElementById('tab-calendar');
  const tabForm = document.getElementById('tab-form');

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (i === 0) {
        if (tabCal)  tabCal.style.display  = 'block';
        if (tabForm) tabForm.style.display = 'none';
      } else {
        if (tabCal)  tabCal.style.display  = 'none';
        if (tabForm) tabForm.style.display = 'block';
      }
    });
  });
})();


/* ─── FORM SUBMITS ────────────────────────────────────────── */
function handleBookingSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
  setTimeout(() => {
    const success = document.getElementById('form-success');
    if (success) success.style.display = 'block';
    e.target.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
    if (btn) btn.style.display = 'none';
  }, 900);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
  setTimeout(() => {
    const success = document.getElementById('contact-success');
    if (success) success.style.display = 'block';
    e.target.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
    if (btn) btn.style.display = 'none';
  }, 900);
}


/* ─── TESTIMONIALS CAROUSEL ───────────────────────────────── */
(function initTestimonials() {
  const track    = document.getElementById('testimonials-track');
  const dotsWrap = document.getElementById('t-dots');
  const prevBtn  = document.getElementById('t-prev');
  const nextBtn  = document.getElementById('t-next');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoplay;
  let visible  = getVisible();
  let startX   = 0;

  function getVisible() {
    if (window.innerWidth < 768)  return 1;
    if (window.innerWidth < 1200) return 2;
    return 3;
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const count = Math.ceil(total / visible);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(idx) {
    const count = Math.ceil(total / visible);
    current = ((idx % count) + count) % count;
    const w = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${current * visible * w}px)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function startAuto() { autoplay = setInterval(next, 5000); }
  function resetAuto() { clearInterval(autoplay); startAuto(); }

  prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  });

  window.addEventListener('resize', () => {
    const nv = getVisible();
    if (nv !== visible) { visible = nv; current = 0; buildDots(); goTo(0); }
  });

  buildDots();
  startAuto();
})();


/* ─── FAQ ACCORDION ──────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const isOpen = q.classList.contains('open');
      const answer = q.nextElementSibling;

      // Close all
      document.querySelectorAll('.faq-question').forEach(other => {
        other.classList.remove('open');
        other.setAttribute('aria-expanded', 'false');
        const a = other.nextElementSibling;
        if (a) { a.classList.remove('open'); a.style.maxHeight = '0'; }
      });

      // Open this one
      if (!isOpen && answer) {
        q.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();


/* ─── BACK TO TOP ────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── SERVICE HOVER PARALLAX ─────────────────────────────── */
(function initServiceHover() {
  document.querySelectorAll('.service-item').forEach(item => {
    const img = item.querySelector('.service-img img');
    if (!img) return;
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      img.style.transform = `scale(1.08) translate(${x * 12}px, ${y * 12}px)`;
    });
    item.addEventListener('mouseleave', () => { img.style.transform = ''; });
  });
})();


/* ─── FLOATING DECORATIVE ELEMENTS ──────────────────────── */
(function initFloatingDecor() {
  const sels    = ['#about', '#services', '#testimonials', '#faq'];
  const symbols = ['✦', '◆', '✧', '⬡', '◇', '⋆'];

  sels.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('div');
      d.className = 'floating-decor';
      d.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      d.style.cssText = `
        position:absolute;
        top:${15 + Math.random() * 70}%;
        left:${(i % 2 === 0 ? 1 : 91) + Math.random() * 5}%;
        font-size:${0.5 + Math.random() * 0.7}rem;
        color:rgba(201,169,99,${0.05 + Math.random() * 0.07});
        animation-delay:${Math.random() * 5}s;
        animation-duration:${7 + Math.random() * 6}s;
        pointer-events:none; user-select:none; z-index:0;
      `;
      el.appendChild(d);
    }
  });
})();


/* ─── HERO BUTTON PULSE ──────────────────────────────────── */
(function initHeroPulse() {
  const ctas = document.querySelectorAll('.hero-ctas .btn-primary');
  ctas.forEach(btn => {
    setInterval(() => {
      btn.style.boxShadow = '0 8px 48px rgba(201,169,99,0.55)';
      setTimeout(() => { btn.style.boxShadow = '0 8px 32px rgba(201,169,99,0.35)'; }, 700);
    }, 3500);
  });
})();


/* ─── GALLERY ITEM ENTRANCE STAGGER ─────────────────────── */
(function initGalleryEntrance() {
  const items = document.querySelectorAll('.gallery-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px) scale(0.97)';
    item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    obs.observe(item);
  });
})();


console.log(
  '%c✦ Grand Élysée ✦',
  'font-family:Georgia,serif;font-size:22px;color:#c9a963;padding:12px;text-shadow:0 0 20px rgba(201,169,99,0.5);'
);
console.log('%cWhere Moments Become Legends', 'font-size:12px;color:#a09680;letter-spacing:0.2em;');
