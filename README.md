# Shoot Die Repeat — HTML port

Rebuilt from `shoot_die_repeat_1.3.0_b2_cheat.apk` (Unity IL2CPP) with three.js.

## Run

```
npm install
npm run dev
```

Open http://localhost:8790. Debug URL params: `?lvl=N` (start level), `?zoom=X`.

## Layout

- `index.html` — UI markup and CSS (HUD, pre-run upgrade cards, result/victory, settings).
- `public/game.js` — all game logic: level build, voxel rigs + LegStepper, player/weapons, projectiles, monsters, spawner, upgrades, rewards.
- `public/assets.js` — `window.SDR_ASSETS`: prefabs, meshes (gzip), textures, audio, level layouts extracted from the APK.
- `source-assets/` — the raw extracted files (PNG textures, MP3 audio, level JSON, scene.json + meshes.bin). Not loaded by the game; kept for editing/re-export.

## Balance (from the original game code)

Constants and formulas in `public/game.js` (`BAL`, `RB`, `WEAPONS`, `LEVELS`) are the shipped values from
`RunBalance`, `PlayerLevelTable`, `WeaponDef`, `RunSpawner` and `PlayerController`:

- Damage = baseDamage × 1.02^level (rounded to 0.1), headshot × 1.95, pierce falloff × 0.7.
- Shot interval = fireInterval / 1.02^level; reload = reloadTime (× magazine for shell reloads) / (CycleSpeed × 1.7).
- Upgrade price = UpgradeCosts[5,20,50,90,135,190,250] (5 sub-levels per tier) × 2.7^(map−1) × (1 + 0.1·(map−1)); Income price = 20 × 2^level.
- Reward = meters walked (distance / 0.38) × Income multiplier; kills give no coins.
- Monsters walk 1.6 m/s, player retreats 0.45 m/s, auto-fire while a monster is on screen.

## Not done yet

- Falcon Game Client SDK is not integrated (header, win/lose popups, ads, analytics). Use the `falcon-sdk-port` flow in Falcon IDE.
- Not bundled into a single `dist/index.html` (`vite-plugin-singlefile` not set up); three.js is vendored in `public/vendor/`.

## CI builds

`.github/workflows/build.yml` runs on every push to `main`:

- **Web**: `vite build` → deployed to GitHub Pages.
- **APK**: Capacitor wraps `dist/` → `assembleDebug` → uploaded as a workflow artifact and a `build-N` GitHub Release.
