import { useTranslation } from 'react-i18next';

interface TestimonialsProps {
  theme: string;
}

const Testimonials = ({ theme }: TestimonialsProps) => {
  const { t } = useTranslation();

  const reviews = [
    {
      key: 'r1',
      author: t('test_1_autor'),
      country: t('test_1_pais'),
      text: t('test_1_coment'),
      initials: 'SM',
      color: 'bg-rose-500/10 text-rose-500'
    },
    {
      key: 'r2',
      author: t('test_2_autor'),
      country: t('test_2_pais'),
      text: t('test_2_coment'),
      initials: 'JD',
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    {
      key: 'r3',
      author: t('test_3_autor'),
      country: t('test_3_pais'),
      text: t('test_3_coment'),
      initials: 'KK',
      color: 'bg-emerald-500/10 text-emerald-500'
    }
  ];

  return (
    <section className="py-12 my-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-500 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          {t('test_titulo')}
        </h2>
        <p className={`mt-3 text-sm transition-colors duration-500 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t('test_subtitulo')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev) => (
          <div 
            key={rev.key}
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800/60' 
                : 'bg-white border-slate-200/70'
            }`}
          >
            <div>
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className={`text-sm italic leading-relaxed transition-colors duration-500 mb-6 ${
                theme === 'dark' ? 'text-slate-350' : 'text-slate-600'
              }`}>
                "{rev.text}"
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rev.color}`}>
                {rev.initials}
              </div>
              <div>
                <h4 className={`font-bold text-sm transition-colors duration-500 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {rev.author}
                </h4>
                <p className={`text-xs transition-colors duration-500 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {rev.country}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
