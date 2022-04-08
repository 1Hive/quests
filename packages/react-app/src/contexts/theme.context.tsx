import React, { createContext, useContext } from 'react';
import { useToggleTheme } from 'src/hooks/use-toggle-theme';

export type ThemeContextModel = {
  currentTheme: any | undefined;
  setCurrentTheme: (_currentTheme: any | undefined) => void;
};

const ThemeContext = createContext<ThemeContextModel | undefined>(undefined);
export const useThemeContext = () => useContext(ThemeContext)!;

type Props = {
  children: React.ReactNode;
};
export const ThemeContextProvider = ({ children }: Props) => {
  const { currentTheme, setCurrentTheme } = useToggleTheme();

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
