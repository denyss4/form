// Layout plan. Job: sign in or create an account in one place (D5, the user's pick 6B: their premium-auth code rebuilt for the phone).
// Focal element: the fields and the one primary. Quiet: the tabs and the strength meter.
// From the original: sign in and sign up as two tabs (the app's slide tabs, 1A), a leading icon in each field, a password strength meter
// with what is still missing, forgot password on sign in, terms on sign up, a done step, and the password reset view. The user removed
// the confirm-password field and the "Already have an account?" switch (the tabs do that); then (first-launch plan, 3 Oct) the email
// code step and "Remember me" (mocked auth gains nothing from them), and the name became optional.
// Changed for Form:
// - Labels stay above the fields (the original uses placeholders as labels; they vanish as you type).
// - No phone number: Form has no use for it (GDPR Art. 5(1)(c)).
// - The strength meter is neutral: Text High segments and the words, not the original's red-to-green colours (never colour alone).
// - Mocked like the rest of the demo: nothing is sent. The screen around the panel creates the account and signs in.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import Circle from 'lucide-react-native/icons/circle';
import KeyRound from 'lucide-react-native/icons/key-round';
import Lock from 'lucide-react-native/icons/lock';
import Mail from 'lucide-react-native/icons/mail';
import User from 'lucide-react-native/icons/user';

import { copy } from '@copy';
import { radius, size, space } from '@tokens';
import { announce, Button, Checkbox, FieldError, haptic, InlineMessage, SlideTabs, Text, TextField, useIconSize, useTheme } from '@ui';

export type AuthMode = 'signIn' | 'signUp' | 'reset';
type Mode = AuthMode;
type Step = 'details' | 'done';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function strength(password: string) {
  const needs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  return { score: Object.values(needs).filter(Boolean).length, needs };
}

