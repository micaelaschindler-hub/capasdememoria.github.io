(function() {
'use strict';

/* ═══════════════════════════════════════
   BASE DE DATOS DE NODOS
═══════════════════════════════════════ */
var NODOS = {
  '01': {
    titulo:   'Sala de exposiciones',
    capa:     4,
    periodo:  '1868 — Presente',
    texto:    'La fachada que da sobre Hipólito Yrigoyen es el umbral histórico del complejo. Desde su inauguración en 1868 como Complejo Penitenciario del Buen Pastor, esta cara arquitectónica comunicó autoridad y permanencia a quienes pasaban. Hoy es la entrada al museo y centro cultural del Paseo.',
    cita:     'Cada vez que pasaba por esa fachada, sabía que detrás había historias que la ciudad prefería no ver.',
    citaAtrib:'Vecina del barrio, entrevista 2023',
    imgLabel: '[Fotografía histórica de la fachada — circa 1920]',
    url:      'nodo.html?id=01'
  },
  '02': {
    titulo:   'Entrada a la Capilla',
    capa:     1,
    periodo:  '1868 — 1983',
    texto:    'La capilla fue el corazón espiritual del complejo penitenciario administrado por las Hermanas del Buen Pastor. El acceso a este espacio marcaba la frontera entre el encierro cotidiano y los momentos de práctica religiosa obligatoria. La arquitectura de la entrada combina la solemnidad eclesiástica con la lógica de control del sistema carcelario.',
    cita:     'La misa del domingo era el único momento en que veíamos el cielo por algo más que una reja.',
    citaAtrib:'Testimonio de ex interna, archivo oral UNC',
    imgLabel: '[Imagen documental de la entrada a la capilla]',
    url:      'nodo.html?id=02'
  },
  '03': {
    titulo:   'Patios Internos',
    capa:     2,
    periodo:  '1969 — 1983',
    texto:    'Esta esquina fue uno de los puntos de vigilancia externa del complejo durante la dictadura cívico-militar. Familiares de detenidas políticas esperaban aquí noticias, frente a un muro que no daba información. El espacio público de la esquina fue testigo de búsquedas, silencios y encuentros clandestinos.',
    cita:     'Me quedaba parada en esa esquina durante horas, mirando la puerta, esperando que saliera alguien que me dijera algo de ella.',
    citaAtrib:'Familiar de detenida política, 1977',
    imgLabel: '[Fotografía de la esquina — período dictatorial]',
    imgSrc:   'img/Imagen antigua 1.jpg',
    url:      'nodo.html?id=03'
  },
  '04': {
    titulo:   'Baldosas históricas',
    capa:     3,
    periodo:  '1900 — 1983',
    texto:    'Las baldosas originales del complejo registran décadas de pisadas: internas, guardias, hermanas, visitas. Algunas están marcadas con inscripciones que las detenidas políticas dejaron como forma de resistencia y testimonio. Son documentos materiales que sobrevivieron a las transformaciones del espacio.',
    cita:     'Grabé mis iniciales con una piedra en una baldosa del patio. Era una forma de decir: estuve acá.',
    citaAtrib:'Ex presa política, testimonio 2019',
    imgLabel: '[Detalle fotográfico de baldosas con inscripciones]',
    url:      'nodo.html?id=04'
  },
  '05': {
    titulo:   'Reja de la fuga',
    capa:     2,
    periodo:  '1975',
    texto:    'El 24 de mayo de 1975, un grupo de internas políticas logró fugarse a través de esta reja en una acción colectiva y planificada durante meses. La fuga fue posible gracias a la coordinación entre compañeras, la observación meticulosa de rutinas y la solidaridad de personas externas. Es uno de los hitos más significativos de la resistencia en el Buen Pastor.',
    cita:     'Sabíamos que iba a ser ahora o nunca. Meses de espera concentrados en un solo momento.',
    citaAtrib:'Participante de la fuga, entrevista 2021',
    imgLabel: '[Imagen de la reja y el pasaje de la fuga]',
    url:      'nodo.html?id=05'
  },
  '06': {
    titulo:   'Fachada frente a los Capuchinos',
    capa:     3,
    periodo:  '1983 — 2001',
    texto:    'Después del cierre del penal con el retorno democrático, esta fachada lateral fue escenario del debate ciudadano sobre el destino del complejo. Organizaciones de derechos humanos, artistas y vecinos se reunían frente a ella para discutir qué hacer con la memoria inscripta en sus muros. El proceso de reconversión comenzó aquí, en el espacio público.',
    cita:     'Discutíamos horas sobre qué hacer con ese lugar. Tirarlo no era una opción. Había que hacer algo con la memoria.',
    citaAtrib:'Integrante de organización de derechos humanos, 1992',
    imgLabel: '[Fotografía de la fachada lateral durante los años 90]',
    url:      'nodo.html?id=06'
  },
  '07': {
    titulo:   'Fachadas Internas',
    capa:     3,
    periodo:  '1868 — 1983',
    texto:    'El patio interno fue el espacio de circulación central del complejo: el lugar donde las internas transitaban entre pabellones bajo vigilancia constante. Durante el período de detención política, también fue el espacio donde se produjeron encuentros clandestinos de solidaridad entre compañeras, intercambios de información y actos de resistencia cotidiana.',
    cita:     'El patio era el único lugar donde nos veíamos entre pabellones. Ahí ocurría todo lo que importaba.',
    citaAtrib:'Ex presa política, 1977',
    imgLabel: '[Fotografía histórica del patio interior del complejo]',
    url:      'nodo.html?id=07'
  },
  '08': {
    titulo:   'Fuente central',
    capa:     1,
    periodo:  '2001 — Presente',
    texto:    'La fuente que hoy marca el centro del Paseo del Buen Pastor ocupa el lugar de estructuras del complejo penitenciario. Es un palimpsesto urbano: debajo del agua y el mármol existe la memoria del encierro. Los visitantes que hoy se sientan a su alrededor descansan sobre una geografía que muy pocos conocen.',
    cita:     'La gente toma mate ahí sin saber lo que hubo antes. Eso es lo que me mueve a contar esta historia.',
    citaAtrib:'Investigadora de historia local, 2022',
    imgLabel: '[Fotografía de la fuente central en el Paseo actual]',
    url:      'nodo.html?id=08'
  },
  '09': {
    titulo:   'Esq. San Lorenzo / Buenos Aires',
    capa:     4,
    periodo:  '2001 — Presente',
    texto:    'La esquina que une la memoria con el presente: desde aquí se puede ver simultáneamente la fachada histórica del complejo y los bares y negocios que hoy rodean al Paseo. Es el punto donde la ciudad contemporánea convive más visiblemente con la historia del encierro y la memoria política.',
    cita:     'Me gusta venir a esta esquina porque desde acá se ve todo: lo que fue y lo que es ahora.',
    citaAtrib:'Visitante habitual del Paseo, 2024',
    imgLabel: '[Fotografía de la esquina con vista al Paseo]',
    url:      'nodo.html?id=09'
  }
};

var TOTAL_NODOS = Object.keys(NODOS).length;
var STORAGE_KEY  = 'capas_visitados_v2';
var nodoActivo   = null;
var escalaActual = 1;
var MIN_ESCALA   = 1;
var MAX_ESCALA   = 3.5;

/* ═══════════════════════════════════════
   PROGRESO
═══════════════════════════════════════ */
function getVisitados() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(_){ return []; }
}
function marcarVisitado(id) {
  var v = getVisitados();
  if (!v.includes(id)) { v.push(id); localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); }
}
function renderProgreso() {
  var v     = getVisitados();
  var count = document.getElementById('prog-count');
  var segs  = document.getElementById('prog-segs');
  if (count) count.textContent = v.length;
  if (!segs) return;
  if (!segs.children.length) {
    for (var i = 0; i < TOTAL_NODOS; i++) {
      var s = document.createElement('div');
      s.className = 'progreso-seg';
      segs.appendChild(s);
    }
  }
  var ids = Object.keys(NODOS);
  Array.from(segs.children).forEach(function(seg, i) {
    seg.classList.toggle('done', v.includes(ids[i]));
  });
}

