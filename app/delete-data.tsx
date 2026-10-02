// Layout plan. Job: erase everything Form holds on this phone (GDPR Art. 17). Focal element: the destructive action. Quiet: the body.
// Destructive: text-only in Status Over, behind a confirmation sheet whose Cancel is as easy as Delete (CLAUDE.md). It really clears the
// in-memory state, and Form starts again at Welcome.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { useAppState } from '@state';
import { space } from '@tokens';
import { Button, haptic, ScreenHeader, Sheet, Text, useTheme } from '@ui';

export default function DeleteData() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const [confirming, setConfirming] = useState(false);

  const erase = () => {
    setConfirming(false);
    haptic.warning();
    app.deleteData();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.privacy.deleteTitle} onBack={() => router.back()} />
        <Text variant="body" tone="secondary">
          {copy.privacy.deleteBody}
        </Text>
        <Button variant="destructive" label={copy.privacy.deleteAction} onPress={() => setConfirming(true)} />
      </ScrollView>
      <Sheet visible={confirming} onClose={() => setConfirming(false)} title={copy.privacy.deleteConfirmTitle}>
        <Text variant="body">{copy.privacy.deleteConfirmBody}</Text>
        <View style={styles.actions}>
          <Button variant="secondary" label={copy.privacy.cancel} fullWidth onPress={() => setConfirming(false)} />
          <Button variant="destructive" label={copy.privacy.deleteConfirm} onPress={erase} />
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
  actions: { gap: space.xs },
});
