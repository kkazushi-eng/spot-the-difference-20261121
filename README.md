# Spot the Difference — The Curious Cottage

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kkazushi-eng/spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/kkazushi-eng/spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Entered on [make.fun](https://make.fun/?ref=d8wpcpxt&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards

A complete, original spot-the-difference game that runs offline in a
desktop browser from static files — no network requests, no libraries,
just hand-drawn canvas art and a sharp eye.

## How to play

Serve `game/` with any static server and open `index.html`, for example:

```sh
cd game
python3 -m http.server 8000
# open http://localhost:8000
```

Two near-identical pictures sit side by side. Click a difference on
either picture and a green ring marks it on both. Find them all to
complete the scene.

- **3 scenes, 27 differences**: Cottage Garden (8), Seaside Picnic (9),
  Moonlit Library (10) — each one hand-drawn on canvas, with its own
  palette, animated details (drifting clouds, fluttering butterflies,
  twinkling stars, shimmering waves) and a par time.
- **Fair but tricky differences**: a missing fence picket, a cat's tail
  that changed its mind, a sun wearing sunglasses, a fourth book in the
  stack, a clock that can't agree with itself.
- **Feel**: a satisfying chime and ring on every find, a gentle buzz on
  a miss, a pulsing gold hint ring (3 per scene, key `H`), a running
  timer, miss counter, and a star rating against par when you finish.
- **Keyboard**: `H` hint, `R` restart, `M` mute, `N` next scene,
  `1`/`2`/`3` jump to a scene.
- **Sounds** are synthesized live with the Web Audio API — no audio files.

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only):
  copies `game/` and `screenshots/` to `/output` and writes
  `/output/dossier.json` with the vendored make.fun library.
- `game/index.html` — the page shell and HUD.
- `game/style.css` — warm paper-and-ink styling.
- `game/src/main.js` — bootstrap, game state, input, rendering loop.
- `game/src/scenes.js` — the three scenes and every difference.
- `game/src/draw.js` — shared canvas drawing helpers (cat, sun,
  butterfly, flowers, clouds…).
- `game/src/audio.js` — synthesized sound effects.
- `game/src/ui.js` — HUD, progress dots, win overlay, toast.
- `game/src/shots.js` — staged mid-play states for the screenshots
  (driven by `?shot=`, using only the game's own actions).
- `screenshots/` — real renders of the game running in a browser.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
