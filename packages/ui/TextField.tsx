// Layout plan. Job: enter one value, with its name always visible (v-label-12: the label sits above, never a placeholder standing in for
// it). Focal element: the field. Quiet: the hint. An error replaces the hint, in plain words with an icon (never colour alone).
// States: default, focused (the sage focus ring), error (Status Over border, icon and words), disabled. Secure fields get a show/hide
// toggle, a 48 pt target inside the field.
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import CircleAlert from 'lucide-react-native/icons/circle-alert';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';

import { copy } from '@copy';
import { opacity, radius, size, space, type } from '@tokens';

import { FocusRing } from './focus';
import { Text } from './Text';
import { useTextScale } from './textScale';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

export interface TextFieldProps
  extends Pick<TextInputProps, 'keyboardType' | 'autoComplete' | 'textContentType' | 'autoCapitalize' | 'returnKeyType' | 'onSubmitEditing'> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  hint?: string;
  error?: string | null;
  secure?: boolean;
  disabled?: boolean;
}

/** An inline error: Status Over words with an icon, never colour alone. Announced politely as it appears. */
export function FieldError({ message }: { message: string }) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.iconSm);
  return (
    <View style={styles.error} accessibilityLiveRegion="polite">
      <CircleAlert color={color.status.attention} size={iconPx} strokeWidth={size.outline} />
      <Text variant="caption" style={[styles.grow, { color: color.status.attention }]}>
        {message}
      </Text>
    </View>
  );
}

export function TextField({ label, value, onChangeText, onBlur, hint, error, secure = false, disabled = false, ...input }: TextFieldProps) {
  const { color } = useTheme();
  const devScale = useTextScale();
  const scale = Platform.OS === 'web' ? devScale : 1;
  const iconPx = useIconSize(size.iconSm);
  const [focused, setFocused] = useState(false);
  const [shown, setShown] = useState(false);
  const Toggle = shown ? EyeOff : Eye;

  return (
    <View style={styles.wrap}>
      <Text variant="bodyStrong" nativeID={`${label}-label`}>
        {label}
      </Text>
      <View
        style={[
          styles.box,
          {
            backgroundColor: color.bg.sunken,
            borderColor: error ? color.status.attention : color.stroke.control,
            opacity: disabled ? opacity.disabled : 1,
          },
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
          aria-invalid={Boolean(error)}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          editable={!disabled}
          secureTextEntry={secure && !shown}
          autoCorrect={false}
          placeholderTextColor={color.text.secondary}
          selectionColor={color.action.primary}
          style={[
            type.body,
            styles.input,
            { color: color.text.primary },
            // The web preview stands in for system text size; native scales itself.
            scale === 1 ? undefined : { fontSize: (type.body.fontSize ?? 0) * scale, lineHeight: (type.body.lineHeight ?? 0) * scale },
          ]}
          {...input}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={shown ? copy.field.hide(label) : copy.field.show(label)}
            onPress={() => setShown((v) => !v)}
            style={styles.toggle}
          >
            <Toggle color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
          </Pressable>
        ) : null}
        <FocusRing visible={focused} />
      </View>
      {error ? (
        <FieldError message={error} />
      ) : hint ? (
        <Text variant="caption" tone="secondary">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  box: {
    minHeight: size.touch,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: size.hairline,
    borderRadius: radius.control,
  },
  input: { flex: 1, minHeight: size.touch, paddingHorizontal: space.sm, paddingVertical: space.sm },
  toggle: { width: size.touch, minHeight: size.touch, alignItems: 'center', justifyContent: 'center' },
  error: { flexDirection: 'row', alignItems: 'flex-start', gap: space.xs },
  grow: { flex: 1 },
});
