import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Mascot } from '@/components/mascot/Mascot';
import { CATEGORY_MASCOT, CATEGORY_SLUGS, type CategorySlug } from '@/features/jobs/categories';
import { colors, radius, space } from '@/theme';

type Props = {
  value: CategorySlug | null; // null = all
  onChange: (value: CategorySlug | null) => void;
};

// Category filter: each chip shows that job's mascot (head and shoulders)
// beside its name. Tapping a selected chip clears the filter.
export function CategoryChips({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Chip label={t('home.allCategories')} selected={value === null} onPress={() => onChange(null)} />
      {CATEGORY_SLUGS.map((slug) => (
        <Chip
          key={slug}
          label={t(`categories.${slug}`)}
          slug={slug}
          selected={value === slug}
          onPress={() => onChange(value === slug ? null : slug)}
        />
      ))}
    </ScrollView>
  );
}

type ChipProps = { label: string; slug?: CategorySlug; selected: boolean; onPress: () => void };

function Chip({ label, slug, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected, !slug && styles.chipTextOnly]}
    >
      {slug && (
        <View style={styles.avatar}>
          <Mascot id={CATEGORY_MASCOT[slug]} crop="portrait" style={StyleSheet.absoluteFill} compact />
        </View>
      )}
      <AppText variant="label" color={selected ? 'white' : 'ink'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.xl, gap: space.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: 52,
    paddingLeft: 6,
    paddingRight: space.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipTextOnly: { paddingLeft: space.lg },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.tintOrange,
  },
});
