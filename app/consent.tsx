// Layout plan. Job: get a separate, explicit answer for each purpose (GDPR Art. 9). Focal element: the four purposes.
// Quiet: the demo note. Allow and Not now have equal weight, and nothing is preselected. Withdrawal uses the same control in Settings.
// One primary action: Continue, off until every purpose has an answer.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { purposes, useAppState } from '@state';
import { answerOptions } from '@state/answers';
import { space } from '@tokens';
import { Button, ChoiceGroup, ScreenHeader, Text, useTheme } from '@ui';

export default function Consent() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const params = useLocalSearchParams<{ preset?: string }>();

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

  const next = () => {
    app.completeOnboarding();
    router.replace(app.consents.calendar === 'allow' ? '/connect-calendar' : '/week');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.consent.title} onBack={() => router.back()} />
        <Text variant="body" tone="secondary">
          {copy.consent.intro}
        </Text>

        {purposes.map((purpose) => (
          <View key={purpose} style={styles.group}>
            <Text variant="heading">{copy.consent.purposes[purpose].name}</Text>
            <Text variant="body" tone="secondary">
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
