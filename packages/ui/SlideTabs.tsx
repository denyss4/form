// Layout plan. Job: switch between two views of one screen (REDESIGN-PROMPT §6 slide tabs: Progress, "Plan fit" and "Felt vs forecast").
// Focal element: the selected tab. Quiet: the track.
// A sunken track with the raised pill sliding under the selected label (motion.standard spring). Selected is also bold, so it is never
// colour alone. Each tab is at least 48 tall. Reduce Motion: the pill moves at once.
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';

import { motion, radius, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';

export interface Tab<T extends string> {
  value: T;
  label: string;
}

function TabButton<T extends string>({
  tab,
  selected,
  onPress,
  onLayout,
}: {
  tab: Tab<T>;
  selected: boolean;
  onPress: () => void;
  onLayout: (x: number, width: number) => void;
}) {
  const focus = useFocus();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected }}
      aria-selected={selected}
      onPress={onPress}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      onLayout={(e) => onLayout(e.nativeEvent.layout.x, e.nativeEvent.layout.width)}
      style={styles.tab}
    >
      <Text variant={selected ? 'bodyStrong' : 'body'} tone={selected ? 'primary' : 'secondary'} style={styles.label}>
        {tab.label}
      </Text>
      <FocusRing visible={focus.focused} radius={radius.full} />
    </Pressable>
  );
}

export function SlideTabs<T extends string>({
  label,
  tabs,
  value,
  onChange,
}: {
  label: string;
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const [frames, setFrames] = useState<Record<string, { x: number; width: number }>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const frame = frames[value];

  useEffect(() => {
    if (!frame) return;
    x.set(reduceMotion ? frame.x : withSpring(frame.x, motion.standard));
    w.set(reduceMotion ? frame.width : withSpring(frame.width, motion.standard));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame?.x, frame?.width, reduceMotion]);

  const pill = useAnimatedStyle(() => ({ width: w.value, transform: [{ translateX: x.value }] }));

  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={[styles.track, { backgroundColor: color.bg.sunken }]}>
      {frame ? <Animated.View style={[styles.pill, { backgroundColor: color.bg.raised, borderColor: color.stroke.control }, pill]} /> : null}
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          tab={tab}
          selected={tab.value === value}
          onPress={() => {
            if (tab.value === value) return;
            haptic.selection();
            onChange(tab.value);
          }}
          onLayout={(tx, width) => setFrames((f) => ({ ...f, [tab.value]: { x: tx, width } }))}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.full, padding: space.xxs },
  pill: { position: 'absolute', top: space.xxs, bottom: space.xxs, left: 0, borderRadius: radius.full, borderWidth: size.hairline },
  tab: { flex: 1, minHeight: size.touch, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.sm },
  label: { textAlign: 'center' },
});
