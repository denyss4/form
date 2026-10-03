// Layout plan. Job: show whether the plans fit, in the person's own words. Focal element: the large tile, plans that fit (D5, the user's
// pick 8B: the overview as tiles). Quiet: the day list (D5, 9B: a glyph tile, the plan, the answer, the day). No score, no streak, no
// reward: a process measure (MASTER_PROMPT §2); the tiles are counts the person's own answers produce.
// Slide tabs (D3, REDESIGN-PROMPT §6): "Plan fit" and "Felt vs forecast" are the two views of this screen; the second shows FeltBody,
// with its bar chart. `?tab=felt` opens it for review.
// A Recover day that fit counts the same as a training day that fit. The count includes followed days only, never more than was answered;
// a 'Did something else' day is listed as "Not followed" and left out of the counts (spec R1).
// States: default, loading, no feedback yet, partial, low confidence, error. `?state=` holds one for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { formatDay } from '@format';
import { FeltBody } from '@features/FeltBody';
import { HeaderProfile } from '@features/HeaderProfile';
import { progressScenarios, useProgress } from '@features/useProgress';
import { fitSummary, insideRange } from '@planner/progress';
import { buildStamp, showBuildStamp } from '@state/build';
import { size, space } from '@tokens';
import {
  Button,
  InlineMessage,
  ItemList,
  oneOf,
  PlanGlyph,
  ScreenHeader,
  Skeleton,
  SlideTabs,
  StatsBento,
  Text,
  useTabBarSpace,
  useTheme,
} from '@ui';

const WINDOW = 7; // the ring covers the last week of answers
const FEW_DAYS = 3; // fewer answered days than this are flagged as too few to read much [GAP G33: a proposal]

function SkeletonBody() {
  return (
    <View style={styles.group}>
      <View style={styles.summary}>
        <Skeleton width="80%" height={size.icon} />
        <Skeleton width="60%" />
        <Skeleton width="100%" height={size.icon} />
      </View>
      {Array.from({ length: 4 }, (_, i) => (
        <View key={i} style={[styles.row, styles.oneLine]}>
          <Skeleton width="22%" />
          <Skeleton width="40%" height={size.icon} />
        </View>
      ))}
    </View>
  );
}

export default function Progress() {
  const { color } = useTheme();
  const tabSpace = useTabBarSpace(); // the tab bar floats on glass; the list scrolls under it
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string; tab?: string }>();
  const [tab, setTab] = useState(oneOf(params.tab, ['fit', 'felt'] as const, 'fit'));
  const scenario = oneOf(params.state, progressScenarios, 'default');
  const data = useProgress(scenario);

  const header = (
    <ScreenHeader
      title={copy.progress.title}
      caption={copy.progress.demoNote}
      right={<HeaderProfile />}
    />
  );

  let body;
  if (data.kind === 'loading') {
    body = <SkeletonBody />;
  } else if (data.kind === 'error') {
    body = (
      <InlineMessage title={copy.progress.error.title} body={copy.progress.error.body}>
        <Button variant="secondary" label={copy.progress.error.retry} onPress={() => router.replace('/progress')} />
      </InlineMessage>
    );
  } else {
    const shown = data.fit.slice(-WINDOW);
    const summary = fitSummary(shown);
    if (summary.answered === 0) {
      body = (
        <View style={styles.state}>
          <Text variant="heading">{copy.progress.empty.title}</Text>
          <Text variant="body" tone="secondary">
            {copy.progress.empty.body}
          </Text>
          <Button label={copy.progress.empty.action} fullWidth onPress={() => router.replace('/today')} />
        </View>
      );
    } else {
      body = (
        <>
          {/* The overview tiles (D5, the user's pick 8B, "let's try"): plans that fit, how each morning felt, days logged, mornings inside
              the likely range. The same counts as before, as tiles; counts only, no score to beat. */}
          <View style={styles.group} aria-live="polite">
            <StatsBento
              data={{
                chip: copy.progress.fit.title,
                big: copy.progress.bento.big(summary.fit, summary.answered),
                line: copy.progress.bento.line(summary.answered, summary.notFollowed),
                barsLabel: copy.feltVsForecast.chart.title,
                barsValue: copy.progress.bento.mornings(data.pairs.length),
                bars: data.pairs.slice(-WINDOW).map((p) => p.felt),
                small: [
                  { value: copy.progress.bento.count(data.logged.days, data.logged.of), label: copy.progress.bento.logged },
                  {
                    value: copy.progress.bento.count(data.pairs.filter(insideRange).length, data.pairs.length),
                    label: copy.progress.bento.inside,
                  },
                ],
              }}
            />
            <Text variant="caption" tone="secondary">
              {copy.progress.fit.source}
            </Text>
            {summary.answered < FEW_DAYS ? (
              <Text variant="caption" tone="secondary">
                {copy.progress.fit.tooFew(summary.answered)}
              </Text>
            ) : null}
          </View>

          {/* The day list (D5, 9B): a plan glyph tile, the plan, the answer under it, the day on the right, hairlines between. A day that
              did not fit keeps its emphasis (the exception is what to notice). */}
          <View style={styles.group}>
            <ItemList
              items={shown.map((day) => {
                const status = copy.progress.fit.status[day.fit ?? 'none'];
                return {
                  key: day.date,
                  media: <PlanGlyph plan={day.plan} small />,
                  title: copy.plan[day.plan],
                  description: status,
                  emphasis: day.fit !== 'yes',
                  note: formatDay(day.date),
                  spoken: copy.progress.fit.day(formatDay(day.date), copy.plan[day.plan], status),
                };
              })}
            />
          </View>
        </>
      );
    }
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: space.lg + tabSpace }]}>
        {header}
        <SlideTabs
          label={copy.progress.tabs.label}
          tabs={[
            { value: 'fit', label: copy.progress.tabs.fit },
            { value: 'felt', label: copy.progress.tabs.felt },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === 'fit' ? body : <FeltBody data={data} retry={() => router.replace('/progress?tab=felt')} />}
        {showBuildStamp ? (
          <Text variant="caption" tone="secondary" selectable>
            {buildStamp}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.md, paddingBottom: space.lg, gap: space.xl },
  group: { gap: space.md },
  summary: { gap: space.xxs },
  strip: { marginTop: space.sm, gap: space.xs },
  row: { paddingVertical: space.sm, gap: space.xxs },
  line: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: space.sm },
  noShrink: { flexShrink: 0 },
  oneLine: { flexDirection: 'row', alignItems: 'center', columnGap: space.sm },
  dayColumn: { width: '22%', flexShrink: 0 },
  planColumn: { flex: 1 },
  state: { marginTop: space.md, gap: space.sm, alignItems: 'flex-start' },
});
