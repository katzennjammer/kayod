import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BadgeCheck, Clock, MapPin, Star } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { Mascot } from '@/components/mascot/Mascot';
import { isLanguage, type Language } from '@/i18n';
import { CATEGORY_MASCOT } from '@/features/jobs/categories';
import { dayLabel, formatMonthShort, formatPay, formatTime } from '@/features/jobs/format';
import type { JobSummary } from '@/features/jobs/types';
import { colors, radius, space } from '@/theme';

// Jobs as rows in one white card, each led by a calendar tile, so the
// question "when?" is answered at a glance.
export function JobList({ jobs }: { jobs: JobSummary[] }) {
  const { i18n } = useTranslation();
  const language = isLanguage(i18n.language) ? i18n.language : 'en';
  return (
    <View style={styles.card}>
      {jobs.map((job, i) => (
        <JobRow key={job.id} job={job} language={language} last={i === jobs.length - 1} />
      ))}
    </View>
  );
}

function JobRow({ job, language, last }: { job: JobSummary; language: Language; last: boolean }) {
  const { t } = useTranslation();
  const isToday = job.startsAt.toDateString() === new Date().toDateString();
  // The date tile already shows the day; the row only needs the hours.
  const hours = `${formatTime(job.startsAt)} - ${formatTime(job.endsAt)}`;
  const spoken = `${dayLabel(job.startsAt, t, language)}, ${hours}`;
  const [amount, unit] = splitPay(formatPay(job.payAmount, job.payUnit, t));
  const distance = t('job.km', { km: job.distanceKm });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${job.title}. ${amount}${unit}. ${spoken}. ${distance}. ${job.employerName}`}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <View style={[styles.dateTile, isToday && styles.dateTileToday]}>
        <AppText variant="small" color={isToday ? 'accentInk' : 'inkMuted'} style={styles.month}>
          {formatMonthShort(language, job.startsAt).toUpperCase()}
        </AppText>
        <AppText variant="headline" color={isToday ? 'accentInk' : 'primary'} style={styles.day}>
          {job.startsAt.getDate()}
        </AppText>
        {/* the job's category mascot, as a badge on the tile's corner */}
        <View style={styles.badge}>
          <Mascot id={CATEGORY_MASCOT[job.category]} crop="portrait" style={StyleSheet.absoluteFill} compact />
        </View>
      </View>

      <View style={styles.middle}>
        <AppText variant="cardTitle" numberOfLines={2}>
          {job.title}
        </AppText>
        <View style={styles.metaRow}>
          <Clock color={colors.inkMuted} size={14} strokeWidth={2.25} />
          <AppText variant="small" color="inkMuted" numberOfLines={1}>
            {hours}
          </AppText>
        </View>
        <View style={styles.employerRow}>
          <AppText variant="caption" color="inkMuted" numberOfLines={1} style={styles.shrink}>
            {job.employerName}
          </AppText>
          {job.employerVerified && (
            <BadgeCheck color={colors.primary} size={18} strokeWidth={2.5} accessibilityLabel={t('job.verified')} />
          )}
          {job.employerRating !== null && (
            <View style={styles.rating} accessibilityLabel={t('job.ratingA11y', { rating: job.employerRating })}>
              <Star color={colors.accent} fill={colors.accent} size={14} />
              <AppText variant="small" color="ink">
                {job.employerRating.toFixed(1)}
              </AppText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.right}>
        <AppText variant="cardTitle" color="primary">
          {amount}
        </AppText>
        <AppText variant="small" color="inkMuted">
          {unit}
        </AppText>
        <View style={styles.distance}>
          <MapPin color={colors.inkMuted} size={14} strokeWidth={2.25} />
          <AppText variant="small" color="inkMuted" numberOfLines={1}>
            {distance}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

// "₱650/day" -> ["₱650", "/day"], so the amount and unit can sit on two lines.
function splitPay(pay: string): [string, string] {
  const slash = pay.indexOf('/');
  return slash === -1 ? [pay, ''] : [pay.slice(0, slash), pay.slice(slash)];
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: space.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', gap: space.md, padding: space.lg },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  pressed: { backgroundColor: colors.background },
  dateTile: {
    width: 56,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.tintBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTileToday: { backgroundColor: colors.tintOrange },
  month: { letterSpacing: 0.6 },
  day: { lineHeight: 30 },
  middle: { flex: 1, gap: 2, marginLeft: space.xs },
  badge: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.tintOrange,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: 2 },
  employerRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  shrink: { flexShrink: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: space.xs },
  right: { alignItems: 'flex-end' },
  distance: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: space.xs },
});
