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

export function PlanGlyph({ plan, small = false }: { plan: PlanId; small?: boolean }) {
  const { color } = useTheme();
  const Icon = icons[plan];
  const px = useIconSize(small ? size.iconSm : size.icon);
  return (
    <Icon
      color={color.plan[plan].base}
      size={px}
      strokeWidth={size.outline}
    />
  );
}

export function PlanLabel({ plan }: { plan: PlanId }) {
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
