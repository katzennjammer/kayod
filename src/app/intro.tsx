import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ArrowLeft, ArrowRight } from '@/components/icons';
import { AppText } from '@/components/AppText';
import { Button, IconButton } from '@/components/Button';
import { SLIDES } from '@/features/onboarding/slides';
import { SlideView } from '@/features/onboarding/SlideView';
import { usePrefs } from '@/lib/prefs';
import { TAP_MIN, colors, radius, space } from '@/theme';

const CONTROLS_HEIGHT = 60;
const LAST = SLIDES.length - 1;

// The five intro slides. Opened with ?replay=1 from Settings, it just closes
// at the end instead of moving on to role selection.
export default function IntroScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  // Measured rather than read from the window, so each slide is exactly as
  // tall as the space the app really gets (it differs between phones).
  const [height, setHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const { replay } = useLocalSearchParams<{ replay?: string }>();
  const { setOnboardingDone } = usePrefs();
  const list = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    list.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  }, []);

  const finish = useCallback(() => {
    if (replay) {
      router.back();
      return;
    }
    setOnboardingDone();
    router.replace('/role');
  }, [replay, setOnboardingDone]);

  // Android back button steps back through the slides before leaving.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (index === 0) return false;
      goTo(index - 1);
      return true;
    });
    return () => sub.remove();
  }, [index, goTo]);

  const onSwipeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const bottomSpace = CONTROLS_HEIGHT + space.xl + Math.max(insets.bottom, space.lg);

  return (
    <View style={styles.fill} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      <FlatList
        ref={list}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onSwipeEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        initialNumToRender={2}
        windowSize={3}
        renderItem={({ item, index: i }) => (
          <SlideView
            slide={item}
            width={width}
            height={height}
            active={i === index}
            topInset={insets.top}
            bottomSpace={bottomSpace}
          />
        )}
      />

      {index < LAST && (
        <Pressable
          onPress={finish}
          accessibilityRole="button"
          style={[styles.skip, { top: insets.top + space.md }]}
          hitSlop={8}
        >
          <AppText variant="label" color="primary">
            {t('common.skip')}
          </AppText>
        </Pressable>
      )}

      <View style={[styles.controls, { bottom: Math.max(insets.bottom, space.lg) + space.md }]}>
        {index === LAST ? (
          <Button label={t('onboarding.getStarted')} variant="accent" onPress={finish} style={styles.full} />
        ) : (
          <>
            {index === 0 ? (
              <Dots index={index} />
            ) : (
              <IconButton icon={ArrowLeft} label={t('common.back')} variant="secondary" onPress={() => goTo(index - 1)} />
            )}
            {index > 0 && <Dots index={index} />}
            <IconButton icon={ArrowRight} label={t('common.next')} onPress={() => goTo(index + 1)} />
          </>
        )}
      </View>
    </View>
  );
}

function Dots({ index }: { index: number }) {
  const { t } = useTranslation();
  return (
    <View
      style={styles.dots}
      accessible
      accessibilityLabel={t('onboarding.slideOf', { current: index + 1, total: SLIDES.length })}
    >
      {SLIDES.map((s, i) => (
        <View key={s.key} style={[styles.dot, i === index && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.white },
  skip: {
    position: 'absolute',
    right: space.lg,
    minHeight: TAP_MIN,
    minWidth: TAP_MIN,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    left: space.xl,
    right: space.xl,
    height: CONTROLS_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  full: { flex: 1 },
  dots: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: radius.pill, backgroundColor: colors.primary, opacity: 0.25 },
  dotActive: { width: 28, opacity: 1 },
});
