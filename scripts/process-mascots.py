"""Turn the raw mascot renders into app-ready transparent images.

    python3 scripts/process-mascots.py

For every entry in MAPPING it:
  1. removes the white background (and the soft grey floor shadow): the part
     connected to the image border, plus enclosed pockets of pure white big
     enough to be background (e.g. between a raised arm and the head). Small
     or shaded whites INSIDE the character (eyes, teeth, sneakers) stay.
  2. softens the cut edge so there is no white halo on coloured screens
  3. trims empty space and exports transparent WebP at 1x, 2x and 3x into
     assets/mascots/, named <character>_<outfit>_<pose>.webp

Needs Python 3 with Pillow and numpy (pip install pillow numpy).
To add new art: put the file in design/mascot-source/ and add a line below.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'design' / 'mascot-source'
OUT = ROOT / 'assets' / 'mascots'

# 1x height in dp. The biggest use (onboarding) shows a mascot about this tall.
BASE_HEIGHT = 320
SCALES = (1, 2, 3)
WEBP_QUALITY = 82

# source file (in design/mascot-source/) -> app name
MAPPING = {
    'male_construction_thumbsup.jpg': 'male_construction_thumbsup',
    'male_construction_phone.jpg': 'male_construction_phone',
    'male_construction_celebrate.jpg': 'male_construction_celebrate',
    'male_construction_thinking.jpg': 'male_construction_thinking',
    'male_construction_shrug.jpg': 'male_construction_shrug',
    'male_construction_handshake.jpg': 'male_construction_handshake',
    'male_construction_hammer.jpg': 'male_construction_hammer',
    'male_errands_bag.jpg': 'male_errands_bag',
    'male_driving_keys.jpg': 'male_driving_keys',
    'male_cleaning_broom.jpg': 'male_cleaning_broom',
    'male_laundry_basket.jpg': 'male_laundry_basket',
    'male_painting_roller.jpg': 'male_painting_roller',
    'female_neutral_wave.jpg': 'female_neutral_wave',
    'female_neutral_thumbsup.jpg': 'female_neutral_thumbsup',
    'female_neutral_phone.jpg': 'female_neutral_phone',
    'female_neutral_celebrate.jpg': 'female_neutral_celebrate',
    'female_neutral_thinking.jpg': 'female_neutral_thinking',
    'female_neutral_shrug.jpg': 'female_neutral_shrug',
    'female_neutral_handshake.jpg': 'female_neutral_handshake',
    'female_errands_bag.jpg': 'female_errands_bag',
    'female_painting_roller.jpg': 'female_painting_roller',
    'female_driving_keys.jpg': 'female_driving_keys',
    'female_cleaning_broom.jpg': 'female_cleaning_broom',
    'female_laundry_basket.jpg': 'female_laundry_basket',
}

# A pixel counts as "background" when it is light and nearly grey.
LIGHT_MIN = 200  # every channel at least this bright
GREY_SPREAD = 28  # channels within this of each other (not a coloured pixel)


# Enclosed pockets count as background only if they are this white and big.
# Measured on the first art set: background pockets are 770+ px with almost
# every pixel above 245; eye whites are ~250 px and shaded, sneakers ~220 grey.
POCKET_MIN = 240
POCKET_P10 = 245
POCKET_AREA = 400  # at the 3x working size


def flood(mask: np.ndarray, seeds) -> list:
    """Groups of connected True pixels in `mask`, grown from each seed."""
    h, w = mask.shape
    seen = np.zeros_like(mask)
    groups = []
    for sy, sx in seeds:
        if not mask[sy, sx] or seen[sy, sx]:
            continue
        seen[sy, sx] = True
        queue, pixels = deque([(sy, sx)]), []
        while queue:
            y, x = queue.popleft()
            pixels.append((y, x))
            for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    queue.append((ny, nx))
        groups.append(pixels)
    return groups


def background_mask(rgb: np.ndarray) -> np.ndarray:
    lo = rgb.min(axis=2)
    hi = rgb.max(axis=2)
    candidate = (lo >= LIGHT_MIN) & ((hi - lo) <= GREY_SPREAD)
    h, w = candidate.shape
    bg = np.zeros_like(candidate)

    # 1. everything light that touches the border
    border = [(0, x) for x in range(w)] + [(h - 1, x) for x in range(w)]
    border += [(y, 0) for y in range(h)] + [(y, w - 1) for y in range(h)]
    for group in flood(candidate, border):
        ys, xs = zip(*group)
        bg[ys, xs] = True

    # 2. big, pure-white pockets the character encloses
    white = (lo >= POCKET_MIN) & ((hi - lo) <= GREY_SPREAD) & ~bg
    for group in flood(white, map(tuple, np.argwhere(white))):
        if len(group) < POCKET_AREA:
            continue
        ys, xs = zip(*group)
        if np.percentile(lo[ys, xs], 10) >= POCKET_P10:
            bg[ys, xs] = True
    return bg


def cut_out(img: Image.Image) -> Image.Image:
    rgb = np.asarray(img.convert('RGB')).astype(np.int16)
    bg = background_mask(rgb)

    alpha = np.where(bg, 0, 255).astype(np.float32)

    # Edge pixels next to the background are a blend of outline and white.
    # Give them partial transparency and remove the white from their colour,
    # so the edge looks clean on any background colour.
    near = np.zeros_like(bg)
    near[1:, :] |= bg[:-1, :]
    near[:-1, :] |= bg[1:, :]
    near[:, 1:] |= bg[:, :-1]
    near[:, :-1] |= bg[:, 1:]
    edge = near & ~bg
    lightness = rgb.min(axis=2).astype(np.float32)
    edge_alpha = np.clip((255 - lightness) / (255 - 120), 0, 1)
    alpha[edge] = edge_alpha[edge] * 255

    a = (alpha / 255)[..., None]
    rgbf = rgb.astype(np.float32)
    unmixed = np.where(a > 0, (rgbf - (1 - a) * 255) / np.maximum(a, 1e-3), 0)
    out = np.dstack([np.clip(unmixed, 0, 255), alpha]).astype(np.uint8)
    result = Image.fromarray(out, 'RGBA')
    return result.crop(result.getbbox())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src_name, app_name in MAPPING.items():
        src = Image.open(SOURCE / src_name)
        # Work at 3x size: faster, and nothing larger is ever shown.
        work_h = BASE_HEIGHT * max(SCALES) + 80
        src = src.resize((round(src.width * work_h / src.height), work_h), Image.LANCZOS)
        art = cut_out(src)
        for scale in SCALES:
            h = BASE_HEIGHT * scale
            w = round(art.width * h / art.height)
            suffix = '' if scale == 1 else f'@{scale}x'
            path = OUT / f'{app_name}{suffix}.webp'
            art.resize((w, h), Image.LANCZOS).save(path, 'WEBP', quality=WEBP_QUALITY, method=6)
        size_kb = (OUT / f'{app_name}@3x.webp').stat().st_size / 1024
        print(f'{app_name:32s} {art.width}x{art.height}  @3x {size_kb:.0f} KB')


if __name__ == '__main__':
    main()
