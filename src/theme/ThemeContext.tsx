import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from './colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: 'system',
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const applyTheme = (modeToApply: ThemeMode) => {
    let scheme: 'light' | 'dark' = 'light';
    if (modeToApply === 'system') {
      scheme = systemColorScheme === 'dark' ? 'dark' : 'light';
    } else {
      scheme = modeToApply;
    }
    setTheme(scheme === 'dark' ? darkTheme : lightTheme);
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    applyTheme(newMode);
    await AsyncStorage.setItem('theme-mode', newMode);
  };

  useEffect(() => {
    const loadStoredMode = async () => {
      const storedMode = await AsyncStorage.getItem('theme-mode');
      const initialMode = storedMode as ThemeMode || 'system';
      setModeState(initialMode);
      applyTheme(initialMode);
    };
    loadStoredMode();
  }, [systemColorScheme]);

  useEffect(() => {
    if (mode === 'system') {
      applyTheme('system');
    }
  }, [systemColorScheme, mode]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') {
        setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      }
    });
    return () => subscription.remove();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