function StrengthMeter({ password }: { password: string }) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.iconSm - space.xxs);
  if (!password) return null;
  const { score, needs } = strength(password);
  const words = copy.authPanel.strength.levels[Math.max(score - 1, 0)] ?? '';
  const missing = (Object.keys(needs) as (keyof typeof needs)[]).filter((k) => !needs[k]);
  return (
    <View style={styles.meter} accessible accessibilityLabel={copy.authPanel.strength.label(words)}>
      <View style={styles.segments}>
        {Array.from({ length: 5 }, (_, i) => (
          <View
            key={i}
            style={[styles.segment, i < score ? { backgroundColor: color.text.primary } : { borderColor: color.stroke.control, borderWidth: size.hairline }]}
          />
        ))}
      </View>
      <Text variant="caption" tone="secondary">
        {copy.authPanel.strength.label(words)}
      </Text>
      {missing.map((k) => (
        <View key={k} style={styles.need}>
          <Circle color={color.text.secondary} size={iconPx} strokeWidth={size.outline} />
          <Text variant="caption" tone="secondary">
            {copy.authPanel.strength.needs[k]}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function AuthPanel({
  initialMode = 'signUp',
  onModeChange,
  onCreate,
  onSignIn,
  onDone,
  onTerms,
  showTitle = true,
}: {
  initialMode?: Mode;
  /** The screen titles itself from the mode. */
  onModeChange?: (mode: Mode) => void;
  /** Create the account. The name may be empty: it is optional. */
  onCreate?: (account: { name: string; email: string }) => void;
  /** Sign in; false when no account uses this email. */
  onSignIn?: (email: string) => boolean;
  /** After "Get started", or after a sign-in that worked. */
  onDone?: () => void;
  /** Opens the terms and the privacy notice (the Legal sheet). */
  onTerms?: () => void;
  /** Off when the screen header already carries the title; the line under it stays. */
  showTitle?: boolean;
}) {
  const { color } = useTheme();
  const bigIcon = useIconSize(size.icon);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [unknown, setUnknown] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [tried, setTried] = useState(false);

  const errors = {
    email: !EMAIL.test(email.trim()) ? copy.auth.errors.email : null,
    password:
      mode === 'reset'
        ? null
        : password.length < 8
          ? copy.auth.errors.password
          : mode === 'signUp' && strength(password).score < 3
            ? copy.authPanel.errors.weak
            : null,
    terms: mode === 'signUp' && !terms ? copy.auth.errors.terms : null,
  };
  const show = (e: string | null) => (tried ? e : null);

  // A short wait stands in for the network, so the loading state shows.
  const later = (then: () => void) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      then();
    }, 800);
  };
  const switchTo = (next: Mode) => {
    setMode(next);
    onModeChange?.(next);
    setUnknown(false);
    setStep('details');
    setTried(false);
    setNotice(null);
  };
  const submit = () => {
    setTried(true);
    if (mode === 'reset') {
      if (!errors.email) later(() => setNotice(copy.authPanel.resetSent));
      return;
    }
    const fields = mode === 'signUp' ? [errors.email, errors.password, errors.terms] : [errors.email, errors.password];
    setUnknown(false);
    if (fields.some(Boolean)) {
      haptic.warning();
      announce(copy.editProfile.errors.fix(fields.filter(Boolean).length));
      return;
    }
    later(() => {
      if (mode === 'signIn') {
        if (onSignIn && !onSignIn(email.trim())) {
          setUnknown(true);
          haptic.warning();
          return;
        }
        haptic.success();
        if (onDone) onDone();
        else announce(copy.authPanel.signedIn);
      } else {
        // No email code (first-launch plan, 3 Oct, item 1): mocked auth gains nothing from it. The account is created at once.
        onCreate?.({ name: name.trim(), email: email.trim() });
        haptic.success();
        announce(copy.auth.created);
        setTried(false);
        setStep('done');
      }
    });
  };

  if (mode === 'signUp' && step === 'done') {
    return (
      <View style={styles.panel}>
        <CircleCheck color={color.status.success} size={bigIcon} strokeWidth={size.outline} />
        <Text variant="heading">{copy.authPanel.doneTitle}</Text>
        <Text variant="body" tone="secondary">
          {copy.authPanel.doneBody}
        </Text>
        <Button label={copy.authPanel.start} fullWidth onPress={() => (onDone ? onDone() : switchTo('signIn'))} />
      </View>
    );
  }

  if (mode === 'reset') {
    return (
      <View style={styles.panel}>
        <KeyRound color={color.text.primary} size={bigIcon} strokeWidth={size.outline} />
        <Text variant="heading">{copy.authPanel.resetTitle}</Text>
        <Text variant="body" tone="secondary">
          {copy.authPanel.resetBody}
        </Text>
        <TextField label={copy.auth.email} icon={Mail} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={show(errors.email)} />
        {notice ? (
          <Text variant="body" accessibilityLiveRegion="polite">
            {notice}
          </Text>
        ) : null}
        <Button label={copy.authPanel.resetSend} fullWidth loading={loading} onPress={submit} />
        <Button variant="subtle" label={copy.authPanel.backToSignIn} fullWidth onPress={() => switchTo('signIn')} />
      </View>
    );
  }

  const signUp = mode === 'signUp';
  return (
    <View style={styles.panel}>
      <SlideTabs
        label={copy.authPanel.tabs.label}
        tabs={[
          { value: 'signIn', label: copy.authPanel.tabs.signIn },
          { value: 'signUp', label: copy.authPanel.tabs.signUp },
        ]}
        value={mode === 'signUp' ? 'signUp' : 'signIn'}
        onChange={switchTo}
      />
      <View style={styles.head}>
        {showTitle ? <Text variant="heading">{signUp ? copy.authPanel.signUpTitle : copy.authPanel.signInTitle}</Text> : null}
        <Text variant="body" tone="secondary">
          {signUp ? copy.authPanel.signUpBody : copy.authPanel.signInBody}
        </Text>
      </View>
      {signUp ? <TextField label={copy.auth.nameOptional} icon={User} value={name} onChangeText={setName} autoComplete="name" /> : null}
      <TextField label={copy.auth.email} icon={Mail} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" error={show(errors.email)} />
      <View style={styles.field}>
        <TextField label={copy.auth.password} icon={Lock} value={password} onChangeText={setPassword} secure autoComplete={signUp ? 'new-password' : 'current-password'} error={show(errors.password)} />
        {signUp ? <StrengthMeter password={password} /> : null}
      </View>
      {signUp ? (
        <View style={styles.row}>
          <Checkbox checked={terms} onChange={setTerms} label={copy.auth.termsA11y} error={Boolean(show(errors.terms))}>
            <Text variant="body">{copy.auth.terms}</Text>
          </Checkbox>
          {onTerms ? <Button variant="subtle" label={copy.auth.termsLink} onPress={onTerms} /> : null}
          {show(errors.terms) ? <FieldError message={errors.terms!} /> : null}
        </View>
      ) : (
        <Button variant="text" label={copy.auth.forgot} onPress={() => switchTo('reset')} />
      )}
      {notice ? (
        <Text variant="body" accessibilityLiveRegion="polite">
          {notice}
        </Text>
      ) : null}
      {unknown ? <InlineMessage title={copy.auth.errors.unknownTitle} body={copy.auth.errors.unknownBody} /> : null}
      <Button label={signUp ? copy.auth.create : copy.auth.signIn} fullWidth loading={loading} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: space.md },
  head: { gap: space.xxs },
  field: { gap: space.xs },
  row: { gap: space.xs },
  meter: { gap: space.xxs },
  segments: { flexDirection: 'row', gap: space.xxs },
  segment: { flex: 1, height: space.xs - space.xxs, borderRadius: radius.full },
  need: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
});
