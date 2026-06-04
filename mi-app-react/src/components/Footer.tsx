import { useTranslation } from 'react-i18next';

interface FooterProps {
  theme: string;
}

const Footer = ({ theme }: FooterProps) => {
  const { t } = useTranslation();

  return (
    <footer className={`mt-16 pt-12 pb-8 border-t transition-colors duration-500 ${
      theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200/70'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className={`text-xl font-extrabold mb-4 transition-colors duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Nina Tuk Tours
          </h3>
          <p className={`text-sm leading-relaxed max-w-sm transition-colors duration-500 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {t('eslogan')}
          </p>
        </div>

        <div>
          <h4 className={`text-xs font-black uppercase tracking-widest mb-4 transition-colors duration-500 ${
            theme === 'dark' ? 'text-slate-450' : 'text-slate-400'
          }`}>
            {t('footer_contacto')}
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className={theme === 'dark' ? 'text-slate-350' : 'text-slate-600'}>
                {t('footer_tlf')}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className={theme === 'dark' ? 'text-slate-350' : 'text-slate-600'}>
                {t('footer_email')}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className={theme === 'dark' ? 'text-slate-350' : 'text-slate-600'}>
                {t('footer_direccion')}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200/30 dark:border-slate-800/20 text-center text-xs">
        <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>
          &copy; {new Date().getFullYear()} {t('footer_derechos')} |{' '}
          <a 
            href="#/admin" 
            className="hover:text-rose-500 font-semibold transition-colors duration-300 inline-flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Acceso Admin
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
