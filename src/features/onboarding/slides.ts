import type { MascotId } from '@/components/mascot/registry';
import type { ColorName } from '@/theme';

export type SlideArt =
  | { kind: 'single'; id: MascotId }
  | { kind: 'pair'; ids: readonly [MascotId, MascotId] }
  | { kind: 'grid'; ids: readonly MascotId[] };

export type Slide = {
  key: 'slide1' | 'slide2' | 'slide3' | 'slide4' | 'slide5';
  background: ColorName;
  shape: ColorName; // the soft circle behind the mascot
  art: SlideArt;
};

// The five intro slides from the brief, section 7. Text lives in the locale
// files under onboarding.<key>.title / .subtitle.
export const SLIDES: readonly Slide[] = [
  {
    key: 'slide1',
    background: 'tintOrange',
    shape: 'shapeOrange',
    art: { kind: 'single', id: 'female_neutral_phone' },
  },
  {
    key: 'slide2',
    background: 'tintBlue',
    shape: 'shapeBlue',
    art: { kind: 'single', id: 'male_construction_thinking' },
  },
  {
    key: 'slide3',
    background: 'tintYellow',
    shape: 'shapeYellow',
    art: {
      kind: 'grid',
      ids: [
        'male_construction_hammer',
        'female_painting_roller',
        'male_driving_keys',
        'female_laundry_basket',
        'male_errands_bag',
        'female_cleaning_broom',
      ],
    },
  },
  {
    key: 'slide4',
    background: 'tintCoral',
    shape: 'shapeCoral',
    // Two separate images facing each other. If the final art is one image of
    // both characters shaking hands, switch this to { kind: 'single' }.
    art: { kind: 'pair', ids: ['female_neutral_handshake', 'male_construction_handshake'] },
  },
  {
    key: 'slide5',
    background: 'white',
    shape: 'accent',
    art: { kind: 'pair', ids: ['female_neutral_celebrate', 'male_construction_celebrate'] },
  },
];
