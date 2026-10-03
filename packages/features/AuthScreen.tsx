// Layout plan. Job: sign in or create an account (mocked, REDESIGN-PROMPT §5), on one screen (D5, the user's pick 6B). Focal element:
// the panel's fields and its one primary. Quiet: the stepper, the demo shortcut and notes.
// /sign-up and /sign-in both show this screen, opened on their tab; the header names the current view. The account is created when the
// email code is confirmed, then onboarding goes on to the carousel (from Profile it returns there). Mocked: in memory, nothing sent, the
// password checked and never kept. "Continue as Marta" exists only in the demo build (demo clock on). Health-data consent still comes
// later, per purpose (CLAUDE.md); the terms link opens the Legal sheet.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { AuthPanel, type AuthMode } from '@features/AuthPanel';
import { LegalSheet } from '@features/LegalSheet';
import { useOnboardingStep } from '@features/onboardingSteps';
import { useAppState } from '@state';
import { demoClockOn } from '@state/clock';
import { demoAccount } from '@state/profile';
import { space } from '@tokens';
import { announce, ScreenHeader, SheenPill, Stepper, Text, useTheme } from '@ui';

export function AuthScreen({ initialMode }: { initialMode: 'signIn' | 'signUp' }) {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const step = useOnboardingStep('account');
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [legal, setLegal] = useState(false);

  // Onboarding goes on to the carousel; from Profile it returns there.
  const done = () => (app.onboarded ? router.back() : router.push('/intro'));
  const signIn = (email: string) => {
    // Demo build: the demo account's fixture email signs in as Marta, as Continue as Marta does.
    if (demoClockOn && email.toLowerCase() === demoAccount.email) {
      app.signUp(demoAccount);
      return true;
    }
    return app.signIn(email);
  };
  const asMarta = () => {
    app.signUp(demoAccount);
    announce(copy.auth.signedIn(demoAccount.name));
    done();
  };
  const title = mode === 'signUp' ? copy.auth.signUpTitle : mode === 'signIn' ? copy.auth.signInTitle : copy.auth.forgotTitle;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={title} onBack={() => router.back()} />
        {app.onboarded || mode === 'reset' ? null : <Stepper {...step} />}

        <AuthPanel
          initialMode={initialMode}
          showTitle={false}
          onModeChange={setMode}
          onCreate={(account) => app.signUp(account)}
          onSignIn={signIn}
          onDone={done}
          onTerms={() => setLegal(true)}
        />

        {/* Gone once an account exists (after the email code), where the shortcut would only confuse. */}
        {demoClockOn && mode !== 'reset' && !app.account ? (
          <View style={styles.demo}>
            {/* The sheen pill (D5, the user's pick 10B): the demo shortcut, glass-like and quieter than the primary. */}
            <SheenPill label={copy.auth.asMarta} onPress={asMarta} />
            <Text variant="caption" tone="secondary">
              {copy.auth.asMartaNote}
            </Text>
          </View>
        ) : null}

        <Text variant="caption" tone="secondary">
          {copy.auth.demoNote}
        </Text>
      </ScrollView>
      <LegalSheet visible={legal} onClose={() => setLegal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
  demo: { gap: space.xs, marginTop: space.md },
});
