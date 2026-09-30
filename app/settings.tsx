// Layout plan. Job: change any consent as easily as it was given. Focal element: the four choices. Quiet: licences and demo tools.
// The same ChoiceGroup as the consent screen, so withdrawing is exactly as easy as allowing (MASTER_PROMPT §7).
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { purposes, useAppState } from '@state';
import { answerOptions } from '@state/answers';
import { space } from '@tokens';
import { Button, ChoiceGroup, LinkRow, NavLink, ScreenHeader, Section, Text, useTheme } from '@ui';

export default function SettingsScreen() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title={copy.settings.title}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />

        <Section title={copy.settings.privacy} note={copy.settings.privacyNote}>
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

        <Section title={copy.settings.connections}>
          <View>
            <LinkRow
              label={copy.settings.healthRow.label}
              caption={copy.settings.healthRow.status}
              onPress={() => router.push('/health-sync')}
            />
            <LinkRow
              label={copy.settings.calendarWriteRow.label}
              caption={copy.settings.calendarWriteRow.status}
              divider={false}
              onPress={() => router.push('/calendar-write')}
            />
          </View>
        </Section>

        <Section title={copy.settings.licences}>
          <Text variant="caption" tone="secondary">
            {copy.settings.fonts}
          </Text>
          <Text variant="caption" tone="secondary">
            {copy.settings.model}
          </Text>
        </Section>

        <Section title={copy.settings.demo}>
          <Button
            variant="secondary"
            label={copy.settings.reset}
            onPress={() => {
              app.resetDemo();
              router.replace('/');
            }}
          />
          {/* The gallery is a development tool. A production run (npm run demo) does not show the link. */}
          {__DEV__ ? <NavLink href="/gallery" label={copy.settings.gallery} /> : null}
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
