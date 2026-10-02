// Layout plan. Job: change any consent as easily as it was given. Focal element: the four choices. Quiet: the intro line.
// Opened from Profile, Privacy (D2: Settings folded into Profile; connections and licences moved there).
// The same ChoiceGroup as the consent screen, so withdrawing is exactly as easy as allowing (MASTER_PROMPT §7).
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { purposes, useAppState } from '@state';
import { answerOptions } from '@state/answers';
import { space } from '@tokens';
import { ChoiceGroup, ScreenHeader, Section, Text, useTheme } from '@ui';

export default function PrivacyScreen() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title={copy.privacy.title}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
        />

        <Section title={copy.profile.consents} note={copy.privacy.intro}>
          {purposes.map((purpose) => (
            <View key={purpose} style={styles.purpose}>
              <Text variant="bodyStrong">{copy.consent.purposes[purpose].name}</Text>
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
        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.sm },
  purpose: { marginTop: space.sm, gap: space.xs },
});
