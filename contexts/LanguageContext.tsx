import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ha';
type Translations = { [key: string]: string };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Translations;
  loading: boolean;
}

const initialTranslations: Translations = {};

export const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  translations: initialTranslations,
  loading: true,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>(initialTranslations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${locale}`);
        }
        const data: Translations = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Error fetching translations:", error);
        // Fallback to empty object on error
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [locale]);

  const value = {
    locale,
    setLocale,
    translations,
    loading,
  };
  
  // Render a loading screen while initial translations are being fetched.
  // This prevents the app from rendering with untranslated keys.
  if (loading && Object.keys(translations).length === 0) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
