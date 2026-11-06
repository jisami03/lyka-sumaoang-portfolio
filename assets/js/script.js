// Mobile menu toggle and placeholder-link handling.
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('open', open);
}

toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Placeholder links should not jump to the top of the page.
document.querySelectorAll('[data-placeholder]').forEach(a =>
  a.addEventListener('click', e => e.preventDefault()));

// Reveal sections as they scroll into view (content stays visible if animation is unavailable).
const reveals = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach(el => revealObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in-view'));
}

// Highlight the nav link of the section currently in view.
if ('IntersectionObserver' in window) {
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.removeAttribute('aria-current'));
      const active = links.find(l => l.getAttribute('href') === '#' + entry.target.id);
      if (active) active.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) navObserver.observe(s); });
}

// Give the floating header a shadow once the page scrolls.
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();