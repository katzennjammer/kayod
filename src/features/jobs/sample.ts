import type { JobSummary } from './types';

// DEVELOPMENT SAMPLE DATA, so the home screen can be designed and tested
// before the database exists. Milestone 3 replaces this with the seeded
// Supabase feed (supabase/seed.sql) and deletes this file.
//
// Times are built relative to "now" so the sample always has jobs today.
function at(dayOffset: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export const SAMPLE_JOBS: JobSummary[] = [
  {
    id: 's1',
    title: 'Help move furniture to a new house',
    category: 'errands',
    employerName: 'Maria Santos',
    employerVerified: true,
    employerRating: 4.8,
    payAmount: 800,
    payUnit: 'per_job',
    startsAt: at(0, 13),
    endsAt: at(0, 17),
    distanceKm: 1.2,
    urgent: true,
  },
  {
    id: 's2',
    title: 'Laundry, 2 baskets, wash and fold',
    category: 'laundry',
    employerName: 'Reyes Family',
    employerVerified: true,
    employerRating: 4.6,
    payAmount: 450,
    payUnit: 'per_job',
    startsAt: at(0, 14),
    endsAt: at(0, 18),
    distanceKm: 0.8,
    urgent: true,
  },
  {
    id: 's3',
    title: 'Mason helper for a perimeter wall',
    category: 'construction',
    employerName: 'Dela Cruz Builders',
    employerVerified: true,
    employerRating: 4.7,
    payAmount: 650,
    payUnit: 'per_day',
    startsAt: at(1, 7),
    endsAt: at(1, 16),
    distanceKm: 2.4,
    urgent: false,
  },
  {
    id: 's4',
    title: 'Repaint a sari-sari store front',
    category: 'painting',
    employerName: 'Tindahan ni Aling Nena',
    employerVerified: false,
    employerRating: null,
    payAmount: 1200,
    payUnit: 'per_job',
    startsAt: at(1, 8),
    endsAt: at(1, 15),
    distanceKm: 3.1,
    urgent: false,
  },
  {
    id: 's5',
    title: 'School service driver, morning run',
    category: 'driving',
    employerName: 'Mactan Family Transport',
    employerVerified: true,
    employerRating: 4.9,
    payAmount: 150,
    payUnit: 'per_hour',
    startsAt: at(2, 6),
    endsAt: at(2, 8, 30),
    distanceKm: 4.0,
    urgent: false,
  },
  {
    id: 's6',
    title: 'Deep clean a 2-bedroom apartment',
    category: 'cleaning',
    employerName: 'Joy Villanueva',
    employerVerified: true,
    employerRating: 4.5,
    payAmount: 900,
    payUnit: 'per_job',
    startsAt: at(2, 9),
    endsAt: at(2, 15),
    distanceKm: 1.9,
    urgent: false,
  },
];
