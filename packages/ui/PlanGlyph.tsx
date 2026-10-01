// Layout plan. Job: say which plan, without relying on colour. Focal element: the glyph. Quiet: the label.
// Four distinct silhouettes (Dumbbell, Footprints, Moon, Focus) plus a text label, so meaning survives colour blindness.
import { StyleSheet, View } from 'react-native';
import Dumbbell from 'lucide-react-native/icons/dumbbell';
import Focus from 'lucide-react-native/icons/focus';
import Footprints from 'lucide-react-native/icons/footprints';
import Moon from 'lucide-react-native/icons/moon';

import { copy } from '@copy';
import { opacity, size, space, type PlanId } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

const icons = { hard: Dumbbell, light: Footprints, recover: Moon, deepwork: Focus };

export function PlanGlyph({ plan, small = false, estimated = false }: { plan: PlanId; small?: boolean; estimated?: boolean }) {
  const { color } = useTheme();
  const Icon = icons[plan];
  const px = useIconSize(small ? size.iconSm : size.icon);
  return (
    <Icon
      color={color.plan[plan].base}
      size={px}
      strokeWidth={size.outline}
      {...(estimated ? { opacity: opacity.estimated, strokeDasharray: '3 2', strokeLinecap: 'butt' } : null)}
    />
  );
}

export function PlanLabel({
  plan,
  estimated = false,
  quiet = false,
}: {
  plan: PlanId;
  estimated?: boolean;
  /** For lists where the plan is context, not the focal element (Progress): the glyph keeps the plan colour, the word is body text. */
  quiet?: boolean;
}) {
  if (quiet) {
    return (
      <View style={styles.row} accessible accessibilityLabel={copy.plan[plan]}>
        <PlanGlyph plan={plan} small />
        <Text variant="body" style={styles.shrink}>
          {copy.plan[plan]}
        </Text>
      </View>
    );
  }
  if (estimated) {
    // Not sure of this day (no events, so the weekday decided): muted colour, a dashed glyph, and the word, never colour alone.
    return (
      <View style={styles.row} accessible accessibilityLabel={`${copy.plan[plan]}, ${copy.week.estimated.toLowerCase()}`}>
        <PlanGlyph plan={plan} estimated />
        <View style={styles.shrink}>
          <Text variant="plan" tone="secondary">
            {copy.plan[plan]}
          </Text>
          <Text variant="caption" tone="secondary">
            {copy.week.estimated}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.row} accessible accessibilityLabel={copy.plan[plan]}>
      <PlanGlyph plan={plan} />
      <Text variant="plan" tone={plan} style={styles.shrink}>
        {copy.plan[plan]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  shrink: { flexShrink: 1 },
});
