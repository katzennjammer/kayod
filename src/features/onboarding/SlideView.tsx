import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Mascot } from '@/components/mascot/Mascot';
import { colors, space } from '@/theme';
import { MascotEntrance } from './MascotEntrance';
import type { Slide, SlideArt } from './slides';

type Props = {
  slide: Slide;
  width: number;
  height: number;
  active: boolean;
  topInset: number;
  bottomSpace: number; // room left for the controls drawn over the slide
};

export function SlideView({ slide, width, height, active, topInset, bottomSpace }: Props) {
  const { t } = useTranslation();
  return (
    <View style={[styles.page, { width, height, backgroundColor: colors[slide.background] }]}>
      <View style={[styles.text, { paddingTop: topInset + 72 }]}>
        <AppText variant="display" color="primary" accessibilityRole="header">
          {t(`onboarding.${slide.key}.title`)}
        </AppText>
        <AppText variant="bodyLarge" color="inkMuted">
          {t(`onboarding.${slide.key}.subtitle`)}
        </AppText>
      </View>

      <View style={[styles.artArea, { marginBottom: bottomSpace }]}>
        <View
          style={[
            styles.shape,
            { width: width * 0.8, height: width * 0.8, backgroundColor: colors[slide.shape] },
          ]}
        />
        <MascotEntrance active={active}>
          <Art art={slide.art} />
        </MascotEntrance>
      </View>
    </View>
  );
}

function Art({ art }: { art: SlideArt }) {
  switch (art.kind) {
    case 'single':
      return <Mascot id={art.id} style={styles.single} />;
    case 'pair':
      return (
        <View style={styles.pair}>
          {art.ids.map((id) => (
            <Mascot key={id} id={id} style={styles.half} />
          ))}
        </View>
      );
    case 'grid':
      return (
        <View style={styles.grid}>
          {art.ids.map((id) => (
            <Mascot key={id} id={id} style={styles.tile} compact />
          ))}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  page: { overflow: 'hidden' },
  text: { paddingHorizontal: space.xl, gap: space.md },
  artArea: {
    flex: 1,
    marginTop: space.xl,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shape: { position: 'absolute', borderRadius: 9999 },
  single: { flex: 1, alignSelf: 'center', width: '85%' },
  pair: { flex: 1, flexDirection: 'row', gap: space.md },
  half: { flex: 1 },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    gap: space.md,
  },
  tile: { width: '30%', aspectRatio: 1 },
});
