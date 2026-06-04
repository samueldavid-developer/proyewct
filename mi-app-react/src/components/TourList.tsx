import { useEffect, useState } from 'react';
import BookingButton from './BookingButton';
import { useTranslation } from 'react-i18next';

interface Tour {
  id: number;
  nombre_es: string;
  nombre_en: string;
  nombre_pl: string;
  precio: number;
  imagenes?: string[];
}

const SkeletonCard = ({ theme }: { theme: string }) => (
  <div className={`animate-pulse rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[340px] border transition-colors duration-500 ${
    theme === 'dark' ? 'bg-slate-900 border-slate-800/70' : 'bg-white border-slate-200/70'
  }`}>
    <div>
      <div className={`h-32 rounded-xl mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`h-5 rounded w-3/4 mb-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`h-6 rounded w-1/4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </div>
    <div className={`h-11 rounded-xl mt-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
  </div>
);

interface TourCardProps {
  tour: Tour;
  theme: string;
  index: number;
}

const TourCard = ({ tour, theme, index }: TourCardProps) => {
  const { i18n } = useTranslation();
  const [imgIndex, setImgIndex] = useState(0);

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'es';

  const getLocalizedName = () => {
    if (currentLang === 'es') return tour.nombre_es;
    if (currentLang === 'pl') return tour.nombre_pl;
    if (currentLang === 'en') return tour.nombre_en;
    if (currentLang === 'it') return tour.nombre_en || tour.nombre_es;
    if (currentLang === 'pt') return tour.nombre_es || tour.nombre_en;
    if (currentLang === 'fr') return tour.nombre_en || tour.nombre_es;
    return tour.nombre_es;
  };

  const images = tour.imagenes && tour.imagenes.length > 0 ? tour.imagenes : [];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 7000); // 7 segundos para un avance automático más lento, suave y relajante
    return () => clearInterval(timer);
  }, [imgIndex, images.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className={`tour-card animate-fade-in-up rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer border ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800/60 hover:border-slate-700' 
          : 'bg-white border-slate-200/70 hover:border-slate-350'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div>
        {/* Slider Area */}
        <div className={`h-40 rounded-xl relative overflow-hidden mb-5 border transition-colors duration-500 ${
          theme === 'dark' 
            ? 'bg-slate-950/40 border-slate-800/30' 
            : 'bg-slate-50 border-slate-100'
        }`}>
          {images.length > 0 ? (
            <>
              {/* Slider Image */}
              <img 
                key={imgIndex}
                src={images[imgIndex]} 
                alt={`${getLocalizedName()} slide ${imgIndex + 1}`}
                className="w-full h-full object-cover select-none animate-fade-in"
              />

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImgIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      idx === imgIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Fallback Map Icon */
            <div className="w-full h-full flex items-center justify-center">
              <svg className={`w-10 h-10 transition-all duration-300 group-hover:scale-105 ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          )}
        </div>

        <h3 className={`font-bold text-lg md:text-xl leading-snug transition-colors duration-300 ${
          theme === 'dark' ? 'text-slate-100 group-hover:text-rose-400' : 'text-slate-800 group-hover:text-rose-500'
        }`}>
          {getLocalizedName()}
        </h3>
        
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}>Desde</span>
          <span className={`text-2xl font-black transition-colors duration-300 ${
            theme === 'dark' ? 'text-white group-hover:text-rose-450' : 'text-slate-900 group-hover:text-rose-500'
          }`}>
            €{tour.precio}
          </span>
        </div>
      </div>
      
      <BookingButton onClick={() => console.log(`Reservando ${getLocalizedName()}`)} />
    </div>
  );
};

interface TourListProps {
  theme: string;
}

const TourList = ({ theme }: TourListProps) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('http://localhost/proyewct/bace.php')
      .then((res) => {
        if (!res.ok) throw new Error('Error en la red');
        return res.json();
      })
      .then((datos) => {
        setTours(datos);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar los tours:", err);
        setError(true);
        setCargando(false); 
      });
  }, []);

  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0 mb-12">
        <SkeletonCard theme={theme} />
        <SkeletonCard theme={theme} />
        <SkeletonCard theme={theme} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-16 px-6 max-w-md mx-auto rounded-2xl shadow-sm my-10 border transition-colors duration-500 ${
        theme === 'dark' ? 'bg-slate-900 border-red-950/20' : 'bg-white border-red-100'
      }`}>
        <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/30">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className={`font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          Lo sentimos, no pudimos cargar los tours.
        </p>
        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Por favor, comprueba tu conexión o vuelve a intentarlo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0 mb-12">
      {tours.map((tour, index) => (
        <TourCard 
          key={tour.id}
          tour={tour}
          theme={theme}
          index={index}
        />
      ))}
    </div>
  );
};

export default TourList;