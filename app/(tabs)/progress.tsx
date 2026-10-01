// Layout plan. Job: show whether the plans fit, in the person's own words. Focal element: the Plan Fit sentence and its segments.
// Quiet: the day list (one line a day, plan glyph in colour, plan word in body text) and the logging line. The link to Felt vs forecast sits directly under the summary. No score, no streak, no reward: a process measure (MASTER_PROMPT §2).
// A Recover day that fit counts the same as a training day that fit. The ring shows answered days only, never more than was answered.
// States: default, loading, no feedback yet, partial, low confidence, error. `?state=` holds one for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Settings from 'lucide-react-native/icons/settings';

import { copy } from '@copy';
import { formatDay } from '@format';
import { FitStrip } from '@features/FitStrip';
import { progressScenarios, useProgress } from '@features/useProgress';
import { fitSummary, type FitDay } from '@planner/progress';
import { size, space } from '@tokens';
import {
  Button,
  IconButton,
  InlineMessage,
  LinkRow,
  oneOf,
  PlanLabel,
  ScreenHeader,
  Skeleton,
  Text,
  useFontScale,
  useTheme,
} from '@ui';

const WINDOW = 7; // the ring covers the last week of answers
const FEW_DAYS = 3; // fewer answered days than this are flagged as too few to read much [GAP G33: a proposal]

function FitRow({ day, divider, compact }: { day: FitDay; divider: boolean; compact: boolean }) {
  const { color } = useTheme();
  const status = copy.progress.fit.status[day.fit ?? 'none'];
  const statusVariant = day.fit === 'yes' ? 'body' : 'bodyStrong'; // the exception is what to notice
  return (
    <View
      accessible
      accessibilityLabel={copy.progress.fit.day(formatDay(day.date), copy.plan[day.plan], status)}
      style={[
        styles.row,
        divider ? { borderBottomWidth: size.hairline, borderBottomColor: color.stroke.hairline } : undefined,
      ]}
    >
      {compact ? (
        <View style={styles.oneLine}>
          <Text variant="bodyStrong" style={styles.dayColumn}>
            {formatDay(day.date)}
          </Text>
          <View style={styles.planColumn}>
            <PlanLabel plan={day.plan} quiet />
          </View>
          <Text variant={statusVariant} tone={day.fit === 'yes' ? 'secondary' : 'primary'} style={styles.noShrink}>
            {status}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.line}>
            <Text variant="bodyStrong" style={styles.noShrink}>
              {formatDay(day.date)}
            </Text>
            <Text variant={statusVariant} tone={day.fit === 'yes' ? 'secondary' : 'primary'}>
              {status}
            </Text>
          </View>
          <PlanLabel plan={day.plan} quiet />
        </>
      )}
    </View>
  );
}

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
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string }>();
  const scenario = oneOf(params.state, progressScenarios, 'default');
  const data = useProgress(scenario);
  const compact = useFontScale() < 1.5; // one line per day; larger text puts the plan on its own line

  const header = (
    <ScreenHeader
      title={copy.progress.title}
      caption={copy.progress.demoNote}
      right={<IconButton icon={Settings} label={copy.nav.settings} onPress={() => router.push('/settings')} />}
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
          <Button label={copy.progress.empty.action} onPress={() => router.replace('/today')} />
        </View>
      );
    } else {
      body = (
        <>
          <View style={styles.group}>
            <View style={styles.summary} aria-live="polite">
              <Text variant="heading">{copy.progress.fit.headline(summary.fit, summary.answered)}</Text>
              <Text variant="caption" tone="secondary">
                {copy.progress.fit.source}
              </Text>
              {summary.answered < FEW_DAYS ? (
                <Text variant="caption" tone="secondary">
                  {copy.progress.fit.tooFew(summary.answered)}
                </Text>
              ) : null}
              <View style={styles.strip}>
                <FitStrip days={shown.filter((d) => d.fit !== null)} label={copy.progress.fit.ring(summary.fit, summary.answered)} />
                <Text variant="caption" tone="secondary">
                  {copy.progress.fit.legend}
                </Text>
              </View>
            </View>
            <LinkRow
              label={copy.progress.felt.title}
              caption={copy.progress.felt.note}
              divider={false}
              onPress={() => router.push('/felt-vs-forecast')}
            />
          </View>

          <View style={styles.group}>
            <View>
              {shown.map((day, i) => (
                <FitRow key={day.date} day={day} divider={i < shown.length - 1} compact={compact} />
              ))}
            </View>
            <Text variant="body">{copy.progress.logging(data.logged.days, data.logged.of)}</Text>
          </View>
        </>
      );
    }
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {header}
        {body}
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
