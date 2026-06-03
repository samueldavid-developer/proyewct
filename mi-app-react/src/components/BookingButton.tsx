import { useTranslation } from 'react-i18next';

interface BookingButtonProps {
  onClick?: () => void;
}

const BookingButton = ({ onClick }: BookingButtonProps) => {
  const { t } = useTranslation();

  return (
    <button 
      onClick={onClick}
      style={{ 
        marginTop: '20px', 
        padding: '15px', 
        fontSize: '16px', 
        backgroundColor: '#1D3557', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer',
        width: '100%',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}
    >
      {t('boton_reservar')}
    </button>
  );
};

export default BookingButton;