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
