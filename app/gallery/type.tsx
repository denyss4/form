// Layout plan. Job: verify Polish glyphs and digit widths in every family and weight in use.
// Focal element: the Polish sample. Quiet: labels in caption.
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { color, space, type } from '@tokens';
import type { TypeToken } from '@tokens';

const tokens = Object.keys(type) as TypeToken[];
// Tabular figures keep every digit the same width, so both probe lines must come out equally wide.
const probeTokens: TypeToken[] = ['score', 'body', 'bodyStrong'];

export default function TypeCheck() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={[type.title, styles.ink]}>
          {copy.dev.typeTitle}
        </Text>
        <Text style={[type.body, styles.secondary]}>{copy.dev.typeNote}</Text>

        {tokens.map((token) => (
          <View key={token} style={styles.group}>
            <Text style={[type.caption, styles.secondary]}>
              {token}, {String(type[token].fontFamily)}
            </Text>
            <Text style={[type[token], styles.ink]}>{copy.dev.polishSample}</Text>
            <Text style={[type[token], styles.ink]}>{copy.dev.digitsSample}</Text>
          </View>
        ))}

        {probeTokens.map((token) => (
          <View key={`probe-${token}`} style={styles.group}>
            <Text style={[type.caption, styles.secondary]}>{token}, digit width probe</Text>
            {copy.dev.widthProbe.map((line) => (
              <Text key={line} style={[type[token], styles.ink]}>
                {line}
              </Text>
            ))}
          </View>
        ))}

        <Link href="/" style={[type.bodyStrong, styles.link]}>
          {copy.dev.back}
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg.canvas },
  content: {
    paddingHorizontal: space.margin,
    paddingTop: space.lg,
    paddingBottom: space.xxl,
  },
  group: { marginTop: space.xl },
  ink: { color: color.text.primary },
  secondary: { color: color.text.secondary },
  link: {
    marginTop: space.xl,
    paddingVertical: space.sm,
    color: color.text.primary,
    textDecorationLine: 'underline',
  },
});
