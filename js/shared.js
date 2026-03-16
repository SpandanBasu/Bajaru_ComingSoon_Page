/**
 * Shared scripts for Bajaru pages
 * - Scroll reveal animation (IntersectionObserver)
 * - Page-specific logic runs after components load
 */
(function () {
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) { io.observe(el); });
  }

  function initAboutPage() {
    var grids = document.querySelectorAll('[style*="grid-template-columns:1fr 1fr"]');
    if (!grids.length) return;

    function handleResize() {
      var cols = window.innerWidth <= 1024 ? '1fr' : '1fr 1fr';
      grids.forEach(function (g) { g.style.gridTemplateColumns = cols; });
    }
    if (window.innerWidth <= 1024) handleResize();
    window.addEventListener('resize', handleResize);
  }

  function initDownloadPage() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });

    /* appFeatGrid layout now handled by CSS media queries */
  }

  function init() {
    initReveal();

    var path = window.location.pathname;
    if (path.endsWith('about.html')) initAboutPage();
    if (path.endsWith('download.html')) initDownloadPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
