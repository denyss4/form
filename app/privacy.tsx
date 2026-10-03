// Layout plan. Job: change any consent as easily as it was given. Focal element: the four choices. Quiet: the intro line.
// Opened from Profile, Privacy (D2: Settings folded into Profile; connections and licences moved there).
// The same control as the consent screen (PurposeChoice), so withdrawing is exactly as easy as allowing (MASTER_PROMPT §7).
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { PurposeChoice } from '@features/PurposeChoice';
import { purposes } from '@state';
import { space } from '@tokens';
import { ScreenHeader, Section, useTheme } from '@ui';

export default function PrivacyScreen() {
  const { color } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title={copy.privacy.title}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
        />

        <Section title={copy.profile.consents} note={copy.privacy.intro}>
          {/* The same control as consent (first-launch plan, 3 Oct, item 12): withdrawing is as easy as giving. */}
          {purposes.map((purpose) => (
            <View key={purpose} style={styles.purpose}>
              <PurposeChoice purpose={purpose} />
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
