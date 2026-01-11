
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
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats, SettingsContextType, SaveStatus } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, syncLocalToCloud, upsertData, deleteData as deleteSupabaseData } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Check, Loader2, AlertTriangle } from 'lucide-react';

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
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(INITIAL_SUBCATEGORIES);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(INITIAL_CAROUSEL);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [stats, setStats] = useState<ProductStats[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const refreshAllData = async () => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) {
        // 1. Fetch Settings
        const remoteSettings = await fetchTableData('settings');
        if (!remoteSettings || remoteSettings.length === 0) {
          // Migration: Push local to cloud if cloud is empty
          console.log("Supabase empty. Synchronizing local bridge config...");
          await upsertData('settings', settings);
          await syncLocalToCloud('products', products);
          await syncLocalToCloud('categories', categories);
          await syncLocalToCloud('subcategories', subCategories);
          await syncLocalToCloud('hero_slides', heroSlides);
        } else {
          setSettings(remoteSettings[0] as SiteSettings);
        }

        // 2. Fetch Entities
        const p = await fetchTableData('products');
        if (p.length) setProducts(p);
        
        const c = await fetchTableData('categories');
        if (c.length) setCategories(c);
        
        const sc = await fetchTableData('subcategories');
        if (sc.length) setSubCategories(sc);

        const hs = await fetchTableData('hero_slides');
        if (hs.length) setHeroSlides(hs);

        const enq = await fetchTableData('enquiries');
        if (enq.length) setEnquiries(enq);

        const adm = await fetchTableData('admin_users');
        if (adm.length) setAdmins(adm);

        const st = await fetchTableData('product_stats');
        if (st.length) setStats(st);

      } else {
        // Local Mode Fallback
        const localSettings = localStorage.getItem('site_settings');
        if (localSettings) setSettings(JSON.parse(localSettings));
        const localProds = localStorage.getItem('admin_products');
        if (localProds) setProducts(JSON.parse(localProds));
        const localCats = localStorage.getItem('admin_categories');
        if (localCats) setCategories(JSON.parse(localCats));
        const localSubs = localStorage.getItem('admin_subcategories');
        if (localSubs) setSubCategories(JSON.parse(localSubs));
        const localHero = localStorage.getItem('admin_hero');
        if (localHero) setHeroSlides(JSON.parse(localHero));
        const localEnq = localStorage.getItem('admin_enquiries');
        if (localEnq) setEnquiries(JSON.parse(localEnq));
      }
      setSaveStatus('saved');
    } catch (e) {
      console.error("Data sync failed", e);
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    refreshAllData();
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
      await upsertData('settings', updated);
      setSaveStatus('saved');
    } else {
      localStorage.setItem('site_settings', JSON.stringify(updated));
      setTimeout(() => setSaveStatus('saved'), 500);
    }
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) {
        await upsertData(table, data);
      } else {
        // Fallback for local simulation
        const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.some((i: any) => i.id === data.id) 
           ? existing.map((i: any) => i.id === data.id ? data : i)
           : [data, ...existing];
        localStorage.setItem(key, JSON.stringify(updated));
      }
      await refreshAllData(); // Re-fetch to sync state
      return true;
    } catch (e) {
      setSaveStatus('error');
      return false;
    }
  };

  const deleteData = async (table: string, id: string) => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) {
        await deleteSupabaseData(table, id);
      } else {
        const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.filter((i: any) => i.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
      }
      await refreshAllData();
      return true;
    } catch (e) {
      setSaveStatus('error');
      return false;
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
      // Added error handling here to prevent unhandled promise rejection
      supabase.from('traffic_logs').insert([newEvent]).then(({ error }) => {
        if (error) console.warn("Analytics logging failed silently:", error.message);
      }).catch(err => console.warn("Analytics network error:", err));
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
      settings, updateSettings, 
      products, categories, subCategories, heroSlides, enquiries, admins, stats,
      refreshAllData, updateData, deleteData,
      user, loadingAuth, 
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
