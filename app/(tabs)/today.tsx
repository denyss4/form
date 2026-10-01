// Layout plan. Job: decide today's session. Focal element: the ScoreDial on the plan-coloured field. Quiet: the drivers and the check-in.
// The plan label leads the field, then the reason, then the dial (Review 1 finding 3). The range line is body size, not caption (finding 1).
// The field: in light, the plan's field colour fills the area behind the dial (5.1). In dark, the app theme since 1 Oct 2026, the field
// equals the canvas (user decision: minimalist, no field), so the plan shows in the title, its glyph and the dial arc.
// Morning, first open of the day: the reveal plays once (600 ms, transform and opacity only). Reduced motion: an instant, static result.
// States: default, loading, day 1, partial input, low confidence, error. `?state=` holds one for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Settings from 'lucide-react-native/icons/settings';

import { copy } from '@copy';
import { explain } from '@copy/explain';
import { EveningLog } from '@features/EveningLog';
import { todayScenarios, useHistory, useToday } from '@features/useToday';
import { formatLong } from '@format';
import { model } from '@model';
import { forecast } from '@model/forecast';
import { buildLog } from '@planner/dailyLog';
import type { EveningAnswers } from '@planner/dailyLog';
import { bandOf, planForDay } from '@planner/plan';
import { useAppState } from '@state';
import { demoClockOn, useDayPhase } from '@state/clock';
import { motion, radius, size, space } from '@tokens';
import {
  announce,
  Button,
  DriverRow,
  haptic,
  IconButton,
  InlineMessage,
  oneOf,
  ScoreDial,
  ScreenHeader,
  Skeleton,
  Slider,
  Text,
  useTheme,
} from '@ui';

const FEW_INPUTS = 3; // this many inputs used, or fewer, is a thin picture

