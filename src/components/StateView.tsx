import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { RotateCcw } from '@/components/icons';
import { AppText } from './AppText';
import { Button } from './Button';
import { Mascot } from './mascot/Mascot';
import type { MascotId } from './mascot/registry';
import { colors, space } from '@/theme';

// The one component for loading, empty and error states, so every screen
// gets them the same way. Poses follow the brief: thinking while loading,
// shrugging when something is empty or wrong.
type Props =
  | { kind: 'loading'; title?: string }
  | { kind: 'empty'; title: string; body?: string; mascot?: MascotId }
  | { kind: 'error'; title?: string; body?: string; onRetry?: () => void };

export function StateView(props: Props) {
  const { t } = useTranslation();

  if (props.kind === 'loading') {
    return (
      <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel={props.title ?? t('states.loading')}>
        <Mascot id="male_construction_thinking" style={styles.mascot} compact />
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText variant="bodyStrong" color="inkMuted">
          {props.title ?? t('states.loading')}
        </AppText>
      </View>
    );
  }

  const isError = props.kind === 'error';
  const title = props.title ?? t('states.errorTitle');
  const body = isError ? (props.body ?? t('states.errorBody')) : props.body;
  const mascot = !isError && props.mascot ? props.mascot : 'female_neutral_shrug';

  return (
    <View style={styles.wrap} accessibilityLiveRegion={isError ? 'polite' : 'none'}>
      <Mascot id={mascot} style={styles.mascot} compact />
      <AppText variant="title" style={styles.center}>
        {title}
      </AppText>
      {body && (
        <AppText color="inkMuted" style={styles.center}>
          {body}
        </AppText>
      )}
      {isError && props.onRetry && (
        <Button label={t('common.retry')} icon={RotateCcw} variant="secondary" onPress={props.onRetry} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.xl },
  mascot: { width: 140, height: 140 },
  center: { textAlign: 'center' },
});
