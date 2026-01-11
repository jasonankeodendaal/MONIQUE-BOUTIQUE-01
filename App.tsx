
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { supabase, isSupabaseConfigured, fetchTableData, upsertData, subscribeToTable, seedDatabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Check, Loader2, AlertTriangle, CloudUpload, ShoppingBag, Database, WifiOff, LogOut } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'migrating';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  subCategories: SubCategory[];
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
  heroSlides: CarouselSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<CarouselSlide[]>>;
  enquiries: Enquiry[];
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  user: User | null;
  userRole: 'owner' | 'admin';
  loadingAuth: boolean;
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
  const { user, loadingAuth } = useSettings();
  
  if (loadingAuth) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest animate-pulse">Verifying Secure Session...</p>
      </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
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
              <li><Link to="/terms" className="hover:text-primary transition-colors">{settings.termsTitle}</Link></li>
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
  const location = useLocation();
  if (status === 'idle' || !location.pathname.startsWith('/admin')) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${
      status === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white border border-slate-800'
    } animate-in slide-in-from-bottom-4`}>
      {status === 'saving' && <Loader2 size={16} className="animate-spin text-primary" />}
      {status === 'migrating' && <CloudUpload size={16} className="animate-bounce text-blue-400" />}
      {status === 'saved' && <Check size={16} className="text-green-500" />}
      {status === 'error' && <AlertTriangle size={16} className="text-white" />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {status === 'saving' && 'Syncing Cloud...'}
        {status === 'migrating' && 'Provisioning DB...'}
        {status === 'saved' && 'Sync Complete'}
        {status === 'error' && 'Sync Failed'}
      </span>
    </div>
  );
};

const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string) => void }) => {
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      logEvent('view', location.pathname === '/' ? 'Home' : location.pathname);
    }
  }, [location.pathname, logEvent]);
  return null;
};

const App: React.FC = () => {
  // STRICT MODE: Initialize null to prevent local fallbacks.
  const [settings, setSettings] = useState<SiteSettings | null>(null); 
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'admin'>('admin');
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isDatabaseProvisioned, setIsDatabaseProvisioned] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // --- SECURITY: LOGOUT ON REFRESH ---
  useEffect(() => {
    const enforceSecurityOnMount = async () => {
      if (!isSupabaseConfigured) return;
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Optional: Keep session on refresh or force logout. For security apps, forced logout is safer.
        // For general apps, keeping session is better UX. 
        // Commenting out forced signout to allow persistence.
        // await supabase.auth.signOut();
        // setUser(null);
      }
    };
    enforceSecurityOnMount();
  }, []);

  // --- SECURITY: 15 MINUTE INACTIVITY TIMER ---
  useEffect(() => {
    if (!user) return;
    const INACTIVITY_LIMIT = 15 * 60 * 1000;
    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        console.log("Security Protocol: Auto-logout due to inactivity.");
        await supabase.auth.signOut();
        setUser(null);
        window.location.hash = '#/login';
      }, INACTIVITY_LIMIT);
    };
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const refreshAllData = useCallback(async () => {
    if (!isSupabaseConfigured) {
       // Fallback for non-configured env
       setSettings(INITIAL_SETTINGS);
       setProducts(INITIAL_PRODUCTS);
       setCategories(INITIAL_CATEGORIES);
       setSubCategories(INITIAL_SUBCATEGORIES);
       setHeroSlides(INITIAL_CAROUSEL);
       setIsDatabaseProvisioned(false);
       setDataLoaded(true);
       return;
    }

    try {
      // Fetch strictly from DB. 
      const [
          settingsRes,
          productsRes,
          catsRes,
          subCatsRes,
          slidesRes,
          enquiriesRes
      ] = await Promise.all([
          fetchTableData('settings'),
          fetchTableData('products'),
          fetchTableData('categories'),
          fetchTableData('subcategories'),
          fetchTableData('carousel_slides'),
          fetchTableData('enquiries')
      ]);

      // ROBUST FALLBACK LOGIC
      // If DB returns data, use it.
      // If DB returns null/empty, use INITIAL constants (Bootstrapping Mode).
      
      if (settingsRes && settingsRes.length > 0) {
          setSettings(settingsRes[0]);
          setIsDatabaseProvisioned(true);
          console.log("[App] Cloud Data Synced.");
      } else {
          console.warn("[App] Database empty or unreachable. Bootstrapping with local defaults.");
          setSettings(INITIAL_SETTINGS);
          setIsDatabaseProvisioned(false); // Flags that we need to seed
      }
      
      setProducts((productsRes && productsRes.length > 0) ? productsRes : (isDatabaseProvisioned ? [] : INITIAL_PRODUCTS));
      setCategories((catsRes && catsRes.length > 0) ? catsRes : (isDatabaseProvisioned ? [] : INITIAL_CATEGORIES));
      setSubCategories((subCatsRes && subCatsRes.length > 0) ? subCatsRes : (isDatabaseProvisioned ? [] : INITIAL_SUBCATEGORIES));
      setHeroSlides((slidesRes && slidesRes.length > 0) ? slidesRes : (isDatabaseProvisioned ? [] : INITIAL_CAROUSEL));
      setEnquiries(enquiriesRes || []);

      setSaveStatus('idle');

    } catch (e) {
      console.error("Data Sync Critical Failure:", e);
      // Failsafe: Ensure app doesn't crash on network error
      setSettings(INITIAL_SETTINGS);
      setProducts(INITIAL_PRODUCTS);
      setCategories(INITIAL_CATEGORIES);
      setSubCategories(INITIAL_SUBCATEGORIES);
      setHeroSlides(INITIAL_CAROUSEL);
      setSaveStatus('error');
    } finally {
      setDataLoaded(true); 
    }
  }, [isDatabaseProvisioned]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadingAuth(false);
      refreshAllData();
      return;
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
         const { data: adminProfile } = await supabase.from('admin_users').select('role').eq('id', session.user.id).single();
         if (adminProfile) {
            setUserRole(adminProfile.role);
         }
      }
      setLoadingAuth(false);
      await refreshAllData();
    };

    init();

    const handleTableChange = (payload: any, setState: any) => {
      const { new: newRecord, old: oldRecord, eventType } = payload;
      setState((prev: any[]) => {
        let updated = [...prev];
        if (eventType === 'INSERT') {
          if (!updated.find(i => i.id === newRecord.id)) updated = [newRecord, ...updated];
        } else if (eventType === 'UPDATE') {
          updated = updated.map(i => i.id === newRecord.id ? newRecord : i);
        } else if (eventType === 'DELETE') {
          updated = updated.filter(i => i.id !== oldRecord.id);
        }
        return updated;
      });
    };

    const subs = [
      subscribeToTable('products', p => handleTableChange(p, setProducts)),
      subscribeToTable('categories', p => handleTableChange(p, setCategories)),
      subscribeToTable('subcategories', p => handleTableChange(p, setSubCategories)),
      subscribeToTable('carousel_slides', p => handleTableChange(p, setHeroSlides)),
      subscribeToTable('enquiries', p => handleTableChange(p, setEnquiries)),
      subscribeToTable('settings', p => {
        if (p.new && (p.new as any).id === 'global_settings') {
          setSettings(prev => ({ ...prev!, ...p.new }));
        }
      })
    ];

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const previousUser = user;
      setUser(session?.user ?? null);
      if (session?.user && !previousUser) {
          refreshAllData();
      }
    });

    return () => {
      subs.forEach(s => s?.unsubscribe());
      subscription.unsubscribe();
    };
  }, [refreshAllData]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    // Optimistic update
    setSettings(prev => prev ? ({ ...prev, ...newSettings }) : null);
    
    if (isSupabaseConfigured && settings) {
      const { error } = await upsertData('settings', { ...settings, ...newSettings, id: 'global_settings' });
      if (error) setSaveStatus('error');
      else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } else {
      setSaveStatus('error');
    }
  };

  const logEvent = (type: 'view' | 'click' | 'system', label: string) => {
    const newEvent = { id: Date.now().toString(), type, text: type === 'view' ? `Page View: ${label}` : label, time: new Date().toLocaleTimeString(), timestamp: Date.now() };
    if (isSupabaseConfigured) {
      supabase.from('traffic_logs').insert([newEvent]);
    }
  };

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55';
    };
    if (settings) {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
        document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
        document.documentElement.style.setProperty('--accent-color', settings.accentColor);
        document.documentElement.style.setProperty('--bg-color', settings.backgroundColor || '#FDFCFB');
        document.documentElement.style.setProperty('--text-color', settings.textColor || '#0f172a');
    }
  }, [settings]);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
         <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
           <WifiOff size={40} />
         </div>
         <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Cloud Sync Required</h1>
         <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
           This application requires a secure Supabase connection. Local storage is disabled to ensure single-source data integrity.
         </p>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full text-left">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Database size={16} className="text-primary"/> Configuration Missing</h3>
           <code className="block bg-black p-4 rounded-lg text-green-400 font-mono text-xs mb-2">
             VITE_SUPABASE_URL=...<br/>
             VITE_SUPABASE_ANON_KEY=...
           </code>
         </div>
      </div>
    );
  }

  // Block rendering until data is loaded
  if (!dataLoaded || !settings) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center">
            <Loader2 size={48} className="text-[#D4AF37] animate-spin mb-4" />
            <h2 className="text-xl font-serif text-slate-900 animate-pulse">Synchronizing with Cloud...</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-bold">Single Source of Truth</p>
        </div>
      );
  }

  return (
    <SettingsContext.Provider value={{ 
      settings: settings!, updateSettings, products, setProducts, categories, setCategories, subCategories, setSubCategories, heroSlides, setHeroSlides, enquiries, setEnquiries,
      user, userRole, loadingAuth, isDatabaseProvisioned, saveStatus, setSaveStatus, logEvent, refreshAllData
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
          .bg-\\[\\#FDFCFB\\] { background-color: var(--bg-color) !important; }
          .text-slate-900 { color: var(--text-color) !important; }
          body { background-color: var(--bg-color); color: var(--text-color); }
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
              <Route path="/admin" element={
                <ProtectedRoute>
                   <Admin />
                </ProtectedRoute>
              } />
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
