// Layout plan. Job: one honest 0-10 rating before the forecast is seen (spec R2). Focal element: the eleven numbers.
// Quiet: the date, the scale note and "Skip to my plan". No score, plan or plan colour exists on this screen, so nothing anchors the answer.
// No default value and no confirm button: one tap stores {rating, timestamp, beforeReveal: true} and the reveal starts. Skip stores nothing,
// and the rating is not asked again that day (missing data beats anchored data).
// Targets: two rows, 0-5 and 6-10, every column the same width and the second row left-aligned. At 390 pt with a 20 pt margin and 8 pt gaps
// each target is (350 - 5 x 8) / 6 = 51.7 x 48 pt, above 44 x 44 pt and 48 dp. The numbers stop growing at 2x text so they never wrap.
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { copy } from '@copy';
import { radius, size, space, titleMaxFontScale } from '@tokens';
import { announce, Button, FocusRing, haptic, Text, useFocus, usePress, useTheme } from '@ui';

const PER_ROW = 6;
const MAX_TEXT_SCALE = 2;
const values = Array.from({ length: 11 }, (_, i) => i);

function Target({ value, width, onPress }: { value: number; width: number; onPress: () => void }) {
  const { color } = useTheme();
  const press = usePress();
  const focus = useFocus();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={String(value)}
      aria-checked={false}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={{ width }}
    >
      <Animated.View style={[styles.target, { borderColor: color.stroke.control }, press.style]}>
        <Text variant="bodyStrong" tabular maxFontSizeMultiplier={MAX_TEXT_SCALE}>
          {value}
        </Text>
        <FocusRing visible={focus.focused} />
      </Animated.View>
    </Pressable>
  );
}

export function MorningRating({
  dateCaption,
  topInset,
  onRate,
  onSkip,
}: {
  dateCaption: string;
  topInset: number;
  onRate: (rating: number) => void;
  onSkip: () => void;
}) {
  const [width, setWidth] = useState(0);
  // Rounded down, so six cells always fit on one row whatever the pixel rounding.
  const cell = width > 0 ? Math.floor((width - (PER_ROW - 1) * space.xs) / PER_ROW) : 0;

  // VoiceOver hears the question, the scale and that nothing is rated yet.
  useEffect(() => {
    announce(copy.today.rating.spoken);
  }, []);

  return (
    // Scrolls, so at the largest text sizes the numbers and Skip stay reachable.
    <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: topInset + space.md }]}>
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
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={copy.today.rating.spoken}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={styles.grid}
      >
        {cell > 0
          ? values.map((value) => (
              <Target
                key={value}
                value={value}
                width={cell}
                onPress={() => {
                  haptic.selection();
                  onRate(value);
                }}
              />
            ))
          : null}
      </View>
      <Button variant="text" label={copy.today.rating.skip} onPress={onSkip} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.margin, paddingBottom: space.lg, gap: space.lg },
  question: { gap: space.xs, marginTop: space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space.xs, rowGap: space.xs },
  target: {
    minHeight: size.touch,
    borderRadius: radius.control,
    borderWidth: size.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