/* ═══════════════════════════════════════
   ZOOM & PAN
═══════════════════════════════════════ */
var stage   = document.getElementById('mapa-stage');
var root    = document.getElementById('mapa-root');
var panX = 0, panY = 0;
var dragStart = null;
var lastPan   = { x:0, y:0 };

function aplicarTransform(animado) {
  if (animado) {
    stage.classList.add('animating');
    setTimeout(function(){ stage.classList.remove('animating'); }, 650);
  }
  stage.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + escalaActual + ')';
  var ind = document.getElementById('zoom-indicator');
  if (ind) ind.textContent = Math.round(escalaActual * 100) + '%';
}

function clampPan() {
  var rw = root.offsetWidth, rh = root.offsetHeight;
  var sw = rw * escalaActual, sh = rh * escalaActual;
  var maxX = Math.max(0, (sw - rw) / 2);
  var maxY = Math.max(0, (sh - rh) / 2);
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
}

function zoom(factor, cx, cy) {
  var newScale = Math.max(MIN_ESCALA, Math.min(MAX_ESCALA, escalaActual * factor));
  if (newScale === escalaActual) return;
  var rw = root.offsetWidth, rh = root.offsetHeight;
  var pivX = (cx !== undefined ? cx : rw/2) - rw/2;
  var pivY = (cy !== undefined ? cy : rh/2) - rh/2;
  panX = panX * (newScale / escalaActual) + pivX * (1 - newScale / escalaActual);
  panY = panY * (newScale / escalaActual) + pivY * (1 - newScale / escalaActual);
  escalaActual = newScale;
  clampPan();
  aplicarTransform(false);
}

