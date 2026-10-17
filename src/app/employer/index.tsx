import { useTranslation } from 'react-i18next';

import { HomeHeader } from '@/components/HomeHeader';
import { Screen } from '@/components/Screen';
import { StateView } from '@/components/StateView';

// Employer home. Banner, quick actions and posts arrive in milestone 6.
export default function EmployerHome() {
  const { t } = useTranslation();
  return (
    <Screen edges={['top']}>
      <HomeHeader />
      <StateView
        kind="empty"
        title={t('home.employerEmptyTitle')}
        body={t('home.employerEmptyBody')}
        mascot="male_construction_phone"
      />
    </Screen>
  );
}
