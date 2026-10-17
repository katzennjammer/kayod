# Kayod database: schema and security draft

**Status: DRAFT, for review.** Nothing here is built yet. Once you approve it
(or tell me what to change) it becomes SQL migrations in `supabase/migrations/`
plus automated tests in `supabase/tests/`.

Decisions you need to make are marked **DECIDE**. Each one has my
recommendation.

---

## 1. Big ideas (read this part first)

**Row Level Security (RLS) on every table.** Postgres itself checks every
read and write against the signed-in user. This holds even if someone skips
our app and calls the database directly with the public key. The app's UI
never decides who can see what. The database does.

**Public and private data live in different tables.** RLS works per *row*,
not per *column*. If a table holds both a public value (name) and a private
one (phone, exact address), anyone allowed to read the row reads both. So
the private parts go in separate tables with stricter rules:

| Public (guests and other users can see) | Private (only the owner, plus the other side after a job is accepted) |
| --- | --- |
| `profiles`: name, photo, language | `profile_private`: phone and exact home location |
| `jobs`: title, pay, time window, **approximate** location (barangay + point rounded to about 500 m) | `job_private`: exact address, landmark notes |

**Users cannot edit numbers about themselves.** Columns such as
`reliability_score`, rating averages and the employer payment record have no
update permission at all (column-level grants). Only server code changes them.

