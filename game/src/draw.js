// Shared canvas drawing helpers for the spot-the-difference scenes.
// Every helper draws in scene space (560 x 420) and keeps a soft,
// hand-drawn storybook look: warm outlines, gentle curves, flat fills.

export const W = 560;
export const H = 420;

export function ellipse(ctx, x, y, rx, ry, fill, stroke) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

export function circle(ctx, x, y, r, fill, stroke) {
  ellipse(ctx, x, y, r, r, fill, stroke);
}

export function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

export function poly(ctx, points, fill, stroke, close = true) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  if (close) ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke(); }
}

export function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function curve(ctx, points, color, width = 2) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i][0] + points[i + 1][0]) / 2;
    const my = (points[i][1] + points[i + 1][1]) / 2;
    ctx.quadraticCurveTo(points[i][0], points[i][1], mx, my);
  }
  ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// A soft four-petalled flower with a golden centre.
export function drawFlower(ctx, x, y, petal, centre, size = 9) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ellipse(ctx, x + Math.cos(a) * size * 0.62, y + Math.sin(a) * size * 0.62, size * 0.55, size * 0.55, petal);
  }
  circle(ctx, x, y, size * 0.42, centre, '#8a6d1f');
}

// A puffy storybook cloud made of three circles.
export function drawCloud(ctx, x, y, s = 1, tint = '#ffffff') {
  ctx.fillStyle = tint;
  ctx.beginPath();
  ctx.arc(x, y, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 24 * s, 0, Math.PI * 2);
  ctx.arc(x + 44 * s, y, 19 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y + 8 * s, 22 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(120, 130, 150, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// A five-point star, used for night skies and sparkles.
export function drawStar(ctx, x, y, r, fill, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

// A small bird in flight: two curved wings.
export function drawBird(ctx, x, y, s = 1, color = '#4a3f30') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 11 * s, y);
  ctx.stroke();
}

// A butterfly with gently flapping wings (flap in -1..1).
export function drawButterfly(ctx, x, y, s = 1, wing = '#e2725b', flap = 0) {
  const spread = 1 - Math.abs(flap) * 0.45;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = wing;
  ellipse(ctx, -7 * s * spread, -4 * s, 8 * s, 6 * s, wing);
  ellipse(ctx, 7 * s * spread, -4 * s, 8 * s, 6 * s, wing);
  ellipse(ctx, -6 * s * spread, 5 * s, 6 * s, 5 * s, wing);
  ellipse(ctx, 6 * s * spread, 5 * s, 6 * s, 5 * s, wing);
  ctx.fillStyle = '#3a2e22';
  ellipse(ctx, 0, 0, 2.2 * s, 6 * s, '#3a2e22');
  ctx.restore();
}

// A sitting cat, facing left, tail drawn by the caller so scenes can vary it.
export function drawCatBody(ctx, x, y, s = 1, coat = '#f2a541') {
  // body
  ellipse(ctx, x, y, 26 * s, 20 * s, coat, '#b97f22');
  // head
  circle(ctx, x - 22 * s, y - 20 * s, 15 * s, coat, '#b97f22');
  // ears
  poly(ctx, [[x - 34 * s, y - 30 * s], [x - 30 * s, y - 42 * s], [x - 24 * s, y - 31 * s]], coat, '#b97f22');
  poly(ctx, [[x - 18 * s, y - 33 * s], [x - 13 * s, y - 43 * s], [x - 9 * s, y - 30 * s]], coat, '#b97f22');
  // stripes
  line(ctx, x - 8 * s, y - 14 * s, x - 2 * s, y - 14 * s, '#b97f22', 2);
  line(ctx, x - 8 * s, y - 8 * s, x - 2 * s, y - 8 * s, '#b97f22', 2);
  line(ctx, x + 8 * s, y - 12 * s, x + 14 * s, y - 12 * s, '#b97f22', 2);
  // face
  circle(ctx, x - 27 * s, y - 22 * s, 1.8 * s, '#3a2e22');
  circle(ctx, x - 17 * s, y - 22 * s, 1.8 * s, '#3a2e22');
  poly(ctx, [[x - 24 * s, y - 16 * s], [x - 20 * s, y - 16 * s], [x - 22 * s, y - 13 * s]], '#d64541');
  curve(ctx, [[x - 22 * s, y - 13 * s], [x - 26 * s, y - 10 * s], [x - 28 * s, y - 12 * s]], '#3a2e22', 1.4);
  curve(ctx, [[x - 22 * s, y - 13 * s], [x - 18 * s, y - 10 * s], [x - 16 * s, y - 12 * s]], '#3a2e22', 1.4);
  // whiskers
  line(ctx, x - 34 * s, y - 18 * s, x - 44 * s, y - 20 * s, 'rgba(58,46,34,0.6)', 1);
  line(ctx, x - 34 * s, y - 15 * s, x - 44 * s, y - 13 * s, 'rgba(58,46,34,0.6)', 1);
  // front paws
  ellipse(ctx, x - 14 * s, y + 16 * s, 6 * s, 4 * s, coat);
  ellipse(ctx, x - 2 * s, y + 16 * s, 6 * s, 4 * s, coat);
}

export function drawCatTailUp(ctx, x, y, s = 1) {
  curve(ctx, [[x + 24 * s, y + 8 * s], [x + 36 * s, y - 2 * s], [x + 34 * s, y - 22 * s], [x + 26 * s, y - 30 * s]], '#b97f22', 5 * s);
}

export function drawCatTailDown(ctx, x, y, s = 1) {
  curve(ctx, [[x + 24 * s, y + 10 * s], [x + 36 * s, y + 14 * s], [x + 40 * s, y + 6 * s], [x + 34 * s, y + 2 * s]], '#b97f22', 5 * s);
}

// A round sun with rays; smile drawn by the caller when wanted.
export function drawSun(ctx, x, y, r = 30) {
  ctx.save();
  ctx.strokeStyle = '#e9a13b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x1 = x + Math.cos(a) * (r + 6);
    const y1 = y + Math.sin(a) * (r + 6);
    const x2 = x + Math.cos(a) * (r + 15);
    const y2 = y + Math.sin(a) * (r + 15);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(x - 8, y - 8, 4, x, y, r);
  g.addColorStop(0, '#ffe98a');
  g.addColorStop(1, '#f5b93f');
  circle(ctx, x, y, r, g, '#d99a26');
  ctx.restore();
}

export function drawSunFace(ctx, x, y) {
  circle(ctx, x - 10, y - 6, 2.4, '#3a2e22');
  circle(ctx, x + 10, y - 6, 2.4, '#3a2e22');
  ctx.beginPath();
  ctx.arc(x, y + 4, 9, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = '#3a2e22';
  ctx.lineWidth = 2.2;
  ctx.stroke();
}
