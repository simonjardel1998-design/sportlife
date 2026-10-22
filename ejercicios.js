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
      if (fl) pts.push([l.end[0] + L.foot, ex.tg ? Math.max(l.end[1], CY) : l.end[1]]);
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
    return g + (ex.props || '') + figure(j, ex) + (ex.dyn ? ex.dyn(j, u) : '');
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
    ,{
      id: 'flexion-pared', nombre: 'Flexión en la pared', grupo: 'pecho', nivel: 'Principiante', view: '70 18 256 160',
      musculos: 'Pecho, hombros y tríceps (versión suave)', ms: 1500, fases: ['Lejos', 'Cerca'], pie: 'flat',
      foco: [{ p: 'torso', t: 0.85 }],
      props: '<rect x="214" y="0" width="16" height="171" fill="#bdbbb0" stroke="' + INK + '" stroke-width="3"/>',
      a: more(plank(118, 68), { hn: [214, 64], ed: 1 }),
      b: more(plank(118, 55), { hn: [214, 64], ed: 1 }),
      pasos: ['Parate a un paso de la pared, con las manos apoyadas a la altura del pecho.', 'Doblá los codos y acercá el pecho a la pared, con el cuerpo recto.', 'Empujá la pared para volver a la posición inicial.'],
      error: 'Despegar los talones o hundir la cadera. Mantené el cuerpo en una línea recta.',
      facil: 'Ya es la versión más fácil. Para subir de nivel, pasá a flexiones con las manos en una mesa.'
    }
    ,{
      id: 'curl', nombre: 'Curl de bíceps', grupo: 'pecho', nivel: 'Principiante',
      musculos: 'Bíceps y antebrazos', ms: 1600, fases: ['Abajo', 'Arriba'], pie: 'flat', obj: 'mancuerna',
      foco: [{ p: 'brazo', t: 0.5 }],
      a: { hip: [148, 95], t: 0, hn: [153, 92], hf: [147, 92], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [148, 95], t: 0, hn: [176, 56], hf: [147, 92], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      pasos: ['Parado, con una mancuerna en la mano y el brazo estirado a un costado.', 'Subí el peso doblando solo el codo, sin separarlo del cuerpo.', 'Bajá lento hasta estirar el brazo. Después cambiá de brazo.'],
      error: 'Balancear el cuerpo para subir el peso. Si te pasa, usá menos peso.',
      facil: 'Usá una botella de agua o una mochila liviana en lugar de una mancuerna.'
    }
    ,{
      id: 'remo-mancuerna', nombre: 'Remo con mancuerna', grupo: 'espalda', nivel: 'Principiante',
      musculos: 'Dorsales, espalda media y bíceps', ms: 1700, fases: ['Abajo', 'Arriba'], pie: 'flat', obj: 'mancuerna',
      foco: [{ p: 'torso', t: 0.6 }],
      a: { hip: [120, 100], t: 65, ha: 35, hn: [172, 129], hf: [152, 120], fn: [126, CY], ff: [120, CY], ed: 1, kd: -1 },
      b: { hip: [120, 100], t: 65, ha: 35, hn: [150, 104], hf: [152, 120], fn: [126, CY], ff: [120, CY], ed: 1, kd: -1 },
      pasos: ['Inclinate hacia adelante con la espalda recta y una mano apoyada en una silla o en tu rodilla.', 'Con la otra mano, tirá la mancuerna hacia la cadera, llevando el codo hacia atrás.', 'Bajá lento hasta estirar el brazo. Hacé todas las repeticiones y cambiá de lado.'],
      error: 'Girar el torso para subir el peso. Mantené los hombros paralelos al piso.',
      facil: 'Usá una botella de agua o una mochila liviana.'
    }
    ,{
      id: 'superman', nombre: 'Superman', grupo: 'espalda', nivel: 'Principiante', view: '10 62 230 144',
      musculos: 'Espalda baja, glúteos y hombros', ms: 1700, fases: ['Apoyado', 'Elevado'], pie: 'punta',
      foco: [{ p: 'torso', t: 0.25 }],
      a: { hip: [95, 161], t: 90, hn: [201, 160], hf: [201, 161], fn: [24, 161], ff: [24, 162], ed: 1, kd: -1 },
      b: { hip: [95, 161], t: 80, hn: [199, 139], hf: [199, 140], fn: [25, 149], ff: [25, 150], ed: 1, kd: -1 },
      pasos: ['Acostado boca abajo, con los brazos estirados hacia adelante.', 'Levantá a la vez brazos, pecho y piernas del piso, sin forzar el cuello.', 'Mantené un segundo arriba y bajá lento.'],
      error: 'Mirar hacia arriba y forzar el cuello. Mirá el piso, con la cabeza alineada.',
      facil: 'Levantá solo los brazos y el pecho, o solo las piernas, de a una cosa por vez.'
    }
    ,{
      id: 'hollow', nombre: 'Hollow hold', grupo: 'core', nivel: 'Intermedio', view: '20 85 240 150',
      musculos: 'Abdomen profundo y flexores de cadera', ms: 1800, fases: ['Relajado', 'Hollow'], pie: 'punta',
      foco: [{ p: 'torso', t: 0.5 }],
      a: { hip: [168, 162], t: -90, hn: [62, 162], hf: [62, 163], fn: [239, 162], ff: [239, 163], ed: 1, kd: -1 },
      b: { hip: [168, 162], t: -80, hn: [63, 141], hf: [63, 142], fn: [234, 135], ff: [235, 138], ed: 1, kd: -1 },
      pasos: ['Acostado boca arriba, con los brazos estirados detrás de la cabeza.', 'Pegá la espalda baja al piso y levantá hombros y piernas a la vez.', 'Mantené la posición y respirá. Empezá con 10 a 20 segundos.'],
      error: 'Arquear la espalda baja. Si se despega del piso, subí más las piernas o doblá las rodillas.',
      facil: 'Con las rodillas dobladas y los brazos a los costados.'
    }
    ,{
      id: 'crunch', nombre: 'Abdominal corto', grupo: 'core', nivel: 'Principiante', view: '50 80 180 112',
      musculos: 'Abdomen (parte superior)', ms: 1400, fases: ['Abajo', 'Arriba'], pie: 'flat',
      foco: [{ p: 'torso', t: 0.5 }],
      a: { hip: [165, 162], t: -90, hn: [98, 154], hf: [104, 152], fn: [205, CY], ff: [199, CY], ed: 1, kd: -1 },
      b: { hip: [165, 162], t: -60, hn: [108, 122], hf: [114, 120], fn: [205, CY], ff: [199, CY], ed: 1, kd: -1 },
      pasos: ['Acostado boca arriba, con las rodillas dobladas y las manos suaves detrás de la cabeza.', 'Subí los hombros del piso llevando las costillas hacia la cadera.', 'Bajá lento sin apoyar del todo la cabeza.'],
      error: 'Tirar del cuello con las manos. El movimiento sale del abdomen.',
      facil: 'Cruzá los brazos sobre el pecho y subí un poquito menos.'
    }
    ,{
      id: 'sentadilla-salto', nombre: 'Sentadilla con salto', grupo: 'cardio', nivel: 'Intermedio', view: '-20 -50 360 225',
      musculos: 'Piernas, glúteos y potencia', ms: 1100, fases: ['Abajo', 'En el aire'], pie: 'flat',
      foco: [{ p: 'muslo', t: 0.5 }],
      a: { hip: [129, 131], t: 35, ha: 15, hn: [128, 108], hf: [122, 106], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [150, 70], t: 0, hn: [158, -30], hf: [152, -30], fn: [150, 134], ff: [144, 136], ed: 1, kd: -1 },
      pasos: ['Bajá a una sentadilla con los brazos hacia atrás.', 'Saltá hacia arriba lo más alto que puedas, con los brazos al cielo.', 'Aterrizá suave, con las rodillas flexionadas, y volvé a bajar.'],
      error: 'Aterrizar con las piernas duras. Amortiguá el golpe doblando rodillas y cadera.',
      facil: 'Hacé una sentadilla normal y subí en puntas de pie, sin saltar.'
    }
    ,{
      id: 'rodillas-altas', nombre: 'Rodillas altas', grupo: 'cardio', nivel: 'Principiante',
      musculos: 'Piernas, abdomen y cardio', ms: 600, fases: ['Rodilla A', 'Rodilla B'], pie: 'flat',
      foco: [{ p: 'muslo', t: 0.5 }],
      a: { hip: [148, 95], t: 3, hn: [128, 80], hf: [176, 78], fn: [176, 132], ff: [140, CY], ed: 1, edf: 1, kd: -1, kdf: -1 },
      b: { hip: [148, 95], t: 3, hn: [176, 78], hf: [128, 80], fn: [142, CY], ff: [176, 132], ed: 1, edf: 1, kd: -1, kdf: -1 },
      pasos: ['Parado, trotá en el lugar llevando las rodillas a la altura de la cadera.', 'Movés los brazos al revés que las piernas, como al correr.', 'Mantené el ritmo parejo y respirá de forma constante.'],
      error: 'Inclinarte hacia atrás. Mantené el torso derecho y mirá al frente.',
      facil: 'Subí las rodillas solo hasta la mitad y a un ritmo más lento.'
    }
    ,{
      id: 'sentadilla-pared', nombre: 'Sentadilla en la pared', grupo: 'piernas', nivel: 'Principiante', view: '44 4 267 167',
      musculos: 'Cuádriceps y glúteos (aguante)', ms: 1900, fases: ['Parado', 'Abajo'], pie: 'flat',
      foco: [{ p: 'muslo', t: 0.5 }],
      props: '<rect x="92" y="0" width="18" height="171" fill="#bdbbb0" stroke="' + INK + '" stroke-width="3"/>',
      a: { hip: [124, 95], t: 0, hn: [129, 92], hf: [123, 92], fn: [126, CY], ff: [120, CY], ed: 1, kd: -1 },
      b: { hip: [124, 128], t: 0, hn: [150, 118], hf: [144, 118], fn: [160, CY], ff: [154, CY], ed: 1, kd: -1 },
      pasos: ['Apoyá la espalda en la pared y alejá los pies un paso.', 'Bajá deslizando la espalda hasta que las rodillas queden en 90°.', 'Aguantá ahí el tiempo de la serie y subí despacio.'],
      error: 'Apoyar las manos en las piernas para ayudarte, o dejar que las rodillas pasen la punta de los pies.',
      facil: 'Bajá solo hasta la mitad y aguantá menos tiempo.'
    }
    ,{
      id: 'sentadilla-goblet', nombre: 'Sentadilla goblet', grupo: 'piernas', nivel: 'Principiante',
      musculos: 'Piernas, glúteos y abdomen', ms: 1600, fases: ['Parado', 'Abajo'], pie: 'flat', obj: 'mancuerna',
      foco: [{ p: 'muslo', t: 0.5 }],
      a: { hip: [148, 95], t: 0, hn: [166, 62], hf: [162, 62], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [129, 131], t: 35, ha: 15, hn: [178, 106], hf: [174, 106], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      pasos: ['Sostené una mancuerna contra el pecho, con las dos manos.', 'Bajá con la espalda recta, llevando los codos entre las rodillas.', 'Empujá el piso con todo el pie para subir.'],
      error: 'Dejar caer el pecho hacia adelante. El peso te ayuda a mantenerlo arriba.',
      facil: 'Hacela sin peso o con una botella de agua grande.'
    }
    ,{
      id: 'talones', nombre: 'Elevación de talones', grupo: 'piernas', nivel: 'Principiante', tg: true,
      musculos: 'Gemelos y tobillos', ms: 1300, fases: ['Abajo', 'Arriba'], pie: 'flat',
      foco: [{ p: 'pierna', t: 0.45 }],
      a: { hip: [148, 95], t: 0, hn: [153, 92], hf: [147, 92], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [148, 87], t: 0, hn: [153, 84], hf: [147, 84], fn: [150, 158], ff: [144, 158], ed: 1, kd: -1 },
      pasos: ['Parado, con los pies al ancho de la cadera. Podés apoyarte en una pared.', 'Subí en puntas de pie lo más alto que puedas.', 'Aguantá un segundo y bajá lento hasta apoyar los talones.'],
      error: 'Hacerlo muy rápido y con rebote. Subí y bajá controlado.',
      facil: 'Apoyate con una mano en la pared o en el respaldo de una silla.'
    }
    ,{
      id: 'pike', nombre: 'Pike push-up', grupo: 'hombros', nivel: 'Intermedio', view: '60 50 240 150',
      musculos: 'Hombros, tríceps y parte alta del pecho', ms: 1700, fases: ['Arriba', 'Abajo'], pie: 'punta',
      foco: [{ p: 'brazo', t: 0.35 }],
      a: { hip: [128, 100], t: 110, hn: [190, CY], hf: [184, CY], fn: [104, CY], ff: [100, CY], ed: 1, kd: -1 },
      b: { hip: [128, 100], t: 135, hn: [190, CY], hf: [184, CY], fn: [104, CY], ff: [100, CY], ed: 1, kd: -1 },
      pasos: ['Manos y pies en el piso, con la cadera alta formando una "V" invertida.', 'Doblá los codos y llevá la cabeza hacia el piso, entre las manos.', 'Empujá para volver arriba, con la cadera siempre alta.'],
      error: 'Bajar el cuerpo como en una flexión común. Acá la cadera tiene que quedar arriba.',
      facil: 'Poné las manos sobre una silla o escalón para que la inclinación sea menor.'
    }
    ,{
      id: 'elevacion-frontal', nombre: 'Elevación frontal', grupo: 'hombros', nivel: 'Principiante',
      musculos: 'Hombros (parte delantera)', ms: 1500, fases: ['Abajo', 'Arriba'], pie: 'flat', obj: 'mancuerna',
      foco: [{ p: 'cuello', r: 12 }],
      a: { hip: [148, 95], t: 0, hn: [153, 92], hf: [147, 92], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      b: { hip: [148, 95], t: 0, hn: [199, 45], hf: [193, 47], fn: [150, CY], ff: [144, CY], ed: 1, kd: -1 },
      pasos: ['Parado, con una mancuerna en cada mano frente a los muslos.', 'Subí los brazos estirados al frente hasta la altura de los hombros.', 'Bajá lento sin balancear el cuerpo.'],
      error: 'Subir más arriba de los hombros o balancearte. Usá menos peso.',
      facil: 'Usá botellitas de agua y subí un brazo por vez.'
    }
    ,{
      id: 'rodillas-colgado', nombre: 'Elevación de rodillas colgado', grupo: 'core', nivel: 'Intermedio', view: '-10 -40 344 215',
      musculos: 'Abdomen bajo, flexores de cadera y agarre', ms: 1700, fases: ['Colgado', 'Rodillas arriba'], pie: 'punta', ancla: 'neck',
      foco: [{ p: 'torso', t: 0.85 }],
      props: '<line x1="100" y1="-22" x2="100" y2="171" stroke="' + FAR + '" stroke-width="4"/><line x1="220" y1="-22" x2="220" y2="171" stroke="' + FAR + '" stroke-width="4"/><line x1="94" y1="-22" x2="226" y2="-22" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>',
      a: { neck: [152, 30], t: -4, ha: -4, hn: [160, -22], hf: [154, -22], fn: [160, 155], ff: [156, 155], ed: 1, kd: -1 },
      b: { neck: [152, 30], t: -4, ha: -4, hn: [160, -22], hf: [154, -22], fn: [196, 100], ff: [190, 104], ed: 1, kd: -1 },
      pasos: ['Colgate de una barra con los brazos estirados y los hombros activos.', 'Subí las rodillas hacia el pecho, enrollando la cadera.', 'Bajá lento sin balancearte.'],
      error: 'Balancearte para tomar impulso. Si pasa, pausá abajo un segundo entre repeticiones.',
      facil: 'Subí solo hasta que las rodillas queden a la altura de la cadera, o hacelo acostado en el piso.'
    }
    ,{
      id: 'jalon', nombre: 'Jalón al pecho', grupo: 'espalda', nivel: 'Intermedio', view: '30 -14 300 188',
      musculos: 'Dorsales y bíceps', ms: 1800, fases: ['Arriba', 'Pecho'], pie: 'flat',
      foco: [{ p: 'torso', t: 0.6 }],
      props: '<line x1="206" y1="-14" x2="206" y2="171" stroke="' + FAR + '" stroke-width="5"/><line x1="206" y1="-6" x2="146" y2="-6" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/><rect x="96" y="144" width="66" height="7" fill="' + INK + '"/><line x1="129" y1="151" x2="129" y2="171" stroke="' + FAR + '" stroke-width="6"/>',
      dyn: function (j) {
        var h = j.aN.end;
        return '<line x1="146" y1="-6" x2="' + r1(h[0]) + '" y2="' + r1(h[1]) + '" stroke="' + INK + '" stroke-width="2.5"/>' + circ(h, 5, INK, null, 0);
      },
      a: { hip: [130, 138], t: -6, hn: [140, 36], hf: [134, 37], fn: [186, CY], ff: [180, CY], ed: 1, kd: -1 },
      b: { hip: [130, 138], t: -6, hn: [150, 80], hf: [144, 81], fn: [186, CY], ff: [180, CY], ed: 1, kd: -1 },
      pasos: ['Sentate con los muslos bajo el pad y agarrá la barra un poco más ancho que los hombros.', 'Tirá la barra hacia el pecho llevando los codos hacia abajo y atrás.', 'Subí lento hasta estirar los brazos, sin que el peso te levante.'],
      error: 'Tirar la barra con el cuerpo hacia atrás. El movimiento sale de la espalda, no del balanceo.',
      facil: 'Bajá el peso y hacé menos repeticiones, o usá una banda elástica anclada arriba.'
    }
    ,{
      id: 'press-banca', nombre: 'Press de banca con mancuernas', grupo: 'pecho', nivel: 'Intermedio', view: '40 30 256 160',
      musculos: 'Pecho, hombros y tríceps', ms: 1800, fases: ['Abajo', 'Arriba'], pie: 'flat', obj: 'mancuerna',
      foco: [{ p: 'torso', t: 0.85 }],
      props: '<rect x="62" y="134" width="120" height="8" fill="' + INK + '"/><line x1="76" y1="142" x2="76" y2="171" stroke="' + FAR + '" stroke-width="6"/><line x1="168" y1="142" x2="168" y2="171" stroke="' + FAR + '" stroke-width="6"/>',
      a: { hip: [150, 128], t: -90, hn: [104, 108], hf: [100, 109], fn: [196, CY], ff: [190, CY], ed: 1, kd: -1 },
      b: { hip: [150, 128], t: -90, hn: [96, 76], hf: [96, 77], fn: [196, CY], ff: [190, CY], ed: 1, kd: -1 },
      pasos: ['Acostado en el banco, con los pies firmes en el piso y una mancuerna en cada mano.', 'Bajá las mancuernas a los costados del pecho, con los codos a unos 45°.', 'Empujá hacia arriba hasta estirar los brazos y bajá lento.'],
      error: 'Dejar caer el peso rápido o rebotar. Pedile a alguien que te acompañe si el peso es alto.',
      facil: 'Hacé flexiones con las manos en una mesa, o usá mancuernas más livianas.'
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

    var GRUPOS = { pecho: 'Pecho y brazos', espalda: 'Espalda', piernas: 'Piernas y glúteos', core: 'Core', hombros: 'Hombros', cardio: 'Cardio y saltos' };
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
