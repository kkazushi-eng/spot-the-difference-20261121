// DOM user interface for Spot the Difference: the HUD counters, the
// progress dots, the win overlay and the toast line. The canvases
// themselves are drawn by main.js; this module owns the page chrome.

const $ = (id) => document.getElementById(id);

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${String(m).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

export function updateHud(state) {
  $('level-name').textContent = state.scene.name;
  $('found-count').textContent = String(state.found.size);
  $('total-count').textContent = String(state.scene.diffs.length);
  $('remain-count').textContent = `${state.scene.diffs.length - state.found.size} to go`;
  $('timer').textContent = formatTime(state.elapsedSeconds);
  $('miss-count').textContent = String(state.misses);
  $('hint-count').textContent = `(${state.hintsLeft})`;
  $('btn-hint').disabled = state.hintsLeft <= 0 || state.complete;
  document.querySelectorAll('.level-tab').forEach((tab) => {
    const idx = Number(tab.dataset.level);
    tab.classList.toggle('active', idx === state.levelIndex);
    tab.classList.toggle('done', state.completedLevels.has(idx));
  });
  buildDots(state);
}

export function buildDots(state) {
  const holder = $('progress-dots');
  holder.innerHTML = '';
  state.scene.diffs.forEach((diff) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (state.found.has(diff.id)) dot.classList.add('found');
    else if (state.hintedId === diff.id) dot.classList.add('hinted');
    dot.title = state.found.has(diff.id) ? diff.label : 'Not found yet';
    holder.appendChild(dot);
  });
}

export function setStatus(message) {
  $('status-message').textContent = message;
}

let toastTimer = null;
export function showToast(message, ms = 2200) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), ms);
}

export function showWinOverlay(state) {
  const stars = starCount(state);
  $('overlay-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  $('overlay-title').textContent = state.levelIndex >= 2
    ? 'You finished every scene!'
    : 'Scene complete!';
  $('overlay-text').textContent = state.levelIndex >= 2
    ? `You spotted every difference in ${state.scene.name}. A true eagle eye!`
    : `You found all ${state.scene.diffs.length} differences in ${state.scene.name}.`;
  $('overlay-stats').innerHTML =
    `Time <b>${formatTime(state.elapsedSeconds)}</b> &nbsp;·&nbsp; ` +
    `Misses <b>${state.misses}</b> &nbsp;·&nbsp; ` +
    `Hints used <b>${state.hintsUsed}</b> &nbsp;·&nbsp; ` +
    `Par <b>${formatTime(state.scene.parSeconds)}</b>`;
  $('btn-next').textContent = state.levelIndex >= 2 ? 'Play again ↺' : 'Next scene →';
  $('overlay').classList.remove('hidden');
}

export function hideWinOverlay() {
  $('overlay').classList.add('hidden');
}

export function starCount(state) {
  const overPar = state.elapsedSeconds > state.scene.parSeconds;
  if (state.misses === 0 && !overPar) return 3;
  if (state.misses <= 2 && state.elapsedSeconds <= state.scene.parSeconds * 1.5) return 2;
  return 1;
}

export function setSoundButton(muted) {
  $('btn-sound').innerHTML = muted ? '🔇 Muted' : '🔊 Sound';
}
