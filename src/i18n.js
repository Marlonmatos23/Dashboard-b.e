import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// REMOVIDO: import HttpApi from 'i18next-http-backend';

// 1. Importe as suas traduções diretamente (caminhos corrigidos)
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

// 2. Defina os recursos manualmente
const resources = {
  en: {
    translation: translationEN
  },
  pt: {
    translation: translationPT
  }
};

i18n
  // REMOVIDO: .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 3. Passe os recursos diretamente
    resources,
    supportedLngs: ['pt', 'en'],
    fallbackLng: 'pt',
    debug: true, // Deixe isto ativo enquanto depura

    interpolation: {
      escapeValue: false, // React já faz o escape
    },
  });

export default i18n;

