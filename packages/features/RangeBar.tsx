// Layout plan. Job: show where one morning's forecast and feeling sit on the same 0-100 line. Focal element: the two markers.
// Quiet: the track and the likely range. Shape carries the meaning, never colour: a filled dot is the forecast, a ring is what was felt,
// and the thick segment is the likely range. Nothing here claims accuracy: it puts two numbers side by side.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { radius, size, space } from '@tokens';
import { Text, useTheme } from '@ui';

const pct = (v: number) => `${Math.min(100, Math.max(0, v))}%` as const;

export function RangeBar({ forecast, range, felt }: { forecast: number; range: [number, number]; felt: number }) {
  const { color } = useTheme();
  const half = -size.marker / 2;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.bar}
    >
      <View style={[styles.track, { backgroundColor: color.stroke.hairline }]} />
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
  bar: { height: size.touch / 2, justifyContent: 'center', marginHorizontal: size.marker / 2 },
  track: { height: size.outline, borderRadius: radius.full },
  range: { position: 'absolute', height: size.ringStroke, borderRadius: radius.full },
  marker: {
    position: 'absolute',
    width: size.marker,
    height: size.marker,
    borderRadius: radius.full,
    borderWidth: size.outline,
  },
  legendMarker: { width: size.marker, height: size.marker, borderRadius: radius.full, borderWidth: size.outline },
  legendRange: { width: size.icon, height: size.ringStroke, borderRadius: radius.full },
});
