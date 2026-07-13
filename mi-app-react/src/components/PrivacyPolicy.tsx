import React from 'react';
import { useTranslation } from 'react-i18next';

interface PrivacyPolicyProps {
  theme: string;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ theme }) => {
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
          {t('privacy.title')}
        </h1>
        <p className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
        }`}>
          {t('privacy.last_update')}
        </p>
        <div className="w-24 h-1.5 bg-rose-500 mx-auto mt-6 rounded-full" />
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <p className={`text-lg leading-relaxed font-medium text-center max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t('privacy.intro')}
        </p>

        {/* Section 1: Data Collection */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {t('privacy.section1_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('privacy.section1_content')}
          </p>
        </section>

        {/* Section 2: Use of Information */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {t('privacy.section2_title')}
          </h2>
          <ul className="space-y-3 font-medium">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
              <span>{t('privacy.section2_item1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
              <span>{t('privacy.section2_item2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
              <span>{t('privacy.section2_item3')}</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Sharing Data with Third Parties */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            {t('privacy.section3_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('privacy.section3_content')}
          </p>
        </section>

        {/* Section 4: Security */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            {t('privacy.section4_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('privacy.section4_content')}
          </p>
        </section>

        {/* Section 5: Your Rights */}
        <section className={sectionClasses}>
          <h2 className={titleClasses}>
            <div className={iconContainerClasses}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {t('privacy.section5_title')}
          </h2>
          <p className="leading-relaxed font-medium">
            {t('privacy.section5_content')}
          </p>
        </section>
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-center">
        <p className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {t('privacy.footer_text', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
