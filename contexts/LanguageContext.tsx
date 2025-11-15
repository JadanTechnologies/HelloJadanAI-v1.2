import React, { createContext, useState, ReactNode } from 'react';
import en from '/locales/en.json';
import ha from '/locales/ha.json';

type Locale = 'en' | 'ha';
type Translations = { [key: string]: string };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Translations;
}

const translationsMap: { [key in Locale]: Translations } = { en, ha };

export const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  translations: en,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  
  const value = {
    locale,
    setLocale,
    translations: translationsMap[locale],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};