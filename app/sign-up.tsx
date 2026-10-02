// Layout plan. Job: create an account in one screen (REDESIGN-PROMPT §5, premium-auth rebuilt). Focal element: the three fields, then the
// one primary. Quiet: the stepper, the demo note. Mocked: in memory, no network, and the password is checked for length, never kept.
// Validation is format only, inline, in plain words, shown after a field is left or on Create account. The terms box is unchecked and
// its link opens the Legal sheet; health-data consent still comes later, per purpose (CLAUDE.md).
// "Continue as Marta" exists only in the demo build (demo clock on).
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { LegalSheet } from '@features/LegalSheet';
import { useOnboardingStep } from '@features/onboardingSteps';
import { useAppState } from '@state';
import { demoClockOn } from '@state/clock';
import { demoAccount, MIN_PASSWORD, validEmail } from '@state/profile';
import { space } from '@tokens';
import { announce, Button, Checkbox, FieldError, haptic, ScreenHeader, Stepper, Text, TextField, useTheme } from '@ui';

const AUTH_MS = 700; // the mock "server" takes a moment, so the loading state is real

export default function SignUp() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const step = useOnboardingStep('account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, terms: false });
  const [loading, setLoading] = useState(false);
  const [legal, setLegal] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const errors = {
    name: name.trim() ? null : copy.auth.errors.name,
    email: validEmail(email) ? null : copy.auth.errors.email,
    password: password.length >= MIN_PASSWORD ? null : copy.auth.errors.password,
    terms: agreed ? null : copy.auth.errors.terms,
  };

  // Onboarding goes on to the carousel; from Profile it returns there.
  const done = () => (app.onboarded ? router.back() : router.push('/intro'));

  const submit = () => {
    setTouched({ name: true, email: true, password: true, terms: true });
    const count = Object.values(errors).filter(Boolean).length;
    if (count > 0) {
      haptic.warning();
      announce(copy.editProfile.errors.fix(count));
      return;
    }
    setLoading(true);
    timer.current = setTimeout(() => {
      app.signUp({ name: name.trim(), email: email.trim() });
      haptic.success();
      announce(copy.auth.created);
      setLoading(false);
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
        <ScreenHeader title={copy.auth.signUpTitle} onBack={() => router.back()} />
        {app.onboarded ? null : <Stepper {...step} />}

        <View style={styles.fields}>
          <TextField
            label={copy.auth.name}
            value={name}
            onChangeText={setName}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={touched.name ? errors.name : null}
            autoComplete="name"
            textContentType="name"
            autoCapitalize="words"
          />
          <TextField
            label={copy.auth.email}
            value={email}
            onChangeText={setEmail}
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
            hint={copy.auth.passwordHint}
            error={touched.password ? errors.password : null}
            secure
            autoComplete="new-password"
            textContentType="newPassword"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.terms}>
          <Checkbox checked={agreed} onChange={setAgreed} label={copy.auth.termsA11y} error={touched.terms && !agreed}>
            <Text variant="body">{copy.auth.terms}</Text>
          </Checkbox>
          <Button variant="text" label={copy.auth.termsLink} onPress={() => setLegal(true)} />
          {touched.terms && errors.terms ? <FieldError message={errors.terms} /> : null}
        </View>

        <View style={styles.actions}>
          <Button label={copy.auth.create} fullWidth loading={loading} onPress={submit} />
          <Button variant="text" label={copy.auth.haveAccount} onPress={() => router.replace('/sign-in')} />
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
      <LegalSheet visible={legal} onClose={() => setLegal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
  fields: { gap: space.md },
  terms: { gap: space.xxs },
  actions: { gap: space.xxs },
  demo: { gap: space.xs, marginTop: space.md },
});
