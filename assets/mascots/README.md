# Mascot art

The `.webp` files here are generated. Do not edit them by hand.

- **Source art** (the original renders, white background) lives in
  `design/mascot-source/`, named `<character>_<outfit>_<pose>.jpg`.
- **`scripts/process-mascots.py`** removes the background, trims, and writes
  `name.webp`, `name@2x.webp` and `name@3x.webp` here (about 60-80 KB at 3x).
- **`src/components/mascot/registry.ts`** lists every image the app uses.

## Adding new art

1. Put the render in `design/mascot-source/` with its final name.
2. Add it to `MAPPING` in `scripts/process-mascots.py` and run
   `python3 scripts/process-mascots.py` (needs Python with Pillow and numpy).
3. Add a `require()` line for it in `registry.ts`.

Never recolor or redraw the characters in code.

## Still missing

- `male_construction_wave` (shows a placeholder for now)
- A neutral-outfit male set (planned in the brief)
- A female construction pose
