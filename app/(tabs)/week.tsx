// Layout plan. Job: see where the hard sessions fall this week, and act on one move (spec R3). Focal element: the seven-day plan strip.
// Quiet: the selected day's detail and the calendar notes. The one action is the move suggestion, directly under the strip: the reason in
// one sentence, what both days become (from the plan engine, never hard-coded), one primary and one text action.
// The strip shows glyphs only; plan names, day types and sessions live in the detail for the selected day (it starts on today).
// After a move: "Heavy legs moved to Wednesday." with Undo. "Keep Thursday" dismisses the suggestion for the week.
// States: default, loading, no calendar, partial, low confidence, error. `?state=` holds one for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { formatLong, formatWeek, weekdayName } from '@format';
import { useWeek } from '@features/useWeek';
import { HeaderProfile } from '@features/HeaderProfile';
import { useSessionName } from '@features/useSessionName';
import { WeekStrip, type StripMove } from '@features/WeekStrip';
import { coverage } from '@planner';
import type { MoveSuggestion, WeekDay } from '@planner';
import { useAppState } from '@state';
import { radius, size, space } from '@tokens';
import {
  announce,
  Button,
  DayTypes,
  haptic,
  InlineMessage,
  MorphModal,
  oneOf,
  PlanLabel,
  ScreenHeader,
  Skeleton,
  SpotlightSurface,
  Text,
  useTabBarSpace,
  useTheme,
  type Rect,
} from '@ui';

const scenarios = ['default', 'loading', 'empty', 'partial', 'error', 'lowconf'] as const;
const LOW_CONFIDENCE_DAYS = 2; // this many days with events, or fewer, is mostly guessing

/** "Heavy legs on Thursday sits before a late dinner and a Friday flight." Built from the engine's reasons. */
function reasonOf(s: MoveSuggestion, name: (session: string) => string) {
  const parts = s.reasons.map((r) =>
    // A same-day reason is a social event from the engine's LATE_HOUR on, so "late" is backed by the rule, not added for colour.
    r.date === s.fromDate ? copy.suggestion.lateEvent(r.what) : copy.suggestion.dayEvent(weekdayName(r.date), r.what),
  );
  return copy.suggestion.reason(name(s.session), weekdayName(s.fromDate), parts);
}

// D3b (Q3, behind its own phone check): 'morph' grows the tapped column into a centred detail card; 'inline' is the approved spec R3
// detail under the strip. Switching back is this one line (DECISIONS, D3b).
const DETAIL_MODE: 'morph' | 'inline' = 'morph';

/** A day's plan, estimated or not, day types and session. Shared by the inline surface and the morph card. */
function DayDetailContent({ day, inset = false }: { day: WeekDay; inset?: boolean }) {
  const name = useSessionName();
  const session = day.sessions[0];
  const estimated = day.source === 'guessed';
  return (
    <>
      {/* In the card, the date clears the close button; it is the card's heading for screen readers. */}
      <Text variant="bodyStrong" accessibilityRole="header" style={inset ? styles.inset : undefined}>
        {formatLong(day.date)}
      </Text>
      <View style={styles.detailPlan}>
        <PlanLabel plan={day.plan} estimated={estimated} quiet />
      </View>
      <DayTypes tags={day.tags} />
      {session ? (
        <Text variant="body">{copy.week.session(name(session.name), session.start)}</Text>
      ) : (
        <Text variant="body" tone="secondary">
          {copy.week.noSession}
        </Text>
      )}
    </>
  );
}

/** The selected day, inline under the strip (DETAIL_MODE 'inline'). The one content surface on the screen. */
function DayDetail({ day }: { day: WeekDay }) {
  const { color } = useTheme();
  return (
    // Spotlight (D3): a press lights the surface at the press point. One level, never nested.
    <SpotlightSurface style={[styles.detail, { backgroundColor: color.bg.raised }]}>
      <DayDetailContent day={day} />
    </SpotlightSurface>
  );
}

