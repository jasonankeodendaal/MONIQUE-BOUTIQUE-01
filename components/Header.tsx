
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../App';

const Header: React.FC = () => {
  const { settings, user } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const shouldBeSolid = scrolled || !isHomePage || isOpen;
  
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
                className="h-12 md:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
              />
            ) : (
              <div className={`text-2xl md:text-3xl font-serif font-bold tracking-tighter transition-colors duration-500 ${!isDarkSection ? 'text-slate-900' : 'text-white'}`}>
                {settings.companyLogo}
              </div>
            )}
            <div className={`flex flex-col -space-y-1 ${settings.companyLogoUrl ? 'hidden lg:flex' : 'flex'}`}>
              <span className={`text-lg font-serif font-bold tracking-tight transition-colors duration-500 ${!isDarkSection ? 'text-slate-900' : 'text-white'}`}>
                {settings.companyName}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${!isDarkSection ? 'text-primary' : 'text-primary'}`}>
                {settings.slogan}
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Center */}
          {!isDashboard && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all relative group ${
                    location.pathname === link.path 
                      ? 'text-primary' 
                      : (!isDarkSection ? 'text-slate-500 hover:text-slate-900' : 'text-white/70 hover:text-white')
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary transition-all duration-500 ${
                    location.pathname === link.path ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                  }`}></span>
                </Link>
              ))}
            </div>
          )}
          
          {/* Actions - Right */}
          <div className="hidden md:flex items-center gap-8 z-10">
            <Link
              to="/products"
              className={`transition-all duration-500 hover:scale-110 ${!isDarkSection ? 'text-slate-900 hover:text-primary' : 'text-white/80 hover:text-white'}`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </Link>
            {user ? (
              <Link
                to={user.user_metadata?.role === 'admin' ? '/admin' : '/account'}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl hover:shadow-primary/20 ${
                  !isDarkSection 
                    ? 'bg-slate-900 text-white hover:bg-primary hover:text-slate-900' 
                    : 'bg-white text-slate-900 hover:bg-primary hover:text-slate-900'
                }`}
              >
                {user.user_metadata?.role === 'admin' ? 'Dashboard' : 'Account'}
              </Link>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  to="/login?view=login"
                  className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${
                    !isDarkSection ? 'text-slate-900 hover:text-primary' : 'text-white hover:text-primary'
                  }`}
                >
                  Log In
                </Link>
                {settings.clientLoginRegistrationEnabled !== false && (
                  <Link
                    to="/signup"
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl hover:shadow-primary/20 ${
                      !isDarkSection 
                        ? 'bg-slate-900 text-white hover:bg-primary hover:text-slate-900' 
                        : 'bg-white text-slate-900 hover:bg-primary hover:text-slate-900'
                    }`}
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${!isDarkSection ? 'text-slate-900' : 'text-white'}`}
            >
              {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-slate-100 shadow-2xl py-12 px-8"
            >
              <div className="flex flex-col gap-10">
                {!isDashboard && navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-4xl font-serif tracking-tighter ${
                      location.pathname === link.path ? 'text-primary' : 'text-slate-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-10 border-t border-slate-100 flex flex-col gap-6">
                  {user ? (
                    <Link
                      to={user.user_metadata?.role === 'admin' ? '/admin' : '/account'}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-serif text-slate-900"
                    >
                      {user.user_metadata?.role === 'admin' ? 'Dashboard' : 'My Account'}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login?view=login"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-serif text-slate-900"
                      >
                        Log In
                      </Link>
                      {settings.clientLoginRegistrationEnabled !== false && (
                        <Link
                          to="/signup"
                          onClick={() => setIsOpen(false)}
                          className="text-2xl font-serif text-primary"
                        >
                          Sign Up
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
