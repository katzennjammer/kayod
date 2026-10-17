import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ClipboardList, House, MessageCircle, UserRound } from '@/components/icons';
import { tabIcon, useTabScreenOptions } from '@/components/tabs';

export default function EmployerTabs() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={useTabScreenOptions()}>
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="posts" options={{ title: t('tabs.posts'), tabBarIcon: tabIcon(ClipboardList) }} />
      <Tabs.Screen name="chat" options={{ title: t('tabs.chat'), tabBarIcon: tabIcon(MessageCircle) }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: tabIcon(UserRound) }} />
    </Tabs>
  );
}
