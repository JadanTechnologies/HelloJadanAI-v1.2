import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const { translations } = useContext(LanguageContext);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return { t };
};
