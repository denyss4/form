// Layout plan. Job: verify Polish glyphs and digit widths in every family and weight in use.
// Focal element: the Polish sample. Quiet: labels in caption.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { space, type, type TypeToken } from '@tokens';
import { GalleryScreen, Section, Text } from '@ui';

const tokens = Object.keys(type) as TypeToken[];
// Tabular figures keep every digit the same width, so both probe lines must come out equally wide.
const probeTokens: TypeToken[] = ['score', 'body', 'bodyStrong'];

export default function TypeCheck() {
  return (
    <GalleryScreen title={copy.dev.typeTitle} note={copy.dev.typeNote}>
      {tokens.map((token) => (
        <View key={token} style={styles.group}>
          <Text variant="caption" tone="secondary">
            {token}, {String(type[token].fontFamily)}, {type[token].fontSize}/{type[token].lineHeight}
          </Text>
          <Text variant={token}>{copy.dev.polishSample}</Text>
          <Text variant={token}>{copy.dev.digitsSample}</Text>
        </View>
      ))}

      <Section title={copy.dev.probeTitle}>
        {probeTokens.map((token) => (
          <View key={`probe-${token}`} style={styles.group}>
            <Text variant="caption" tone="secondary">
              {token}
            </Text>
            {copy.dev.widthProbe.map((line) => (
              <Text key={line} variant={token} tabular>
                {line}
              </Text>
            ))}
          </View>
        ))}
      </Section>
    </GalleryScreen>
  );
}

const styles = StyleSheet.create({
  group: { gap: space.xxs },
});
