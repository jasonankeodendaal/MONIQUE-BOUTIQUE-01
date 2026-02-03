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
  Truck, Printer, Box, UserCheck, Repeat, Coins, Banknote, Power, TrendingDown, PieChart, CornerUpRight, ArrowDown, Youtube, Calculator, AlertCircle, RefreshCw, ShieldAlert, Binary, Unlock, ThumbsUp, ArrowUpDown, Table, FileDown, Presentation, Minus
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GUIDE_STEPS, PERMISSION_TREE, TRAINING_MODULES } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats, Order, OrderItem, SaveStatus, Review, Article, Subscriber, TrafficLog, TrainingModule } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CustomIcons } from '../components/CustomIcons';

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, isLocalMode, saveStatus, logout,
    products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers, trainingModules,
    updateData, deleteData, refreshAllData, connectionHealth, systemLogs, storageStats
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});

  const myAdminProfile = useMemo(() => admins.find(a => a.id === user?.id || a.email === user?.email), [admins, user]);
  const isOwner = isLocalMode || (myAdminProfile?.role === 'owner') || (user?.email === 'admin@kasicouture.com');

  const hasPermission = (perm: string) => { if (isLocalMode || isOwner) return true; return myAdminProfile?.permissions?.includes(perm) || false; };

  const handleExitPortal = async () => {
     await logout();
  };

  const handleSaveProduct = async () => { const newProduct = { ...productData, id: editingId || Date.now().toString(), createdAt: Date.now(), createdBy: user?.id }; const ok = await updateData('products', newProduct); if (ok) { setShowProductForm(false); setEditingId(null); } };

  const visibleTabs = [ 
    { id: 'enquiries', label: 'Inbox', icon: Inbox, perm: 'privilege.inbox' }, 
    { id: 'orders', label: 'Orders', icon: ShoppingBag, perm: 'privilege.orders' }, 
    { id: 'catalog', label: 'Items', icon: Tag, perm: 'privilege.items' }, 
    { id: 'hero', label: 'Visuals', icon: LayoutPanelTop, perm: 'privilege.visuals' }, 
    { id: 'site_editor', label: 'Canvas', icon: Palette, perm: 'privilege.canvas' }, 
    { id: 'team', label: 'Maison', icon: Users, perm: 'privilege.maison' }, 
    { id: 'guide', label: 'Pilot', icon: Rocket, perm: 'privilege.pilot' } 
  ].filter(t => hasPermission(t.perm));

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-32">
      <header className="max-w-7xl mx-auto px-6 mb-12 flex flex-col xl:flex-row justify-between items-end gap-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1>
          <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em] w-fit">
            {isLocalMode ? 'LOCAL MODE' : 'AUTHENTICATED'}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {visibleTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
          <button onClick={handleExitPortal} className="flex px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
          {/* Dashboard contents... */}
          <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 text-center">
             <h2 className="text-white text-2xl font-serif mb-4">Welcome to the Maison Portal</h2>
             <p className="text-slate-500 max-w-lg mx-auto">Manage your bridge page content, track affiliate links, and oversee customer inquiries.</p>
          </div>
      </main>
    </div>
  );
};

export default Admin;