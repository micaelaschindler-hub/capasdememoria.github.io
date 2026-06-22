/* =========================================================
   CAPAS DE MEMORIA — interactions.js
   Scrollytelling del index, comparador antes/después,
   audio player, lightbox, scroll reveal global,
   carga de contenido del nodo por URL params.
   ========================================================= */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
   1. LAYER STACK — carrusel + separación por scroll
   index.html
══════════════════════════════════════════════════════ */
function initLayerStack() {
  var scene = document.querySelector('[data-scroll-scene="intro"]');
  var stack = document.getElementById('layerStack');
  if (!scene || !stack) return;

  var cards = Array.from(stack.querySelectorAll('.layer-card'));
  var dots  = Array.from(document.querySelectorAll('.carousel-dot'));
  if (!cards.length) return;

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Orden visual actual: order[0] = índice de la card al FRENTE, order[1] = medio, order[2] = fondo.
  // Por defecto: cards[2] (Capa actual) al frente, igual que el diseño original.
  var order = [2, 1, 0];
  var progresoScroll = 0;

  var BASE = [
    { y: 0,  x: 0,  r: 0,    op: 1    },
    { y: 10, x: 5,  r: -0.4, op: 0.92 },
    { y: 20, x: 10, r: -0.8, op: 0.82 }
  ];
  var SCROLL_EXTRA = [
    { y: 0,  x: 0  },
    { y: 40, x: 10 },
    { y: 60, x: 20 }
  ];

  function render() {
    order.forEach(function (cardIdx, pos) {
      var card  = cards[cardIdx];
      var base  = BASE[pos];
      var extra = SCROLL_EXTRA[pos];
      var y  = base.y + extra.y * progresoScroll;
      var x  = base.x + extra.x * progresoScroll;
      var op = pos === 0 ? 1 : Math.max(0.3, base.op - (pos === 1 ? 0.2 : 0.3) * progresoScroll);

      card.style.transform = 'translateY(' + y + 'px) translateX(' + x + 'px) rotate(' + base.r + 'deg)';
      card.style.opacity   = op;
      card.style.zIndex    = 3 - pos;
      card.setAttribute('aria-current', pos === 0 ? 'true' : 'false');
    });

    dots.forEach(function (dot) {
      var idx = Number(dot.getAttribute('data-card-index'));
      var activa = order[0] === idx;
      dot.classList.toggle('is-active', activa);
      dot.setAttribute('aria-selected', activa);
    });
  }

  function traerAlFrente(cardIdx) {
    var pos = order.indexOf(cardIdx);
    if (pos <= 0) return;
    order.splice(pos, 1);
    order.unshift(cardIdx);
    render();
  }

  // Click / teclado en cada card
  cards.forEach(function (card, idx) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', function () { traerAlFrente(idx); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        traerAlFrente(idx);
      }
    });
  });

  // Click en los dots
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      traerAlFrente(Number(dot.getAttribute('data-card-index')));
    });
  });

  // Swipe táctil sobre el stack (mobile)
  var touchStartX = null;
  stack.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  stack.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var deltaX = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(deltaX) < 40) return;

    var frente = order[0];
    var siguiente = deltaX < 0
      ? (frente + 1) % cards.length
      : (frente - 1 + cards.length) % cards.length;
    traerAlFrente(siguiente);
  }, { passive: true });

  // Separación progresiva por scroll (se suma al efecto del carrusel)
  if (!reducido) {
    window.addEventListener('scroll', function () {
      var sceneTop = scene.offsetTop;
      var sceneH   = scene.offsetHeight;
      progresoScroll = Math.max(0, Math.min(1, (window.scrollY - sceneTop) / (sceneH * 0.5)));
      render();
    }, { passive: true });
  }

  render();
}

  /* ══════════════════════════════════════════════════════
     2. SCROLL REVEAL GLOBAL
     Cualquier elemento con clase .reveal
  ══════════════════════════════════════════════════════ */
  function initScrollRevealGlobal() {
    var targets = document.querySelectorAll('.reveal, .preview-card, .capa-pill, .data-item');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(function (el) { obs.observe(el); });
  }

  /* ══════════════════════════════════════════════════════
     3. COMPARADOR ANTES / DESPUÉS
     Funciona para nodo.html y archivo.html
  ══════════════════════════════════════════════════════ */
  function initComparadores() {
    document.querySelectorAll('.comparador-wrap').forEach(function (wrap) {
      var divisor   = wrap.querySelector('.comp-divisor');
      var ladoPasado = wrap.querySelector('.comp-lado--pasado');
      var hint      = wrap.querySelector('.comp-hint');
      if (!divisor || !ladoPasado) return;

      var arrastrando   = false;
      var posicionActual = 50; // porcentaje

      function moverA(pct) {
        pct = Math.max(5, Math.min(95, pct));
        posicionActual = pct;
        divisor.style.left          = pct + '%';
        ladoPasado.style.width      = pct + '%';
        divisor.setAttribute('aria-valuenow', Math.round(pct));
        // Ocultar hint al primer movimiento
        if (hint) { hint.style.display = 'none'; }
      }

      function getPct(clientX) {
        var rect  = wrap.getBoundingClientRect();
        var relX  = clientX - rect.left;
        return (relX / rect.width) * 100;
      }

      // Mouse
      divisor.addEventListener('mousedown', function (e) {
        e.preventDefault();
        arrastrando = true;
        document.body.style.cursor = 'ew-resize';
      });

      document.addEventListener('mousemove', function (e) {
        if (!arrastrando) return;
        moverA(getPct(e.clientX));
      });

      document.addEventListener('mouseup', function () {
        if (arrastrando) {
          arrastrando = false;
          document.body.style.cursor = '';
        }
      });

      // Touch
      divisor.addEventListener('touchstart', function (e) {
        arrastrando = true;
      }, { passive: true });

      document.addEventListener('touchmove', function (e) {
        if (!arrastrando) return;
        moverA(getPct(e.touches[0].clientX));
      }, { passive: true });

      document.addEventListener('touchend', function () {
        arrastrando = false;
      });

      // Teclado (accesibilidad)
      divisor.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  moverA(posicionActual - 5);
        if (e.key === 'ArrowRight') moverA(posicionActual + 5);
        if (e.key === 'Home')       moverA(5);
        if (e.key === 'End')        moverA(95);
      });

      // Clic en la imagen también mueve el divisor
      wrap.addEventListener('click', function (e) {
        if (e.target.closest('.comp-divisor')) return;
        moverA(getPct(e.clientX));
      });

      // Inicializar
      moverA(50);
    });
  }

  /* ══════════════════════════════════════════════════════
     4. AUDIO PLAYER
  ══════════════════════════════════════════════════════ */
  function initAudioPlayer() {
    var playBtn      = document.getElementById('audio-play-btn');
    var audioEl      = document.getElementById('audio-elemento');
    var fill         = document.getElementById('audio-fill');
    var thumb        = document.getElementById('audio-thumb');
    var currentEl    = document.getElementById('audio-current');
    var barra        = document.querySelector('.audio-barra');
    var ccBtn        = document.getElementById('btn-cc');
    var subtitulos   = document.getElementById('audio-subtitulos');
    var transcBtn    = document.getElementById('btn-transcript');
    var transcripcion = document.getElementById('audio-transcripcion');
    var toggleCC     = document.getElementById('toggle-transcripcion');

    if (!playBtn || !audioEl) return;

    var isPlaying = false;

    function formatTiempo(seg) {
      var m = Math.floor(seg / 60);
      var s = Math.floor(seg % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // Play/Pause
    playBtn.addEventListener('click', function () {
      if (isPlaying) {
        audioEl.pause();
        isPlaying = false;
        playBtn.setAttribute('aria-pressed', 'false');
        playBtn.setAttribute('aria-label', 'Reproducir testimonio');
        playBtn.closest('.audio-player').classList.remove('is-playing');
      } else {
        audioEl.play().catch(function () {
          /* Audio no disponible aún — placeholder */
        });
        isPlaying = true;
        playBtn.setAttribute('aria-pressed', 'true');
        playBtn.setAttribute('aria-label', 'Pausar testimonio');
        playBtn.closest('.audio-player').classList.add('is-playing');
      }
    });

    // Actualizar barra de progreso mientras reproduce
    audioEl.addEventListener('timeupdate', function () {
      if (!audioEl.duration) return;
      var pct = (audioEl.currentTime / audioEl.duration) * 100;
      if (fill)  fill.style.width = pct + '%';
      if (thumb) thumb.style.left = pct + '%';
      if (currentEl) currentEl.textContent = formatTiempo(audioEl.currentTime);
    });

    // Al terminar
    audioEl.addEventListener('ended', function () {
      isPlaying = false;
      playBtn.setAttribute('aria-pressed', 'false');
      playBtn.closest('.audio-player').classList.remove('is-playing');
    });

    // Clic en la barra de progreso para seekear
    if (barra) {
      barra.addEventListener('click', function (e) {
        if (!audioEl.duration) return;
        var rect = barra.getBoundingClientRect();
        var pct  = (e.clientX - rect.left) / rect.width;
        audioEl.currentTime = pct * audioEl.duration;
      });
    }

    // CC / Subtítulos
    if (ccBtn && subtitulos) {
      ccBtn.addEventListener('click', function () {
        var activo = ccBtn.getAttribute('aria-pressed') === 'true';
        ccBtn.setAttribute('aria-pressed', !activo);
        subtitulos.hidden = activo;
      });
    }

    // Toggle CC alternativo (en nodo.html)
    if (toggleCC && subtitulos) {
      toggleCC.addEventListener('change', function () {
        subtitulos.hidden = !toggleCC.checked;
        subtitulos.setAttribute('aria-hidden', !toggleCC.checked);
      });
    }

    // Transcripción completa
    if (transcBtn && transcripcion) {
      transcBtn.addEventListener('click', function () {
        var exp = transcBtn.getAttribute('aria-expanded') === 'true';
        transcBtn.setAttribute('aria-expanded', !exp);
        transcripcion.open = !exp;
      });
    }
  }

  /* ══════════════════════════════════════════════════════
     5. LIGHTBOX
  ══════════════════════════════════════════════════════ */
  function initLightbox() {
    var lightbox  = document.getElementById('lightbox');
    var overlay   = document.getElementById('lightbox-overlay');
    var closeBtn  = document.getElementById('lightbox-close');
    var contenido = document.getElementById('lightbox-contenido');
    var caption   = document.getElementById('lightbox-caption');
    var prevBtn   = document.getElementById('lightbox-prev');
    var nextBtn   = document.getElementById('lightbox-next');

    if (!lightbox) return;

    // Recoger todos los items con lightbox
    var triggers = Array.from(document.querySelectorAll('[data-lightbox]'));
    var indiceActual = 0;

    function abrirEn(idx) {
      indiceActual = idx;
      var trigger  = triggers[idx];
      if (!trigger) return;

      // Contenido
      if (contenido) {
        contenido.innerHTML = trigger.innerHTML;
      }

      // Caption desde figcaption del padre
      var fig = trigger.closest('.archivo-item');
      if (caption && fig) {
        var cap = fig.querySelector('.archivo-item__caption');
        caption.innerHTML = cap ? cap.innerHTML : '';
      }

      lightbox.hidden  = false;
      overlay.hidden   = false;
      document.body.style.overflow = 'hidden';

      // Foco al cierre
      if (closeBtn) closeBtn.focus();
    }

    function cerrar() {
      lightbox.hidden = true;
      overlay.hidden  = true;
      document.body.style.overflow = '';
      var trigger = triggers[indiceActual];
      if (trigger) trigger.focus();
    }

    // Abrir desde botón de archivo
    triggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', function () {
        abrirEn(i);
      });
    });

    // Abrir desde botón de documento en nodo.html
    var btnDoc = document.getElementById('btn-ampliar-doc');
    var btnDocZoom = document.getElementById('btn-doc-zoom');
    [btnDoc, btnDocZoom].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        lightbox.hidden = false;
        overlay.hidden  = false;
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', cerrar);
    if (overlay)  overlay.addEventListener('click', cerrar);

    // Navegación
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        abrirEn((indiceActual - 1 + triggers.length) % triggers.length);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        abrirEn((indiceActual + 1) % triggers.length);
      });
    }

    // Teclado
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape')     cerrar();
      if (e.key === 'ArrowLeft')  prevBtn && prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
    });
  }

  /* ══════════════════════════════════════════════════════
     6. CARGA DE CONTENIDO DEL NODO desde URL params
     nodo.html?id=04 → rellena título, badge, descripción, etc.
  ══════════════════════════════════════════════════════ */
  var NODOS_CONTENIDO = {
    '01': {
      titulo:   'Fachada principal — Av. Hipólito Yrigoyen',
      capa:     'Capa I — El encierro',
      capaCss:  '1',
      fecha:    '1868 — 1983',
      tipo:     'Acceso principal',
      texto:    ['La fachada neoclásica del complejo mira hacia la Avenida Hipólito Yrigoyen. Su arquitectura monumental comunica autoridad y permanencia. Fue el umbral de entrada y salida de miles de mujeres durante más de un siglo de encierro.', 'Hoy ese mismo frente es la puerta al Paseo del Buen Pastor: mismo umbral, memorias distintas.'],
      nota:     'Durante la dictadura, familiares de detenidas políticas esperaban frente a esta fachada sin poder ingresar ni obtener información.',
      audioCita:'[PLACEHOLDER — Frase cita del testimonio sobre la fachada]',
      audioTotal:'03:12',
      docNombre:'Fotografía aérea del complejo, circa 1920',
      docFuente:'Archivo Histórico de la Provincia de Córdoba',
      reflexion:'¿Qué ves al cruzar este umbral que no veías antes?',
      sigId:    '02'
    },
    '04': {
      titulo:   'Patio de las Celdas',
      capa:     'Capa I — El encierro',
      capaCss:  '1',
      fecha:    '1900 — 1975',
      tipo:     'Lugar de tránsito',
      texto:    ['Espacio estratégico donde las internas circulaban diariamente hacia los distintos pabellones. Área de vigilancia, control y circulación permanente dentro del complejo carcelario.', 'Este espacio funcionó también como punto de encuentro y de transmisión de información entre las detenidas políticas.'],
      nota:     'Este espacio funcionó como punto de control durante la prisión política.',
      audioCita:'"El Patio era el lugar de paso... y también de encuentro."',
      audioTotal:'03:45',
      docNombre:'Plano del Complejo del Buen Pastor',
      docFuente:'Archivo Provincial de Córdoba, 1973',
      reflexion:'¿Qué de este espacio reconocés ahora que no veías antes?',
      sigId:    '05'
    },
    '07': {
      titulo:   'El paso de la fuga — 1975',
      capa:     'Capa II — Acción colectiva',
      capaCss:  '2',
      fecha:    '1975',
      tipo:     'Hito histórico',
      texto:    ['El 24 de mayo de 1975, un grupo de internas políticas logró escapar del penal en una acción planificada colectivamente. La fuga fue posible gracias a meses de organización clandestina.', 'Este espacio señala el recorrido de esa fuga. Es un hito de resistencia que transformó la historia del penal y de sus protagonistas.'],
      nota:     'La fuga de 1975 es uno de los episodios de resistencia colectiva más significativos en la historia del complejo.',
      audioCita:'"Sabíamos que iba a ser ahora o nunca..."',
      audioTotal:'04:20',
      docNombre:'Recorte de prensa — La Voz del Interior, mayo 1975',
      docFuente:'Biblioteca Mayor UNC / Hemeroteca',
      reflexion:'¿Cómo cambia tu percepción de este espacio al conocer esta historia?',
      sigId:    '08'
    }
  };

  function cargarContenidoNodo() {
    if (!document.querySelector('.nodo-main')) return;

    var params = new URLSearchParams(window.location.search);
    var id     = (params.get('id') || '01').padStart(2, '0');
    var nodo   = NODOS_CONTENIDO[id];

    if (!nodo) {
      // Nodo sin contenido detallado aún: mostrar placeholder genérico
      document.title = 'Nodo ' + id + ' — Capas de Memoria';
      return;
    }

    // Título
    document.title = nodo.titulo + ' — Capas de Memoria';
    var titleEl = document.getElementById('nodo-titulo-topbar');
    if (titleEl) titleEl.textContent = nodo.titulo;

    var tituloBadge = document.getElementById('nodo-capa-badge');
    if (tituloBadge) {
      tituloBadge.textContent = nodo.capa;
      tituloBadge.className   = 'capa-badge capa-badge--lg capa-badge--' + nodo.capaCss;
    }

    // Card principal
    var tituloMain = document.getElementById('nodo-titulo-main');
    if (tituloMain) tituloMain.textContent = nodo.titulo;

    var fecha = document.getElementById('nodo-fecha');
    if (fecha) fecha.textContent = nodo.fecha;

    var tipo = document.getElementById('nodo-tipo');
    if (tipo) tipo.textContent = nodo.tipo;

    var textoEl = document.getElementById('nodo-descripcion');
    if (textoEl && nodo.texto) {
      textoEl.innerHTML = nodo.texto.map(function (p) {
        return '<p>' + p + '</p>';
      }).join('');
    }

    var notaEl = document.getElementById('nodo-nota-texto');
    if (notaEl) notaEl.textContent = nodo.nota;

    // Testimonio
    var citaEl = document.getElementById('audio-cita');
    if (citaEl) citaEl.textContent = nodo.audioCita;

    var totalEl = document.getElementById('audio-total');
    if (totalEl) totalEl.textContent = nodo.audioTotal;

    // Documento
    var docNombre = document.getElementById('doc-nombre');
    if (docNombre) docNombre.textContent = nodo.docNombre;

    var docFuente = document.getElementById('doc-fuente');
    if (docFuente) docFuente.textContent = nodo.docFuente;

    // Reflexión
    var reflexionEl = document.getElementById('autoevaluacion-pregunta');
    if (reflexionEl) reflexionEl.textContent = nodo.reflexion;

    // Siguiente nodo
    var btnSig = document.getElementById('btn-siguiente');
    if (btnSig && nodo.sigId) {
      btnSig.href = 'nodo.html?id=' + nodo.sigId;
    }

    // Marcar nodo como visitado
    if (window.ProgresoModule) {
      window.ProgresoModule.marcarVisitado(id);
    }

    // Actualizar segmentos de progreso del nodo
    if (window.ProgresoModule) {
      var visitados = window.ProgresoModule.getVisitados();
      var numEl = document.getElementById('visitados-num');
      if (numEl) numEl.textContent = visitados.length;
    }
  }

  /* ══════════════════════════════════════════════════════
     7. BOOKMARK
  ══════════════════════════════════════════════════════ */
  function initBookmark() {
    var btn = document.getElementById('btn-bookmark');
    if (!btn) return;

    var STORAGE_KEY = 'capas_bookmarks';

    function getBookmarks() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
      catch (_) { return []; }
    }

    var params = new URLSearchParams(window.location.search);
    var id     = params.get('id') || '01';

    // Estado inicial
    var guardado = getBookmarks().includes(id);
    btn.setAttribute('aria-pressed', guardado);
    if (guardado) btn.setAttribute('aria-label', 'Quitar de favoritos');

    btn.addEventListener('click', function () {
      var bm = getBookmarks();
      if (bm.includes(id)) {
        bm.splice(bm.indexOf(id), 1);
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Guardar en favoritos');
      } else {
        bm.push(id);
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Quitar de favoritos');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bm));
    });
  }

  /* ══════════════════════════════════════════════════════
     8. SCROLL REVEAL PARA ARCHIVO
  ══════════════════════════════════════════════════════ */
  function initScrollRevealArchivo() {
    var items = document.querySelectorAll('.archivo-item');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (el) { obs.observe(el); });
  }

  /* ══════════════════════════════════════════════════════
     9. FILTROS DEL ARCHIVO
  ══════════════════════════════════════════════════════ */
  function initFiltrosArchivo() {
    var chipsTipo  = document.querySelectorAll('[data-tipo]');
    var chipsCapa  = document.querySelectorAll('[data-capa]');
    var items      = document.querySelectorAll('.archivo-item');
    var countEl    = document.getElementById('archivo-count');

    if (!chipsTipo.length && !chipsCapa.length) return;

    var filtroTipo = 'all';
    var filtroCapa = 'all-capas';

    function actualizarFiltros() {
      var visible = 0;
      items.forEach(function (item) {
        var tipo = item.getAttribute('data-tipo');
        var capa = item.getAttribute('data-capa');
        var okTipo = filtroTipo === 'all'      || tipo === filtroTipo;
        var okCapa = filtroCapa === 'all-capas' || capa === filtroCapa;
        var mostrar = okTipo && okCapa;
        item.style.display = mostrar ? '' : 'none';
        if (mostrar) visible++;
      });
      if (countEl) countEl.textContent = visible + ' ' + (visible === 1 ? 'pieza' : 'piezas');
    }

    chipsTipo.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filtroTipo = chip.getAttribute('data-tipo');
        chipsTipo.forEach(function (c) {
          c.classList.remove('chip--active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('chip--active');
        chip.setAttribute('aria-pressed', 'true');
        actualizarFiltros();
      });
    });

    chipsCapa.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filtroCapa = chip.getAttribute('data-capa');
        chipsCapa.forEach(function (c) {
          c.classList.remove('chip--active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('chip--active');
        chip.setAttribute('aria-pressed', 'true');
        actualizarFiltros();
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    initLayerStack();
    initScrollRevealGlobal();
    initComparadores();
    initAudioPlayer();
    initLightbox();
    initBookmark();
    cargarContenidoNodo();
    initScrollRevealArchivo();
    initFiltrosArchivo();
  });


})();
