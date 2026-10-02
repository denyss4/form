// Layout plan. Job: the week's rhythm at a glance (spec R3). Focal element: the seven plan glyphs in their colours.
// Quiet: the day letters and dates. Plan names never appear here (about 50 pt a column); they live in the day detail below.
// - Today: a 2 pt Text High underline under the date. Selected: the raised fill (the one raised level).
// - Estimated (no events): a solid glyph in Text Muted plus a hollow ring under it, the cue that is not colour (user decision, 1 Oct).
// - While a move is offered, the two days it moves between are outlined in the selection colour (user decision, 1 Oct: no ghost glyph).
// - The move: the session's glyph travels from one column to the other (translateX, motion.standard spring), then the week updates.
//   Reduce Motion: no travel, the glyphs cross-fade in 120 ms.
// - Day letters and dates stop growing at 2x text, and the glyph drops to the small size from 2x, so seven 50 pt columns fit at 390 pt
//   (found at 3x: two-digit dates ran together and 48 pt glyphs touched). A decision against spec R3, which lets the date wrap (DECISIONS).
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { copy } from '@copy';
import { dateNumber, dayLetter, spokenDate } from '@format';
import type { WeekDay } from '@planner';
import { motion, radius, size, space, type PlanId } from '@tokens';
import { FocusRing, haptic, PlanGlyph, Text, useFocus, useFontScale, useTheme, type Rect } from '@ui';

const LETTER_MAX_SCALE = 2;
const RING = space.xs; // the estimated ring: 8 pt across

export interface StripMove {
  from: string; // the date the session leaves
  to: string; // the date it moves to
  plan: PlanId; // the glyph that travels
  onDone: () => void;
}

function Column({
  day,
  today,
  selected,
  outlined,
  hideGlyph,
  onPress,
  onGlyphLayout,
}: {
  day: WeekDay;
  today: boolean;
  selected: boolean;
  outlined: boolean;
  hideGlyph: boolean;
  /** Called with the column's rectangle in window coordinates, so Week can grow the day detail out of it (D3b morph). */
  onPress: (rect: Rect | null) => void;
  onGlyphLayout?: (y: number) => void;
}) {
  const { color } = useTheme();
  const focus = useFocus();
  const [node, attach] = useState<View | null>(null); // a callback ref: measured on press
  const large = useFontScale() >= LETTER_MAX_SCALE;
  const estimated = day.source === 'guessed';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      aria-selected={selected}
      accessibilityLabel={copy.week.day(spokenDate(day.date), copy.plan[day.plan], estimated, today)}
      ref={attach}
      onPress={() => {
        if (!node) return onPress(null);
        node.measureInWindow((x, y, width, height) => onPress({ x, y, width, height }));
      }}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={[
        styles.column,
        { borderColor: outlined ? color.state.selected : 'transparent' },
        selected ? { backgroundColor: color.bg.raised } : null,
      ]}
    >
      <Text variant="caption" tone="secondary" maxFontSizeMultiplier={LETTER_MAX_SCALE}>
        {dayLetter(day.date)}
      </Text>
      <View style={styles.date}>
        <Text variant="bodyStrong" tabular maxFontSizeMultiplier={LETTER_MAX_SCALE}>
          {dateNumber(day.date)}
        </Text>
        <View style={[styles.underline, { backgroundColor: today ? color.text.primary : 'transparent' }]} />
      </View>
      <View onLayout={(e) => onGlyphLayout?.(e.nativeEvent.layout.y)} style={hideGlyph ? styles.hidden : undefined}>
        {/* Keyed by plan, so a changed plan cross-fades in rather than snapping. */}
        <Animated.View key={`${day.plan}-${estimated}`} entering={FadeIn.duration(motion.reducedFade)}>
          <PlanGlyph plan={day.plan} estimated={estimated} small={large} />
        </Animated.View>
      </View>
      <View style={[styles.ring, estimated ? { borderColor: color.text.secondary } : null]} />
      <FocusRing visible={focus.focused} />
    </Pressable>
  );
}

export function WeekStrip({
  week,
  today,
  selected,
  outlined,
  move,
  onSelect,
}: {
  week: WeekDay[];
  today: string;
  selected: string;
  outlined: string[];
  move: StripMove | null;
  onSelect: (date: string, rect: Rect | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const large = useFontScale() >= LETTER_MAX_SCALE;
  const [width, setWidth] = useState(0);
  const [glyphY, setGlyphY] = useState(0);
  const travel = useSharedValue(0);
  const columnWidth = width / Math.max(week.length, 1);
  const fromIndex = move ? week.findIndex((d) => d.date === move.from) : -1;
  const toIndex = move ? week.findIndex((d) => d.date === move.to) : -1;

  useEffect(() => {
    if (!move || fromIndex < 0 || toIndex < 0) return;
    if (reduceMotion || columnWidth === 0) {
      move.onDone();
      return;
    }
    travel.set(0);
    travel.set(
      withSpring((toIndex - fromIndex) * columnWidth, motion.standard, (finished) => {
        if (finished) runOnJS(move.onDone)();
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [move]);

  const traveller = useAnimatedStyle(() => ({ transform: [{ translateX: travel.value }] }));

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={styles.strip}
    >
      {week.map((day, i) => (
        <Column
          key={day.date}
          day={day}
          today={day.date === today}
          selected={day.date === selected}
          outlined={outlined.includes(day.date)}
          hideGlyph={move !== null && (day.date === move.from || day.date === move.to)}
          onGlyphLayout={i === 0 ? setGlyphY : undefined}
          onPress={(rect) => {
            haptic.selection();
            onSelect(day.date, rect);
          }}
        />
      ))}
      {move && fromIndex >= 0 && columnWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.traveller,
            { left: fromIndex * columnWidth, width: columnWidth, top: glyphY + size.outline }, // the glyph's y inside the column, plus its border
            traveller,
          ]}
        >
          <PlanGlyph plan={move.plan} small={large} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row' },
  column: {
    flex: 1,
    minHeight: size.touch,
    alignItems: 'center',
    gap: space.xxs,
    paddingVertical: space.xs,
    borderRadius: radius.control,
    borderWidth: size.outline,
  },
  date: { alignItems: 'center', gap: space.xxs },
  underline: { width: space.md, height: size.outline, borderRadius: radius.full },
  ring: {
    width: RING,
    height: RING,
    borderRadius: radius.full,
    borderWidth: size.outline,
    borderColor: 'transparent',
  },
  hidden: { opacity: 0 },
  traveller: { position: 'absolute', alignItems: 'center' },
});
