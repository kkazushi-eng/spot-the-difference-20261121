// Spot the Difference — game bootstrap, state, input and rendering.
// Two canvases show the same scene; each difference draws its own
// left and right version, so the pictures are near-identical by
// construction. Clicking a difference rings it on both panels.

import { SCENES } from './scenes.js';
import { W, H } from './draw.js';
import * as audio from './audio.js';
import * as ui from './ui.js';
import { applyShot } from './shots.js';

const leftCanvas = document.getElementById('canvas-left');
const rightCanvas = document.getElementById('canvas-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const state = {
  levelIndex: 0,
  scene: SCENES[0],
  found: new Set(),
  foundAt: new Map(),
  misses: 0,
  hintsLeft: 3,
  hintsUsed: 0,
  hintedId: null,
  hintUntil: 0,
  wrongMarks: [],
  elapsedBase: 0,
  startedAt: performance.now(),
  elapsedSeconds: 0,
  complete: false,
  completedLevels: new Set(),
};

function nowSeconds() {
  return performance.now() / 1000;
}

function tickElapsed() {
  if (state.complete) return state.elapsedSeconds;
  return state.elapsedBase + (nowSeconds() - state.startedAt);
}

function refreshHud() {
  state.elapsedSeconds = tickElapsed();
  ui.updateHud(state);
}

/* ---------------- level management ---------------- */

export function loadLevel(index) {
  state.levelIndex = index;
  state.scene = SCENES[index];
  state.found = new Set();
  state.foundAt = new Map();
  state.misses = 0;
  state.hintsLeft = 3;
  state.hintsUsed = 0;
  state.hintedId = null;
  state.hintUntil = 0;
  state.wrongMarks = [];
  state.elapsedBase = 0;
  state.startedAt = nowSeconds();
  state.elapsedSeconds = 0;
  state.complete = false;
  ui.hideWinOverlay();
  ui.setStatus(`Find all ${state.scene.diffs.length} differences in ${state.scene.name}. Click one on either picture.`);
  refreshHud();
}

export function restartLevel() {
  audio.playClick();
  loadLevel(state.levelIndex);
}

/* ---------------- finding differences ---------------- */

function scenePoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * W,
    y: ((event.clientY - rect.top) / rect.height) * H,
  };
}

function nearestUnfound(point) {
  let best = null;
  let bestDist = Infinity;
  for (const diff of state.scene.diffs) {
    if (state.found.has(diff.id)) continue;
    const d = Math.hypot(point.x - diff.x, point.y - diff.y);
    const reach = Math.max(diff.r, 26);
    if (d <= reach && d < bestDist) {
      best = diff;
      bestDist = d;
    }
  }
  return best;
}

export function findDiff(diff, silent = false) {
  if (state.found.has(diff.id)) return false;
  state.found.add(diff.id);
  state.foundAt.set(diff.id, nowSeconds());
  if (!silent) {
    audio.playFound();
    ui.showToast(`Found it — ${diff.label}!`);
    ui.setStatus(`Found ${diff.label} — ${state.scene.diffs.length - state.found.size} to go.`);
  }
  refreshHud();
  if (state.found.size === state.scene.diffs.length) completeLevel();
  return true;
}

function handleCanvasClick(event, canvas) {
  if (state.complete) return;
  const point = scenePoint(event, canvas);
  const diff = nearestUnfound(point);
  if (diff) {
    findDiff(diff);
  } else {
    state.misses += 1;
    state.wrongMarks.push({ x: point.x, y: point.y, at: nowSeconds() });
    audio.playWrong();
    ui.setStatus('Not quite — that spot is the same in both pictures. Look closer!');
    refreshHud();
  }
}

function completeLevel() {
  state.complete = true;
  state.elapsedSeconds = tickElapsed();
  state.elapsedBase = state.elapsedSeconds;
  state.completedLevels.add(state.levelIndex);
  audio.playWin();
  ui.setStatus(`All ${state.scene.diffs.length} differences found in ${ui.formatTime(state.elapsedSeconds)}!`);
  refreshHud();
  setTimeout(() => ui.showWinOverlay(state), 650);
}

/* ---------------- hint ---------------- */

export function useHint() {
  if (state.complete || state.hintsLeft <= 0) return;
  const remaining = state.scene.diffs.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.hintsUsed += 1;
  state.hintedId = pick.id;
  state.hintUntil = nowSeconds() + 2.5;
  audio.playHint();
  ui.setStatus(`Hint: look near the ${pick.label.split(' ').slice(-2).join(' ')}… the gold ring shows the area.`);
  refreshHud();
}

/* ---------------- rendering ---------------- */

function drawRing(ctx, x, y, r, color, width, dash = null) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCheck(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.4);
  ctx.lineTo(x + r * 0.55, y - r * 0.45);
  ctx.stroke();
  ctx.restore();
}