function resetVista() {
  escalaActual = 1;
  panX = 0; panY = 0;
  aplicarTransform(true);
}

// Rueda del ratón
root.addEventListener('wheel', function(e) {
  e.preventDefault();
  var rect  = root.getBoundingClientRect();
  var cx    = e.clientX - rect.left;
  var cy    = e.clientY - rect.top;
  var delta = e.deltaY > 0 ? 0.85 : 1.18;
  zoom(delta, cx, cy);
}, { passive: false });

// Drag (mouse)
root.addEventListener('mousedown', function(e) {
  if (e.target.closest('.hotspot') || e.target.closest('.nodo-popup')) return;
  dragStart = { x: e.clientX - panX, y: e.clientY - panY };
  root.classList.add('is-dragging');
});
window.addEventListener('mousemove', function(e) {
  if (!dragStart) return;
  panX = e.clientX - dragStart.x;
  panY = e.clientY - dragStart.y;
  clampPan();
  aplicarTransform(false);
});
window.addEventListener('mouseup', function() {
  dragStart = null;
  root.classList.remove('is-dragging');
});

// Touch (pinch + pan)
var touches = {};
var lastDist = 0;
root.addEventListener('touchstart', function(e) {
  Array.from(e.changedTouches).forEach(function(t){ touches[t.identifier] = t; });
  if (Object.keys(touches).length === 1) {
    var t = e.changedTouches[0];
    dragStart = { x: t.clientX - panX, y: t.clientY - panY };
  }
  if (Object.keys(touches).length === 2) {
    dragStart = null;
    var ts = Object.values(touches);
    lastDist = Math.hypot(ts[1].clientX - ts[0].clientX, ts[1].clientY - ts[0].clientY);
  }
}, { passive: true });

root.addEventListener('touchmove', function(e) {
  e.preventDefault();
  Array.from(e.changedTouches).forEach(function(t){ touches[t.identifier] = t; });
  var ts = Object.values(touches);
  if (ts.length === 1 && dragStart) {
    panX = ts[0].clientX - dragStart.x;
    panY = ts[0].clientY - dragStart.y;
    clampPan();
    aplicarTransform(false);
  }
  if (ts.length === 2) {
    var dist = Math.hypot(ts[1].clientX - ts[0].clientX, ts[1].clientY - ts[0].clientY);
    if (lastDist > 0) {
      var rect = root.getBoundingClientRect();
      zoom(dist / lastDist,
        (ts[0].clientX + ts[1].clientX) / 2 - rect.left,
        (ts[0].clientY + ts[1].clientY) / 2 - rect.top
      );
    }
    lastDist = dist;
  }
}, { passive: false });

root.addEventListener('touchend', function(e) {
  Array.from(e.changedTouches).forEach(function(t){ delete touches[t.identifier]; });
  if (Object.keys(touches).length === 0) { dragStart = null; lastDist = 0; }
}, { passive: true });

// Botones de zoom
document.getElementById('ctrl-zoom-in').addEventListener('click', function(){ zoom(1.3); aplicarTransform(true); });
document.getElementById('ctrl-zoom-out').addEventListener('click', function(){ zoom(0.77); aplicarTransform(true); });
document.getElementById('ctrl-reset').addEventListener('click', resetVista);

/* ═══════════════════════════════════════
   PANEL NARRATIVO
═══════════════════════════════════════ */
var panel   = document.getElementById('panel');
var overlay = document.getElementById('panel-overlay');

