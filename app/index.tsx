// Layout plan. Job: prove fonts, tokens and the model run together on the device.
// Focal element: the score with its likely range. Quiet: everything else, one text link.
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { model, predict, toFormResult } from '@model';
import type { DailyLog } from '@model';
import example from '@model/example-input.json';
import { color, space, type } from '@tokens';

// [GAP: /fixtures (Marta's week) does not exist yet. This is the model kit's own example log.]
const result = toFormResult(predict(model, example as DailyLog));

export default function Hello() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text accessibilityRole="header" style={[type.title, styles.ink]}>
        {copy.dev.appName}
      </Text>

      <View style={styles.score}>
        <Text style={[type.score, styles.ink]}>{result.score}</Text>
        <Text style={[type.caption, styles.secondary]}>
          {copy.range(result.range[0], result.range[1])}
        </Text>
      </View>

      <Text style={[type.body, styles.secondary]}>{copy.dev.exampleNote}</Text>

      <Link href="/gallery/type" style={[type.bodyStrong, styles.link]}>
        {copy.dev.typeLink}
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: space.margin,
    paddingTop: space.lg,
    backgroundColor: color.bg.canvas,
  },
  score: { marginTop: space.xxl, marginBottom: space.xl },
  ink: { color: color.text.primary },
  secondary: { color: color.text.secondary },
  link: {
    marginTop: space.lg,
    paddingVertical: space.sm, // 12 + 24 line + 12 = 48 touch target
    color: color.text.primary,
    textDecorationLine: 'underline',
  },
});
