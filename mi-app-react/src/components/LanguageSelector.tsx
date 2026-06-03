import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const cambiarIdioma = (idioma: string) => {
    i18n.changeLanguage(idioma);
  };

  return (
    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
      <strong>{t('seleccionar_idioma')}: </strong>
      <button onClick={() => cambiarIdioma('es')} style={{ margin: '0 5px' }}>🇪🇸 Español</button>
      <button onClick={() => cambiarIdioma('en')} style={{ margin: '0 5px' }}>🇬🇧 English</button>
      <button onClick={() => cambiarIdioma('pl')} style={{ margin: '0 5px' }}>🇵🇱 Polski</button>
    </div>
  );
};

export default LanguageSelector;