function abrirPanel(id) {
  var nodo = NODOS[id];
  if (!nodo) return;
  nodoActivo = id;
  marcarVisitado(id);
  renderProgreso();

  // Rellenar contenido
  document.getElementById('panel-titulo').textContent = nodo.titulo;
  document.getElementById('panel-fecha').textContent  = nodo.periodo;
  document.getElementById('panel-texto').textContent  = nodo.texto;
  document.getElementById('panel-cita').textContent   = nodo.cita;
  document.getElementById('panel-img-label').textContent = nodo.imgLabel;

  // Imagen documental
  var imgEl = document.getElementById('panel-img');
  var placeholder = document.getElementById('panel-img-placeholder');
  if (nodo.imgSrc) {
    if (imgEl) {
      imgEl.src = nodo.imgSrc;
      imgEl.alt = nodo.imgLabel || nodo.titulo;
      imgEl.style.display = 'block';
    }
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  } else {
    if (imgEl) {
      imgEl.style.display = 'none';
    }
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  // Badge de capa
  var badge = document.getElementById('panel-badge');
  badge.textContent  = 'Capa ' + ['I','II','III','IV'][nodo.capa-1] + ' — ' + ['Orígenes','Resistencia','Reconversión','Presente'][nodo.capa-1];
  badge.className    = 'panel-capa-badge panel-capa-badge--' + nodo.capa;

  // CTA
  var cta = document.getElementById('panel-cta');
  cta.href = nodo.url;
  cta.setAttribute('aria-label', 'Ir al nodo narrativo: ' + nodo.titulo);

  // Resaltar hotspot activo
  document.querySelectorAll('.hotspot').forEach(function(h){
    h.classList.toggle('is-active', h.getAttribute('data-id') === id);
  });

  // Abrir panel y overlay
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');

  // Foco al panel
  setTimeout(function(){
    var closeBtn = document.getElementById('panel-close');
    if (closeBtn) closeBtn.focus();
  }, 350);
}

function cerrarPanel() {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.hotspot').forEach(function(h){ h.classList.remove('is-active'); });
  nodoActivo = null;
}

document.getElementById('panel-close').addEventListener('click', cerrarPanel);
overlay.addEventListener('click', cerrarPanel);

// Navegación entre nodos
var nodoIds = Object.keys(NODOS);
document.getElementById('panel-prev').addEventListener('click', function() {
  if (!nodoActivo) return;
  var idx = nodoIds.indexOf(nodoActivo);
  var prevId = nodoIds[(idx - 1 + nodoIds.length) % nodoIds.length];
  abrirPanel(prevId);
});
document.getElementById('panel-next').addEventListener('click', function() {
  if (!nodoActivo) return;
  var idx = nodoIds.indexOf(nodoActivo);
  var nextId = nodoIds[(idx + 1) % nodoIds.length];
  abrirPanel(nextId);
});

// ESC cierra el panel
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && panel.classList.contains('is-open')) cerrarPanel();
});

/* ═══════════════════════════════════════
   HOTSPOTS — click / touch / teclado
═══════════════════════════════════════ */
document.querySelectorAll('.hotspot').forEach(function(h) {
  function activar(e) {
    e.stopPropagation();
    var id = h.getAttribute('data-id');
    if (nodoActivo === id && panel.classList.contains('is-open')) { cerrarPanel(); return; }
    abrirPanel(id);
  }
  h.addEventListener('click', activar);
  h.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activar(e); }
  });
});

/* ═══════════════════════════════════════
   FILTROS DE CAPA
═══════════════════════════════════════ */
document.querySelectorAll('.filtro-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var capa = btn.getAttribute('data-capa');

    document.querySelectorAll('.filtro-btn').forEach(function(b){
      b.classList.remove('is-active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');

    document.querySelectorAll('.hotspot').forEach(function(h) {
      var hCapa = h.getAttribute('data-capa');
      var visible = capa === 'all' || hCapa === capa;
      h.classList.toggle('is-hidden', !visible);
    });

    // Cerrar panel si el nodo activo no coincide
    if (nodoActivo && capa !== 'all') {
      var nodoEl = document.querySelector('.hotspot[data-id="' + nodoActivo + '"]');
      if (nodoEl && nodoEl.classList.contains('is-hidden')) cerrarPanel();
    }
  });
});

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
renderProgreso();
panel.setAttribute('aria-hidden', 'true');

})();