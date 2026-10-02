// Layout plan. Job: one explicit yes, given by a tap (v-checkbox-6). Focal element: the box. Quiet: nothing else.
// Unchecked by default, always: a preselected box is not consent (GDPR Art. 7). Checked: sage fill with a canvas check, so the state is a
// shape (the check), not only a colour. The whole row is the target, at least 48 tall. The animated stroke arrives in D3.
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Check from 'lucide-react-native/icons/check';

import { radius, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { useTheme } from './theme';
import { usePress } from './usePress';

export function Checkbox({
  checked,
  onChange,
  label,
  children,
  error = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** What a screen reader hears. The visible label is `children`, which may hold links. */
  label: string;
  children: ReactNode;
  error?: boolean;
}) {
  const { color } = useTheme();
  const press = usePress();
  const focus = useFocus();
  const border = error ? color.status.attention : checked ? color.action.primary : color.stroke.control;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked }}
        aria-checked={checked}
        onPress={() => {
          haptic.selection();
          onChange(!checked);
        }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        style={styles.target}
      >
        <Animated.View
          style={[
            styles.box,
            { borderColor: border, backgroundColor: checked ? color.action.primary : 'transparent' },
            press.style,
          ]}
        >
          {checked ? <Check color={color.action.onPrimary} size={size.iconSm} strokeWidth={size.outline + 1} /> : null}
          <FocusRing visible={focus.focused} radius={radius.control / 2} />
        </Animated.View>
      </Pressable>
      <View style={styles.label}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.xs },
  target: { width: size.touch, minHeight: size.touch, alignItems: 'flex-start', justifyContent: 'center' },
  box: {
    width: size.check,
    height: size.check,
    borderRadius: radius.control / 2,
    borderWidth: size.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, minHeight: size.touch, justifyContent: 'center' },
});
