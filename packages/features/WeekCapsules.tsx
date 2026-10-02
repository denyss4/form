// Layout plan. Job: this week's plans at a glance, as a door to Week (REDESIGN-PROMPT §5). Focal element: the seven glyphs.
// Quiet: the capsules' hairline. Real data from the plan engine (the same week as Week), never medals or badges. Today: a 2 pt Text High
// underline, as on the Week strip, so it is a shape, not a colour. The whole row is one target that opens Week.
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { copy } from '@copy';
import { spokenDate } from '@format';
import { useWeek } from '@features/useWeek';
import { useAppState } from '@state';
import { radius, size, space } from '@tokens';
import { FocusRing, PlanGlyph, Text, useFocus, usePress, useTheme } from '@ui';

export function WeekCapsules() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const { week } = useWeek();
  const press = usePress();
  const focus = useFocus();
  const summary = week
    .map((d) => copy.profile.weekDay(spokenDate(d.date), copy.plan[d.plan], d.date === app.demoDay))
    .join(', ');

  return (
    <View style={styles.wrap}>
      <Text variant="heading" accessibilityRole="header" level={2}>
        {copy.profile.week}
      </Text>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={copy.profile.weekA11y(summary)}
        onPress={() => router.push('/week')}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
      >
        <Animated.View style={[styles.row, press.style]}>
          {week.map((d) => {
            const today = d.date === app.demoDay;
            return (
              <View key={d.date} style={styles.cell}>
                <View style={[styles.capsule, { borderColor: color.stroke.hairline, backgroundColor: color.bg.raised }]}>
                  <PlanGlyph plan={d.plan} small estimated={d.source === 'guessed'} />
                </View>
                <View style={[styles.mark, today ? { backgroundColor: color.text.primary } : undefined]} />
              </View>
            );
          })}
          <FocusRing visible={focus.focused} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  // Capsules share the row, so at large text the (capped) glyph still fits inside one.
  row: { flexDirection: 'row', gap: space.xxs },
  cell: { flex: 1, alignItems: 'center', gap: space.xxs },
  capsule: {
    alignSelf: 'stretch',
    minHeight: size.avatar.weekCapsule * 1.5,
    borderRadius: radius.full,
    borderWidth: size.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: { width: space.md, height: size.outline, borderRadius: radius.full },
});
