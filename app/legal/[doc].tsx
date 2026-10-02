// Layout plan. Job: show the terms of use or the privacy notice. Focal element: the title. Quiet: the placeholder line.
// [GAP G51: neither text exists yet. A labelled placeholder until legal review; nothing is invented here.]
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { space } from '@tokens';
import { oneOf, ScreenHeader, Text, useTheme } from '@ui';

export default function LegalDoc() {
  const { color } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ doc?: string }>();
  const doc = oneOf(params.doc, ['terms', 'privacy'] as const, 'terms');
  const title = doc === 'terms' ? copy.legal.terms : copy.legal.privacy;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={title} onBack={() => (router.canGoBack() ? router.back() : router.replace('/onboarding'))} />
        <Text variant="body" tone="secondary">
          {copy.legal.placeholder(title)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.lg, gap: space.md },
});
