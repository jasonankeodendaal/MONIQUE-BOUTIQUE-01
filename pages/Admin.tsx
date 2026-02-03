import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, 
  Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown,
  Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, 
  BookOpen, FileText, Share2, Tag, ArrowRight, Video, Image as ImageIcon, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut,
  Rocket, Terminal, Copy, Check, Database, Github, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash,
  Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin,
  FileBox, Lightbulb, Tablet, Laptop, CheckCircle2, SearchCode, GraduationCap, Pin, MousePointerClick, Puzzle, AtSign, Ghost, Gamepad2, HardDrive, Cpu, XCircle, DollarSign,
  Truck, Printer, Box, UserCheck, Repeat, Coins, Banknote, Power, TrendingDown, PieChart, CornerUpRight, ArrowDown, Youtube, Calculator, AlertCircle, RefreshCw, ShieldAlert, Binary, Unlock, Coins as CoinsIcon, ThumbsUp, ArrowUpDown, Table, FileDown, Presentation, Minus
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GUIDE_STEPS, PERMISSION_TREE, TRAINING_MODULES } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats, Order, OrderItem, SaveStatus, Review, Article, Subscriber, TrafficLog, TrainingModule } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CustomIcons } from '../components/CustomIcons';

// --- Pricing Simulator Component ---
interface PricingState {
  mode: 'affiliate' | 'merchant';
  costPrice: number;
  markupPercent: number;
  taxRate: number;
  sellingPrice: number;
  retailPrice: number;
}

