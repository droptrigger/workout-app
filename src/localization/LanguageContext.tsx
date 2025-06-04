import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'ru',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(i18n.locale.slice(0,2) || 'ru');

  useEffect(() => {
    (async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      if (storedLang && storedLang !== language) {
        i18n.locale = storedLang;
        setLanguageState(storedLang);
      }
    })();
  }, []);

  const setLanguage = (lang: string) => {
    i18n.locale = lang;
    setLanguageState(lang);
    AsyncStorage.setItem('appLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 