import { createContext, useContext, type ReactNode } from 'react';

import { darkColor, lightColor, type ColorTokens } from '@tokens';

export type Scheme = 'light' | 'dark';

interface Theme {
  scheme: Scheme;
  color: ColorTokens;
}

const themes: Record<Scheme, Theme> = {
  light: { scheme: 'light', color: lightColor },
  dark: { scheme: 'dark', color: darkColor },
};

const ThemeContext = createContext<Theme>(themes.light);

export function ThemeProvider({ scheme, children }: { scheme: Scheme; children: ReactNode }) {
  return <ThemeContext.Provider value={themes[scheme]}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
