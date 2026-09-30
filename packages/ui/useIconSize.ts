// Icons sit beside text, so they follow the text size (Dynamic Type), up to a cap. Keeps glyph and label in proportion.
import { size } from '@tokens';

import { useFontScale } from './useFontScale';

export function useIconSize(base: number): number {
  return base * Math.min(useFontScale(), size.iconMaxScale);
}
