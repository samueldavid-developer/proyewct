import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface CarruselItem {
  id: number | string;
  ruta_imagen: string;
}

const API_URL = 'https://ninatuktours.com/admin_api.php';

// Helper function to detect video files
const isVideo = (url: string): boolean => {
  const videoExtensions = /\.(mp4|webm|mov|m4v|ogg)$/i;
  return videoExtensions.test(url);
};

const Carrusel = ({ theme }: { theme: string }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CarruselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}?action=get_carrusel`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching carrusel images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchImages();
    };
    load();
  }, [fetchImages]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-slide effect - pause for videos
  useEffect(() => {
    if (items.length === 0) return;
    const currentItem = items[currentIndex];
    const isCurrentVideo = isVideo(currentItem.ruta_imagen);
    
    // Don't auto-advance if it's a video
    if (isCurrentVideo) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [items.length, currentIndex, nextSlide, items]);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-8 mb-16">
      {/* Título de la sección */}
      <div className="text-center space-y-2">
        <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>
          {t('carrusel_titulo')}
        </h2>
        <div className="w-16 h-1 bg-rose-500 mx-auto rounded-full" />
      </div>

      {/* Contenedor del Carrusel */}
      <div className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[500px] overflow-hidden rounded-[2.5rem] shadow-2xl group border border-slate-200/10 bg-black/5 dark:bg-white/5">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => {
            const isItemVideo = isVideo(item.ruta_imagen);
            return (
              <div key={item.id} className="min-w-full h-full relative flex items-center justify-center overflow-hidden">
                {/* FOTOGRAFÍA/VIDEO DE FONDO: super blur */}
                {isItemVideo ? (
                  <video
                    src={item.ruta_imagen}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover blur-[50px] opacity-65 scale-125 pointer-events-none select-none"
                  />
                ) : (
                  <img
                    src={item.ruta_imagen}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-[50px] opacity-65 scale-125 pointer-events-none select-none"
                  />
                )}

                {/* Imagen/Video Principal */}
                {isItemVideo ? (
                  <video
                    src={item.ruta_imagen}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="relative z-10 max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <img
                    src={item.ruta_imagen}
                    alt="Experiencia"
                    className="relative z-10 max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}

                {/* Overlay sutil inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Botones de Navegación - Estilo Glassmorphism */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 active:scale-95 z-30"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 active:scale-95 z-30"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores Inferiores */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all duration-500 rounded-full ${currentIndex === i
                ? 'bg-rose-500 w-10 h-2 shadow-lg shadow-rose-500/50'
                : 'bg-white/40 w-2 h-2 hover:bg-white/70'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carrusel;
