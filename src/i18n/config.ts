import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import ny from "./ny.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["en", "ny"],
    fallbackLng: "en",
    resources: { en: { translation: en }, ny: { translation: ny } },
    detection: {
      order: ["localStorage", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });

export default i18n;
