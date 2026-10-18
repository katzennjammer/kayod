# Translation review

`en.json` is the source. `tl.json` and `ceb.json` are drafts written without a
native speaker and **must be reviewed before launch**. Every string needs a
check; the ones below are the ones I am least sure about.

| Key | Language | Draft | Concern |
| --- | --- | --- | --- |
| `onboarding.slide3.subtitle` | tl | pagpapabili | "Errands" has no clean single word. Alternatives: "pag-uutos", "pamamalengke". |
| `onboarding.slide3.subtitle` | ceb | pagpamalit | Means "shopping/buying". "Errands" might be better as "sugo-sugo" or kept in English. |
| `onboarding.slide3.title` | tl | Anumang Galing | "Galing" (talent) vs "Kakayahan" (ability). |
| `onboarding.slide3.title` | ceb | Kahanas | Is "kahanas" natural in Lapu-Lapu, or is "skill" more common? |
| `onboarding.slide2.title` | ceb | Mohaum | Check that "mohaum" reads naturally for "fits". |
| `role.employerBody` | ceb | mamumuo | "Mamumuo" (worker) may sound formal; "trabahante" is common in Cebu. |
| `settings.roleWorker` | ceb | Mamumuo | Same as above. |
| `onboarding.slide5.subtitle` | ceb | Apil | Check tone; "Apil na" may sound friendlier. |
| `onboarding.getStarted` | tl, ceb | Tara, simulan na natin / Sugdan na nato | Check that it fits on one button line. |
| `onboarding.slideOf` | tl, ceb | Slide ... sa ... | Screen-reader text only. |

English loan words kept on purpose (common in everyday Filipino phone use):
Settings, Home, Chat, Profile, post, apply, employer, rating. Change any of
them if the reviewer prefers a local word.

The tagline "Kayod Para Sa Pamilya" is kept identical in all three languages.

## Added with the home screen redesign

| Key | Language | Draft | Concern |
| --- | --- | --- | --- |
| `home.quickTitle` | tl, ceb | Mga shortcut | Loan word on purpose; "Mabilisang gawain" is the formal option. |
| `quick.applications` | tl, ceb | Mga in-applyan ko / Akong mga gi-applyan | Check the Taglish/Bislish verb forms read naturally. |
| `home.urgentTitle` | ceb | Kinahanglan karong adlawa | Check tone for a section heading. |
| `categories.errands` | tl, ceb | Pagpapabili / Pagpamalit | Same concern as slide 3. |
| `job.perJob` | tl, ceb | /trabaho | Shown after a price, e.g. "₱800/trabaho". Maybe "/buo" or keep English "/job". |
| `home.greeting*` | all | Good morning / Magandang umaga / Maayong buntag | Changes by time of day. |
