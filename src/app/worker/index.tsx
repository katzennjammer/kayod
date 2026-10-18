import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { CalendarClock, FileText, Flag, MessageCircle, Search, Zap } from '@/components/icons';
import { StateView } from '@/components/StateView';
import { useTabBarClearance } from '@/components/TabBar';
import { CategoryChips } from '@/features/home/CategoryChips';
import { HomeHero } from '@/features/home/HomeHero';
import { JobList } from '@/features/home/JobList';
import { QuickActions } from '@/features/home/QuickActions';
import { Section } from '@/features/home/Section';
import { UrgentStrip } from '@/features/home/UrgentStrip';
import type { CategorySlug } from '@/features/jobs/categories';
import { SAMPLE_JOBS } from '@/features/jobs/sample';
import { colors, radius, space } from '@/theme';

// Worker home, top to bottom as the brief lists it: greeting and mascot tip,
// quick actions, categories, "Need someone today", then jobs near you.
// Uses SAMPLE_JOBS until the database feed exists (milestone 3).
export default function WorkerHome() {
  const { t } = useTranslation();
  const clearance = useTabBarClearance();
  const [category, setCategory] = useState<CategorySlug | null>(null);

  const jobs = useMemo(
    () => SAMPLE_JOBS.filter((j) => category === null || j.category === category),
    [category],
  );
  const urgent = jobs.filter((j) => j.urgent);
  const nearest = Math.min(...SAMPLE_JOBS.map((j) => j.distanceKm));

  const goJobs = () => router.navigate('/worker/jobs');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: clearance }}>
      <HomeHero mascot="female_neutral_phone" message={t('home.bannerNewJobs', { km: nearest })} />

      <View style={styles.sheet}>
        <Section title={t('home.quickTitle')}>
          <QuickActions
            actions={[
              { key: 'find', label: t('quick.findJobs'), icon: Search, onPress: goJobs },
              { key: 'apps', label: t('quick.applications'), icon: FileText },
              { key: 'schedule', label: t('quick.schedule'), icon: CalendarClock },
              { key: 'messages', label: t('quick.messages'), icon: MessageCircle, onPress: () => router.navigate('/worker/chat') },
              { key: 'report', label: t('quick.report'), icon: Flag },
            ]}
          />
        </Section>

        <Section title={t('home.categoriesTitle')}>
          <CategoryChips value={category} onChange={setCategory} />
        </Section>

        {urgent.length > 0 && (
          <Section
            title={t('home.urgentTitle')}
            subtitle={t('home.urgentBody')}
            icon={
              <View style={styles.urgentIcon}>
                <Zap color={colors.ink} fill={colors.ink} size={18} />
              </View>
            }
          >
            <UrgentStrip jobs={urgent} />
          </Section>
        )}

        <Section title={t('home.nearTitle')} action={{ label: t('home.seeAll'), onPress: goJobs }}>
          {jobs.length > 0 ? (
            <JobList jobs={jobs} />
          ) : (
            <View style={styles.emptyCard}>
              <StateView kind="empty" title={t('home.noJobsInCategory')} mascot="male_construction_shrug" />
            </View>
          )}
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  sheet: {
    marginTop: -28,
    paddingTop: space.xl,
    gap: space.xxl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
  },
  urgentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    marginHorizontal: space.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    minHeight: 280,
  },
});
