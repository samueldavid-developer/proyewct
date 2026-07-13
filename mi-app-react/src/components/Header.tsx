import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import logo from '../assets/logo.jpeg';
interface HeaderProps {
  theme: string;
}

const Header = ({ theme }: HeaderProps) => {
  const { t } = useTranslation();
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    tl.fromTo(titleRef.current,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' },
      '-=0.5'
    );
    tl.fromTo(subtitleRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="text-center py-10 mb-8"
    >
      <div className="mx-auto mb-6 flex items-center justify-center w-52 h-52 rounded-full overflow-hidden shadow-lg border-2 border-white">
        <img
          src={logo}
          alt="Nina Tuk Tours Logo"
          className="w-full h-full object-cover scale-110"
        />
      </div>


      <h1
        ref={titleRef}
        className={`text-cyan-600 font-extrabold text-5xl md:text-6xl tracking-tight select-none transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
      >
        Nina Tuk Tours
      </h1>
      <p
        ref={subtitleRef}
        className={`mt-4 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed transition-colors duration-500 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}
      >
        {t('eslogan')}
      </p>
    </header>
  );
};

export default Header;