// Layout plan. Job: ask for a password reset link (mocked: nothing is sent). Focal element: the email field, then the result.
// Quiet: the explanation. The result never says whether an account exists for the email (account enumeration), and says plainly that
// the demo sends nothing.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MailCheck from 'lucide-react-native/icons/mail-check';

import { copy } from '@copy';
import { validEmail } from '@state/profile';
import { size, space } from '@tokens';
import { Button, haptic, ScreenHeader, Text, TextField, useIconSize, useTheme } from '@ui';

export default function ForgotPassword() {
  const { color } = useTheme();
  const router = useRouter();
  const iconPx = useIconSize(size.icon);
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const error = validEmail(email) ? null : copy.auth.errors.email;

  const send = () => {
    setTouched(true);
    if (error) {
      haptic.warning();
      return;
    }
    haptic.success();
    setSent(true);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={copy.auth.forgotTitle} onBack={() => router.back()} />
        {sent ? (
          <View style={styles.sent} accessibilityLiveRegion="polite">
            <MailCheck color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
            <Text variant="heading" accessibilityRole="header" level={2}>
              {copy.auth.forgotSentTitle}
            </Text>
            <Text variant="body" tone="secondary">
              {copy.auth.forgotSentBody}
            </Text>
            <Button label={copy.auth.forgotBack} fullWidth onPress={() => router.back()} />
          </View>
        ) : (
          <>
            <Text variant="body" tone="secondary">
              {copy.auth.forgotBody}
            </Text>
            <TextField
              label={copy.auth.email}
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched(true)}
              error={touched ? error : null}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={send}
            />
            <Button label={copy.auth.forgotSend} fullWidth onPress={send} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
  sent: { gap: space.sm },
});
