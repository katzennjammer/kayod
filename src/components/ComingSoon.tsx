import { useTranslation } from 'react-i18next';

import { Screen } from './Screen';
import { StateView } from './StateView';

// Stand-in for tabs whose milestone has not been built yet.
export function ComingSoon() {
  const { t } = useTranslation();
  return (
    <Screen edges={['top']}>
      <StateView kind="empty" title={t('states.comingSoonTitle')} body={t('states.comingSoonBody')} />
    </Screen>
  );
}
