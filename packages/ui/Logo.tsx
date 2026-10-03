// The Form logo (D5, from the user's Logos/form-white.svg): a slanted geometric wordmark, F O R M, drawn in Text High on the dark theme.
// The paths are the user's file, unchanged, split into the strokes each letter is built from, so the logo can assemble itself:
// stems rise into place along the logo's own slant, bars slide in from the left, the O settles from 0.9. One progress value (0 to 1)
// drives every stroke in reading order, so a screen can play it, hold it (?at=) or show it finished.
// Used by the launch screen (centred, the assembly) and Welcome (the finished logo). Screen readers hear the word "Form", once.
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import Svg, { Path, Polygon } from 'react-native-svg';

import { space } from '@tokens';

import { useTheme } from './theme';

const VIEW_W = 261.1;
const VIEW_H = 65.87;
const SLANT = 14.5 / 58.2; // the stems lean 14.5 units right over 58.2 up
export const logoRatio = VIEW_W / VIEW_H;

type Kind = 'stem' | 'bar' | 'bowl';
interface Stroke {
  kind: Kind;
  d?: string;
  points?: string;
}

// Reading order: F, O, R, M. Each letter's stem first, then its bars.
const strokes: Stroke[] = [
  { kind: 'stem', d: 'M12.09,62.75h0c-7.83,0-12.94-4.96-11.43-11.07L9.62,15.59c1.52-6.11,9.09-11.07,16.92-11.07h0l-14.44,58.23Z' },
  { kind: 'bar', d: 'M23.79,15.59l2.75-11.07h35.04,0c-1.52,6.11-9.09,11.07-16.92,11.07h-20.86Z' },
  { kind: 'bar', d: 'M17.94,39.17l2.75-11.07h35.04,0c-1.52,6.11-9.09,11.07-16.92,11.07h-20.86Z' },
  {
    kind: 'bowl',
    d: 'M63.27,26.84l-3.02,12.2c-3.34,13.46,5.81,24.38,20.44,24.38h0c14.63,0,29.2-10.91,32.54-24.38l3.02-12.2c3.34-13.46-5.81-24.38-20.44-24.38h0c-14.63,0-29.2,10.91-32.54,24.38ZM83.71,51.23h0c-7.32,0-11.89-5.46-10.22-12.19l3.02-12.19c1.67-6.73,8.95-12.19,16.27-12.19h0c7.32,0,11.89,5.46,10.22,12.19l-3.02,12.19c-1.67,6.73-8.95,12.19-16.27,12.19Z',
  },
  { kind: 'stem', d: 'M129.1,62.75h0c-7.83,0-12.94-4.96-11.43-11.07l8.95-36.09c1.52-6.11,9.09-11.07,16.92-11.07h0l-14.44,58.23Z' },
  { kind: 'bar', d: 'M140.79,15.59l2.75-11.07h35.03s0,0,0,0c-1.52,6.11-9.09,11.07-16.92,11.07h-20.86Z' },
  { kind: 'stem', d: 'M183.88,62.75h0c-7.83,0-12.94-4.96-11.43-11.07l8.95-36.09c1.52-6.11,9.09-11.07,16.92-11.07h0l-14.44,58.23Z' },
  { kind: 'bar', points: '195.58 15.59 198.33 4.52 235.15 4.52 232.4 15.59 195.58 15.59' },
  { kind: 'stem', d: 'M209.22,62.75h0c-3.91,0-6.47-2.48-5.71-5.53l10.32-41.62c1.52-6.11,9.09-11.07,16.92-11.07h0l-13.07,52.69c-.76,3.06-4.55,5.53-8.46,5.53Z' },
  { kind: 'bar', d: 'M231.07,15.59l2.75-11.07h15.19c7.83,0,12.94,4.96,11.43,11.07h0s-29.36,0-29.36,0Z' },
  { kind: 'stem', d: 'M248.74,62.75h0c-7.83,0-12.94-4.96-11.43-11.07l11.7-47.16h0c7.83,0,12.94,4.96,11.43,11.07l-11.7,47.16Z' },
];

// The finished logo as one path, so strokes that touch (the F's bars and stem) render without a hairline seam between them.
const whole = strokes.map((s) => s.d ?? `M${s.points!.split(' ').reduce((acc, n, i) => acc + (i % 2 ? `,${n}` : i ? `L${n}` : n), '')}Z`).join('');

const STAGGER = 0.055; // of the sequence, between one stroke and the next
const WINDOW = 1 - STAGGER * (strokes.length - 1); // so the last stroke lands exactly at 1
const RISE = space.sm; // 12 pt a stem travels along the slant
const SLIDE = space.md; // 16 pt a bar slides in from the left

function StrokeLayer({ stroke, index, width, progress }: { stroke: Stroke; index: number; width: number; progress: SharedValue<number> }) {
  const { color } = useTheme();
  const style = useAnimatedStyle(() => {
    const t = interpolate(progress.value, [index * STAGGER, index * STAGGER + WINDOW], [0, 1], 'clamp');
    const left = 1 - t;
    if (stroke.kind === 'stem') return { opacity: t, transform: [{ translateX: -left * RISE * SLANT }, { translateY: left * RISE }] };
    if (stroke.kind === 'bar') return { opacity: t, transform: [{ translateX: -left * SLIDE }] };
    return { opacity: t, transform: [{ scale: 0.9 + t * 0.1 }] };
  });
  const height = width / logoRatio;
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
        {stroke.points ? <Polygon points={stroke.points} fill={color.text.primary} /> : <Path d={stroke.d} fill={color.text.primary} />}
      </Svg>
    </Animated.View>
  );
}

/** The logo; with `progress`, it assembles as the value goes from 0 to 1. */
export function Logo({ width, progress, label, header = false }: { width: number; progress?: SharedValue<number>; label: string; header?: boolean }) {
  const { color } = useTheme();
  const height = width / logoRatio;
  return (
    <View accessible accessibilityRole={header ? 'header' : 'image'} accessibilityLabel={label} style={{ width, height }}>
      {progress ? (
        strokes.map((s, i) => <StrokeLayer key={i} stroke={s} index={i} width={width} progress={progress} />)
      ) : (
        <Svg width={width} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          <Path d={whole} fill={color.text.primary} />
        </Svg>
      )}
    </View>
  );
}
