// Layout plan. Job: Welcome's one orchestrated moment, "Dawn over the week" (REDESIGN-PROMPT §4.1, concept A). Focal element: the wordmark
// above it; this is its ground. A thin light line is the horizon; the seven days of a real sample week (from the fixtures' calendar)
// rest on it as plan glyphs in their colours at low opacity, rising up through it; a faint sage glow rises from the horizon ("first
// light"). No photos, no people.
// The sequence: the glyphs rise one by one, left to right, like a sunrise over the week (Welcome.tsx drives one progress value, 0 to 1,
// in 1100 ms, once per launch; tap to skip). Under Reduce Motion the end state shows, static.
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { opacity, space, type PlanId } from '@tokens';
import { PlanGlyph, useFontScale, useTheme } from '@ui';

const GLOW_HEIGHT = space.xxxl * 3; // the first-light glow above the horizon
const RISE = space.md; // each glyph rises this far into place
const STAGGER = 0.09; // of the whole sequence, between one day and the next
const WINDOW = 0.35; // of the whole sequence, for one day to rise
const SMALL_FROM_SCALE = 2; // seven glyphs fit 390 pt only at the small size from 2x text (as on the Week strip)

function RisingGlyph({ plan, index, progress }: { plan: PlanId; index: number; progress: SharedValue<number> }) {
  const small = useFontScale() >= SMALL_FROM_SCALE;
  const style = useAnimatedStyle(() => {
    const t = interpolate(progress.value, [index * STAGGER, index * STAGGER + WINDOW], [0, 1], 'clamp');
    return { opacity: t * opacity.welcomeGlyph, transform: [{ translateY: (1 - t) * RISE }] };
  });
  return (
    <Animated.View style={[styles.cell, style]}>
      <PlanGlyph plan={plan} small={small} />
    </Animated.View>
  );
}

export function WelcomeHorizon({ plans, progress }: { plans: PlanId[]; progress: SharedValue<number> }) {
  const { color } = useTheme();
  const glow = useAnimatedStyle(() => ({ opacity: interpolate(progress.value, [0.4, 1], [0, 1], 'clamp') }));
  return (
    <View style={styles.wrap} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View pointerEvents="none" style={[styles.glow, glow]}>
        <Svg width="100%" height={GLOW_HEIGHT}>
          <Defs>
            <RadialGradient id="first-light" cx="50%" cy="100%" rx="60%" ry="100%">
              <Stop offset="0" stopColor={color.action.primary} stopOpacity={opacity.firstLight} />
              <Stop offset="1" stopColor={color.action.primary} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          {/* Centred on the horizon, at the bottom middle of the box. */}
          <Rect x="0" y="0" width="100%" height={GLOW_HEIGHT} fill="url(#first-light)" />
        </Svg>
      </Animated.View>
      <View style={styles.row}>
        {plans.map((plan, i) => (
          <RisingGlyph key={`${i}-${plan}`} plan={plan} index={i} progress={progress} />
        ))}
      </View>
      <View style={[styles.horizon, { backgroundColor: color.text.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  // The glow's base sits on the horizon line and rises behind the glyphs.
  glow: { position: 'absolute', bottom: 0, left: 0, right: 0, height: GLOW_HEIGHT },
  horizon: { height: 1, opacity: opacity.horizon },
  row: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center' },
});
