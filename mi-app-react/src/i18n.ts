import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Define your translations
const resources = {
  es: {
    translation: {
      eslogan: "Descubre Madrid de una forma única y ecológica",
      boton_reservar: "Reservar ahora",
      seleccionar_idioma: "Idioma",
      personas: "personas" // Si lo necesitas para tu BookingButton
    }
  },
  en: {
    translation: {
      eslogan: "Discover Madrid in a unique and eco-friendly way",
      boton_reservar: "Book now",
      seleccionar_idioma: "Language",
      personas: "people"
    }
  },
  pl: {
    translation: {
      eslogan: "Odkryj Madryt w wyjątkowy i ekologiczny sposób",
      boton_reservar: "Zarezerwuj teraz",
      seleccionar_idioma: "Język",
      personas: "ludzie"
    }
  }
};

// 2. Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: 'es', // Default language
    fallbackLng: 'en', // Fallback language if a key is missing
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;