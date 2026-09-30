// Dev-only gallery chrome: shared theme and text-size settings, the state picker, a screen frame and small layout helpers.
// Nothing here ships in the demo path. Keep it out of production screens.
import { Link, useGlobalSearchParams } from 'expo-router';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { radius, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { Text } from './Text';
import { TextScaleContext } from './textScale';
import { ThemeProvider, useTheme, type Scheme } from './theme';

interface DevSettings {
  scheme: Scheme;
  setScheme: (scheme: Scheme) => void;
  textScale: number;
  setTextScale: (scale: number) => void;
}

const DevSettingsContext = createContext<DevSettings | null>(null);

const textScales = [1, 1.5, 2, 3];

/** Reads a URL param, e.g. ?plan=recover, and falls back when it is missing or not allowed. */
export function oneOf<T extends string | number>(
  value: string | string[] | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  const raw = Array.isArray(value) ? value[0] : value;
  return allowed.find((option) => String(option) === raw) ?? fallback;
}

export function DevSettingsProvider({ children }: { children: ReactNode }) {
  const params = useGlobalSearchParams<{ theme?: string; scale?: string }>();
  const [scheme, setScheme] = useState<Scheme>(oneOf(params.theme, ['light', 'dark'] as const, 'light'));
  const [textScale, setTextScale] = useState(oneOf(params.scale, textScales, 1));
  return (
    <DevSettingsContext.Provider value={{ scheme, setScheme, textScale, setTextScale }}>
      <ThemeProvider scheme={scheme}>
        <TextScaleContext.Provider value={textScale}>{children}</TextScaleContext.Provider>
      </ThemeProvider>
    </DevSettingsContext.Provider>
  );
}

const useDevSettings = () => {
  const settings = useContext(DevSettingsContext);
  if (!settings) throw new Error('Gallery screens must sit inside DevSettingsProvider');
  return settings;
};

/** Segmented pills. At most 4 options (Hick's law). Dev chrome does not scale with the text-size picker. */
export function DevPicker<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { color } = useTheme();
  return (
    <View style={styles.pickerGroup}>
      <Text variant="caption" tone="secondary" maxFontSizeMultiplier={1}>
        {label}
      </Text>
      <View style={styles.pills}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={String(option.value)}
              accessibilityRole="button"
              aria-selected={selected}
              onPress={() => onChange(option.value)}
              style={[
                styles.pill,
                selected
                  ? { backgroundColor: color.text.primary, borderColor: color.text.primary }
                  : { borderColor: color.stroke.control },
              ]}
            >
              <Text
                variant="bodyStrong"
                tone={selected ? 'inverse' : 'primary'}
                maxFontSizeMultiplier={1}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Frame for every gallery page: back link, title, shared theme and text-size pickers, then the page content. */
export function GalleryScreen({
  title,
  note,
  home = false,
  children,
}: {
  title: string;
  note?: string;
  home?: boolean;
  children: ReactNode;
}) {
  const { color } = useTheme();
  const dev = useDevSettings();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <NavLink href={home ? '/' : '/gallery'} label={home ? copy.dev.back : copy.dev.hub.title} />
        <Text variant="title" accessibilityRole="header">
          {title}
        </Text>
        {note ? (
          <Text variant="body" tone="secondary">
            {note}
          </Text>
        ) : null}
        {children}
        <Section title={copy.dev.picker.title}>
          <DevPicker
            label={copy.dev.picker.theme}
            options={[
              { value: 'light', label: copy.dev.picker.light },
              { value: 'dark', label: copy.dev.picker.dark },
            ]}
            value={dev.scheme}
            onChange={dev.setScheme}
          />
          <DevPicker
            label={copy.dev.picker.textSize}
            options={textScales.map((scale, i) => ({ value: scale, label: copy.dev.picker.sizes[i] }))}
            value={dev.textScale}
            onChange={dev.setTextScale}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

export function NavLink({ href, label }: { href: string; label: string }) {
  const focus = useFocus();
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={label}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        style={styles.link}
      >
        <Text variant="bodyStrong" style={styles.underline}>
          {label}
        </Text>
        <FocusRing visible={focus.focused} />
      </Pressable>
    </Link>
  );
}

/** A group of related items: heading, optional note, then the items. Space separates groups (5.2). */
export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="heading" accessibilityRole="header" level={2}>
        {title}
      </Text>
      {note ? (
        <Text variant="caption" tone="secondary">
          {note}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: space.margin,
    paddingTop: space.md,
    paddingBottom: space.xxl,
    gap: space.md,
  },
  pickerGroup: { gap: space.xxs },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  pill: {
    minHeight: size.touch,
    paddingHorizontal: space.md,
    borderRadius: radius.full,
    borderWidth: size.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: { minHeight: size.touch, justifyContent: 'center', alignSelf: 'flex-start' },
  underline: { textDecorationLine: 'underline' },
  section: { marginTop: space.xl, gap: space.sm },
});
