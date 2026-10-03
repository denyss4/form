import { useFonts } from 'expo-font';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { setLanguage } from '@copy';
import { LaunchScreen } from '@features/LaunchScreen';
import { AppStateProvider } from '@state';
import { darkColor, lightColor, size } from '@tokens';
import { LanguageKey, oneOf, TextScaleContext, ThemeProvider } from '@ui';

export default function RootLayout() {
  // Review only, web preview: ?scale=2 imitates a larger system text size on any screen; ?theme=light shows the light theme;
  // ?launch=0.4 holds the launch screen at 40% of its assembly; ?lang=pl opens the app in Polish.
  const { scale, theme, launch, lang } = useGlobalSearchParams<{ scale?: string; theme?: string; launch?: string; lang?: string }>();
  useEffect(() => {
    if (lang === 'pl' || lang === 'en') setLanguage(lang);
  }, [lang]);
  const hold = launch === undefined || Number.isNaN(Number(launch)) ? undefined : Math.min(Math.max(Number(launch), 0), 1);
  const textScale = oneOf(scale, [1, 1.5, 2, 3], 1);
  const scheme = oneOf(theme, ['light', 'dark'] as const, 'dark');
  const palette = scheme === 'light' ? lightColor : darkColor;

  // Five static files, one family name per weight (see packages/tokens `font`).
  const [loaded, error] = useFonts({
    'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope-ExtraBold.ttf'),
    'SourceSans3-Regular': require('../assets/fonts/SourceSans3-Regular.ttf'),
    'SourceSans3-SemiBold': require('../assets/fonts/SourceSans3-SemiBold.ttf'),
  });

  // Web only: the tab bar is drawn by the navigation library and shows no focus indicator, so add one (WCAG 2.4.7).
  // Our own controls draw a ring instead, so the browser's default outline is switched off on them to avoid a double indicator.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const style = document.createElement('style');
    style.textContent =
      `[role="tab"]:focus-visible { outline: ${size.outline}px solid ${palette.text.primary}; outline-offset: -${size.outline}px; }` +
      `[role="button"]:focus-visible, [role="radio"]:focus-visible, [role="link"]:focus-visible, [role="slider"]:focus-visible { outline: none; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [palette]);

  if (error) console.warn('Font load failed, falling back to system fonts:', error);
  const ready = loaded || !!error;
  // The launch screen (D5) covers the start: the logo assembles while the fonts load, then it fades into the app. The app mounts only once
  // the fonts are ready, so text never flashes in a fallback face; the launch screen stays mounted across that switch, so it plays once.
  const [launching, setLaunching] = useState(true);

  // Dark is the app theme (user decision, 1 Oct 2026). The gallery layers its own dev theme on top.
  return (
    <AppStateProvider>
      <ThemeProvider scheme={scheme}>
        <TextScaleContext.Provider value={textScale}>
          <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
          <View style={[styles.root, { backgroundColor: palette.bg.canvas }]}>
            {ready ? (
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: palette.bg.canvas },
                }}
                // Each screen redraws in the new language when it changes on Profile (D5), without losing the navigation stack.
                screenLayout={({ children }) => <LanguageKey>{children}</LanguageKey>}
              />
            ) : null}
            {launching ? <LaunchScreen ready={ready} hold={hold} onDone={() => setLaunching(false)} /> : null}
          </View>
        </TextScaleContext.Provider>
      </ThemeProvider>
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
