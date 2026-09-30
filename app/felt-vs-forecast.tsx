// Layout plan. Job: put each morning's felt rating next to what Form forecast the evening before. Focal element: the two markers on one line.
// Quiet: the legend, the scale note and the 21-day caption. The screen is called "Felt vs forecast", not "Felt vs measured": nothing here
// is measured. It deliberately shows no accuracy number: the felt ratings are a scripted persona's, so a summary would claim too much.
// States: default, loading, no ratings yet, partial, low confidence, error. `?state=` holds one for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { formatDay } from '@format';
import { LegendShape, RangeBar } from '@features/RangeBar';
import { progressScenarios, useProgress } from '@features/useProgress';
import { insideRange, LEARNING_DAYS, type Pair } from '@planner/progress';
import { size, space } from '@tokens';
import { Button, InlineMessage, oneOf, ScreenHeader, Skeleton, Text, useTheme } from '@ui';

const FEW_DAYS = 3; // same threshold as Progress [GAP G33]

function PairRow({ pair, divider }: { pair: Pair; divider: boolean }) {
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
        <Text variant="bodyStrong" style={styles.noShrink}>{formatDay(pair.date)}</Text>
        <Text variant="caption" tone="secondary">
          {inside ? copy.feltVsForecast.inside : copy.feltVsForecast.outside}
        </Text>
      </View>
      <Text variant="body" tabular>
        {copy.feltVsForecast.row(pair.felt, pair.forecast, lo, hi)}
      </Text>
      <RangeBar forecast={pair.forecast} range={pair.range} felt={pair.felt} />
    </View>
  );
}

function Legend() {
  const items = [
    ['forecast', copy.feltVsForecast.legend.forecast],
    ['felt', copy.feltVsForecast.legend.felt],
    ['range', copy.feltVsForecast.legend.range],
  ] as const;
  return (
    <View style={styles.legend}>
      {items.map(([kind, label]) => (
        <View key={kind} style={styles.legendItem}>
          <LegendShape kind={kind} />
          <Text variant="caption">{label}</Text>
        </View>
      ))}
    </View>
  );
}

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

export default function FeltVsForecast() {
  const { color } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string }>();
  const scenario = oneOf(params.state, progressScenarios, 'default');
  const data = useProgress(scenario);
  const leave = () => (router.canGoBack() ? router.back() : router.replace('/progress'));

  let body;
  if (data.kind === 'loading') {
    body = <SkeletonBody />;
  } else if (data.kind === 'error') {
    body = (
      <InlineMessage title={copy.feltVsForecast.error.title} body={copy.feltVsForecast.error.body}>
        <Button variant="secondary" label={copy.feltVsForecast.error.retry} onPress={() => router.replace('/felt-vs-forecast')} />
      </InlineMessage>
    );
  } else if (data.pairs.length === 0) {
    body = (
      <View style={styles.state}>
        <Text variant="heading">{copy.feltVsForecast.empty.title}</Text>
        <Text variant="body" tone="secondary">
          {copy.feltVsForecast.empty.body}
        </Text>
        <Button label={copy.feltVsForecast.empty.action} onPress={() => router.replace('/today')} />
      </View>
    );
  } else {
    const n = data.pairs.length;
    body = (
      <>
        <Text variant="body" tone="secondary">
          {copy.feltVsForecast.intro}
        </Text>
        <Legend />
        <View>
          {data.pairs.map((pair, i) => (
            <PairRow key={pair.date} pair={pair} divider={i < n - 1} />
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
      </>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.feltVsForecast.title} caption={copy.progress.demoNote} onBack={leave} />
        {body}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.lg, gap: space.md },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space.md, rowGap: space.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  row: { paddingVertical: space.sm, gap: space.xxs },
  line: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: space.sm },
  noShrink: { flexShrink: 0 },
  notes: { gap: space.xs },
  rule: { borderTopWidth: size.hairline, marginVertical: space.xs },
  state: { marginTop: space.md, gap: space.sm, alignItems: 'flex-start' },
});
