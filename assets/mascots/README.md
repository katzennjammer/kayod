# Mascot art

No mascot files have been added yet. The app shows a grey labelled placeholder
for each missing image, with the file name it expects.

## Adding a file

1. Remove the white background and export a transparent PNG or WebP.
   Aim for under about 150 KB per file. Use the exact name from
   `src/components/mascot/registry.ts`, e.g. `female_neutral_phone.png`.
2. For sharper art on high-density phones, also add `name@2x.png` and
   `name@3x.png`. The bundler picks the right one automatically.
3. In `registry.ts`, replace that entry's `null` with
   `require('../../../assets/mascots/<name>.png')`.

Never recolor or redraw the characters in code.

## Names expected so far

Pattern: `<character>_<outfit>_<pose>`

- Core poses: `wave`, `thumbsup`, `phone` (pointing at phone), `celebrate`,
  `thinking`, `shrug`, `handshake`, plus `male_construction_hammer`.
- Characters and outfits available now: `female_neutral_*`, `male_construction_*`.
- Category props: `female_painting_roller`, `male_driving_keys`,
  `female_laundry_basket`, `male_errands_bag`, `female_cleaning_broom`.

Add new names to `registry.ts` as new art arrives (e.g. a `male_neutral_*` set).
