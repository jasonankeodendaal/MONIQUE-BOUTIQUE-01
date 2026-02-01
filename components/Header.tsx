
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useSettings } from '../App';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const { settings, user } = useSettings();
  const { itemCount, toggleCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide header entirely on admin/auth pages
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/client-login') || location.pathname.startsWith('/login')) {
    return null;
  }

  const navLinks = [
    { name: settings.navHomeLabel, path: '/' },
    { name: settings.navProductsLabel, path: '/products' },
    { name: settings.navAboutLabel, path: '/about' },
    { name: 'Journal', path: '/blog' },
    { name: settings.navContactLabel, path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out bg-white border-b border-slate-100 ${
      scrolled 
        ? 'py-3 shadow-sm' 
        : 'py-5 md:py-8'
    }`}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group opacity-100">
            <div className="relative">
              {settings.companyLogoUrl ? (
                <img 
                  src={settings.companyLogoUrl} 
                  alt={settings.companyName} 
                  className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm" 
                />
              ) : (
                <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg md:text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  {settings.companyLogo}
                </div>
              )}
            </div>
            <div className={`flex flex-col -space-y-1 text-left ${settings.companyLogoUrl ? 'hidden md:flex' : 'flex'}`}>
              <span className="text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 text-slate-900">
                {settings.companyName}
              </span>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                {settings.slogan || 'Boutique Curation'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary relative group ${
                  location.pathname === link.path 
                    ? 'text-primary' 
                    : 'text-slate-500'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
            
            <div className="flex items-center pl-6 border-l border-slate-200/20 space-x-4">
              <Link
                to={user ? "/account" : "/client-login"}
                className="p-2 transition-colors relative text-slate-900 hover:text-primary"
                title={user ? "My Account" : "Client Login"}
              >
                <User size={22} />
              </Link>

              <button
                onClick={toggleCart}
                className="p-2 transition-colors relative text-slate-900 hover:text-primary"
              >
                <ShoppingBag size={22} />
                {itemCount > 0 && (
                   <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-slate-900 text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                      {itemCount}
                   </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Toggle & Cart */}
          <div className="md:hidden flex items-center gap-4">
            <Link
                to={user ? "/account" : "/client-login"}
                className="p-2 transition-colors relative text-slate-900 hover:text-primary"
            >
                <User size={24} />
            </Link>

            <button
                onClick={toggleCart}
                className="p-2 transition-colors relative text-slate-900 hover:text-primary"
              >
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                   <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-slate-900 text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                      {itemCount}
                   </span>
                )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors text-slate-900"
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
            {/* Mobile Account Link Text */}
            <Link
                to={user ? "/account" : "/client-login"}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold uppercase tracking-widest text-slate-500 hover:text-primary pt-4 border-t border-slate-100"
            >
                {user ? "My Account" : "Login / Register"}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
