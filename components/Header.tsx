
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../App';

const Header: React.FC = () => {
  const { settings, user } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Hide header entirely on admin, login, signup, and account pages
  if (location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/account') {
    return null;
  }

  const navLinks = [
    { name: settings.navHomeLabel, path: '/' },
    { name: settings.navProductsLabel, path: '/products' },
    { name: settings.navAboutLabel, path: '/about' },
    { name: settings.navContactLabel, path: '/contact' },
  ];

  const isDashboard = location.pathname === '/account';

  // Logic: Header is solid if we are scrolled OR if we are NOT on the home page
  const isHomePage = location.pathname === '/';
  const shouldBeSolid = scrolled || !isHomePage;
  
  // Enable dark section text (white text) ONLY on Home page when NOT scrolled/solid
  const isDarkSection = !shouldBeSolid && isHomePage;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
      shouldBeSolid 
        ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-100 py-4 shadow-sm' 
        : 'bg-transparent py-8'
    }`}>
      <nav className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center relative">
          {/* Logo Section - Left */}
          <Link to="/" className="flex items-center gap-4 group z-10">
            {settings.companyLogoUrl ? (
              <img 
                src={settings.companyLogoUrl} 
                alt={settings.companyName} 
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
              />
            ) : (
              <div className={`text-xl md:text-2xl font-serif font-bold tracking-tighter transition-colors duration-500 ${!isDarkSection ? 'text-slate-900' : 'text-white'}`}>
                {settings.companyName}
              </div>
            )}
            <div className={`hidden lg:flex flex-col -space-y-1`}>
              <span className={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${!isDarkSection ? 'text-primary' : 'text-primary'}`}>
                {settings.slogan}
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Center */}
          {!isDashboard && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all relative group ${
                    location.pathname === link.path 
                      ? 'text-primary' 
                      : (!isDarkSection ? 'text-slate-500 hover:text-slate-900' : 'text-white/70 hover:text-white')
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-500 opacity-0 ${
                    location.pathname === link.path ? 'opacity-100' : 'group-hover:opacity-50'
                  }`}></span>
                </Link>
              ))}
            </div>
          )}
          
          {/* Actions - Right */}
          <div className="flex items-center gap-3 md:gap-8 z-10">
            <Link
              to="/products"
              className={`transition-all duration-500 hover:scale-110 ${!isDarkSection ? 'text-slate-900 hover:text-primary' : 'text-white hover:text-white'}`}
            >
              <ShoppingBag className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
            </Link>
            {user ? (
              <Link
                to={user.user_metadata?.role === 'admin' ? '/admin' : '/account'}
                className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl hover:shadow-primary/20 ${
                  !isDarkSection 
                    ? 'bg-slate-900 text-white hover:bg-primary hover:text-slate-900' 
                    : 'bg-white text-slate-900 hover:bg-primary hover:text-slate-900'
                }`}
              >
                <span>{user.user_metadata?.role === 'admin' ? 'Portal' : 'Account'}</span>
              </Link>
            ) : (
              <Link
                to="/login?view=login"
                className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl hover:shadow-primary/20 ${
                  !isDarkSection 
                    ? 'bg-slate-900 text-white hover:bg-primary hover:text-slate-900' 
                    : 'bg-white text-slate-900 hover:bg-primary hover:text-slate-900'
                }`}
              >
                <span>Log In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                !isDarkSection ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] py-3 border-b border-slate-50 last:border-none transition-colors ${
                    location.pathname === link.path ? 'text-primary' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
