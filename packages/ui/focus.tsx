// A visible focus indicator for keyboard, switch and D-pad users (WCAG 2.4.7, MASTER_PROMPT §6). One ring, used by every control.
// The ring is drawn just outside the control, so it never changes layout.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius as radii, size } from '@tokens';

import { useTheme } from './theme';

export function useFocus() {
  const [focused, setFocused] = useState(false);
  return { focused, onFocus: () => setFocused(true), onBlur: () => setFocused(false) };
}

const inset = -(size.focusOffset + size.outline);

export function FocusRing({ visible, radius = radii.control }: { visible: boolean; radius?: number }) {
  const { color } = useTheme();
  if (!visible) return null;
  return (
    <View
      pointerEvents="none"
      style={[styles.ring, { borderColor: color.text.primary, borderRadius: radius + size.focusOffset }]}
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    top: inset,
    left: inset,
    right: inset,
    bottom: inset,
    borderWidth: size.outline,
  },
});
