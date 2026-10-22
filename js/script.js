/* =========================================================
   JAHHAT MEDIA — CORE SCRIPT
   ========================================================= */

/* -----------------------------------------------------------
   NEWSLETTER SIGNUP (Brevo)
   The popup posts to the Brevo form address below (taken from the
   form's embed code in Brevo: Contacts > Forms). If you ever create
   a new Brevo form, paste its new "action" address here.
----------------------------------------------------------- */
const BREVO_FORM_URL = 'https://dc934db1.sibforms.com/serve/MUIFANzdRV-JSI3-X7EJp9ax_ENJE1nY0HGVsYJk4rwm8DRWmgmf9CowCqA5cWqVT-D7Ge1M---SRTpzuBK9qO9RlGUVEqP0JQi6X99oBJqFsbf1L0k19Aq_886BMypLar6_Yz41Ah_w8PUGnCI0Xm2JEDueIKQNV6nHKFp8KzSIYcusb4VnMHtis1FE7A8h_uGFJ0WcR7eiClcScw==';
const PRIVACY_NOTICE_VERSION = '2026-10-09';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDispatchAccordion();
  initFilters();
  initGalleryLightbox();
  initDropTimer();
  initContactForm();
  initTickerClone();
  initCarousel();
  initFeatureRotator();
  initBackToTop();
  initNewsletterModal();
});

/* -----------------------------------------------------------
   MOBILE NAV DRAWER
----------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.body.classList.toggle('menu-open', isOpen);
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    });
  });
}

/* -----------------------------------------------------------
   DISPATCH ACCORDION (mobile drawer submenu)
----------------------------------------------------------- */
function initDispatchAccordion() {
  // Handles every dropdown group in the mobile drawer (Dispatch, Gallery, ...)
  document.querySelectorAll('.mobile-drawer__group').forEach(group => {
    const btn = group.querySelector('.mobile-drawer__expand');
    const submenu = group.querySelector('.mobile-drawer__submenu');
    if (!btn || !submenu) return;
    btn.addEventListener('click', () => {
      const isOpen = submenu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);
      btn.textContent = isOpen ? '−' : '+';
    });
  });
}

/* -----------------------------------------------------------
   TICKER — duplicate content so the loop reads seamless
----------------------------------------------------------- */
function initTickerClone() {
  const track = document.querySelector('.ticker__track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* -----------------------------------------------------------
   CATEGORY FILTERS (spots.html — filter spot cards by state)
----------------------------------------------------------- */
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn[data-filter]');
  if (!buttons.length) return;

  const cards = document.querySelectorAll('[data-category]');
  const emptyState = document.querySelector('.filter-empty');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      let visibleCount = 0;
      cards.forEach(card => {
        const cats = card.dataset.category.split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.hidden = !show;
        if (show) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    });
  });
}

/* -----------------------------------------------------------
   GALLERY LIGHTBOX (gallery-photos.html)
----------------------------------------------------------- */
function initGalleryLightbox() {
  const items = Array.from(document.querySelectorAll('.masonry__item'));
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');
  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    open(currentIndex);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* -----------------------------------------------------------
   CAROUSEL (index.html)
----------------------------------------------------------- */
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
  const prevBtn = carousel.querySelector('.carousel__arrow--prev');
  const nextBtn = carousel.querySelector('.carousel__arrow--next');
  const dotsWrap = carousel.querySelector('.carousel__dots');
  if (!slides.length) return;

  let index = 0;
  let autoplayId = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.carousel__dot'));

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, 5000);
  }
  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }

  nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  goTo(0);
  startAutoplay();
}

/* -----------------------------------------------------------
   DROP COUNTER (merch.html) — simulated countdown to next drop
----------------------------------------------------------- */
function initDropTimer() {
  const el = document.querySelector('.drop-counter__timer');
  if (!el) return;

  const dEl = el.querySelector('[data-d]');
  const hEl = el.querySelector('[data-h]');
  const mEl = el.querySelector('[data-m]');
  const sEl = el.querySelector('[data-s]');

  // Simulated target: 4 days, 6 hours from page load
  const target = new Date().getTime() + (4 * 24 * 60 * 60 * 1000) + (6 * 60 * 60 * 1000);

  function tick() {
    const now = new Date().getTime();
    let diff = Math.max(0, target - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (dEl) dEl.textContent = String(d).padStart(2, '0');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* -----------------------------------------------------------
   CONTACT FORM (contact.html)
----------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) valid = false;
    });

    if (!valid) {
      status.textContent = 'Fill in the required fields before sending.';
      status.classList.add('is-visible');
      return;
    }

    status.textContent = 'Transmission received — we\'ll get back to you soon.';
    status.classList.add('is-visible');
    form.reset();
  });
}

