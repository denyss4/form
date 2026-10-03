// D5 (the user's pick), combobox in a popover): the shadcn Popover + Command rebuilt for a phone. A field-like trigger (sunken, control stroke,
// like TextField) shows the choice with its icon, or a muted placeholder, and an up-down chevron. Tapping it opens a panel anchored under
// the trigger (above it when the keyboard or the screen edge leaves too little room): a search line, then the options, the chosen one
// with a check. Tapping an option chooses it and closes; tapping the chosen one again clears it (the original's toggle); tapping outside
// or Android back closes. The list opens scrolled to the chosen option, with one option above it for context.
// The panel is a floating layer drawn solid raised with a control-stroke edge, not glass: the search placeholder is Text Muted, which is
// never allowed on glass (CLAUDE.md). No shadow (only bottom sheets get one). It fades and settles in from 0.95 (the original's zoom-in),
// 180 ms; Reduce Motion: it appears at once. The search is not focused on open, so the keyboard does not cover the list until asked for.
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Check from 'lucide-react-native/icons/check';
import ChevronsUpDown from 'lucide-react-native/icons/chevrons-up-down';
import Search from 'lucide-react-native/icons/search';

import { copy } from '@copy';
import { radius, size, space, type } from '@tokens';

import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

type Icon = ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;

export interface ComboOption {
  value: string;
  label: string;
  icon?: Icon;
}

const PANEL_MAX = space.xxxl * 5; // 320 pt: the search line and about five options (the original's 300 px list)
const GAP = space.xxs;

export function Combobox({
  label,
  placeholder,
  searchPlaceholder,
  emptyText,
  options,
  value,
  onChange,
  clearable = true,
}: {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  options: ComboOption[];
  value: string;
  onChange: (value: string) => void;
  /** Tapping the chosen option again clears it (the original's toggle). Off for a required field. */
  clearable?: boolean;
}) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.iconSm);
  const reduceMotion = useReducedMotion();
  const window = useWindowDimensions();
  const trigger = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [anchor, setAnchor] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [keyboard, setKeyboard] = useState(0);
  const shown = useSharedValue(0);
  const list$ = useRef<ScrollView>(null);
  const scrolled = useRef(false); // the list opens on the chosen option once per opening, then the person scrolls freely

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKeyboard(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboard(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useEffect(() => {
    shown.set(open ? (reduceMotion ? 1 : withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) })) : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduceMotion]);
  const enter = useAnimatedStyle(() => ({ opacity: shown.value, transform: [{ scale: 0.95 + shown.value * 0.05 }] }));

  const chosen = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const list = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  const openPanel = () => {
    trigger.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setQuery('');
      scrolled.current = false;
      setOpen(true);
    });
  };
  const close = () => {
    Keyboard.dismiss();
    setOpen(false);
  };
  const choose = (v: string) => {
    haptic.selection();
    onChange(v === value && clearable ? '' : v);
    close();
  };

  // Below the trigger if the panel fits above the keyboard; otherwise above it.
  const below = anchor.y + anchor.h + GAP;
  const room = window.height - keyboard - below - space.md;
  const place = room >= PANEL_MAX || anchor.y < room ? { top: below, maxHeight: Math.max(room, size.touch * 2) } : { bottom: window.height - anchor.y + GAP, maxHeight: Math.min(PANEL_MAX, anchor.y - space.xxl) };

  const ChosenIcon = chosen?.icon;
  return (
    <View style={styles.wrap}>
      <Text variant="bodyStrong">{label}</Text>
      <Pressable
        ref={trigger}
        accessibilityRole="combobox"
        accessibilityLabel={label}
        accessibilityValue={{ text: chosen?.label ?? placeholder }}
        accessibilityState={{ expanded: open }}
        onPress={openPanel}
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor: pressed ? color.bg.raised : color.bg.sunken, borderColor: color.stroke.control },
        ]}
      >
        {ChosenIcon ? <ChosenIcon color={color.text.secondary} size={iconPx} strokeWidth={size.outline} /> : null}
        <Text variant="body" tone={chosen ? 'primary' : 'secondary'} style={styles.grow}>
          {chosen?.label ?? placeholder}
        </Text>
        <ChevronsUpDown color={color.text.secondary} size={iconPx} strokeWidth={size.outline} />
      </Pressable>

      <Modal visible={open} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
        <Pressable accessibilityLabel={copy.nav.close} accessibilityRole="button" style={StyleSheet.absoluteFill} onPress={close} />
        <Animated.View
          style={[
            styles.panel,
            { left: anchor.x, width: anchor.w, backgroundColor: color.bg.raised, borderColor: color.stroke.control },
            place,
            enter,
          ]}
        >
          <View style={[styles.search, { borderBottomColor: color.stroke.hairline }]}>
            <Search color={color.text.secondary} size={iconPx} strokeWidth={size.outline} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={color.text.secondary}
              accessibilityLabel={searchPlaceholder}
              autoCorrect={false}
              autoCapitalize="none"
              style={[styles.input, type.body, { color: color.text.primary }]}
            />
          </View>
          <ScrollView ref={list$} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
            {list.length === 0 ? (
              <Text variant="body" tone="secondary" style={styles.empty}>
                {emptyText}
              </Text>
            ) : (
              list.map((o) => {
                const selected = o.value === value;
                const OptionIcon = o.icon;
                return (
                  <Pressable
                    key={o.value}
                    accessibilityRole="button"
                    accessibilityLabel={o.label}
                    accessibilityState={{ selected }}
                    onPress={() => choose(o.value)}
                    onLayout={
                      selected
                        ? (e) => {
                            if (scrolled.current) return;
                            scrolled.current = true;
                            list$.current?.scrollTo({ y: Math.max(e.nativeEvent.layout.y - size.touch, 0), animated: false });
                          }
                        : undefined
                    }
                    style={({ pressed }) => [styles.option, pressed ? { backgroundColor: color.bg.sunken } : undefined]}
                  >
                    {OptionIcon ? <OptionIcon color={color.text.secondary} size={iconPx} strokeWidth={size.outline} /> : null}
                    <Text variant="body" style={styles.grow}>
                      {o.label}
                    </Text>
                    {selected ? <Check color={color.text.primary} size={iconPx} strokeWidth={size.outline} /> : null}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  grow: { flex: 1 },
  trigger: {
    minHeight: size.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.sm,
    borderRadius: radius.control,
    borderWidth: size.hairline,
  },
  panel: { position: 'absolute', borderRadius: radius.control, borderWidth: size.hairline, overflow: 'hidden' },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingHorizontal: space.sm, borderBottomWidth: size.hairline },
  input: { flex: 1, minHeight: size.touch },
  list: { padding: space.xxs },
  option: { minHeight: size.touch, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.xs, borderRadius: radius.control - space.xxs },
  empty: { paddingVertical: space.lg, textAlign: 'center' },
});
