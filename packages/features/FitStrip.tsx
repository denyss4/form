// Layout plan. Job: show the answered days at a glance. Focal element: the segments. Quiet: nothing else.
// One solid segment per answered day, up to a week, oldest on the left. Filled = the plan fit. Outlined = it did not (too hard or too easy).
// Shape carries it, never colour: a fill against an outline. Dashes are never used here: a dashed outline means "Estimated" and only that.
import { StyleSheet, View } from 'react-native';

import type { FitDay } from '@planner/progress';
import { radius, size, space } from '@tokens';
import { useTheme } from '@ui';

export function FitStrip({ days, label }: { days: FitDay[]; label: string }) {
  const { color } = useTheme();
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} style={styles.strip}>
      {days.map((day) => {
        const fit = day.fit === 'yes';
        return (
          <View
            key={day.date}
            style={[
              styles.segment,
              fit
                ? { backgroundColor: color.text.primary, borderColor: color.text.primary }
                : { backgroundColor: 'transparent', borderColor: color.text.primary },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: space.xxs },
  segment: { flex: 1, height: size.icon, borderRadius: radius.control, borderWidth: size.outline },
});
