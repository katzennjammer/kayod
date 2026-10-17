import { Pressable, StyleSheet, View } from 'react-native';

import { Check } from '@/components/icons';
import { AppText } from './AppText';
import { LANGUAGES, LANGUAGE_NAMES, type Language } from '@/i18n';
import { colors, radius, space } from '@/theme';

type Props = {
  value: Language;
  onChange: (language: Language) => void;
};

// The three languages as big tappable rows. Used on first launch and in Settings.
export function LanguageOptions({ value, onChange }: Props) {
  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {LANGUAGES.map((lang) => {
        const selected = lang === value;
        return (
          <Pressable
            key={lang}
            onPress={() => onChange(lang)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={({ pressed }) => [
              styles.row,
              selected && styles.selected,
              pressed && !selected && styles.pressed,
            ]}
          >
            <AppText variant="title" color={selected ? 'white' : 'ink'}>
              {LANGUAGE_NAMES[lang]}
            </AppText>
            {selected && <Check color={colors.white} size={26} strokeWidth={3} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.md },
  row: {
    minHeight: 68,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selected: { backgroundColor: colors.primary },
  pressed: { backgroundColor: colors.tintBlue },
});
