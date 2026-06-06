import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

interface LanguageSelectorProps {
  theme: string;
}

const LanguageSelector = ({ theme }: LanguageSelectorProps) => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { scale: 0.98, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power2.out' }
    );
  }, []);

  const cambiarIdioma = (idioma: string) => {
    i18n.changeLanguage(idioma);
  };

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'es';

  const getBtnClass = (lang: string) => {
    const isActive = currentLang === lang;
    if (isActive) {
      return 'bg-rose-500 text-white shadow-sm flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-350 focus:outline-none';
    }
    return `flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-350 focus:outline-none hover:scale-105 active:scale-95 ${
      theme === 'dark'
        ? 'bg-transparent text-slate-400 hover:text-slate-150'
        : 'bg-transparent text-slate-500 hover:text-slate-800'
    }`;
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-wrap items-center justify-center gap-3 p-2 rounded-full border shadow-sm max-w-xl mx-auto mb-12 transition-colors duration-500 ${
        theme === 'dark' ? 'border-slate-800/70 bg-slate-900' : 'border-slate-200/70 bg-white'
      }`}
    >
      <span className={`text-[10px] font-black uppercase tracking-widest ml-3 mr-1 ${
        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
      }`}>
        {t('seleccionar_idioma')}:
</span>
<button onClick={() => cambiarIdioma('es')} className={getBtnClass('es')}>
  <span>🇪🇸 ES</span>
</button>
<button onClick={() => cambiarIdioma('en')} className={getBtnClass('en')}>
  <span>🇬🇧 EN</span>
</button>
<button onClick={() => cambiarIdioma('pl')} className={getBtnClass('pl')}>
  <span>🇵🇱 PL</span>
</button>
<button onClick={() => cambiarIdioma('it')} className={getBtnClass('it')}>
  <span>🇮🇹 IT</span>
</button>
<button onClick={() => cambiarIdioma('pt')} className={getBtnClass('pt')}>
  <span>🇵🇹 PT</span>
</button>
<button onClick={() => cambiarIdioma('fr')} className={getBtnClass('fr')}>
  <span>🇫🇷 FR</span>
</button>
    </div>
  );
};

export default LanguageSelector;