// Layout plan. Job: show the score and how sure Form is. Focal element: the number inside the arc.
// Quiet: the track. The likely range is a thin flat bracket outside the arc, in the plan colour. It is not shaded or tapered,
// because the model's range is not a calibrated interval and a gradient would imply a shape it does not have (model.json).
// The range text and the plan label sit OUTSIDE the dial, so they can wrap at large text sizes. Only the number scales up to 1.3x.
// Sizes: app (on Today), widget, watch. Below about 20 pt the display token maps to the system font (5.3).
//
// Layer order (REDESIGN-PROMPT §3): the full 0-100 track in the control stroke, then the active arc ON TOP with round caps, then the
// likely-range band last. The morning reveal draws the active arc along its length (an animated stroke dash; the motion limits were lifted
// on 1 Oct 2026), so the opaque track is never covered and the ring never looks broken. The range bracket and the number fade in.
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { copy } from '@copy';
import { scoreMaxFontScale, size, systemDisplay, type DialSize, type PlanId } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

const SCORE_MAX = 100;
const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface ScoreDialReveal {
  /** 0 = nothing shown yet, 1 = fully revealed. */
  progress: SharedValue<number>;
  /** The colour behind the dial. Kept for callers; the dash reveal no longer needs it. */
  field?: string;
}

export interface ScoreDialProps {
  /** null = no score yet (day 1). */
  score: number | null;
  range?: [number, number];
  plan?: PlanId;
  dial?: DialSize;
  reveal?: ScoreDialReveal;
}

const polar = (centre: number, radius: number, degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  return { x: centre + radius * Math.cos(radians), y: centre + radius * Math.sin(radians) };
};

function arcPath(centre: number, radius: number, from: number, to: number) {
  const start = polar(centre, radius, from);
  const end = polar(centre, radius, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

const angleOf = (value: number) =>
  size.dial.startAngle + (Math.min(Math.max(value, 0), SCORE_MAX) / SCORE_MAX) * size.dial.sweep;

/** Radii and container height for a dial size. */
export function dialGeometry(dial: DialSize) {
  const g = size.dial[dial];
  const centre = g.diameter / 2;
  const bandRadius = centre - g.band / 2;
  const valueRadius = centre - g.band - g.bandGap - g.stroke / 2;
  // The arc opens at the bottom, so the container stops where the arc's round caps or the range bracket end, whichever is lower.
  // The number stays at the ring's centre.
  const lowest = Math.sin((size.dial.startAngle * Math.PI) / 180);
  const height = Math.ceil(
    centre + Math.max(valueRadius * lowest + g.stroke / 2, bandRadius * lowest + g.band / 2),
  );
  return { g, centre, bandRadius, valueRadius, height };
}

export function ScoreDial({ score, range, plan, dial = 'app', reveal }: ScoreDialProps) {
  const { color } = useTheme();
  const { g, centre, bandRadius, valueRadius, height } = dialGeometry(dial);
  const ink = plan ? color.plan[plan].base : color.text.primary;

  const start = angleOf(0);
  const end = angleOf(SCORE_MAX);
  const hasScore = score !== null;
  const scoreEnd = hasScore ? angleOf(score) : start;
  const sweep = scoreEnd - start;

  const settled = useSharedValue(1);
  const progress = reveal?.progress ?? settled;
  const bracket = useAnimatedStyle(() => ({ opacity: interpolate(progress.value, [0.7, 1], [0, 1], 'clamp') }));
  const numeral = useAnimatedStyle(() => ({ opacity: interpolate(progress.value, [0.3, 0.8], [0, 1], 'clamp') }));

  // The active arc's length, for the dash reveal: dash = the whole arc, gap = the same, offset from the whole length to 0.
  const arcLength = (valueRadius * Math.abs(sweep) * Math.PI) / 180;
  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: arcLength * (1 - progress.value),
    // A zero-length dash still draws its round caps as a dot, so the arc is hidden until it has started to draw.
    strokeOpacity: progress.value > 0.01 ? 1 : 0,
  }));

  const label = hasScore
    ? range
      ? copy.dial.label(score, range[0], range[1])
      : `Form score ${score}`
    : copy.dial.empty;

  const drawn = hasScore && score > 0;

  return (
    <View accessible accessibilityLabel={label} style={{ width: g.diameter, height }}>
      <Svg style={styles.layer} width={g.diameter} height={height} viewBox={`0 0 ${g.diameter} ${height}`}>
        {/* 1. The inactive track, 0-100. */}
        <Path
          d={arcPath(centre, valueRadius, start, end)}
          stroke={color.stroke.control}
          strokeWidth={g.stroke}
          strokeLinecap="round"
          fill="none"
        />
        {/* 2. The active arc, on top. */}
        {drawn ? (
          <AnimatedPath
            d={arcPath(centre, valueRadius, start, scoreEnd)}
            stroke={ink}
            strokeWidth={g.stroke}
            strokeLinecap="round"
            strokeDasharray={[arcLength, arcLength]}
            animatedProps={arcProps}
            fill="none"
          />
        ) : null}
      </Svg>

      {/* 3. The likely-range band, last. */}
      {hasScore && range ? (
        <Animated.View style={[styles.layer, bracket]}>
          <Svg width={g.diameter} height={height} viewBox={`0 0 ${g.diameter} ${height}`}>
            <Path
              d={arcPath(centre, bandRadius, angleOf(range[0]), angleOf(range[1]))}
              stroke={ink}
              strokeWidth={g.band}
              strokeLinecap="butt"
              fill="none"
            />
          </Svg>
        </Animated.View>
      ) : null}

      {hasScore ? (
        <Animated.View
          style={[styles.number, { width: g.diameter, height: g.diameter }, numeral]}
          pointerEvents="none"
        >
          {dial === 'app' ? (
            <Text variant="score" maxFontSizeMultiplier={scoreMaxFontScale}>
              {score}
            </Text>
          ) : dial === 'widget' ? (
            <Text variant="title" tabular maxFontSizeMultiplier={scoreMaxFontScale}>
              {score}
            </Text>
          ) : (
            <Text variant="plan" tabular style={systemDisplay('plan')} maxFontSizeMultiplier={scoreMaxFontScale}>
              {score}
            </Text>
          )}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0 },
  number: { position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
