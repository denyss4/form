// Layout plan. Job: prove fonts, tokens and the model run together on the device.
// Focal element: the score with its likely range. Quiet: everything else, one text link.
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { model, predict, toFormResult } from '@model';
import type { DailyLog } from '@model';
import example from '@model/example-input.json';
import { size, space } from '@tokens';
import { Text, useTheme } from '@ui';

// [GAP: /fixtures (Marta's week) is the demo data. This screen keeps the model kit's own example log as the P0 check.]
const result = toFormResult(predict(model, example as DailyLog));

export default function Hello() {
  const { color } = useTheme();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <Text variant="title" accessibilityRole="header">
        {copy.dev.appName}
      </Text>

      <View style={styles.score}>
        <Text variant="score">{result.score}</Text>
        <Text variant="caption" tone="secondary">
          {copy.range(result.range[0], result.range[1])}
        </Text>
      </View>

      <Text variant="body" tone="secondary">
        {copy.dev.exampleNote}
      </Text>

      <Link href="/gallery" asChild>
        <Pressable accessibilityRole="link" style={styles.link}>
          <Text variant="bodyStrong" style={styles.underline}>
            {copy.dev.galleryLink}
          </Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: space.margin, paddingTop: space.lg },
  score: { marginTop: space.xxl, marginBottom: space.xl },
  link: { marginTop: space.lg, minHeight: size.touch, justifyContent: 'center', alignSelf: 'flex-start' },
  underline: { textDecorationLine: 'underline' },
});
