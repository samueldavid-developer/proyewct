import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FAQProps {
  theme: string;
}

const FAQ = ({ theme }: FAQProps) => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') }
  ];

  const toggleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 border-t border-b border-slate-200/50 dark:border-slate-800/40 my-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-500 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          {t('faq_titulo')}
        </h2>
        <p className={`mt-3 text-sm transition-colors duration-500 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t('faq_subtitulo')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-800/60' 
                  : 'bg-white border-slate-200/70'
              }`}
            >
              <button
                onClick={() => toggleOpen(index)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base focus:outline-none select-none"
              >
                <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}>
                  {faq.q}
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  } ${isOpen ? 'transform rotate-180 text-rose-500 dark:text-rose-400' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-40 border-t' : 'max-h-0'
                } ${
                  theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
                }`}
              >
                <div className={`p-5 text-sm leading-relaxed transition-colors duration-500 ${
                  theme === 'dark' ? 'text-slate-400 bg-slate-950/20' : 'text-slate-600 bg-slate-50/50'
                }`}>
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
