import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { lightColor } from '@tokens';
import { ThemeProvider } from '@ui';

export default function RootLayout() {
  // Five static files, one family name per weight (see packages/tokens `font`).
  const [loaded, error] = useFonts({
    'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope-ExtraBold.ttf'),
    'SourceSans3-Regular': require('../assets/fonts/SourceSans3-Regular.ttf'),
    'SourceSans3-SemiBold': require('../assets/fonts/SourceSans3-SemiBold.ttf'),
  });

  if (error) console.warn('Font load failed, falling back to system fonts:', error);

  // Hold on the canvas colour until the fonts are ready, so text never flashes in a fallback face.
  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: lightColor.bg.canvas }} />;
  }

  // Light is the primary theme. The gallery layers its own dev theme on top.
  return (
    <ThemeProvider scheme="light">
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: lightColor.bg.canvas },
        }}
      />
    </ThemeProvider>
  );
}
