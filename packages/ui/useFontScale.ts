// The current text-size multiplier: the system's Dynamic Type setting on iOS and Android, the gallery/review multiplier on the web.
import { PixelRatio, Platform } from 'react-native';

import { useTextScale } from './textScale';

export function useFontScale(): number {
  const devScale = useTextScale();
  return Platform.OS === 'web' ? devScale : PixelRatio.getFontScale();
}
