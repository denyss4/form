// Layout plan. Job: say which plan, without relying on colour. Focal element: the glyph. Quiet: the label.
// Four distinct silhouettes (Dumbbell, Footprints, Moon, Focus) plus a text label, so meaning survives colour blindness.
import { StyleSheet, View } from 'react-native';
import Dumbbell from 'lucide-react-native/icons/dumbbell';
import Focus from 'lucide-react-native/icons/focus';
import Footprints from 'lucide-react-native/icons/footprints';
import Moon from 'lucide-react-native/icons/moon';

import { copy } from '@copy';
import { size, space, type PlanId } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

const icons = { hard: Dumbbell, light: Footprints, recover: Moon, deepwork: Focus };

export function PlanGlyph({ plan, small = false, estimated = false }: { plan: PlanId; small?: boolean; estimated?: boolean }) {
  const { color } = useTheme();
  const Icon = icons[plan];
  const px = useIconSize(small ? size.iconSm : size.icon);
  return (
    // Estimated (no events, so the weekday decided): a solid glyph in Text Muted (5.69:1 on canvas, 4.91:1 on raised). The dashed
    // outline read as a loading spinner (critique, 1 Oct). The non-colour cue is the hollow ring the Week strip draws under it, plus the
    // word "Estimated" wherever there is room.
    <Icon color={estimated ? color.text.secondary : color.plan[plan].base} size={px} strokeWidth={size.outline} />
  );
}

export function PlanLabel({
  plan,
  estimated = false,
  quiet = false,
}: {
  plan: PlanId;
  estimated?: boolean;
  /** Lists (Week, Progress): the glyph keeps the plan colour, the word is plain text. Minimalist: colour sits in one mark per row, at full glyph size because it is the only colour. */
  quiet?: boolean;
}) {
  if (estimated) {
    // Not sure of this day (no events, so the weekday decided): muted colour, a dashed glyph, and the word, never colour alone.
    return (
      <View style={styles.row} accessible accessibilityLabel={`${copy.plan[plan]}, ${copy.week.estimated.toLowerCase()}`}>
        <PlanGlyph plan={plan} estimated />
        <View style={styles.shrink}>
          <Text variant={quiet ? 'body' : 'plan'} tone="secondary">
            {copy.plan[plan]}
          </Text>
          <Text variant="caption" tone="secondary">
            {copy.week.estimated}
          </Text>
        </View>
      </View>
    );
  }
  if (quiet) {
    return (
      <View style={styles.row} accessible accessibilityLabel={copy.plan[plan]}>
        <PlanGlyph plan={plan} />
        <Text variant="body" style={styles.shrink}>
          {copy.plan[plan]}
        </Text>
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
