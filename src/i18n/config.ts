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
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "mc_language",
    },
    react: { useSuspense: false },
  });

const updateDocumentLanguage = (language: string) => {
  document.documentElement.lang = language.startsWith("ny") ? "ny" : "en";
};
updateDocumentLanguage(i18n.resolvedLanguage || i18n.language);
i18n.on("languageChanged", updateDocumentLanguage);

export default i18n;
