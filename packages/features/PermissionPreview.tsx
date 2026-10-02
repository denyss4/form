// Layout plan. Job: ask for one permission, clearly as a preview. Focal element: the primary action. Quiet: the preview note.
// Both mocked permission screens (Health data, calendar changes) use this. Nothing is connected: a preview says so at the top, and
// pressing Allow shows what would happen, then says plainly that nothing did (MASTER_PROMPT §8: "screens only, clearly mocked").
// States: default, loading (over 1 s: an indeterminate indicator and a plain line; a static icon under reduced motion), done, error
// (what happened and what to do), and consent off. The indicator is a decided exception to "no loops" (DECISIONS.md): there is no real progress to show.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { space } from '@tokens';
import { Button, FluxLoader, InlineMessage, oneOf, ScreenHeader, Text, useTheme } from '@ui';

export interface PermissionCopy {
  title: string;
  preview: string;
  body: string;
  allow: string;
  notNow: string;
  reading: string;
  done: { title: string; body: string; action: string };
  error: { title: string; body: string; retry: string; without: string };
  off: { title: string; body: string; settings: string };
}

const views = ['auto', 'default', 'loading', 'done', 'error', 'off'] as const;
const CONNECT_MS = 1400; // the mock takes a moment

export function PermissionPreview({
  copy,
  blocked,
  route,
}: {
  copy: PermissionCopy;
  /** True when the related consent is off. The screen then points to Settings. */
  blocked: boolean;
  /** This screen's own route, so "Try again" can clear a held state. */
  route: string;
}) {
  const { color } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string; motion?: string }>();
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // ?state=... holds a view for review. Otherwise the screen follows the real flow.
  const forced = oneOf(params.state, views, 'auto');
  const view = forced !== 'auto' ? forced : blocked ? 'off' : phase === 'idle' ? 'default' : phase;

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/profile'));

  const allow = () => {
    setPhase('loading');
    timer.current = setTimeout(() => setPhase('done'), CONNECT_MS);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={copy.title} onBack={leave} />
        <Text variant="bodyStrong">{copy.preview}</Text>

        {view === 'loading' ? (
          <View style={styles.progress}>
            <FluxLoader label={copy.reading} />
          </View>
        ) : view === 'done' ? (
          <View style={styles.group} aria-live="polite">
            <Text variant="heading" accessibilityRole="header" level={2}>
              {copy.done.title}
            </Text>
            <Text variant="body" tone="secondary">
              {copy.done.body}
            </Text>
            <Button label={copy.done.action} onPress={leave} />
          </View>
        ) : view === 'error' ? (
          <InlineMessage title={copy.error.title} body={copy.error.body}>
            <View style={styles.actions}>
              <Button label={copy.error.retry} onPress={() => router.replace(route)} />
              <Button variant="text" label={copy.error.without} onPress={leave} />
            </View>
          </InlineMessage>
        ) : view === 'off' ? (
          <InlineMessage title={copy.off.title} body={copy.off.body}>
            <View style={styles.actions}>
              <Button label={copy.off.settings} onPress={() => router.replace('/privacy')} />
            </View>
          </InlineMessage>
        ) : (
          <>
            <Text variant="body" tone="secondary">
              {copy.body}
            </Text>
            <View style={styles.actions}>
              {/* Allow and Not now look the same: a consent must be as easy to decline as to give (MASTER_PROMPT §7, GDPR Art. 9). */}
              <Button variant="secondary" label={copy.allow} fullWidth onPress={allow} />
              <Button variant="secondary" label={copy.notNow} fullWidth onPress={leave} />
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
  actions: { marginTop: space.md, gap: space.xs },
  group: { marginTop: space.lg, gap: space.sm, alignItems: 'flex-start' },
  progress: { marginTop: space.xl, gap: space.sm, alignItems: 'flex-start' },
});
