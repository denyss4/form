// Felt vs forecast as its own screen (the gallery and deep links). Progress shows the same view as its second tab (D3 slide tabs).
// The layout plan and states live with the view, in FeltBody. `?state=` holds one for review.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { FeltBody } from '@features/FeltBody';
import { progressScenarios, useProgress } from '@features/useProgress';
import { space } from '@tokens';
import { oneOf, ScreenHeader, useTheme } from '@ui';

export default function FeltVsForecast() {
  const { color } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string }>();
  const scenario = oneOf(params.state, progressScenarios, 'default');
  const data = useProgress(scenario);
  const leave = () => (router.canGoBack() ? router.back() : router.replace('/progress'));

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.feltVsForecast.title} caption={copy.progress.demoNote} onBack={leave} />
        <FeltBody data={data} retry={() => router.replace('/felt-vs-forecast')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.lg, gap: space.md },
});
