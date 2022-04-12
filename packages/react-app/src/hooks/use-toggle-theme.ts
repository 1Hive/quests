import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME } from 'src/constants';
import { customDarkTheme } from 'src/styles/dark-theme';
import { customLightTheme } from 'src/styles/light-theme';
import { ThemeInterface } from 'styled-components';

export const useToggleTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeInterface>();

  useEffect(() => {
    let themeName = localStorage.getItem('forcetheme');
    if (!themeName) themeName = DEFAULT_THEME;
    setCurrentTheme(themeName === 'dark' ? customDarkTheme : customLightTheme);
  }, []);

  const toggleTheme = () => {
    // eslint-disable-next-line no-underscore-dangle
    const newTheme = currentTheme?._appearance === 'dark' ? customLightTheme : customDarkTheme;
    setCurrentTheme(newTheme);
    // eslint-disable-next-line no-underscore-dangle
    localStorage.setItem('theme', newTheme._appearance);
  };

  return {
    toggleTheme: useCallback(toggleTheme, [currentTheme, setCurrentTheme]),
    currentTheme,
    setCurrentTheme,
  };
};
