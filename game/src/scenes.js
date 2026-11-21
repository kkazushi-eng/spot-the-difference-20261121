// Scene definitions for Spot the Difference.
// Each scene draws the same base picture on both panels, then each
// difference draws its own left and right version at the same spot.
// Coordinates are scene space, 560 x 420. `t` is seconds, for gentle
// animation (clouds, butterflies, stars, waves).

import {
  W, H, ellipse, circle, roundRect, poly, line, curve,
  drawFlower, drawCloud, drawStar, drawBird, drawButterfly,
  drawCatBody, drawCatTailUp, drawCatTailDown, drawSun, drawSunFace,
} from './draw.js';

function skyGradient(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 280);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 280);
}

/* ------------------------------------------------------------------ */
/* Scene 1 — Cottage Garden (8 differences)                            */
/* ------------------------------------------------------------------ */

function drawGardenBase(ctx, t) {
  skyGradient(ctx, '#a8d8ef', '#eaf7fd');
  const drift = Math.sin(t * 0.12) * 5;
  drawCloud(ctx, 210 + drift, 52, 0.9);
  drawCloud(ctx, 440 - drift, 40, 0.7);
  drawSun(ctx, 70, 62, 30);
  drawSunFace(ctx, 70, 62);

  // Rolling hills and lawn.
  ctx.fillStyle = '#9ccb6e';
  ctx.beginPath();
  ctx.ellipse(140, 330, 260, 90, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8fbf6a';
  ctx.fillRect(0, 300, W, 120);
  ctx.fillStyle = '#a5d47e';
  ctx.beginPath();
  ctx.ellipse(460, 340, 220, 70, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Apple tree (two apples here; the third is a difference).
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(96, 225, 20, 80);
  ctx.fillStyle = '#5e8c4a';
  circle(ctx, 106, 185, 56, '#5e8c4a', '#4a7038');
  circle(ctx, 66, 212, 38, '#6a9a52', '#4a7038');
  circle(ctx, 146, 212, 38, '#6a9a52', '#4a7038');
  circle(ctx, 85, 205, 8, '#d64541', '#a52f2b');
  circle(ctx, 130, 225, 8, '#d64541', '#a52f2b');

  // Stone path from the cottage door.
  poly(ctx, [[378, 300], [412, 300], [428, 420], [362, 420]], '#e8dcc0');
  line(ctx, 395, 330, 395, 420, '#d3c49c', 2);
  line(ctx, 378, 365, 414, 365, '#d3c49c', 2);

  // The cottage.
  ctx.fillStyle = '#f6e3b4';
  ctx.strokeStyle = '#b98d4f';
  ctx.lineWidth = 2;
  ctx.fillRect(300, 170, 180, 130);
  ctx.strokeRect(300, 170, 180, 130);
  poly(ctx, [[285, 172], [495, 172], [390, 100]], '#d96a4a', '#a84a30');
  // Chimney (smoke is a difference).
  ctx.fillStyle = '#b06a52';
  ctx.fillRect(452, 92, 24, 52);
  ctx.strokeRect(452, 92, 24, 52);
  // Door.
  ctx.fillStyle = '#8a5a34';
  ctx.beginPath();
  ctx.moveTo(376, 300);
  ctx.lineTo(376, 244);
  ctx.quadraticCurveTo(394, 226, 412, 244);
  ctx.lineTo(412, 300);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5e3d20';
  ctx.stroke();
  circle(ctx, 405, 272, 3, '#e9a13b');
  // Windows (glass + crossbars; curtains are a difference).
  for (const wx of [324, 420]) {
    ctx.fillStyle = '#bfe3f2';
    ctx.fillRect(wx, 196, 36, 36);
    ctx.strokeStyle = '#7a5230';
    ctx.lineWidth = 3;
    ctx.strokeRect(wx, 196, 36, 36);
    line(ctx, wx + 18, 196, wx + 18, 232, '#7a5230', 2);
    line(ctx, wx, 214, wx + 36, 214, '#7a5230', 2);
  }

  // Picket fence with one gap (the missing picket is a difference).
  ctx.fillStyle = '#f2e6c8';
  ctx.strokeStyle = '#c9b183';
  ctx.lineWidth = 2;
  ctx.fillRect(16, 306, 528, 6);
  ctx.fillRect(16, 324, 528, 6);
  for (let x = 24; x <= 536; x += 26) {
    if (x === 76) continue; // the gap
    ctx.beginPath();
    ctx.moveTo(x, 336);
    ctx.lineTo(x, 300);
    ctx.lineTo(x + 6, 294);
    ctx.lineTo(x + 12, 300);
    ctx.lineTo(x + 12, 336);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Flower bed along the bottom (one tulip's colour is a difference).
  const bed = [
    [40, '#e2725b'], [140, '#f2a541'], [190, '#c96a9a'], [240, '#e2725b'],
    [340, '#f2a541'], [390, '#c96a9a'], [450, '#e2725b'], [520, '#f2a541'],
  ];
  for (const [fx, col] of bed) drawFlower(ctx, fx, 388, col, '#f5c542', 10);
  for (const [fx] of bed) {
    line(ctx, fx, 396, fx, 412, '#4a7038', 2);
  }

  // The garden cat (its tail is a difference).
  drawCatBody(ctx, 185, 352, 1);
  // A butterfly both panels share, fluttering high.
  drawButterfly(ctx, 452, 74 + Math.sin(t * 1.4) * 4, 1, '#c96a9a', Math.sin(t * 6));
}

const gardenDiffs = [
  {
    id: 'bird', label: 'the bird on the roof', x: 430, y: 128, r: 22,
    drawLeft(ctx) { drawBird(ctx, 430, 124, 1.1); },
    drawRight() {},
  },
  {
    id: 'tulip', label: 'the tulip that changed colour', x: 95, y: 378, r: 18,
    drawLeft(ctx) { drawFlower(ctx, 95, 382, '#e2725b', '#f5c542', 10); line(ctx, 95, 390, 95, 412, '#4a7038', 2); },
    drawRight(ctx) { drawFlower(ctx, 95, 382, '#4a7fa5', '#f5c542', 10); line(ctx, 95, 390, 95, 412, '#4a7038', 2); },
  },
  {
    id: 'tail', label: "the cat's tail", x: 216, y: 338, r: 26,
    drawLeft(ctx) { drawCatTailUp(ctx, 185, 352, 1); },
    drawRight(ctx) { drawCatTailDown(ctx, 185, 352, 1); },
  },
  {
    id: 'butterfly', label: 'the second butterfly', x: 300, y: 335, r: 22,
    drawLeft() {},
    drawRight(ctx, t) { drawButterfly(ctx, 300, 335 + Math.sin(t * 1.8) * 3, 1, '#e2725b', Math.sin(t * 6 + 1)); },
  },
  {
    id: 'curtain', label: 'the cottage curtain', x: 342, y: 214, r: 20,
    drawLeft(ctx) {
      ctx.fillStyle = '#e89aa0';
      poly(ctx, [[324, 196], [334, 196], [330, 232], [324, 232]], '#e89aa0');
      poly(ctx, [[350, 196], [360, 196], [360, 232], [354, 232]], '#e89aa0');
    },
    drawRight(ctx) {
      ctx.fillStyle = '#e89aa0';
      ctx.fillRect(324, 196, 36, 36);
      line(ctx, 342, 196, 342, 232, '#c96a7a', 2);
    },
  },
  {
    id: 'picket', label: 'the missing fence picket', x: 76, y: 316, r: 16,
    drawLeft(ctx) {
      ctx.fillStyle = '#f2e6c8';
      ctx.strokeStyle = '#c9b183';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(76, 336); ctx.lineTo(76, 300); ctx.lineTo(82, 294);
      ctx.lineTo(88, 300); ctx.lineTo(88, 336); ctx.closePath();
      ctx.fill(); ctx.stroke();
    },
    drawRight() {},
  },
  {
    id: 'apple', label: 'the third apple', x: 150, y: 185, r: 14,
    drawLeft(ctx) { circle(ctx, 150, 185, 8, '#d64541', '#a52f2b'); },
    drawRight() {},
  },
  {
    id: 'smoke', label: 'the chimney smoke', x: 466, y: 78, r: 24,
    drawLeft(ctx, t) {
      const w = Math.sin(t * 0.7) * 3;
      ctx.fillStyle = 'rgba(200, 200, 200, 0.85)';
      circle(ctx, 464 + w, 84, 9, 'rgba(200,200,200,0.85)');
      circle(ctx, 470 - w, 66, 11, 'rgba(210,210,210,0.8)');
      circle(ctx, 462 + w, 48, 13, 'rgba(220,220,220,0.7)');
    },
    drawRight() {},
  },
];

/* ------------------------------------------------------------------ */
/* Scene 2 — Seaside Picnic (9 differences)                            */
/* ------------------------------------------------------------------ */

function drawSeasideBase(ctx, t) {
  skyGradient(ctx, '#a5d8f0', '#eaf7ff');
  drawCloud(ctx, 120 + Math.sin(t * 0.1) * 6, 48, 0.8);
  drawCloud(ctx, 330 - Math.sin(t * 0.1) * 5, 36, 0.6);
  drawSun(ctx, 492, 55, 28);

  // Sea with shimmering waves.
  ctx.fillStyle = '#4a90c2';
  ctx.fillRect(0, 150, W, 130);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const y = 175 + i * 26;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 14) {
      const yy = y + Math.sin(x * 0.05 + t * 1.2 + i * 2) * 3;
      if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // Sand.
  ctx.fillStyle = '#f2d8a0';
  ctx.fillRect(0, 280, W, 140);
  ctx.fillStyle = '#e5c584';
  for (const [sx, sy] of [[60, 320], [200, 300], [520, 350], [40, 400], [540, 300]]) {
    ellipse(ctx, sx, sy, 14, 4, '#e5c584');
  }

  // Kite with a tail (one bow is a difference).
  poly(ctx, [[250, 52], [276, 80], [250, 108], [224, 80]], '#e2725b', '#a84a30');
  line(ctx, 250, 52, 250, 108, '#a84a30', 1.5);
  line(ctx, 224, 80, 276, 80, '#a84a30', 1.5);
  line(ctx, 250, 108, 250, 152, '#6b5a44', 1.5);
  for (const by of [120, 134]) {
    poly(ctx, [[250, by - 6], [258, by], [250, by + 6], [242, by]], '#f2a541');
  }

  // Two gulls both panels share (a third is a difference).
  drawBird(ctx, 340, 62, 1);
  drawBird(ctx, 392, 48, 0.9);

  // Beach umbrella pole (its canopy is a difference).
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(137, 168, 6, 92);

  // The boat (its sail is a difference).
  ctx.fillStyle = '#8a5a34';
  poly(ctx, [[368, 208], [432, 208], [420, 228], [380, 228]], '#8a5a34', '#5e3d20');
  line(ctx, 400, 208, 400, 162, '#5e3d20', 3);

  // Picnic blanket, basket and bottle.
  ctx.fillStyle = '#fff';
  ctx.fillRect(300, 330, 180, 62);
  ctx.fillStyle = '#e2725b';
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 2; j++) {
      if ((i + j) % 2 === 0) ctx.fillRect(300 + i * 30, 330 + j * 31, 30, 31);
    }
  }
  ctx.strokeStyle = '#a84a30';
  ctx.lineWidth = 2;
  ctx.strokeRect(300, 330, 180, 62);
  ctx.fillStyle = '#a5713d';
  roundRect(ctx, 318, 344, 44, 26, 5, '#a5713d', '#6b4423');
  ctx.beginPath();
  ctx.arc(340, 344, 14, Math.PI, 0);
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Bottle.
  ctx.fillStyle = '#4a9a5c';
  roundRect(ctx, 452, 348, 12, 30, 4, '#4a9a5c', '#2f6b3d');
  ctx.fillRect(455, 340, 6, 10);

  // Bucket (its spade is a difference).
  ctx.fillStyle = '#d64541';
  poly(ctx, [[70, 344], [112, 344], [106, 376], [76, 376]], '#d64541', '#a52f2b');
  ctx.fillStyle = '#f2a541';
  ctx.fillRect(66, 342, 50, 5);

  // Crab (one claw is a difference).
  ctx.fillStyle = '#e2725b';
  ellipse(ctx, 482, 302, 22, 14, '#e2725b', '#a84a30');
  circle(ctx, 474, 286, 4, '#fff', '#a84a30');
  circle(ctx, 492, 286, 4, '#fff', '#a84a30');
  circle(ctx, 474, 286, 1.8, '#3a2e22');
  circle(ctx, 492, 286, 1.8, '#3a2e22');
  ctx.strokeStyle = '#a84a30';
  ctx.lineWidth = 2;
  for (const ly of [298, 304, 310]) {
    line(ctx, 462, ly, 452, ly + 4, '#a84a30', 2);
    line(ctx, 502, ly, 512, ly + 4, '#a84a30', 2);
  }
}

// A beach umbrella canopy: a semicircle split into six pie slices,
// alternating the main colour and white, with a stroked rim.
function drawUmbrellaCanopy(ctx, color, rim) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(140, 168, 72, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  for (const [a1, a2] of [[7 * Math.PI / 6, 4 * Math.PI / 3], [3 * Math.PI / 2, 5 * Math.PI / 3], [11 * Math.PI / 6, 2 * Math.PI]]) {
    ctx.beginPath();
    ctx.moveTo(140, 168);
    ctx.arc(140, 168, 72, a1, a2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = rim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(140, 168, 72, Math.PI, 0);
  ctx.stroke();
  line(ctx, 68, 168, 212, 168, rim, 2);
}

const seasideDiffs = [
  {
    id: 'gull', label: 'the third seagull', x: 300, y: 85, r: 18,
    drawLeft(ctx) { drawBird(ctx, 300, 85, 1); },
    drawRight() {},
  },
  {
    id: 'umbrella', label: 'the umbrella stripes', x: 140, y: 165, r: 30,
    drawLeft(ctx) { drawUmbrellaCanopy(ctx, '#e2725b', '#a84a30'); },
    drawRight(ctx) { drawUmbrellaCanopy(ctx, '#4a7fa5', '#2f5a75'); },
  },
  {
    id: 'claw', label: "the crab's raised claw", x: 503, y: 288, r: 18,
    drawLeft(ctx) {
      circle(ctx, 506, 278, 8, '#e2725b', '#a84a30');
      poly(ctx, [[506, 270], [512, 262], [514, 272]], '#e2725b', '#a84a30');
    },
    drawRight(ctx) {
      circle(ctx, 506, 306, 8, '#e2725b', '#a84a30');
      poly(ctx, [[506, 314], [512, 322], [514, 312]], '#e2725b', '#a84a30');
    },
  },
  {
    id: 'sail', label: "the boat's sail", x: 414, y: 185, r: 22,
    drawLeft(ctx) { poly(ctx, [[402, 166], [402, 204], [432, 204]], '#fffaf0', '#a84a30'); },
    drawRight() {},
  },
  {
    id: 'spade', label: 'the spade in the bucket', x: 100, y: 330, r: 16,
    drawLeft(ctx) {
      line(ctx, 100, 344, 108, 316, '#a5713d', 4);
      poly(ctx, [[100, 316], [116, 306], [120, 322], [108, 328]], '#4a7fa5', '#2f5a75');
    },
    drawRight() {},
  },
  {
    id: 'sandwich', label: 'the sandwich on the blanket', x: 410, y: 360, r: 16,
    drawLeft(ctx) {
      poly(ctx, [[396, 372], [410, 348], [424, 372]], '#f2e6c8', '#b98d4f');
      line(ctx, 402, 362, 418, 362, '#5e8c4a', 3);
    },
    drawRight() {},
  },
  {
    id: 'bow', label: 'the third bow on the kite tail', x: 250, y: 146, r: 14,
    drawLeft(ctx) { poly(ctx, [[250, 140], [258, 146], [250, 152], [242, 146]], '#f2a541'); },
    drawRight() {},
  },
  {
    id: 'starfish', label: 'the starfish on the sand', x: 230, y: 392, r: 16,
    drawLeft(ctx) { drawStar(ctx, 230, 392, 12, '#e2725b'); },
    drawRight() {},
  },
  {
    id: 'sunglasses', label: "the sun's sunglasses", x: 492, y: 55, r: 26,
    drawLeft(ctx) {
      ctx.fillStyle = '#3a2e22';
      roundRect(ctx, 474, 46, 16, 10, 4, '#3a2e22');
      roundRect(ctx, 494, 46, 16, 10, 4, '#3a2e22');
      line(ctx, 490, 50, 494, 50, '#3a2e22', 2);
    },
    drawRight(ctx) { drawSunFace(ctx, 492, 55); },
  },
];

/* ------------------------------------------------------------------ */
/* Scene 3 — Moonlit Library (10 differences)                          */
/* ------------------------------------------------------------------ */

function drawCurledCat(ctx, x, y, s = 1) {
  // A cat curled up asleep on the rug.
  ellipse(ctx, x, y, 30 * s, 16 * s, '#f2a541', '#b97f22');
  circle(ctx, x - 26 * s, y - 10 * s, 13 * s, '#f2a541', '#b97f22');
  poly(ctx, [[x - 36 * s, y - 18 * s], [x - 33 * s, y - 30 * s], [x - 27 * s, y - 19 * s]], '#f2a541', '#b97f22');
  poly(ctx, [[x - 22 * s, y - 21 * s], [x - 18 * s, y - 31 * s], [x - 14 * s, y - 19 * s]], '#f2a541', '#b97f22');
  curve(ctx, [[x + 26 * s, y + 6 * s], [x + 38 * s, y + 2 * s], [x + 36 * s, y - 10 * s]], '#b97f22', 4 * s);
  line(ctx, x - 8 * s, y - 6 * s, x + 2 * s, y - 6 * s, '#b97f22', 2);
  line(ctx, x - 8 * s, y - 1 * s, x + 2 * s, y - 1 * s, '#b97f22', 2);
}

function drawLibraryBase(ctx, t) {
  // Night walls and wooden floor.
  ctx.fillStyle = '#322c52';
  ctx.fillRect(0, 0, W, 330);
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(0, 330, W, 90);
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 2;
  for (let y = 350; y < 420; y += 22) line(ctx, 0, y, W, y, '#6b4423', 2);

  // Big window with the night sky (moon + stars are differences).
  ctx.fillStyle = '#1c1440';
  ctx.fillRect(50, 40, 200, 170);
  const tw = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.1));
  drawStar(ctx, 90, 70, 6, '#ffe98a', tw);
  drawStar(ctx, 220, 120, 5, '#ffe98a', 1 - tw * 0.5);
  drawStar(ctx, 120, 150, 4, '#fff', tw);
  drawStar(ctx, 230, 60, 4, '#fff', 0.8);
  drawStar(ctx, 70, 130, 5, '#ffe98a', 0.7);
  circle(ctx, 150, 100, 28, '#f5ead0', '#d9c9a3');
  // Window frame.
  ctx.strokeStyle = '#5e3d20';
  ctx.lineWidth = 8;
  ctx.strokeRect(50, 40, 200, 170);
  line(ctx, 150, 40, 150, 210, '#5e3d20', 6);
  line(ctx, 50, 125, 250, 125, '#5e3d20', 6);

  // Framed mountain painting (its sun is a difference).
  ctx.fillStyle = '#d9b25f';
  ctx.fillRect(288, 58, 114, 84);
  ctx.fillStyle = '#9fc3e8';
  ctx.fillRect(296, 66, 98, 68);
  poly(ctx, [[296, 134], [330, 88], [362, 134]], '#5e7a52');
  poly(ctx, [[340, 134], [372, 96], [394, 134]], '#4a6b44');
  ctx.fillStyle = '#6b8f5e';
  ctx.fillRect(296, 122, 98, 12);

  // Wall clock (its hands are a difference).
  circle(ctx, 470, 90, 27, '#fffaf0', '#5e3d20');
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    line(ctx, 470 + Math.cos(a) * 21, 90 + Math.sin(a) * 21, 470 + Math.cos(a) * 24, 90 + Math.sin(a) * 24, '#5e3d20', 2);
  }
  circle(ctx, 470, 90, 3, '#3a2e22');

  // Bookshelf with three shelves (one spine is a difference).
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(300, 160, 230, 172);
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(308, 168, 214, 156);
  const shelfCols = ['#d64541', '#4a7fa5', '#e9a13b', '#5e8c4a', '#c96a9a', '#7a5a9a'];
  for (let shelf = 0; shelf < 3; shelf++) {
    const y0 = 172 + shelf * 52;
    let x = 312;
    let i = 0;
    while (x < 512) {
      const w = 12 + ((i * 7 + shelf * 3) % 8);
      if (!(shelf === 0 && x >= 354 && x < 372)) {
        ctx.fillStyle = shelfCols[(i + shelf) % shelfCols.length];
        ctx.fillRect(x, y0, w, 44);
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y0, w, 44);
      }
      x += w + 2;
      i++;
    }
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(308, y0 + 44, 214, 6);
  }

  // Rug and the sleeping cat (its collar is a difference).
  ellipse(ctx, 280, 388, 132, 20, '#a84a30', '#7a3524');
  ellipse(ctx, 280, 388, 104, 14, '#c96a5a');
  drawCurledCat(ctx, 270, 378, 1);

  // Side table with lamp and teacup.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(70, 302, 130, 8);
  ctx.fillRect(80, 310, 10, 44);
  ctx.fillRect(180, 310, 10, 44);
  // Lamp base and pole (shade colour is a difference).
  ellipse(ctx, 112, 300, 14, 5, '#d9b25f', '#8a6d1f');
  ctx.fillStyle = '#8a6d1f';
  ctx.fillRect(110, 258, 4, 42);
  // Teacup.
  ctx.fillStyle = '#fffaf0';
  ellipse(ctx, 178, 296, 16, 7, '#fffaf0', '#b98d4f');
  ctx.fillRect(164, 282, 28, 14);
  ctx.beginPath();
  ctx.arc(194, 289, 6, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = '#b98d4f';
  ctx.lineWidth = 2;
  ctx.stroke();
  ellipse(ctx, 178, 298, 20, 4, '#e8dcc0', '#b98d4f');

  // Potted plant (one leaf is a difference).
  ctx.fillStyle = '#b06a52';
  poly(ctx, [[492, 352], [524, 352], [518, 382], [498, 382]], '#b06a52', '#7a4636');
  ctx.strokeStyle = '#4a7038';
  ctx.lineWidth = 3;
  for (const [lx, ly, tx, ty] of [
    [508, 352, 492, 322], [508, 352, 508, 316], [508, 352, 524, 322], [508, 352, 516, 312],
  ]) {
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo((lx + tx) / 2, (ly + ty) / 2 - 6, tx, ty);
    ctx.stroke();
  }

  // Stack of books on the floor (a fourth book is a difference).
  const stack = [
    [70, 392, 52, 10, '#d64541'],
    [74, 382, 46, 10, '#4a7fa5'],
    [72, 372, 50, 10, '#e9a13b'],
  ];
  for (const [bx, by, bw, bh, col] of stack) {
    ctx.fillStyle = col;
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);
  }
}

