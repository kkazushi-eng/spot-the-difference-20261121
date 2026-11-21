// Tiny synthesized sounds for Spot the Difference, built with the
// Web Audio API — no audio files, no network. All sounds are short
// oscillator envelopes, created lazily on the first user gesture.

let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, duration, type = 'sine', volume = 0.16) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

// A happy two-note chime when a difference is found.
export function playFound() {
  tone(660, 0, 0.18, 'sine', 0.18);
  tone(880, 0.09, 0.28, 'sine', 0.18);
  tone(1320, 0.16, 0.22, 'triangle', 0.08);
}

// A soft low buzz for a wrong click.
export function playWrong() {
  tone(160, 0, 0.16, 'square', 0.07);
  tone(120, 0.08, 0.2, 'square', 0.06);
}

// A bright sparkle for the hint button.
export function playHint() {
  tone(1046, 0, 0.12, 'sine', 0.12);
  tone(1568, 0.07, 0.18, 'sine', 0.1);
}

// A little fanfare when a scene is completed.
export function playWin() {
  const notes = [523, 659, 784, 1046, 784, 1046];
  notes.forEach((freq, i) => tone(freq, i * 0.11, 0.24, 'triangle', 0.16));
}

// A single click for buttons and tabs.
export function playClick() {
  tone(440, 0, 0.07, 'sine', 0.08);
}
