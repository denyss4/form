// Layout plan. Job: get read access to one calendar (mocked). Focal element: the primary action. Quiet: the demo note.
// States: default, loading (over 1 s: progress plus a plain line), error (says what happened and what to do), calendar consent off.
// [GAP G10: the provider name is a proposal. It is text only: no logo, no imitation of the provider's own sign-in.]
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { useAppState } from '@state';
import { space } from '@tokens';
import { Button, InlineMessage, oneOf, ScreenHeader, Text, useTheme } from '@ui';

const views = ['auto', 'default', 'loading', 'error', 'off'] as const;
const CONNECT_MS = 1400; // the mock sign-in takes a moment

export default function ConnectCalendar() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const params = useLocalSearchParams<{ state?: string }>();
  const [phase, setPhase] = useState<'idle' | 'loading'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // ?state=... holds a view for review. Otherwise the screen follows the real flow.
  const forced = oneOf(params.state, views, 'auto');
  const view =
    forced !== 'auto'
      ? forced
      : app.consents.calendar === 'decline'
        ? 'off'
        : phase === 'loading'
          ? 'loading'
          : 'default';

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/week'));
  const withoutCalendar = () => router.replace('/week');

  const allow = () => {
    setPhase('loading');
    timer.current = setTimeout(() => {
      app.connectCalendar();
      router.replace('/week');
    }, CONNECT_MS);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.calendar.title} onBack={view === 'loading' ? undefined : leave} />

        {view === 'loading' ? (
          <View style={styles.progress} accessibilityRole="progressbar" accessibilityLabel={copy.calendar.reading}>
            <ActivityIndicator color={color.text.primary} />
            <Text variant="bodyStrong">{copy.calendar.reading}</Text>
            <Text variant="caption" tone="secondary">
              {copy.calendar.readingNote}
            </Text>
          </View>
        ) : view === 'error' ? (
          <InlineMessage title={copy.calendar.error.title} body={copy.calendar.error.body}>
            <View style={styles.actions}>
              <Button label={copy.calendar.error.retry} onPress={() => router.replace('/connect-calendar')} />
              <Button variant="text" label={copy.calendar.error.without} onPress={withoutCalendar} />
            </View>
          </InlineMessage>
        ) : view === 'off' ? (
          <InlineMessage title={copy.calendar.off.title} body={copy.calendar.off.body}>
            <View style={styles.actions}>
              <Button label={copy.calendar.off.settings} onPress={() => router.push('/settings')} />
              <Button variant="text" label={copy.calendar.off.without} onPress={withoutCalendar} />
            </View>
          </InlineMessage>
        ) : (
          <>
            <Text variant="body" tone="secondary">
              {copy.calendar.body}
            </Text>
            <View style={styles.provider}>
              <Text variant="bodyStrong">{copy.calendar.provider}</Text>
              <Text variant="caption" tone="secondary">
                {copy.calendar.mockNote}
              </Text>
            </View>
            <View style={styles.actions}>
              <Button label={copy.calendar.allow} fullWidth onPress={allow} />
              <Button variant="text" label={copy.calendar.skip} onPress={withoutCalendar} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.lg, gap: space.md },
  provider: { marginTop: space.md, gap: space.xxs },
  actions: { marginTop: space.md, gap: space.xs },
  progress: { marginTop: space.xl, gap: space.sm, alignItems: 'flex-start' },
});
