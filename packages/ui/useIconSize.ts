// Icons sit beside text, so they follow the text size (Dynamic Type), up to a cap. Keeps glyph and label in proportion.
import { PixelRatio, Platform } from 'react-native';

import { size } from '@tokens';

import { useTextScale } from './textScale';

export function useIconSize(base: number): number {
  const devScale = useTextScale();
  const scale = Platform.OS === 'web' ? devScale : PixelRatio.getFontScale();
  return base * Math.min(scale, size.iconMaxScale);
}
