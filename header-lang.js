(function () {
  // Nom de la page courante, robuste : "/", "/applications", "/applications/", "/applications.html"
  var currentFile = (window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'index').toLowerCase();
  var currentPage = currentFile.replace(/\.html$/, '');
  var currentHash = window.location.hash.toLowerCase();
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    var hrefPage = href.split('#')[0].replace(/\.html$/, '');
    var active = false;
    if (currentPage === 'index' && hrefPage === 'index') active = true;
    if (currentPage === 'applications' && hrefPage === 'applications') active = true;
    if (currentPage === 'article' && href.indexOf('#articles') !== -1) active = true;
    if (currentPage === 'actualites') {
      if (currentHash && href === 'actualites.html' + currentHash) active = true;
      if (!currentHash && href.indexOf('#articles') !== -1) active = true;
    }
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
  });

  // Ouverture / fermeture du menu déroulant de langue (toutes les pages).
  document.querySelectorAll('[data-lang-dropdown]').forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.lang-trigger');
    var menu = dropdown.querySelector('.lang-menu');
    if (!trigger || !menu) return;

    function closeMenu() {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
    }
    function openMenu() {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('open');
    }

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });
    menu.addEventListener('click', function (event) { event.stopPropagation(); });
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  });

  var buttons = document.querySelectorAll('.lang-menu .lang-option[data-lang]');
  var isPortfolio = document.getElementById('projects-grid') !== null;
  if (isPortfolio) return;
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var lang = button.getAttribute('data-lang');
      window.location.href = 'index.html?lang=' + encodeURIComponent(lang);
    });
  });
})();

/* Menu : met en évidence la page (et la section) en cours, sans dépendre d'une classe écrite à la main. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href]'));
  if (!links.length) return;
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (file === 'article.html') file = 'actualites.html';
  function target(a) { var u = new URL(a.getAttribute('href'), location.href); return { file: (u.pathname.split('/').pop() || 'index.html').toLowerCase(), hash: u.hash.replace('#', '') }; }
  function setActive(hash) {
    var samePage = links.filter(function (a) { return target(a).file === file; });
    var chosen = samePage.filter(function (a) { return target(a).hash === hash; })[0] || samePage[0];
    links.forEach(function (a) {
      var on = a === chosen;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  setActive(location.hash.replace('#', ''));
  window.addEventListener('hashchange', function () { setActive(location.hash.replace('#', '')); });
  // Page Actualités : suit la section visible à l'écran (Articles / Prévention / Newsletter).
  if (file === 'actualites.html' && 'IntersectionObserver' in window) {
    var ids = ['piliers', 'articles', 'newsletter'], seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = ids.reduce(function (m, id) { return (seen[id] || 0) > (seen[m] || 0) ? id : m; }, ids[0]);
      if (seen[best] > 0) setActive(best);
    }, { rootMargin: '-90px 0px -45% 0px', threshold: [0, .1, .25, .5, .75, 1] });
    ids.forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
