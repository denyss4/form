// Layout plan. Job: change the account's email (mocked, in memory). Focal element: the field. Quiet: the current email.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { useAppState } from '@state';
import { validEmail } from '@state/profile';
import { space } from '@tokens';
import { announce, Button, haptic, ScreenHeader, Text, TextField, useTheme } from '@ui';

export default function ChangeEmail() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const error = validEmail(email) ? null : copy.auth.errors.email;

  const save = () => {
    setTouched(true);
    if (error) {
      haptic.warning();
      return;
    }
    app.changeEmail(email);
    haptic.success();
    announce(copy.accountScreens.emailSaved);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={copy.accountScreens.emailTitle} onBack={() => router.back()} />
        {app.account ? (
          <Text variant="body" tone="secondary">
            {app.account.email}
          </Text>
        ) : null}
        <TextField
          label={copy.accountScreens.newEmail}
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched(true)}
          error={touched ? error : null}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
        />
        <Button label={copy.accountScreens.emailSave} fullWidth onPress={save} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
});
