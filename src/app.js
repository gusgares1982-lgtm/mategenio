import { icon } from './art.js';
import { trail, manipulatives, visualHint } from './components.js';
import { missions, emptyProgress, complete, recommendation } from './engine.js';
import { load, save } from './storage.js';

let storage;
try { storage = window.localStorage; } catch { /* Private browser modes may deny access. */ }
const loaded = load(storage);
let p = loaded.progress;
let currentView = 'home';
let feedback = '';
let gateAnswer = 0;
let audio;
const main = document.querySelector('main');
const dialog = document.querySelector('dialog');
const warning = document.querySelector('#storage-warning');

function warn(text) {
  warning.textContent = text;
  warning.hidden = !text;
}
warn(loaded.warning);

function persist() {
  if (!save(storage, p)) warn('No se ha podido guardar. Puedes seguir jugando; conserva esta pestaña abierta.');
}

function applySettings() {
  document.body.classList.toggle('large-text', p.largeText);
  const button = document.querySelector('#sound');
  button.setAttribute('aria-pressed', String(p.sound));
  button.setAttribute('aria-label', p.sound ? 'Desactivar sonidos' : 'Activar sonidos');
  button.innerHTML = icon(p.sound ? 'sound' : 'muted');
}

function chime() {
  if (!p.sound) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume();
    for (const [i, frequency] of [523, 659, 784].entries()) {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const time = audio.currentTime + i * .1;
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(.08, time + .02);
      gain.gain.exponentialRampToValueAtTime(.001, time + .3);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(time);
      oscillator.stop(time + .32);
    }
  } catch { /* Audio is optional; the visual feedback always remains. */ }
}