function SkeletonWeek() {
  return (
    <View style={styles.group}>
      <View style={styles.skeletonStrip}>
        {Array.from({ length: 7 }, (_, i) => (
          <View key={i} style={styles.skeletonColumn}>
            <Skeleton width="60%" height={size.icon * 3} />
          </View>
        ))}
      </View>
      <Skeleton width="100%" height={size.touch * 2} />
    </View>
  );
}

export default function Week() {
  const { color } = useTheme();
  const tabSpace = useTabBarSpace(); // the tab bar floats on glass; the content scrolls under it
  const router = useRouter();
  const app = useAppState();
  const sessionName = useSessionName();
  const params = useLocalSearchParams<{ state?: string; open?: string }>();
  const scenario = oneOf(params.state, scenarios, app.calendar === 'connected' ? 'default' : 'empty');

  const subset = scenario === 'partial' || scenario === 'lowconf' ? scenario : scenario === 'default' ? 'all' : 'none';
  const { weekStart, week, suggestion, preview } = useWeek(subset);
  const cov = coverage(week);

  const today = week.some((d) => d.date === app.demoDay) ? app.demoDay : (week[0]?.date ?? app.demoDay);
  const [selected, setSelected] = useState<string | null>(params.open ?? null);
  const selectedDay = week.find((d) => d.date === (selected ?? today)) ?? week[0];
  const [move, setMove] = useState<StripMove | null>(null);
  // The morph card: the day it shows stays set while it shrinks back, so the content does not change mid-close.
  // Review only: ?open=2026-10-08 opens a day's card (without a column to grow from, it fades in).
  const [card, setCard] = useState<{ date: string; rect: Rect | null } | null>(params.open ? { date: params.open, rect: null } : null);
  const [cardOpen, setCardOpen] = useState(Boolean(params.open));
  const cardDay = card ? week.find((d) => d.date === card.date) : undefined;
  const select = (date: string, rect: Rect | null) => {
    setSelected(date);
    if (DETAIL_MODE !== 'morph') return;
    setCard({ date, rect });
    setCardOpen(true);
  };

  const open = suggestion !== null && app.suggestion === 'open';

  const accept = () => {
    if (!suggestion) return;
    haptic.light();
    const from = week.find((d) => d.date === suggestion.fromDate);
    setMove({
      from: suggestion.fromDate,
      to: suggestion.toDate,
      plan: from?.plan ?? 'hard',
      onDone: () => {
        app.setSuggestion('moved');
        setMove(null);
        announce(copy.suggestion.moved(sessionName(suggestion.session), weekdayName(suggestion.toDate)));
      },
    });
  };

  const header = (
    <ScreenHeader
      title={copy.week.title}
      caption={formatWeek(weekStart)}
      right={<HeaderProfile />}
    />
  );

  const suggestionBlock =
    suggestion === null ? null : open ? (
      <View aria-live="polite" style={styles.suggestion}>
        <Text variant="bodyStrong">{reasonOf(suggestion, sessionName)}</Text>
        {preview ? (
          <Text variant="body" tone="secondary">
            {copy.suggestion.preview(
              weekdayName(suggestion.toDate),
              copy.plan[preview.to],
              weekdayName(suggestion.fromDate),
              copy.plan[preview.from],
            )}
          </Text>
        ) : null}
        {/* Always the full sage primary (first-launch plan, 3 Oct, item 17): while the move plays it shows its loading state, never the
            dimmed disabled look. */}
        <Button label={copy.suggestion.move(weekdayName(suggestion.toDate))} fullWidth loading={move !== null} onPress={accept} />
        <Button
          variant="text"
          label={copy.suggestion.keep(weekdayName(suggestion.fromDate))}
          disabled={move !== null}
          onPress={() => {
            app.setSuggestion('kept');
            announce(copy.suggestion.kept(sessionName(suggestion.session), weekdayName(suggestion.fromDate)));
          }}
        />
      </View>
    ) : app.suggestion === 'moved' ? (
      <View aria-live="polite" style={styles.moved}>
        <Text variant="body" style={styles.movedText}>
          {copy.suggestion.moved(sessionName(suggestion.session), weekdayName(suggestion.toDate))}
        </Text>
        <Button
          variant="text"
          label={copy.suggestion.undo}
          onPress={() => {
            app.setSuggestion('open');
            announce(copy.suggestion.undone(sessionName(suggestion.session), weekdayName(suggestion.fromDate)));
          }}
        />
      </View>
    ) : null; // "Keep" dismisses the suggestion for the week

  let body;
  if (scenario === 'loading') {
    body = <SkeletonWeek />;
  } else if (scenario === 'empty') {
    body = (
      <View style={styles.state}>
        <Text variant="heading">{copy.week.empty.title}</Text>
        <Text variant="body" tone="secondary">
          {copy.week.empty.body}
        </Text>
        <Button label={copy.week.empty.action} fullWidth onPress={() => router.push('/connect-calendar')} />
      </View>
    );
  } else if (scenario === 'error') {
    body = (
      <InlineMessage title={copy.week.error.title} body={copy.week.error.body}>
        <Button variant="secondary" label={copy.week.error.retry} onPress={() => router.replace('/week')} />
      </InlineMessage>
    );
  } else {
    body = (
      <>
        <WeekStrip
          week={week}
          today={today}
          selected={selectedDay.date}
          outlined={open && suggestion ? [suggestion.fromDate, suggestion.toDate] : []}
          move={move}
          onSelect={select}
          columnHint={DETAIL_MODE === 'morph' ? copy.week.openHint : undefined}
        />
        {DETAIL_MODE === 'morph' ? (
          <Text variant="caption" tone="secondary">
            {copy.week.tapHint}
          </Text>
        ) : null}
        {suggestionBlock}
        {DETAIL_MODE === 'inline' ? <DayDetail day={selectedDay} /> : null}
        <View style={styles.notes}>
          <Text variant="caption" tone="secondary">
            {copy.week.planNote}
          </Text>
          {cov.eventDays < cov.total ? (
            <Text variant="caption" tone="secondary">
              {copy.week.coverage(cov.eventDays, cov.total)}
            </Text>
          ) : null}
          {cov.eventDays < cov.total && cov.eventDays <= LOW_CONFIDENCE_DAYS ? (
            <Text variant="caption" tone="secondary">
              {copy.week.lowConfidence}
            </Text>
          ) : null}
        </View>
      </>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: space.lg + tabSpace }]}>
        <View style={styles.header}>{header}</View>
        <View style={styles.group}>{body}</View>
      </ScrollView>
      {DETAIL_MODE === 'morph' ? (
        <MorphModal visible={cardOpen && cardDay !== undefined} from={card?.rect ?? null} onClose={() => setCardOpen(false)}>
          {cardDay ? <DayDetailContent day={cardDay} inset /> : null}
        </MorphModal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.md },
  // The header is its own group: 32 to what follows.
  header: { marginBottom: space.xl },
  group: { gap: space.lg },
  // The suggestion sits directly under the strip: space only, no card.
  suggestion: { gap: space.xs },
  moved: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: space.sm },
  movedText: { flexShrink: 1 },
  // The one content surface: the selected day's detail (radius.surface; spotlight-on-press arrives in D3).
  detail: { borderRadius: radius.surface, padding: space.md, gap: space.sm },
  inset: { marginRight: size.touch },
  detailPlan: { alignSelf: 'flex-start' },
  notes: { gap: space.xxs },
  state: { gap: space.sm, alignItems: 'flex-start' },
  skeletonStrip: { flexDirection: 'row', gap: space.xxs },
  skeletonColumn: { flex: 1, alignItems: 'center' },
});