const libraryDiffs = [
  {
    id: 'hands', label: 'the clock hands', x: 470, y: 90, r: 22,
    drawLeft(ctx) {
      line(ctx, 470, 90, 458, 74, '#3a2e22', 3);
      line(ctx, 470, 90, 484, 84, '#3a2e22', 3);
    },
    drawRight(ctx) {
      line(ctx, 470, 90, 470, 70, '#3a2e22', 3);
      line(ctx, 470, 90, 486, 90, '#3a2e22', 3);
    },
  },
  {
    id: 'spine', label: 'the red book spine', x: 363, y: 194, r: 16,
    drawLeft(ctx) { ctx.fillStyle = '#d64541'; ctx.fillRect(356, 172, 14, 44); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1; ctx.strokeRect(356, 172, 14, 44); },
    drawRight(ctx) { ctx.fillStyle = '#5e8c4a'; ctx.fillRect(356, 172, 14, 44); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1; ctx.strokeRect(356, 172, 14, 44); },
  },
  {
    id: 'craters', label: 'the craters on the moon', x: 150, y: 100, r: 26,
    drawLeft(ctx) {
      circle(ctx, 140, 92, 5, '#d9c9a3');
      circle(ctx, 160, 108, 4, '#d9c9a3');
      circle(ctx, 152, 84, 3, '#d9c9a3');
    },
    drawRight() {},
  },
  {
    id: 'star', label: 'the extra star', x: 205, y: 65, r: 14,
    drawLeft(ctx) { drawStar(ctx, 205, 65, 6, '#ffe98a', 1); },
    drawRight() {},
  },
  {
    id: 'collar', label: "the cat's collar", x: 262, y: 372, r: 16,
    drawLeft(ctx) {
      ctx.strokeStyle = '#d64541';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(252, 368, 9, 0.3, Math.PI - 0.3);
      ctx.stroke();
      circle(ctx, 252, 378, 3.5, '#e9a13b', '#8a6d1f');
    },
    drawRight() {},
  },
  {
    id: 'steam', label: 'the steam over the teacup', x: 178, y: 268, r: 16,
    drawLeft(ctx, t) {
      const w = Math.sin(t * 1.5) * 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(172 + w, 280);
      ctx.quadraticCurveTo(168 + w, 270, 172 + w, 260);
      ctx.moveTo(184 - w, 280);
      ctx.quadraticCurveTo(188 - w, 270, 184 - w, 260);
      ctx.stroke();
    },
    drawRight() {},
  },
  {
    id: 'leaf', label: 'the fifth leaf', x: 520, y: 330, r: 16,
    drawLeft(ctx) {
      ctx.strokeStyle = '#4a7038';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(508, 352);
      ctx.quadraticCurveTo(522, 338, 530, 326);
      ctx.stroke();
    },
    drawRight() {},
  },
  {
    id: 'painting-sun', label: 'the sun in the painting', x: 372, y: 80, r: 18,
    drawLeft(ctx) { circle(ctx, 374, 80, 9, '#f5b93f', '#d99a26'); },
    drawRight() {},
  },
  {
    id: 'shade', label: 'the lamp shade colour', x: 112, y: 246, r: 20,
    drawLeft(ctx) {
      poly(ctx, [[92, 258], [132, 258], [126, 234], [98, 234]], '#e9a13b', '#b97f22');
    },
    drawRight(ctx) {
      poly(ctx, [[92, 258], [132, 258], [126, 234], [98, 234]], '#4a9a8c', '#2f6b5c');
    },
  },
  {
    id: 'fourth-book', label: 'the fourth book in the stack', x: 96, y: 360, r: 16,
    drawLeft(ctx) {
      ctx.fillStyle = '#7a5a9a';
      ctx.fillRect(76, 360, 42, 10);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(76, 360, 42, 10);
    },
    drawRight() {},
  },
];

/* ------------------------------------------------------------------ */

export const SCENES = [
  {
    id: 'garden', name: 'Cottage Garden', parSeconds: 120,
    drawBase: drawGardenBase, diffs: gardenDiffs,
  },
  {
    id: 'seaside', name: 'Seaside Picnic', parSeconds: 150,
    drawBase: drawSeasideBase, diffs: seasideDiffs,
  },
  {
    id: 'library', name: 'Moonlit Library', parSeconds: 180,
    drawBase: drawLibraryBase, diffs: libraryDiffs,
  },
];
