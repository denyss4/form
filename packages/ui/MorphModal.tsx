// Layout plan. Job: one day's detail, grown out of the week-strip column that was tapped (REDESIGN-PROMPT §6 center morph modal, Q3;
// D3b, behind its own phone check). Focal element: the detail card. Quiet: the scrim.
// - Open: the card starts at the column's exact rectangle and springs (motion.standard) to a centred card at the screen margins, by
//   scale and translate only; the content fades in over the second half. Close (the X, the scrim, Android back, Escape on the web):
//   the same path in reverse, back into the column, then unmounts.
// - The card is solid raised, not glass: the detail carries Text Muted (an estimated day, "No session"), which never sits on glass.
//   The scrim is the sheets' canvas scrim, so the strip behind recedes. No shadow: only bottom sheets get one (CLAUDE.md).
// - Screen readers: a modal view, the close button first, then the content. Focus returns to the opener on the web (WCAG 2.4.3).
// - Reduce Motion: no morph; the card cross-fades in place in 120 ms.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import X from 'lucide-react-native/icons/x';

import { copy } from '@copy';
import { motion, opacity, radius, space } from '@tokens';

import { IconButton } from './ScreenHeader';
import { useTheme } from './theme';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function MorphModal({
  visible,
  from,
  onClose,
  children,
}: {
  visible: boolean;
  /** Where the card grows from and shrinks back to: the tapped column, in window coordinates. Null: it fades in place. */
  from: Rect | null;
  onClose: () => void;
  children: ReactNode;
}) {
  const { color, scheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [cardHeight, setCardHeight] = useState(0);
  const [exited, setExited] = useState(!visible);
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setExited(false);
  }
  const mounted = visible || !exited;
  const open = useSharedValue(0);

  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (visible) opener.current = document.activeElement as HTMLElement | null;
    else if (exited) opener.current?.focus?.();
  }, [visible, exited]);

  // The card is measured first (invisible), then the morph starts, so its end point is known.
  const measured = cardHeight > 0;
  useEffect(() => {
    if (visible && !measured) return;
    if (visible) {
      open.set(reduceMotion ? withTiming(1, { duration: motion.reducedFade }) : withSpring(1, motion.standard));
    } else {
      const [x1, y1, x2, y2] = motion.quick.easing;
      open.set(
        withTiming(
          0,
          { duration: reduceMotion ? motion.reducedFade : motion.morphClose, easing: Easing.bezier(x1, y1, x2, y2) },
          (finished) => {
            if (finished) runOnJS(setExited)(true);
          },
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, measured, reduceMotion]);

  // The card's resting place: full width inside the screen margins, centred vertically.
  const cardWidth = screenWidth - space.margin * 2;
  const restX = space.margin + cardWidth / 2;
  const restY = screenHeight / 2;
  const morph = !reduceMotion && from !== null;
  const start = from ?? { x: 0, y: 0, width: cardWidth, height: cardHeight };

  const cover = scheme === 'dark' ? opacity.scrimDark : opacity.scrim;
  const scrim = useAnimatedStyle(() => ({ opacity: open.value * cover }));
  const card = useAnimatedStyle(() => {
    if (!morph || !measured) return { opacity: measured ? open.value : 0 };
    const p = open.value;
    return {
      opacity: interpolate(p, [0, 0.15], [0, 1], 'clamp'),
      transform: [
        { translateX: interpolate(p, [0, 1], [start.x + start.width / 2 - restX, 0]) },
        { translateY: interpolate(p, [0, 1], [start.y + start.height / 2 - restY, 0]) },
        { scaleX: interpolate(p, [0, 1], [start.width / cardWidth, 1]) },
        { scaleY: interpolate(p, [0, 1], [start.height / cardHeight, 1]) },
      ],
    };
  });
  // The content arrives once the card is mostly open, so it is never seen squashed.
  const content = useAnimatedStyle(() => ({ opacity: morph ? interpolate(open.value, [0.55, 1], [0, 1], 'clamp') : 1 }));

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: color.bg.scrim }, scrim]}>
          {/* Tapping the scrim closes the card. Not a tab stop: the card has the real Close button. */}
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
          onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
          style={[
            styles.card,
            // At the largest text the card stops at the screen's height minus 64 pt each side, and its content scrolls.
            { width: cardWidth, maxHeight: screenHeight - space.xxxl * 2, top: restY - cardHeight / 2, backgroundColor: color.bg.raised },
            card,
          ]}
        >
          <Animated.View style={content}>
            <View style={styles.close}>
              <IconButton icon={X} label={copy.nav.close} onPress={onClose} />
            </View>
            <ScrollView contentContainerStyle={styles.inner}>{children}</ScrollView>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { position: 'absolute', left: space.margin, borderRadius: radius.surface, overflow: 'hidden' },
  inner: { padding: space.md, gap: space.sm },
  close: { position: 'absolute', top: space.xxs, right: space.xxs, zIndex: 1 },
});
