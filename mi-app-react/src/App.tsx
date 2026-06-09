import { useState, useEffect } from 'react';
import './i18n';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import TourList from './components/TourList';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import BookingPage from './components/BookingPage';
import Carrusel from './components/carrusel';

// Importación de videos de fondo
import video1 from './assets/usar.mp4';
import video2 from './assets/uso2.mp4';
import video3 from './assets/usar3.mp4';
import video8 from './assets/usar8.mp4';
import video9 from './assets/usar9.mp4';
import video10 from './assets/usar10.mp4';

function App() {

  // Estado para gestionar el tema (claro/oscuro)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Lista de videos: He puesto los nuevos (10, 9, 8) primero como solicitaste
  const videos = [video10, video9, video8, video1, video2, video3];

  // Fondo personalizado desde el AdminPanel
  const [customBgType, setCustomBgType] = useState(() => localStorage.getItem('custom_bg_type'));
  const [customBgUrl, setCustomBgUrl] = useState(() => localStorage.getItem('custom_bg_url'));

  // Efecto para cargar la configuración desde la API al iniciar
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('admin_api.php?action=get_settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setCustomBgType(data.settings.bg_type);
          setCustomBgUrl(data.settings.bg_url);
          // Actualizamos localStorage para que coincida
          localStorage.setItem('custom_bg_type', data.settings.bg_type);
          localStorage.setItem('custom_bg_url', data.settings.bg_url);
        }
      } catch (error) {
        console.error("Error al cargar configuración de fondo:", error);
      }
    };
    fetchSettings();
  }, []);

  // Estado para controlar qué video se está reproduciendo actualmente
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Función para cambiar al siguiente video cuando el actual termine
  const handleVideoEnd = () => {
    // Si hay un video personalizado, no rotamos (lo mantenemos en bucle)
    if (customBgType === 'video' && customBgUrl) return;
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // Efecto para actualizar el fondo si cambia en localStorage (via AdminPanel)
  useEffect(() => {
    const checkStorage = () => {
      setCustomBgType(localStorage.getItem('custom_bg_type'));
      setCustomBgUrl(localStorage.getItem('custom_bg_url'));
    };
    window.addEventListener('storage', checkStorage);
    // También escuchamos cambios en el mismo tab (cada 5 segundos es suficiente ahora que tenemos carga inicial)
    const interval = setInterval(checkStorage, 5000);
    return () => {
      window.removeEventListener('storage', checkStorage);
      clearInterval(interval);
    };
  }, []);

  // Determinar si estamos en la vista de administración mediante el hash de la URL (#/admin)
  const [isAdminView, setIsAdminView] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash === '#/admin';
  });

  // Función para extraer el ID del tour desde el hash (#/reserva?id=...)
  const getBookingTourIdFromHash = () => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (hash.startsWith('#/reserva')) {
      const match = hash.match(/id=(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return null;
  };

  // Estado para el ID del tour que se está reservando
  const [bookingTourId, setBookingTourId] = useState<number | null>(() => getBookingTourIdFromHash());

  // Efecto para escuchar cambios en el hash de la URL y actualizar la vista
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#/admin');
      setBookingTourId(getBookingTourIdFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Efecto para aplicar estilos globales según el tema seleccionado
  useEffect(() => {
    const body = window.document.body;
    // No establecemos el color de fondo en el body directamente para que las capas z-index funcionen bien.
    // Solo gestionamos el color del texto global.
    if (theme === 'dark') {
      body.style.color = '#f1f5f9';
    } else {
      body.style.color = '#1e293b';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre modo claro y oscuro
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans relative isolate ${theme === 'dark' ? 'text-white' : 'text-slate-950'
      }`}>
      {/* CAPA 1: FONDO BASE (SÓLIDO)
          Esta capa asegura que no haya huecos transparentes. 
          Modificar los colores bg- si se desea cambiar el fondo de respaldo. */}
      <div className={`fixed inset-0 z-0 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
        }`} />

      {/* CAPA 2: VIDEO DINÁMICO
          Se muestra solo en pantallas grandes (Desktop) y si no estamos en el panel de admin.
          El 'overlay' (capa de color encima del video) es crucial para la legibilidad. */}
      {!isAdminView && (
        <div className="hidden lg:block fixed inset-0 z-10 pointer-events-none overflow-hidden">
          {customBgType === 'image' && customBgUrl ? (
            <img
              src={customBgUrl}
              alt="Fondo personalizado"
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
          ) : (
            <video
              key={customBgUrl || videos[currentVideoIndex]}
              autoPlay
              muted
              playsInline
              loop={!!customBgUrl}
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover opacity-100 transition-opacity duration-1000"
            >
              <source src={customBgUrl || videos[currentVideoIndex]} type="video/mp4" />
            </video>
          )}

          {/* OVERLAY: Ajusta la opacidad (/50, /70, etc.) para que el video se vea más o menos.
              Si el texto no se lee bien, aumenta el valor de la opacidad. */}
          <div className={`absolute inset-0 transition-colors duration-500 ${theme === 'dark'
            ? 'bg-slate-950/65' // Filtro oscuro para modo noche ligeramente más denso
            : 'bg-white/50'      // Filtro claro para modo día más denso para mejorar contraste
            }`} />
        </div>
      )}

      {/* BOTÓN DE TEMA: Cambia entre Sol/Luna */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full border transition-all duration-300 z-50 focus:outline-none hover:scale-110 active:scale-90 shadow-lg ${theme === 'dark'
          ? 'border-slate-700 bg-slate-900/80 text-yellow-400 backdrop-blur-sm'
          : 'border-slate-200 bg-white/80 text-slate-700 backdrop-blur-sm'
          }`}
        aria-label="Alternar tema"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* CAPA 3: CONTENIDO PRINCIPAL
          z-20 asegura que el contenido esté siempre por encima del video. */}
      <div className="relative z-20 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        {/* Selector de idiomas: Oculto en el panel de admin para evitar distracciones */}
        {!isAdminView && (
          <div className="flex justify-end mb-8">
            <LanguageSelector theme={theme} />
          </div>
        )}

        {/* Lógica de navegación principal */}
        {isAdminView ? (
          <AdminPanel theme={theme} onClose={() => { window.location.hash = ''; }} />
        ) : bookingTourId !== null ? (
          <BookingPage theme={theme} tourId={bookingTourId} onClose={() => { window.location.hash = ''; }} />
        ) : (
          <>
            <Header theme={theme} />

            <main className="space-y-24">


              {/* Aquí se cargan las secciones de la página de inicio */}
              <TourList theme={theme} />
              {/* Carrusel de imágenes destacadas */}
              <Carrusel theme={theme} />
              <Features theme={theme} />
              <Testimonials theme={theme} />
              <FAQ theme={theme} />
            </main>
          </>
        )}

        <Footer theme={theme} />
      </div>
    </div>
  );
}

export default App;