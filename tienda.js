/* SportLife — tienda de demostración.
   Productos, precios e ilustraciones de ejemplo: no se cobra ni se envía nada. */
(function () {
  'use strict';

  var INK = '#0d0d0d', VOLT = '#d6ff3d', HOT = '#ff4b1f', PAPER = '#f2f0e9', FAR = '#8a887c';
  var FONT = "Anton,Impact,'Arial Narrow',sans-serif";

  /* ---------- Ilustraciones (SVG dibujado con código, estilo del sitio) ---------- */
  function t(x, y, s, size, col) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="' + FONT + '" font-size="' + size +
      '" fill="' + (col || INK) + '" stroke="none" letter-spacing=".5">' + s + '</text>';
  }
  function loop(cy, rx, ry, col) {
    return '<ellipse cx="120" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + INK + '" stroke-width="18"/>' +
      '<ellipse cx="120" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + col + '" stroke-width="9"/>';
  }
  var ART = {
    tub: function (a) {
      return '<rect x="78" y="38" width="84" height="22" rx="3" fill="' + INK + '"/>' +
        '<rect x="72" y="60" width="96" height="100" rx="5" fill="' + a.c + '"/>' +
        '<rect x="72" y="88" width="96" height="46" fill="' + PAPER + '"/>' + t(120, 110, a.t, 17) + t(120, 127, a.s, 11);
    },
    pouch: function (a) {
      return '<path d="M70 54 L170 54 L178 160 L62 160 Z" fill="' + a.c + '"/>' +
        '<rect x="68" y="40" width="104" height="16" fill="' + INK + '"/>' +
        '<rect x="78" y="86" width="84" height="48" fill="' + PAPER + '"/>' + t(120, 108, a.t, 16) + t(120, 125, a.s, 10);
    },
    bars: function () {
      return '<g transform="rotate(-6 120 100)">' +
        '<rect x="46" y="116" width="148" height="34" rx="6" fill="' + HOT + '"/>' +
        '<rect x="46" y="76" width="148" height="34" rx="6" fill="' + VOLT + '"/>' +
        '<rect x="46" y="36" width="148" height="34" rx="6" fill="' + PAPER + '"/>' +
        '<line x1="150" y1="116" x2="150" y2="150"/><line x1="150" y1="76" x2="150" y2="110"/><line x1="150" y1="36" x2="150" y2="70"/></g>';
    },
    shaker: function () {
      return '<path d="M90 62 L150 62 L145 160 L95 160 Z" fill="' + PAPER + '"/>' +
        '<path d="M93 118 L147 118 L145 160 L95 160 Z" fill="' + VOLT + '"/>' +
        '<rect x="84" y="40" width="72" height="22" rx="4" fill="' + HOT + '"/>' +
        '<rect x="108" y="28" width="24" height="12" rx="3" fill="' + INK + '"/>' +
        '<line x1="92" y1="88" x2="108" y2="88"/><line x1="94" y1="104" x2="108" y2="104"/>';
    },
    bottle: function () {
      return '<rect x="104" y="30" width="32" height="18" rx="3" fill="' + INK + '"/>' +
        '<rect x="88" y="48" width="64" height="112" rx="14" fill="' + VOLT + '"/>' +
        '<rect x="88" y="88" width="64" height="40" fill="' + PAPER + '"/>' + t(120, 118, '1 L', 22);
    },
    rope: function () {
      return '<path d="M49 98 C46 186 194 186 191 98" fill="none"/>' +
        '<rect x="38" y="44" width="22" height="62" rx="6" fill="' + HOT + '"/>' +
        '<rect x="180" y="44" width="22" height="62" rx="6" fill="' + HOT + '"/>' +
        '<rect x="38" y="84" width="22" height="10" fill="' + INK + '" stroke="none"/><rect x="180" y="84" width="22" height="10" fill="' + INK + '" stroke="none"/>';
    },
    bands: function () {
      return loop(130, 76, 24, HOT) + loop(112, 60, 19, VOLT) + loop(96, 46, 14, PAPER);
    },
    dumbbell: function () {
      return '<g transform="translate(0 34)">' +
        '<rect x="64" y="84" width="112" height="12" fill="' + FAR + '"/>' +
        '<rect x="52" y="60" width="20" height="60" rx="4" fill="' + INK + '"/><rect x="34" y="70" width="18" height="40" rx="4" fill="' + INK + '"/>' +
        '<rect x="168" y="60" width="20" height="60" rx="4" fill="' + INK + '"/><rect x="188" y="70" width="18" height="40" rx="4" fill="' + INK + '"/>' +
        '<rect x="54" y="86" width="16" height="8" fill="' + VOLT + '" stroke="none"/><rect x="170" y="86" width="16" height="8" fill="' + VOLT + '" stroke="none"/></g>';
    },
    mat: function () {
      return '<rect x="96" y="142" width="108" height="16" fill="' + HOT + '"/>' +
        '<circle cx="92" cy="118" r="42" fill="' + HOT + '"/><circle cx="92" cy="118" r="28" fill="none"/><circle cx="92" cy="118" r="14" fill="none"/>';
    },
    pullup: function () {
      return '<rect x="44" y="52" width="18" height="100" rx="3" fill="' + HOT + '"/><rect x="178" y="52" width="18" height="100" rx="3" fill="' + HOT + '"/>' +
        '<rect x="38" y="64" width="164" height="12" rx="4" fill="' + INK + '"/>' +
        '<rect x="80" y="61" width="30" height="18" rx="3" fill="' + VOLT + '"/><rect x="130" y="61" width="30" height="18" rx="3" fill="' + VOLT + '"/>';
    },
    wheel: function () {
      return '<line x1="50" y1="116" x2="190" y2="116" stroke-width="8"/>' +
        '<rect x="28" y="104" width="32" height="24" rx="6" fill="' + VOLT + '"/><rect x="180" y="104" width="32" height="24" rx="6" fill="' + VOLT + '"/>' +
        '<circle cx="120" cy="116" r="44" fill="' + INK + '"/><circle cx="120" cy="116" r="24" fill="' + HOT + '"/><circle cx="120" cy="116" r="8" fill="' + PAPER + '"/>';
    },
    shirt: function () {
      return '<path d="M80 42 L106 34 Q120 52 134 34 L160 42 L194 72 L172 94 L160 82 L160 156 L80 156 L80 82 L68 94 L46 72 Z" fill="' + INK + '"/>' +
        '<path d="M106 34 Q120 52 134 34" fill="none" stroke="' + VOLT + '" stroke-width="4"/>' + t(120, 112, 'SPORT/LIFE', 17, VOLT);
    }
  };
  function dibujo(p) {
    return '<svg viewBox="0 0 240 180" role="img" aria-label="Ilustración: ' + p.nombre + '">' +
      '<ellipse cx="120" cy="165" rx="78" ry="6" fill="rgba(13,13,13,.16)"/>' +
      '<g stroke="' + INK + '" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">' + ART[p.art.k](p.art) + '</g></svg>';
  }

  /* ---------- Productos de ejemplo (línea SportLife) ---------- */
  var CATS = { suplementos: 'Suplementos', accesorios: 'Accesorios', equipo: 'Equipo', ropa: 'Ropa SportLife' };
  var PRODUCTOS = [
    { id: 'creatina', nombre: 'Creatina monohidrato', cat: 'suplementos', precio: 24900, aviso: true, badge: 'Más pedido',
      art: { k: 'tub', c: VOLT, t: 'CREATINA', s: '300 G' }, desc: 'Suplemento en polvo, sin sabor. Muy usado por quienes entrenan fuerza.',
      det: ['Sin sabor: se mezcla con agua o jugo', 'Pote de 300 g', 'Leé la etiqueta y consultá a un profesional antes de usarla'] },
    { id: 'whey', nombre: 'Proteína de suero (whey)', cat: 'suplementos', precio: 39900, aviso: true,
      art: { k: 'pouch', c: HOT, t: 'PROTEÍNA', s: 'WHEY 1 KG' }, desc: 'Proteína en polvo sabor vainilla para complementar tu alimentación.',
      det: ['Sabor vainilla', 'Bolsa de 1 kg', 'Es un complemento: no reemplaza las comidas'] },
    { id: 'vegetal', nombre: 'Proteína vegetal', cat: 'suplementos', precio: 42500, aviso: true,
      art: { k: 'pouch', c: VOLT, t: 'VEGETAL', s: 'CACAO 900 G' }, desc: 'Proteína sin lácteos, sabor cacao, para quienes no consumen leche.',
      det: ['Sabor cacao', 'Bolsa de 900 g', 'Sin lácteos: revisá igual la etiqueta por alérgenos'] },
    { id: 'barras', nombre: 'Barras de proteína x12', cat: 'suplementos', precio: 19800, aviso: true,
      art: { k: 'bars' }, desc: 'Caja de 12 barras para llevar en la mochila.',
      det: ['Sabores surtidos', '12 unidades', 'Sirven de snack, no para reemplazar comidas'] },
    { id: 'shaker', nombre: 'Shaker 600 ml', cat: 'accesorios', precio: 6500,
      art: { k: 'shaker' }, desc: 'Vaso mezclador con marcas de medida y tapa a rosca.',
      det: ['Capacidad 600 ml', 'Tapa a rosca', 'Se lava a mano'] },
    { id: 'botella', nombre: 'Botella deportiva 1 L', cat: 'accesorios', precio: 8900,
      art: { k: 'bottle' }, desc: 'Para llevar agua a todos lados: al gimnasio, a clase, a la cancha.',
      det: ['Capacidad 1 litro', 'Tapa con pico', 'Entra en el portavasos de la mochila'] },
    { id: 'soga', nombre: 'Soga de saltar', cat: 'accesorios', precio: 7200,
      art: { k: 'rope' }, desc: 'Regulable, ideal para el cardio y para entrar en calor.',
      det: ['Largo regulable', 'Mangos antideslizantes', 'Ocupa muy poco lugar'] },
    { id: 'bandas', nombre: 'Bandas elásticas x5', cat: 'accesorios', precio: 12800, badge: 'Ideal para empezar',
      art: { k: 'bands' }, desc: 'Set de 5 bandas de distintas resistencias para entrenar en casa.',
      det: ['5 niveles de resistencia', 'Livianas: entran en la mochila', 'Sirven para piernas, espalda y hombros'] },
    { id: 'rueda', nombre: 'Rueda abdominal', cat: 'accesorios', precio: 11400,
      art: { k: 'wheel' }, desc: 'Rueda con mangos antideslizantes para trabajar el abdomen.',
      det: ['Nivel intermedio', 'Mangos antideslizantes', 'Empezá con poco recorrido y ayudate con las rodillas'] },
    { id: 'mancuernas', nombre: 'Mancuernas ajustables 2 x 10 kg', cat: 'equipo', precio: 68000,
      art: { k: 'dumbbell' }, desc: 'Par de mancuernas con discos intercambiables, hasta 10 kg cada una.',
      det: ['Par de 2 mancuernas', 'Hasta 10 kg cada una', 'Ideal para las rutinas de gimnasio de la página'] },
    { id: 'colchoneta', nombre: 'Colchoneta 8 mm', cat: 'equipo', precio: 18500,
      art: { k: 'mat' }, desc: 'Antideslizante, para flexiones, planchas y abdominales.',
      det: ['Espesor de 8 mm', 'Se enrolla y se guarda fácil', 'Superficie antideslizante'] },
    { id: 'barra', nombre: 'Barra de dominadas para puerta', cat: 'equipo', precio: 29900,
      art: { k: 'pullup' }, desc: 'Barra para marco de puerta. Revisá que el marco aguante tu peso.',
      det: ['Se instala sin agujeros', 'Con agarres acolchados', 'Para la rutina "Barra y espalda"'] },
    { id: 'remera', nombre: 'Remera SportLife', cat: 'ropa', precio: 14900, badge: 'Línea SportLife',
      art: { k: 'shirt' }, desc: 'Remera negra de algodón con el logo del proyecto.',
      det: ['Algodón', 'Talles S a XL', 'Diseño del equipo de SportLife'] }
  ];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function $$$(n) { return '$' + Number(n).toLocaleString('es-AR'); }
  function byId(id) { return PRODUCTOS.filter(function (p) { return p.id === id; })[0]; }

  var lista = $('#lista-productos');
  if (!lista) return;

  /* ---------- Carrito (se guarda solo en este navegador) ---------- */
  var cart = {};
  try {
    var raw = JSON.parse(localStorage.getItem('sl-carrito') || '{}');
    Object.keys(raw).forEach(function (k) { if (byId(k) && raw[k] > 0) cart[k] = Math.min(99, raw[k] | 0); });
  } catch (e) { cart = {}; }
  function guardar() { try { localStorage.setItem('sl-carrito', JSON.stringify(cart)); } catch (e) {} }
  function cantidad() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k] * byId(k).precio; }, 0); }

  var dlg = $('#carrito'), fab = $('#btn-carrito'), cant = $('#cart-cant'), vivo = $('#cart-vivo');
  var fin = false;

  function pintarCarrito() {
    var ids = Object.keys(cart);
    cant.textContent = cantidad();
    if (!ids.length) {
      dlg.querySelector('.cart-body').innerHTML = '<p class="cart-vacio">Tu carrito está vacío. Sumá algo de la tienda.</p>';
      return;
    }
    dlg.querySelector('.cart-body').innerHTML =
      '<ul class="cart-lista">' + ids.map(function (id) {
        var p = byId(id), q = cart[id];
        return '<li class="cart-item"><div class="cart-info"><strong>' + esc(p.nombre) + '</strong><span>' + $$$(p.precio) + ' c/u</span></div>' +
          '<div class="cart-qty"><button type="button" data-a="menos" data-id="' + id + '" aria-label="Quitar uno de ' + esc(p.nombre) + '">−</button>' +
          '<span aria-label="Cantidad">' + q + '</span>' +
          '<button type="button" data-a="mas" data-id="' + id + '" aria-label="Sumar uno de ' + esc(p.nombre) + '">+</button></div>' +
          '<button type="button" class="cart-quitar" data-a="quitar" data-id="' + id + '">Quitar</button></li>';
      }).join('') + '</ul>' +
      '<p class="cart-total"><span>Total</span><strong>' + $$$(total()) + '</strong></p>' +
      '<div class="cart-btns"><button type="button" class="btn btn-volt" data-a="fin">Finalizar pedido</button>' +
      '<button type="button" class="btn" data-a="vaciar">Vaciar</button></div>' +
      (fin ? '<p class="cart-demo" role="status"><b>Esto es un prototipo.</b> No se hace ninguna compra real ni se cobra nada. Si te interesó un producto, escribinos por Instagram: <a href="https://www.instagram.com/sportlife_mdz/" target="_blank" rel="noopener noreferrer">@sportlife_mdz</a>.</p>' : '');
  }

  function cambiar(id, d) {
    cart[id] = Math.max(0, Math.min(99, (cart[id] || 0) + d));
    if (!cart[id]) delete cart[id];
    guardar();
    pintarCarrito();
  }

  dlg.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (!b) return;
    var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
    if (a === 'mas') cambiar(id, 1);
    else if (a === 'menos') cambiar(id, -1);
    else if (a === 'quitar') cambiar(id, -(cart[id] || 0));
    else if (a === 'vaciar') { cart = {}; fin = false; guardar(); pintarCarrito(); }
    else if (a === 'fin') { fin = true; pintarCarrito(); }
    else if (a === 'cerrar') dlg.close();
  });
  fab.addEventListener('click', function () {
    fin = false;
    pintarCarrito();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  });

  /* ---------- Catálogo con filtros y orden ---------- */
  var filtro = 'todos', orden = 'destacados';

  function pintar() {
    var ps = PRODUCTOS.filter(function (p) { return filtro === 'todos' || p.cat === filtro; });
    if (orden === 'menor') ps.sort(function (a, b) { return a.precio - b.precio; });
    if (orden === 'mayor') ps.sort(function (a, b) { return b.precio - a.precio; });
    $('#prod-conteo').textContent = ps.length + (ps.length === 1 ? ' producto' : ' productos');
    lista.innerHTML = ps.map(function (p) {
      return '<article class="pr-card">' +
        (p.badge ? '<span class="pr-badge">' + esc(p.badge) + '</span>' : '') +
        '<div class="pr-fig">' + dibujo(p) + '</div>' +
        '<div class="pr-body">' +
        '<p class="pr-cat">' + esc(CATS[p.cat]) + '</p>' +
        '<h3>' + esc(p.nombre) + '</h3>' +
        '<p class="pr-desc">' + esc(p.desc) + '</p>' +
        (p.aviso ? '<p class="pr-nota">Consultá antes de usar</p>' : '') +
        '<details class="pr-det"><summary>Ver detalle</summary><ul>' + p.det.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></details>' +
        '<div class="pr-foot"><span class="pr-precio">' + $$$(p.precio) + '</span>' +
        '<button type="button" class="btn btn-volt" data-add="' + p.id + '">Agregar</button></div>' +
        '</div></article>';
    }).join('');
  }

  lista.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    var p = byId(b.getAttribute('data-add'));
    cambiar(p.id, 1);
    vivo.textContent = p.nombre + ' agregado al carrito. Total de productos: ' + cantidad();
    b.textContent = '¡Agregado!';
    setTimeout(function () { b.textContent = 'Agregar'; }, 1200);
  });

  var chips = Array.prototype.slice.call(document.querySelectorAll('#filtros-tienda .chip'));
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true');
      filtro = c.getAttribute('data-valor');
      pintar();
    });
  });
  $('#orden').addEventListener('change', function (e) { orden = e.target.value; pintar(); });

  pintar();
  pintarCarrito();
})();
