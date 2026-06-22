/* =========================================================
   CAPAS DE MEMORIA — form.js
   Formulario de participación: contador de caracteres,
   upload de foto con preview, validación, pasos narrativos,
   acordeón de ética, confirmación de envío.
   ========================================================= */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────
     1. CONTADOR DE CARACTERES — textarea reflexión
  ────────────────────────────────────────────────────── */
  function initContador() {
    var textarea  = document.getElementById('reflexion-texto');
    var contador  = document.getElementById('reflexion-contador');
    if (!textarea || !contador) return;

    var MAX = parseInt(textarea.getAttribute('maxlength') || '500', 10);

    function actualizar() {
      var n     = textarea.value.length;
      var resto = MAX - n;
      contador.textContent = n + ' / ' + MAX;

      if (n > MAX * 0.9) {
        contador.style.color = 'var(--c-error)';
      } else if (n > MAX * 0.75) {
        contador.style.color = 'var(--c-capa-4)';
      } else {
        contador.style.color = '';
      }

      // Anunciar para lectores de pantalla cuando queden pocos caracteres
      if (resto <= 20) {
        contador.setAttribute('aria-live', 'assertive');
      }
    }

    textarea.addEventListener('input', actualizar);
    actualizar();
  }

  /* ──────────────────────────────────────────────────────
     2. UPLOAD DE FOTO — dropzone con preview
  ────────────────────────────────────────────────────── */
  function initUploadFoto() {
    var dropzone    = document.getElementById('dropzone');
    var input       = document.getElementById('foto-input');
    var btnSubir    = document.getElementById('btn-subir-foto');
    var preview     = document.getElementById('dropzone-preview');
    var previewImg  = document.getElementById('preview-img');
    var btnRemove   = document.getElementById('preview-remove');
    var contenido   = document.getElementById('dropzone-contenido');
    var fotoDesc    = document.getElementById('foto-descripcion');

    if (!dropzone || !input) return;

    var MAX_BYTES = 10 * 1024 * 1024; // 10 MB

    function mostrarError(msg) {
      var err = dropzone.querySelector('.upload-error') || document.createElement('p');
      err.className    = 'upload-error';
      err.style.cssText = 'color:var(--c-error);font-size:var(--fs-xs);margin-top:var(--sp-2);text-align:center;';
      err.textContent  = msg;
      if (!dropzone.contains(err)) dropzone.appendChild(err);
      setTimeout(function () { if (err.parentNode) err.parentNode.removeChild(err); }, 4000);
    }

    function procesarArchivo(file) {
      if (!file) return;

      // Validar tipo
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        mostrarError('Formato no válido. Usá JPG o PNG.');
        return;
      }

      // Validar tamaño
      if (file.size > MAX_BYTES) {
        mostrarError('La imagen supera los 10 MB. Elegí una más liviana.');
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        if (previewImg)  previewImg.src = e.target.result;
        if (previewImg)  previewImg.alt = 'Vista previa: ' + file.name;
        if (preview)     preview.hidden  = false;
        if (contenido)   contenido.hidden = true;
        if (fotoDesc)    fotoDesc.hidden  = false;
        dropzone.setAttribute('aria-label', 'Imagen seleccionada: ' + file.name + '. Hacer clic en quitar para eliminarla.');
      };
      reader.readAsDataURL(file);
    }

    // Abrir selector con botón o clic en dropzone
    if (btnSubir) {
      btnSubir.addEventListener('click', function (e) {
        e.stopPropagation();
        input.click();
      });
    }

    dropzone.addEventListener('click', function () {
      if (preview && !preview.hidden) return; // No abrir si hay preview
      input.click();
    });

    // Teclado sobre el dropzone
    dropzone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (preview && !preview.hidden) return;
        input.click();
      }
    });

    // Cambio en el input file
    input.addEventListener('change', function () {
      procesarArchivo(input.files[0]);
    });

    // Drag & drop
    ['dragenter', 'dragover'].forEach(function (ev) {
      dropzone.addEventListener(ev, function (e) {
        e.preventDefault();
        dropzone.style.borderColor   = 'var(--c-ink)';
        dropzone.style.background    = 'var(--c-surface)';
      });
    });

    ['dragleave', 'dragend'].forEach(function (ev) {
      dropzone.addEventListener(ev, function () {
        dropzone.style.borderColor = '';
        dropzone.style.background  = '';
      });
    });

    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropzone.style.borderColor = '';
      dropzone.style.background  = '';
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      procesarArchivo(file);
    });

    // Eliminar imagen seleccionada
    if (btnRemove) {
      btnRemove.addEventListener('click', function (e) {
        e.stopPropagation();
        input.value = '';
        if (previewImg)  previewImg.src = '';
        if (preview)     preview.hidden  = true;
        if (contenido)   contenido.hidden = false;
        if (fotoDesc)    fotoDesc.hidden  = true;
        dropzone.setAttribute('aria-label',
          'Área para subir fotografía. Hacer clic o arrastrar imagen aquí.');
        input.focus();
      });
    }
  }

  /* ──────────────────────────────────────────────────────
     3. ACORDEÓN ÉTICA — "Ver más información"
  ────────────────────────────────────────────────────── */
  function initAcordeonEtica() {
    var btn     = document.getElementById('btn-etica-info');
    var detalle = document.getElementById('etica-detalle');
    if (!btn || !detalle) return;

    btn.addEventListener('click', function () {
      var abierto = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !abierto);
      detalle.hidden = abierto;

      // Cambiar texto del botón
      var svgIcon = btn.querySelector('svg');
      if (svgIcon) {
        svgIcon.style.transform = abierto ? '' : 'rotate(180deg)';
      }

      if (!abierto) {
        btn.textContent = 'Ver menos información ';
        btn.appendChild(svgIcon);
      } else {
        btn.textContent = 'Ver más información ';
        btn.appendChild(svgIcon);
      }
    });
  }

  /* ──────────────────────────────────────────────────────
     4. VALIDACIÓN Y ENVÍO
  ────────────────────────────────────────────────────── */
  function initEnvio() {
    var btnEnviar    = document.getElementById('btn-enviar');
    var confirmacion = document.getElementById('form-confirmacion');
    var formPasos    = document.getElementById('form-pasos');
    var consent      = document.getElementById('consent-check');
    var textarea     = document.getElementById('reflexion-texto');

    if (!btnEnviar) return;

    function marcarError(campo, msg) {
      var padre = campo.closest('.form-campo') || campo.parentNode;
      padre.classList.add('has-error');

      // Mensaje de error accesible
      var msgId  = campo.id + '-error';
      var msgEl  = document.getElementById(msgId) || document.createElement('p');
      msgEl.id   = msgId;
      msgEl.setAttribute('role', 'alert');
      msgEl.style.cssText = 'color:var(--c-error);font-size:var(--fs-xs);margin-top:var(--sp-1);';
      msgEl.textContent   = msg;

      if (!document.getElementById(msgId)) {
        padre.appendChild(msgEl);
      }

      campo.setAttribute('aria-describedby', msgId);

      // Limpiar al corregir
      campo.addEventListener('input', function limpiar() {
        padre.classList.remove('has-error');
        if (msgEl.parentNode) msgEl.parentNode.removeChild(msgEl);
        campo.removeEventListener('input', limpiar);
      }, { once: true });
    }

    function validar() {
      var errores = [];

      // Validar textarea (obligatorio)
      if (textarea && textarea.value.trim().length < 10) {
        marcarError(textarea, 'Contanos algo sobre tu relación con el espacio. Mínimo 10 caracteres.');
        errores.push(textarea);
      }

      // Validar consentimiento
      if (consent && !consent.checked) {
        var padre = consent.closest('.form-check');
        if (padre) {
          padre.style.outline = '2px solid var(--c-error)';
          padre.style.borderRadius = '4px';
          setTimeout(function () { padre.style.outline = ''; }, 3000);
        }
        consent.setAttribute('aria-invalid', 'true');
        errores.push(consent);
      }

      return errores;
    }

    btnEnviar.addEventListener('click', function () {
      var errores = validar();

      if (errores.length > 0) {
        // Foco al primer campo con error
        errores[0].focus();
        // Shake visual al botón
        btnEnviar.style.animation = 'none';
        void btnEnviar.offsetWidth; // reflow
        btnEnviar.style.animation = '';
        return;
      }

      // Éxito — simular envío
      btnEnviar.disabled = true;
      btnEnviar.textContent = 'Enviando...';

      // Simular request asíncrono (sin backend real)
      setTimeout(function () {
        if (formPasos)    formPasos.hidden    = true;
        if (confirmacion) {
          confirmacion.hidden = false;
          confirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Foco para lectores de pantalla
          var titulo = confirmacion.querySelector('.confirmacion-titulo');
          if (titulo) {
            titulo.setAttribute('tabindex', '-1');
            titulo.focus();
          }
        }
        // Limpiar estado de progreso (opcional: desmarcar si se considera aporte)
      }, 1200);
    });
  }

  /* ──────────────────────────────────────────────────────
     5. PASOS NARRATIVOS — scroll suave entre secciones
     Añade un separador visual entre pasos y anima la entrada
  ────────────────────────────────────────────────────── */
  function initPasosNarrativos() {
    var pasos = document.querySelectorAll('.form-paso');
    if (!pasos.length || !('IntersectionObserver' in window)) return;

    // Añadir números a cada paso
    var labels = [
      '¿Qué significa para vos?',
      'Tu fotografía (opcional)',
      '¿Dónde ocurrió?',
      'Consentimiento y envío'
    ];

    pasos.forEach(function (paso, i) {
      var label = document.createElement('span');
      label.className   = 'paso-numero';
      label.textContent = (i + 1) + ' / ' + pasos.length;
      label.setAttribute('aria-hidden', 'true');
      label.style.cssText = [
        'display:block',
        'font-size:var(--fs-xs)',
        'font-weight:600',
        'color:var(--c-ink-3)',
        'letter-spacing:0.1em',
        'text-transform:uppercase',
        'margin-bottom:var(--sp-2)'
      ].join(';');
      paso.insertBefore(label, paso.firstChild);
    });

    // Scroll reveal para cada paso
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'none';
        }
      });
    }, { threshold: 0.15 });

    pasos.forEach(function (paso, i) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (i === 0) return; // El primero es visible de inmediato
      paso.style.opacity   = '0';
      paso.style.transform = 'translateY(12px)';
      paso.style.transition = 'opacity 0.4s ease ' + (i * 0.05) + 's, transform 0.4s ease ' + (i * 0.05) + 's';
      obs.observe(paso);
    });
  }

  /* ──────────────────────────────────────────────────────
     6. INFORMACIÓN DEL FORMULARIO — botón info
  ────────────────────────────────────────────────────── */
  function initBtnInfo() {
    var btn = document.getElementById('btn-info-participar');
    if (!btn) return;

    btn.addEventListener('click', function () {
      // Scroll suave a la sección de ética
      var etica = document.querySelector('.etica-bloque');
      if (etica) {
        etica.scrollIntoView({ behavior: 'smooth', block: 'center' });
        etica.style.outline = '2px solid var(--c-ink)';
        etica.style.borderRadius = 'var(--r-card)';
        setTimeout(function () {
          etica.style.outline = '';
        }, 2000);
      }
    });
  }

  /* ──────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('.participacion-main')) return;

    initContador();
    initUploadFoto();
    initAcordeonEtica();
    initEnvio();
    initPasosNarrativos();
    initBtnInfo();
  });

})();
