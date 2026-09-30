import { Stack } from 'expo-router';

import { DevSettingsProvider, useTheme } from '@ui';

function GalleryStack() {
  const { color } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg.canvas } }} />
  );
}

// The gallery owns the dev theme and text-size settings, shared by every page in it.
export default function GalleryLayout() {
  return (
    <DevSettingsProvider>
      <GalleryStack />
    </DevSettingsProvider>
  );
}
