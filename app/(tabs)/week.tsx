// Layout plan. Job: fit hard sessions into this week. Focal element: the column of plan labels, the week's rhythm.
// Quiet: the day-type tags. The one action is the suggestion at the bottom, in the thumb zone: one primary plus a text-only action.
// Day types are tags, not plan state, so they carry no colour (5.1). Rows are separated by space and hairlines, never boxed (5.5 #1).
// States: default, loading, no calendar, partial, low confidence, error. `?state=` holds one for review.
// Accepting moves the session marker to its new day with translateY (transform only), then the week reflows (MASTER_PROMPT §6).
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Settings from 'lucide-react-native/icons/settings';

import { copy } from '@copy';
import { formatDay, formatWeek, weekdayName } from '@format';
import { useWeek } from '@features/useWeek';
import { coverage } from '@planner';
import type { WeekDay } from '@planner';
import { useAppState } from '@state';
import { motion, size, space } from '@tokens';
import {
  Button,
  announce,
  haptic,
  IconButton,
  InlineMessage,
  oneOf,
  PlanLabel,
  ScreenHeader,
  Skeleton,
  Text,
  useTheme,
} from '@ui';

const scenarios = ['default', 'loading', 'empty', 'partial', 'error', 'lowconf'] as const;
const LOW_CONFIDENCE_DAYS = 2; // this many days with events, or fewer, is mostly guessing

interface Slot {
  y: number; // the row's top, in the list
  h: number; // the row's height
  slot: number; // the session line's top, inside the row
}

function Row({
  day,
  divider,
  hideSlot,
  onRow,
  onSlot,
}: {
  day: WeekDay;
  divider: boolean;
  hideSlot: boolean;
  onRow: (e: LayoutChangeEvent) => void;
  onSlot: (e: LayoutChangeEvent) => void;
}) {
  const { color } = useTheme();
  const tags = day.tags.map((t) => copy.tag[t]).join(', ');
  const session = day.sessions[0];
  return (
    <View
      onLayout={onRow}
      style={[
        styles.row,
        divider ? { borderBottomWidth: size.hairline, borderBottomColor: color.stroke.hairline } : undefined,
      ]}
    >
      <View style={styles.line}>
        <Text variant="bodyStrong">{formatDay(day.date)}</Text>
        <PlanLabel plan={day.plan} />
      </View>
      <Text variant="caption" tone="secondary">
        {day.source === 'guessed' ? `${tags}, ${copy.week.guessed}` : tags}
      </Text>
      <View onLayout={onSlot} style={hideSlot ? styles.hidden : undefined}>
        {session ? (
          <Text variant="body">{copy.week.session(session.name, session.start)}</Text>
        ) : (
          <Text variant="caption" tone="secondary">
            {copy.week.noSession}
          </Text>
        )}
      </View>
    </View>
  );
}

function SkeletonRows() {
  return (
    <View>
      {Array.from({ length: 7 }, (_, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.line}>
            <Skeleton width="28%" height={size.icon} />
            <Skeleton width="38%" height={size.icon} />
          </View>
          <Skeleton width="44%" />
          <Skeleton width="34%" />
        </View>
      ))}
    </View>
  );
}