/* -----------------------------------------------------------
   SCROLL-TO-TOP — 'TOP ↑' button, appears after scrolling 300px
----------------------------------------------------------- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = 'TOP ↑';
  document.body.appendChild(btn);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function toggle() {
    btn.classList.toggle('is-visible', window.scrollY > 300);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

/* -----------------------------------------------------------
   NEWSLETTER MODAL
   Any element with [data-newsletter-open] opens it. The modal
   markup is injected once, so it works on every page.
   Submit stays disabled until every [required] field is valid.
   Required: name, email and the first checkbox. The partner-sharing
   checkbox is optional (its answer is sent as consent_partner_sharing).
----------------------------------------------------------- */
function initNewsletterModal() {
  const triggers = document.querySelectorAll('[data-newsletter-open]');
  if (!triggers.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'newsletter-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="newsletter-modal" role="dialog" aria-modal="true" aria-labelledby="nlTitle">
      <div class="nl-body">
        <span class="nl-eyebrow">The Weekly Dispatch</span>
        <h2 class="nl-title" id="nlTitle">Subscribe to Dispatch</h2>
        <p class="nl-lead">Local news, events, video drops and rider spotlights — straight to your inbox.</p>
        <form id="newsletterForm" novalidate>
          <div class="nl-field">
            <label for="nlName">Full Name</label>
            <input type="text" id="nlName" name="name" autocomplete="name" required>
          </div>
          <div class="nl-field">
            <label for="nlEmail">Email Address</label>
            <input type="email" id="nlEmail" name="email" autocomplete="email" required>
          </div>
          <label class="nl-check">
            <input type="checkbox" name="consent_newsletter" required aria-required="true">
            <span>I agree to receive email newsletters, scene updates, video drops, and promotional content from Jahhat Media. <strong class="nl-req">* This box is required</strong></span>
          </label>
          <label class="nl-check">
            <input type="checkbox" name="consent_partner_sharing">
            <span>I consent to Jahhat Media sharing my name and email address with selected marketing partners and sponsors for relevant offers. <em class="nl-opt">(Optional)</em></span>
          </label>
          <input type="text" name="website_check" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0;">
          <div class="nl-actions">
            <button type="submit" class="btn-brutal btn-brutal--solid nl-submit" disabled>Submit</button>
            <button type="button" class="btn-brutal nl-close">No Thanks / Close</button>
          </div>
          <p class="nl-status" role="status" aria-live="polite"></p>
          <p class="nl-privacy">Newsletters are sent via Brevo. <a href="/privacy.html" target="_blank" rel="noopener">Read our Privacy Policy</a></p>
        </form>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const modal = overlay.querySelector('.newsletter-modal');
  const body = overlay.querySelector('.nl-body');
  const form = overlay.querySelector('#newsletterForm');
  const submitBtn = overlay.querySelector('.nl-submit');
  const closeBtn = overlay.querySelector('.nl-close');
  const status = overlay.querySelector('.nl-status');
  const nameInput = overlay.querySelector('#nlName');
  let lastFocus = null;

  function isFormValid() {
    return Array.from(form.querySelectorAll('[required]')).every((field) => {
      if (field.type === 'checkbox') return field.checked;
      if (field.type === 'email') return field.value.trim() !== '' && field.checkValidity();
      return field.value.trim() !== '';
    });
  }

  function refresh() {
    submitBtn.disabled = !isFormValid();
  }

  function openModal() {
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameInput.focus(), 50);
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  triggers.forEach((t) => t.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    // keep keyboard focus inside the dialog
    const focusable = Array.from(modal.querySelectorAll('input, button, a[href]')).filter((el) => !el.disabled && el.tabIndex !== -1);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    submitBtn.disabled = true;
    status.textContent = 'Sending…';

    // Field names match the Brevo form (Contacts > Forms > "The Dispatch").
    const data = new FormData(form);
    const params = new URLSearchParams();
    params.set('FIRSTNAME', data.get('name').trim());
    params.set('EMAIL', data.get('email').trim());
    params.set('OPT_IN', '1');
    if (form.elements.consent_partner_sharing.checked) params.set('MARKETING_CONSENT', '1');
    params.set('email_address_check', data.get('website_check') || '');   // Brevo's spam trap: must stay empty
    params.set('locale', 'en');

    try {
      // Brevo does not allow its reply to be read from another site (CORS), so we send
      // the form as a "no-cors" request. A thrown error means a network failure.
      await fetch(BREVO_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      body.innerHTML = `
        <div class="nl-success">
          <span class="nl-eyebrow">Almost There</span>
          <h2 class="nl-title" id="nlTitle">Check Your Inbox.</h2>
          <p class="nl-lead">Thanks for joining the Dispatch. If we sent a confirmation email, please click the link in it to finish subscribing (check your spam folder too).</p>
          <div class="nl-actions"><button type="button" class="btn-brutal nl-close-done">Close</button></div>
        </div>`;
      body.querySelector('.nl-close-done').addEventListener('click', closeModal);
      body.querySelector('.nl-close-done').focus();
    } catch (err) {
      console.error(err);
      status.textContent = 'Something went wrong. Please try again.';
      refresh();
    }
  });
}

/* -----------------------------------------------------------
   ROTATING FEATURE BLOCK (home page)
   Reads the News, Stories, Spots and Gallery pages and builds one
   slide from each: latest news, latest story, a random spot and a
   random gallery photo. Placeholder items ("... Goes Here") and
   images that fail to load are skipped automatically.
   Needs the site to be served over http(s); opened straight from
   disk it simply shows the two fixed slides.
----------------------------------------------------------- */
function initFeatureRotator() {
  const root = document.querySelector('[data-rotator]');
  if (!root) return;
  const slidesWrap = root.querySelector('.rotator__slides');
  const dotsWrap = root.querySelector('.rotator__dots');
  const AUTOPLAY_MS = 5000;

  const isPlaceholder = (t) => !t || /goes here|\[ ?(cover|news|paste)/i.test(t) || /^(dd mmm yyyy|author name)/i.test(t);
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  async function getDoc(url) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(url);
    return new DOMParser().parseFromString(await res.text(), 'text/html');
  }
  function imageOk(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(false);
      const img = new Image();
      const t = setTimeout(() => resolve(false), 4000);
      img.onload = () => { clearTimeout(t); resolve(img.naturalWidth > 20); };
      img.onerror = () => { clearTimeout(t); resolve(false); };
      img.src = src;
    });
  }
  function slide({ tag, title, href, excerpt, meta, linkText, image, alt }) {
    const el = document.createElement('div');
    el.className = 'rotator__slide' + (image ? ' has-image' : '');
    const text = document.createElement('div');
    text.className = 'rotator__text';
    const tape = document.createElement('span'); tape.className = 'tape'; tape.textContent = tag;
    const h = document.createElement('h3'); h.className = 'rotator__title';
    if (href) { const a = document.createElement('a'); a.href = href; a.textContent = title; h.appendChild(a); } else h.textContent = title;
    text.append(tape, h);
    if (excerpt) { const p = document.createElement('p'); p.className = 'rotator__excerpt'; p.textContent = excerpt; text.appendChild(p); }
    if (meta) { const m = document.createElement('span'); m.className = 'rotator__meta'; m.textContent = meta; text.appendChild(m); }
    if (href && linkText) {
      const l = document.createElement('a'); l.className = 'rotator__link'; l.href = href; l.textContent = linkText;
      if (/^https?:/.test(href)) { l.target = '_blank'; l.rel = 'noopener'; }
      text.appendChild(l);
    }
    el.appendChild(text);
    if (image) {
      const f = document.createElement('div'); f.className = 'rotator__frame';
      const im = document.createElement('img'); im.src = image; im.alt = alt || title; im.loading = 'lazy';
      f.appendChild(im); el.appendChild(f);
    }
    return el;
  }

  const builders = {
    async news() {
      const d = await getDoc('/dispatch/news/');
      const it = Array.from(d.querySelectorAll('.feed__item')).find((n) => !isPlaceholder(clean(n.querySelector('.feed__title')?.textContent)));
      if (!it) return null;
      const a = it.querySelector('.feed__link');
      return slide({
        tag: 'Latest News', title: clean(it.querySelector('.feed__title').textContent),
        excerpt: clean(it.querySelector('.feed__blurb')?.textContent),
        meta: clean(it.querySelector('.feed__date')?.textContent),
        href: a && a.getAttribute('href') && a.getAttribute('href') !== '#' ? a.getAttribute('href') : '/dispatch/news/',
        linkText: 'Read More →'
      });
    },
    async story() {
      const d = await getDoc('/dispatch/stories/');
      const it = Array.from(d.querySelectorAll('.article-card')).find((n) => !isPlaceholder(clean(n.querySelector('.article-card__title')?.textContent)));
      if (!it) return null;
      const a = it.querySelector('.article-card__title a');
      const src = it.querySelector('.article-card__frame img')?.getAttribute('src');
      const ok = src ? await imageOk(src) : false;
      return slide({
        tag: clean(it.querySelector('.tape')?.textContent) || 'Latest Story',
        title: clean(it.querySelector('.article-card__title').textContent),
        excerpt: clean(it.querySelector('.article-card__excerpt')?.textContent),
        meta: clean(it.querySelector('.article-card__meta')?.textContent.replace(/\s{2,}/g, ' · ')),
        href: a ? a.getAttribute('href') : '/dispatch/stories/', linkText: 'Read Story →',
        image: ok ? src : null
      });
    },
    async spot() {
      const d = await getDoc('/spots.html');
      const cards = Array.from(d.querySelectorAll('.spot-card'));
      if (!cards.length) return null;
      for (const c of cards.sort(() => Math.random() - 0.5).slice(0, 8)) {   // prefer a spot that has a photo
        const src = c.querySelector('.spot-card__frame img')?.getAttribute('src');
        if (await imageOk(src)) return spotSlide(c, src);
      }
      return spotSlide(pick(cards), null);
    },
    async gallery() {
      const d = await getDoc('/gallery-photos.html');
      const items = Array.from(d.querySelectorAll('.masonry__item')).sort(() => Math.random() - 0.5);
      for (const it of items.slice(0, 12)) {
        const img = it.querySelector('img');
        const src = img && img.getAttribute('src');
        if (src && await imageOk(src)) {
          return slide({
            tag: 'From The Gallery', title: clean(it.getAttribute('data-caption')) || clean(img.alt) || 'Gallery',
            href: '/gallery-photos.html', linkText: 'Open Gallery →', image: src, alt: clean(img.alt)
          });
        }
      }
      return null;
    }
  };
  function spotSlide(c, src) {
    const a = c.querySelector('.spot-card__name a');
    return slide({
      tag: 'Spot Of The Day', title: clean(c.querySelector('.spot-card__name')?.textContent),
      meta: clean(c.querySelector('.spot-card__location')?.textContent),
      excerpt: clean(c.querySelector('.spot-card__desc')?.textContent),
      href: '/spots.html', linkText: 'Full Spot Directory →', image: src
    });
  }

  const statics = Array.from(slidesWrap.querySelectorAll('[data-static]'));
  Promise.allSettled(['news', 'story', 'spot', 'gallery'].map((k) => builders[k]())).then((res) => {
    const dynamic = res.map((r) => (r.status === 'fulfilled' ? r.value : null)).filter(Boolean);
    dynamic.forEach((el) => slidesWrap.insertBefore(el, statics[0]));
    start();
  });

  function start() {
    const slides = Array.from(slidesWrap.querySelectorAll('.rotator__slide'));
    let i = 0, timer = null;
    dotsWrap.innerHTML = '';
    const dots = slides.map((_, n) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'rotator__dot';
      b.setAttribute('aria-label', 'Go to slide ' + (n + 1)); b.addEventListener('click', () => { show(n); restart(); });
      dotsWrap.appendChild(b); return b;
    });
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    }
    function restart() { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(i + 1), AUTOPLAY_MS); }
    root.querySelector('.rotator__arrow--prev').addEventListener('click', () => { show(i - 1); restart(); });
    root.querySelector('.rotator__arrow--next').addEventListener('click', () => { show(i + 1); restart(); });
    let x0 = null;
    root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { show(i + (dx < 0 ? 1 : -1)); restart(); } x0 = null; });
    show(0); restart();
  }
}
