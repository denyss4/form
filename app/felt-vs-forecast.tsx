// Layout plan. Job: put each morning's felt rating next to what Form forecast the evening before. Focal element: the two markers on one line.
// Quiet: the legend, the scale note and the 21-day caption. The screen is called "Felt vs forecast", not "Felt vs measured": nothing here
// is measured. The summary is a count of days inside the range, not an accuracy score: the ratings are a scripted persona's, and the
// range is not a calibrated interval (model.json). Only a day outside the range gets its own marker.
// States: default, loading, no ratings yet, partial, low confidence, a day outside the range, error. `?state=` holds one for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { PairRow } from '@features/PairRow';
import { RangeLegend } from '@features/RangeBar';
import { progressScenarios, useProgress } from '@features/useProgress';
import { insideRange, LEARNING_DAYS } from '@planner/progress';
import { size, space } from '@tokens';
import { Button, InlineMessage, oneOf, ScreenHeader, Skeleton, Text, useTheme } from '@ui';

const FEW_DAYS = 3; // same threshold as Progress [GAP G33]

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
        <Text variant="bodyStrong" aria-live="polite">
          {copy.feltVsForecast.summary(data.pairs.filter(insideRange).length, n)}
        </Text>
        <RangeLegend />
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
  row: { paddingVertical: space.sm, gap: space.xxs },
  notes: { gap: space.xs },
  rule: { borderTopWidth: size.hairline, marginVertical: space.xs },
  state: { marginTop: space.md, gap: space.sm, alignItems: 'flex-start' },
});
