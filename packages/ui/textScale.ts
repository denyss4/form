// Web preview only. Native text follows the system Dynamic Type setting by itself (allowFontScaling).
// The web preview cannot do that, so the gallery sets a multiplier here to imitate large text sizes.
import { createContext, useContext } from 'react';

export const TextScaleContext = createContext(1);
export const useTextScale = () => useContext(TextScaleContext);
