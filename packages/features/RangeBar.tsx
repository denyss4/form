// Layout plan. Job: show where one morning's forecast and feeling sit on the same 0-100 line. Focal element: the two markers.
// Quiet: the track and the likely range. Shape carries the meaning, never colour: a filled dot is the forecast, a ring is what was felt,
// and the thick segment is the likely range. Nothing here claims accuracy: it puts two numbers side by side.
// D5 (the user: "use the new bar to all bars on the app"): the shared slider look. A thick sunken track with a hairline edge, the likely
// range as a band of the same thickness in the control stroke, and 20 pt markers, the size of the slider's thumb.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { radius, size, space } from '@tokens';
import { SLIDER_THUMB, Text, useTheme } from '@ui';

const TRACK = space.xs; // 8 pt, as SliderTrack

const pct = (v: number) => `${Math.min(100, Math.max(0, v))}%` as const;

export function RangeBar({ forecast, range, felt }: { forecast: number; range: [number, number]; felt: number }) {
  const { color } = useTheme();
  const half = -SLIDER_THUMB / 2;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.bar}
    >
      <View style={[styles.track, { backgroundColor: color.bg.sunken, borderColor: color.stroke.hairline }]} />
      <View
        style={[
          styles.range,
          { left: pct(range[0]), width: pct(range[1] - range[0]), backgroundColor: color.stroke.control },
        ]}
      />
      <View
        style={[
          styles.marker,
          { left: pct(forecast), backgroundColor: color.text.primary, borderColor: color.text.primary },
          { transform: [{ translateX: half }] },
        ]}
      />
      <View
        style={[
          styles.marker,
          { left: pct(felt), backgroundColor: color.bg.canvas, borderColor: color.text.primary },
          { transform: [{ translateX: half }] },
        ]}
      />
    </View>
  );
}

/** The same three shapes, small, for the legend. */
export function LegendShape({ kind }: { kind: 'forecast' | 'felt' | 'range' }) {
  const { color } = useTheme();
  if (kind === 'range') {
    return <View style={[styles.legendRange, { backgroundColor: color.stroke.control }]} />;
  }
  return (
    <View
      style={[
        styles.legendMarker,
        {
          backgroundColor: kind === 'forecast' ? color.text.primary : color.bg.canvas,
          borderColor: color.text.primary,
        },
      ]}
    />
  );
}

/** Forecast, felt and likely range, each with its shape. */
export function RangeLegend() {
  const items = [
    ['forecast', copy.feltVsForecast.legend.forecast],
    ['felt', copy.feltVsForecast.legend.felt],
    ['range', copy.feltVsForecast.legend.range],
  ] as const;
  return (
    <View style={styles.legend}>
      {items.map(([kind, label]) => (
        <View key={kind} style={styles.legendItem}>
          <LegendShape kind={kind} />
          <Text variant="caption">{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space.md, rowGap: space.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  bar: { height: size.touch / 2, justifyContent: 'center', marginHorizontal: SLIDER_THUMB / 2 },
  track: { height: TRACK, borderRadius: radius.full, borderWidth: size.hairline },
  range: { position: 'absolute', height: TRACK, borderRadius: radius.full },
  marker: {
    position: 'absolute',
    width: SLIDER_THUMB,
    height: SLIDER_THUMB,
    borderRadius: radius.full,
    borderWidth: size.outline,
  },
  legendMarker: { width: size.marker, height: size.marker, borderRadius: radius.full, borderWidth: size.outline },
  legendRange: { width: size.icon, height: TRACK, borderRadius: radius.full },
});
