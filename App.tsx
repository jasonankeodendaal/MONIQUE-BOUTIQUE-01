
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  const { settings, user, saveStatus } = useSettings();
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
          <div className="flex items-center gap-3">
            <div 
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                saveStatus === 'saved' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' :
                saveStatus === 'error' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' :
                saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' :
                'bg-slate-700'
              }`} 
              title={`System Status: ${saveStatus}`}
            />
            <Link to={user ? "/admin" : "/login"} className="opacity-30 hover:opacity-100 hover:text-white transition-all">
              Bridge Concierge Portal
            </Link>
          </div>
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

// --- Helper to inject external scripts ---
const loadScript = (id: string, src: string, code?: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  if (src) script.src = src;
  script.async = true;
  if (code) script.innerHTML = code;
  document.head.appendChild(script);
};

const TrackingInjector = () => {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    // Google Analytics
    if (settings.googleAnalyticsId) {
       loadScript('ga-script-src', `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`);
       loadScript('ga-script-code', '', `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${settings.googleAnalyticsId}');
       `);
    }
    
    // Facebook Pixel
    if (settings.facebookPixelId) {
        loadScript('fb-pixel', '', `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${settings.facebookPixelId}');
          fbq('track', 'PageView');
        `);
    }
  }, [settings.googleAnalyticsId, settings.facebookPixelId]);

  // Track Page Views on route change
  useEffect(() => {
     if (typeof window !== 'undefined') {
        if ((window as any).gtag && settings.googleAnalyticsId) {
            (window as any).gtag('config', settings.googleAnalyticsId, {
                page_path: location.pathname + location.search
            });
        }
        if ((window as any).fbq && settings.facebookPixelId) {
            (window as any).fbq('track', 'PageView');
        }
     }
  }, [location, settings.googleAnalyticsId, settings.facebookPixelId]);

  return null;
};

const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string) => void }) => {
  const location = useLocation();
  const hasTrackedGeo = useRef(false);
  
  useEffect(() => {
    // 1. Log View
    if (!location.pathname.startsWith('/admin')) {
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname);
    }

    // 2. Fetch Geo & Device Data
    const fetchGeo = async () => {
        if (hasTrackedGeo.current || sessionStorage.getItem('geo_tracked')) return;
        
        const stored = localStorage.getItem('site_visitor_locations');
        try {
            // Get Device Info
            const ua = navigator.userAgent;
            let deviceType = "Desktop";
            if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
            if (/iPad|Tablet/i.test(ua)) deviceType = "Tablet";
            
            let browser = "Unknown";
            if (ua.indexOf("Chrome") > -1) browser = "Chrome";
            else if (ua.indexOf("Safari") > -1) browser = "Safari";
            else if (ua.indexOf("Firefox") > -1) browser = "Firefox";

            let os = "Unknown OS";
            if (ua.indexOf("Win") !== -1) os = "Windows";
            if (ua.indexOf("Mac") !== -1) os = "MacOS";
            if (ua.indexOf("Linux") !== -1) os = "Linux";
            if (ua.indexOf("Android") !== -1) os = "Android";
            if (ua.indexOf("like Mac") !== -1) os = "iOS";

            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.error) return; 

            const visitData = {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                code: data.country_code,
                lat: data.latitude,
                lon: data.longitude,
                org: data.org,
                device: deviceType,
                browser: browser,
                os: os,
                timestamp: Date.now()
            };

            const existing = JSON.parse(stored || '[]');
            // Keep last 50 visits
            const updated = [visitData, ...existing].slice(0, 50);
            localStorage.setItem('site_visitor_locations', JSON.stringify(updated));
            sessionStorage.setItem('geo_tracked', 'true');
            hasTrackedGeo.current = true;
        } catch (e) {
            console.warn("Geo-tracking skipped/blocked");
        }
    };
    
    fetchGeo();
  }, [location.pathname]); 
  return null;
};

// --- Inactivity Timer Hook ---
const useInactivityTimer = (logout: () => void, timeoutMs = 300000) => { // 5 minutes
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      console.log("Inactivity timeout. Logging out.");
      logout();
    }, timeoutMs);
  }, [logout, timeoutMs]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Init
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [settingsId, setSettingsId] = useState<string>('global'); // Track the DB ID for settings
  
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

  // Refs for stable access inside logEvent
  const productsRef = useRef(products);
  const statsRef = useRef(stats);

  // Keep refs synced
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  // Logout Function
  const performLogout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  // 1. Inactivity Timer (5 minutes)
  useInactivityTimer(() => {
    if (user && !window.location.hash.includes('login')) {
       performLogout();
    }
  });

  // 2. Logout on Refresh / Initial Load Logic
  useEffect(() => {
    const initAuth = async () => {
       if (isSupabaseConfigured) {
         const { data: { session } } = await supabase.auth.getSession();
         if (session) {
             // Strict Logout on Refresh
             await supabase.auth.signOut();
             setUser(null);
         }
       }
       setLoadingAuth(false);
    };
    initAuth();
  }, []);

  const refreshAllData = async () => {
    try {
      if (isSupabaseConfigured) {
        const remoteSettings = await fetchTableData('settings');
        if (!remoteSettings || remoteSettings.length === 0) {
          await upsertData('settings', { ...settings, id: 'global' });
          setSettingsId('global');
          await syncLocalToCloud('products', products);
          await syncLocalToCloud('categories', categories);
          await syncLocalToCloud('subcategories', subCategories);
          await syncLocalToCloud('hero_slides', heroSlides);
        } else {
          const { id, ...rest } = remoteSettings[0];
          setSettingsId(id);
          setSettings(rest as SiteSettings);
        }

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

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    if (isSupabaseConfigured) {
      await upsertData('settings', { ...updated, id: settingsId });
      setSaveStatus('saved');
    } else {
      localStorage.setItem('site_settings', JSON.stringify(updated));
      setTimeout(() => setSaveStatus('saved'), 500);
    }
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
    const updateLocalState = (prev: any[]) => {
       const exists = prev.some(item => item.id === data.id);
       if (exists) return prev.map(item => item.id === data.id ? data : item);
       return [data, ...prev];
    };

    switch(table) {
        case 'products': setProducts(updateLocalState(products)); break;
        case 'categories': setCategories(updateLocalState(categories)); break;
        case 'subcategories': setSubCategories(updateLocalState(subCategories)); break;
        case 'hero_slides': setHeroSlides(updateLocalState(heroSlides)); break;
        case 'enquiries': setEnquiries(updateLocalState(enquiries)); break;
        case 'admin_users': setAdmins(updateLocalState(admins)); break;
    }

    try {
      if (isSupabaseConfigured) {
        await upsertData(table, data);
      } else {
        const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.some((i: any) => i.id === data.id) 
           ? existing.map((i: any) => i.id === data.id ? data : i)
           : [data, ...existing];
        localStorage.setItem(key, JSON.stringify(updated));
      }
      setSaveStatus('saved');
      return true;
    } catch (e) {
      setSaveStatus('error');
      return false;
    }
  };

  const deleteData = async (table: string, id: string) => {
    setSaveStatus('saving');
    const deleteLocalState = (prev: any[]) => prev.filter(item => item.id !== id);
    switch(table) {
        case 'products': setProducts(deleteLocalState(products)); break;
        case 'categories': setCategories(deleteLocalState(categories)); break;
        case 'subcategories': setSubCategories(deleteLocalState(subCategories)); break;
        case 'hero_slides': setHeroSlides(deleteLocalState(heroSlides)); break;
        case 'enquiries': setEnquiries(deleteLocalState(enquiries)); break;
        case 'admin_users': setAdmins(deleteLocalState(admins)); break;
    }

    try {
      if (isSupabaseConfigured) {
        await deleteSupabaseData(table, id);
      } else {
        const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = existing.filter((i: any) => i.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
      }
      setSaveStatus('saved');
      return true;
    } catch (e) {
      setSaveStatus('error');
      refreshAllData();
      return false;
    }
  };

  const logEvent = useCallback(async (type: 'view' | 'click' | 'system', label: string) => {
    const newEvent = {
      id: Date.now().toString(),
      type,
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    };

    if (isSupabaseConfigured) {
      supabase.from('traffic_logs').insert([newEvent]).then(({error}) => {
         if (error) console.warn("Log insert failed", error);
      });
    } else {
      const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]');
      localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
    }

    if (label.startsWith('Product: ')) {
        const productName = label.replace('Product: ', '').trim();
        const currentProducts = productsRef.current;
        const currentStats = statsRef.current;
        const product = currentProducts.find(p => p.name === productName);
        
        if (product) {
            const currentStat = currentStats.find(s => s.productId === product.id) || { 
                productId: product.id, 
                views: 0, 
                clicks: 0, 
                totalViewTime: 0, 
                lastUpdated: Date.now() 
            };
            const newStat: ProductStats = {
                ...currentStat,
                views: currentStat.views + (type === 'view' ? 1 : 0),
                clicks: currentStat.clicks + (type === 'click' ? 1 : 0),
                lastUpdated: Date.now()
            };
            setStats(prev => {
                const filtered = prev.filter(s => s.productId !== product.id);
                return [...filtered, newStat];
            });
            if (isSupabaseConfigured) {
                await upsertData('product_stats', newStat);
            } else {
                const localStats = JSON.parse(localStorage.getItem('admin_product_stats') || '[]');
                const otherStats = localStats.filter((s: any) => s.productId !== product.id);
                localStorage.setItem('admin_product_stats', JSON.stringify([...otherStats, newStat]));
            }
        }
    }
  }, []);

  useEffect(() => {
    refreshAllData();
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    } else {
      setLoadingAuth(false);
    }
  }, []);

  // --- SYNC AUTH USER TO ADMIN TABLE ---
  useEffect(() => {
    if (user && isSupabaseConfigured && admins.length > 0) {
      const existingAdmin = admins.find(a => a.id === user.id || a.email === user.email);
      if (!existingAdmin) {
        // Automatically add logged-in Auth user to Admin Table if missing
        const newAdmin: AdminUser = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
          role: 'admin',
          permissions: [],
          createdAt: Date.now(),
          lastActive: Date.now()
        };
        updateData('admin_users', newAdmin);
      }
    }
  }, [user, admins]);

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
        <TrackingInjector />
        <TrafficTracker logEvent={logEvent} />
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
