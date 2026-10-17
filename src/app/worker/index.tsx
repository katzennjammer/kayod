import { useTranslation } from 'react-i18next';

import { HomeHeader } from '@/components/HomeHeader';
import { Screen } from '@/components/Screen';
import { StateView } from '@/components/StateView';

// Worker home. The real feed (banner, quick actions, categories, job cards)
// arrives in milestones 3 and 5; for now it shows the empty state.
export default function WorkerHome() {
  const { t } = useTranslation();
  return (
    <Screen edges={['top']}>
      <HomeHeader />
      <StateView
        kind="empty"
        title={t('home.workerEmptyTitle')}
        body={t('home.workerEmptyBody')}
        mascot="female_neutral_phone"
      />
    </Screen>
  );
}
