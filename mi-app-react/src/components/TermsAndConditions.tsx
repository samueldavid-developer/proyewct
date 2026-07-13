import React from 'react';
import { useTranslation } from 'react-i18next';

interface TermsAndConditionsProps {
  theme: string;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ theme }) => {
  const { t } = useTranslation();

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
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          {t('terms.title')}
        </h1>
        <p className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
        }`}>
          {t('terms.last_update')}
        </p>
        <div className="w-24 h-1.5 bg-rose-500 mx-auto mt-6 rounded-full" />
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <p className={`text-lg leading-relaxed font-medium text-center max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t('terms.intro')}
        </p>

        {/* Section 1: Acceptance of Terms */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {t('terms.section1_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('terms.section1_content')}
          </p>
        </section>

        {/* Section 2: Service Provision */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {t('terms.section2_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('terms.section2_content')}
          </p>
        </section>

        {/* Section 3: Passenger Behavior */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {t('terms.section3_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('terms.section3_content')}
          </p>
        </section>

        {/* Section 4: Liability */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            {t('terms.section4_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('terms.section4_content')}
          </p>
        </section>

        {/* Section 5: Pricing and Payments */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            {t('terms.section5_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('terms.section5_content')}
          </p>
        </section>
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-center">
        <p className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {t('terms.footer_text', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
