const ready = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  const setNavState = (open) => {
    if (!nav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', open);
    nav.classList.toggle('open', open);
    body.classList.toggle('nav-open', open);
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      setNavState(!expanded);
    });

    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('open')) return;
      if (event.target === navToggle || nav.contains(event.target)) {
        return;
      }
      setNavState(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setNavState(false);
        navToggle.focus();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 680) {
          setNavState(false);
        }
      });
    });
  }

  const updateHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length === 0) return;
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener(
          'blur',
          () => target.removeAttribute('tabindex'),
          { once: true }
        );
      }
    });
  });

  const year = document.getElementById('current-year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
};

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ready) : ready();
