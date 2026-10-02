// The one text primitive. Seven variants from the type tokens; colour comes from the theme.
import { Platform, Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { tabularFigures, type, type PlanId, type TypeToken } from '@tokens';

import { useTextScale } from './textScale';
import { useTheme } from './theme';

export type TextTone = 'primary' | 'secondary' | 'inverse' | PlanId;

export interface TextProps extends RNTextProps {
  variant?: TypeToken;
  tone?: TextTone;
  tabular?: boolean;
  /** Heading level for screen readers. Screen titles are 1, section headings 2. */
  level?: 1 | 2 | 3;
}

export function Text({
  variant = 'body',
  tone = 'primary',
  tabular = false,
  level,
  maxFontSizeMultiplier,
  style,
  ...rest
}: TextProps) {
  const { color } = useTheme();
  const devScale = useTextScale();

  const base = type[variant];
  const colour =
    tone === 'primary'
      ? color.text.primary
      : tone === 'secondary'
        ? color.text.secondary
        : tone === 'inverse'
          ? color.action.onPrimary
          : color.plan[tone].base;

  // Native scales itself. On web the gallery's multiplier stands in, capped the same way.
  const scale = Platform.OS === 'web' ? Math.min(devScale, maxFontSizeMultiplier ?? Infinity) : 1;
  const scaled: TextStyle | undefined =
    scale === 1
      ? undefined
      : { fontSize: (base.fontSize ?? 0) * scale, lineHeight: (base.lineHeight ?? 0) * scale };

  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      aria-level={level}
      style={[base, tabular ? tabularFigures : undefined, { color: colour }, scaled, style]}
      {...rest}
    />
  );
}
