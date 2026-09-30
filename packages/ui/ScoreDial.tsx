// Layout plan. Job: show the score and how sure Form is. Focal element: the number inside the arc.
// Quiet: the track. The likely range is a thin flat bracket outside the arc, in the plan colour. It is not shaded or tapered,
// because the model's range is not a calibrated interval and a gradient would imply a shape it does not have (model.json).
// The range text and the plan label sit OUTSIDE the dial, so they can wrap at large text sizes. Only the number scales up to 1.3x.
// Sizes: app (on Today), widget, watch. Below about 20 pt the display token maps to the system font (5.3).
//
// The morning reveal (MASTER_PROMPT §6) uses transform and opacity only. The value arc is drawn in full, then hidden by a cover in the
// colour of the field behind the dial. The cover is one arc, as long as the score's sweep, and it ROTATES forward along the ring, so
// the arc is uncovered from its start to the score. The track is drawn above the cover so the ring never looks broken. The range bracket
// and the number fade in. Resolves GAPS G22.
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { copy } from '@copy';
import { opacity, scoreMaxFontScale, size, systemDisplay, type DialSize, type PlanId } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

const SCORE_MAX = 100;

export interface ScoreDialReveal {
  /** 0 = nothing shown yet, 1 = fully revealed. */
  progress: SharedValue<number>;
  /** The colour behind the dial. The cover is drawn in it. */
  field: string;
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
  const cover = useAnimatedStyle(() => ({ transform: [{ rotate: `${progress.value * sweep}deg` }] }));
  const bracket = useAnimatedStyle(() => ({ opacity: interpolate(progress.value, [0.7, 1], [0, 1], 'clamp') }));
  const numeral = useAnimatedStyle(() => ({ opacity: interpolate(progress.value, [0.3, 0.8], [0, 1], 'clamp') }));

  const label = hasScore
    ? range
      ? copy.dial.label(score, range[0], range[1])
      : `Form score ${score}`
    : copy.dial.empty;

  const track = (
    <Path
      d={arcPath(centre, valueRadius, start, end)}
      stroke={plan ? ink : color.stroke.hairline}
      strokeOpacity={plan ? opacity.track : 1}
      strokeWidth={g.stroke}
      strokeLinecap="round"
      fill="none"
    />
  );
  const drawn = hasScore && score > 0;

  return (
    <View accessible accessibilityLabel={label} style={{ width: g.diameter, height }}>
      <Svg style={styles.layer} width={g.diameter} height={height} viewBox={`0 0 ${g.diameter} ${height}`}>
        {reveal ? null : track}
        {drawn ? (
          <Path
            d={arcPath(centre, valueRadius, start, scoreEnd)}
            stroke={ink}
            strokeWidth={g.stroke}
            strokeLinecap="round"
            fill="none"
          />
        ) : null}
      </Svg>

      {reveal && drawn ? (
        <Animated.View style={[styles.layer, { width: g.diameter, height: g.diameter }, cover]}>
          <Svg width={g.diameter} height={g.diameter}>
            <Path
              d={arcPath(centre, valueRadius, start, scoreEnd)}
              stroke={reveal.field}
              strokeWidth={g.stroke + size.hairline * 2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      ) : null}

      {reveal ? (
        <Svg style={styles.layer} width={g.diameter} height={height} viewBox={`0 0 ${g.diameter} ${height}`}>
          {track}
        </Svg>
      ) : null}

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
