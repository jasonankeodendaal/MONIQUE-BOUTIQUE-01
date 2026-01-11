
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Legal from './pages/Legal';
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, syncLocalToCloud } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Check, Loader2, AlertTriangle } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SettingsContextType {
  settings: SiteSettings;
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  heroSlides: CarouselSlide[];
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  refreshData: (type: 'products' | 'categories' | 'hero' | 'all') => Promise<void>;
  user: User | null;
  loadingAuth: boolean;
  isLocalMode: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  logEvent: (type: 'view' | 'click' | 'system', label: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loadingAuth, isLocalMode } = useSettings();
  if (loadingAuth) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
  if (isLocalMode) return <>{children}</>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Footer: React.FC = () => {
  const { settings, user } = useSettings();
  const location = useLocation();
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null;

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
               {settings.companyLogoUrl ? (
                <img src={settings.companyLogoUrl} alt={settings.companyName} className="w-8 h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold bg-primary">
                  {settings.companyLogo}
                </div>
              )}
              <span className="text-white text-xl font-bold tracking-tighter">{settings.companyName}</span>
            </div>
            <p className="max-w-xs leading-relaxed text-sm mb-8 font-light">
              {settings.footerDescription}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/" className="hover:text-primary transition-colors">{settings.navHomeLabel}</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">{settings.navProductsLabel}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{settings.navAboutLabel}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Policy</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings.disclosureTitle}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings.privacyTitle}</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}. {settings.footerCopyrightText}</p>
          <Link to={user ? "/admin" : "/login"} className="opacity-30 hover:opacity-100 hover:text-white transition-all">
            Bridge Concierge Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const SaveStatusIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === 'idle') return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${
      status === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white border border-slate-800'
    } animate-in slide-in-from-bottom-4`}>
      {status === 'saving' && <Loader2 size={16} className="animate-spin text-primary" />}
      {status === 'saved' && <Check size={16} className="text-green-500" />}
      {status === 'error' && <AlertTriangle size={16} className="text-white" />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {status === 'saving' && 'Syncing Supabase...'}
        {status === 'saved' && 'Cloud Sync Complete'}
        {status === 'error' && 'Sync Failed'}
      </span>
    </div>
  );
};

const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string) => void }) => {
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname);
    }
  }, [location.pathname, logEvent]);
  return null;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  
  // Content State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(INITIAL_SUBCATEGORIES);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(INITIAL_CAROUSEL);

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const refreshData = async (type: 'products' | 'categories' | 'hero' | 'all') => {
    if (!isSupabaseConfigured) {
      // Refresh from LocalStorage if not connected
      if (type === 'all' || type === 'products') setProducts(JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
      if (type === 'all' || type === 'categories') setCategories(JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
      if (type === 'all' || type === 'hero') setHeroSlides(JSON.parse(localStorage.getItem('admin_hero') || JSON.stringify(INITIAL_CAROUSEL)));
      return;
    }

    try {
      if (type === 'all' || type === 'products') {
        const p = await fetchTableData('products');
        if (p && p.length > 0) setProducts(p);
      }
      if (type === 'all' || type === 'categories') {
        const c = await fetchTableData('categories');
        const s = await fetchTableData('subcategories');
        if (c && c.length > 0) setCategories(c);
        if (s && s.length > 0) setSubCategories(s);
      }
      if (type === 'all' || type === 'hero') {
        const h = await fetchTableData('hero_slides');
        if (h && h.length > 0) setHeroSlides(h);
      }
    } catch (e) {
      console.error("Error refreshing data", e);
    }
  };

  const initData = async () => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) {
        // Settings
        const remoteSettings = await fetchTableData('settings');
        if (!remoteSettings || remoteSettings.length === 0) {
          console.log("Supabase empty. Migrating defaults...");
          await supabase.from('settings').upsert([INITIAL_SETTINGS]);
          await syncLocalToCloud('products', INITIAL_PRODUCTS);
          await syncLocalToCloud('categories', INITIAL_CATEGORIES);
          await syncLocalToCloud('subcategories', INITIAL_SUBCATEGORIES);
          await syncLocalToCloud('hero_slides', INITIAL_CAROUSEL);
        } else {
          setSettings(remoteSettings[0] as SiteSettings);
        }

        // Fetch Content
        await refreshData('all');
      } else {
        const local = localStorage.getItem('site_settings');
        if (local) setSettings(JSON.parse(local));
        refreshData('all');
      }
      setSaveStatus('saved');
    } catch (e) {
      console.error("Init failed", e);
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    initData();
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoadingAuth(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    } else {
      setLoadingAuth(false);
    }
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('settings').upsert([updated]);
      if (error) setSaveStatus('error');
      else setSaveStatus('saved');
    } else {
      localStorage.setItem('site_settings', JSON.stringify(updated));
      setTimeout(() => setSaveStatus('saved'), 500);
    }
  };

  const logEvent = (type: 'view' | 'click' | 'system', label: string) => {
    const newEvent = {
      // id: Date.now().toString(), // Let DB handle ID
      type,
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    };
    if (isSupabaseConfigured) {
      supabase.from('traffic_logs').insert([newEvent]).then();
    } else {
      const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]');
      localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
    }
  };

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55';
    };
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
  }, [settings.primaryColor]);

  return (
    <SettingsContext.Provider value={{ 
      settings, products, categories, subCategories, heroSlides,
      updateSettings, refreshData, user, loadingAuth, 
      isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent 
    }}>
      <Router>
        <ScrollToTop />
        <TrafficTracker logEvent={logEvent} />
        <SaveStatusIndicator status={saveStatus} />
        <style>{`
          .text-primary { color: var(--primary-color); }
          .bg-primary { background-color: var(--primary-color); }
          .border-primary { border-color: var(--primary-color); }
          .hover\\:bg-primary:hover { background-color: var(--primary-color); }
        `}</style>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/disclosure" element={<Legal />} />
              <Route path="/privacy" element={<Legal />} />
              <Route path="/terms" element={<Legal />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </SettingsContext.Provider>
  );
};

export default App;
