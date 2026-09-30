// Layout plan. Job: show the score and how sure Form is. Focal element: the number inside the arc.
// Quiet: the track. The likely range is a thin flat bracket outside the arc, in the plan colour. It is not shaded or tapered,
// because the model's range is not a calibrated interval and a gradient would imply a shape it does not have (model.json).
// The range text and the plan label sit OUTSIDE the dial, so they can wrap at large text sizes. Only the number scales up to 1.3x.
// Sizes: app (on Today), widget, watch. Below about 20 pt the display token maps to the system font (5.3).
// Static in P1. The reveal animation is P3 (GAPS G22).
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { copy } from '@copy';
import { opacity, scoreMaxFontScale, size, systemDisplay, type DialSize, type PlanId } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

const SCORE_MAX = 100;

export interface ScoreDialProps {
  /** null = no score yet (day 1). */
  score: number | null;
  range?: [number, number];
  plan?: PlanId;
  dial?: DialSize;
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

export function ScoreDial({ score, range, plan, dial = 'app' }: ScoreDialProps) {
  const { color } = useTheme();
  const g = size.dial[dial];
  const centre = g.diameter / 2;
  const bandRadius = centre - g.band / 2;
  const valueRadius = centre - g.band - g.bandGap - g.stroke / 2;
  const ink = plan ? color.plan[plan].base : color.text.primary;

  const start = angleOf(0);
  const end = angleOf(SCORE_MAX);

  // The arc opens at the bottom, so the container stops where the arc's round caps or the range bracket end, whichever is lower.
  // The number stays at the ring's centre.
  const lowest = Math.sin((size.dial.startAngle * Math.PI) / 180);
  const height = Math.ceil(
    centre + Math.max(valueRadius * lowest + g.stroke / 2, bandRadius * lowest + g.band / 2),
  );
  const hasScore = score !== null;

  const label = hasScore
    ? range
      ? copy.dial.label(score, range[0], range[1])
      : `Form score ${score}`
    : copy.dial.empty;

  return (
    <View
      accessible
      accessibilityLabel={label}
      style={{ width: g.diameter, height }}
    >
      <Svg width={g.diameter} height={height} viewBox={`0 0 ${g.diameter} ${height}`}>
        <Path
          d={arcPath(centre, valueRadius, start, end)}
          stroke={plan ? ink : color.stroke.hairline}
          strokeOpacity={plan ? opacity.track : 1}
          strokeWidth={g.stroke}
          strokeLinecap="round"
          fill="none"
        />
        {hasScore && range ? (
          <Path
            d={arcPath(centre, bandRadius, angleOf(range[0]), angleOf(range[1]))}
            stroke={ink}
            strokeWidth={g.band}
            strokeLinecap="butt"
            fill="none"
          />
        ) : null}
        {hasScore && score > 0 ? (
          <Path
            d={arcPath(centre, valueRadius, start, angleOf(score))}
            stroke={ink}
            strokeWidth={g.stroke}
            strokeLinecap="round"
            fill="none"
          />
        ) : null}
      </Svg>

      {hasScore ? (
        <View style={[styles.number, { width: g.diameter, height: g.diameter }]} pointerEvents="none">
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
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  number: { position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
