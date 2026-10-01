import { useFonts } from 'expo-font';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';

import { AppStateProvider } from '@state';
import { darkColor, size } from '@tokens';
import { oneOf, TextScaleContext, ThemeProvider } from '@ui';

export default function RootLayout() {
  // Review only, web preview: ?scale=2 imitates a larger system text size on any screen.
  const { scale } = useGlobalSearchParams<{ scale?: string }>();
  const textScale = oneOf(scale, [1, 1.5, 2, 3], 1);

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
      `[role="tab"]:focus-visible { outline: ${size.outline}px solid ${darkColor.text.primary}; outline-offset: -${size.outline}px; }` +
      `[role="button"]:focus-visible, [role="radio"]:focus-visible, [role="link"]:focus-visible, [role="slider"]:focus-visible { outline: none; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  if (error) console.warn('Font load failed, falling back to system fonts:', error);

  // Hold on the canvas colour until the fonts are ready, so text never flashes in a fallback face.
  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: darkColor.bg.canvas }} />;
  }

  // Dark is the app theme (user decision, 1 Oct 2026). The gallery layers its own dev theme on top.
  return (
    <AppStateProvider>
      <ThemeProvider scheme="dark">
        <TextScaleContext.Provider value={textScale}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: darkColor.bg.canvas },
            }}
          />
        </TextScaleContext.Provider>
      </ThemeProvider>
    </AppStateProvider>
  );
}
