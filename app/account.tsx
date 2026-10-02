// Layout plan. Job: hold the account path's place until D2 builds Sign up and Sign in (mocked auth). Focal element: the title.
// Quiet: the stepper. A labelled placeholder (CLAUDE.md: show a labelled placeholder and continue), never a fake form.
// [GAP G54: Sign up and Sign in are built in D2. Until then both Welcome account buttons lead here.]
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { useOnboardingStep } from '@features/onboardingSteps';
import { useAppState } from '@state';
import { space } from '@tokens';
import { Button, ScreenHeader, Stepper, Text, useTheme } from '@ui';

export default function Account() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const step = useOnboardingStep('account');
  // Going on without an account makes this the guest path, so the stepper counts three steps from here.
  const continueAsGuest = () => {
    app.setOnboardingPath('guest');
    router.push('/intro');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.account.title} onBack={() => router.back()} />
        <Stepper {...step} />
        <Text variant="body" tone="secondary">
          {copy.account.body}
        </Text>
      </ScrollView>
      <View style={styles.actions}>
        <Button label={copy.account.continue} fullWidth onPress={continueAsGuest} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.lg, gap: space.md },
  actions: { paddingHorizontal: space.margin, paddingBottom: space.md },
});
