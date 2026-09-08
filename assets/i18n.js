/* ============================================================
   Shared trilingual (FR / EN / AR) chrome dictionary.
   Applies to nav, footer, buttons and other UI chrome that is
   identical across pages. Page-specific long-form content (hero
   copy, article bodies from the CMS, etc.) is handled per-page.
   ============================================================ */
(function (global) {
  var DICT = {
    fr: {
      dir: 'ltr',
      nav_home: 'Portfolio',
      nav_news: 'Actualités',
      nav_apps: 'Applications',
      nav_prevention: 'Prévention',
      nav_articles: 'Articles',
      nav_newsletter: 'Newsletter',
      nav_subscribe: "S'abonner",
      footer_legal: 'Mentions légales',
      footer_contact: 'Contact',
      breadcrumb_news: 'actualités',
      breadcrumb_articles: 'articles',
      newsletter_email_placeholder: 'votre@email.com',
      newsletter_sending: 'Inscription…',
      newsletter_success: 'Merci ! Votre inscription est confirmée.',
      newsletter_error: 'Une erreur est survenue, réessayez dans un instant.',
      lang_note_fr: 'Contenu rédigé en français',
      discover: 'Découvrir',
      back_to_articles: "Retour aux actualités",
      not_found_title: 'Article introuvable',
      not_found_body: "Cet article n'existe pas ou plus.",
      load_error: 'Impossible de charger le contenu pour le moment.'
    },
    en: {
      dir: 'ltr',
      nav_home: 'Portfolio',
      nav_news: 'News',
      nav_apps: 'Applications',
      nav_prevention: 'Prevention',
      nav_articles: 'Articles',
      nav_newsletter: 'Newsletter',
      nav_subscribe: 'Subscribe',
      footer_legal: 'Legal notice',
      footer_contact: 'Contact',
      breadcrumb_news: 'news',
      breadcrumb_articles: 'articles',
      newsletter_email_placeholder: 'you@email.com',
      newsletter_sending: 'Subscribing…',
      newsletter_success: 'Thanks! Your subscription is confirmed.',
      newsletter_error: 'Something went wrong, please try again shortly.',
      lang_note_fr: 'Content written in French',
      discover: 'Discover',
      back_to_articles: 'Back to news',
      not_found_title: 'Article not found',
      not_found_body: 'This article no longer exists.',
      load_error: 'Unable to load this content right now.'
    },
    ar: {
      dir: 'rtl',
      nav_home: 'السيرة الذاتية',
      nav_news: 'الأخبار',
      nav_apps: 'التطبيقات',
      nav_prevention: 'الوقاية',
      nav_articles: 'المقالات',
      nav_newsletter: 'النشرة الإخبارية',
      nav_subscribe: 'اشترك',
      footer_legal: 'إشعار قانوني',
      footer_contact: 'تواصل',
      breadcrumb_news: 'الأخبار',
      breadcrumb_articles: 'المقالات',
      newsletter_email_placeholder: 'بريدك الإلكتروني',
      newsletter_sending: 'جارٍ الاشتراك…',
      newsletter_success: 'شكرا لك! تم تأكيد اشتراكك.',
      newsletter_error: 'حدث خطأ ما، يرجى إعادة المحاولة بعد قليل.',
      lang_note_fr: 'محتوى مكتوب باللغة الفرنسية',
      discover: 'اكتشف',
      back_to_articles: 'العودة إلى الأخبار',
      not_found_title: 'المقال غير موجود',
      not_found_body: 'هذا المقال لم يعد موجودا.',
      load_error: 'تعذر تحميل المحتوى حاليا.'
    }
  };

  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem('site-lang'); } catch (e) {}
    return saved && DICT[saved] ? saved : 'fr';
  }

  function setLang(lang) {
    if (!DICT[lang]) lang = 'fr';
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
    var d = DICT[lang];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', d.dir);
    document.body.classList.toggle('lang-ar', lang === 'ar');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (d[key] !== undefined) el.textContent = d[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (d[key] !== undefined) el.setAttribute('placeholder', d[key]);
    });
    document.querySelectorAll('.langswitch button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    if (typeof global.onLangChange === 'function') global.onLangChange(lang, d);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang, dict: d } }));
  }

  function initLangSwitcher() {
    document.querySelectorAll('.langswitch button').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
    });
    setLang(getLang());
  }

  global.i18n = { DICT: DICT, getLang: getLang, setLang: setLang, initLangSwitcher: initLangSwitcher };
})(window);
