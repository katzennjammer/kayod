import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MapPin } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { Mascot } from '@/components/mascot/Mascot';
import { CATEGORY_MASCOT } from '@/features/jobs/categories';
import { formatPay, formatTime } from '@/features/jobs/format';
import type { JobSummary } from '@/features/jobs/types';
import { colors, radius, space } from '@/theme';

// "Need someone today": horizontally scrolling cards for urgent jobs.
export function UrgentStrip({ jobs }: { jobs: JobSummary[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {jobs.map((job) => (
        <UrgentCard key={job.id} job={job} />
      ))}
    </ScrollView>
  );
}

function UrgentCard({ job }: { job: JobSummary }) {
  const { t } = useTranslation();
  const pay = formatPay(job.payAmount, job.payUnit, t);
  const starts = t('job.startsAt', { time: formatTime(job.startsAt) });
  const distance = t('job.km', { km: job.distanceKm });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${job.title}. ${pay}. ${starts}. ${distance}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.pill}>
          <AppText variant="small" color="accentInk">
            {starts}
          </AppText>
        </View>
        <View style={styles.avatar}>
          <Mascot id={CATEGORY_MASCOT[job.category]} crop="portrait" style={StyleSheet.absoluteFill} compact />
        </View>
      </View>
      <AppText variant="cardTitle" numberOfLines={2} style={styles.title}>
        {job.title}
      </AppText>
      <View style={styles.bottom}>
        <AppText variant="title" color="primary">
          {pay}
        </AppText>
        <View style={styles.distance}>
          <MapPin color={colors.inkMuted} size={16} strokeWidth={2.25} />
          <AppText variant="caption" color="inkMuted">
            {distance}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.xl, gap: space.md },
  card: {
    width: 264,
    borderRadius: radius.lg,
    backgroundColor: colors.tintOrange,
    padding: space.lg,
    gap: space.sm,
  },
  pressed: { opacity: 0.85 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: colors.shapeOrange,
  },
  title: { minHeight: 48 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  distance: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
