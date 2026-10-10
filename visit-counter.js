/* Compteur de visites de la page d'accueil.
 * - 1 visite = 1 session de navigation (sessionStorage) : un rechargement ne gonfle pas le total.
 * - Si la fonction Netlify est indisponible, la pastille reste masquée (pas d'affichage cassé).
 */
(function () {
  'use strict';

  var ENDPOINT = '/.netlify/functions/visits';
  var SESSION_KEY = 'cbh_visit_counted';

  var box = document.getElementById('visit-counter');
  if (!box) return;
  var valueEl = document.getElementById('visit-counter-value');
  var srEl = document.getElementById('visit-counter-sr');
  var total = null;

  function locale() {
    var lang = document.documentElement.getAttribute('lang');
    if (lang === 'ar') return 'ar-u-nu-latn'; // chiffres 0-9 même en arabe
    if (lang === 'en') return 'en-US';
    return 'fr-FR';
  }
  function format(n) {
    try { return new Intl.NumberFormat(locale()).format(n); }
    catch (e) { return String(n); }
  }

  function alreadyCounted() {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; }
    catch (e) { return false; }
  }
  function markCounted() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
  }

  function request(method) {
    return fetch(ENDPOINT, { method: method, cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var n = Number(data && data.visits);
        if (!isFinite(n) || n < 0) throw new Error('Réponse invalide');
        return n;
      });
  }

  function countUp(to) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to < 2) { valueEl.textContent = format(to); return; }
    var duration = 1200, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      valueEl.textContent = format(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function show(n) {
    total = n;
    srEl.textContent = format(n);
    box.hidden = false;
    // Double rAF : laisse le navigateur peindre l'état initial avant la transition d'apparition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { box.classList.add('is-ready'); });
    });
    countUp(n);
  }

  // Mise à jour du format des chiffres quand la langue change (FR / EN / AR)
  window.addEventListener('site-language-changed', function () {
    if (total === null) return;
    valueEl.textContent = format(total);
    srEl.textContent = format(total);
  });

  var method = alreadyCounted() ? 'GET' : 'POST';
  request(method)
    .then(function (n) { if (method === 'POST') markCounted(); return n; })
    .catch(function (err) {
      if (method === 'POST') return request('GET'); // au pire, afficher le total sans l'incrémenter
      throw err;
    })
    .then(show)
    .catch(function () { /* compteur indisponible : on n'affiche rien */ });
})();
