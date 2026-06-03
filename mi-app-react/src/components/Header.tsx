import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header style={{ 
      backgroundColor: '#ffffff', // Rojo elegante
      color: 'white', 
      padding: '5px 20px', 
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
      marginBottom: '40px'
    }}>
      <h1 style={{ margin: '0', fontSize: '3rem', fontWeight: '800', letterSpacing: '1px' }}>
        Madrid Tuk-Tours
      </h1>
      <p style={{ margin: '20px auto 0', fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', color: '#333' }}>
        {t('eslogan')}
      </p>
    </header>
  );
};

export default Header;