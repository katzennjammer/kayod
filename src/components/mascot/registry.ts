import type { ImageSourcePropType } from 'react-native';

// Every mascot image the app knows about, named after its file in
// assets/mascots/ (pattern: <character>_<outfit>_<pose>).
//
// No mascot files exist yet, so every entry is `null` and <Mascot> draws a
// labelled placeholder. When a file arrives, drop it in assets/mascots/ and
// replace `null` with a require(), for example:
//
//   female_neutral_phone: require('../../../assets/mascots/female_neutral_phone.png'),
//
// The require() must be written out in full like that: the bundler only
// packages images it can see in the code, so the path cannot be built from
// a variable.
export const MASCOTS = {
  // Female, neutral "Kayod helper" outfit (the set generated so far)
  female_neutral_wave: null,
  female_neutral_thumbsup: null,
  female_neutral_phone: null,
  female_neutral_celebrate: null,
  female_neutral_thinking: null,
  female_neutral_shrug: null,
  female_neutral_handshake: null,

  // Male, construction outfit (the set generated so far)
  male_construction_wave: null,
  male_construction_thumbsup: null,
  male_construction_phone: null,
  male_construction_celebrate: null,
  male_construction_thinking: null,
  male_construction_shrug: null,
  male_construction_handshake: null,
  male_construction_hammer: null,

  // One job-prop pose per category, for chips, cards and slide 3. Which
  // character wears which outfit is a placeholder choice; jobs are not tied
  // to gender, so swap these freely once the art exists.
  female_painting_roller: null,
  male_driving_keys: null,
  female_laundry_basket: null,
  male_errands_bag: null,
  female_cleaning_broom: null,
} satisfies Record<string, ImageSourcePropType | null>;

export type MascotId = keyof typeof MASCOTS;
