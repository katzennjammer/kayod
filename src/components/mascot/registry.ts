import type { ImageSourcePropType } from 'react-native';

// Every mascot image the app knows about, named after its file in
// assets/mascots/ (pattern: <character>_<outfit>_<pose>). The files are made
// from the source art in design/mascot-source/ by scripts/process-mascots.py,
// which removes the background and writes 1x/2x/3x versions; the bundler
// picks the right size for each phone.
//
// An entry set to `null` has no art yet, and <Mascot> draws a labelled
// placeholder. The require() calls must be written out in full: the bundler
// only packages images it can see in the code.
export const MASCOTS = {
  // Female, neutral "Kayod helper" outfit
  female_neutral_wave: require('../../../assets/mascots/female_neutral_wave.webp'),
  female_neutral_thumbsup: require('../../../assets/mascots/female_neutral_thumbsup.webp'),
  female_neutral_phone: require('../../../assets/mascots/female_neutral_phone.webp'),
  female_neutral_celebrate: require('../../../assets/mascots/female_neutral_celebrate.webp'),
  female_neutral_thinking: require('../../../assets/mascots/female_neutral_thinking.webp'),
  female_neutral_shrug: require('../../../assets/mascots/female_neutral_shrug.webp'),
  female_neutral_handshake: require('../../../assets/mascots/female_neutral_handshake.webp'),

  // Male, construction outfit
  male_construction_thumbsup: require('../../../assets/mascots/male_construction_thumbsup.webp'),
  male_construction_phone: require('../../../assets/mascots/male_construction_phone.webp'),
  male_construction_celebrate: require('../../../assets/mascots/male_construction_celebrate.webp'),
  male_construction_thinking: require('../../../assets/mascots/male_construction_thinking.webp'),
  male_construction_shrug: require('../../../assets/mascots/male_construction_shrug.webp'),
  male_construction_handshake: require('../../../assets/mascots/male_construction_handshake.webp'),
  male_construction_hammer: require('../../../assets/mascots/male_construction_hammer.webp'),
  male_construction_wave: null, // not generated yet

  // Job outfits, both characters. Jobs are not tied to gender.
  female_errands_bag: require('../../../assets/mascots/female_errands_bag.webp'),
  female_painting_roller: require('../../../assets/mascots/female_painting_roller.webp'),
  female_driving_keys: require('../../../assets/mascots/female_driving_keys.webp'),
  female_cleaning_broom: require('../../../assets/mascots/female_cleaning_broom.webp'),
  female_laundry_basket: require('../../../assets/mascots/female_laundry_basket.webp'),
  male_errands_bag: require('../../../assets/mascots/male_errands_bag.webp'),
  male_painting_roller: require('../../../assets/mascots/male_painting_roller.webp'),
  male_driving_keys: require('../../../assets/mascots/male_driving_keys.webp'),
  male_cleaning_broom: require('../../../assets/mascots/male_cleaning_broom.webp'),
  male_laundry_basket: require('../../../assets/mascots/male_laundry_basket.webp'),
} satisfies Record<string, ImageSourcePropType | null>;

export type MascotId = keyof typeof MASCOTS;
