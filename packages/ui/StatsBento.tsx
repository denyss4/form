// D5 (the user's pick), stats bento): the web's 6-column bento folded into a phone grid. A large tile across the full width (a chip, a big
// number, one line), a tile with a mini bar chart, and two small tiles side by side. Raised tiles with a hairline edge; the large tile
// carries the original's fine diagonal hatch, fading out towards the bottom left.
// The original paints the large tile in the brand colour; Form keeps sage for the one action on a screen (CLAUDE.md), so the large tile
// is raised with the hatch in the control stroke. Sentence case, not the original's uppercase.
import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Defs, G, Line, LinearGradient, Mask, Rect, Stop } from 'react-native-svg';

import { radius, scoreMaxFontScale, size, space } from '@tokens';

import { FillSvg } from './FillSvg';
import { Text } from './Text';
import { useTheme } from './theme';

export interface BentoData {
  chip: string;
  big: string;
  line: string;
  barsLabel: string;
  barsValue: string;
  bars: number[]; // 0-100
  small: { value: string; label: string }[]; // two
}

const HATCH = space.sm - space.xxs; // 8 pt between hatch lines

function Hatch() {
  const { color } = useTheme();
  const lines: ReactElement[] = [];
  for (let i = -40; i < 80; i++) lines.push(<Line key={i} x1={i * HATCH} y1={0} x2={i * HATCH + 400} y2={400} stroke={color.stroke.control} strokeWidth={size.hairline} />);
  return (
    <FillSvg>
      {({ width, height }) => (
        <>
          <Defs>
            <LinearGradient id="hatch-fade" x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color.text.primary} stopOpacity={0.35} />
              <Stop offset="0.7" stopColor={color.text.primary} stopOpacity={0} />
            </LinearGradient>
            <Mask id="hatch-mask">
              <Rect width={width} height={height} fill="url(#hatch-fade)" />
            </Mask>
          </Defs>
          <G mask="url(#hatch-mask)">{lines}</G>
        </>
      )}
    </FillSvg>
  );
}

export function StatsBento({ data }: { data: BentoData }) {
  const { color } = useTheme();
  const tile = [styles.tile, { backgroundColor: color.bg.raised, borderColor: color.stroke.hairline }];
  return (
    <View style={styles.grid}>
      {/* Each tile is one sentence for screen readers; the hatch and the mini bars are decoration. */}
      <View accessible accessibilityLabel={`${data.chip}: ${data.big} ${data.line}`} style={[tile, styles.big]}>
        <Hatch />
        <View style={[styles.chip, { backgroundColor: color.bg.sunken }]}>
          <Text variant="caption" tone="secondary">
            {data.chip}
          </Text>
        </View>
        <Text variant="score" tabular maxFontSizeMultiplier={scoreMaxFontScale}>
          {data.big}
        </Text>
        <Text variant="body" tone="secondary">
          {data.line}
        </Text>
      </View>
      <View accessible accessibilityLabel={`${data.barsLabel}: ${data.barsValue}`} style={[tile, styles.wide]}>
        <View style={styles.grow}>
          <Text variant="caption" tone="secondary">
            {data.barsLabel}
          </Text>
          <Text variant="title" tabular>
            {data.barsValue}
          </Text>
        </View>
        <View style={styles.bars}>
          {data.bars.map((h, i) => (
            <View key={i} style={[styles.bar, { height: `${Math.max(h, 8)}%`, backgroundColor: color.text.primary }]} />
          ))}
        </View>
      </View>
      <View style={styles.pair}>
        {data.small.map((s) => (
          <View key={s.label} accessible accessibilityLabel={`${s.value} ${s.label}`} style={[tile, styles.small]}>
            <Text variant="title" tabular>
              {s.value}
            </Text>
            <Text variant="caption" tone="secondary" style={styles.centre}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space.sm },
  tile: { borderRadius: radius.sheet, borderWidth: size.hairline, padding: space.lg, overflow: 'hidden' },
  big: { gap: space.sm, minHeight: space.xxxl * 3 },
  chip: { alignSelf: 'flex-start', borderRadius: radius.full, paddingHorizontal: space.sm, paddingVertical: space.xxs },
  wide: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: space.xxs, height: space.xl },
  bar: { width: size.outline * 3, borderRadius: radius.full },
  pair: { flexDirection: 'row', gap: space.sm },
  small: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.xxs },
  centre: { textAlign: 'center' },
  grow: { flex: 1 },
});
