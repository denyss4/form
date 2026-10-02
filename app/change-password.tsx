// Layout plan. Job: change the password (mocked: both fields are checked for length, and no password is ever kept). Focal element: the
// two fields. Quiet: the hint.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { MIN_PASSWORD } from '@state/profile';
import { space } from '@tokens';
import { announce, Button, haptic, ScreenHeader, TextField, useTheme } from '@ui';

export default function ChangePassword() {
  const { color } = useTheme();
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [touched, setTouched] = useState({ current: false, next: false });
  const errors = {
    current: current.length >= MIN_PASSWORD ? null : copy.auth.errors.password,
    next: next.length >= MIN_PASSWORD ? null : copy.auth.errors.password,
  };

  const save = () => {
    setTouched({ current: true, next: true });
    if (errors.current || errors.next) {
      haptic.warning();
      return;
    }
    haptic.success();
    announce(copy.accountScreens.passwordSaved);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={copy.accountScreens.passwordTitle} onBack={() => router.back()} />
        <View style={styles.fields}>
          <TextField
            label={copy.accountScreens.current}
            value={current}
            onChangeText={setCurrent}
            onBlur={() => setTouched((t) => ({ ...t, current: true }))}
            error={touched.current ? errors.current : null}
            secure
            autoComplete="current-password"
            textContentType="password"
            autoCapitalize="none"
          />
          <TextField
            label={copy.accountScreens.next}
            value={next}
            onChangeText={setNext}
            onBlur={() => setTouched((t) => ({ ...t, next: true }))}
            hint={copy.auth.passwordHint}
            error={touched.next ? errors.next : null}
            secure
            autoComplete="new-password"
            textContentType="newPassword"
            autoCapitalize="none"
          />
        </View>
        <Button label={copy.accountScreens.passwordSave} fullWidth onPress={save} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
  fields: { gap: space.md },
});
