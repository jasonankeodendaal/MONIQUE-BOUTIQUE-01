
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
import { SiteSettings, Product, Category, SubCategory, CarouselSlide } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, syncLocalToCloud, upsertData } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Check, Loader2, AlertTriangle, Database } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'migrating';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  // Global Data Store
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  heroSlides: CarouselSlide[];
  // System State
  user: User | null;
  loadingAuth: boolean;
  isLocalMode: boolean;
  isDatabaseProvisioned: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
  logEvent: (type: 'view' | 'click' | 'system', label: string) => void;
  refreshAllData: () => Promise<void>;
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
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
      </div>
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

const SaveStatusIndicator = ({ status, isProvisioned }: { status: SaveStatus, isProvisioned: boolean }) => {
  if (status === 'idle' && isProvisioned) return null;
  
  if (!isProvisioned && status === 'idle') {
    return null; 
  }

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${
      status === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white border border-slate-800'
    } animate-in slide-in-from-bottom-4`}>
      {status === 'saving' && <Loader2 size={16} className="animate-spin text-primary" />}
      {status === 'migrating' && <Database size={16} className="animate-pulse text-blue-400" />}
      {status === 'saved' && <Check size={16} className="text-green-500" />}
      {status === 'error' && <AlertTriangle size={16} className="text-white" />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {status === 'saving' && 'Syncing Supabase...'}
        {status === 'migrating' && 'Migrating Data...'}
        {status === 'saved' && 'Cloud Sync Complete'}
        {status === 'error' && 'Sync Failed - Retry'}
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

const safeJSONParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Parsing error for key "${key}"`, e);
    return fallback;
  }
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => safeJSONParse('site_settings', INITIAL_SETTINGS));
  const [products, setProducts] = useState<Product[]>(() => safeJSONParse('admin_products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => safeJSONParse('admin_categories', INITIAL_CATEGORIES));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => safeJSONParse('admin_subcategories', INITIAL_SUBCATEGORIES));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => safeJSONParse('admin_hero', INITIAL_CAROUSEL));
  
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isDatabaseProvisioned, setIsDatabaseProvisioned] = useState(true);

  const refreshAllData = async () => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) {
        // --- 1. SETTINGS SYNC ---
        const remoteSettings = await fetchTableData('settings');
        
        if (remoteSettings && remoteSettings.length > 0) {
          setIsDatabaseProvisioned(true);
          setSettings(remoteSettings[0] as SiteSettings);
        } else {
           console.log("Database connected but settings empty. Auto-seeding...");
           setIsDatabaseProvisioned(true);
           const payload = { ...INITIAL_SETTINGS, id: 'global_settings' };
           await upsertData('settings', payload);
           setSettings(payload);
        }

        // --- 2. CONTENT SYNC ---
        // Fetch strictly from cloud
        const [remoteProducts, remoteCategories, remoteSubs, remoteHero] = await Promise.all([
           fetchTableData('products'),
           fetchTableData('categories'),
           fetchTableData('subcategories'),
           fetchTableData('carousel_slides')
        ]);

        // Explicitly update state with remote data to ensure frontend reflects DB
        setProducts(remoteProducts || []);
        setCategories(remoteCategories || []);
        setSubCategories(remoteSubs || []);
        setHeroSlides(remoteHero || []);

      } else {
        // Local Mode Fallback
        setIsDatabaseProvisioned(false);
        const local = safeJSONParse('site_settings', null);
        if (local) setSettings(local);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error("Data sync/init failed", e);
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    refreshAllData();

    if (isSupabaseConfigured) {
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          setUser(session?.user ?? null);
        })
        .catch((err) => {
          console.error("Critical Auth Error:", err);
        })
        .finally(() => {
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
    
    // Update local state immediately for UI responsiveness
    setSettings(updated);
    
    if (isSupabaseConfigured) {
      const payload = { ...updated, id: 'global_settings' }; 
      const { error } = await upsertData('settings', payload);
      
      if (error) {
         console.error("Failed to save settings to Supabase:", error);
         setSaveStatus('error');
         // Don't auto-hide error
      } else {
         setSaveStatus('saved');
         setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } else {
      // Local mode fallback
      localStorage.setItem('site_settings', JSON.stringify(updated));
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 500);
    }
  };

  const logEvent = (type: 'view' | 'click' | 'system', label: string) => {
    const newEvent = {
      id: Date.now().toString(),
      type,
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    };
    
    if (isSupabaseConfigured) {
      supabase.from('traffic_logs').insert([newEvent]).then(({error}) => {
          if(error) {
             const existing = safeJSONParse('site_traffic_logs', []);
             localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
          }
      });
    } else {
      const existing = safeJSONParse('site_traffic_logs', []);
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
      settings, updateSettings, 
      products, categories, subCategories, heroSlides,
      user, loadingAuth, 
      isLocalMode: !isSupabaseConfigured, isDatabaseProvisioned, saveStatus, setSaveStatus, logEvent, refreshAllData
    }}>
      <Router>
        <ScrollToTop />
        <TrafficTracker logEvent={logEvent} />
        <SaveStatusIndicator status={saveStatus} isProvisioned={isDatabaseProvisioned} />
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
