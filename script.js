// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav scroll
const nav = document.getElementById('nav');
const checkScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
checkScroll();
window.addEventListener('scroll', checkScroll, { passive: true });

// Mobile nav
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Custom cursor (desktop only)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.getElementById('cursorDot');
  const cursorEl = document.getElementById('cursor');
  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
  });

  (function tick() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cursorEl.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(tick);
  })();

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; cursorEl.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; cursorEl.style.opacity = '1'; });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursorEl.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('is-hover'));
  });

  document.querySelectorAll('.work-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorEl.classList.remove('is-hover'); cursorEl.classList.add('is-work'); });
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('is-work'));
  });
}

// Grain animation
const turbulence = document.getElementById('grainT');
if (turbulence && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  let seed = 0;
  setInterval(() => { turbulence.setAttribute('seed', ++seed % 100); }, 60);
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  });
}, { threshold: 0.1 });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 55}ms`;
  revealIO.observe(el);
});

// Work filters
const filters = document.querySelectorAll('.filter');
const workItems = document.querySelectorAll('.work-item');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    workItems.forEach(item => item.classList.toggle('hide', f !== 'all' && item.dataset.cat !== f));
  });
});

// Stat counters
const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat strong[data-count]').forEach(c => countIO.observe(c));

// Gallery — spring entrance (staggered per column)
const galleryItems = [...document.querySelectorAll('.gallery-item')]
  .sort((a, b) => +a.dataset.index - +b.dataset.index);
const giIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const col = el.closest('.gallery-col');
    const colIndex = col ? [...col.parentElement.children].indexOf(col) : 0;
    const itemIndex = [...(col || el.parentElement).children].indexOf(el);
    el.style.transitionDelay = `${colIndex * 60 + itemIndex * 80}ms`;
    el.classList.add('gi-in');
    giIO.unobserve(el);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.gallery-item').forEach(el => giIO.observe(el));

// Gallery — column parallax (desktop only)
if (window.matchMedia('(hover: hover)').matches) {
  const galCols = document.querySelectorAll('.gallery-col');
  const rates = [0, -30, 30];
  let rAF = false;
  window.addEventListener('scroll', () => {
    if (rAF) return;
    rAF = true;
    requestAnimationFrame(() => {
      const sec = document.getElementById('gallery');
      if (sec) {
        const top = sec.getBoundingClientRect().top;
        const prog = -top / window.innerHeight;
        if (prog > -1 && prog < 4) {
          galCols.forEach((c, i) => { c.style.transform = `translateY(${rates[i] * prog}px)`; });
        }
      }
      rAF = false;
    });
  }, { passive: true });
}

// Gallery lightbox — shared element (iOS Photos style)
const lightbox = document.getElementById('lightbox');
const lbMedia = document.getElementById('lbMedia');
let lbIndex = 0;
const SPRING = 'cubic-bezier(0.32, 0.72, 0, 1)';

function lbOpen(index) {
  lbIndex = index;
  const item = galleryItems[index];
  const rect = item.getBoundingClientRect();

  lbMedia.innerHTML = '';
  if (item.dataset.type === 'video') {
    const v = document.createElement('video');
    v.src = item.dataset.src; v.controls = true; v.autoplay = true;
    lbMedia.appendChild(v);
  } else {
    const img = document.createElement('img');
    img.src = item.dataset.src;
    img.alt = item.querySelector('img')?.alt || '';
    lbMedia.appendChild(img);
  }

  Object.assign(lbMedia.style, {
    position: 'fixed', left: rect.left + 'px', top: rect.top + 'px',
    width: rect.width + 'px', height: rect.height + 'px',
    borderRadius: '12px', overflow: 'hidden', transition: 'none',
    transform: '', maxWidth: '', maxHeight: ''
  });
  lightbox.style.cssText = 'opacity:1;pointer-events:all;background:rgba(0,0,0,0);transition:none;';
  lightbox.classList.add('open');

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const tw = Math.min(window.innerWidth * 0.92, 1100);
    Object.assign(lbMedia.style, {
      transition: `all 0.52s ${SPRING}`,
      left: '50%', top: '50%',
      width: tw + 'px', height: 'auto',
      transform: 'translate(-50%, -50%)',
      borderRadius: '16px'
    });
    lightbox.style.transition = `background 0.4s`;
    lightbox.style.background = 'rgba(0,0,0,0.92)';
    document.body.style.overflow = 'hidden';
  }));
}

function lbClose() {
  const item = galleryItems[lbIndex];
  const rect = item.getBoundingClientRect();
  Object.assign(lbMedia.style, {
    transition: `all 0.42s ${SPRING}`,
    left: rect.left + 'px', top: rect.top + 'px',
    width: rect.width + 'px', height: rect.height + 'px',
    transform: '', borderRadius: '12px'
  });
  lightbox.style.transition = 'background 0.35s';
  lightbox.style.background = 'rgba(0,0,0,0)';
  setTimeout(() => {
    lightbox.classList.remove('open');
    lightbox.style.cssText = '';
    lbMedia.style.cssText = '';
    lbMedia.innerHTML = '';
    document.body.style.overflow = '';
  }, 420);
}

function lbNav(dir) { lbOpen((lbIndex + dir + galleryItems.length) % galleryItems.length); }

document.querySelectorAll('.gallery-item').forEach(el =>
  el.addEventListener('click', () => lbOpen(+el.dataset.index))
);
document.getElementById('lbClose').addEventListener('click', lbClose);
document.getElementById('lbPrev').addEventListener('click', () => lbNav(-1));
document.getElementById('lbNext').addEventListener('click', () => lbNav(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lbClose(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') lbClose();
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

// Lightbox swipe (mobile)
let swipeX = null;
lightbox.addEventListener('touchstart', e => { swipeX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (swipeX === null) return;
  const dx = e.changedTouches[0].clientX - swipeX;
  if (Math.abs(dx) > 48) lbNav(dx < 0 ? 1 : -1);
  swipeX = null;
}, { passive: true });

// Lazy-load videos: assign src only when near viewport, pause when far away
const videoIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target.querySelector('video');
    if (!v) return;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}, { threshold: 0.05, rootMargin: '300px' });
document.querySelectorAll('.gallery-item').forEach(el => videoIO.observe(el));

// Contact form
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  note.hidden = false;
  form.querySelector('button[type="submit"]').textContent = 'Sent ✓';
  form.reset();
});
