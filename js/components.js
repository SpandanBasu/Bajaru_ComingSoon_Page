/**
 * Client-side component loader for Bajaru
 * Loads navbar, mobile menu, and footer from components/ and injects them.
 * Sets active nav state based on current page.
 */
(function () {
  const basePath = './components/';

  function getCurrentPage() {
    const path = window.location.pathname;
    const last = path.split('/').filter(Boolean).pop() || 'index.html';
    const base = last.replace(/\.html$/i, '') || 'index';
    if (base === 'about') return 'about';
    if (base === 'careers') return 'careers';
    if (base === 'download') return 'download';
    return 'home';
  }

  function setActiveNav(container, page) {
    if (!container) return;
    container.querySelectorAll('[data-nav]').forEach(function (el) {
      var isActive = el.getAttribute('data-nav') === page;
      el.classList.toggle('active', isActive);
    });
  }

  function fixDownloadPageCta(container) {
    if (getCurrentPage() !== 'download') return;
    const cta = container.querySelector('#navCta');
    const mobileCta = container.querySelector('#mobileCta');
    if (cta) cta.href = '#download-links';
    if (mobileCta) mobileCta.href = '#download-links';
  }

  function loadComponent(id, file) {
    return fetch(basePath + file)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var placeholder = document.getElementById(id);
        if (placeholder) placeholder.outerHTML = html;
      });
  }

  function init() {
    Promise.all([
      loadComponent('navbar-placeholder', 'navbar.html'),
      loadComponent('mobile-menu-placeholder', 'mobile-menu.html'),
      loadComponent('footer-placeholder', 'footer.html')
    ]).then(function (results) {
      var navbar = document.getElementById('navbar');
      var mobileMenu = document.getElementById('mobileMenu');
      var currentPage = getCurrentPage();

      setActiveNav(document.body, currentPage);
      fixDownloadPageCta(document.body);

      if (navbar) {
        window.addEventListener('scroll', function () {
          navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
      }

      var hamburger = document.getElementById('hamburger');
      if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
          var open = mobileMenu.classList.toggle('open');
          hamburger.classList.toggle('open', open);
        });
      }
    }).catch(function (err) {
      console.error('Failed to load components:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Update active state when page is restored from back/forward cache
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && document.getElementById('navbar')) {
      setActiveNav(document.body, getCurrentPage());
    }
  });
})();
