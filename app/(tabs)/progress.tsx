// Placeholder. Progress (Plan Fit meter, Felt vs Measured) is built in P4.
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { space } from '@tokens';
import { ScreenHeader, Text, useTheme } from '@ui';

export default function Progress() {
  const { color } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScreenHeader title={copy.tabs.progress} />
      <Text variant="body" tone="secondary">
        {copy.placeholder.progress}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: space.margin, paddingTop: space.md, gap: space.md },
});