**State changes go through server functions, not direct updates.** Examples:
accept an application, enter the start code, "I paid", "I got paid". A
function checks the rules (e.g. "only the job's employer can accept", "pay
terms lock on accept") and makes the change in one step. The app calls it
with `supabase.rpc('accept_application', ...)`.

> **DECIDE 1: Postgres functions or Edge Functions for state changes?**
> The brief says Edge Functions. I recommend **Postgres functions (RPC)** for
> state changes: they run inside the database transaction, so an accept can
> never half-happen, and they are easier for a student team to test. Use
> **Edge Functions** for anything that needs a secret key or an outside
> service: push notifications, SMS, and later payments.

---

## 2. Tables

Types: `uuid` ids, `timestamptz` times (stored in UTC, shown in Philippine
time), money as `numeric(10,2)` in pesos, locations as PostGIS
`geography(Point)`.

### Accounts

**`profiles`**: one row per user, created automatically at sign-up
| column | notes |
| --- | --- |
| `id` | = `auth.users.id` |
| `display_name` | name or nickname shown to others |
| `photo_path` | in the public `avatars` storage bucket |
| `language` | `en` / `tl` / `ceb` |
| `active_role` | `worker` / `employer` (switchable) |
| `mascot_choice` | `female` / `male` / `alternate` |
| `created_at`, `deleted_at` | |

The phone number is **not** copied here. Supabase Auth already stores it in
`auth.users`, which the app cannot read. It is revealed only through the
`get_contact()` function (section 4).

**`profile_private`**: `user_id`, `home_location` (exact), `barangay`, `city`.
Only the owner can read it.

**`worker_profiles`**: `user_id`, `bio`, `years_experience`, `barangay`,
`approx_location` (rounded), `reliability_score`*, `jobs_completed`*,
`rating_avg`*, `rating_count`*

**`employer_profiles`**: `user_id`, `business_name` (nullable for
households), `employer_type` (`household` / `business` / `contractor`),
`verification_status`* (`unverified` / `pending` / `approved` / `rejected`),
`paid_count`*, `unpaid_reports`*, `rating_avg`*, `rating_count`*

`*` = computed by the server. Users cannot write these columns.

**`admin_users`**: `user_id`, `role` (`admin` / `lgu_viewer`). Admin access
also requires two-step login. Policies check the login level
(`auth.jwt()->>'aal' = 'aal2'`), so a stolen password alone is not enough.

### Skills and schedule

**`categories`**: `id`, `slug` (`construction`, `painting`, `driving`,
`laundry`, `errands`, `cleaning`), `sort_order`, `typical_pay_min`,
`typical_pay_max` (for the "pay is far below usual" warning). Labels come
from the app's translation files, keyed by `slug`.

**`worker_skills`**: `worker_id`, `category_id`, `years_experience`

**`availability`**: `worker_id`, `day_of_week` (0-6), `start_time`,
`end_time`. Several rows per day are allowed, e.g. 07:00-11:00 and 14:00-15:30
around school pickup.

**`work_photos`**: `worker_id`, `photo_path`, `caption`, `category_id`
(photos of past work, public)

### Jobs

**`jobs`**
| column | notes |
| --- | --- |
| `employer_id`, `category_id`, `title`, `description` | |
| `pay_amount`, `pay_unit` | unit: `per_job` / `per_day` / `per_hour` |
| `pay_timing` | `same_day` / `on_completion` / `end_of_week` |
| `pay_methods` | any of `cash` / `gcash` / `maya` / `bank` |
| `cancellation_terms` | text shown before applying (e.g. transport refund) |
| `starts_at`, `ends_at` | the time window |
| `workers_needed` | |
| `urgent` | "Need someone today" |
| `barangay`, `approx_location` | public, rounded |
| `status` | `open` / `filled` / `in_progress` / `completed` / `cancelled` / `removed` |
| `moderation` | `live` / `flagged` / `removed` |

**`job_private`**: `job_id`, `exact_location`, `address_notes`

**`job_photos`**: `job_id`, `photo_path`, `kind` (`listing` / `before` / `after`)

> **DECIDE 2: review job posts before or after they go live?**
> Recommend **after** (post-moderation): posts go live at once, and anything
> flagged by our checks (very low pay, blocked words, a new employer's first
> post) is held for admin review. "Need someone today" jobs cannot wait hours
> for an admin.

> **DECIDE 3: must employers be verified before posting?**
> The brief says yes. For the first pilot weeks you may want employers to
> post while their ID is reviewed. Recommend: **yes, verified before
> posting**, with an admin switch to allow "pending" employers during the
> pilot if sign-ups stall.

### Applying and working

**`applications`**: `job_id`, `worker_id`, `message`, `status` (`pending` /
`accepted` / `declined` / `withdrawn`), unique per (job, worker)

**`job_assignments`**: created when an application is accepted
| column | notes |
| --- | --- |
| `job_id`, `worker_id`, `application_id` | |
| `agreed_pay_amount`, `agreed_pay_unit`, `agreed_pay_timing`, `agreed_pay_methods`, `agreed_cancellation_terms` | **copied from the job at accept time**, so pay terms are locked even if the post is edited later |
| `status` | `accepted` / `in_progress` / `completed` / `cancelled` / `no_show` |
| `arrived_at`, `arrived_location` | worker's "I've arrived" (a backup signal, not proof) |
| `employer_confirmed_arrival_at` | "Worker is here" |
| `started_at`, `started_at_device` | server time, and the phone's time if it was entered offline |
| `completed_at` | |
| `cancelled_by`, `cancel_stage`, `cancel_reason` | stage: `before_travel` / `after_travel` / `after_start` |

**`start_codes`**: `assignment_id`, `code` (4 digits), `attempts`,
`expires_at`. **Only the employer can read it.** The worker never reads the
table; they submit the code to `start_job()`, which locks after 5 wrong tries.

**`payment_confirmations`**: `assignment_id`, `employer_paid_at`,
`worker_received_at`, `reported_unpaid_at`, `unpaid_note`

**`ratings`**: `assignment_id`, `from_user`, `to_user`, `score` (1-5),
`comment`. One per direction per assignment, allowed only after completion.

### Messages

**`conversations`**: `job_id`, `employer_id`, `worker_id`. One per job per
worker, created on apply.

**`messages`**: `conversation_id`, `sender_id`, `body`, `created_at`.
Supabase Realtime pushes new rows to the app and **also obeys RLS**, so
nobody can listen to other people's chats.

### Trust and safety

**`reports`**: `reporter_id`, `target_type` (`user` / `job` / `message`),
`target_id`, `reason` (`non_payment` / `safety` / `scam` / `fake_job` /
`harassment` / `other`), `details`, `status`, `reviewed_by`

**`blocks`**: `blocker_id`, `blocked_id`

**`verifications`**: `user_id`, `type` (`government_id` / `business_permit` /
`barangay_endorsement` / `barangay_clearance`), `file_path` (private
bucket), `status`, `reviewed_by`, `reviewed_at`, `delete_file_after`

**`notifications`**: `user_id`, `type`, `data` (json), `read_at`

**`announcements`** (later, LGU): `title`, `body`, `published_by`, `published_at`

---

## 3. Who can do what (RLS policies)

"Guest" = not signed in (`anon`). "Parties" = the employer and the assigned
worker of an accepted job.

| Table | Read | Create | Change |
| --- | --- | --- | --- |
| `profiles` | everyone (public fields only live here) | automatic at sign-up | self, only name/photo/language/role/mascot |
| `profile_private` | self | self | self |
| `worker_profiles` | everyone | self | self, only bio/years/barangay/location; never the computed scores |
| `employer_profiles` | everyone | self | self, only name/type; never verification or record |
| `categories` | everyone | admin | admin |
| `worker_skills`, `availability`, `work_photos` | signed-in users | self | self |
| `jobs` | everyone sees `live` jobs that are open/filled; employer sees all their own; admin sees all | verified employer, for themselves | employer edits own job while no one is accepted; status via functions |
| `job_private` | the employer, and workers with an accepted assignment on that job | employer | employer |
| `job_photos` (listing) | same as the job | employer | employer |
| `job_photos` (before/after) | parties | assigned worker | assigned worker |
| `applications` | the worker who applied; the job's employer | a signed-in worker, for an open job, not blocked by the employer | worker can withdraw; accept/decline only via function |
| `job_assignments` | parties | only via `accept_application()` | only via functions |
| `start_codes` | the job's employer only | via function | via function |
| `payment_confirmations` | parties; admin | via function | via functions |
| `ratings` | everyone (scores and comments) | a party, after completion, once | nobody (no edits) |
| `conversations`, `messages` | the two participants | a participant, unless either side blocked the other | nobody |
| `reports` | own reports; admin | any signed-in user | admin only |
| `blocks` | own | self | self (delete = unblock) |
| `verifications` | own; admin | self | admin only (review) |
| `notifications` | own | server only | own (mark read) |
| `admin_users` | admin | none from the app | none from the app |

Admin rights always require a two-step login (`aal2`).

### Storage buckets

| Bucket | Public? | Who can upload | Who can read |
| --- | --- | --- | --- |
| `avatars` | public | owner, into their own folder | anyone |
| `work-photos` | public | owner | anyone |
| `job-photos` | **private** | employer / assigned worker | via signed URL from a function that checks the job rules above |
| `verifications` | **private** | owner, into `<their id>/` | owner and admin, via short-lived signed URLs only. Files are deleted after review (DECIDE 6). |

---

## 4. Server functions (first set)

| Function | What it checks and does |
| --- | --- |
| `jobs_near(lat, lng, radius_km, category?, fits_my_schedule?)` | Feed query. Returns open live jobs with distance rounded to 0.5 km. Works for guests. `fits_my_schedule` compares the job window with the caller's `availability`. |
| `apply_to_job(job_id, message)` | Job is open, caller is not the employer, not blocked. Creates the application + conversation. |
| `accept_application(application_id)` | Caller owns the job and the job still has open slots. Creates the assignment, **copies the pay terms**, makes the start code, and marks the job filled when full. |
| `decline_application(application_id)` | Caller owns the job. |
| `mark_arrived(assignment_id, lat, lng)` | Caller is the assigned worker. |
| `start_job(assignment_id, code, device_time)` | Caller is the assigned worker, the code matches, fewer than 5 attempts. Sets `in_progress`. |
| `complete_job(assignment_id)` | Caller is the employer. |
| `confirm_paid(assignment_id)` / `confirm_received(assignment_id)` / `report_unpaid(assignment_id, note)` | Caller is the matching party. `report_unpaid` adds to the employer's record and opens a report for admin. |
| `rate(assignment_id, score, comment)` | Caller is a party, job completed, not yet rated. |
| `cancel_assignment(assignment_id, reason)` | Records who cancelled and at what stage. A worker no-show lowers reliability. |
| `get_contact(assignment_id)` | Returns the other party's phone only while an assignment is accepted or in progress. |

A trigger after `ratings` and `payment_confirmations` recomputes the averages,
the payment record and the reliability score.

---

## 5. Tests that must pass ("RLS tests")

Written with pgTAP and run with `supabase test db`. Each test signs in as a
specific test user and tries something it should not be able to do:

- A guest reads open jobs: allowed. A guest reads `job_private`, `profile_private`, applications or messages: gets nothing.
- Worker A reads worker B's applications, `profile_private` or `availability` (as a guest): gets nothing.
- Employer X reads applications to employer Y's job: gets nothing.
- A worker who was not accepted reads the job's exact address: gets nothing. The accepted worker can read it.
- The worker reads `start_codes`: gets nothing, even for their own job.
- A worker updates their own `reliability_score` or `rating_avg`: refused.
- An employer sets their own `verification_status = 'approved'`: refused.
- An unverified employer inserts a job: refused.
- A blocked user sends a message to the person who blocked them: refused.
- A third person reads a conversation they are not in: gets nothing. The same holds for Realtime.
- `accept_application` called by someone other than the job's employer: refused.
- `start_job` with the wrong code 5 times, then the right code: still refused.
- An admin without a two-step login reads `verifications`: refused.
- A user downloads another user's file from the `verifications` bucket: refused.

---

## 6. Other decisions and risks

> **DECIDE 4: offline start code.** The brief says the start code must work
> with weak signal. The code can only be *checked* when the phone is back
> online. Proposal: the worker's phone saves the code and the phone's time,
> the app shows "Started, will confirm when online", and `start_job()`
> records both the phone's time and the server's time when it syncs. A wrong
> code found at sync time un-starts the job and notifies both sides.

> **DECIDE 5: minimum age.** Philippine law limits work by minors, and some
> jobs here (construction, driving) are hazardous. Recommend requiring users
> to confirm they are **18 or older** at sign-up. Please confirm this with
> whoever checks the DOLE question.

> **DECIDE 6: how long to keep ID files.** The Data Privacy Act says to keep
> only what you need. Recommend deleting ID images **30 days after the review
> decision**, keeping only the result (approved/rejected, who, when).

> **DECIDE 7: account deletion.** When someone deletes their account, their
> profile, photos, availability and messages are deleted. Ratings they
> *gave* stay but show "Former user". An employer's unpaid reports stay on
> record (anonymized) so deletion cannot be used to wipe a bad payment
> history. This needs a privacy-policy line; check with whoever reviews it.

- **Phone OTP cost:** for development I'll use email OTP (free). Check SMS
  pricing for Philippine numbers before the pilot: Supabase's built-in Twilio
  or Vonage, or a local provider through the Supabase "Send SMS" hook.
  Supabase's own OTP rate limits apply. We should also lower them in project
  settings.
- **"Pay far below usual" warning** uses `categories.typical_pay_min`. Someone
  local needs to supply realistic Lapu-Lapu rates per category.
- **Distance** uses PostGIS (built into Supabase, free). No maps API is
  needed for the feed.
