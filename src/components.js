import { apple, firefly, icon } from './art.js';
import { missions } from './engine.js';

export function trail(progress) {
  const current = progress.active?.index ?? (progress.completed.length === 6 ? -1 : 0);
  const labels = ['El picnic', 'Dos amigos más', 'Las luciérnagas', 'Compartimos', 'El arroyo', 'El regalo'];
  return `<ol class="trail" aria-label="El sendero de Numeria">${missions.map((m, i) => {
    const done = progress.completed.includes(m.id);
    const state = current === i ? 'current' : done ? 'done' : 'waiting';
    const marker = `<span class="trail-marker">${done ? icon('check') : i + 1}</span><span class="trail-name">${labels[i]}</span><span class="trail-state">${current === i ? 'Estás aquí' : done ? 'Explorado' : m.skill}</span>`;
    return `<li class="trail-stop ${state}" ${current === i ? 'aria-current="step"' : ''}>${current === i ? `<button data-action="start" class="trail-link" aria-label="Continuar: ${labels[i]}">${marker}</button>` : `<div class="trail-link">${marker}</div>`}</li>`;
  }).join('')}</ol>`;
}

export function manipulatives(m, a) {
  if (m.mode === 'basket') {
    return `<div class="picnic-scene ${a.solved ? 'is-solved' : ''}">
      <div class="picnic-orchard"><span class="scene-caption">DEL MANZANO</span>
        <div class="apple-supply" role="group" aria-label="Manzanas para recoger">${Array.from({ length: m.max }, (_, i) => `<span class="supply-slot">${i < m.max - a.value ? `<button class="supply-apple" data-action="add" data-slot="${i}" aria-label="Recoger manzana ${i + 1}" ${a.solved ? 'disabled' : ''}>${apple()}</button>` : '<span class="picked-mark" aria-hidden="true"></span>'}</span>`).join('')}</div>
        <p class="scene-instruction">Toca una manzana para recogerla.</p>
      </div>
      <div class="picnic-transfer" aria-hidden="true">${icon('arrow')}</div>
      <div class="picnic-cloth"><span class="scene-caption">NUESTRA MERIENDA</span>
        <div class="basket" role="group" aria-label="Cesta de manzanas">${Array.from({ length: m.max }, (_, i) => `<span class="basket-slot">${i < a.value ? `<button class="object" data-action="remove" data-slot="${i}" aria-label="Quitar manzana ${i + 1}" ${a.solved ? 'disabled' : ''}>${apple()}</button>` : `<span class="empty-apple" aria-hidden="true"></span>`}</span>`).join('')}</div>
        <p class="scene-instruction">Toca una manzana para devolverla.</p>
      </div>
    </div>`;
  }
  if (m.mode === 'compare') {
    return `<div class="group-choices">${m.groups.map((n, i) => `<button class="glade ${a.value === n ? 'selected' : ''}" data-value="${n}" aria-label="Claro ${i + 1}: ${n} luciérnagas" aria-pressed="${a.value === n}" ${a.solved ? 'disabled' : ''}><span class="glade-title">CLARO ${i + 1}</span><span class="firefly-group">${firefly().repeat(n)}</span><span class="glade-selection">${a.value === n ? `${icon('check')} Elegido` : 'Elegir este claro'}</span></button>`).join('')}</div>`;
  }
  return `<div class="river-scene"><div class="river-line" aria-hidden="true"></div><div class="sequence" aria-label="Serie: 2, 4, 6, ¿qué sigue?">${m.sequence.map(n => `<span class="stone">${n}</span>`).join('')}<span class="stone stone-missing">${a.value || '?'}</span></div><div class="river-reeds" aria-hidden="true"></div></div><div class="tools">${m.options.map(n => `<button class="number ${a.value === n ? 'selected' : ''}" data-value="${n}" aria-pressed="${a.value === n}" ${a.solved ? 'disabled' : ''}>${n}</button>`).join('')}</div>`;
}

export function visualHint(m) {
  const dots = (n, faded = 0) => `<span class="hint-objects">${Array.from({ length: n }, (_, i) => `<span class="hint-apple ${i >= n - faded ? 'eaten' : ''}">${apple()}</span>`).join('')}</span>`;
  let drawing;
  if (m.id === 'sum') drawing = `${dots(3)}<b>+</b>${dots(2)}`;
  else if (m.id === 'subtract') drawing = dots(7, 3);
  else if (m.id === 'logic') drawing = `<div class="pairs">${[1, 2, 3].map(n => `<div>${dots(2)}<small>Amigo ${n}</small></div>`).join('')}</div>`;
  else if (m.id === 'series') drawing = '<span class="hint-jump">2 <small>+2</small> 4 <small>+2</small> 6 <small>+2</small> ?</span>';
  else if (m.id === 'compare') drawing = `<span class="hint-dots">${'•'.repeat(4)}</span><span class="hint-dots">${'•'.repeat(7)}</span>`;
  else drawing = dots(5);
  return `<aside class="visual-hint" aria-label="Ayuda visual"><div class="hint-heading">${icon('spark')} Miremos juntos</div><div class="hint-drawing" aria-hidden="true">${drawing}</div><p>${m.hint}</p></aside>`;
}
