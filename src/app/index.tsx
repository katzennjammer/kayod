import { Redirect } from 'expo-router';

import { usePrefs } from '@/lib/prefs';

// Where the app opens. Each first-launch step only appears until it is done:
// language -> intro slides -> role -> the worker or employer tabs.
// The steps themselves move forward with router.replace(), so this screen
// only decides where a cold start lands.
export default function Index() {
  const { language, onboardingDone, role } = usePrefs();

  if (!language) return <Redirect href="/language" />;
  if (!onboardingDone) return <Redirect href="/intro" />;
  if (!role) return <Redirect href="/role" />;
  return <Redirect href={role === 'worker' ? '/worker' : '/employer'} />;
}
