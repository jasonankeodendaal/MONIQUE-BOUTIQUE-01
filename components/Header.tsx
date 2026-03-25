
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
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

  // Hide header entirely on admin and login pages
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
    return null;
  }

  const navLinks = [
    { name: settings.navHomeLabel, path: '/' },
    { name: settings.navProductsLabel, path: '/products' },
    { name: settings.navAboutLabel, path: '/about' },
    { name: settings.navContactLabel, path: '/contact' },
  ];

  // Logic: Header is solid if we are scrolled OR if we are NOT on the home page
  const isHomePage = location.pathname === '/';
  const shouldBeSolid = scrolled || !isHomePage || isOpen;
  
  // Enable dark section text (white text) ONLY on Home page when NOT scrolled/solid
  const isDarkSection = !shouldBeSolid && isHomePage;

  return (
    <header className={`${settings.navStickyHeader !== false ? 'fixed' : 'absolute'} top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
      shouldBeSolid 
        ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <nav className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center relative">
          {/* Logo Section - Left */}
          <Link to="/" className="flex items-center space-x-3 group opacity-100 z-10 flex-shrink-0">
            <div className="relative">
              {settings.companyLogoUrl ? (
                <img 
                  src={settings.companyLogoUrl} 
                  alt={settings.companyName} 
                  className="h-20 md:h-32 w-auto object-contain group-hover:opacity-80 transition-opacity drop-shadow-sm" 
                />
              ) : (
                <div className="text-2xl md:text-3xl font-black tracking-tighter group-hover:opacity-80 transition-opacity">
                  {settings.companyLogo}
                </div>
              )}
            </div>
            <div className={`flex flex-col -space-y-1 text-left ${settings.companyLogoUrl ? 'hidden lg:flex' : 'flex'}`}>
              <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                !isDarkSection ? 'text-slate-900' : 'text-white'
              }`}>
                {settings.companyName}
              </span>
              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] ${
                !isDarkSection ? 'text-primary' : 'text-primary/90'
              }`}>
                {settings.slogan}
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Center */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-8 z-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary relative group ${
                  location.pathname === link.path 
                    ? 'text-primary' 
                    : (!isDarkSection ? 'text-slate-500' : 'text-white/80')
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>
          
          {/* Actions - Right */}
          <div className="hidden md:flex items-center space-x-5 z-10 flex-shrink-0">
            <Link
              to="/products"
              className={`p-2 transition-colors ${!isDarkSection ? 'text-slate-900 hover:text-primary' : 'text-white/80 hover:text-white'}`}
            >
              <ShoppingBag size={20} />
            </Link>
            {user ? (
              <Link
                to={user.user_metadata?.role === 'admin' ? '/admin' : '/account'}
                className={`px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                  !isDarkSection 
                    ? 'border-slate-200 text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white' 
                    : 'border-white/30 text-white hover:border-white hover:bg-white hover:text-slate-900'
                }`}
              >
                {user.user_metadata?.role === 'admin' ? 'Dashboard' : 'Account'}
              </Link>
            ) : (
              <>
                <Link
                  to="/login?view=login"
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${
                    !isDarkSection ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Log In
                </Link>
                {settings.clientLoginRegistrationEnabled !== false && (
                  <Link
                    to="/login?view=signup"
                    className={`px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                      !isDarkSection 
                        ? 'border-slate-200 text-slate-900 hover:border-slate-900 hover:bg-slate-900 hover:text-white' 
                        : 'border-white/30 text-white hover:border-white hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    Sign Up
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                !isDarkSection ? 'text-slate-900' : 'text-white'
              }`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 py-8 px-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-3xl font-serif font-bold ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-8 border-t border-slate-100 flex flex-col space-y-4">
              {user ? (
                <Link
                  to={user.user_metadata?.role === 'admin' ? '/admin' : '/account'}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-serif font-bold text-slate-900"
                >
                  {user.user_metadata?.role === 'admin' ? 'Dashboard' : 'My Account'}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login?view=login"
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-serif font-bold text-slate-900"
                  >
                    Log In
                  </Link>
                  {settings.clientLoginRegistrationEnabled !== false && (
                    <Link
                      to="/login?view=signup"
                      onClick={() => setIsOpen(false)}
                      className="text-xl font-serif font-bold text-primary"
                    >
                      Sign Up
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
