// Layout plan. Job: get a copy of my data (GDPR Art. 20), mocked. Focal element: the action. Quiet: the demo result.
// The result says plainly that no file is made in the demo.
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FileCheck from 'lucide-react-native/icons/file-check';

import { copy } from '@copy';
import { size, space } from '@tokens';
import { announce, Button, haptic, ScreenHeader, Text, useIconSize, useTheme } from '@ui';

const EXPORT_MS = 900; // the mock export takes a moment, so the loading state is real

export default function ExportData() {
  const { color } = useTheme();
  const router = useRouter();
  const iconPx = useIconSize(size.icon);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const start = () => {
    setPhase('loading');
    timer.current = setTimeout(() => {
      setPhase('done');
      haptic.success();
      announce(copy.privacy.exportDoneTitle);
    }, EXPORT_MS);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.privacy.exportTitle} onBack={() => router.back()} />
        <Text variant="body" tone="secondary">
          {copy.privacy.exportBody}
        </Text>
        {phase === 'done' ? (
          <View style={styles.done}>
            <FileCheck color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
            <Text variant="bodyStrong">{copy.privacy.exportDoneTitle}</Text>
            <Text variant="body" tone="secondary">
              {copy.privacy.exportDoneBody}
            </Text>
          </View>
        ) : (
          <Button label={copy.privacy.exportAction} fullWidth loading={phase === 'loading'} onPress={start} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.lg },
  done: { gap: space.xs },
});
