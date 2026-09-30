// Placeholder. Today is built in P3 (ScoreDial on the plan field, drivers, plan, Accept plan).
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { space } from '@tokens';
import { ScreenHeader, Text, useTheme } from '@ui';

export default function Today() {
  const { color } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScreenHeader title={copy.tabs.today} />
      <Text variant="body" tone="secondary">
        {copy.placeholder.today}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: space.margin, paddingTop: space.md, gap: space.md },
});