export default function Week() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const params = useLocalSearchParams<{ state?: string; motion?: string }>();
  // Review only: ?motion=full plays the animation even when the device asks for reduced motion.
  const reduceMotion = useReducedMotion() && params.motion !== 'full';
  const scenario = oneOf(params.state, scenarios, app.calendar === 'connected' ? 'default' : 'empty');

  const subset = scenario === 'partial' || scenario === 'lowconf' ? scenario : scenario === 'default' ? 'all' : 'none';
  const { weekStart, original, week, suggestion } = useWeek(subset);
  const cov = coverage(week);

  // The session marker: measured once at rest, then moved with translateY.
  const layouts = useRef<Record<string, Slot>>({});
  const record = (date: string, patch: Partial<Slot>) => {
    const previous = layouts.current[date] ?? { y: 0, h: 0, slot: 0 };
    layouts.current[date] = { ...previous, ...patch };
    showTheMove();
  };

  // When the week opens with a suggestion, scroll so both days it names sit above the footer. The footer covers the lower third,
  // and the session's travel between the two rows has to be visible when it plays (found on the iPhone: Thursday was hidden).
  const list = useRef<ScrollView>(null);
  const listTop = useRef<number | null>(null);
  const shown = useRef(false);
  const viewHeight = useRef(0);
  const showTheMove = () => {
    if (shown.current || !suggestion || app.suggestion !== 'open' || listTop.current === null || viewHeight.current === 0) return;
    const to = layouts.current[suggestion.toDate];
    const from = layouts.current[suggestion.fromDate];
    if (!to?.h || !from?.h) return;
    shown.current = true;
    // The least scroll that puts both rows fully above the footer, so the header stays in view as long as it can.
    const lowest = Math.max(to.y + to.h, from.y + from.h);
    const least = listTop.current + lowest - viewHeight.current + space.sm;
    const tops = Object.values(layouts.current).map((slot) => listTop.current! + slot.y).sort((a, b) => a - b);
    const snapped = tops.find((top) => top >= least) ?? least; // the next row top, so no row or title is half cut
    list.current?.scrollTo({ y: Math.max(0, least <= 0 ? 0 : snapped), animated: false });
  };
  const [moving, setMoving] = useState(false);
  const [startY, setStartY] = useState(0);
  const travel = useSharedValue(0);
  const markerStyle = useAnimatedStyle(() => ({ transform: [{ translateY: travel.value }] }));

  const commit = () => {
    app.setSuggestion('moved');
    setMoving(false);
    if (suggestion) announce(copy.suggestion.moved(suggestion.session, weekdayName(suggestion.toDate)));
  };

  const accept = () => {
    if (!suggestion) return;
    haptic.light();
    const from = layouts.current[suggestion.fromDate];
    const to = layouts.current[suggestion.toDate];
    if (reduceMotion || !from || !to) {
      commit();
      return;
    }
    const fromY = from.y + from.slot;
    travel.set(0);
    setStartY(fromY);
    setMoving(true);
    travel.set(
      withSpring(to.y + to.slot - fromY, motion.standard, (finished) => {
        if (finished) runOnJS(commit)();
      }),
    );
  };

  const header = (
    <ScreenHeader
      title={copy.week.title}
      caption={formatWeek(weekStart)}
      right={<IconButton icon={Settings} label={copy.nav.settings} onPress={() => router.push('/settings')} />}
    />
  );

  let body;
  if (scenario === 'loading') {
    body = <SkeletonRows />;
  } else if (scenario === 'empty') {
    body = (
      <View style={styles.state}>
        <Text variant="heading">{copy.week.empty.title}</Text>
        <Text variant="body" tone="secondary">
          {copy.week.empty.body}
        </Text>
        <Button label={copy.week.empty.action} onPress={() => router.push('/connect-calendar')} />
      </View>
    );
  } else if (scenario === 'error') {
    body = (
      <InlineMessage title={copy.week.error.title} body={copy.week.error.body}>
        <Button variant="secondary" label={copy.week.error.retry} onPress={() => router.replace('/week')} />
      </InlineMessage>
    );
  } else {
    const hidden = moving && suggestion ? [suggestion.fromDate, suggestion.toDate] : [];
    const markerTime = suggestion ? original.find((d) => d.date === suggestion.fromDate)?.sessions[0]?.start : undefined;
    body = (
      <>
        <View style={styles.notes}>
          <Text variant="caption" tone="secondary">
            {copy.week.planNote}
          </Text>
        </View>
        {cov.eventDays < cov.total ? (
          <View style={styles.notes}>
            <Text variant="caption" tone="secondary">
              {copy.week.coverage(cov.eventDays, cov.total)}
            </Text>
            {cov.eventDays <= LOW_CONFIDENCE_DAYS ? (
              <Text variant="caption" tone="secondary">
                {copy.week.lowConfidence}
              </Text>
            ) : null}
          </View>
        ) : null}
        <View
          onLayout={(e) => {
            listTop.current = e.nativeEvent.layout.y;
            showTheMove();
          }}
        >
          {week.map((day, i) => (
            <Row
              key={day.date}
              day={day}
              divider={i < week.length - 1}
              hideSlot={hidden.includes(day.date)}
              onRow={(e) => record(day.date, { y: e.nativeEvent.layout.y, h: e.nativeEvent.layout.height })}
              onSlot={(e) => record(day.date, { slot: e.nativeEvent.layout.y })}
            />
          ))}
          {moving && suggestion ? (
            <Animated.View pointerEvents="none" style={[styles.marker, { top: startY }, markerStyle]}>
              <Text variant="body">{copy.week.session(suggestion.session, markerTime ?? '')}</Text>
            </Animated.View>
          ) : null}
        </View>
      </>
    );
  }

  const reasons = suggestion
    ? suggestion.reasons.map((r) => `${weekdayName(r.date)} ${r.what}`).join(', ')
    : '';

  const footer =
    suggestion === null ? null : (
      <View
        aria-live="polite"
        style={[styles.footer, { borderTopWidth: size.hairline, borderTopColor: color.stroke.hairline }]}
      >
        {app.suggestion === 'open' ? (
          <>
            <Text variant="bodyStrong">{copy.suggestion.reasons(reasons)}</Text>
            <Text variant="body">{copy.suggestion.ask(suggestion.session, weekdayName(suggestion.toDate))}</Text>
            <Button
              label={copy.suggestion.move(weekdayName(suggestion.toDate))}
              fullWidth
              disabled={moving}
              onPress={accept}
            />
            <Button
              variant="text"
              label={copy.suggestion.keep(weekdayName(suggestion.fromDate))}
              disabled={moving}
              onPress={() => {
                app.setSuggestion('kept');
                announce(copy.suggestion.kept(suggestion.session, weekdayName(suggestion.fromDate)));
              }}
            />
          </>
        ) : (
          <Text variant="body">
            {app.suggestion === 'moved'
              ? copy.suggestion.moved(suggestion.session, weekdayName(suggestion.toDate))
              : copy.suggestion.kept(suggestion.session, weekdayName(suggestion.fromDate))}
          </Text>
        )}
      </View>
    );

  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView
        ref={list}
        onLayout={(e) => {
          viewHeight.current = e.nativeEvent.layout.height;
          showTheMove();
        }}
        contentContainerStyle={styles.content}
      >
        {header}
        {body}
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.md, paddingBottom: space.lg, gap: space.sm },
  notes: { gap: space.xxs },
  row: { paddingVertical: space.sm, gap: space.xxs },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  hidden: { opacity: 0 },
  marker: { position: 'absolute', left: 0, right: 0 },
  state: { marginTop: space.lg, gap: space.sm, alignItems: 'flex-start' },
  footer: {
    paddingHorizontal: space.margin,
    paddingTop: space.md,
    paddingBottom: space.md,
    gap: space.xs,
  },
});