const SmartPricingSimulator: React.FC<{ initialState?: Partial<PricingState>; currency: string; onUpdate?: (updates: { price: number, cost: number }) => void }> = ({ initialState, currency, onUpdate }) => {
  const [state, setState] = useState<PricingState>({ mode: initialState?.mode || 'affiliate', costPrice: initialState?.costPrice || 0, markupPercent: initialState?.markupPercent || 50, taxRate: initialState?.taxRate || 15, sellingPrice: initialState?.sellingPrice || 0, retailPrice: initialState?.retailPrice || 0 });
  useEffect(() => { if (initialState) setState(prev => ({ ...prev, ...initialState })); }, [initialState?.costPrice, initialState?.sellingPrice, initialState?.mode, initialState?.retailPrice]);
  const netPrice = state.sellingPrice > 0 ? state.sellingPrice / (1 + state.taxRate / 100) : 0;
  const profit = netPrice - state.costPrice;
  const updateState = (updates: Partial<PricingState>) => { const newState = { ...state, ...updates }; setState(newState); const effectivePrice = newState.mode === 'affiliate' ? newState.retailPrice : newState.sellingPrice; if (onUpdate) onUpdate({ cost: newState.costPrice, price: effectivePrice }); };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="flex border-b border-slate-800 flex-shrink-0"><button onClick={() => updateState({ mode: 'affiliate' })} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${state.mode === 'affiliate' ? 'bg-slate-800 text-primary' : 'bg-slate-950 text-slate-500 hover:text-white'}`}><LinkIcon size={14}/> Affiliate Link</button><button onClick={() => updateState({ mode: 'merchant' })} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${state.mode === 'merchant' ? 'bg-slate-800 text-green-400' : 'bg-slate-950 text-slate-500 hover:text-white'}`}><ShoppingBag size={14}/> Direct Sale</button></div>
      <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar">
        {state.mode === 'affiliate' ? ( <div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Display Price ({currency})</label><input type="number" value={state.retailPrice || ''} onChange={e => updateState({retailPrice: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-3xl font-bold outline-none focus:border-primary" placeholder="0.00" /></div> ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-500">Cost</label><input type="number" value={state.costPrice || ''} onChange={e => updateState({ costPrice: parseFloat(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase text-slate-500">Markup %</label><input type="number" value={state.markupPercent || ''} onChange={e => updateState({ markupPercent: parseFloat(e.target.value) })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" /></div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-primary/20"><label className="text-[10px] font-black uppercase text-primary mb-2 block">Calculated Sale Price</label><div className="text-2xl font-bold text-white">R {((state.costPrice * (1 + state.markupPercent/100)) * (1 + state.taxRate/100)).toFixed(2)}</div></div>
          </div>
        )}
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, isLocalMode, saveStatus, setSaveStatus,
    products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers, trainingModules,
    updateData, deleteData, refreshAllData, connectionHealth, systemLogs, storageStats
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [trafficEvents, setTrafficEvents] = useState<any[]>([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [articleData, setArticleData] = useState<Partial<Article>>({});
  const [trainingData, setTrainingData] = useState<Partial<TrainingModule>>({ strategies: [], actionItems: [] });
  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });
  const [tempFeature, setTempFeature] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });
  const [tempStrategy, setTempStrategy] = useState('');
  const [tempActionItem, setTempActionItem] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState({ courier: '', tracking: '' });
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const myAdminProfile = useMemo(() => admins.find(a => a.id === user?.id || a.email === user?.email), [admins, user]);
  const isOwner = isLocalMode || (myAdminProfile?.role === 'owner') || (user?.email === 'admin@kasicouture.com');
  const userId = user?.id;

  const hasPermission = (perm: string) => { if (isLocalMode || isOwner) return true; return myAdminProfile?.permissions?.includes(perm) || false; };

  const displayProducts = useMemo(() => { if (!isOwner) return products.filter(p => p.createdBy === userId); if (creatorFilter !== 'all') return products.filter(p => p.createdBy === creatorFilter); return products; }, [products, isOwner, userId, creatorFilter]);
  const displayCategories = useMemo(() => { if (!isOwner) return categories.filter(c => c.createdBy === userId); if (creatorFilter !== 'all') return categories.filter(c => c.createdBy === creatorFilter); return categories; }, [categories, isOwner, userId, creatorFilter]);
  const displayHeroSlides = useMemo(() => { if (!isOwner) return heroSlides.filter(s => s.createdBy === userId); if (creatorFilter !== 'all') return heroSlides.filter(s => s.createdBy === creatorFilter); return heroSlides; }, [heroSlides, isOwner, userId, creatorFilter]);

  const handleLogout = async () => {
    // Explicitly clear all local storage admin states
    localStorage.clear();
    sessionStorage.clear();
    
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    
    // Perform a hard redirect to ensure all memory state is flushed
    window.location.replace('/#/login');
  };
  
  const handleSaveProduct = async () => { const newProduct = { ...productData, id: editingId || Date.now().toString(), createdAt: productData.createdAt || Date.now(), createdBy: productData.createdBy || user?.id }; const ok = await updateData('products', newProduct); if (ok) { setShowProductForm(false); setEditingId(null); } };
  const handleSaveCategory = async () => { const newCat = { ...catData, id: editingId || Date.now().toString(), createdBy: catData.createdBy || user?.id }; const ok = await updateData('categories', newCat); if (ok) { setShowCategoryForm(false); setEditingId(null); } };
  const handleSaveHero = async () => { const newSlide = { ...heroData, id: editingId || Date.now().toString(), createdBy: heroData.createdBy || user?.id }; const ok = await updateData('hero_slides', newSlide); if (ok) { setShowHeroForm(false); setEditingId(null); } };
  const handleSaveArticle = async () => { const newArticle: Article = { ...articleData as Article, id: editingId || Date.now().toString(), date: articleData.date || Date.now(), author: articleData.author || settings.companyName }; const ok = await updateData('articles', newArticle); if (ok) { setShowArticleForm(false); setEditingId(null); } };
  const handleSaveTraining = async () => { const newModule = { ...trainingData, id: editingId || Date.now().toString(), createdBy: trainingData.createdBy || user?.id }; const ok = await updateData('training_modules', newModule); if (ok) { setShowTrainingForm(false); setEditingId(null); } };
  
  const handleSaveAdmin = async () => { 
    if (!adminData.email) return; setCreatingAdmin(true); 
    try { 
        if (editingId) { const newAdmin = { ...adminData, id: editingId }; const ok = await updateData('admin_users', newAdmin); if (ok) { setShowAdminForm(false); setEditingId(null); } } else {
            if (isSupabaseConfigured) {
                if (!adminData.password) throw new Error("Password is required for new users.");
                const { error } = await supabase.rpc('create_admin_user', { email: adminData.email, password: adminData.password, name: adminData.name || 'Admin', role: adminData.role || 'admin', permissions: adminData.permissions || [] });
                if (error) throw error;
                await refreshAllData(); setShowAdminForm(false); setEditingId(null); alert('Member created.');
            } else { const newAdmin = { ...adminData, id: Date.now().toString(), createdAt: Date.now(), role: adminData.role || 'admin' }; const ok = await updateData('admin_users', newAdmin); if (ok) { setShowAdminForm(false); setEditingId(null); } }
        }
    } catch (err: any) { alert(`Error: ${err.message}`); } finally { setCreatingAdmin(false); } 
  };

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Inbox</h2><p className="text-slate-400 text-sm">Manage incoming client communications.</p></div></div>
      {enquiries.map(e => (<div key={e.id} className={`bg-slate-900 border transition-all rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 text-left ${e.status === 'unread' ? 'border-primary/30' : 'border-slate-800'}`}><div className="flex-grow space-y-2 min-w-0"><div className="flex items-center gap-3"><h4 className="text-white font-bold truncate">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold">{e.email}</p><div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic">"{e.message}"</div></div><div className="flex gap-2 items-start">{hasPermission('privilege.inbox') && (<><button onClick={() => window.location.href = `mailto:${e.email}`} className="p-4 bg-primary/20 text-primary rounded-2xl transition-all"><Reply size={20}/></button><button onClick={() => updateData('enquiries', { ...e, status: e.status === 'read' ? 'unread' : 'read' })} className={`p-4 rounded-2xl ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`}><CheckCircle size={20}/></button><button onClick={() => deleteData('enquiries', e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl hover:text-red-500"><Trash2 size={20}/></button></>)}</div></div>))}
    </div>
  );

  const ADMIN_TABS = [ { id: 'enquiries', label: 'Inbox', icon: Inbox, perm: 'privilege.inbox' }, { id: 'orders', label: 'Orders', icon: ShoppingBag, perm: 'privilege.orders' }, { id: 'catalog', label: 'Items', icon: Tag, perm: 'privilege.items' }, { id: 'hero', label: 'Visuals', icon: LayoutPanelTop, perm: 'privilege.visuals' }, { id: 'categories', label: 'Depts', icon: Layout, perm: 'privilege.depts' }, { id: 'articles', label: 'Journal', icon: BookOpen, perm: 'privilege.journal' }, { id: 'site_editor', label: 'Canvas', icon: Palette, perm: 'privilege.canvas' }, { id: 'team', label: 'Maison', icon: Users, perm: 'privilege.maison' }, { id: 'training', label: 'Academy', icon: GraduationCap, perm: 'privilege.academy' }, { id: 'system', label: 'System', icon: Activity, perm: 'privilege.system' }, { id: 'guide', label: 'Pilot', icon: Rocket, perm: 'privilege.pilot' } ];
  const visibleTabs = useMemo(() => ADMIN_TABS.filter(t => hasPermission(t.perm)), [myAdminProfile, user]);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-32 w-full overflow-x-hidden">
      <header className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 text-left w-full"><div className="flex flex-col gap-6 text-left"><div className="flex items-center gap-4"><h1 className="text-3xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{isLocalMode ? 'LOCAL MODE' : (isOwner ? 'SYSTEM OWNER' : 'ADMINISTRATOR')}</div></div></div><div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto"><div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-full xl:w-auto">{visibleTabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-grow md:flex-grow-0 px-3 md:px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex flex-col md:flex-row items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}><tab.icon size={14} className="md:w-3 md:h-3" />{tab.label}</button>))}</div><button onClick={handleLogout} className="flex px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-red-500 hover:text-white transition-all w-full md:w-fit justify-center self-start"><LogOut size={14} /> Exit</button></div></header>
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20 w-full overflow-x-hidden text-left">{activeTab === 'enquiries' && renderEnquiries()}</main>
    </div>
  );
};

export default Admin;