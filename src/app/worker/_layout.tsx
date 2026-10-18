import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { BriefcaseBusiness, House, MessageCircle, UserRound } from '@/components/icons';
import { tabIcon, tabsProps } from '@/components/tabs';

export default function WorkerTabs() {
  const { t } = useTranslation();
  return (
    <Tabs {...tabsProps()}>
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="jobs" options={{ title: t('tabs.jobs'), tabBarIcon: tabIcon(BriefcaseBusiness) }} />
      <Tabs.Screen name="chat" options={{ title: t('tabs.chat'), tabBarIcon: tabIcon(MessageCircle) }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: tabIcon(UserRound) }} />
    </Tabs>
  );
}
