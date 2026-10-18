import type { MascotId } from '@/components/mascot/registry';

export const CATEGORY_SLUGS = ['construction', 'painting', 'driving', 'laundry', 'errands', 'cleaning'] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

// The job-prop mascot shown for each category on chips and job rows.
// Characters alternate so both appear; jobs are not tied to gender. Once
// users can pick their guide mascot, this can follow that choice instead.
export const CATEGORY_MASCOT: Record<CategorySlug, MascotId> = {
  construction: 'male_construction_hammer',
  painting: 'female_painting_roller',
  driving: 'male_driving_keys',
  laundry: 'female_laundry_basket',
  errands: 'male_errands_bag',
  cleaning: 'female_cleaning_broom',
};
