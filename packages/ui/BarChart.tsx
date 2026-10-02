// Layout plan. Job: show a value per day over the week (REDESIGN-PROMPT §6 bar chart, rebuilt in react-native-svg). Focal element: the
// bars. Quiet: the axis and its gridlines.
// One bar per data point, flat tops, a vertical axis with three labelled gridlines (min, middle, max), day letters under the bars.
// Bars are Data Muted (chart.neutral, 7.24:1 on canvas): non-plan data only, never next to Iris (CLAUDE.md). Gridlines are hairlines.
// Screen readers hear the whole chart as one sentence with every value, so nothing is only visual.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import { chromeMaxFontScale, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

export interface Bar {
  key: string;
  label: string; // under the bar, e.g. "M"
  value: number;
}

const CHART_HEIGHT = space.xxxl * 2; // 128 pt of plot
const AXIS_WIDTH = space.xl; // room for "100"
const BAR_SHARE = 0.56; // of each column; the rest is the gap

export function BarChart({ bars, max, a11yLabel }: { bars: Bar[]; max: number; a11yLabel: string }) {
  const { color } = useTheme();
  const [width, setWidth] = useState(0);
  const plot = Math.max(width - AXIS_WIDTH, 0);
  const column = plot / Math.max(bars.length, 1);
  const barWidth = column * BAR_SHARE;
  const y = (v: number) => CHART_HEIGHT - (Math.min(Math.max(v, 0), max) / max) * CHART_HEIGHT;
  const ticks = [max, max / 2, 0];

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={a11yLabel} style={styles.wrap}>
      <View style={styles.plotRow} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <View style={[styles.axis, { height: CHART_HEIGHT }]}>
          {ticks.map((t) => (
            <Text
              key={t}
              variant="caption"
              tone="secondary"
              tabular
              maxFontSizeMultiplier={chromeMaxFontScale}
              style={[styles.tick, { top: y(t) - size.iconSm / 2 }]}
            >
              {t}
            </Text>
          ))}
        </View>
        {plot > 0 ? (
          <Svg width={plot} height={CHART_HEIGHT}>
            {ticks.map((t) => (
              <Line key={t} x1={0} x2={plot} y1={y(t)} y2={y(t)} stroke={color.stroke.hairline} strokeWidth={size.hairline} />
            ))}
            {bars.map((b, i) => (
              <Rect
                key={b.key}
                x={i * column + (column - barWidth) / 2}
                y={y(b.value)}
                width={barWidth}
                height={CHART_HEIGHT - y(b.value)}
                fill={color.chart.neutral}
                // Flat tops: no rounding, so the top edge reads exactly at its value.
                rx={0}
              />
            ))}
          </Svg>
        ) : null}
      </View>
      <View style={[styles.labels, { marginLeft: AXIS_WIDTH }]}>
        {bars.map((b) => (
          <Text key={b.key} variant="caption" tone="secondary" maxFontSizeMultiplier={chromeMaxFontScale} style={styles.label}>
            {b.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  plotRow: { flexDirection: 'row' },
  axis: { width: AXIS_WIDTH },
  tick: { position: 'absolute', left: 0, lineHeight: size.iconSm },
  labels: { flexDirection: 'row' },
  label: { flex: 1, textAlign: 'center' },
});
