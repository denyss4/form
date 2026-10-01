// Layout plan. Job: hold one short task without leaving the screen. Focal element: the content. Quiet: the scrim and the header.
// The only shadowed surface in the app (5.4). Slides up with the standard spring (transform), the scrim fades (opacity).
// Reduced motion: a short cross-fade instead. Closes from the scrim, the close button or the system back gesture.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import X from 'lucide-react-native/icons/x';

import { copy } from '@copy';
import { motion, opacity, radius, shadow, size, space } from '@tokens';

import { IconButton } from './ScreenHeader';
import { Text } from './Text';
import { useTheme } from './theme';

const MAX_HEIGHT = 0.9; // of the window

export function Sheet({
  visible,
  onClose,
  title,
  accessory,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  accessory?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { color, scheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Stays mounted until the closing animation has finished. `exited` is reset while rendering, when `visible` turns true.
  const [exited, setExited] = useState(!visible);
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setExited(false);
  }
  const mounted = visible || !exited;
  const open = useSharedValue(0); // 0 closed, 1 open

  // Web: put focus back on the control that opened the sheet when it closes (WCAG 2.4.3).
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (visible) opener.current = document.activeElement as HTMLElement | null;
    else if (exited) opener.current?.focus?.();
  }, [visible, exited]);

  useEffect(() => {
    if (visible) {
      open.set(
        reduceMotion
          ? withTiming(1, { duration: motion.reducedFade })
          : withSpring(1, motion.standard),
      );
    } else {
      open.set(
        withTiming(
          0,
          {
            duration: reduceMotion ? motion.reducedFade : motion.quick.duration,
            easing: Easing.bezier(...motion.quick.easing),
          },
          (finished) => {
            if (finished) runOnJS(setExited)(true);
          },
        ),
      );
    }
  }, [visible, reduceMotion, open]);

  const cover = scheme === 'dark' ? opacity.scrimDark : opacity.scrim;
  const scrim = useAnimatedStyle(() => ({ opacity: open.value * cover }));
  const sheet = useAnimatedStyle(() =>
    reduceMotion
      ? { opacity: open.value }
      : { transform: [{ translateY: (1 - open.value) * height }] },
  );

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: color.bg.scrim }, scrim]}>
          {/* Tapping the scrim closes the sheet. It is not a tab stop: the header has the real Close button. */}
          <Pressable
            accessible={false}
            focusable={false}
            importantForAccessibility="no"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          aria-modal
          accessibilityViewIsModal
          style={[
            styles.sheet,
            shadow.sheet,
            { backgroundColor: color.bg.raised, maxHeight: height * MAX_HEIGHT, paddingBottom: insets.bottom + space.md },
            sheet,
          ]}
        >
          <View style={styles.header}>
            <Text variant="heading" accessibilityRole="header" level={2} style={styles.title}>
              {title}
            </Text>
            {accessory}
            <IconButton icon={X} label={copy.log.close} onPress={onClose} />
          </View>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingLeft: space.margin,
    paddingRight: space.xs,
    minHeight: size.touch,
  },
  title: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingVertical: space.sm, gap: space.md },
  footer: { paddingHorizontal: space.margin, paddingTop: space.sm, gap: space.xs },
});
