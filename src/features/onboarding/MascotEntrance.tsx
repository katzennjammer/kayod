import { useEffect, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = { active: boolean; children: ReactNode };

const RISE = 18; // how far the art slides up when its slide opens (dp)
const BOB = 5; // idle bob height (dp)

// When a slide becomes the current one, its art slides up into place and then
// bobs gently. Only the current slide animates, so the phone does very little
// work. If the phone's "remove animations" setting is on, nothing moves.
export function MascotEntrance({ active, children }: Props) {
  const reduceMotion = useReducedMotion();
  const y = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || !active) {
      cancelAnimation(y);
      y.value = 0;
      return;
    }
    y.value = RISE;
    y.value = withSequence(
      withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) }),
      withRepeat(
        withSequence(
          withTiming(-BOB, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(y);
  }, [active, reduceMotion, y]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return <Animated.View style={[styles.fill, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignSelf: 'stretch' },
});
