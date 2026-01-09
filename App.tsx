
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
import { SiteSettings, Product, Category } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, syncLocalToCloud, upsertData } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Check, Loader2, AlertTriangle, Database } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'migrating';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  user: User | null;
  loadingAuth: boolean;
  isLocalMode: boolean;
  isDatabaseProvisioned: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
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

const SaveStatusIndicator = ({ status, isProvisioned }: { status: SaveStatus, isProvisioned: boolean }) => {
  if (status === 'idle' && isProvisioned) return null;
  
  // Show indicator if not provisioned OR if there is activity/error
  if (status === 'idle' && !isProvisioned) return null;

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
        {status === 'error' && 'Sync Failed (Check Console)'}
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
  // Fix: Merge local storage data with INITIAL_SETTINGS to ensure new fields (like socialLinks) are present
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = safeJSONParse('site_settings', null);
    return { ...INITIAL_SETTINGS, ...saved };
  });

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isDatabaseProvisioned, setIsDatabaseProvisioned] = useState(true);

  const refreshAllData = useCallback(async () => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) {
        // Attempt to fetch settings first. If DB is missing tables, lib/supabase catches 404 and returns local data
        const remoteSettings = await fetchTableData('settings');
        
        // If we got empty settings (possibly due to RLS blocking public access or empty table)
        if (!remoteSettings || remoteSettings.length === 0) {
           // Try to upsert to check if table exists or verify access
           const { error } = await supabase.from('settings').select('count').limit(1);
           
           if (error && (error.code === '42P01' || error.message.includes('404'))) {
               console.log("Database tables missing. Running in Local Mode with Cloud Configured.");
               setIsDatabaseProvisioned(false);
               const local = safeJSONParse('site_settings', null);
               if (local) setSettings({ ...INITIAL_SETTINGS, ...local });
           } else {
               // Table exists but is empty OR RLS prevented reading. 
               // Try migrating local data if it exists.
               console.log("Supabase empty or RLS restricted. Attempting migration/fallback...");
               
               try {
                  const localSettings = safeJSONParse('site_settings', null);
                  // Ensure ID is present for the single row
                  const settingsToSync = { 
                      ...(localSettings || INITIAL_SETTINGS), 
                      id: 'global_settings' // <--- CRITICAL FIX: Explicitly set ID
                  };

                  setSettings(settingsToSync);
                  setSaveStatus('migrating');
                  
                  // Upsert settings with ID specifically
                  await upsertData('settings', settingsToSync);

                  // Sync other tables
                  await syncLocalToCloud('products', 'admin_products');
                  await syncLocalToCloud('categories', 'admin_categories');
                  await syncLocalToCloud('subcategories', 'admin_subcategories');
                  await syncLocalToCloud('carousel_slides', 'admin_hero');
                  await syncLocalToCloud('enquiries', 'admin_enquiries');
                  await syncLocalToCloud('admin_users', 'admin_users');
                  await syncLocalToCloud('product_stats', 'admin_product_stats');
               } catch (migrationError) {
                  console.warn("Migration/Init failed:", migrationError);
                  setSettings(prev => prev || INITIAL_SETTINGS);
               }
           }
        } else {
          setIsDatabaseProvisioned(true);
          setSettings(remoteSettings[0] as SiteSettings);
        }
      } else {
        // Local Only Fallback (Env vars missing)
        setIsDatabaseProvisioned(false);
        const local = safeJSONParse('site_settings', null);
        if (local) setSettings({ ...INITIAL_SETTINGS, ...local });
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error("Data sync/init failed", e);
      // Ensure we have settings even on catastrophic error
      setSettings(prev => prev || INITIAL_SETTINGS);
      setSaveStatus('error');
    }
  }, []);

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
  }, [refreshAllData]);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    if (isSupabaseConfigured && isDatabaseProvisioned) {
      try {
        // Ensure ID is always sent with updates
        const payload = { ...updated, id: 'global_settings' }; 
        await upsertData('settings', payload);
        setSaveStatus('saved');
      } catch (e) {
        console.error("Update settings failed", e);
        localStorage.setItem('site_settings', JSON.stringify(updated));
        setSaveStatus('error');
      }
    } else {
      localStorage.setItem('site_settings', JSON.stringify(updated));
      setTimeout(() => setSaveStatus('saved'), 500);
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [settings, isDatabaseProvisioned]);

  const logEvent = useCallback((type: 'view' | 'click' | 'system', label: string) => {
    const newEvent = {
      id: Date.now().toString(),
      type,
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    };
    
    // Only try to log to cloud if we know tables exist and configured
    if (isSupabaseConfigured && isDatabaseProvisioned) {
      supabase.from('traffic_logs').insert([newEvent]).then(({error}) => {
          if(error) {
            // RLS might block inserts from anon users. Fallback to local.
            const existing = safeJSONParse('site_traffic_logs', []);
            localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
          }
      });
    } else {
      const existing = safeJSONParse('site_traffic_logs', []);
      localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
    }
  }, [isDatabaseProvisioned]);

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55';
    };
    if (settings?.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
    }
  }, [settings?.primaryColor]);

  // Memoize context to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ 
    settings, updateSettings, user, loadingAuth, 
    isLocalMode: !isSupabaseConfigured, isDatabaseProvisioned, saveStatus, setSaveStatus, logEvent, refreshAllData
  }), [settings, updateSettings, user, loadingAuth, isDatabaseProvisioned, saveStatus, logEvent, refreshAllData]);

  return (
    <SettingsContext.Provider value={contextValue}>
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
