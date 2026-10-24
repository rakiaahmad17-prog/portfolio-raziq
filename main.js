/* Ahmad Raziq — portfolio interactions
   Vanilla JS, no dependencies. Every effect degrades gracefully. */

(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- Menu */
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];
  const main = document.getElementById('main');
  const footer = document.querySelector('.site-footer');

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;
    body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.menu-btn__label').textContent = open ? 'Close' : 'Menu';
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    if (open) {
      const first = menu.querySelector('a');
      if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 260);
    } else {
      menuToggle.focus({ preventScroll: true });
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  }
  menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 940 && body.classList.contains('menu-open')) setMenu(false);
  });

  /* --------------------------------------------------------- Grid toggle */
  const overlay = document.querySelector('[data-grid-overlay]');
  const gridButtons = document.querySelectorAll('[data-grid-toggle]');
  const gridBadge = document.querySelector('.grid-badge');
  let gridOn = false;

  const setGrid = (on) => {
    if (!overlay) return;
    gridOn = on;
    overlay.dataset.on = String(on);
    gridButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(on)));
    if (gridBadge) gridBadge.hidden = !on;
  };

  gridButtons.forEach((btn) => btn.addEventListener('click', () => setGrid(!gridOn)));

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'g' || e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target;
    const typing = el instanceof HTMLElement &&
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
    if (typing || body.classList.contains('menu-open')) return;
    e.preventDefault();
    setGrid(!gridOn);
  });

  /* ------------------------------------------------------- Scroll effects */
  const progressBar = document.querySelector('[data-progress]');
  const header = document.querySelector('[data-header]');
  let ticking = false;

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.width = `${height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0}%`;
    }
    if (header) header.classList.toggle('is-stuck', scrollTop > 8);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------- Reveals */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* --------------------------------------------------- Active nav section */
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const sections = [...navLinks].map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const setActive = (id) => {
      navLinks.forEach((link) => {
        const match = link.getAttribute('href') === `#${id}`;
        if (match) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* -------------------------------------------------------------- Clock */
  const clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const tick = () => {
      const time = `${formatter.format(new Date())} WITA`;
      clocks.forEach((clock) => { clock.textContent = time; });
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* --------------------------------------------------------- Copy number */
  const copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    const hint = copyBtn.querySelector('[data-copy-hint]');
    copyBtn.addEventListener('click', async () => {
      const value = copyBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        if (hint) hint.textContent = 'Copied';
      } catch {
        const temp = document.createElement('textarea');
        temp.value = value;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand('copy'); if (hint) hint.textContent = 'Copied'; }
        catch { if (hint) hint.textContent = 'Select above'; }
        temp.remove();
      }
      window.setTimeout(() => { if (hint) hint.textContent = 'Copy'; }, 2000);
    });
  }

  /* --------------------------------------------------------------- Form */
  const form = document.querySelector('[data-form]');
  const status = document.querySelector('[data-form-status]');
  const WHATSAPP = '6281958343836';

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const type = String(data.get('type') || '').trim();
      const budget = String(data.get('budget') || '').trim();
      const message = String(data.get('message') || '').trim();

      const text = [
        `Hi Ahmad, I'm ${name}.`,
        '',
        `Project: ${type}`,
        `Budget: ${budget}`,
        '',
        message,
        '',
        '— sent from ahmadraziq.design',
      ].join('\n');

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
      const opened = window.open(url, '_blank', 'noopener');

      if (status) {
        status.textContent = opened
          ? 'WhatsApp opened in a new tab — press send there.'
          : 'Popup blocked. Use the link below.';
        if (!opened) {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener';
          link.textContent = 'Open WhatsApp with this message →';
          link.style.textDecoration = 'underline';
          status.append(' ', link);
        }
      }
    });
  }

  /* ---------------------------------------------------------- Back to top */
  const toTop = document.querySelector('[data-top]');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();
