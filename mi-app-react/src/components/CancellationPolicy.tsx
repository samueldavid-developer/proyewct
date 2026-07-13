import React from 'react';
import { useTranslation } from 'react-i18next';

interface CancellationPolicyProps {
  theme: string;
}

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({ theme }) => {
  const { t } = useTranslation();
  const email = t('footer_email');
  const phone = t('footer_tlf');

  const sectionClasses = `p-6 md:p-8 rounded-3xl border transition-all duration-500 shadow-sm ${
    theme === 'dark' 
      ? 'bg-slate-900/50 border-slate-800/60 text-slate-300' 
      : 'bg-white border-slate-200 text-slate-600'
  }`;

  const titleClasses = `text-xl font-black mb-4 flex items-center gap-3 ${
    theme === 'dark' ? 'text-white' : 'text-slate-900'
  }`;

  const iconContainerClasses = "p-2 rounded-xl bg-rose-500/10 text-rose-500";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          {t('cancellation.title')}
        </h1>
        <p className={`text-sm font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
        }`}>
          {t('cancellation.last_update')}
        </p>
        <div className="w-24 h-1.5 bg-rose-500 mx-auto mt-6 rounded-full" />
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <p className={`text-lg leading-relaxed font-medium text-center max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t('cancellation.intro')}
        </p>

        {/* Section 1: Deadlines */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {t('cancellation.section1_title')}
          </h2>
          <ul className="space-y-4 font-semibold">
            <li className="flex items-start gap-3">
              <span className="text-rose-500 mt-1">•</span>
              <span><strong className={theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}>{t('cancellation.section1_item1')}</strong> {t('cancellation.section1_item1_desc')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-rose-500 mt-1">•</span>
              <span><strong className={theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}>{t('cancellation.section1_item2')}</strong> {t('cancellation.section1_item2_desc')}</span>
            </li>
            <li className="flex items-start gap-3 text-rose-500">
              <span className="mt-1">•</span>
              <span><strong className="font-bold">{t('cancellation.section1_item3')}</strong> {t('cancellation.section1_item3_desc')}</span>
            </li>
          </ul>
        </section>

        {/* Section 2: How to Request */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {t('cancellation.section2_title')}
          </h2>
          <p className="mb-6 font-medium leading-relaxed">
            {t('cancellation.section2_intro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <a 
              href={`https://wa.me/${phone.replace(/\s+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                theme === 'dark' ? 'bg-slate-950/50 border-slate-800 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-100 hover:border-emerald-500/50'
              }`}
            >
              <div className="text-emerald-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('cancellation.section2_whatsapp')}</span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{phone}</span>
              </div>
            </a>
            <a 
              href={`mailto:${email}`}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                theme === 'dark' ? 'bg-slate-950/50 border-slate-800 hover:border-rose-500/50' : 'bg-slate-50 border-slate-100 hover:border-rose-500/50'
              }`}
            >
              <div className="text-rose-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('cancellation.section2_email')}</span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{email}</span>
              </div>
            </a>
          </div>
          <ul className="space-y-3 text-sm font-bold">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{t('cancellation.section2_item1')}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{t('cancellation.section2_item2')}</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Refund Times */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            {t('cancellation.section3_title')}
          </h2>
          <p className="font-medium leading-relaxed">
            {t('cancellation.section3_desc')}
          </p>
        </section>
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-center">
        <p className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {t('cancellation.footer_text', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
};

export default CancellationPolicy;
