
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
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
import { INITIAL_SETTINGS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, upsertData, subscribeToTable } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Check, Loader2, AlertTriangle, CloudUpload } from 'lucide-react';

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
  loadingData: boolean;
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
  const { user, loadingData } = useSettings();
  if (loadingData) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-left">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-white text-xl font-bold tracking-tighter">{settings.companyName}</span>
            </div>
            <p className="max-w-xs leading-relaxed text-sm mb-8 font-light">{settings.footerDescription}</p>
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
        <div className="pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-[0.2em] font-medium flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}. {settings.footerCopyrightText}</p>
          <Link to={user ? "/admin" : "/login"} className="opacity-30 hover:opacity-100 hover:text-white transition-all">Portal</Link>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const refreshAllData = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [s, p, c, sc, hs, en] = await Promise.all([
        fetchTableData('settings'),
        fetchTableData('products'),
        fetchTableData('categories'),
        fetchTableData('subcategories'),
        fetchTableData('carousel_slides'),
        fetchTableData('enquiries')
      ]);

      if (s && s.length > 0) setSettings(s[0]);
      if (p) setProducts(p);
      if (c) setCategories(c);
      if (sc) setSubCategories(sc);
      if (hs) setHeroSlides(hs);
      if (en) setEnquiries(en);
    } catch (e) {
      console.error("Failed to fetch Supabase data", e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    refreshAllData();
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
      
      const tables = ['products', 'categories', 'subcategories', 'carousel_slides', 'enquiries', 'settings'];
      const channels = tables.map(table => subscribeToTable(table, () => refreshAllData()));

      return () => {
        subscription.unsubscribe();
        channels.forEach(ch => ch?.unsubscribe());
      };
    }
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings, id: 'global_settings' };
    const { error } = await upsertData('settings', updated);
    if (error) setSaveStatus('error');
    else {
      setSettings(updated);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const logEvent = (type: 'view' | 'click' | 'system', label: string) => {
    if (!isSupabaseConfigured) return;
    supabase.from('traffic_logs').insert([{
      id: Date.now().toString(),
      type,
      text: label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    }]);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
  }, [settings.primaryColor]);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, products, setProducts, categories, setCategories,
      subCategories, setSubCategories, heroSlides, setHeroSlides, enquiries, setEnquiries,
      user, loadingData, saveStatus, setSaveStatus, logEvent, refreshAllData
    }}>
      <Router>
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
