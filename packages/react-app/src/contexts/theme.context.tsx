import React, { createContext, useContext, useMemo } from 'react';
import { useToggleTheme } from 'src/hooks/use-toggle-theme';
import { ThemeInterface } from '../styles/theme';

export type ThemeContextModel = {
  currentTheme: ThemeInterface | undefined;
  setCurrentTheme: (_currentTheme: ThemeInterface | undefined) => void;
};

const ThemeContext = createContext<ThemeContextModel | undefined>(undefined);
export const useThemeContext = () => useContext(ThemeContext)!;

type Props = {
  children: React.ReactNode;
};
export function ThemeContextProvider({ children }: Props) {
  const { currentTheme, setCurrentTheme } = useToggleTheme();
  const value = useMemo(() => ({ currentTheme, setCurrentTheme }), [currentTheme, setCurrentTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
