// Layout plan. Job: ask for notifications before the system does, saying what they are for (REDESIGN-PROMPT §4.2). Focal element: the
// example notification, built from Form parts (the plan glyph, the plan, the likely range from the demo's first morning). Quiet: the
// stepper, the demo note. No marketing language.
// The real system prompt (expo-notifications) runs only in normal builds; with the demo clock on it stays mocked, so the demo never
// depends on a system dialog (user decision, 1 Oct 2026). [GAP G53: no notification is scheduled yet; this only asks.]
// States: default, loading (while the system prompt is open), error. ?state=error holds the error for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { martaWeek } from '@fixtures';
import { useOnboardingStep } from '@features/onboardingSteps';
import { useWeek } from '@features/useWeek';
import { useAppState, type NotificationsAnswer } from '@state';
import { demoClockOn } from '@state/clock';
import { radius, space } from '@tokens';
import { Button, InlineMessage, oneOf, PlanGlyph, ScreenHeader, Stepper, Text, useTheme } from '@ui';

const today = martaWeek.meta.demoToday;
const example = martaWeek.days.find((d) => d.forecastFor === today) ?? martaWeek.days[martaWeek.days.length - 1];

async function askSystem(): Promise<NotificationsAnswer> {
  // Loaded only when it is used, so the demo build and the web preview never touch the module.
  const Notifications = await import('expo-notifications');
  const { granted } = await Notifications.requestPermissionsAsync();
  return granted ? 'allowed' : 'declined';
}

export default function NotificationsPrompt() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const step = useOnboardingStep('notifications');
  const { week } = useWeek();
  const params = useLocalSearchParams<{ state?: string }>();
  const [phase, setPhase] = useState<'idle' | 'loading' | 'error'>(oneOf(params.state, ['idle', 'error'] as const, 'idle'));

  const plan = week.find((d) => d.date === today)?.plan ?? 'light';
  const [lo, hi] = example.result.range;

  const finish = () => {
    app.completeOnboarding();
    router.replace('/today');
  };

  const allow = async () => {
    if (demoClockOn || Platform.OS === 'web') {
      app.setNotifications('allowed');
      return finish();
    }
    setPhase('loading');
    try {
      app.setNotifications(await askSystem());
      finish();
    } catch {
      setPhase('error');
    }
  };

  const later = () => {
    app.setNotifications('declined');
    finish();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.notifications.title} onBack={() => router.back()} />
        <Stepper {...step} />

        <View
          accessible
          accessibilityLabel={copy.notifications.cardA11y(copy.plan[plan], lo, hi)}
          style={[styles.card, { backgroundColor: color.bg.raised }]}
        >
          <View style={styles.cardTop}>
            <Text variant="bodyStrong" style={styles.grow}>
              {copy.notifications.cardApp}
            </Text>
            <Text variant="caption" tone="secondary">
              {copy.notifications.cardTime}
            </Text>
          </View>
          <View style={styles.cardBody}>
            <PlanGlyph plan={plan} small />
            <Text variant="body" tabular style={styles.grow}>
              {copy.notifications.card(copy.plan[plan], lo, hi)}
            </Text>
          </View>
        </View>

        <Text variant="body" tone="secondary">
          {copy.notifications.body}
        </Text>

        {phase === 'error' ? (
          <InlineMessage title={copy.notifications.error.title} body={copy.notifications.error.body}>
            <Button label={copy.notifications.error.continue} onPress={later} />
          </InlineMessage>
        ) : null}

        {demoClockOn ? (
          <Text variant="caption" tone="secondary">
            {copy.notifications.demoNote}
          </Text>
        ) : null}
      </ScrollView>

      {phase === 'error' ? null : (
        <View style={styles.actions}>
          <Button label={copy.notifications.allow} fullWidth loading={phase === 'loading'} onPress={allow} />
          <Button variant="text" label={copy.notifications.later} fullWidth disabled={phase === 'loading'} onPress={later} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.lg, gap: space.lg },
  card: { borderRadius: radius.surface, padding: space.md, gap: space.xs },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm },
  cardBody: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  grow: { flex: 1 },
  actions: { paddingHorizontal: space.margin, paddingBottom: space.md, gap: space.xxs },
});
