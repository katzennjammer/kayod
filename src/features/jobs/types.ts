import type { CategorySlug } from './categories';

export type PayUnit = 'per_day' | 'per_job' | 'per_hour';

// The shape a job card needs. It mirrors the planned `jobs` table plus the
// employer summary and the distance from the feed query (supabase/SCHEMA_DRAFT.md).
export type JobSummary = {
  id: string;
  title: string;
  category: CategorySlug;
  employerName: string;
  employerVerified: boolean;
  employerRating: number | null; // null until the employer has ratings
  payAmount: number; // pesos
  payUnit: PayUnit;
  startsAt: Date;
  endsAt: Date;
  distanceKm: number;
  urgent: boolean;
};
