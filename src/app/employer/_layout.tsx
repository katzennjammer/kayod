import { Tabs, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ClipboardList, House, MessageCircle, UserRound } from '@/components/icons';
import { tabIcon, tabsProps } from '@/components/tabs';

export default function EmployerTabs() {
  const { t } = useTranslation();
  return (
    <Tabs
      {...tabsProps({
        label: t('quick.postJob'),
        // The post-a-job form arrives in milestone 6; until then this opens My posts.
        onPress: () => router.navigate('/employer/posts'),
      })}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="posts" options={{ title: t('tabs.posts'), tabBarIcon: tabIcon(ClipboardList) }} />
      <Tabs.Screen name="chat" options={{ title: t('tabs.chat'), tabBarIcon: tabIcon(MessageCircle) }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: tabIcon(UserRound) }} />
    </Tabs>
  );
}
