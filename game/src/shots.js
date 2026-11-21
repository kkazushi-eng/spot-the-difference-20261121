// Staged states for the entry's screenshots, driven by ?shot=.
// These only call the game's own public actions (the same ones a
// player triggers by clicking), so every screenshot is a real render
// of the game mid-play — nothing is drawn specially for the camera.

const SHOTS = {
  // Cover: Cottage Garden mid-hunt — 3 found (green rings), 5 to go.
  cover(game) {
    game.loadLevel(0);
    game.findDiffById('bird');
    game.findDiffById('tail');
    game.findDiffById('curtain');
    game.setElapsed(83);
    game.setMisses(0);
  },
  // Seaside Picnic mid-hunt — 4 of 9 found.
  level2(game) {
    game.loadLevel(1);
    game.findDiffById('gull');
    game.findDiffById('umbrella');
    game.findDiffById('sail');
    game.findDiffById('sandwich');
    game.setElapsed(142);
    game.setMisses(1);
  },
  // Cottage Garden completed, with the win overlay and stars.
  win(game) {
    game.loadLevel(0);
    game.setElapsed(98);
    game.setMisses(1);
    game.finishLevel();
  },
  // Moonlit Library at night — 2 of 10 found, timer running.
  night(game) {
    game.loadLevel(2);
    game.findDiffById('craters');
    game.findDiffById('shade');
    game.setElapsed(57);
    game.setMisses(0);
  },
};

export function applyShot(name, game) {
  const shot = SHOTS[name];
  if (!shot) return;
  // Run after the first frame so the canvases are painted once first.
  requestAnimationFrame(() => shot(game));
}
