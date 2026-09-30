// Layout plan. Job: show one morning's felt rating beside its forecast. Focal element: the two markers on the bar. Quiet: the sentence.
// Only a day outside the likely range gets a marker of its own (a line of text). A day inside needs none: the summary above the list counts them.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { formatDay } from '@format';
import { insideRange, type Pair } from '@planner/progress';
import { size, space } from '@tokens';
import { Text, useTheme } from '@ui';

import { RangeBar } from './RangeBar';

export function PairRow({ pair, divider }: { pair: Pair; divider: boolean }) {
  const { color } = useTheme();
  const inside = insideRange(pair);
  const [lo, hi] = pair.range;
  return (
    <View
      accessible
      accessibilityLabel={copy.feltVsForecast.a11y(formatDay(pair.date), pair.felt, pair.forecast, lo, hi, inside)}
      style={[
        styles.row,
        divider ? { borderBottomWidth: size.hairline, borderBottomColor: color.stroke.hairline } : undefined,
      ]}
    >
      <View style={styles.line}>
        <Text variant="bodyStrong" style={styles.noShrink}>
          {formatDay(pair.date)}
        </Text>
        {inside ? null : (
          <Text variant="caption" tone="secondary">
            {copy.feltVsForecast.outside}
          </Text>
        )}
      </View>
      <Text variant="body" tabular>
        {copy.feltVsForecast.row(pair.felt, pair.forecast, lo, hi)}
      </Text>
      <RangeBar forecast={pair.forecast} range={pair.range} felt={pair.felt} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: space.sm, gap: space.xxs },
  line: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: space.sm },
  noShrink: { flexShrink: 0 },
});
