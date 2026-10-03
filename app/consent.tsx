// Layout plan. Job: get a separate, explicit answer for each purpose (GDPR Art. 9). Focal element: the four purposes.
// Quiet: the demo note. Allow and Not now have equal weight, and nothing is preselected. Withdrawal uses the same control in Settings.
// One primary action: Continue, off until every purpose has an answer.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { useOnboardingStep } from '@features/onboardingSteps';
import { purposes, useAppState } from '@state';
import { answerOptions } from '@state/answers';
import { space } from '@tokens';
import { Button, ChoiceGroup, ScreenHeader, Stepper, Text, useTheme } from '@ui';

export default function Consent() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const params = useLocalSearchParams<{ preset?: string }>();
  const step = useOnboardingStep('consent');

  // Review only: ?preset=partial or ?preset=all fills answers on arrival.
  useEffect(() => {
    if (params.preset === 'partial') {
      app.setConsent('scoring', 'allow');
      app.setConsent('personalModel', 'decline');
    } else if (params.preset === 'all') {
      purposes.forEach((p) => app.setConsent(p, 'allow'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.preset]);

  // Onboarding goes on to the calendar (if allowed), then the notifications pre-prompt, which completes it (REDESIGN-PROMPT §4.2 order).
  const next = () => router.push(app.consents.calendar === 'allow' ? '/connect-calendar' : '/notifications');

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.consent.title} onBack={() => router.back()} />
        <Stepper {...step} />
        <Text variant="body" tone="secondary">
          {copy.consent.intro}
        </Text>

        {purposes.map((purpose) => (
          <View key={purpose} style={styles.group}>
            <Text variant="heading" accessibilityRole="header" level={2}>
              {copy.consent.purposes[purpose].name}
            </Text>
            <Text variant="caption" tone="secondary">
              {copy.consent.purposes[purpose].what}
            </Text>
            <ChoiceGroup
              label={copy.consent.purposes[purpose].name}
              options={answerOptions}
              value={app.consents[purpose]}
              onChange={(answer) => app.setConsent(purpose, answer)}
            />
          </View>
        ))}

        <Text variant="caption" tone="secondary">
          {copy.consent.demoNote}
        </Text>
      </ScrollView>

      <View style={styles.actions}>
        {app.allAnswered ? null : (
          <Text variant="caption" tone="secondary">
            {copy.consent.incomplete}
          </Text>
        )}
        <Button label={copy.consent.continue} fullWidth disabled={!app.allAnswered} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: space.margin,
    paddingTop: space.xs,
    paddingBottom: space.lg,
    gap: space.md,
  },
  group: { marginTop: space.md, gap: space.sm },
  actions: { paddingHorizontal: space.margin, paddingBottom: space.md, gap: space.xs },
});
