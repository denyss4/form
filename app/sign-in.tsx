// Layout plan. Job: sign in to an account made on this phone (mocked, REDESIGN-PROMPT §5). Focal element: the two fields, then the
// primary. Quiet: "Forgot password?", the demo note. The password is checked for length only and never kept. An unknown email gets an
// inline message that says what happened and what to do. "Continue as Marta" exists only in the demo build.
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { useOnboardingStep } from '@features/onboardingSteps';
import { useAppState } from '@state';
import { demoClockOn } from '@state/clock';
import { demoAccount, MIN_PASSWORD, validEmail } from '@state/profile';
import { space } from '@tokens';
import { announce, Button, haptic, InlineMessage, ScreenHeader, Stepper, Text, TextField, useTheme } from '@ui';

const AUTH_MS = 700;

export default function SignIn() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const step = useOnboardingStep('account');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [unknown, setUnknown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const errors = {
    email: validEmail(email) ? null : copy.auth.errors.email,
    password: password.length >= MIN_PASSWORD ? null : copy.auth.errors.password,
  };

  const done = () => (app.onboarded ? router.back() : router.push('/intro'));

  const submit = () => {
    setTouched({ email: true, password: true });
    setUnknown(false);
    const count = Object.values(errors).filter(Boolean).length;
    if (count > 0) {
      haptic.warning();
      announce(copy.editProfile.errors.fix(count));
      return;
    }
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      // Demo build: the demo account's fixture email signs in as Marta, as Continue as Marta does.
      if (demoClockOn && email.trim().toLowerCase() === demoAccount.email) {
        app.signUp(demoAccount);
      } else if (!app.signIn(email)) {
        setUnknown(true);
        return;
      }
      haptic.success();
      done();
    }, AUTH_MS);
  };

  const asMarta = () => {
    app.signUp(demoAccount);
    announce(copy.auth.signedIn(demoAccount.name));
    done();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={copy.auth.signInTitle} onBack={() => router.back()} />
        {app.onboarded ? null : <Stepper {...step} />}

        <View style={styles.fields}>
          <TextField
            label={copy.auth.email}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setUnknown(false);
            }}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            error={touched.email ? errors.email : null}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <TextField
            label={copy.auth.password}
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={touched.password ? errors.password : null}
            secure
            autoComplete="current-password"
            textContentType="password"
            autoCapitalize="none"
          />
          <View style={styles.forgot}>
            <Button variant="text" label={copy.auth.forgot} onPress={() => router.push('/forgot-password')} />
          </View>
        </View>

        {unknown ? (
          // The way on ("Create an account instead") is the text button right below; not repeated here.
          <InlineMessage title={copy.auth.errors.unknownTitle} body={copy.auth.errors.unknownBody} />
        ) : null}

        <View style={styles.actions}>
          <Button label={copy.auth.signIn} fullWidth loading={loading} onPress={submit} />
          <Button variant="text" label={copy.auth.noAccount} onPress={() => router.replace('/sign-up')} />
        </View>

        {demoClockOn ? (
          <View style={styles.demo}>
            <Button variant="secondary" label={copy.auth.asMarta} fullWidth onPress={asMarta} />
            <Text variant="caption" tone="secondary">
              {copy.auth.asMartaNote}
            </Text>
          </View>
        ) : null}

        <Text variant="caption" tone="secondary">
          {copy.auth.demoNote}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
  fields: { gap: space.md },
  forgot: { alignItems: 'flex-start' },
  actions: { gap: space.xxs },
  demo: { gap: space.xs, marginTop: space.md },
});
