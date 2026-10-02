// Layout plan. Job: delete the account in the app (App Store 5.1.1(v): required wherever accounts can be made). Focal element: the
// confirmation field. Quiet: the body. Destructive, confirmed by typing DELETE (REDESIGN-PROMPT §5); the action stays disabled until it
// matches. The plan and logs stay on this phone, and Form keeps working as a guest.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { useAppState } from '@state';
import { space } from '@tokens';
import { announce, Button, haptic, ScreenHeader, Text, TextField, useTheme } from '@ui';

export default function DeleteAccount() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const [typed, setTyped] = useState('');
  const [touched, setTouched] = useState(false);
  const matches = typed.trim() === copy.accountScreens.deleteWord;

  const erase = () => {
    if (!matches) {
      setTouched(true);
      haptic.warning();
      return;
    }
    app.deleteAccount();
    haptic.warning();
    announce(copy.accountScreens.deleted);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={copy.accountScreens.deleteTitle} onBack={() => router.back()} />
        <Text variant="body" tone="secondary">
          {copy.accountScreens.deleteBody}
        </Text>
        <TextField
          label={copy.accountScreens.deleteType}
          value={typed}
          onChangeText={setTyped}
          onBlur={() => setTouched(true)}
          hint={copy.accountScreens.deleteHint}
          error={touched && !matches ? copy.accountScreens.deleteMismatch : null}
          autoCapitalize="characters"
        />
        <Button variant="destructive" label={copy.accountScreens.deleteAction} disabled={!matches} onPress={erase} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
});
