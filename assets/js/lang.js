(() => {
  const current = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pl';
  let preferred = null;
  try { preferred = localStorage.getItem('soroban-language'); } catch (_) {}

  const swapPath = (to) => {
    const path = location.pathname;
    const hash = location.hash || '';
    const plToEn = [
      [/\/rodzice\.html$/, '/en/parents.html'],
      [/\/o-stronie\.html$/, '/en/about.html'],
      [/\/prywatnosc\.html$/, '/en/privacy.html'],
      [/\/index\.html$/, '/en/'],
      [/\/$/, '/en/']
    ];
    const enToPl = [
      [/\/en\/parents\.html$/, '/rodzice.html'],
      [/\/en\/about\.html$/, '/o-stronie.html'],
      [/\/en\/privacy\.html$/, '/prywatnosc.html'],
      [/\/en\/index\.html$/, '/'],
      [/\/en\/$/, '/']
    ];
    const list = to === 'en' ? plToEn : enToPl;
    for (const [re, replacement] of list) {
      if (re.test(path)) return path.replace(re, replacement) + hash;
    }
    return null;
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lang-choice]').forEach(a => {
      a.addEventListener('click', () => {
        try { localStorage.setItem('soroban-language', a.dataset.langChoice); } catch (_) {}
      });
    });
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    if ((preferred === 'pl' || preferred === 'en') && preferred !== current && location.protocol !== 'file:') {
      const target = swapPath(preferred);
      if (target) location.replace(target);
    }
  });
})();
