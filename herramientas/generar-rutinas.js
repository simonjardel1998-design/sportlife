/* Genera un HTML por cada rutina de data.js:  node herramientas/generar-rutinas.js
   Correrlo desde la carpeta del sitio. Si cambiás data.js, volvelo a correr. */
const fs = require('fs');
global.window = {};
require('../data.js');
const R = window.RUTINAS;
const CATS = { calistenia: 'Calistenia', gimnasio: 'Gimnasio', equipo: 'Deportes de equipo', vida: 'Vida saludable' };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mins = r => Math.max(1, Math.round(r.ejercicios.length * (r.trabajo + r.descanso) / 60));

const NAV = (cur) => `<nav class="nav" id="nav" aria-label="Principal">
        <a href="index.html">Inicio</a>
        <a href="rutinas.html" aria-current="page">Rutinas</a>
        <a href="ejercicios.html">Ejercicios</a>
        <a href="consejos.html">Consejos</a>
        <a href="quienes-somos.html">Quiénes somos</a>
      </nav>`;

function pagina(r) {
  const otras = R.filter(x => x.id !== r.id).sort((a, b) => (b.cat === r.cat) - (a.cat === r.cat)).slice(0, 3);
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(r.nombre)} — SportLife</title>
  <meta name="description" content="${esc(r.desc)}">
  <meta name="theme-color" content="#0d0d0d">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body data-rutina="${r.id}">
  <a class="skip" href="#contenido">Saltar al contenido</a>

  <header class="site-header">
    <div class="wrap bar">
      <a class="logo" href="index.html" aria-label="SportLife, inicio">Sport<b>/</b>Life</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menú</button>
      ${NAV()}
    </div>
  </header>

  <main id="contenido">
    <section class="page-head dark">
      <div class="wrap">
        <a class="rp-back" href="rutinas.html">← Todas las rutinas</a>
        <p class="tag">${esc(CATS[r.cat])} · ${esc(r.nivel)}</p>
        <h1>${esc(r.nombre)}</h1>
        <p class="rp-meta">${mins(r)} min · ${r.trabajo} s de trabajo / ${r.descanso} s de pausa · ${r.ejercicios.length} ejercicios</p>
        <div class="btns">
          <button class="btn btn-volt" type="button" data-start>Empezar con timer</button>
          <a class="btn" href="#feedback">Ver opiniones</a>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap rp-grid">
        <div>
          <h2 class="rp-h">De qué se trata</h2>
          <p class="rp-desc">${esc(r.desc)}</p>
          <h2 class="rp-h">Ideal para vos si…</h2>
          <ul class="rp-ideal">
${r.ideal.map(i => `            <li>${esc(i)}</li>`).join('\n')}
          </ul>
          <p class="ex-nota ex-error"><b>Tené en cuenta</b>${esc(r.cuidado)}</p>
        </div>
        <aside class="rp-box" aria-label="Ejercicios de la rutina">
          <h2>Los ejercicios</h2>
          <ol>
${r.ejercicios.map(e => `            <li>${esc(e)}</li>`).join('\n')}
          </ol>
          <p><a class="rp-link" href="ejercicios.html">Mirá cómo se hace cada uno →</a></p>
        </aside>
      </div>
    </section>

    <section class="sec fb" id="feedback">
      <div class="wrap">
        <div class="sec-head">
          <h2>Qué opinan</h2>
          <p>Puntuá la rutina de 1 a 5 mancuernas y dejá un comentario corto.</p>
        </div>
        <div class="fb-grid">
          <div>
            <div class="fb-resumen" id="fb-resumen"><noscript>Activá JavaScript para ver y dejar opiniones.</noscript></div>
            <form class="fb-form" id="fb-form" novalidate>
              <h3>Dejá tu opinión</h3>
              <div class="fb-field">
                <span class="fb-label" id="fb-rlabel">Tu puntaje</span>
                <div class="fb-rating" id="fb-rating" role="radiogroup" aria-labelledby="fb-rlabel"></div>
              </div>
              <div class="fb-field">
                <label class="fb-label" for="fb-nombre">Tu nombre (opcional)</label>
                <input id="fb-nombre" type="text" maxlength="20" autocomplete="given-name" placeholder="Ej: Cande">
              </div>
              <div class="fb-field">
                <label class="fb-label" for="fb-texto">Comentario corto</label>
                <textarea id="fb-texto" maxlength="140" rows="3" placeholder="¿Qué te pareció? ¿Cómo te fue?"></textarea>
                <span class="fb-cont" id="fb-cont">0 / 140</span>
              </div>
              <button class="btn btn-volt" type="submit">Enviar opinión</button>
              <p class="msg" id="fb-msg" role="status"></p>
            </form>
          </div>
          <div>
            <ul class="fb-lista" id="fb-lista"></ul>
            <p class="fb-nota">Los comentarios con nombre son de ejemplo, hechos para el prototipo del proyecto. Los que escribas acá se guardan solo en tu navegador.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" style="padding-top:0">
      <div class="wrap">
        <div class="sec-head"><h2>Otras rutinas</h2></div>
        <div class="rp-otras">
${otras.map(o => `          <a class="rp-otra" href="rutina-${o.id}.html" data-cat="${o.cat}"><span class="rp-otra-cat">${esc(CATS[o.cat])} · ${esc(o.nivel)}</span><strong>${esc(o.nombre)}</strong><span>${mins(o)} min →</span></a>`).join('\n')}
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="foot">
        <a class="logo" href="index.html">Sport<b>/</b>Life</a>
        <nav aria-label="Pie de página">
          <a href="rutinas.html">Rutinas</a>
          <a href="ejercicios.html">Ejercicios</a>
          <a href="consejos.html">Consejos</a>
          <a href="quienes-somos.html">Quiénes somos</a>
        </nav>
      </div>
      <p class="legal">SportLife es un proyecto comunicacional (TACO, Etapa 1) hecho por estudiantes. El contenido es informativo. Si tenés una lesión o una condición médica, consultá con un profesional antes de entrenar.</p>
    </div>
  </footer>

  <script src="data.js"></script>
  <script src="main.js"></script>
</body>
</html>
`;
}

R.forEach(r => fs.writeFileSync(`rutina-${r.id}.html`, pagina(r)));
console.log('generadas', R.length, 'páginas');