function navigate(view) {
  currentView = view;
  feedback = '';
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  render();
  main.focus();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function render() {
  applySettings();
  document.querySelectorAll('.nav-link').forEach(button => {
    const active = button.dataset.action === currentView ||
      (button.dataset.action === 'home' && ['game', 'finish'].includes(currentView));
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  const views = { home, game, finish, collection, parent };
  views[currentView]();
}

function home() {
  const returning = !!p.active;
  const done = p.completed.length;
  main.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">NIKO Y EL BOSQUE DE NUMERIA</div>
        <h1>${returning ? 'Nos queda mucho<br><em>por descubrir.</em>' : 'El bosque<br><em>te espera.</em>'}</h1>
        <p class="intro">${returning ? 'Tu merienda sigue aquí. Continuamos justo donde lo dejaste.' : 'Una cesta, unas manzanas y tres amigos.<br>¿Nos ayudas a preparar la merienda?'}</p>
        <button class="button hero-cta" data-action="start">${returning ? 'Continuar mi aventura' : done === 6 ? 'Volver a explorar' : '¡Vamos a explorar!'} ${icon('arrow')}</button>
        <p class="hero-footnote">${returning ? `Descubrimiento ${p.active.index + 1} de 6 · Guardado en este dispositivo` : 'Para explorar sin prisas, juntos o a tu aire.'}</p>
        <div class="niko-introduction"><img src="assets/niko.svg" width="46" height="46" alt=""><p><strong>Soy Niko.</strong> Yo te acompaño.</p></div>
      </div>
      <div class="hero-art">
        <img src="assets/forest.svg" alt="El sendero de Numeria serpentea entre pinos hasta el lugar de la merienda, donde espera Niko.">
        <div class="chapter-plaque"><span>PRIMERA AVENTURA</span><strong>Una merienda en el bosque</strong><span>Contar · Compartir · Descubrir</span></div>
      </div>
    </section>
    <section class="trail-panel" aria-labelledby="world-title">
      <div class="section-heading"><div><div class="eyebrow">EL SENDERO DE NUMERIA</div><h2 id="world-title">Un paso lleva al siguiente.</h2></div><span class="trail-total">${done} de 6 explorados</span></div>
      ${trail(p)}
    </section>
    <aside class="home-note">${icon('leaf')}<p>Aquí no se pierden vidas. Se encuentran maneras de aprender.</p></aside>`;
}
function start(){if(!p.active)p.active={index:0,value:0,attempts:0,hint:false,solved:false};persist();navigate('game');}
function game() {
  if (!p.active) { navigate('home'); return; }
  const a = p.active;
  const m = missions[a.index];
  main.innerHTML = `
    <div class="game-top">
      <button class="text-button pause-button" data-action="home">${icon('back')} Pausar</button>
      <div class="track" role="progressbar" aria-label="Progreso de la aventura" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${a.index}"><span></span></div>
      <span class="mission-count">${a.index + 1} <span>/ 6</span></span>
    </div>
    <div class="play-layout">
      <aside class="guide">
        <img src="assets/niko.svg" alt="Niko, tu compañero de aventuras">
        <div><h3>Estoy contigo.</h3><p id="guide-message"></p><button class="text-button read-button" data-action="read">${icon('sound')} Escuchar el reto</button></div>
      </aside>
      <section class="activity" aria-labelledby="mission-title">
        <div class="eyebrow">${m.skill.toUpperCase()} · EL BOSQUE DE NUMERIA</div>
        <h1 id="mission-title">${m.title}</h1>
        <p class="story">${m.story}</p>
        <div id="manipulatives"></div>
        <div class="object-toolbar" ${m.mode !== 'basket' ? 'hidden' : ''}>
          <button class="step-control" data-action="remove" aria-label="Quitar una manzana">${icon('minus')}</button>
          <p class="count-label" aria-live="polite" aria-atomic="true"></p>
          <button class="step-control" data-action="add" aria-label="Añadir manzana">${icon('plus')}</button>
        </div>
        <div id="hint-area"></div>
        <div id="feedback" class="feedback" role="status" aria-live="polite" aria-atomic="true"></div>
        <div class="activity-footer"></div>
      </section>
    </div>`;
  updateStage();
}

// Preserve the activity frame, live region and adjustment controls while objects change.
// This avoids replacing the focused control on every touch or keyboard press.
function updateStage() {
  const a = p.active;
  const m = missions[a.index];
  main.querySelector('#manipulatives').innerHTML = manipulatives(m, a);
  main.querySelector('#hint-area').innerHTML = a.hint && !a.solved ? visualHint(m) : '';
  main.querySelector('.count-label').innerHTML = `<strong>${a.value}</strong> ${a.value === 1 ? 'manzana' : 'manzanas'} en la cesta`;
  main.querySelector('.object-toolbar [data-action="add"]').disabled = a.solved || a.value === m.max;
  main.querySelector('.object-toolbar [data-action="remove"]').disabled = a.solved || a.value === 0;
  const status = main.querySelector('#feedback');
  status.classList.toggle('success', a.solved);
  status.textContent = a.solved ? 'Lo has descubierto. ¡La merienda va tomando forma!' : feedback;
  main.querySelector('.activity').classList.toggle('is-solved', a.solved);
  main.querySelector('#guide-message').textContent = a.solved ? 'Mira todo lo que has conseguido. ¿Seguimos?' : 'Toca, cuenta y prueba. Si lo necesitas, lo miramos juntos.';
  const completed = a.index + (a.solved ? 1 : 0);
  main.querySelector('.track').setAttribute('aria-valuenow', completed);
  main.querySelector('.track span').style.width = `${completed / missions.length * 100}%`;
  main.querySelector('.activity-footer').innerHTML = a.solved
    ? `<span class="success-seal">${icon('check')} Descubierto</span><button class="button" data-action="next">${a.index === 5 ? 'Ver mi tesoro' : 'Seguir el sendero'} ${icon('arrow')}</button>`
    : `<button class="text-button hint-button" data-action="hint" aria-expanded="${a.hint}">${icon('spark')} Una pista</button><button class="button" data-action="check">Comprobar ${icon('arrow')}</button>`;
}

function check() {
  const a = p.active;
  if (!a || a.solved) return;
  const m = missions[a.index];
  a.attempts++;
  if (a.value === m.goal) {
    a.solved = true;
    p = complete(p, a.index, a.attempts, a.hint);
    chime();
  } else {
    feedback = a.attempts > 1 ? m.hint : 'Todavía no. Mira los objetos y prueba otra vez. ¡Puedes hacerlo!';
    if (a.attempts > 1) a.hint = true;
  }
  persist();
  updateStage();
  main.querySelector(`[data-action="${p.active.solved ? 'next' : 'check'}"]`)?.focus();
}

function next() {
  if (!p.active?.solved) return;
  const index = p.active.index + 1;
  if (index === missions.length) {
    p.active = null;
    persist();
    navigate('finish');
  } else {
    p.active = { index, value: missions[index].initial || 0, attempts: 0, hint: false, solved: false };
    feedback = '';
    persist();
    game();
    main.focus();
  }
}

function finish(){main.innerHTML=`<section class="center-panel"><div class="reward" aria-hidden="true">${icon('leaf')}</div><div class="eyebrow">UN TESORO QUE TE HAS GANADO</div><h1>El bosque crece<br><em>contigo.</em></h1><p>Has ayudado a Niko a compartir la merienda y encontrar el camino.<br>La hoja exploradora ya forma parte de tus tesoros.</p><p class="intro" style="margin:20px auto">Lo importante no es hacerlo a la primera.<br>Es descubrir que puedes aprender.</p><div class="tools"><button class="button" data-action="collection">Ver mis tesoros ✧</button><button class="button ghost" data-action="home">Volver al mapa</button></div></section>`;}
function collection(){main.innerHTML=`<section class="center-panel"><div class="eyebrow">PEQUEÑOS RECUERDOS, GRANDES LOGROS</div><h1>Tu mochila de tesoros.</h1><p>Cada tesoro cuenta algo que has descubierto. No hay prisa por conseguirlos.</p><div class="badge-grid"><div class="badge"><span aria-hidden="true">${icon('leaf')}</span><h3>Hoja exploradora</h3><p>${p.completed.length===6?'Tuya por explorar el bosque.':'Completa la aventura del bosque para encontrarla.'}</p></div><div class="badge"><span aria-hidden="true">${icon('spark')}</span><h3>Descubrimientos</h3><p>${p.completed.length} de 6 caminos explorados.</p></div><div class="badge"><span aria-hidden="true">${icon('heart')}</span><h3>La curiosidad</h3><p>La llevas contigo desde el primer día.</p></div></div>${p.legacyStars?`<p>Tus ${p.legacyStars} estrellas de la aventura anterior siguen guardadas.</p>`:''}<button class="button" data-action="home" style="margin-top:28px">Volver al mapa →</button></section>`;}
function gate(){const x=12+Math.floor(Math.random()*9),y=11+Math.floor(Math.random()*8);gateAnswer=x+y;dialog.innerHTML=`<h2 id="dialog-title">Un momento para la familia</h2><p>Para acceder, resuelve esta suma. Esta barrera separa las zonas; no es una contraseña.</p><form id="gate-form"><label for="gate-value">¿Cuánto es ${x} + ${y}?</label><input id="gate-value" type="number" inputmode="numeric" required autocomplete="off"><p id="gate-error" role="status"></p><div class="tools"><button class="button" type="submit">Entrar</button><button class="button ghost" type="button" data-action="close">Volver</button></div></form>`;dialog.showModal();}
function parent(){main.innerHTML=`<section class="parent-panel"><div class="eyebrow">ESPACIO PARA FAMILIAS</div><h1>Más confianza.<br><em>Un descubrimiento cada vez.</em></h1><p>Este dispositivo · Sin cuentas ni datos personales</p><div class="stats"><div class="stat"><strong>${p.completed.length}/6</strong><span>Competencias exploradas</span></div><div class="stat"><strong>${Object.values(p.results).filter(r=>r.hint).length}</strong><span>Retos con ayuda</span></div><div class="stat"><strong>${p.completed.length===6?'1':'0'}</strong><span>Tesoros encontrados</span></div></div><h3>Así va su exploración</h3><p>Una aventura es una observación, no una evaluación de dominio. No medimos la rapidez.</p>${missions.map(m=>{const r=p.results[m.id];return `<div class="skill-row"><strong>${m.skill}</strong><span>${r?(r.hint||r.attempts>1?'Explorado con apoyo · Seguir practicando':'Resuelto sin pista en el primer intento'):'Por explorar'}</span></div>`}).join('')}<aside class="journey-note"><span class="note-icon">❧</span><div><h3>Una idea para seguir fuera de la pantalla</h3><p>${recommendation(p)}</p></div></aside><div class="settings"><label><input type="checkbox" id="large-text" ${p.largeText?'checked':''}> Texto del juego más grande</label><label><input type="checkbox" id="sound-setting" ${p.sound?'checked':''}> Sonidos suaves</label></div><h3>Privacidad y control</h3><p>El progreso se guarda solo en este navegador. No enviamos datos, no hay anuncios ni pagos. El uso compartido del dispositivo comparte también este progreso.</p><div class="tools"><button class="button ghost" data-action="export">Descargar progreso</button><button class="button ghost danger" data-action="reset">Borrar progreso</button><a class="button ghost" href="practica.html">Práctica clásica</a></div><p class="micro">La práctica clásica conserva sus propias estrellas. No tiene la nueva interfaz ni el guardado de esta aventura.</p><button class="text-button" data-action="home">← Volver a la aventura</button></section>`;}
function adjustObjects(action) {
  const a = p.active;
  if (!a || a.solved || missions[a.index].mode !== 'basket') return;
  a.value = Math.max(0, Math.min(missions[a.index].max, a.value + (action === 'add' ? 1 : -1)));
  feedback = '';
  persist();
  updateStage();
  const target = main.querySelector(`.object-toolbar [data-action="${action}"]:not(:disabled)`) ||
    main.querySelector('.object-toolbar button:not(:disabled)');
  target?.focus({ preventScroll: true });
  if (action === 'add') main.querySelector(`.basket-slot:nth-child(${a.value}) .object`)?.classList.add('just-picked');
}

function showHint() {
  if (!p.active || p.active.solved) return;
  p.active.hint = true;
  feedback = '';
  persist();
  updateStage();
  main.querySelector('[data-action="hint"]')?.focus();
}

function readMission() {
  if (!p.active) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(missions[p.active.index].story);
    speech.lang = 'es-ES';
    speech.rate = .85;
    window.speechSynthesis.speak(speech);
  } else {
    feedback = 'La lectura en voz alta no está disponible en este navegador. Puedes usar la pista visual.';
    updateStage();
  }
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mategenio-progreso.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function confirmReset() {
  dialog.innerHTML = `<h2 id="dialog-title">¿Borrar este progreso?</h2>
    <p>Se borrarán los descubrimientos y ajustes de esta aventura en este dispositivo. La práctica clásica se conserva.</p>
    <div class="tools"><button class="button ghost" data-action="close">Conservar</button><button class="button" data-action="confirm-reset">Sí, borrar</button></div>`;
  dialog.showModal();
}

main.addEventListener('change', event => {
  if (event.target.id === 'large-text') p.largeText = event.target.checked;
  else if (event.target.id === 'sound-setting') p.sound = event.target.checked;
  else return;
  persist();
  applySettings();
  if (event.target.id === 'sound-setting') chime();
});

document.addEventListener('click', event => {
  const button = event.target.closest('button[data-action],button[data-value]');
  if (!button || button.disabled) return;
  if (button.dataset.value && p.active && !p.active.solved) {
    p.active.value = Number(button.dataset.value);
    feedback = '';
    persist();
    updateStage();
    main.querySelector(`[data-value="${button.dataset.value}"]`)?.focus();
    return;
  }
  const action = button.dataset.action;
  switch (action) {
    case 'home': case 'collection': navigate(action); break;
    case 'start': start(); break;
    case 'gate': gate(); break;
    case 'close': dialog.close(); break;
    case 'sound': p.sound = !p.sound; persist(); applySettings(); chime(); break;
    case 'add': case 'remove': adjustObjects(action); break;
    case 'check': check(); break;
    case 'next': next(); break;
    case 'hint': showHint(); break;
    case 'read': readMission(); break;
    case 'export': exportProgress(); break;
    case 'reset': confirmReset(); break;
    case 'confirm-reset':
      p = emptyProgress();
      persist();
      dialog.close();
      parent();
      applySettings();
      break;
  }
});

dialog.addEventListener('submit', event => {
  event.preventDefault();
  if (Number(document.querySelector('#gate-value').value) === gateAnswer) {
    dialog.close();
    navigate('parent');
  } else document.querySelector('#gate-error').textContent = 'Revisa la suma y vuelve a intentarlo.';
});
document.querySelector('.brand').addEventListener('click', event => {
  event.preventDefault();
  navigate('home');
});
document.querySelector('.family-button span').innerHTML = icon('family');
render();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() =>
    warn('El modo sin conexión no está disponible ahora. Puedes continuar mientras tengas conexión.'));
}
