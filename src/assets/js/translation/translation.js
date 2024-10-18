import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en";
import pt from "./languages/pt";

// Recuperate language and save in the session (if any)
const chosenLanguage = sessionStorage.getItem("chosenLanguage") || "en";

i18n.use(initReactI18next).init({
  debug: false,
  lng: chosenLanguage, // Define initial language from the sessionStorage or use "en" by default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: en ,
    pt: pt,
  },
});

export default i18n;
