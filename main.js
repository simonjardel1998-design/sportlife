/* SportLife — comportamiento del sitio */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var CATS = { calistenia: 'Calistenia', gimnasio: 'Gimnasio', equipo: 'Deportes de equipo', vida: 'Vida saludable' };
  var TIPCATS = { entrenamiento: 'Entrenamiento', alimentacion: 'Alimentación', descanso: 'Descanso', mentalidad: 'Mentalidad' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function minutos(r) {
    return Math.max(1, Math.round(r.ejercicios.length * (r.trabajo + r.descanso) / 60));
  }
  function diaDelAnio() {
    var now = new Date();
    return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  }

  /* ---------- Menú móvil ---------- */
  var menuBtn = $('.menu-btn'), nav = $('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var abierto = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(abierto));
    });
  }

  /* ---------- Timer de rutina ---------- */
  var Timer = (function () {
    var dlg = null, st = null;

    function stop() {
      if (st && st.id) clearInterval(st.id);
      st = null;
    }

    function armarPasos(r) {
      var p = [{ tipo: 'prep', nombre: 'Prepará el lugar', seg: 5 }];
      r.ejercicios.forEach(function (e, i) {
        p.push({ tipo: 'work', nombre: e, seg: r.trabajo, n: i + 1 });
        if (i < r.ejercicios.length - 1) p.push({ tipo: 'rest', nombre: 'Descanso', seg: r.descanso });
      });
      p.push({ tipo: 'fin', nombre: 'Terminaste', seg: 0 });
      return p;
    }

    function render() {
      var p = st.pasos[st.i];
      dlg.setAttribute('data-fase', p.tipo);
      var fases = { prep: 'Preparate', rest: 'Descanso', fin: 'Rutina completa' };
      $('.timer-fase', dlg).textContent = p.tipo === 'work' ? 'Ejercicio ' + p.n + ' de ' + st.r.ejercicios.length : fases[p.tipo];
      $('.timer-nombre', dlg).textContent = p.nombre;
      $('.timer-seg', dlg).textContent = p.tipo === 'fin' ? 'OK' : String(st.resta).padStart(2, '0');
      $('.timer-bar i', dlg).style.width = (p.seg ? ((p.seg - st.resta) / p.seg) * 100 : 100) + '%';

      var sig = '';
      for (var k = st.i + 1; k < st.pasos.length; k++) {
        if (st.pasos[k].tipo === 'work') { sig = 'Sigue: ' + st.pasos[k].nombre; break; }
      }
      $('.timer-next', dlg).textContent = p.tipo === 'fin' ? 'Buen laburo. Tomá agua y estirá un poco.' : sig;
    }

    function ir(i) {
      st.i = i;
      st.resta = st.pasos[i].seg;
      if (st.pasos[i].tipo === 'fin') {
        clearInterval(st.id);
        st.id = null;
        $('[data-a="pausa"]', dlg).disabled = true;
        $('[data-a="skip"]', dlg).disabled = true;
      }
      render();
      if (navigator.vibrate) navigator.vibrate(120);
    }

    function tick() {
      if (!st || st.pausa) return;
      st.resta -= 1;
      if (st.resta <= 0) {
        if (st.i < st.pasos.length - 1) ir(st.i + 1);
      } else {
        render();
      }
    }

    function construir() {
      dlg = document.createElement('dialog');
      dlg.className = 'timer';
      dlg.setAttribute('aria-label', 'Timer de rutina');
      dlg.innerHTML =
        '<div class="timer-top"><span class="timer-rutina"></span><button type="button" class="timer-x">Cerrar</button></div>' +
        '<p class="timer-fase"></p>' +
        '<p class="timer-nombre"></p>' +
        '<p class="timer-seg">00</p>' +
        '<div class="timer-bar"><i></i></div>' +
        '<p class="timer-next"></p>' +
        '<div class="timer-btns">' +
        '<button type="button" class="btn btn-volt" data-a="pausa">Pausa</button>' +
        '<button type="button" class="btn" data-a="skip">Saltar</button>' +
        '</div>';
      document.body.appendChild(dlg);

      $('.timer-x', dlg).addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('close', stop);
      $('[data-a="pausa"]', dlg).addEventListener('click', function (e) {
        if (!st) return;
        st.pausa = !st.pausa;
        e.currentTarget.textContent = st.pausa ? 'Seguir' : 'Pausa';
      });
      $('[data-a="skip"]', dlg).addEventListener('click', function () {
        if (st && st.i < st.pasos.length - 1) ir(st.i + 1);
      });
    }

    function abrir(r) {
      if (!dlg) construir();
      stop();
      st = { r: r, pasos: armarPasos(r), i: 0, resta: 5, pausa: false, id: null };
      $('.timer-rutina', dlg).textContent = r.nombre;
      var bp = $('[data-a="pausa"]', dlg);
      bp.disabled = false; bp.textContent = 'Pausa';
      $('[data-a="skip"]', dlg).disabled = false;
      ir(0);
      st.id = setInterval(tick, 1000);
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }

    return { abrir: abrir };
  })();

  /* ---------- Home: rutina de hoy ---------- */
  var hoy = $('#hoy');
  if (hoy && window.RUTINAS) {
    var rh = RUTINAS[diaDelAnio() % RUTINAS.length];
    hoy.innerHTML =
      '<p class="today-tag">Hoy toca</p>' +
      '<h2>' + esc(rh.nombre) + '</h2>' +
      '<p class="meta">' + esc(CATS[rh.cat]) + ' · ' + minutos(rh) + ' min · ' + esc(rh.nivel) + '</p>' +
      '<ol>' + rh.ejercicios.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ol>' +
      '<button type="button" class="btn btn-volt">Empezar con timer</button>';
    $('button', hoy).addEventListener('click', function () { Timer.abrir(rh); });
  }

  /* ---------- Tip del día ---------- */
  var tipDia = $('#tip-dia');
  if (tipDia && window.TIPS) {
    var tipIdx = diaDelAnio() % TIPS.length;
    var pintarTip = function (t) {
      tipDia.innerHTML =
        '<span class="kicker">' + esc(TIPCATS[t.cat]) + '</span>' +
        '<h2>' + esc(t.titulo) + '</h2>' +
        '<p class="txt">' + esc(t.texto) + '</p>';
    };
    pintarTip(TIPS[tipIdx]);
    var otro = $('#otro-tip');
    if (otro) {
      otro.addEventListener('click', function () {
        var n;
        do { n = Math.floor(Math.random() * TIPS.length); } while (n === tipIdx && TIPS.length > 1);
        tipIdx = n;
        pintarTip(TIPS[n]);
      });
    }
  }

  /* ---------- Filtros genéricos ---------- */
  function grupoChips(selector, alCambiar) {
    var chips = $$(selector + ' .chip');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        c.setAttribute('aria-pressed', 'true');
        alCambiar(c.getAttribute('data-valor'));
      });
    });
  }

  /* ---------- Página de rutinas ---------- */
  var lista = $('#lista-rutinas');
  if (lista && window.RUTINAS) {
    var fCat = 'todas', fNiv = 'todos';

    var pintarRutinas = function () {
      var rs = RUTINAS.filter(function (r) {
        return (fCat === 'todas' || r.cat === fCat) && (fNiv === 'todos' || r.nivel === fNiv);
      });
      $('#conteo').textContent = rs.length + (rs.length === 1 ? ' rutina' : ' rutinas');
      lista.innerHTML = rs.length ? rs.map(function (r) {
        return '<article class="rcard" data-cat="' + r.cat + '">' +
          '<div class="rcard-top"><span>' + esc(CATS[r.cat]) + '</span><span>' + esc(r.nivel) + '</span></div>' +
          '<div class="rcard-body">' +
          '<h3>' + esc(r.nombre) + '</h3>' +
          '<p class="meta">' + minutos(r) + ' min · ' + r.trabajo + ' s trabajo / ' + r.descanso + ' s pausa</p>' +
          '<ol>' + r.ejercicios.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ol>' +
          '<button type="button" class="btn btn-volt" data-id="' + r.id + '">Empezar con timer</button>' +
          '</div></article>';
      }).join('') : '<p class="vacio">No hay rutinas con ese filtro. Probá con otro nivel o categoría.</p>';

      $$('[data-id]', lista).forEach(function (b) {
        b.addEventListener('click', function () {
          var r = RUTINAS.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0];
          if (r) Timer.abrir(r);
        });
      });
    };

    grupoChips('#filtros-cat', function (v) { fCat = v; pintarRutinas(); });
    grupoChips('#filtros-nivel', function (v) { fNiv = v; pintarRutinas(); });

    var q = new URLSearchParams(location.search).get('cat');
    var chipInicial = q ? $('#filtros-cat .chip[data-valor="' + q + '"]') : null;
    if (chipInicial) chipInicial.click(); else pintarRutinas();
  }

  /* ---------- Página de consejos ---------- */
  var listaTips = $('#lista-tips');
  if (listaTips && window.TIPS) {
    var pintarTips = function (cat) {
      var ts = TIPS.filter(function (t) { return cat === 'todos' || t.cat === cat; });
      listaTips.innerHTML = ts.map(function (t) {
        return '<article class="tip" data-cat="' + t.cat + '">' +
          '<span class="tip-cat">' + esc(TIPCATS[t.cat]) + '</span>' +
          '<h3>' + esc(t.titulo) + '</h3>' +
          '<p>' + esc(t.texto) + '</p></article>';
      }).join('');
    };
    grupoChips('#filtros-tips', pintarTips);
    pintarTips('todos');
  }

  /* ---------- Formulario de aviso (solo validación en el navegador) ---------- */
  var form = $('#form-aviso');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', form), msg = $('#form-msg');
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      msg.className = 'msg ' + (ok ? 'ok' : 'err');
      msg.textContent = ok ? 'Listo, quedaste anotado. Te avisamos cuando haya rutinas nuevas.' : 'Revisá el mail, parece que le falta algo.';
      if (ok) form.reset();
    });
  }
})();