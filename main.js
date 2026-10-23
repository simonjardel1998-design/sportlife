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
    var dlg = null, st = null, ac = null, vozOn = true;
    try { vozOn = localStorage.getItem('sl-voz') !== 'no'; } catch (e) {}

    /* Voz: usa la voz del navegador (no hace falta ningún archivo de audio). */
    function decir(txt) {
      if (!vozOn || !('speechSynthesis' in window)) return;
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(txt);
        u.lang = 'es-AR';
        u.rate = 1.05;
        var vs = speechSynthesis.getVoices();
        var v = vs.filter(function (x) { return /^es[-_]AR/i.test(x.lang); })[0] ||
                vs.filter(function (x) { return /^es/i.test(x.lang); })[0];
        if (v) u.voice = v;
        speechSynthesis.speak(u);
      } catch (e) {}
    }

    /* Pitidos de cuenta regresiva (el botón "Sonido" apaga voz y pitidos). */
    function pip(f, d) {
      if (!vozOn) return;
      try {
        var A = window.AudioContext || window.webkitAudioContext;
        if (!A) return;
        if (!ac) ac = new A();
        if (ac.state === 'suspended') ac.resume();
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'square';
        o.frequency.value = f;
        g.gain.value = 0.06;
        o.connect(g);
        g.connect(ac.destination);
        o.start();
        o.stop(ac.currentTime + d);
      } catch (e) {}
    }

    function proximo() {
      for (var k = st.i + 1; k < st.pasos.length; k++) {
        if (st.pasos[k].tipo === 'work') return st.pasos[k].nombre;
      }
      return '';
    }

    function anunciar(p) {
      if (p.tipo === 'prep') {
        decir('Prepárate. Vamos a empezar ' + st.r.nombre + '. Primer ejercicio: ' + st.r.ejercicios[0] + '.');
      } else if (p.tipo === 'work') {
        pip(880, 0.4);
        decir(p.n === 1 ? '¡Vamos!' : '¡Ya!');
      } else if (p.tipo === 'rest') {
        pip(440, 0.25);
        decir('Descanso. Tomá aire. Sigue ' + proximo() + '.');
      } else if (p.tipo === 'fin') {
        pip(660, 0.5);
        decir('Terminaste la rutina. Buen laburo. Tomá agua y estirá un poco.');
      }
    }

    function stop() {
      if (st && st.id) clearInterval(st.id);
      st = null;
      try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {}
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
      anunciar(st.pasos[i]);
      if (navigator.vibrate) navigator.vibrate(120);
    }

    function tick() {
      if (!st || st.pausa) return;
      st.resta -= 1;
      if (st.resta <= 0) {
        if (st.i < st.pasos.length - 1) ir(st.i + 1);
      } else {
        render();
        if (st.resta <= 3) pip(520, 0.12);
      }
    }

    function construir() {
      dlg = document.createElement('dialog');
      dlg.className = 'timer';
      dlg.setAttribute('aria-label', 'Timer de rutina');
      dlg.innerHTML =
        '<div class="timer-top"><span class="timer-rutina"></span><span class="timer-top-btns">' +
        '<button type="button" class="timer-x" data-a="voz">Sonido: sí</button>' +
        '<button type="button" class="timer-x" data-a="cerrar">Cerrar</button></span></div>' +
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

      $('[data-a="cerrar"]', dlg).addEventListener('click', function () { dlg.close(); });
      $('[data-a="voz"]', dlg).addEventListener('click', function (e) {
        vozOn = !vozOn;
        try { localStorage.setItem('sl-voz', vozOn ? 'si' : 'no'); } catch (err) {}
        e.currentTarget.textContent = vozOn ? 'Sonido: sí' : 'Sonido: no';
        if (!vozOn) { try { speechSynthesis.cancel(); } catch (err2) {} }
      });
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
      $('[data-a="voz"]', dlg).textContent = vozOn ? 'Sonido: sí' : 'Sonido: no';
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

  /* ---------- Home: video de fondo con botón de sonido ---------- */
  var hv = $('#hero-video');
  if (hv) {
    var ctrl = $('#hero-ctrl'), bSound = $('#hv-sound'), bPlay = $('#hv-play');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mostrar = function () { ctrl.hidden = false; };
    var pintarPlay = function () {
      bPlay.textContent = hv.paused ? 'Reproducir video' : 'Pausar video';
      bPlay.setAttribute('aria-pressed', String(hv.paused));
    };
    hv.addEventListener('loadeddata', mostrar);
    if (hv.readyState >= 2) mostrar();
    if (reduce) { hv.removeAttribute('autoplay'); hv.pause(); }
    hv.addEventListener('play', pintarPlay);
    hv.addEventListener('pause', pintarPlay);
    bSound.addEventListener('click', function () {
      hv.muted = !hv.muted;
      if (!hv.muted && hv.paused) hv.play();
      bSound.textContent = hv.muted ? 'Sonido: apagado' : 'Sonido: encendido';
      bSound.setAttribute('aria-pressed', String(!hv.muted));
    });
    var pausaUsuario = false, pausaAuto = false;
    bPlay.addEventListener('click', function () {
      if (hv.paused) { pausaUsuario = false; hv.play(); }
      else { pausaUsuario = true; hv.pause(); }
    });
    /* Ahorra batería y datos: el video se frena solo cuando no se ve en pantalla. */
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) {
          if (pausaAuto && !pausaUsuario) hv.play();
          pausaAuto = false;
        } else if (!hv.paused) {
          pausaAuto = true;
          hv.pause();
        }
      }, { threshold: 0.15 }).observe($('#hero'));
    }
    pintarPlay();
  }

  /* ---------- Home: rutina de hoy ---------- */
  var hoy = $('#hoy');
  if (hoy && window.RUTINAS) {
    var rh = RUTINAS[diaDelAnio() % RUTINAS.length];
    hoy.innerHTML =
      '<p class="today-tag">Hoy toca</p>' +
      '<h2>' + esc(rh.nombre) + '</h2>' +
      '<p class="meta">' + esc(CATS[rh.cat]) + ' · ' + minutos(rh) + ' min · ' + esc(rh.nivel) + '</p>' +
      '<ol>' + rh.ejercicios.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ol>' +
      '<div class="rcard-btns"><button type="button" class="btn btn-volt">Empezar con timer</button>' +
      '<a class="btn" href="rutina-' + rh.id + '.html">Ver rutina</a></div>';
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
          '<h3><a href="rutina-' + r.id + '.html">' + esc(r.nombre) + '</a></h3>' +
          '<p class="meta">' + minutos(r) + ' min · ' + r.trabajo + ' s trabajo / ' + r.descanso + ' s pausa</p>' +
          '<ol>' + r.ejercicios.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ol>' +
          '<div class="rcard-btns"><a class="btn" href="rutina-' + r.id + '.html">Ver rutina</a>' +
          '<button type="button" class="btn btn-volt" data-id="' + r.id + '">Empezar</button></div>' +
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

  /* ---------- Página de una rutina: botón de timer y opiniones ---------- */
  var idRutina = document.body.getAttribute('data-rutina');
  var rutina = null;
  if (idRutina && window.RUTINAS) {
    rutina = RUTINAS.filter(function (x) { return x.id === idRutina; })[0] || null;
  }
  if (rutina) {
    $$('[data-start]').forEach(function (b) {
      b.addEventListener('click', function () { Timer.abrir(rutina); });
    });

    var mancuerna = function (on, w) {
      return '<svg viewBox="0 0 48 24" width="' + (w || 40) + '" height="' + (w ? w / 2 : 20) + '" aria-hidden="true" focusable="false">' +
        '<g stroke="#0d0d0d" stroke-width="2.5" stroke-linejoin="round">' +
        '<rect x="13" y="10.5" width="22" height="3" fill="#0d0d0d"/>' +
        '<g class="pl" fill="' + (on ? '#d6ff3d' : 'none') + '">' +
        '<rect x="2" y="7" width="5" height="10"/><rect x="7" y="3" width="6" height="18"/>' +
        '<rect x="35" y="3" width="6" height="18"/><rect x="41" y="7" width="5" height="10"/></g></g></svg>';
    };
    var fila = function (n, w) {
      var s = '';
      for (var i = 1; i <= 5; i++) s += mancuerna(i <= n, w);
      return '<span class="fb-fila">' + s + '</span>';
    };

    var clave = 'sl-fb-' + idRutina;
    var propios = [];
    try { propios = JSON.parse(localStorage.getItem(clave) || '[]'); } catch (e) { propios = []; }
    if (!Array.isArray(propios)) propios = [];

    var todos = function () { return propios.concat(rutina.comentarios || []); };

    var pintarFeedback = function () {
      var all = todos(), tot = all.length, suma = 0, cuenta = [0, 0, 0, 0, 0, 0];
      all.forEach(function (c) { suma += c.p; cuenta[c.p]++; });
      var prom = tot ? suma / tot : 0;
      var barras = '';
      for (var s = 5; s >= 1; s--) {
        barras += '<div class="fb-barra"><span>' + s + '</span><i><b style="width:' + (tot ? Math.round(cuenta[s] / tot * 100) : 0) + '%"></b></i><em>' + cuenta[s] + '</em></div>';
      }
      $('#fb-resumen').innerHTML =
        '<div class="fb-prom"><span class="fb-num">' + prom.toFixed(1).replace('.', ',') + '</span>' +
        '<div>' + fila(Math.round(prom)) + '<p>' + tot + (tot === 1 ? ' opinión' : ' opiniones') + '</p></div></div>' +
        '<div class="fb-barras">' + barras + '</div>';
      $('#fb-lista').innerHTML = all.map(function (c) {
        return '<li class="fb-item' + (c.mio ? ' fb-mio' : '') + '">' +
          '<div class="fb-item-top"><strong>' + esc(c.n || 'Anónimo') + '</strong>' +
          (c.mio ? '<span class="fb-chip">Vos</span>' : (c.e ? '<span class="fb-edad">' + c.e + ' años</span>' : '')) +
          '<span class="fb-item-p" role="img" aria-label="' + c.p + ' de 5 mancuernas">' + fila(c.p, 30) + '</span></div>' +
          '<p>' + esc(c.t) + '</p></li>';
      }).join('');
    };

    /* Selector de puntaje con mancuernas */
    var puntaje = 0, rating = $('#fb-rating');
    var botonesR = [];
    var pintarRating = function (hover) {
      var n = hover || puntaje;
      botonesR.forEach(function (b, i) {
        b.classList.toggle('on', i + 1 <= n);
        b.setAttribute('aria-checked', String(i + 1 === puntaje));
        b.tabIndex = (puntaje ? i + 1 === puntaje : i === 0) ? 0 : -1;
      });
    };
    for (var i = 1; i <= 5; i++) {
      (function (v) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'fb-rbtn';
        b.innerHTML = mancuerna(false, 44);
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-label', v + ' de 5 mancuernas');
        b.addEventListener('click', function () { puntaje = v; pintarRating(); });
        b.addEventListener('mouseenter', function () { pintarRating(v); });
        b.addEventListener('mouseleave', function () { pintarRating(); });
        b.addEventListener('keydown', function (e) {
          var d = (e.key === 'ArrowRight' || e.key === 'ArrowUp') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowDown') ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          puntaje = Math.min(5, Math.max(1, (puntaje || v) + d));
          pintarRating();
          botonesR[puntaje - 1].focus();
        });
        rating.appendChild(b);
        botonesR.push(b);
      })(i);
    }
    pintarRating();

    var txt = $('#fb-texto'), cont = $('#fb-cont');
    txt.addEventListener('input', function () { cont.textContent = txt.value.length + ' / 140'; });

    $('#fb-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#fb-msg'), t = txt.value.trim();
      msg.className = 'msg err';
      if (!puntaje) { msg.textContent = 'Elegí de 1 a 5 mancuernas.'; return; }
      if (t.length < 3) { msg.textContent = 'Escribí un comentario cortito.'; txt.focus(); return; }
      propios.unshift({ n: $('#fb-nombre').value.trim() || 'Anónimo', p: puntaje, t: t, mio: true });
      propios = propios.slice(0, 20);
      try { localStorage.setItem(clave, JSON.stringify(propios)); } catch (err) {}
      puntaje = 0;
      pintarRating();
      e.target.reset();
      cont.textContent = '0 / 140';
      msg.className = 'msg ok';
      msg.textContent = 'Gracias por tu opinión.';
      pintarFeedback();
    });

    pintarFeedback();
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
