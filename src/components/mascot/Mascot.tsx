import { StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { ImageOff } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { colors, radius, space } from '@/theme';
import { MASCOTS, type MascotId } from './registry';

type Props = {
  id: MascotId;
  style?: StyleProp<ViewStyle>;
  // Small crops (chips, card thumbnails) hide the placeholder's text.
  compact?: boolean;
};

// Mascots are decoration next to text that already says the same thing, so
// they are hidden from screen readers.
export function Mascot({ id, style, compact = false }: Props) {
  const source: ImageSourcePropType | null = MASCOTS[id];

  if (source) {
    return (
      <View style={style} accessible={false} importantForAccessibility="no-hide-descendants">
        <Image source={source} style={StyleSheet.absoluteFill} contentFit="contain" />
      </View>
    );
  }
  return <Placeholder id={id} style={style} compact={compact} />;
}

function Placeholder({ id, style, compact }: Props) {
  const { t } = useTranslation();
  return (
    <View
      style={[styles.placeholder, style]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <ImageOff color={colors.inkMuted} size={compact ? 20 : 32} strokeWidth={2.25} />
      {!compact && (
        <>
          <AppText variant="label" color="inkMuted" style={styles.center}>
            {t('mascot.placeholder')}
          </AppText>
          {/* The file name is a developer hint, not UI copy, so it is not translated. */}
          <AppText variant="caption" color="inkMuted" style={styles.center} numberOfLines={2}>
            {`${id}.png`}
          </AppText>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.placeholder,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    padding: space.md,
  },
  center: { textAlign: 'center' },
});
