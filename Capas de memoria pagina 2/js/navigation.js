/* =========================================================
   CAPAS DE MEMORIA — navigation.js
   Menú mobile, estados activos, menú desplegable desktop
   ========================================================= */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────
     1. ACTIVE STATE en bottom-nav y top-nav
     Marca el ítem correspondiente a la página actual
  ────────────────────────────────────────────────────── */
  function marcarPaginaActual() {
    const ruta = window.location.pathname.split('/').pop() || 'index.html';

    // Bottom nav
    document.querySelectorAll('.bnav-item').forEach(function (el) {
      const href = el.getAttribute('href') || '';
      const esActual = href === ruta || (ruta === '' && href === 'index.html');
      el.classList.toggle('is-active', esActual);
      if (esActual) el.setAttribute('aria-current', 'page');
      else          el.removeAttribute('aria-current');
    });

    // Top nav
    document.querySelectorAll('.topbar-link').forEach(function (el) {
      const href = el.getAttribute('href') || '';
      if (href === ruta || (ruta === '' && href === 'index.html')) {
        el.classList.add('is-active');
        el.setAttribute('aria-current', 'page');
      }
    });
  }



  /* ──────────────────────────────────────────────────────
     3. PROGRESS — restaurar estado desde localStorage
  ────────────────────────────────────────────────────── */
  window.ProgresoModule = {
    STORAGE_KEY: 'capas_nodos_visitados',

    getVisitados: function () {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      } catch (_) { return []; }
    },

    marcarVisitado: function (id) {
      const lista = this.getVisitados();
      if (!lista.includes(String(id))) {
        lista.push(String(id));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lista));
      }
    },

    getPorcentaje: function () {
      return Math.round((this.getVisitados().length / 14) * 100);
    },

    reset: function () {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  };

  /* ──────────────────────────────────────────────────────
     4. PROGRESO SEGMENTADA — renderiza en cualquier página
  ────────────────────────────────────────────────────── */
  function renderizarProgreso() {
    const contenedores = document.querySelectorAll('.progreso-segmentos');
    if (!contenedores.length) return;

    const visitados  = window.ProgresoModule.getVisitados();
    const pct        = window.ProgresoModule.getPorcentaje();

    contenedores.forEach(function (cont) {
      // Generar 14 segmentos si no existen
      if (!cont.querySelector('.progreso-seg')) {
        for (let i = 1; i <= 14; i++) {
          const seg = document.createElement('div');
          seg.classList.add('progreso-seg');
          seg.setAttribute('aria-hidden', 'true');
          cont.appendChild(seg);
        }
      }

      const segs = cont.querySelectorAll('.progreso-seg');
      segs.forEach(function (seg, i) {
        const id = String(i + 1).padStart(2, '0');
        seg.classList.toggle('is-done', visitados.includes(id));
      });

      // Actualizar aria
      cont.setAttribute('aria-valuenow', pct);
    });

    // Actualizar textos
    const countEl = document.getElementById('nodos-visitados-count');
    const pctEl   = document.getElementById('progreso-pct');
    if (countEl) countEl.textContent = visitados.length;
    if (pctEl)   pctEl.textContent   = pct + '%';
  }

  /* ──────────────────────────────────────────────────────
     5. SMOOTH SCROLL para anclas internas
  ────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id     = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Foco para accesibilidad
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ──────────────────────────────────────────────────────
     6. INIT
  ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    marcarPaginaActual();
    initMenuMobile();
    renderizarProgreso();
    initSmoothScroll();
  });

})();
