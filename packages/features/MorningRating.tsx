// Layout plan. Job: one rating before the forecast is seen (spec R2, changed in D5). Focal element: the slider. Quiet: the date, the scale
// note and "Skip to my plan". No score, plan or plan colour exists on this screen.
// D5 (user decision, 2 Oct, Figma): a 1-10 slider whose thumb rests on 3. Kept from R2: nothing is stored until the person moves or taps
// the slider, and the value is saved when they let go; the reveal then starts. Skip stores nothing, and the rating is not asked again
// that day. Screen readers: swipe up or down to adjust, double-tap to confirm (the activate action), so adjusting never saves by itself.
// The track is the shared slider look (SliderTrack, the user's pick 11B): a thick sunken track, Text High up to the ringed thumb, a
// bubble with the number while the finger is down; the numbers 1-10 sit under their detents, the chosen one in Text High. The touch
// area is 48 pt tall, the whole width.
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';

import { copy } from '@copy';
import { motion, size, space, titleMaxFontScale } from '@tokens';
import { announce, Button, FocusRing, haptic, SLIDER_THUMB, SliderTrack, Text, useFocus } from '@ui';

const MIN = 1;
const MAX = 10;
const RESTING = 3; // where the thumb rests before the first touch (Figma); not a stored value
const THUMB = SLIDER_THUMB;
const NUMBER_MAX_SCALE = 2;

function RatingSlider({ onRate }: { onRate: (rating: number) => void }) {
  const focus = useFocus();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [value, setValue] = useState(RESTING);
  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const last = useRef(RESTING);
  const span = Math.max(width - THUMB, 1);
  const at = (v: number) => ((v - MIN) / (MAX - MIN)) * span;
  const x = useSharedValue(0);

  useEffect(() => {
    if (width === 0) return;
    x.set(reduceMotion ? at(value) : withSpring(at(value), motion.standard));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, width, reduceMotion]);

  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));
  const nearest = (px: number) => clamp(Math.round((px / span) * (MAX - MIN)) + MIN);
  const pos = (e: GestureResponderEvent) => Math.min(span, Math.max(0, e.nativeEvent.locationX - THUMB / 2));
  const follow = (e: GestureResponderEvent) => {
    const px = pos(e);
    x.set(px);
    const over = nearest(px);
    setTouched(true);
    setDragging(true);
    if (over !== last.current) {
      last.current = over;
      setValue(over);
      haptic.selection();
    }
  };
  const release = (e: GestureResponderEvent) => {
    const v = nearest(pos(e));
    setDragging(false);
    setValue(v);
    onRate(v);
  };
  const adjust = (by: 1 | -1) => {
    const v = clamp(value + by);
    setTouched(true);
    last.current = v;
    setValue(v);
    haptic.selection();
  };

  const spoken = touched ? copy.today.rating.value(value) : copy.today.rating.spoken;

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={copy.today.rating.title}
      accessibilityHint={copy.today.rating.hint}
      accessibilityValue={{ min: MIN, max: MAX, now: touched ? value : undefined, text: spoken }}
      aria-valuetext={spoken}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }, { name: 'activate' }]}
      onAccessibilityAction={(e) => {
        const name = e.nativeEvent.actionName;
        if (name === 'increment') adjust(1);
        else if (name === 'decrement') adjust(-1);
        else if (name === 'activate' && touched) onRate(value);
      }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      focusable
      // Web keyboards: arrows adjust, Enter confirms.
      {...({
        onKeyDown: (e: { key: string; preventDefault?: () => void }) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') adjust(1);
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') adjust(-1);
          else if (e.key === 'Enter' && touched) onRate(value);
          else return;
          e.preventDefault?.();
        },
      } as object)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={follow}
      onResponderMove={follow}
      onResponderRelease={release}
      onResponderTerminate={() => setDragging(false)}
      style={styles.touch}
    >
      <FocusRing visible={focus.focused} />
      <SliderTrack x={x} bubble={dragging ? String(value) : null} />
      <View pointerEvents="none" style={styles.numbers}>
        {Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).map((n) => (
          <Text
            key={n}
            variant="caption"
            tone={touched && n === value ? 'primary' : 'secondary'}
            tabular
            maxFontSizeMultiplier={NUMBER_MAX_SCALE}
            style={[styles.number, { left: at(n) + THUMB / 2 - size.touch / 2 }]}
          >
            {n}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function MorningRating({
  dateCaption,
  topInset,
  bottomInset,
  onRate,
  onSkip,
}: {
  dateCaption: string;
  topInset: number;
  bottomInset: number; // the floating tab bar's height, so Skip is never under the glass
  onRate: (rating: number) => void;
  onSkip: () => void;
}) {
  // VoiceOver hears the question, the scale and that nothing is rated yet.
  useEffect(() => {
    announce(copy.today.rating.spoken);
  }, []);

  return (
    // Scrolls, so at the largest text sizes the slider and Skip stay reachable.
    <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: topInset + space.md, paddingBottom: space.lg + bottomInset }]}>
      <Text variant="caption" tone="secondary">
        {dateCaption}
      </Text>
      <View style={styles.question}>
        <Text variant="title" accessibilityRole="header" level={1} maxFontSizeMultiplier={titleMaxFontScale}>
          {copy.today.rating.title}
        </Text>
        <Text variant="body" tone="secondary">
          {copy.today.rating.scale}
        </Text>
      </View>
      <RatingSlider onRate={onRate} />
      <Button variant="text" label={copy.today.rating.skip} fullWidth onPress={onSkip} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.margin, gap: space.lg },
  question: { gap: space.xs, marginTop: space.lg },
  touch: { minHeight: size.touch + space.lg, marginTop: space.md }, // room above for the bubble
  numbers: { minHeight: space.lg },
  number: { position: 'absolute', width: size.touch, textAlign: 'center' },
});