export default function Today() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ state?: string; reveal?: string; log?: string; motion?: string }>();
  // The phone's clock, or the demo clock in the demo build (packages/state/clock.ts). ?evening=1|0 overrides it for review.
  const { evening } = useDayPhase();
  // Review only: ?motion=full plays the reveal even when the device asks for reduced motion.
  const reduceMotion = useReducedMotion() && params.motion !== 'full';

  const scenario = oneOf(params.state, todayScenarios, 'default');
  const calendarOn = params.state !== undefined || app.calendar === 'connected';
  const data = useToday(scenario, calendarOn);
  const history = useHistory();
  const [logOpen, setLogOpen] = useState(params.log === 'open');
  const scroll = useRef<Animated.ScrollView>(null);

  // The morning reveal. ?reveal=0.4 holds it at 40% for review.
  const held = params.reveal === undefined || Number.isNaN(Number(params.reveal))
    ? undefined
    : Math.min(Math.max(Number(params.reveal), 0), 1);
  const ready = data.kind === 'ready';
  const revealed = app.revealedFor === app.demoDay;
  const progress = useSharedValue(held ?? (ready && !revealed && !reduceMotion ? 0 : 1));
  const started = useRef<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (held !== undefined) {
      progress.set(held);
      return;
    }
    if (started.current === app.demoDay) return;
    started.current = app.demoDay;
    if (revealed) {
      progress.set(1);
      return;
    }
    const settle = () => {
      haptic.soft();
      app.markRevealed(app.demoDay);
    };
    if (reduceMotion) {
      progress.set(1);
      settle();
      return;
    }
    progress.set(0);
    progress.set(
      withTiming(
        1,
        { duration: motion.reveal.duration, easing: Easing.bezier(...motion.reveal.easing) },
        (finished) => {
          if (finished) runOnJS(settle)();
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, held, app.demoDay, revealed, reduceMotion]);

  const plan = data.kind === 'ready' ? data.forecast.plan : undefined;
  const fieldColor = plan ? color.plan[plan].field : color.bg.canvas;
  const settle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, motion.reveal.field], [0, 1], 'clamp'),
  }));

  // A strip under the status bar, so content scrolling up never runs behind the clock (found on the iPhone). It shows the plan field
  // while the field is behind it, then the canvas. Opacity only.
  const scrollY = useSharedValue(0);
  const fieldHeight = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const edge = useAnimatedStyle(() => ({
    opacity:
      interpolate(fieldHeight.value - insets.top - scrollY.value, [0, 8], [0, 1], 'clamp') *
      interpolate(progress.value, [0, motion.reveal.field], [0, 1], 'clamp'),
  }));

  const day = data.kind === 'loading' ? undefined : data.day;
  const tomorrow = data.kind === 'loading' ? undefined : data.tomorrow;
  const logged = app.logs[app.demoDay] !== undefined;
  const accepted = app.planAccepted[app.demoDay] === true;

  const save = (answers: EveningAnswers) => {
    if (!day) return;
    const log = buildLog({ today: day, tomorrow, answers, readiness10: app.readiness[app.demoDay] });
    let next;
    if (tomorrow) {
      const result = forecast(model, history, log); // throws if the model rejects the log
      next = { day: tomorrow.date, forecast: { result, plan: planForDay(result.score, tomorrow.tags, tomorrow.sessions) } };
    }
    app.saveLog(app.demoDay, answers, log, next);
  };

  const jump = () => {
    if (!tomorrow) return;
    app.advanceTo(tomorrow.date);
    announce(formatLong(tomorrow.date));
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  // Demo build only: a long-press on the date steps the demo clock. Morning goes to evening; evening goes to the next morning, but only once
  // tonight's log has produced tomorrow's forecast. A blocked step gives a warning haptic and changes nothing. No visible UI.
  const stepDemoClock = () => {
    if (app.demoPhase === 'morning') {
      app.setDemoPhase('evening');
      haptic.light();
    } else if (tomorrow && app.forecasts[tomorrow.date]) {
      jump();
      haptic.light();
    } else {
      haptic.warning();
    }
  };
  const onCaptionLongPress = demoClockOn ? stepDemoClock : undefined;

  const settingsButton = <IconButton icon={Settings} label={copy.nav.settings} onPress={() => router.push('/settings')} />;
  const header = (
    <ScreenHeader
      title={copy.today.title}
      caption={formatLong(app.demoDay)}
      right={settingsButton}
      onCaptionLongPress={onCaptionLongPress}
    />
  );

  let field;
  let below = null;
  let footer = null;

  if (data.kind === 'loading') {
    field = (
      <>
        {header}
        <Skeleton width="40%" height={size.icon} />
        <Skeleton width="90%" />
        <Skeleton width="60%" />
        <View style={styles.dial}>
          <Skeleton width={size.dial.app.diameter} height={size.dial.app.diameter} />
        </View>
      </>
    );
  } else if (data.kind === 'error') {
    field = (
      <>
        {header}
        <InlineMessage title={copy.today.error.title} body={copy.today.error.body}>
          <Button variant="secondary" label={copy.today.error.retry} onPress={() => router.replace('/today')} />
        </InlineMessage>
      </>
    );
  } else if (data.kind === 'day1') {
    field = (
      <>
        {header}
        <View style={styles.dial}>
          <ScoreDial score={null} />
        </View>
        <Text variant="heading">{copy.today.day1.title}</Text>
        <Text variant="body" tone="secondary">
          {copy.today.day1.body}
        </Text>
      </>
    );
    footer = <Button label={copy.today.logTonight} fullWidth onPress={() => setLogOpen(true)} />;
  } else {
    const { result, plan: p } = data.forecast;
    const skipped = result.skippedInputs;
    const rating = app.readiness[app.demoDay] ?? null;

    // Reading order, for the eye and for VoiceOver alike: the plan (the title), the dial, range and confidence, the reason, then the drivers.
    field = (
      <>
        <ScreenHeader
          title={copy.plan[p]}
          plan={p}
          caption={copy.today.dateCaption(formatLong(app.demoDay))}
          right={settingsButton}
          onCaptionLongPress={onCaptionLongPress}
        />
        <View style={styles.dial}>
          <ScoreDial
            score={result.score}
            range={result.range}
            plan={p}
            reveal={{ progress, field: color.plan[p].field }}
          />
        </View>
        <View
          style={styles.annotation}
          accessible
          accessibilityLabel={[
            copy.inputsBasis(result.confidence.used, result.confidence.total),
            result.confidence.used <= FEW_INPUTS ? copy.today.fewInputs : null,
          ]
            .filter(Boolean)
            .join('. ')}
        >
          <Text variant="body">{copy.range(result.range[0], result.range[1])}</Text>
          <Text variant="caption" tone="secondary">
            {copy.inputsBasis(result.confidence.used, result.confidence.total)}
          </Text>
          {result.confidence.used <= FEW_INPUTS ? (
            <Text variant="caption" tone="secondary">
              {copy.today.fewInputs}
            </Text>
          ) : null}
        </View>
        <Text variant="body" style={styles.reason}>
          {explain(p, result.drivers, { band: bandOf(result.score), tags: data.day.tags, sessions: data.day.sessions })}
        </Text>
      </>
    );

    below = (
      <>
        <View style={styles.section}>
          <Text variant="heading" accessibilityRole="header" level={2}>
            {copy.whyHeading}
          </Text>
          <View>
            {result.drivers.length === 0 ? (
              <Text variant="body" tone="secondary">
                {copy.noDrivers}
              </Text>
            ) : (
              result.drivers.map((driver, i) => (
                <DriverRow key={driver.id} driver={driver} divider={i < result.drivers.length - 1} />
              ))
            )}
          </View>
          {skipped.length > 0 ? (
            <Text variant="caption" tone="secondary">
              {copy.today.notUsed(
                skipped
                  .slice(0, 2)
                  .map((s) => s.label.toLowerCase())
                  .join(', '),
                skipped.length - 2,
              )}
            </Text>
          ) : null}
          {rating === null ? (
            <Text variant="body" tone="secondary">
              {copy.today.checkin.nudge}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text variant="heading" accessibilityRole="header" level={2}>
            {copy.today.checkin.title}
          </Text>
          <Slider
            label={copy.today.checkin.title}
            value={rating}
            onChange={(v) => app.setReadiness(app.demoDay, v)}
            valueText={copy.today.checkin.value(rating ?? 0)}
            spokenText={rating === null ? copy.today.checkin.unset : undefined}
            lowLabel={copy.today.checkin.low}
            highLabel={copy.today.checkin.high}
          />
          <Text variant="caption" tone="secondary">
            {copy.today.checkin.hint}
          </Text>
        </View>

        {!logged && !accepted ? (
          <View style={styles.section}>
            <Button variant="text" label={copy.today.logTonight} onPress={() => setLogOpen(true)} />
          </View>
        ) : null}
      </>
    );

    footer = logged ? (
      <>
        <Text variant="body">{copy.today.logged}</Text>
      </>
    ) : accepted ? (
      <>
        <Text variant="body">{copy.today.accepted}</Text>
        {evening ? (
          <Button label={copy.today.logTonight} fullWidth onPress={() => setLogOpen(true)} />
        ) : (
          <Button variant="text" label={copy.today.logTonight} onPress={() => setLogOpen(true)} />
        )}
      </>
    ) : (
      <Button
        label={copy.today.accept}
        fullWidth
        onPress={() => {
          haptic.light();
          app.acceptPlan(app.demoDay);
          announce(copy.today.accepted);
        }}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <Animated.ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={styles.content}>
        <View
          onLayout={(e) => fieldHeight.set(e.nativeEvent.layout.height)}
          style={[styles.field, { paddingTop: insets.top + space.md }]}
        >
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.fieldBg, { backgroundColor: fieldColor }, settle]}
          />
          {field}
        </View>
        {below}
      </Animated.ScrollView>

      <View pointerEvents="none" style={[styles.strip, { height: insets.top, backgroundColor: color.bg.canvas }]}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: fieldColor }, edge]} />
      </View>

      {footer ? (
        <View
          aria-live="polite"
          style={styles.footer}
        >
          {footer}
        </View>
      ) : null}

      {day ? (
        <EveningLog
          key={day.date}
          visible={logOpen}
          day={day}
          planAccepted={accepted}
          onClose={() => setLogOpen(false)}
          onSave={save}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: space.lg },
  strip: { position: 'absolute', top: 0, left: 0, right: 0 },
  field: { paddingHorizontal: space.margin, paddingBottom: space.lg, gap: space.sm },
  fieldBg: { borderBottomLeftRadius: radius.sheet, borderBottomRightRadius: radius.sheet },
  reason: { marginTop: space.sm }, // 24 from the dial's annotation, with the field gap
  dial: { alignItems: 'center', marginTop: space.sm },
  annotation: { alignItems: 'center', gap: space.xxs },
  section: { paddingHorizontal: space.margin, marginTop: space.xxl, gap: space.sm }, // 48 before a new section (5.2)
  footer: { paddingHorizontal: space.margin, paddingTop: space.md, paddingBottom: space.md, gap: space.xs },
});
