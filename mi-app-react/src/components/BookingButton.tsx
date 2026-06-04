import { useTranslation } from 'react-i18next';

interface BookingButtonProps {
  onClick?: () => void;
}

const BookingButton = ({ onClick }: BookingButtonProps) => {
  const { t } = useTranslation();

  return (
    <button 
      onClick={onClick}
      className="w-full mt-5 py-3 px-6 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] select-none focus:outline-none"
    >
      {t('boton_reservar')}
    </button>
  );
};

export default BookingButton;