function drawPanel(ctx, side, t) {
  ctx.clearRect(0, 0, W, H);
  state.scene.drawBase(ctx, t);
  for (const diff of state.scene.diffs) {
    if (side === 'left') diff.drawLeft(ctx, t);
    else diff.drawRight(ctx, t);
  }
  // Found rings on both panels.
  for (const diff of state.scene.diffs) {
    if (!state.found.has(diff.id)) continue;
    const age = t - state.foundAt.get(diff.id);
    const pop = age < 0.25 ? 0.6 + (age / 0.25) * 0.4 : 1;
    const r = (diff.r + 5) * pop;
    ctx.fillStyle = 'rgba(47, 168, 102, 0.10)';
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.fill();
    drawRing(ctx, diff.x, diff.y, r, '#2fa866', 4);
    drawCheck(ctx, diff.x, diff.y, r, '#2fa866');
  }
  // Hint ring (gold, pulsing) on both panels.
  if (state.hintedId && t < state.hintUntil) {
    const diff = state.scene.diffs.find((d) => d.id === state.hintedId);
    if (diff) {
      const pulse = diff.r + 8 + Math.sin(t * 8) * 3;
      drawRing(ctx, diff.x, diff.y, pulse, '#e9a13b', 3.5, [7, 5]);
    }
  } else if (state.hintedId && t >= state.hintUntil) {
    state.hintedId = null;
    ui.buildDots(state);
  }
  // Wrong-click crosses, fading out.
  state.wrongMarks = state.wrongMarks.filter((m) => t - m.at < 0.9);
  for (const m of state.wrongMarks) {
    const alpha = 1 - (t - m.at) / 0.9;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#d64541';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(m.x - 9, m.y - 9);
    ctx.lineTo(m.x + 9, m.y + 9);
    ctx.moveTo(m.x + 9, m.y - 9);
    ctx.lineTo(m.x - 9, m.y + 9);
    ctx.stroke();
    ctx.restore();
  }
}

function frame() {
  const t = nowSeconds();
  state.elapsedSeconds = tickElapsed();
  drawPanel(leftCtx, 'left', t);
  drawPanel(rightCtx, 'right', t);
  // Update the timer readout once a second.
  if (Math.floor(state.elapsedSeconds) !== Math.floor(frame.lastShown ?? -1)) {
    frame.lastShown = Math.floor(state.elapsedSeconds);
    document.getElementById('timer').textContent = ui.formatTime(state.elapsedSeconds);
  }
  requestAnimationFrame(frame);
}

/* ---------------- wiring ---------------- */

leftCanvas.addEventListener('click', (e) => handleCanvasClick(e, leftCanvas));
rightCanvas.addEventListener('click', (e) => handleCanvasClick(e, rightCanvas));

document.getElementById('btn-hint').addEventListener('click', useHint);
document.getElementById('btn-restart').addEventListener('click', restartLevel);
document.getElementById('btn-sound').addEventListener('click', () => {
  audio.setMuted(!audio.isMuted());
  ui.setSoundButton(audio.isMuted());
});
document.getElementById('btn-next').addEventListener('click', () => {
  audio.playClick();
  ui.hideWinOverlay();
  loadLevel((state.levelIndex + 1) % SCENES.length);
});
document.getElementById('btn-replay').addEventListener('click', () => {
  audio.playClick();
  ui.hideWinOverlay();
  loadLevel(state.levelIndex);
});
document.querySelectorAll('.level-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    audio.playClick();
    loadLevel(Number(tab.dataset.level));
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') useHint();
  else if (e.key === 'r' || e.key === 'R') restartLevel();
  else if (e.key === 'm' || e.key === 'M') {
    audio.setMuted(!audio.isMuted());
    ui.setSoundButton(audio.isMuted());
  } else if (e.key === 'n' || e.key === 'N') {
    if (state.complete) {
      ui.hideWinOverlay();
      loadLevel((state.levelIndex + 1) % SCENES.length);
    }
  } else if (e.key === '1' || e.key === '2' || e.key === '3') {
    loadLevel(Number(e.key) - 1);
  }
});

/* ---------------- public handle for tests and staged shots ---------------- */

window.__game = {
  state,
  loadLevel,
  restartLevel,
  useHint,
  findDiffById(id) {
    const diff = state.scene.diffs.find((d) => d.id === id);
    return diff ? findDiff(diff, true) : false;
  },
  setElapsed(seconds) {
    state.elapsedBase = seconds;
    state.startedAt = nowSeconds();
    state.elapsedSeconds = seconds;
    refreshHud();
  },
  setMisses(n) {
    state.misses = n;
    refreshHud();
  },
  finishLevel() {
    if (state.found.size !== state.scene.diffs.length) {
      for (const diff of state.scene.diffs) findDiff(diff, true);
    }
    state.elapsedSeconds = tickElapsed();
    state.elapsedBase = state.elapsedSeconds;
    state.complete = true;
    state.completedLevels.add(state.levelIndex);
    refreshHud();
    ui.showWinOverlay(state);
  },
};

/* ---------------- start ---------------- */

loadLevel(0);
const params = new URLSearchParams(window.location.search);
if (params.get('shot')) applyShot(params.get('shot'), window.__game);
requestAnimationFrame(frame);
