/* SportLife — ejercicios animados.
   Las figuras se dibujan con código: cada ejercicio tiene una pose A y una pose B
   y el motor calcula codos y rodillas (cinemática inversa) para moverlas. */
(function (root) {
  'use strict';

  var INK = '#0d0d0d', FAR = '#8a887c', HOT = '#ff4b1f', VOLT = '#d6ff3d';
  var L = { torso: 54, head: 17, hr: 11, up: 27, fore: 25, thigh: 36, shin: 35, foot: 13 };
  var GY = 171;   // línea del piso
  var CY = 166;   // altura donde apoyan manos y pies
  var RAD = Math.PI / 180;

  function r1(n) { return Math.round(n * 10) / 10; }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function lerp2(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }

  /* Dos huesos (a -> mid -> b). dir elige hacia qué lado dobla la articulación. */
  function ik(a, b, l1, l2, dir) {
    var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy);
    var maxd = l1 + l2 - 0.01, mind = Math.abs(l1 - l2) + 0.01;
    if (d > maxd) { dx *= maxd / d; dy *= maxd / d; d = maxd; }
    if (d < mind) { if (d === 0) { dx = mind; dy = 0; } else { dx *= mind / d; dy *= mind / d; } d = mind; }
    var ux = dx / d, uy = dy / d;
    var aa = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    var h = Math.sqrt(Math.max(0, l1 * l1 - aa * aa));
    return {
      mid: [a[0] + ux * aa - uy * h * dir, a[1] + uy * aa + ux * h * dir],
      end: [a[0] + dx, a[1] + dy]
    };
  }

  function torsoPts(p) {
    var t = p.t * RAD, s = Math.sin(t), c = Math.cos(t), hip, neck;
    if (p.neck) { neck = p.neck; hip = [neck[0] - L.torso * s, neck[1] + L.torso * c]; }
    else { hip = p.hip; neck = [hip[0] + L.torso * s, hip[1] - L.torso * c]; }
    return { hip: hip, neck: neck };
  }

  function fill(p) {
    var o = {}, k;
    for (k in p) o[k] = p[k];
    if (!o.hf) o.hf = [o.hn[0] - 6, o.hn[1]];
    if (!o.ff) o.ff = [o.fn[0] - 8, o.fn[1]];
    if (o.ed == null) o.ed = 1;
    if (o.edf == null) o.edf = o.ed;
    if (o.kd == null) o.kd = -1;
    if (o.kdf == null) o.kdf = o.kd;
    if (o.ha == null) o.ha = o.t;
    return o;
  }

  function mix(A, B, u, anchor) {
    var ta = torsoPts(A), tb = torsoPts(B);
    var p = { t: lerp(A.t, B.t, u), ha: lerp(A.ha, B.ha, u), ed: A.ed, edf: A.edf, kd: A.kd, kdf: A.kdf };
    p[anchor] = lerp2(ta[anchor], tb[anchor], u);
    ['hn', 'hf', 'fn', 'ff'].forEach(function (k) { p[k] = lerp2(A[k], B[k], u); });
    return p;
  }

  function build(p) {
    var tp = torsoPts(p), hip = tp.hip, neck = tp.neck, ha = p.ha * RAD;
    return {
      hip: hip, neck: neck,
      head: [neck[0] + L.head * Math.sin(ha), neck[1] - L.head * Math.cos(ha)],
      aN: ik(neck, p.hn, L.up, L.fore, p.ed),
      aF: ik(neck, p.hf, L.up, L.fore, p.edf),
      lN: ik(hip, p.fn, L.thigh, L.shin, p.kd),
      lF: ik(hip, p.ff, L.thigh, L.shin, p.kdf)
    };
  }

  function poly(pts, w, col) {
    return '<polyline points="' + pts.map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') +
      '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function circ(c, r, fillc, stroke, w, op) {
    return '<circle cx="' + r1(c[0]) + '" cy="' + r1(c[1]) + '" r="' + r + '" fill="' + fillc + '"' +
      (stroke ? ' stroke="' + stroke + '" stroke-width="' + w + '"' : '') + (op ? ' opacity="' + op + '"' : '') + '/>';
  }

  function focoPt(j, f) {
    switch (f.p) {
      case 'torso': return lerp2(j.hip, j.neck, f.t);
      case 'muslo': return lerp2(j.hip, j.lN.mid, f.t);
      case 'pierna': return lerp2(j.lN.mid, j.lN.end, f.t);
      case 'brazo': return lerp2(j.neck, j.aN.mid, f.t);
      case 'cadera': return j.hip;
      default: return j.neck;
    }
  }

  function figure(j, ex) {
    var s = '', flat = ex.pie === 'flat', flatF = (ex.pieF || ex.pie) === 'flat';
    (ex.foco || []).forEach(function (f) { s += circ(focoPt(j, f), f.r || 12, HOT, null, 0, 0.9); });
    function leg(l, col, w, fl) {
      var pts = [j.hip, l.mid, l.end];
      if (fl) pts.push([l.end[0] + L.foot, l.end[1]]);
      return poly(pts, w, col);
    }
    function arm(a, col, w) { return poly([j.neck, a.mid, a.end], w, col); }
    s += leg(j.lF, FAR, 7, flatF) + arm(j.aF, FAR, 7);
    s += poly([j.hip, j.neck], 9, INK);
    s += leg(j.lN, INK, 8, flat) + arm(j.aN, INK, 8);
    if (ex.obj === 'mancuerna') {
      s += circ(j.aF.end, 7, FAR, INK, 3) + circ(j.aN.end, 8, HOT, INK, 3);
    }
    s += circ(j.head, L.hr, VOLT, INK, 4);
    return s;
  }

  function frame(ex, u) {
    var j = build(mix(ex.a, ex.b, u, ex.ancla || 'hip'));
    var g = '<rect x="-200" y="' + GY + '" width="720" height="200" fill="#d6d3c6"/><line x1="-200" y1="' + GY + '" x2="520" y2="' + GY + '" stroke="' + INK + '" stroke-width="3"/>';
    return g + (ex.props || '') + figure(j, ex);
  }

  /* ---------- Ayudas para armar poses ---------- */
  function plank(fx, th) {      // cuerpo recto apoyado en la punta de los pies
    var a = th * RAD, d = L.thigh + L.shin;
    return { hip: [fx + d * Math.cos(a), CY - d * Math.sin(a)], t: 90 - th, fn: [fx, CY], ff: [fx - 6, CY] };
  }
  function more(o, x) { for (var k in x) o[k] = x[k]; return o; }

  var STAND_NECK_Y = 95 - L.torso;

  /* ---------- Ejercicios ---------- */
  var EJERCICIOS = [
    {
      id: 'flexion', nombre: 'Flexión', grupo: 'pecho', nivel: 'Principiante', view: '50 52 240 150',
      musculos: 'Pecho, tríceps y hombros', ms: 1500, fases: ['Arriba', 'Abajo'], pie: 'punta',
      foco: [{ p: 'torso', t: 0.85 }],
      a: more(plank(82, 24.6), { hn: [198, CY], ed: 1 }),
      b: more(plank(82, 11), { hn: [198, CY], ed: 1 }),
      pasos: ['Manos un poco más anchas que los hombros y el cuerpo recto, como una tabla.', 'Bajá el pecho de forma controlada, con los codos a unos 45° del cuerpo.', 'Empujá el piso hasta estirar los brazos, sin trabar los codos.'],
      error: 'Cadera caída o levantada. Apretá abdomen y glúteos para mantener la línea.',
      facil: 'Con las rodillas apoyadas o con las manos sobre una mesa firme.'
    },
    {
      id: 'sentadilla', nombre: 'Sentadilla', grupo: 'piernas', nivel: 'Principiante',
      musculos: 'Cuádriceps y glúteos', ms: 1600, fases: ['Parado', 'Abajo'], pie: 'flat',
      foco: [{ p: 'muslo', t: 0.5 }],
      a: { hip: [148, 95], t: 0, hn: [196, 48], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [129, 131], t: 35, ha: 15, hn: [204, 86], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      pasos: ['Pies al ancho de los hombros y puntas apenas hacia afuera.', 'Mandá la cadera hacia atrás, como si te fueras a sentar.', 'Bajá con la espalda recta y subí empujando el piso con todo el pie.'],
      error: 'Levantar los talones. Si te pasa, abrí un poco más los pies o bajá menos.',
      facil: 'Sentate y pararte de una silla, sin apoyarte en las manos.'
    },
    {
      id: 'zancada', nombre: 'Zancada', grupo: 'piernas', nivel: 'Principiante',
      musculos: 'Cuádriceps, glúteos y equilibrio', ms: 1700, fases: ['Arriba', 'Abajo'], pie: 'flat', pieF: 'punta',
      foco: [{ p: 'muslo', t: 0.5 }],
      a: { hip: [142, 110], t: 0, hn: [164, 70], fn: [184, CY], ff: [102, 160], ed: 1, kd: -1, kdf: -1 },
      b: { hip: [142, 132], t: 0, hn: [164, 92], fn: [184, CY], ff: [102, 160], ed: 1, kd: -1, kdf: -1 },
      pasos: ['Dá un paso largo hacia adelante y mantené los pies fijos.', 'Bajá hasta que las dos rodillas queden cerca de 90°.', 'Empujá con la pierna de adelante para volver arriba.'],
      error: 'Paso muy corto: la rodilla de adelante pasa de la punta del pie y carga la articulación.',
      facil: 'Hacela con una mano apoyada en una pared, bajando menos.'
    },
    {
      id: 'plancha', nombre: 'Plancha', grupo: 'core', nivel: 'Principiante', view: '50 52 240 150',
      musculos: 'Abdomen, espalda baja y hombros', ms: 1800, fases: ['Mantené', 'Respirá'], pie: 'punta',
      foco: [{ p: 'torso', t: 0.5 }],
      a: more(plank(82, 12.5), { hn: [229, CY], ed: 1 }),
      b: (function () { var q = plank(82, 12.5); q.hip = [q.hip[0], q.hip[1] - 3]; q.hn = [229, CY]; q.ed = 1; return q; })(),
      pasos: ['Antebrazos en el piso, con los codos justo debajo de los hombros.', 'Cuerpo en línea recta de la cabeza a los talones.', 'Apretá abdomen y glúteos y respirá normal. Probá 20 a 40 segundos.'],
      error: 'La cadera se cae y la espalda baja trabaja de más. Si pasa, cortá y descansá.',
      facil: 'Con las rodillas apoyadas, o con las manos sobre un banco.'
    },
    {
      id: 'puente', nombre: 'Puente de glúteos', grupo: 'piernas', nivel: 'Principiante', view: '55 52 240 150',
      musculos: 'Glúteos e isquiotibiales', ms: 1700, fases: ['Abajo', 'Arriba'], pie: 'flat', ancla: 'neck',
      foco: [{ p: 'cadera' }],
      a: { neck: [112, CY], t: -90, ha: -65, hn: [162, CY], fn: [200, CY], ff: [194, CY], ed: -1, kd: -1 },
      b: { neck: [112, CY], t: -125, ha: -65, hn: [162, CY], fn: [200, CY], ff: [194, CY], ed: -1, kd: -1 },
      pasos: ['Acostado boca arriba, rodillas dobladas y pies apoyados.', 'Empujá con los talones y subí la cadera hasta alinear rodillas, cadera y hombros.', 'Apretá los glúteos un segundo arriba y bajá lento.'],
      error: 'Arquear la espalda baja para subir más. Subí hasta la línea recta y nada más.',
      facil: 'Subí menos y pausá un segundo arriba, sin apuro.'
    },
    {
      id: 'escaladores', nombre: 'Escaladores', grupo: 'core', nivel: 'Intermedio', view: '50 52 240 150',
      musculos: 'Abdomen, hombros y piernas (también sube el pulso)', ms: 500, fases: ['Pierna A', 'Pierna B'], pie: 'punta',
      foco: [{ p: 'torso', t: 0.5 }],
      a: more(plank(82, 24.6), { hn: [198, CY], ed: 1, fn: [150, CY], ff: [82, CY], kd: -1, kdf: -1 }),
      b: more(plank(82, 24.6), { hn: [198, CY], ed: 1, fn: [82, CY], ff: [150, CY], kd: -1, kdf: -1 }),
      pasos: ['Arrancá en posición de flexión, con los brazos estirados.', 'Llevá una rodilla hacia el pecho y cambiá de pierna rápido.', 'Mantené la cadera baja y respirá seguido. Hacelo de 20 a 40 segundos.'],
      error: 'Subir la cadera como una montaña. Imaginá que alguien te apoya una regla en la espalda.',
      facil: 'Hacelo lento, apoyando cada pie, o con las manos sobre un banco.'
    },
    {
      id: 'dominada', nombre: 'Dominada', grupo: 'espalda', nivel: 'Intermedio',
      musculos: 'Dorsales, bíceps y antebrazos', ms: 1900, fases: ['Colgado', 'Arriba'], pie: 'punta', ancla: 'neck',
      foco: [{ p: 'torso', t: 0.7 }],
      props: '<line x1="100" y1="14" x2="100" y2="171" stroke="' + FAR + '" stroke-width="4"/><line x1="220" y1="14" x2="220" y2="171" stroke="' + FAR + '" stroke-width="4"/><line x1="94" y1="14" x2="226" y2="14" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>',
      a: { neck: [152, 66], t: -4, ha: -25, hn: [160, 14], hf: [154, 14], fn: [126, 158], ff: [120, 160], ed: 1, kd: -1 },
      b: { neck: [150, 32], t: -4, ha: -10, hn: [160, 14], hf: [154, 14], fn: [124, 124], ff: [118, 128], ed: 1, kd: -1 },
      pasos: ['Agarrate de la barra un poco más ancho que los hombros, con los brazos estirados.', 'Tirá los codos hacia las costillas hasta pasar el mentón por la barra.', 'Bajá lento hasta estirar los brazos, sin soltarte de golpe.'],
      error: 'Balancearte para tomar impulso. Mantené el cuerpo quieto y subí con la espalda.',
      facil: 'Dominada negativa: subí con un salto y bajá lo más lento que puedas.'
    },
    {
      id: 'fondos', nombre: 'Fondos en silla', grupo: 'pecho', nivel: 'Principiante', view: '30 30 240 150',
      musculos: 'Tríceps, pecho y hombros', ms: 1500, fases: ['Arriba', 'Abajo'], pie: 'flat', ancla: 'neck',
      foco: [{ p: 'brazo', t: 0.5 }],
      props: '<line x1="58" y1="126" x2="58" y2="171" stroke="' + FAR + '" stroke-width="5"/><line x1="98" y1="126" x2="98" y2="171" stroke="' + FAR + '" stroke-width="5"/><rect x="52" y="120" width="52" height="6" fill="' + INK + '"/>',
      a: { neck: [110, 64], t: -6, ha: -6, hn: [100, 116], hf: [94, 116], fn: [166, CY], ff: [172, CY], ed: 1, kd: -1 },
      b: { neck: [112, 88], t: -6, ha: -6, hn: [100, 116], hf: [94, 116], fn: [166, CY], ff: [172, CY], ed: 1, kd: -1 },
      pasos: ['Manos en el borde de una silla firme, con los dedos hacia adelante y la cadera cerca.', 'Bajá doblando los codos hacia atrás, hasta unos 90°.', 'Empujá con los brazos para subir, con los hombros lejos de las orejas.'],
      error: 'Bajar de más. Si sentís molestia en el hombro, cortá ahí y subí.',
      facil: 'Doblá más las rodillas y acercá los pies a la silla.'
    },
    {
      id: 'press', nombre: 'Press de hombros', grupo: 'hombros', nivel: 'Principiante',
      musculos: 'Hombros y tríceps', ms: 1700, fases: ['Abajo', 'Arriba'], pie: 'flat', obj: 'mancuerna', view: '-20 -50 360 225',
      foco: [{ p: 'cuello', r: 12 }],
      a: { hip: [150, 95], t: 0, hn: [158, STAND_NECK_Y], hf: [152, STAND_NECK_Y], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [150, 95], t: 0, hn: [154, -8], hf: [148, -8], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      pasos: ['Parado, con una mancuerna en cada mano a la altura de los hombros.', 'Empujá hacia arriba hasta estirar los brazos sin trabar los codos.', 'Bajá controlado hasta los hombros y repetí.'],
      error: 'Arquear la espalda baja para subir el peso. Apretá el abdomen y usá menos peso.',
      facil: 'Empezá con poco peso, o con botellitas de agua.'
    },
    {
      id: 'peso-muerto', nombre: 'Peso muerto rumano', grupo: 'piernas', nivel: 'Intermedio',
      musculos: 'Isquiotibiales, glúteos y espalda baja', ms: 1900, fases: ['Parado', 'Abajo'], pie: 'flat', obj: 'mancuerna',
      foco: [{ p: 'cadera', r: 13 }],
      a: { hip: [150, 95], t: 0, hn: [153, 92], hf: [147, 92], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [122, 104], t: 65, ha: 40, hn: [173, 131], hf: [167, 131], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      pasos: ['Parado con una mancuerna en cada mano y las rodillas apenas flexionadas.', 'Llevá la cadera hacia atrás y bajá las pesas pegadas a las piernas.', 'Subí empujando la cadera hacia adelante, con la espalda siempre recta.'],
      error: 'Redondear la espalda. Mirá un punto en el piso adelante tuyo y bajá hasta donde la mantengas recta.',
      facil: 'Hacelo sin peso hasta que el movimiento te salga solo.'
    }
  ];

  EJERCICIOS.forEach(function (ex) { ex.a = fill(ex.a); ex.b = fill(ex.b); });

  var API = { EJERCICIOS: EJERCICIOS, frame: frame };
  root.SL_EJ = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;

  /* ---------- Interfaz de la página ---------- */
  function wave(x) {
    var ph = x % 2, tri = ph < 1 ? ph : 2 - ph;
    var v = (tri - 0.1) / 0.8;
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    return v * v * (3 - 2 * v);
  }

  function initUI() {
    var lista = document.getElementById('lista-ejercicios');
    if (!lista) return;

    var GRUPOS = { pecho: 'Pecho y brazos', espalda: 'Espalda', piernas: 'Piernas y glúteos', core: 'Core', hombros: 'Hombros' };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pausa = !!reduce, filtro = 'todos', cards = [];
    var btnPausa = document.getElementById('ej-pausa');
    var conteo = document.getElementById('ej-conteo');
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.target._c) e.target._c.vis = e.isIntersecting; });
    }, { rootMargin: '120px' }) : null;

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    }

    function cardHTML(ex) {
      return '<article class="ex-card">' +
        '<div class="ex-fig">' +
        '<svg viewBox="' + (ex.view || '0 0 320 200') + '" role="img" aria-label="Animación del ejercicio ' + esc(ex.nombre) + '"><g class="fig"></g></svg>' +
        '<div class="ex-tags"><span class="ex-tags-l">Posición</span>' +
        '<button type="button" class="ex-tag" data-p="0">' + esc(ex.fases[0]) + '</button>' +
        '<button type="button" class="ex-tag" data-p="1">' + esc(ex.fases[1]) + '</button></div>' +
        '</div>' +
        '<div class="ex-body">' +
        '<p class="ex-grupo">' + esc(GRUPOS[ex.grupo]) + ' · ' + esc(ex.nivel) + '</p>' +
        '<h3>' + esc(ex.nombre) + '</h3>' +
        '<p class="ex-musculos"><b>Trabaja:</b> ' + esc(ex.musculos) + '</p>' +
        '<ol class="ex-pasos">' + ex.pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' +
        '<p class="ex-nota ex-error"><b>Error común</b>' + esc(ex.error) + '</p>' +
        '<p class="ex-nota ex-facil"><b>Versión más fácil</b>' + esc(ex.facil) + '</p>' +
        '</div></article>';
    }

    function draw(c, u) {
      if (u === c.u) return;
      c.u = u;
      c.g.innerHTML = frame(c.ex, u);
      var on = u < 0.5 ? 0 : 1;
      if (on !== c.on) {
        c.on = on;
        c.tags.forEach(function (t, i) { t.classList.toggle('on', i === on); });
      }
    }

    function pintar() {
      if (io) cards.forEach(function (c) { io.unobserve(c.el); });
      var lst = EJERCICIOS.filter(function (e) { return filtro === 'todos' || e.grupo === filtro; });
      conteo.textContent = lst.length + (lst.length === 1 ? ' ejercicio' : ' ejercicios');
      lista.innerHTML = lst.map(cardHTML).join('');
      cards = Array.prototype.slice.call(lista.querySelectorAll('.ex-card')).map(function (el, i) {
        var c = { el: el, ex: lst[i], g: el.querySelector('.fig'), tags: Array.prototype.slice.call(el.querySelectorAll('.ex-tag')), vis: !io, pin: null, t0: performance.now(), frozen: 0, u: -1, on: -1 };
        el._c = c;
        c.tags.forEach(function (t) {
          t.addEventListener('click', function () {
            var p = +t.getAttribute('data-p');
            c.pin = (c.pin === p) ? null : p;
            c.tags.forEach(function (x, k) { x.classList.toggle('pin', c.pin === k); });
            if (c.pin === null) c.t0 = performance.now() - c.frozen * c.ex.ms;
            else draw(c, c.pin);
          });
        });
        draw(c, 0);
        if (io) io.observe(el);
        return c;
      });
    }

    function loop(now) {
      cards.forEach(function (c) {
        if (!c.vis) return;
        if (c.pin !== null) draw(c, c.pin);
        else if (!pausa) { c.frozen = (now - c.t0) / c.ex.ms; draw(c, wave(c.frozen)); }
      });
      requestAnimationFrame(loop);
    }

    function setPausa(p) {
      var now = performance.now();
      if (!p && pausa) cards.forEach(function (c) { c.t0 = now - c.frozen * c.ex.ms; });
      pausa = p;
      if (btnPausa) {
        btnPausa.setAttribute('aria-pressed', String(p));
        btnPausa.textContent = p ? 'Reanudar animaciones' : 'Pausar animaciones';
      }
    }

    if (btnPausa) btnPausa.addEventListener('click', function () { setPausa(!pausa); });

    var chips = Array.prototype.slice.call(document.querySelectorAll('#filtros-ej .chip'));
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        ch.setAttribute('aria-pressed', 'true');
        filtro = ch.getAttribute('data-valor');
        pintar();
      });
    });

    setPausa(pausa);
    pintar();
    requestAnimationFrame(loop);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initUI);
    else initUI();
  }
})(typeof window !== 'undefined' ? window : globalThis);