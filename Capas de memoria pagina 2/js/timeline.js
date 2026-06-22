(function () {
'use strict';

/* ── 1. Filtro de capas (dropdown) ── */
function initFiltro() {
  var btn   = document.getElementById('filtro-capas-btn');
  var menu  = document.getElementById('filtro-capas-menu');
  var label = document.getElementById('filtro-capas-label');
  var items = document.querySelectorAll('.timeline-lista .timeline-item');

  if (!btn || !menu) return;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var abierto = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!abierto));
    menu.hidden = abierto;
  });

  menu.querySelectorAll('.filtro-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var valor = opt.getAttribute('data-value');
      var texto = opt.textContent.trim();

      if (label) label.textContent = texto;

      menu.querySelectorAll('.filtro-option').forEach(function (o) {
        o.setAttribute('aria-selected', 'false');
        o.classList.remove('filtro-option--active');
      });
      opt.setAttribute('aria-selected', 'true');
      opt.classList.add('filtro-option--active');

      btn.setAttribute('aria-expanded', 'false');
      menu.hidden = true;

      filtrarItems(valor, items);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function filtrarItems(valor, items) {
  items.forEach(function (item) {
    var capa = item.getAttribute('data-capa');
    var visible = valor === 'all' || capa === valor;
    item.style.display = visible ? '' : 'none';
    if (visible && !item.classList.contains('is-visible')) {
      setTimeout(function () { item.classList.add('is-visible'); }, 80);
    }
  });
}

/* ── 2. Scroll reveal (con red de seguridad) ── */
function initScrollReveal() {
  var items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  document.documentElement.classList.add('js-reveal-ready');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  items.forEach(function (el) { observer.observe(el); });

  // Red de seguridad: si por cualquier motivo el observer no llega a marcar
  // algunos items (timing, navegadores raros, render headless, etc.),
  // los forzamos visibles igual después de un instante.
  setTimeout(function () {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }, 800);
}

/* ── 3. Scroll automático al hito destacado ── */
function scrollAlActual() {
  var actual = document.getElementById('hito-actual');
  if (!actual) return;
  setTimeout(function () {
    actual.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500);
}

/* ── 4. Resaltar hito desde ?highlight=YYYY ── */
function resaltarDesdeParams() {
  var params = new URLSearchParams(window.location.search);
  var year = params.get('highlight');
  if (!year) return;
  var target = document.querySelector('.timeline-item[data-year="' + year + '"]');
  if (!target) return;
  target.classList.add('timeline-item--destacado');
  setTimeout(function () {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function () {
  initFiltro();
  initScrollReveal();
  resaltarDesdeParams();
  scrollAlActual();
});

})();