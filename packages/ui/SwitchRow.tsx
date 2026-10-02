// Layout plan. Job: turn one setting on or off. Focal element: the label. Quiet: the caption.
// The platform switch, in Form's colours: sage track when on, control stroke when off (4.60:1 on canvas). The switch's own shape and
// position say on or off, so colour is never alone. At least 48 tall.
import { StyleSheet, Switch, View } from 'react-native';

import { size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

export function SwitchRow({
  label,
  caption,
  value,
  onChange,
}: {
  label: string;
  caption?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { color } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text variant="bodyStrong">{label}</Text>
        {caption ? (
          <Text variant="caption" tone="secondary">
            {caption}
          </Text>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityHint={caption}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: color.action.primary, false: color.stroke.control }}
        thumbColor={color.text.primary}
        ios_backgroundColor={color.stroke.control}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: size.touch, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  text: { flex: 1 },
});
