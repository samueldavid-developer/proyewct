import { useTranslation } from 'react-i18next';

interface FeaturesProps {
  theme: string;
}

const Features = ({ theme }: FeaturesProps) => {
  const { t } = useTranslation();

  const features = [
    {
      key: 'eco',
      title: t('feat_eco_titulo'),
      desc: t('feat_eco_desc'),
      // Leaf SVG Icon
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      key: 'guides',
      title: t('feat_guides_titulo'),
      desc: t('feat_guides_desc'),
      // Certified/User SVG Icon
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      key: 'custom',
      title: t('feat_custom_titulo'),
      desc: t('feat_custom_desc'),
      // Map Pin/Route SVG Icon
      icon: (
        <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-12 border-t border-b border-slate-200/50 dark:border-slate-800/40 my-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-500 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          {t('features_titulo')}
        </h2>
        <p className={`mt-3 text-sm transition-colors duration-500 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t('features_subtitulo')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feat) => (
          <div 
            key={feat.key}
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800/60' 
                : 'bg-white border-slate-200/70'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${
              theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
            }`}>
              {feat.icon}
            </div>
            <h3 className={`font-bold text-lg mb-2 transition-colors duration-500 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {feat.title}
            </h3>
            <p className={`text-sm leading-relaxed transition-colors duration-500 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
