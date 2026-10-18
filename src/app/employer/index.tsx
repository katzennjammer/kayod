import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ClipboardList, Plus, Users, Wallet } from '@/components/icons';
import { Button } from '@/components/Button';
import { StateView } from '@/components/StateView';
import { useTabBarClearance } from '@/components/TabBar';
import { HomeHero } from '@/features/home/HomeHero';
import { QuickActions } from '@/features/home/QuickActions';
import { Section } from '@/features/home/Section';
import { colors, radius, space } from '@/theme';

// Employer home: greeting and mascot tip, quick actions, then their posts.
// Posting, applicants and the payment record arrive in milestone 6.
export default function EmployerHome() {
  const { t } = useTranslation();
  const clearance = useTabBarClearance();
  const goPosts = () => router.navigate('/employer/posts');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: clearance }}>
      <HomeHero mascot="male_construction_phone" message={t('home.employerBanner')} />

      <View style={styles.sheet}>
        <Section title={t('home.quickTitle')}>
          <QuickActions
            actions={[
              { key: 'post', label: t('quick.postJob'), icon: Plus, onPress: goPosts },
              { key: 'posts', label: t('quick.myPosts'), icon: ClipboardList, onPress: goPosts },
              { key: 'applicants', label: t('quick.applicants'), icon: Users },
              { key: 'payments', label: t('quick.paymentRecord'), icon: Wallet },
            ]}
          />
        </Section>

        <Section title={t('home.employerPostsTitle')}>
          <View style={styles.emptyCard}>
            <StateView
              kind="empty"
              title={t('home.employerEmptyTitle')}
              body={t('home.employerEmptyBody')}
              mascot="male_construction_thinking"
            />
            <Button label={t('quick.postJob')} icon={Plus} variant="accent" onPress={goPosts} />
          </View>
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
  emptyCard: {
    marginHorizontal: space.xl,
    padding: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    minHeight: 340,
  },
});
