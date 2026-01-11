
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
import { INITIAL_SETTINGS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, upsertData, deleteData as deleteSupabaseData } from './lib/supabase';
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

  // In strict cloud mode, we need a user. 
  // If config is missing, we allow access to setup but data won't save.
  if (!isSupabaseConfigured) return <>{children}</>; 
  
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

    // TikTok Pixel
    if (settings.tiktokPixelId) {
      loadScript('tiktok-pixel', '', `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${settings.tiktokPixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `);
    }

    // Pinterest Tag
    if (settings.pinterestTagId) {
      loadScript('pinterest-tag', '', `
        !function(e){if(!window.pintrk){window.pintrk = function () {
        window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
          n=window.pintrk;n.queue=[],n.version="3.0";var
          t=document.createElement("script");t.async=!0,t.src=e;var
          r=document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
        pintrk('load', '${settings.pinterestTagId}');
        pintrk('page');
      `);
    }
  }, [settings.googleAnalyticsId, settings.facebookPixelId, settings.tiktokPixelId, settings.pinterestTagId]);

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
        if ((window as any).ttq && settings.tiktokPixelId) {
            (window as any).ttq.page();
        }
        if ((window as any).pintrk && settings.pinterestTagId) {
            (window as any).pintrk('track', 'pagevisit');
        }
     }
  }, [location, settings.googleAnalyticsId, settings.facebookPixelId, settings.tiktokPixelId, settings.pinterestTagId]);

  return null;
};

const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string, s?: string) => void }) => {
  const location = useLocation();
  const hasTrackedGeo = useRef(false);
  
  const getTrafficSource = () => {
    if (typeof document === 'undefined') return 'Direct';
    const referrer = document.referrer.toLowerCase();
    
    if (referrer.includes('facebook') || referrer.includes('fb')) return 'Facebook';
    if (referrer.includes('instagram')) return 'Instagram';
    if (referrer.includes('tiktok')) return 'TikTok';
    if (referrer.includes('pinterest')) return 'Pinterest';
    if (referrer.includes('google')) return 'Google Search';
    if (referrer.includes('twitter') || referrer.includes('t.co') || referrer.includes('x.com')) return 'Twitter';
    if (referrer.length > 0) return 'Referral';
    
    return 'Direct';
  };

  useEffect(() => {
    // 1. Log View
    if (!location.pathname.startsWith('/admin')) {
      const source = getTrafficSource();
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname, source);
    }
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
  const [settingsId, setSettingsId] = useState<string>('global');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<ProductStats[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Refs for stable access inside logEvent
  const productsRef = useRef(products);
  const statsRef = useRef(stats);

  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const performLogout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  useInactivityTimer(() => {
    if (user && !window.location.hash.includes('login')) {
       performLogout();
    }
  });

  useEffect(() => {
    const initAuth = async () => {
       if (isSupabaseConfigured) {
         try {
           const { data: { session }, error } = await supabase.auth.getSession();
           if (error && error.message.includes('Refresh Token')) {
             await supabase.auth.signOut();
             setUser(null);
           } else if (session) {
             // We do NOT logout on refresh anymore in production apps usually, 
             // but keeping strict security per user request pattern.
             // However, for usability, we will allow session persistence.
             setUser(session.user); 
           }
         } catch (e) {
           console.error("Auth init error:", e);
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
        // Settings
        const remoteSettings = await fetchTableData('settings');
        if (remoteSettings && remoteSettings.length > 0) {
          const { id, ...rest } = remoteSettings[0];
          setSettingsId(id);
          setSettings(rest as SiteSettings);
        } else {
           // If DB is connected but empty, we can use Initial, but we don't save to DB automatically 
           // to prevent overwriting if multiple admins access. We just use default state.
           console.log("No settings found in DB. Using defaults.");
        }

        const p = await fetchTableData('products');
        setProducts(p);
        const c = await fetchTableData('categories');
        setCategories(c);
        const sc = await fetchTableData('subcategories');
        setSubCategories(sc);
        const hs = await fetchTableData('hero_slides');
        setHeroSlides(hs);
        const enq = await fetchTableData('enquiries');
        setEnquiries(enq);
        const adm = await fetchTableData('admin_users');
        setAdmins(adm);
        const st = await fetchTableData('product_stats');
        setStats(st);
        
        setSaveStatus('idle');
      } else {
         console.warn("Supabase not configured. App is in Read-Only / Demo mode with empty data.");
      }
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
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
    }
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
    
    // Optimistic UI Update
    const updateState = (prev: any[]) => {
       const exists = prev.some(item => item.id === data.id);
       if (exists) return prev.map(item => item.id === data.id ? data : item);
       return [data, ...prev];
    };

    switch(table) {
        case 'products': setProducts(updateState(products)); break;
        case 'categories': setCategories(updateState(categories)); break;
        case 'subcategories': setSubCategories(updateState(subCategories)); break;
        case 'hero_slides': setHeroSlides(updateState(heroSlides)); break;
        case 'enquiries': setEnquiries(updateState(enquiries)); break;
        case 'admin_users': setAdmins(updateState(admins)); break;
    }

    try {
      if (isSupabaseConfigured) {
        await upsertData(table, data);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        return true;
      } else {
        throw new Error("Supabase not configured");
      }
    } catch (e) {
      setSaveStatus('error');
      // Revert optimistic update? For now we just show error.
      return false;
    }
  };

  const deleteData = async (table: string, id: string) => {
    setSaveStatus('saving');
    const deleteState = (prev: any[]) => prev.filter(item => item.id !== id);
    
    // Optimistic Update
    switch(table) {
        case 'products': setProducts(deleteState(products)); break;
        case 'categories': setCategories(deleteState(categories)); break;
        case 'subcategories': setSubCategories(deleteState(subCategories)); break;
        case 'hero_slides': setHeroSlides(deleteState(heroSlides)); break;
        case 'enquiries': setEnquiries(deleteState(enquiries)); break;
        case 'admin_users': setAdmins(deleteState(admins)); break;
    }

    try {
      if (isSupabaseConfigured) {
        await deleteSupabaseData(table, id);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        return true;
      } else {
         throw new Error("Supabase not configured");
      }
    } catch (e) {
      setSaveStatus('error');
      refreshAllData(); // Revert
      return false;
    }
  };

  const logEvent = useCallback(async (type: 'view' | 'click' | 'share' | 'system', label: string, source: string = 'Direct') => {
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: type || 'system',
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      source: source || 'Direct'
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('traffic_logs').insert([newEvent]);
      } catch (err) {
        console.warn("Log exception", err);
      }
    }

    // Update Product Stats Aggregates
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
                shares: 0,
                totalViewTime: 0, 
                lastUpdated: Date.now() 
            };
            const newStat: ProductStats = {
                ...currentStat,
                views: currentStat.views + (type === 'view' ? 1 : 0),
                clicks: currentStat.clicks + (type === 'click' ? 1 : 0),
                shares: (currentStat.shares || 0) + (type === 'share' ? 1 : 0),
                lastUpdated: Date.now()
            };
            
            setStats(prev => {
                const filtered = prev.filter(s => s.productId !== product.id);
                return [...filtered, newStat];
            });

            if (isSupabaseConfigured) {
                await upsertData('product_stats', newStat);
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
