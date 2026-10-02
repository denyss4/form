// The one ambient glow on Today (REDESIGN-PROMPT §2.3): the plan colour, faint at the centre and fading to nothing, behind the dial only.
// It encodes the day's plan, so it is not decoration. 0.16 at the centre keeps the dial track at 3.11:1 or more against it and the score
// at 11:1 or more for all four plans (opacity.glow). One per screen; nowhere else.
import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { opacity } from '@tokens';

/** centerY: where the glow's centre sits, measured from the top of its parent (the dial's centre). */
export function PlanGlow({ color, diameter, centerY }: { color: string; diameter: number; centerY: number }) {
  const id = `glow-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = diameter / 2;
  return (
    <View pointerEvents="none" style={[styles.wrap, { width: diameter, height: diameter, top: centerY - r, transform: [{ translateX: -r }] }]}>
      <Svg width={diameter} height={diameter}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity.glow} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  // Centred horizontally in its parent, and vertically on centerY.
  wrap: { position: 'absolute', left: '50%' },
});
