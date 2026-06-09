import { useTranslation } from 'react-i18next';

interface FooterProps {
  theme: string;
}

const Footer = ({ theme }: FooterProps) => {
  const { t } = useTranslation();

  return (
    /* FOOTER: Ajuste de colores para que resalte sobre el fondo de video.
       Se ha añadido un fondo semi-transparente y desenfoque (backdrop-blur) 
       para que las letras blancas o negras se vean perfectamente. */
    <footer className={`mt-24 pt-12 pb-8 px-8 rounded-t-3xl border-t transition-all duration-500 backdrop-blur-md ${theme === 'dark'
      ? 'border-slate-800/60 bg-slate-950/40 text-white'
      : 'border-slate-200/70 bg-white/40 text-slate-900'
      }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className={`text-2xl font-black mb-4 transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
            Nina Tuk Tours
          </h3>
          <p className={`text-sm leading-relaxed max-w-sm font-semibold transition-colors duration-500 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'
            }`}>
            {t('eslogan')}
          </p>
        </div>

        <div>
          <h4 className={`text-xs font-black uppercase tracking-widest mb-6 transition-colors duration-500 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
            }`}>
            {t('footer_contacto')}
          </h4>
          <ul className="space-y-4 text-sm font-bold">
            <li className="flex items-start gap-3 group">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{t('footer_tlf')}</span>
                <span className={`transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>+34 653 830 002</span>
              </div>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={`transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{t('footer_email')}</span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className={`transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{t('footer_direccion')}</span>
            </li>
            <li className="flex items-center gap-3 group">
              <a
                href="https://www.instagram.com/nina.tuk.tours?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full"
              >
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className={`transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>Instagram</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200/30 dark:border-slate-800/20 text-center text-[10px] font-black uppercase tracking-widest">
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-900'}>
          &copy; {new Date().getFullYear()} {t('footer_derechos')} |{' '}
          <a
            href="#/admin"
            className="text-rose-600 hover:text-rose-700 transition-colors duration-300 inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Acceso Panel Admin
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
