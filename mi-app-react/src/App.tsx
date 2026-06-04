import { useState, useEffect } from 'react';
import './i18n'; 
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import TourList from './components/TourList';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [isAdminView, setIsAdminView] = useState(() => {
    return typeof window !== 'undefined' && window.location.hash === '#/admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#/admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const body = window.document.body;
    const html = window.document.documentElement;
    if (theme === 'dark') {
      body.style.backgroundColor = '#020617'; // slate-950
      body.style.color = '#f1f5f9';
      html.style.backgroundColor = '#020617';
    } else {
      body.style.backgroundColor = '#f8fafc'; // slate-50
      body.style.color = '#1e293b';
      html.style.backgroundColor = '#f8fafc';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full border transition-all duration-300 z-50 focus:outline-none hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${
          theme === 'dark' 
            ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white' 
            : 'border-slate-200 bg-white text-slate-650 hover:text-slate-950'
        }`}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        )}
      </button>

      {/* Content wrapper */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isAdminView ? (
          <AdminPanel theme={theme} onClose={() => { window.location.hash = ''; }} />
        ) : (
          <>
            <Header theme={theme} />
            <LanguageSelector theme={theme} />
            
            <main>
              <TourList theme={theme} />
              <Features theme={theme} />
              <Testimonials theme={theme} />
              <FAQ theme={theme} />
            </main>
          </>
        )}

        <Footer theme={theme} />
      </div>
    </div>
  );
}

export default App;