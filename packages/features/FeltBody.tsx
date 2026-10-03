// The Felt vs forecast view, shared by Progress's second tab (slide tabs, D3) and the /felt-vs-forecast screen.
// Layout plan. Job: put each morning's felt rating next to what Form forecast the evening before. Focal element: the two markers on one
// line. Quiet: the bar chart's axis, the legend, the scale note and the 21-day caption. Nothing here is measured, and the summary is a
// count of days inside the range, not an accuracy score (the range is not a calibrated interval).
// Bar chart (D3): one bar per morning, the felt rating only, in Data Muted, above the pairs, so the week's shape reads before the detail.
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { dateNumber, dayLetter, formatDay, spokenDate } from '@format';
import { PairRow } from '@features/PairRow';
import { RangeLegend } from '@features/RangeBar';
import type { useProgress } from '@features/useProgress';
import { insideRange, LEARNING_DAYS } from '@planner/progress';
import { size, space } from '@tokens';
import { Button, InlineMessage, Skeleton, Text, TraceBarChart, useTheme } from '@ui';

const FEW_DAYS = 3; // same threshold as Progress [GAP G33]
const SCALE_MAX = 100; // felt and forecast share the 0-100 scale

function SkeletonBody() {
  return (
    <View>
      {Array.from({ length: 4 }, (_, i) => (
        <View key={i} style={styles.row}>
          <Skeleton width="26%" height={size.icon} />
          <Skeleton width="62%" />
          <Skeleton width="100%" height={size.marker} />
        </View>
      ))}
    </View>
  );
}

export function FeltBody({ data, retry }: { data: ReturnType<typeof useProgress>; retry: () => void }) {
  const { color } = useTheme();
  const router = useRouter();

  if (data.kind === 'loading') return <SkeletonBody />;
  if (data.kind === 'error') {
    return (
      <InlineMessage title={copy.feltVsForecast.error.title} body={copy.feltVsForecast.error.body}>
        <Button variant="secondary" label={copy.feltVsForecast.error.retry} onPress={retry} />
      </InlineMessage>
    );
  }
  if (data.pairs.length === 0) {
    return (
      <View style={styles.state}>
        <Text variant="heading">{copy.feltVsForecast.empty.title}</Text>
        <Text variant="body" tone="secondary">
          {copy.feltVsForecast.empty.body}
        </Text>
        <Button label={copy.feltVsForecast.empty.action} fullWidth onPress={() => router.replace('/today')} />
      </View>
    );
  }

  const n = data.pairs.length;
  return (
    <View style={styles.body}>
      <Text variant="body" tone="secondary">
        {copy.feltVsForecast.intro}
      </Text>
      {/* The trace chart (D5, 3B): one morning picked at a time, the highest first; tap or drag to pick another. Screen readers adjust it
          morning by morning and hear the date and the rating. */}
      <TraceBarChart
        title={copy.feltVsForecast.chart.title}
        dayCaption={copy.feltVsForecast.chart.dayCaption}
        hint={copy.feltVsForecast.chart.hint}
        max={SCALE_MAX}
        bars={data.pairs.map((p) => ({
          key: p.date,
          label: `${dayLetter(p.date)}\n${dateNumber(p.date)}`,
          day: formatDay(p.date),
          spoken: spokenDate(p.date),
          value: p.felt,
        }))}
      />
      <Text variant="bodyStrong" aria-live="polite">
        {copy.feltVsForecast.summary(data.pairs.filter(insideRange).length, n)}
      </Text>
      <RangeLegend />
      <View>
        {/* No dividers: spacing groups the rows (white-space guideline 2.4, critique D4). */}
        {data.pairs.map((pair) => (
          <PairRow key={pair.date} pair={pair} divider={false} />
        ))}
      </View>
      <View style={styles.notes}>
        <Text variant="caption" tone="secondary">
          {copy.feltVsForecast.scale}
        </Text>
        <View style={[styles.rule, { borderTopColor: color.stroke.hairline }]} />
        <Text variant="bodyStrong">{copy.feltVsForecast.labelled(n, LEARNING_DAYS)}</Text>
        {n < FEW_DAYS ? (
          <Text variant="caption" tone="secondary">
            {copy.feltVsForecast.tooFew}
          </Text>
        ) : null}
        <Text variant="caption" tone="secondary">
          {copy.feltVsForecast.learning}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: space.md },
  chart: { gap: space.sm, marginVertical: space.xs },
  row: { paddingVertical: space.sm, gap: space.xxs },
  notes: { gap: space.xs },
  rule: { borderTopWidth: size.hairline, marginVertical: space.xs },
  state: { marginTop: space.md, gap: space.sm, alignItems: 'flex-start' },
});
