// Layout plan. Job: prove the model runs on the device. Focal element: the score. Quiet: the note.
// The P0 check, kept for the demo phone: the model kit's own example log run through predict() on the device.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { model, predict, toFormResult } from '@model';
import type { DailyLog } from '@model';
import example from '@model/example-input.json';
import { space } from '@tokens';
import { GalleryScreen, Text } from '@ui';

const result = toFormResult(predict(model, example as DailyLog));

export default function ModelCheck() {
  return (
    <GalleryScreen title={copy.dev.model.title} note={copy.dev.model.note}>
      <View style={styles.score}>
        <Text variant="score">{result.score}</Text>
        <Text variant="caption" tone="secondary">
          {copy.range(result.range[0], result.range[1])}
        </Text>
      </View>
      <Text variant="body" tone="secondary">
        {copy.dev.exampleNote}
      </Text>
    </GalleryScreen>
  );
}

const styles = StyleSheet.create({
  score: { marginTop: space.lg },
});
