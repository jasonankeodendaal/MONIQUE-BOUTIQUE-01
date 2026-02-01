
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
  Truck, Printer, Box, UserCheck, Repeat, Coins, Banknote, Power, TrendingDown, PieChart, CornerUpRight, ArrowDown, Youtube, Calculator, AlertCircle, RefreshCw, ShieldAlert, Binary, Unlock, Coins as CoinsIcon, ThumbsUp, ArrowUpDown, Table, FileDown, Presentation
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EMAIL_TEMPLATE_HTML, GUIDE_STEPS, PERMISSION_TREE, TRAINING_MODULES } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats, Order, OrderItem, SaveStatus, Review, Article, Subscriber, TrafficLog } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

// ... [Pricing Simulator Code Remains the Same]
interface PricingState {
  mode: 'affiliate' | 'merchant';
  costPrice: number;
  markupPercent: number;
  taxRate: number;
  sellingPrice: number;
  retailPrice: number;
}

const SmartPricingSimulator: React.FC<{ 
  initialState?: Partial<PricingState>; 
  currency: string; 
  onUpdate?: (updates: { price: number, cost: number }) => void 
}> = ({ initialState, currency, onUpdate }) => {
  const [state, setState] = useState<PricingState>({
    mode: initialState?.mode || 'affiliate',
    costPrice: initialState?.costPrice || 0,
    markupPercent: initialState?.markupPercent || 50,
    taxRate: initialState?.taxRate || 15,
    sellingPrice: initialState?.sellingPrice || 0,
    retailPrice: initialState?.retailPrice || 0,
  });

  useEffect(() => {
    if (initialState) {
        setState(prev => ({ ...prev, ...initialState }));
    }
  }, [initialState?.costPrice, initialState?.sellingPrice, initialState?.mode, initialState?.retailPrice]);

  const netPrice = state.sellingPrice > 0 ? state.sellingPrice / (1 + state.taxRate / 100) : 0;
  const taxAmount = state.sellingPrice - netPrice;
  const profit = netPrice - state.costPrice;
  const margin = netPrice > 0 ? (profit / netPrice) * 100 : 0;

  const updateState = (updates: Partial<PricingState>) => {
      const newState = { ...state, ...updates };
      setState(newState);
      const effectivePrice = newState.mode === 'affiliate' ? newState.retailPrice : newState.sellingPrice;
      if (onUpdate) onUpdate({ cost: newState.costPrice, price: effectivePrice });
  };

  const handleCostChange = (val: string) => {
    const cost = parseFloat(val) || 0;
    const net = cost * (1 + state.markupPercent / 100);
    const final = net * (1 + state.taxRate / 100);
    updateState({ costPrice: cost, sellingPrice: parseFloat(final.toFixed(2)) });
  };

  const handleMarkupChange = (val: string) => {
    const markup = parseFloat(val) || 0;
    const net = state.costPrice * (1 + markup / 100);
    const final = net * (1 + state.taxRate / 100);
    updateState({ markupPercent: markup, sellingPrice: parseFloat(final.toFixed(2)) });
  };

  const handleTaxRateChange = (val: string) => {
    const rate = parseFloat(val) || 0;
    const currentNet = state.sellingPrice / (1 + state.taxRate / 100);
    const newFinal = currentNet * (1 + rate / 100);
    updateState({ taxRate: rate, sellingPrice: parseFloat(newFinal.toFixed(2)) });
  };

  const handleFinalPriceChange = (val: string) => {
    const final = parseFloat(val) || 0;
    const net = final / (1 + state.taxRate / 100);
    let newMarkup = 0;
    if (state.costPrice > 0) {
        newMarkup = ((net - state.costPrice) / state.costPrice) * 100;
    }
    updateState({ sellingPrice: final, markupPercent: parseFloat(newMarkup.toFixed(2)) });
  };

  const handleProfitChange = (val: string) => {
      const targetProfit = parseFloat(val) || 0;
      const newNet = state.costPrice + targetProfit;
      const newFinal = newNet * (1 + state.taxRate / 100);
      const newMarkup = state.costPrice > 0 ? (targetProfit / state.costPrice) * 100 : 0;
      updateState({ sellingPrice: parseFloat(newFinal.toFixed(2)), markupPercent: parseFloat(newMarkup.toFixed(2)) });
  };

  const InfoBlock: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
              <Info size={12} className="text-primary"/> {title}
          </h5>
          <p className="text-xs text-slate-500 font-light leading-relaxed">{desc}</p>
      </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="flex border-b border-slate-800 flex-shrink-0">
        <button 
          onClick={() => updateState({ mode: 'affiliate' })}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${state.mode === 'affiliate' ? 'bg-slate-800 text-primary' : 'bg-slate-950 text-slate-500 hover:text-white'}`}
        >
          <LinkIcon size={14}/> Affiliate Link
        </button>
        <button 
          onClick={() => updateState({ mode: 'merchant' })}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${state.mode === 'merchant' ? 'bg-slate-800 text-green-400' : 'bg-slate-950 text-slate-500 hover:text-white'}`}
        >
          <ShoppingBag size={14}/> Direct Sale
        </button>
      </div>

      <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar">
        {state.mode === 'affiliate' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Display Price ({currency})</label>
                <input 
                    type="number" 
                    value={state.retailPrice || ''} 
                    onChange={e => updateState({retailPrice: parseFloat(e.target.value)})} 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-3xl font-bold outline-none focus:border-primary text-left" 
                    placeholder="0.00" 
                />
                <p className="text-xs text-slate-500 font-light mt-2">
                    Enter the final price as it appears on the affiliate site. Commissions are tracked externally by the affiliate network.
                </p>
             </div>
          </div>
        )}

        {state.mode === 'merchant' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-800">
                <div style={{ width: `${(state.costPrice / (state.sellingPrice || 1)) * 100}%` }} className="bg-slate-600 transition-all duration-500" title="Cost" />
                <div style={{ width: `${(profit / (state.sellingPrice || 1)) * 100}%` }} className="bg-green-500 transition-all duration-500" title="Profit" />
                <div style={{ width: `${(taxAmount / (state.sellingPrice || 1)) * 100}%` }} className="bg-red-500/50 transition-all duration-500" title="Tax" />
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cost Price ({currency})</label>
                   <input type="number" value={state.costPrice || ''} onChange={e => handleCostChange(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-right outline-none focus:border-blue-500" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Markup %</label>
                   <input type="number" value={state.markupPercent || ''} onChange={e => handleMarkupChange(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-right outline-none focus:border-green-500" placeholder="50" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Tax Rate %</label>
                   <input type="number" value={state.taxRate || ''} onChange={e => handleTaxRateChange(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-right outline-none focus:border-red-500" placeholder="15" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-primary tracking-widest">Final Price ({currency})</label>
                   <input type="number" value={state.sellingPrice || ''} onChange={e => handleFinalPriceChange(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-primary rounded-xl text-white font-bold font-mono text-right outline-none shadow-[0_0_15px_rgba(212,175,55,0.1)]" placeholder="0.00" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                   <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest block">Net Profit (Editable)</label>
                   <input type="number" value={profit.toFixed(2)} onChange={e => handleProfitChange(e.target.value)} className={`w-full bg-transparent text-lg font-bold font-mono outline-none ${profit > 0 ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                   <span className="block text-[9px] font-black uppercase text-slate-500 tracking-widest">Gross Margin</span>
                   <span className={`text-lg font-bold font-mono ${margin > 20 ? 'text-green-400' : 'text-yellow-500'}`}>{margin.toFixed(1)}%</span>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                   <span className="block text-[9px] font-black uppercase text-slate-500 tracking-widest">Tax Amount</span>
                   <span className="text-lg font-bold font-mono text-red-400">{currency} {taxAmount.toFixed(2)}</span>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                   <span className="block text-[9px] font-black uppercase text-slate-500 tracking-widest">Break Even (Net)</span>
                   <span className="text-lg font-bold font-mono text-blue-400">{currency} {state.costPrice.toFixed(2)}</span>
                </div>
             </div>
             <div className="pt-6 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-widest">Pricing Definitions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoBlock title="Cost Price" desc="The direct cost to purchase or manufacture one unit. This is the baseline for all profit calculations." />
                    <InfoBlock title="Markup %" desc="Percentage added to Cost to cover overheads and profit. Retail standard is often 50-100%." />
                    <InfoBlock title="Tax Rate (VAT)" desc="Percentage collected for the government (e.g. 15%). This is excluded from your revenue calculations." />
                    <InfoBlock title="Final Selling Price" desc="The total amount the customer pays, including tax. This is the sticker price on your store." />
                    <InfoBlock title="Net Profit" desc="Your actual earnings per unit after cost and tax are deducted. This pays your salary and expenses." />
                    <InfoBlock title="Gross Margin %" desc="Profit as a percentage of Net Revenue. A higher margin indicates better efficiency and profitability." />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ... [Other components: AdminTip, AccessDenied, SaveIndicator, SettingField remain the same]
const AdminTip: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-yellow-500/5 border border-yellow-500/20 p-5 md:p-6 rounded-3xl mb-8 flex gap-4 md:gap-5 items-start text-left animate-in fade-in slide-in-from-top-2">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 flex-shrink-0"><Lightbulb size={18} /></div>
    <div className="space-y-1 min-w-0 flex-1"><h4 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{title}</h4><div className="text-slate-400 text-xs leading-relaxed font-medium break-words">{children}</div></div>
  </div>
);

const AccessDenied: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 bg-slate-900 border border-slate-800 rounded-[2rem]">
    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20"><Shield size={32} /></div>
    <h3 className="text-2xl font-serif text-white mb-2">Restricted Area</h3>
    <p className="text-slate-500 max-w-sm text-sm">Access denied. Please contact system owner.</p>
  </div>
);

const SaveIndicator: React.FC<{ status: SaveStatus }> = ({ status }) => {
  const { systemLogs } = useSettings();
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (status === 'saved' || status === 'error') {
      setVisible(true);
      if (status === 'error') { const latestError = systemLogs.find(l => l.type === 'ERROR'); setErrorMessage(latestError ? latestError.message : 'Check connection.'); }
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, systemLogs]);
  if (!visible) return null;
  return (
    <div className={`fixed bottom-24 right-6 z-[100] ${status === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-6 border border-white/20 max-w-sm`}>
      <div className="p-2 bg-white/20 rounded-full flex-shrink-0">{status === 'error' ? <AlertOctagon size={24} /> : <CheckCircle2 size={24} />}</div>
      <div className="min-w-0"><h4 className="font-bold text-sm uppercase tracking-widest">{status === 'error' ? 'Action Failed' : 'System Synced'}</h4><p className="text-[10px] opacity-90 font-medium truncate">{status === 'error' ? errorMessage : 'Changes successfully recorded.'}</p></div>
    </div>
  );
};

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full min-w-0">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
    {type === 'textarea' ? <textarea rows={rows} className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /> : <input type={type} className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
  </div>
);

// ... [Chart Components remain the same]
const SimpleLineChart = ({ data, color, height = 120 }: { data: number[], color: string, height?: number }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const safeData = (!data || data.length === 0) ? [0, 0] : (data.length === 1 ? [data[0], data[0]] : data);
  const max = Math.max(...safeData, 1);
  const min = Math.min(...safeData);
  const range = max - min || 1;
  const points = safeData.map((val, i) => { 
      const x = (i / (safeData.length - 1)) * 100; 
      const y = 100 - ((val - min) / range) * 80 - 10; 
      return { x, y, val }; 
  });
  const pathData = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full relative overflow-visible group" style={{ height: `${height}px` }}>
        {hoveredIndex !== null && (
            <div className="absolute z-20 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-slate-700 transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all" style={{ left: `${points[hoveredIndex].x}%`, top: `${points[hoveredIndex].y}%`, marginTop: '-8px' }}>
                {points[hoveredIndex].val}
            </div>
        )}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <defs><linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
            <path d={`M0,100 L0,${points[0].y} ${points.map(p => `L${p.x},${p.y}`).join(' ')} L100,100 Z`} fill={`url(#grad-${color})`} stroke="none" />
            <polyline fill="none" stroke={color} strokeWidth="1.5" points={pathData} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} className="hover:r-2 transition-all cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} vectorEffect="non-scaling-stroke" stroke="transparent" strokeWidth="10" />
            ))}
        </svg>
    </div>
  );
};

const SimpleBarChart = ({ data, color, showLabels = true }: { data: { label: string, value: number }[], color: string, showLabels?: boolean }) => {
  const [hovered, setHovered] = useState<{idx: number, val: number} | null>(null);
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-1 h-full w-full relative">
      {data.length === 0 ? <div className="w-full text-center text-xs text-slate-600">No Data</div> : data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group relative" onMouseEnter={() => setHovered({ idx: i, val: d.value })} onMouseLeave={() => setHovered(null)}>
          {hovered?.idx === i && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded shadow-xl border border-slate-700 z-20 whitespace-nowrap font-bold animate-in fade-in zoom-in duration-200">{d.value}</div>}
          <div className="w-full rounded-t-sm transition-all duration-300 hover:brightness-110 min-h-[4px]" style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, opacity: hovered?.idx === i ? 1 : 0.8 }} />
          {showLabels && <span className="text-[7px] text-slate-500 mt-2 truncate w-full text-center font-medium uppercase tracking-wider">{d.label}</span>}
        </div>
      ))}
    </div>
  );
};

const SimpleDonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => { 
    const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1; 
    let accumulated = 0; 
    return ( 
        <div className="relative w-48 h-48 mx-auto group">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {data.length === 0 ? <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="12" fill="none" /> : data.map((d, i) => { 
                    const percent = d.value / total; 
                    const dashArray = `${percent * 283} 283`; 
                    const dashOffset = -accumulated * 283; 
                    accumulated += percent; 
                    return <circle key={i} cx="50" cy="50" r="40" fill="transparent" stroke={d.color} strokeWidth="12" strokeDasharray={dashArray} strokeDashoffset={dashOffset} className="transition-all duration-500 hover:stroke-[14px] hover:brightness-110 cursor-pointer"><title>{d.label}: {d.value} ({Math.round(percent * 100)}%)</title></circle>; 
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white tracking-tight">{total > 999 ? (total/1000).toFixed(1) + 'k' : total}</span>
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Total Visits</span>
            </div>
        </div> 
    ); 
};

// ... [File uploaders and Helpers remain the same]
const compressImage = async (file: File): Promise<string> => { return new Promise((resolve, reject) => { if (!file.type.startsWith('image/')) { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = (e) => resolve(e.target?.result as string); reader.onerror = (e) => reject(e); return; } const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = (event) => { const img = new Image(); img.src = event.target?.result as string; img.onload = () => { const canvas = document.createElement('canvas'); const MAX_WIDTH = 1200; const scaleSize = MAX_WIDTH / img.width; if (scaleSize < 1) { canvas.width = MAX_WIDTH; canvas.height = img.height * scaleSize; } else { canvas.width = img.width; canvas.height = img.height; } const ctx = canvas.getContext('2d'); if (!ctx) { reject(new Error('Canvas context failed')); return; } ctx.drawImage(img, 0, 0, canvas.width, canvas.height); const dataUrl = canvas.toDataURL('image/jpeg', 0.7); resolve(dataUrl); }; img.onerror = (err: any) => reject(err); }; reader.onerror = (err) => reject(err); }); };

const SingleImageUploader: React.FC<{ value: string; onChange: (v: string) => void; label: string; accept?: string; className?: string }> = ({ value, onChange, label, accept = "image/*", className = "h-40 w-40" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl.length > 5 * 1024 * 1024) { alert("File too large"); setUploading(false); return; }
      if (isSupabaseConfigured) {
        const res = await fetch(compressedDataUrl); const blob = await res.blob(); const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
        const url = await uploadMedia(compressedFile, 'media');
        if (url) onChange(url);
      } else { onChange(compressedDataUrl); }
    } catch (err: any) { alert(`Upload Failed: ${err.message}`); } finally { setUploading(false); }
  };
  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || accept?.includes('video');
  return (
    <div className="space-y-2 text-left w-full min-w-0">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
      <div onClick={() => !uploading && inputRef.current?.click()} className={`relative ${className} overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-primary/50 transition-all cursor-pointer group rounded-2xl flex-shrink-0 max-w-full`} >
        {uploading ? <div className="w-full h-full flex items-center justify-center bg-slate-900"><Loader2 size={24} className="animate-spin text-primary"/></div> : value ? (isVideo ? <video src={value} className="w-full h-full object-cover" autoPlay muted loop /> : <img src={value} className="w-full h-full object-cover" />) : <div className="w-full h-full flex flex-col items-center justify-center text-slate-500"><ImageIcon size={24} /><span className="text-[8px] font-black uppercase mt-2">Upload</span></div>}
        <input type="file" className="hidden" ref={inputRef} accept={accept} onChange={handleUpload} disabled={uploading} />
      </div>
    </div>
  );
};

const MultiImageUploader: React.FC<{ images: string[]; onChange: (images: string[]) => void; label: string }> = ({ images = [], onChange, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const processFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return; setUploading(true); const newUrls: string[] = [];
    try {
      for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i]; const compressedDataUrl = await compressImage(file);
        if (isSupabaseConfigured) {
          const res = await fetch(compressedDataUrl); const blob = await res.blob(); const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          const url = await uploadMedia(compressedFile, 'media'); if (url) newUrls.push(url);
        } else { newUrls.push(compressedDataUrl); }
      }
      onChange([...images, ...newUrls]);
    } catch (err: any) { alert(`Upload Failed`); } finally { setUploading(false); }
  };
  return (
    <div className="space-y-4 text-left w-full min-w-0">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        <div onClick={() => !uploading && fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center cursor-pointer bg-slate-900/30">{uploading ? <Loader2 size={24} className="animate-spin text-primary"/> : <Plus size={24} className="text-slate-400"/>}<input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={e => processFiles(e.target.files)} /></div>
        {images.map((url, idx) => ( <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900"><img src={url} className="w-full h-full object-cover"/><button onClick={() => { const newImages = [...images]; newImages.splice(idx, 1); onChange(newImages); }} className="absolute top-1 right-1 p-1 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100"><X size={12}/></button></div>))}
      </div>
    </div>
  );
};

const SocialLinksManager: React.FC<{ links: SocialLink[]; onChange: (links: SocialLink[]) => void }> = ({ links, onChange }) => {
  const handleUpdate = (id: string, field: keyof SocialLink, value: string) => { onChange(links.map(link => link.id === id ? { ...link, [field]: value } : link)); };
  return (
    <div className="space-y-4 w-full min-w-0"><div className="flex justify-between items-center mb-4"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Social Profiles</label><button onClick={() => onChange([...links, { id: Date.now().toString(), name: 'New', url: 'https://', iconUrl: '' }])} className="text-[10px] font-black uppercase text-primary flex items-center gap-1"><Plus size={12}/> Add</button></div><div className="space-y-3">{links.map((link) => (<div key={link.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex gap-4 items-start"><SingleImageUploader label="" value={link.iconUrl} onChange={v => handleUpdate(link.id, 'iconUrl', v)} className="w-12 h-12 rounded-xl"/><div className="flex-grow grid grid-cols-2 gap-3"><input type="text" value={link.name} onChange={e => handleUpdate(link.id, 'name', e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-white px-3 py-2" placeholder="Name" /><input type="text" value={link.url} onChange={e => handleUpdate(link.id, 'url', e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-white px-3 py-2" placeholder="URL" /></div><button onClick={() => onChange(links.filter(l => l.id !== link.id))} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={16} /></button></div>))}</div></div>
  );
};

const GuideIllustration: React.FC<{ id?: string }> = ({ id }) => { switch (id) { case 'forge': return (<div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden min-w-0"><div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--primary-color),transparent_70%)]" /><div className="relative z-10 flex flex-col items-center"><div className="flex gap-4 mb-8"><div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl rotate-[-12deg]"><FileCode size={32} /></div><div className="w-16 h-16 bg-primary text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl rotate-[12deg]"><Terminal size={32} /></div></div><div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary w-2/3 animate-[shimmer_2s_infinite]" /></div></div></div>); default: return (<div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center min-w-0"><Rocket className="text-slate-800 w-24 h-24" /></div>); } };

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (perms: string[]) => void; role: 'owner' | 'admin'; }> = ({ permissions, onChange, role }) => { 
    if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access.</div>; 
    const togglePermission = (id: string) => { if (permissions.includes(id)) { onChange(permissions.filter(p => p !== id)); } else { onChange([...permissions, id]); } }; 
    return ( <div className="space-y-6">{PERMISSION_TREE.map(group => { const childIds = group.children?.map(c => c.id) || []; const isAllSelected = childIds.every(id => permissions.includes(id)); return (<div key={group.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left"><div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3"><span className="text-white font-bold text-sm">{group.label}</span><button onClick={() => onChange(isAllSelected ? permissions.filter(p => !childIds.includes(p)) : [...permissions, ...childIds.filter(i => !permissions.includes(i))])} className="text-[10px] font-black uppercase text-primary">{isAllSelected ? 'Deselect All' : 'Select All'}</button></div><div className="grid md:grid-cols-2 gap-3">{group.children?.map(perm => { const isSelected = permissions.includes(perm.id); return (<button key={perm.id} onClick={() => togglePermission(perm.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>{isSelected ? <CheckSquare size={16} className="text-primary"/> : <Square size={16}/>}<span className="text-xs font-medium">{perm.label}</span></button>); })}</div></div>); })}</div> ); 
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => { 
    const [isOpen, setIsOpen] = useState(false); const ALL_ICONS = [...Object.keys(CustomIcons), ...Object.keys(LucideIcons).filter(k => /^[A-Z]/.test(k))]; 
    const SelectedIcon = CustomIcons[selected] || (LucideIcons as any)[selected] || LucideIcons.Package;
    return (<div className="relative text-left w-full"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300"><div className="flex items-center gap-3"><SelectedIcon size={18} /><span className="text-xs font-bold">{selected}</span></div><ChevronDown size={14} /></button>{isOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"><div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"><div className="p-6 border-b border-slate-700 flex justify-between items-center"><h3 className="text-white font-bold text-lg">Icon Library</h3><button onClick={() => setIsOpen(false)}><X size={20} className="text-white"/></button></div><div className="flex-grow overflow-y-auto p-6 bg-slate-950 grid grid-cols-6 gap-3">{ALL_ICONS.slice(0,100).map(name => { const Icon = CustomIcons[name] || (LucideIcons as any)[name]; if(!Icon) return null; return <button key={name} onClick={() => { onSelect(name); setIsOpen(false); }} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-800 text-slate-400 hover:text-white"><Icon size={24}/><span className="text-[9px] truncate w-full text-center">{name}</span></button> })}</div></div></div>)}</div>); 
};

const EmailReplyModal: React.FC<{ enquiry: Enquiry; onClose: () => void }> = ({ enquiry, onClose }) => { const { settings } = useSettings(); const [message, setMessage] = useState(''); const handleSend = async () => { if (!settings.emailJsServiceId) return alert("EmailJS not configured"); const templateParams = { to_name: enquiry.name, to_email: enquiry.email, message, reply_to: enquiry.email }; await emailjs.send(settings.emailJsServiceId, settings.emailJsTemplateId!, templateParams, settings.emailJsPublicKey!); onClose(); }; return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="bg-slate-900 w-full max-w-2xl rounded-2xl p-6 border border-slate-700"><h3 className="text-white font-bold mb-4">Reply to {enquiry.name}</h3><textarea className="w-full p-4 bg-slate-800 rounded-xl text-white mb-4 h-64" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type response..." /><div className="flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 text-slate-400">Cancel</button><button onClick={handleSend} className="px-6 py-2 bg-primary text-slate-900 rounded-xl font-bold">Send</button></div></div></div>); };

const PLATFORMS = [ { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C' }, { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' }, { id: 'twitter', name: 'X', icon: Twitter, color: '#1DA1F2' } ];
const AdGeneratorModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => { 
    const [platform, setPlatform] = useState(PLATFORMS[0]); 
    const text = `Check out ${product.name}! ${product.description.substring(0,100)}... Price: R${product.price}`;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="bg-slate-900 w-full max-w-2xl rounded-2xl p-6 border border-slate-700"><div className="flex justify-between mb-4"><h3 className="text-white font-bold">Ad Generator</h3><button onClick={onClose}><X size={20} className="text-slate-500"/></button></div><div className="flex gap-2 mb-4">{PLATFORMS.map(p => <button key={p.id} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border ${platform.id === p.id ? 'border-primary bg-slate-800' : 'border-slate-800'}`}><p.icon size={20} style={{color: p.color}} /></button>)}</div><textarea className="w-full p-4 bg-slate-800 rounded-xl text-white h-32 mb-4" readOnly value={text} /><button onClick={() => navigator.clipboard.writeText(text)} className="w-full py-3 bg-primary text-slate-900 rounded-xl font-bold">Copy Text</button></div></div>); 
};

const CodeBlock: React.FC<{ code: string; language?: string; label?: string }> = ({ code, label }) => ( <div className="relative group mb-6 text-left max-w-full overflow-hidden w-full min-w-0">{label && <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2"><Terminal size={12}/>{label}</div>}<pre className="p-6 bg-black rounded-2xl text-[10px] md:text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800 leading-relaxed custom-scrollbar shadow-inner w-full max-w-full"><code>{code}</code></pre></div> );

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string; accept?: string; }> = ({ files, onFilesChange, multiple = true, label = "media", accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const processFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return; setUploading(true); const newFiles: MediaFile[] = [];
    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i]; const compressedDataUrl = await compressImage(file);
      let result = compressedDataUrl;
      if (isSupabaseConfigured) {
          const res = await fetch(compressedDataUrl); const blob = await res.blob(); const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          const url = await uploadMedia(compressedFile, 'media'); if (url) result = url;
      }
      newFiles.push({ id: Math.random().toString(36).substr(2, 9), url: result, name: file.name, type: file.type, size: file.size });
    }
    onFilesChange(multiple ? [...files, ...newFiles] : newFiles); setUploading(false);
  };
  return (<div onClick={() => !uploading && fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 group min-h-[100px]">{uploading ? <Loader2 size={24} className="animate-spin text-primary"/> : <Upload className="text-slate-400 group-hover:text-white mb-2" size={20} />}<input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={e => processFiles(e.target.files)} /></div>);
};

const IntegrationGuide: React.FC = () => ( <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 mb-8 text-left"> <h4 className="text-primary font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><Lightbulb size={16}/> Integration Setup Guide</h4> <div className="space-y-4 text-xs text-slate-400"> <details className="group"> <summary className="cursor-pointer font-bold text-white mb-2 list-none flex items-center gap-2 group-open:text-primary transition-colors"><Mail size={14} /> EmailJS (Forms)</summary> <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2"> <p>1. Sign up at <a href="https://www.emailjs.com" target="_blank" className="text-white underline">EmailJS.com</a>.</p> <p>2. Create a new "Email Service" (e.g., Gmail) to get your <strong>Service ID</strong>.</p> <p>3. Create an "Email Template". Use variables like <code>{`{{name}}`}</code>, <code>{`{{message}}`}</code>. Get your <strong>Template ID</strong>.</p> <p>4. Go to Account &gt; API Keys to copy your <strong>Public Key</strong>.</p> </div> </details> </div> </div> );

const SystemMonitor: React.FC<{ connectionHealth: any, systemLogs: any[], storageStats: any, generateTestData: () => void, settings: SiteSettings }> = ({ connectionHealth, systemLogs, storageStats, generateTestData, settings }) => {
    // ... [Content same as previous]
    const integrations = [
        { name: 'Supabase', status: connectionHealth?.status === 'online', icon: Database, desc: 'Database & Auth' },
        { name: 'EmailJS', status: !!settings.emailJsServiceId, icon: Mail, desc: 'Email Automation' },
        { name: 'Yoco', status: !!settings.yocoPublicKey, icon: CreditCard, desc: 'Card Payments' },
        { name: 'PayFast', status: !!settings.payfastMerchantId, icon: ShieldCheck, desc: 'Payment Gateway' },
        { name: 'Zapier', status: !!settings.zapierWebhookUrl, icon: Zap, desc: 'Automation Webhook' },
        { name: 'Google Analytics', status: !!settings.googleAnalyticsId, icon: BarChart3, desc: 'Traffic Tracking' },
    ];

    return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left w-full max-w-7xl mx-auto">
        {/* ... [Existing monitor cards remain] */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className={connectionHealth?.status === 'online' ? "text-green-500" : "text-red-500"}/> System Health</h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span><span className={`font-bold ${connectionHealth?.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>{connectionHealth?.status === 'online' ? 'Operational' : 'Offline'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Latency</span><span className="font-mono text-white">{connectionHealth?.latency || 0}ms</span></div>
                </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Database size={18} className="text-blue-500"/> Storage Metrics</h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Records</span><span className="font-mono text-white">{storageStats?.totalRecords || 0}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Est. Size</span><span className="font-mono text-white">{((storageStats?.mediaSize || 0) / (1024*1024)).toFixed(2)} MB</span></div>
                </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col justify-center">
                <button onClick={generateTestData} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all border border-slate-700 shadow-lg">
                   <Database size={18} className="text-primary"/> Generate Test Data
                </button>
                <p className="text-[9px] text-slate-500 text-center mt-3 uppercase tracking-widest">Populate Logs & Orders</p>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Server size={18} className="text-purple-500"/> Connection Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {integrations.map((tool) => (
                    <div key={tool.name} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${tool.status ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                        <div className={`p-2 rounded-full ${tool.status ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-500'}`}>
                            <tool.icon size={18} />
                        </div>
                        <div>
                            <span className={`block font-bold text-xs ${tool.status ? 'text-green-400' : 'text-slate-500'}`}>{tool.name}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{tool.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Terminal size={18} className="text-slate-400"/> System Logs</h3>
            <div className="h-64 overflow-y-auto custom-scrollbar space-y-2 font-mono text-xs bg-black p-4 rounded-xl border border-slate-800">
                {(systemLogs || []).map(log => (
                    <div key={log.id} className="flex gap-4 text-slate-400 border-b border-slate-900 pb-1 mb-1 last:border-0">
                        <span className="text-slate-600 w-20 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`w-16 font-bold flex-shrink-0 ${log.type === 'ERROR' ? 'text-red-500' : log.type === 'SYNC' ? 'text-blue-500' : 'text-green-500'}`}>{log.type}</span>
                        <span className="flex-grow break-all">{log.message}</span>
                    </div>
                ))}
                {(!systemLogs || systemLogs.length === 0) && <div className="text-slate-700 text-center italic">No system events logged.</div>}
            </div>
        </div>
    </div>
    );
};

// --- ANALYTICS DASHBOARD WITH PDF EXPORT ---
const AnalyticsDashboard: React.FC<{ trafficEvents: TrafficLog[]; products: Product[]; stats: ProductStats[]; orders: Order[]; categories: Category[]; admins: AdminUser[]; user: any; isOwner: boolean }> = ({ trafficEvents, products, stats, orders, categories, admins, user, isOwner }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [exportOpen, setExportOpen] = useState(false);
  const { settings } = useSettings();

  // Force non-owners to only view their own data
  const targetUserId = isOwner ? selectedUserId : user?.id;

  // Filter Data based on User Scope
  const filteredProducts = useMemo(() => {
      if (targetUserId === 'all') return products;
      return products.filter(p => p.createdBy === targetUserId);
  }, [products, targetUserId]);

  const filteredStats = useMemo(() => {
      if (targetUserId === 'all') return stats;
      const userProductIds = filteredProducts.map(p => p.id);
      return stats.filter(s => userProductIds.includes(s.productId));
  }, [stats, filteredProducts, targetUserId]);

  const filteredOrders = useMemo(() => {
      if (targetUserId === 'all') return orders;
      const userProductIds = new Set(filteredProducts.map(p => p.id));
      return orders.filter(o => {
          if (o.affiliateId === targetUserId) return true;
          return o.items?.some(item => userProductIds.has(item.productId));
      });
  }, [orders, filteredProducts, targetUserId]);

  const filteredTraffic = useMemo(() => {
      if (targetUserId === 'all') return trafficEvents;
      const userProductNames = new Set(filteredProducts.map(p => p.name.toLowerCase()));
      return trafficEvents.filter(e => {
          return Array.from(userProductNames).some(name => e.text?.toLowerCase().includes(name));
      });
  }, [trafficEvents, filteredProducts, targetUserId]);

  const activeOrders = filteredOrders.filter(o => o.status !== 'cancelled');
  const totalRevenue = activeOrders.reduce((acc, o) => acc + o.total, 0);
  const totalVisits = Math.max(filteredTraffic.length, 1);
  const conversionRate = totalVisits > 0 ? (filteredOrders.length / totalVisits) * 100 : 0;

  // New Table State
  const [sortField, setSortField] = useState<string>('views');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterText, setFilterText] = useState('');

  const productPerformance = useMemo(() => {
      return filteredProducts.map(p => {
          const stat = filteredStats.find(s => s.productId === p.id) || { productId: p.id, views: 0, clicks: 0, shares: 0, totalViewTime: 0, lastUpdated: 0 };
          return {
              ...p,
              stats: stat,
              ctr: stat.views > 0 ? (stat.clicks / stat.views) * 100 : 0
          };
      });
  }, [filteredProducts, filteredStats]);

  const sortedPerformance = useMemo(() => {
      return [...productPerformance]
          .filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()) || p.sku?.toLowerCase().includes(filterText.toLowerCase()))
          .sort((a, b) => {
              let valA: any = (a.stats as any)[sortField] || 0;
              let valB: any = (b.stats as any)[sortField] || 0;
              
              if(sortField === 'name') { valA = a.name; valB = b.name; }
              if(sortField === 'ctr') { valA = a.ctr; valB = b.ctr; }
              
              return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
          });
  }, [productPerformance, sortField, sortAsc, filterText]);

  const handleSort = (field: string) => {
      if (sortField === field) setSortAsc(!sortAsc);
      else { setSortField(field); setSortAsc(false); }
  };

  const visitsByDate = useMemo(() => {
    const data: Record<string, number> = {};
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toLocaleDateString();
    });
    last7Days.forEach(d => data[d] = 0);
    filteredTraffic.forEach(e => { const date = new Date(e.timestamp).toLocaleDateString(); if (data[date] !== undefined) data[date]++; });
    return Object.values(data);
  }, [filteredTraffic]);

  const revenueByDate = useMemo(() => {
    const data: Record<string, number> = {};
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toLocaleDateString();
    });
    last7Days.forEach(d => data[d] = 0);
    activeOrders.forEach(o => { const date = new Date(o.createdAt).toLocaleDateString(); if (data[date] !== undefined) data[date] += o.total; });
    return Object.values(data);
  }, [activeOrders]);

  const topProducts = useMemo(() => {
      const sorted = [...filteredStats].sort((a, b) => b.views - a.views).slice(0, 5);
      return sorted.map(s => { const product = filteredProducts.find(p => p.id === s.productId); return { label: product?.name || 'Unknown', value: s.views }; });
  }, [filteredStats, filteredProducts]);

  const topLocations = useMemo(() => {
      const locs: Record<string, number> = {};
      filteredTraffic.forEach(e => { if(e.city) locs[e.city] = (locs[e.city] || 0) + 1; });
      return Object.entries(locs).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value]) => ({ label, value }));
  }, [filteredTraffic]);

  const deviceBreakdown = useMemo(() => {
      const devs: Record<string, number> = {};
      filteredTraffic.forEach(e => { const d = e.device || 'Desktop'; devs[d] = (devs[d] || 0) + 1; });
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];
      return Object.entries(devs).map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));
  }, [filteredTraffic]);

  const peakHours = useMemo(() => {
      const hours = Array(24).fill(0);
      filteredTraffic.forEach(e => {
          const h = new Date(e.timestamp).getHours();
          hours[h]++;
      });
      return hours;
  }, [filteredTraffic]);

  // --- PDF REPORT GENERATOR ---
  const generatePDFReport = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryColor = [212, 175, 55]; // #D4AF37
    const secondaryColor = [30, 41, 59]; // #1E293B
    const lightColor = [241, 245, 249]; // #f1f5f9

    // Helper: Draw Slide Background
    const drawSlideBg = (title: string, sub: string) => {
        doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Sidebar Strip
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(0, 0, 15, pageHeight, 'F');

        // Header
        doc.setFontSize(22);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 25, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(sub, 25, 26);

        // Logo Mark (Simple Draw)
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.circle(pageWidth - 20, 15, 6, 'F');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("MB", pageWidth - 22.5, 17.5);
    };

    // Helper: Draw Metric Card
    const drawCard = (x: number, y: number, w: number, h: number, title: string, value: string, iconType: 'money' | 'trend' | 'user' | 'cart') => {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, y, w, h, 3, 3, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x, y, w, h, 3, 3, 'S');

        // Icon Circle
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.circle(x + 12, y + 12, 6, 'F');
        
        // Title
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text(title.toUpperCase(), x + 25, y + 10);

        // Value
        doc.setFontSize(18);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(value, x + 25, y + 20);
    };

    // --- SLIDE 1: COVER ---
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Abstract Art
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.circle(pageWidth/2, pageHeight/2, 60, 'S');
    doc.circle(pageWidth/2, pageHeight/2, 50, 'S');
    
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.setFont('times', 'bold'); // Serif approximation
    doc.text(settings.companyName || "Executive Report", pageWidth/2, pageHeight/2 - 10, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text("PERFORMANCE INTELLIGENCE", pageWidth/2, pageHeight/2 + 5, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth/2, pageHeight - 20, { align: 'center' });

    // --- SLIDE 2: KPI DASHBOARD ---
    doc.addPage();
    drawSlideBg("Executive Summary", "Key Performance Indicators");

    const cardWidth = 60;
    drawCard(25, 40, cardWidth, 30, "Total Revenue", `R ${totalRevenue.toLocaleString()}`, 'money');
    drawCard(95, 40, cardWidth, 30, "Active Orders", filteredOrders.length.toString(), 'cart');
    drawCard(165, 40, cardWidth, 30, "Total Visits", totalVisits.toLocaleString(), 'trend');
    drawCard(235, 40, cardWidth, 30, "Conversion Rate", `${conversionRate.toFixed(2)}%`, 'trend');

    // Recent Traffic Chart (Simulated drawing)
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(25, 80, 270, 80, 3, 3, 'F');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("Traffic Velocity (Last 7 Days)", 35, 90);
    
    // Draw Axis
    doc.setDrawColor(200, 200, 200);
    doc.line(35, 150, 285, 150); // X Axis
    
    // Draw Line Chart Points
    let prevX = 35;
    let prevY = 150;
    const maxVisit = Math.max(...visitsByDate, 10);
    const stepX = 250 / (visitsByDate.length - 1 || 1);
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    
    visitsByDate.forEach((val, i) => {
        const x = 35 + (i * stepX);
        const y = 150 - ((val / maxVisit) * 50);
        if (i > 0) doc.line(prevX, prevY, x, y);
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.circle(x, y, 1.5, 'F');
        prevX = x;
        prevY = y;
    });

    // --- SLIDE 3: PRODUCTS & INVENTORY ---
    doc.addPage();
    drawSlideBg("Collection Performance", "Top Performing Assets");

    const productRows = sortedPerformance.slice(0, 10).map(p => [
        p.name,
        p.sku,
        p.stats.views,
        p.stats.clicks,
        `${p.ctr.toFixed(1)}%`,
        `R ${p.price}`
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['Product Name', 'SKU', 'Views', 'Clicks', 'CTR', 'Price']],
        body: productRows,
        theme: 'grid',
        headStyles: { fillColor: secondaryColor, textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 25, right: 10 }
    });

    // --- SLIDE 4: ORDERS & FINANCIALS ---
    doc.addPage();
    drawSlideBg("Financial Ledger", "Recent Transaction History");

    const orderRows = filteredOrders.slice(0, 12).map(o => [
        o.id,
        new Date(o.createdAt).toLocaleDateString(),
        o.customerName,
        o.status.toUpperCase(),
        `R ${o.total.toLocaleString()}`
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['Order ID', 'Date', 'Customer', 'Status', 'Total']],
        body: orderRows,
        theme: 'striped',
        headStyles: { fillColor: primaryColor, textColor: secondaryColor },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 25, right: 10 }
    });

    // Save
    doc.save(`${settings.companyName.replace(/\s+/g, '_')}_Executive_Report.pdf`);
  };

  return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left relative">
          
          {/* --- HEADER ACTIONS ROW --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
             <div>
                <h2 className="text-3xl font-serif text-white">Insights</h2>
                <p className="text-slate-400 text-sm">Performance tracking and detailed analytics.</p>
             </div>
             
             <div className="flex gap-4">
                {/* User Filter (Owner Only) */}
                {isOwner && (
                   <div className="relative group">
                      <select 
                        value={selectedUserId} 
                        onChange={(e) => setSelectedUserId(e.target.value)} 
                        className="px-4 py-3 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest outline-none hover:bg-slate-800 hover:text-white cursor-pointer appearance-none pr-10"
                      >
                         <option value="all">Global View</option>
                         {admins.map(a => (
                            <option key={a.id} value={a.id}>{a.name} (Admin)</option>
                         ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                   </div>
                )}

                {/* PDF Generation Button (Replaces CSV Exports) */}
                <button 
                    onClick={generatePDFReport}
                    className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Presentation size={16}/> Generate Executive Deck
                </button>
             </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl group hover:border-primary/30 transition-colors"><div className="text-slate-500 text-xs font-bold uppercase flex items-center gap-2 mb-2"><Banknote size={14} className="text-green-500"/> Revenue</div><div className="text-2xl font-black text-white">R {totalRevenue.toLocaleString()}</div></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl group hover:border-primary/30 transition-colors"><div className="text-slate-500 text-xs font-bold uppercase flex items-center gap-2 mb-2"><ShoppingBag size={14} className="text-blue-500"/> Orders</div><div className="text-2xl font-black text-white">{filteredOrders.length}</div></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl group hover:border-primary/30 transition-colors"><div className="text-slate-500 text-xs font-bold uppercase flex items-center gap-2 mb-2"><Globe size={14} className="text-purple-500"/> Visits</div><div className="text-2xl font-black text-white">{filteredTraffic.length}</div></div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl group hover:border-primary/30 transition-colors"><div className="text-slate-500 text-xs font-bold uppercase flex items-center gap-2 mb-2"><Activity size={14} className="text-orange-500"/> Conv. Rate</div><div className="text-2xl font-black text-white">{conversionRate.toFixed(2)}%</div></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800"><h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2"><BarChart3 size={16} className="text-primary"/> Traffic Trend (7 Days)</h4><div className="h-48"><SimpleLineChart data={visitsByDate} color="#D4AF37" height={190} /></div></div>
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800"><h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2"><TrendingUp size={16} className="text-green-500"/> Revenue Trend (7 Days)</h4><div className="h-48"><SimpleLineChart data={revenueByDate} color="#22c55e" height={190} /></div></div>
          </div>

          {/* --- DETAILED PRODUCT PERFORMANCE TABLE --- */}
          <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                  <h4 className="text-white font-bold text-lg flex items-center gap-2"><Table size={18} className="text-primary"/> Product Performance Intelligence</h4>
                  <div className="relative w-full md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-primary transition-all"
                      />
                  </div>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <th className="p-4 w-16">Item</th>
                              <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>Name <ArrowUpDown size={10} className="inline ml-1"/></th>
                              <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('views')}>Views <ArrowUpDown size={10} className="inline ml-1"/></th>
                              <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('clicks')}>Clicks <ArrowUpDown size={10} className="inline ml-1"/></th>
                              <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('ctr')}>CTR <ArrowUpDown size={10} className="inline ml-1"/></th>
                              <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('shares')}>Shares <ArrowUpDown size={10} className="inline ml-1"/></th>
                              <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('lastUpdated')}>Last Interaction <ArrowUpDown size={10} className="inline ml-1"/></th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                          {sortedPerformance.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                                  <td className="p-4">
                                      <div className="w-10 h-10 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                          <img src={p.media?.[0]?.url} className="w-full h-full object-cover"/>
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <div className="text-white font-bold text-xs">{p.name}</div>
                                      <div className="text-slate-500 text-[9px] font-mono">{p.sku}</div>
                                  </td>
                                  <td className="p-4 text-center text-xs text-slate-300 font-mono">{p.stats.views}</td>
                                  <td className="p-4 text-center text-xs text-slate-300 font-mono">{p.stats.clicks}</td>
                                  <td className="p-4 text-center">
                                      <span className={`px-2 py-1 rounded text-[9px] font-black ${p.ctr > 5 ? 'bg-green-500/20 text-green-400' : p.ctr > 2 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-500'}`}>
                                          {p.ctr.toFixed(1)}%
                                      </span>
                                  </td>
                                  <td className="p-4 text-center text-xs text-slate-300 font-mono">{p.stats.shares}</td>
                                  <td className="p-4 text-right text-[10px] text-slate-500 font-mono">
                                      {p.stats.lastUpdated ? new Date(p.stats.lastUpdated).toLocaleDateString() : 'Never'}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {sortedPerformance.length === 0 && <div className="p-8 text-center text-slate-500 text-xs italic">No performance data found.</div>}
              </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 lg:col-span-2"><h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2"><Clock size={16} className="text-blue-400"/> Peak Activity Hours</h4><div className="h-48 w-full"><SimpleBarChart data={peakHours.map((v, i) => ({ label: `${i}:00`, value: v }))} color="#3b82f6" showLabels={false} /></div><div className="flex justify-between text-[8px] text-slate-500 mt-2 font-mono"><span>00:00</span><span>12:00</span><span>23:00</span></div></div>
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col items-center justify-center"><h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2 w-full text-left"><Monitor size={16} className="text-purple-500"/> Device Breakdown</h4><SimpleDonutChart data={deviceBreakdown} /><div className="flex flex-wrap justify-center gap-3 mt-6">{deviceBreakdown.map((s, i) => (<div key={i} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}}></div><span className="text-[9px] text-slate-400 font-bold uppercase">{s.label}</span></div>))}</div></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800"><h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2"><Star size={16} className="text-yellow-500"/> Top Products (Views)</h4><div className="h-48 w-full"><SimpleBarChart data={topProducts} color="#D4AF37" /></div></div>
              <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800"><h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2"><MapPin size={16} className="text-red-500"/> Top Locations</h4><div className="h-48 w-full"><SimpleBarChart data={topLocations} color="#ef4444" /></div></div>
          </div>
      </div>
  );
};

const TrainingGrid: React.FC = () => {
   const [filter, setFilter] = useState('All');
   const categories = ['All', 'Social', 'Marketplace', 'SEO', 'Email'];
   const [expandedModule, setExpandedModule] = useState<string | null>(null);
   const filteredModules = TRAINING_MODULES.filter(m => { if (filter === 'All') return true; if (filter === 'Social') return ['Instagram', 'TikTok', 'Pinterest', 'Facebook'].includes(m.platform); if (filter === 'Marketplace') return ['General', 'Amazon'].includes(m.platform); return m.platform === filter; });
   return ( <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left"><div className="flex flex-col md:flex-row justify-between items-end gap-6"><div className="space-y-2"><div className="flex items-center gap-4"><h2 className="text-3xl font-serif text-white">Academy</h2><a href="https://www.youtube.com/results?search_query=affiliate+marketing+training" target="_blank" rel="noopener noreferrer" className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center" title="Watch Video Tutorials"><Youtube size={20} /></a></div><p className="text-slate-400 text-sm">Master the art of affiliate curation.</p></div><div className="flex gap-2 overflow-x-auto no-scrollbar">{categories.map(cat => ( <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filter === cat ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'}`}>{cat}</button> ))}</div></div><div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredModules.map((module, i) => { const Icon = CustomIcons[module.icon] || (LucideIcons as any)[module.icon] || GraduationCap; const isExpanded = expandedModule === module.id; return ( <div key={module.id} className={`bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col transition-all duration-300 ${isExpanded ? 'md:col-span-2 row-span-2 border-primary/50 shadow-2xl z-10' : 'hover:border-slate-600'}`}><div className="p-6 flex flex-col h-full"><div className="flex justify-between items-start mb-4"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${module.platform === 'Pinterest' ? 'bg-red-600' : 'bg-slate-800 border border-slate-700'}`}><Icon size={20} /></div><span className="px-2 py-1 rounded-md bg-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{module.platform}</span></div><h3 className="text-white font-bold text-lg mb-2 leading-tight">{module.title}</h3><p className="text-slate-500 text-xs line-clamp-3 mb-4">{module.description}</p><div className="mt-auto"><button onClick={() => setExpandedModule(isExpanded ? null : module.id)} className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">{isExpanded ? 'Close Module' : 'Start Lesson'} <ArrowRight size={12}/></button></div></div>{isExpanded && ( <div className="px-6 pb-6 bg-slate-900 border-t border-slate-800 animate-in fade-in"><div className="pt-6 space-y-6"><div><h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Target size={14}/> Strategy</h4><ul className="space-y-2">{module.strategies.map((s, idx) => ( <li key={idx} className="text-slate-300 text-xs pl-4 border-l-2 border-slate-700">{s}</li> ))}</ul></div><div><h4 className="text-green-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Rocket size={14}/> Action Items</h4><div className="space-y-2">{module.actionItems.map((item, idx) => ( <label key={idx} className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer hover:border-green-500/30 transition-colors"><input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-green-500 focus:ring-0" /><span className="text-slate-400 text-xs">{item}</span></label> ))}</div></div></div></div> )}</div> ); })}</div></div> );
};

const Admin: React.FC = () => {
  // ... [Main Admin logic remains largely unchanged, just context providers]
  const { 
    settings, updateSettings, user, isLocalMode, saveStatus, setSaveStatus,
    products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers,
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [articleData, setArticleData] = useState<Partial<Article>>({});
  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });
  const [tempFeature, setTempFeature] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
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

  // ... [useEffect hooks remain the same]
  useEffect(() => {
    const fetchTraffic = async () => { try { if (isSupabaseConfigured) { const { data } = await supabase.from('traffic_logs').select('*').order('timestamp', { ascending: false }).limit(2000); if (data) setTrafficEvents(data); } else { const rawLogs = localStorage.getItem('site_traffic_logs'); const logs = rawLogs ? JSON.parse(rawLogs) : []; if (Array.isArray(logs)) setTrafficEvents(logs); } } catch (e) { setTrafficEvents([]); } };
    if (hasPermission('analytics.view')) { fetchTraffic(); } const interval = setInterval(fetchTraffic, 5000); return () => clearInterval(interval);
  }, [isSupabaseConfigured]);

  useEffect(() => { if (activeTab === 'reviews') { const fetchReviews = async () => { if (isSupabaseConfigured) { const { data } = await supabase.from('reviews').select('*').order('createdAt', { ascending: false }); if (data) setReviews(data); } else { const local = localStorage.getItem('site_reviews'); if (local) setReviews(JSON.parse(local)); } }; fetchReviews(); } }, [activeTab]);

  // ... [Helper functions: handleDeleteReview, handleLogout, handleSaveProduct etc. remain the same]
  const handleDeleteReview = async (id: string) => { if (!window.confirm("Delete review?")) return; const newReviews = reviews.filter(r => r.id !== id); setReviews(newReviews); if (isSupabaseConfigured) { await supabase.from('reviews').delete().eq('id', id); } else { localStorage.setItem('site_reviews', JSON.stringify(newReviews)); } };
  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  
  const handleSaveProduct = async () => { const newProduct = { ...productData, id: editingId || Date.now().toString(), createdAt: productData.createdAt || Date.now(), createdBy: productData.createdBy || user?.id }; const ok = await updateData('products', newProduct); if (ok) { setShowProductForm(false); setEditingId(null); } };
  const handleSaveCategory = async () => { const newCat = { ...catData, id: editingId || Date.now().toString(), createdBy: catData.createdBy || user?.id }; const ok = await updateData('categories', newCat); if (ok) { setShowCategoryForm(false); setEditingId(null); } };
  const handleSaveHero = async () => { const newSlide = { ...heroData, id: editingId || Date.now().toString(), createdBy: heroData.createdBy || user?.id }; const ok = await updateData('hero_slides', newSlide); if (ok) { setShowHeroForm(false); setEditingId(null); } };
  const handleSaveArticle = async () => { const newArticle: Article = { ...articleData as Article, id: editingId || Date.now().toString(), date: articleData.date || Date.now(), author: articleData.author || settings.companyName }; const ok = await updateData('articles', newArticle); if (ok) { setShowArticleForm(false); setEditingId(null); } };
  const handleSaveAdmin = async () => { if (!adminData.email) return; setCreatingAdmin(true); try { const newAdmin = { ...adminData, id: editingId || Date.now().toString(), createdAt: adminData.createdAt || Date.now() }; const ok = await updateData('admin_users', newAdmin); if (ok) { setShowAdminForm(false); setEditingId(null); } } catch (err: any) { alert(`Error saving member: ${err.message}`); } finally { setCreatingAdmin(false); } };

  const toggleEnquiryStatus = async (enquiry: Enquiry) => { if(!hasPermission('sales.manage')) return; const updated = { ...enquiry, status: enquiry.status === 'read' ? 'unread' : 'read' }; await updateData('enquiries', updated); };
  const handleAddSubCategory = async (categoryId: string) => { if (!tempSubCatName.trim()) return; const newSub: SubCategory = { id: Date.now().toString(), categoryId, name: tempSubCatName, createdBy: user?.id }; await updateData('subcategories', newSub); setTempSubCatName(''); };
  const handleDeleteSubCategory = async (id: string) => await deleteData('subcategories', id);
  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => { if(!hasPermission('sales.fulfillment')) return; const order = orders.find(o => o.id === orderId); if (!order) return; await updateData('orders', { ...order, status: newStatus }); if(viewingOrder && viewingOrder.id === orderId) setViewingOrder({ ...order, status: newStatus as any }); };
  const handleSaveTracking = async () => { if(!viewingOrder || !hasPermission('sales.fulfillment')) return; const updated = { ...viewingOrder, courierName: trackingInfo.courier, trackingNumber: trackingInfo.tracking, status: 'shipped' as const }; await updateData('orders', updated); setViewingOrder(updated); alert(`Status updated to Shipped.`); };
  const printInvoice = (order: Order) => { const w = window.open('', '_blank'); if(w) { w.document.write(`<html><head><title>Invoice ${order.id}</title><style>body { font-family: sans-serif; padding: 40px; } .header { margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; } .total { margin-top: 20px; text-align: right; font-size: 20px; font-weight: bold; }</style></head><body><div class="header"><h1>${settings.companyName}</h1><p>Invoice #${order.id}</p><p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p></div><p><strong>Bill To:</strong> ${order.customerName}<br>${order.shippingAddress}<br>${order.customerEmail}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${order.items?.map(i => `<tr><td>${i.productName}</td><td>${i.quantity}</td><td>R ${i.price}</td><td>R ${i.price * i.quantity}</td></tr>`).join('')}</tbody></table><div class="total">Total: R ${order.total.toLocaleString()}</div></body></html>`); w.document.close(); w.print(); } };
  
  // Product Form Handlers
  const handleAddDiscountRule = () => { if (!tempDiscountRule.value || !tempDiscountRule.description) return; const newRule: DiscountRule = { id: Date.now().toString(), type: tempDiscountRule.type || 'percentage', value: Number(tempDiscountRule.value), description: tempDiscountRule.description }; setProductData({ ...productData, discountRules: [...(productData.discountRules || []), newRule] }); setTempDiscountRule({ type: 'percentage', value: 0, description: '' }); };
  const handleRemoveDiscountRule = (id: string) => { setProductData({ ...productData, discountRules: (productData.discountRules || []).filter(r => r.id !== id) }); };
  const handleAddFeature = () => { if (!tempFeature.trim()) return; setProductData(prev => ({ ...prev, features: [...(prev.features || []), tempFeature] })); setTempFeature(''); };
  const handleRemoveFeature = (index: number) => { setProductData(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) })); };
  const handleAddSpec = () => { if (!tempSpec.key.trim() || !tempSpec.value.trim()) return; setProductData(prev => ({ ...prev, specifications: { ...(prev.specifications || {}), [tempSpec.key]: tempSpec.value } })); setTempSpec({ key: '', value: '' }); };
  const handleRemoveSpec = (key: string) => { setProductData(prev => { const newSpecs = { ...(prev.specifications || {}) }; delete newSpecs[key]; return { ...prev, specifications: newSpecs }; }); };
  
  // Editor Handlers
  const handleOpenEditor = (section: any) => { if(!hasPermission('site.editor')) return; setTempSettings({...settings}); setActiveEditorSection(section); setEditorDrawerOpen(true); };
  const updateTempSettings = (newSettings: Partial<SiteSettings>) => setTempSettings(prev => ({ ...prev, ...newSettings }));
  
  // Filters
  const filteredEnquiries = enquiries.filter(e => { const matchesSearch = e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || e.email.toLowerCase().includes(enquirySearch.toLowerCase()) || e.subject.toLowerCase().includes(enquirySearch.toLowerCase()); const matchesStatus = enquiryFilter === 'all' || e.status === enquiryFilter; return matchesSearch && matchesStatus; });

  const handleGenerateTestData = async () => {
      // 1. Generate Traffic Logs
      const devices = ['Desktop', 'Mobile', 'Tablet'];
      const sources = ['Google', 'Instagram', 'Direct', 'TikTok', 'Email'];
      const cities = ['New York', 'London', 'Cape Town', 'Paris', 'Tokyo', 'Sydney'];
      const newLogs = Array.from({length: 50}, (_, i) => ({
          id: `log-${Date.now()}-${i}`,
          type: 'view',
          text: `Page View: /products`,
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now() - Math.floor(Math.random() * 604800000), // Last 7 days
          source: sources[Math.floor(Math.random() * sources.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          city: cities[Math.floor(Math.random() * cities.length)]
      }));
      
      setTrafficEvents(prev => [...newLogs, ...prev]);
      if(isSupabaseConfigured) {
          await supabase.from('traffic_logs').upsert(newLogs);
      } else {
          const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]');
          localStorage.setItem('site_traffic_logs', JSON.stringify([...newLogs, ...existing]));
      }

      // 2. Generate Orders
      const newOrders = Array.from({length: 5}, (_, i) => ({
          id: `TEST-${Date.now().toString().slice(-4)}-${i}`,
          customerName: `Test User ${i}`,
          customerEmail: `test${i}@example.com`,
          shippingAddress: '123 Test St, Test City',
          total: Math.floor(Math.random() * 5000) + 500,
          status: 'paid' as const,
          paymentMethod: 'yoco' as const,
          createdAt: Date.now() - Math.floor(Math.random() * 604800000),
          items: []
      }));

      await updateData('orders', newOrders[0]); 
      for(let i=1; i<newOrders.length; i++) await updateData('orders', newOrders[i]);

      alert('Test data generated! Check Analytics & Orders tabs.');
  };

  const handlePricingUpdate = (updates: { price: number, cost: number }) => {
    setProductData(prev => ({ 
        ...prev, 
        price: updates.price, 
        costPrice: updates.cost 
    }));
  };

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Inbox</h2><p className="text-slate-400 text-sm">Manage incoming client communications.</p></div></div>
      <div className="flex flex-col md:flex-row gap-4 mb-6"><div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search..." value={enquirySearch} onChange={e => setEnquirySearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm" /></div><div className="flex gap-2 overflow-x-auto no-scrollbar">{['all', 'unread', 'read'].map(filter => (<button key={filter} onClick={() => setEnquiryFilter(filter as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${enquiryFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>{filter}</button>))}</div></div>
      {filteredEnquiries.length === 0 ? <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500">No enquiries found.</div> : filteredEnquiries.map(e => (<div key={e.id} className={`bg-slate-900 border transition-all rounded-[2rem] p-5 md:p-6 flex flex-col md:flex-row gap-6 text-left ${e.status === 'unread' ? 'border-primary/30' : 'border-slate-800'}`}><div className="flex-grow space-y-2 min-w-0"><div className="flex items-center gap-3"><h4 className="text-white font-bold truncate">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase flex-shrink-0">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold truncate">{e.email}</p><div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic">"{e.message}"</div></div><div className="flex gap-2 items-start">{hasPermission('sales.manage') && (<><button onClick={() => setReplyEnquiry(e)} className="p-4 bg-primary/20 text-primary rounded-2xl"><Reply size={20}/></button><button onClick={() => toggleEnquiryStatus(e)} className={`p-4 rounded-2xl ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`}><CheckCircle size={20}/></button></>)}{hasPermission('sales.delete') && <button onClick={() => deleteData('enquiries', e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl hover:text-red-500"><Trash2 size={20}/></button>}</div></div>))}</div>
  );

  const renderSubscribers = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left"><div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Audience</h2><p className="text-slate-400 text-sm">Newsletter subscribers.</p></div></div>{subscribers.length === 0 ? <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500">No subscribers yet.</div> : <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden"><table className="w-full text-left border-collapse"><thead><tr className="bg-slate-950/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800"><th className="p-6">Email Address</th><th className="p-6">Joined Date</th><th className="p-6 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-800">{subscribers.sort((a,b) => b.createdAt - a.createdAt).map(sub => (<tr key={sub.id} className="hover:bg-slate-800/30 transition-colors"><td className="p-6 text-sm text-white font-bold">{sub.email}</td><td className="p-6 text-xs text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</td><td className="p-6 text-right"><button onClick={() => deleteData('subscribers', sub.id)} className="p-2 bg-slate-800 text-slate-500 rounded-lg hover:text-red-500 transition-colors"><Trash2 size={16}/></button></td></tr>))}</tbody></table></div>}</div>
  );

  // ... [Render functions for Articles, Reviews, Catalog, Orders, Hero, Categories, PricingTool, SiteEditor, Team, Guide remain the same]
  const renderArticles = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        {showArticleForm ? (
            <div className="bg-slate-900 p-6 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-8"><div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6"><h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Article' : 'New Journal Entry'}</h3><button onClick={() => setShowArticleForm(false)} className="text-slate-500 hover:text-white"><X size={24}/></button></div><div className="grid md:grid-cols-2 gap-8"><div className="space-y-6"><SettingField label="Title" value={articleData.title || ''} onChange={v => setArticleData({ ...articleData, title: v })} /><SettingField label="Author" value={articleData.author || settings.companyName} onChange={v => setArticleData({ ...articleData, author: v })} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Publish Date</label><input type="date" className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={articleData.date ? new Date(articleData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} onChange={e => setArticleData({ ...articleData, date: new Date(e.target.value).getTime() })}/></div></div><div className="space-y-6"><SingleImageUploader label="Cover Image" value={articleData.image || ''} onChange={v => setArticleData({ ...articleData, image: v })} className="h-48 w-full object-cover rounded-2xl" /><SettingField label="Excerpt" value={articleData.excerpt || ''} onChange={v => setArticleData({ ...articleData, excerpt: v })} type="textarea" rows={3} /></div></div><div className="space-y-2"><SettingField label="Content (Markdown Supported)" value={articleData.content || ''} onChange={v => setArticleData({ ...articleData, content: v })} type="textarea" rows={15} /></div><div className="flex gap-4 pt-8 border-t border-slate-800"><button onClick={handleSaveArticle} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Article</button><button onClick={() => setShowArticleForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div></div>
        ) : (
            <><div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 text-left"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Journal</h2><p className="text-slate-400 text-sm">Curate your editorial content.</p></div><button onClick={() => { setArticleData({}); setShowArticleForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3 w-full md:w-auto justify-center"><Plus size={18} /> New Article</button></div><div className="grid gap-6">{articles.map(article => (<div key={article.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-colors group"><div className="w-full md:w-48 h-32 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0"><img src={article.image} alt={article.title} className="w-full h-full object-cover" /></div><div className="flex-grow min-w-0"><div className="flex justify-between items-start"><h4 className="text-xl font-serif text-white mb-2 line-clamp-1">{article.title}</h4><div className="flex gap-2"><button onClick={() => { setArticleData(article); setEditingId(article.id); setShowArticleForm(true); }} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"><Edit2 size={16}/></button><button onClick={() => deleteData('articles', article.id)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-red-500"><Trash2 size={16}/></button></div></div><p className="text-slate-500 text-sm line-clamp-2 mb-4">{article.excerpt}</p><div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600"><span>{new Date(article.date).toLocaleDateString()}</span><span>{article.author}</span></div></div></div>))}</div></>
        )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left"><div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Reviews</h2><p className="text-slate-400 text-sm">Manage user feedback.</p></div></div>{reviews.length === 0 ? <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500"><ThumbsUp className="mx-auto mb-4 opacity-50" size={32}/><p className="text-sm">No reviews yet.</p></div> : <div className="grid gap-4">{reviews.map(review => { const product = products.find(p => p.id === review.productId); return (<div key={review.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row justify-between items-start gap-6"><div className="flex-grow min-w-0"><div className="flex items-center gap-3 mb-2"><div className="flex text-yellow-500">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />)}</div><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span></div><h4 className="text-white font-bold text-sm mb-1">{review.userName} <span className="text-slate-500 font-normal">on</span> <span className="text-primary">{product?.name || 'Unknown'}</span></h4><p className="text-slate-400 text-xs italic">"{review.comment}"</p></div><button onClick={() => handleDeleteReview(review.id)} className="p-3 bg-slate-800 text-slate-500 rounded-xl hover:text-red-500"><Trash2 size={16}/></button></div>); })}</div>}</div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
      {showProductForm ? (
        <div className="bg-slate-900 p-6 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6"><h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Masterpiece' : 'New Masterpiece'}</h3><button onClick={() => setShowProductForm(false)} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
          
          <div className="space-y-6">
             <h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2 flex items-center gap-2"><Box size={18} className="text-primary"/> Inventory Deployment</h4>
             <p className="text-slate-400 text-xs">Optimize your listing with detailed specifications and high-res media.</p>
             <div className="grid md:grid-cols-2 gap-6">
                <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
                <SettingField label="SKU / Reference ID" value={productData.sku || ''} onChange={v => setProductData({...productData, sku: v})} />
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                 <h4 className="text-white font-bold text-lg flex items-center gap-2"><Banknote size={18} className="text-primary"/> Financial Engineering</h4>
                 {hasPermission('catalog.direct_sales') && (
                    <div onClick={() => setProductData({...productData, isDirectSale: !productData.isDirectSale})} className={`flex items-center gap-3 cursor-pointer px-3 py-1 rounded-full border transition-all ${productData.isDirectSale ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest">Direct Sale</span>
                        <div className={`w-3 h-3 rounded-full ${productData.isDirectSale ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                    </div>
                 )}
             </div>
             <p className="text-slate-400 text-xs">Enable Direct Sales above to access the full pricing calculator. For Affiliate items, simply enter the display price below.</p>
             
             <SmartPricingSimulator 
                currency={settings.currency || 'ZAR'}
                initialState={{
                    mode: productData.isDirectSale ? 'merchant' : 'affiliate',
                    costPrice: productData.costPrice || 0,
                    sellingPrice: productData.price || 0,
                    markupPercent: productData.costPrice ? ((productData.price! - productData.costPrice) / productData.costPrice * 100) : 50,
                    taxRate: settings.vatRate || 15,
                    retailPrice: productData.price || 0 
                }}
                onUpdate={({ price, cost }) => {
                    handlePricingUpdate({ price, cost });
                }}
             />

             {productData.isDirectSale && (
                <SettingField label="Stock Quantity" value={productData.stockQuantity?.toString() || '0'} onChange={v => setProductData({...productData, stockQuantity: parseInt(v) || 0})} type="number" />
             )}
             
             {!productData.isDirectSale && (
                <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} placeholder="https://..." />
             )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label>
                  <select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value, subCategoryId: ''})}><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sub-Category</label>
                  <select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.subCategoryId} onChange={e => setProductData({...productData, subCategoryId: e.target.value})} disabled={!productData.categoryId}><option value="">Select</option>{subCategories.filter(s => s.categoryId === productData.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
              </div>
          </div>
          <SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" />

          <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest border-b border-slate-800 pb-2">Highlights</h4>
              <div className="flex gap-2">
                  <input type="text" placeholder="Add highlight (e.g. '100% Silk')" value={tempFeature} onChange={e => setTempFeature(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" />
                  <button onClick={handleAddFeature} className="px-4 bg-slate-700 text-white rounded-xl hover:bg-primary hover:text-slate-900 transition-colors"><Plus size={18}/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                  {(productData.features || []).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="text-xs text-slate-300">{f}</span>
                          <button onClick={() => handleRemoveFeature(i)} className="text-slate-500 hover:text-red-500"><X size={12}/></button>
                      </div>
                  ))}
              </div>
          </div>

          <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest border-b border-slate-800 pb-2">Specifications</h4>
              <div className="flex gap-2">
                  <input type="text" placeholder="Key (e.g. Material)" value={tempSpec.key} onChange={e => setTempSpec({...tempSpec, key: e.target.value})} className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" />
                  <input type="text" placeholder="Value (e.g. Silk)" value={tempSpec.value} onChange={e => setTempSpec({...tempSpec, value: e.target.value})} className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" />
                  <button onClick={handleAddSpec} className="px-4 bg-slate-700 text-white rounded-xl hover:bg-primary hover:text-slate-900 transition-colors"><Plus size={18}/></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                  {Object.entries(productData.specifications || {}).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                          <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{k}</span>
                              <span className="text-xs text-white">{v}</span>
                          </div>
                          <button onClick={() => handleRemoveSpec(k)} className="text-slate-500 hover:text-red-500"><X size={12}/></button>
                      </div>
                  ))}
              </div>
          </div>

          <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest border-b border-slate-800 pb-2">Discount Rules</h4>
              <div className="flex gap-2 items-end">
                  <div className="flex-grow space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">Description</label>
                      <input type="text" placeholder="Summer Sale" value={tempDiscountRule.description} onChange={e => setTempDiscountRule({...tempDiscountRule, description: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" />
                  </div>
                  <div className="w-24 space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">Value</label>
                      <input type="number" placeholder="0" value={tempDiscountRule.value} onChange={e => setTempDiscountRule({...tempDiscountRule, value: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" />
                  </div>
                  <div className="w-32 space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">Type</label>
                      <select value={tempDiscountRule.type} onChange={e => setTempDiscountRule({...tempDiscountRule, type: e.target.value as any})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none">
                          <option value="percentage">Percent (%)</option>
                          <option value="fixed">Fixed (R)</option>
                      </select>
                  </div>
                  <button onClick={handleAddDiscountRule} className="h-10 px-4 bg-slate-700 text-white rounded-xl hover:bg-primary hover:text-slate-900 transition-colors flex items-center justify-center"><Plus size={18}/></button>
              </div>
              <div className="space-y-2">
                  {(productData.discountRules || []).map((rule) => (
                      <div key={rule.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                          <div>
                              <span className="text-xs font-bold text-white block">{rule.description}</span>
                              <span className="text-[10px] text-green-400 font-mono">{rule.type === 'percentage' ? `-${rule.value}%` : `-R${rule.value}`}</span>
                          </div>
                          <button onClick={() => handleRemoveDiscountRule(rule.id)} className="text-slate-500 hover:text-red-500"><X size={12}/></button>
                      </div>
                  ))}
              </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-left">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-primary"/> Media Gallery</h4>
              <FileUploader files={productData.media || []} onFilesChange={f => setProductData({...productData, media: f})} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-slate-800">
              <button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all">Save Masterpiece</button>
              <button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:bg-slate-700 transition-all">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 text-left"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Catalog</h2><p className="text-slate-400 text-sm">Curate your collection.</p></div>{hasPermission('catalog.create') && <button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3 w-full md:w-auto justify-center"><Plus size={18} /> Add Product</button>}</div>
          <div className="flex flex-col md:flex-row gap-4 mb-6"><div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm" /></div></div>
          <div className="grid gap-4">{displayProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).map(p => (<div key={p.id} className="bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-primary/30 transition-colors group gap-4"><div className="flex items-center gap-6 min-w-0 text-left"><div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative flex-shrink-0"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div><div className="min-w-0"><h4 className="text-white font-bold line-clamp-1">{p.name}</h4><div className="flex items-center gap-2 mt-1"><span className="text-primary text-xs font-bold">R {p.price}</span></div></div></div><div className="flex gap-2 w-full md:w-auto flex-shrink-0"><button onClick={() => setSelectedAdProduct(p)} className="flex-1 md:flex-none p-3 bg-primary/10 text-primary rounded-xl"><Megaphone size={18}/></button>{hasPermission('catalog.edit') && <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white"><Edit2 size={18}/></button>}{hasPermission('catalog.delete') && <button onClick={() => deleteData('products', p.id)} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>}</div></div>))}</div>
        </>
      )}
    </div>
  );

  const renderOrders = () => {
    const filteredOrders = orders.filter(o => { const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || o.customerName.toLowerCase().includes(orderSearch.toLowerCase()); const matchesFilter = orderFilter === 'all' ? true : o.status === orderFilter; return matchesSearch && matchesFilter; }).sort((a, b) => b.createdAt - a.createdAt);
    const getStatusBadge = (status: string) => { const styles: Record<string, string> = { paid: 'bg-blue-500/20 text-blue-400', shipped: 'bg-purple-500/20 text-purple-400', delivered: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-400', pending_payment: 'bg-yellow-500/20 text-yellow-400', processing: 'bg-orange-500/20 text-orange-400' }; return <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status] || styles.pending_payment}`}>{status.replace('_', ' ')}</span>; };
    return (
      <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto"><div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Fulfillment</h2><p className="text-slate-400 text-sm">Manage orders.</p></div></div><div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">{['all', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => ( <button key={f} onClick={() => setOrderFilter(f)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${orderFilter === f ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'}`}>{f.replace('_', ' ')}</button> ))}</div><div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden"><table className="w-full text-left border-collapse"><thead><tr className="bg-slate-950/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800"><th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4 text-right">Total</th></tr></thead><tbody className="divide-y divide-slate-800">{filteredOrders.length === 0 ? ( <tr><td colSpan={5} className="p-8 text-center text-slate-500 text-sm">No orders found.</td></tr> ) : ( filteredOrders.map(order => ( <tr key={order.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => { setViewingOrder(order); setTrackingInfo({ courier: order.courierName || '', tracking: order.trackingNumber || '' }); }}><td className="p-4 font-mono text-xs text-white">{order.id}</td><td className="p-4 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td><td className="p-4"><div className="flex flex-col"><span className="text-sm font-bold text-white">{order.customerName}</span><span className="text-[10px] text-slate-500">{order.customerEmail}</span></div></td><td className="p-4">{getStatusBadge(order.status)}</td><td className="p-4 text-right text-sm font-bold text-white">R {order.total.toLocaleString()}</td></tr> )) )}</tbody></table></div>{viewingOrder && (<div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setViewingOrder(null)}><div className="w-full max-w-lg bg-slate-900 h-full shadow-2xl border-l border-slate-800 overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}><div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/50"><div><h3 className="text-2xl font-serif text-white mb-1">Order Details</h3><div className="flex items-center gap-2 text-xs font-mono text-slate-400"><span>#{viewingOrder.id}</span></div></div><button onClick={() => setViewingOrder(null)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={20}/></button></div><div className="flex-grow p-6 space-y-8"><div className="space-y-4"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Order Status</label><select value={viewingOrder.status} onChange={(e) => handleOrderStatusUpdate(viewingOrder.id, e.target.value)} disabled={!hasPermission('sales.fulfillment')} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer disabled:opacity-50">{['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => ( <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option> ))}</select></div><div className="space-y-4"><h4 className="text-white font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-2"><User size={16} className="text-primary"/> Customer</h4><div className="text-xs text-slate-300"><div>{viewingOrder.customerName}</div><div>{viewingOrder.customerEmail}</div><div className="mt-2">{viewingOrder.shippingAddress}</div></div></div><div className="space-y-4"><h4 className="text-white font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-2"><ShoppingBag size={16} className="text-primary"/> Items</h4><div className="space-y-3">{viewingOrder.items?.map((item: OrderItem) => ( <div key={item.id} className="flex justify-between items-center bg-slate-950/30 p-3 rounded-xl border border-slate-800/50"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-white">{item.quantity}x</div><span className="text-sm text-slate-300">{item.productName}</span></div><span className="text-xs font-mono text-white">R {(item.price * item.quantity).toLocaleString()}</span></div> ))}<div className="flex justify-between items-center pt-2 text-sm font-bold text-white"><span>Total</span><span className="text-primary text-lg">R {viewingOrder.total.toLocaleString()}</span></div></div></div><div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800"><h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2"><Truck size={16} className="text-blue-500"/> Logistics</h4>{hasPermission('sales.fulfillment') ? (<div className="space-y-3"><div className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Courier</label><input type="text" value={trackingInfo.courier} onChange={e => setTrackingInfo({...trackingInfo, courier: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none" /></div><div className="space-y-1"><label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Tracking</label><input type="text" value={trackingInfo.tracking} onChange={e => setTrackingInfo({...trackingInfo, tracking: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none" /></div><button onClick={handleSaveTracking} className="w-full py-3 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Update</button></div>) : (<div className="text-xs text-slate-500">Only Fulfillment staff can update logistics.</div>)}</div></div><div className="p-6 border-t border-slate-800 bg-slate-950/50 flex gap-4"><button onClick={() => printInvoice(viewingOrder)} className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-xl font-bold uppercase text-xs tracking-widest hover:text-white flex items-center justify-center gap-2"><Printer size={16}/> Invoice</button></div></div></div>)}</div>
    );
  };

  const renderHero = () => (
     <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto"><AdminTip title="Hero Master Visuals">Set the tone for your bridge page with cinematic hero visuals.</AdminTip>{showHeroForm ? ( <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-800 space-y-6"><div className="grid md:grid-cols-2 gap-6"><SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={heroData.type} onChange={e => setHeroData({...heroData, type: e.target.value as any})}><option value="image">Image</option><option value="video">Video</option></select></div></div><SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" /><SettingField label="Button Label" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} /><SingleImageUploader label="Media Asset" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} accept={heroData.type === 'video' ? "video/*" : "image/*"} /><div className="flex gap-4"><button onClick={handleSaveHero} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Slide</button><button onClick={() => setShowHeroForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div></div> ) : ( <div className="grid md:grid-cols-2 gap-6"><button onClick={() => { setHeroData({ title: '', subtitle: '', cta: 'Explore', image: '', type: 'image' }); setShowHeroForm(true); setEditingId(null); }} className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary min-h-[250px]"><Plus size={48} /><span className="font-black uppercase tracking-widest text-xs">New Hero Slide</span></button>{displayHeroSlides.map(s => ( <div key={s.id} className="relative aspect-video rounded-[2rem] overflow-hidden group border border-slate-800">{s.type === 'video' ? <video src={s.image} className="w-full h-full object-cover" muted /> : <img src={s.image} className="w-full h-full object-cover" />}<div className="absolute inset-0 bg-black/60 p-6 flex flex-col justify-end text-left"><h4 className="text-white text-xl font-serif">{s.title}</h4><div className="flex gap-2 mt-4"><button onClick={() => { setHeroData(s); setEditingId(s.id); setShowHeroForm(true); }} className="p-3 bg-white/10 text-white rounded-xl"><Edit2 size={16}/></button><button onClick={() => deleteData('hero_slides', s.id)} className="p-3 bg-white/10 text-white rounded-xl hover:bg-red-500"><Trash2 size={16}/></button></div></div></div> ))}</div> )}</div>
  );

  const renderCategories = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left w-full max-w-7xl mx-auto">{showCategoryForm ? (<div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-800 space-y-8"><div className="grid md:grid-cols-2 gap-8 text-left"><div className="space-y-6"><h3 className="text-white font-bold text-xl mb-4">Details</h3><SettingField label="Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={catData.icon || 'Package'} onSelect={icon => setCatData({...catData, icon})} /></div><SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} type="textarea" /></div><div className="space-y-6"><SingleImageUploader label="Cover" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} className="h-48 w-full object-cover rounded-2xl" /><div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800"><h4 className="text-white font-bold text-sm mb-4">Subcategories</h4><div className="flex gap-2 mb-4"><input type="text" placeholder="New Subcategory" value={tempSubCatName} onChange={e => setTempSubCatName(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" /><button onClick={() => editingId && handleAddSubCategory(editingId)} className="px-4 bg-slate-700 text-white rounded-xl"><Plus size={18}/></button></div><div className="flex flex-wrap gap-2">{editingId && subCategories.filter(s => s.categoryId === editingId).map(s => (<div key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800"><span className="text-xs text-slate-300">{s.name}</span><button onClick={() => handleDeleteSubCategory(s.id)} className="text-slate-500 hover:text-red-500"><X size={12}/></button></div>))}</div></div></div></div><div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-800"><button onClick={handleSaveCategory} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save</button><button onClick={() => setShowCategoryForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div></div>) : (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"><button onClick={() => { setCatData({ name: '', icon: 'Package', description: '', image: '' }); setShowCategoryForm(true); setEditingId(null); }} className="w-full h-40 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-primary"><Plus size={32} /><span className="font-black text-[10px] uppercase tracking-widest">New Dept</span></button>{displayCategories.map(c => (<div key={c.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col relative group"><div className="h-32 overflow-hidden relative"><img src={c.image} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center px-8 gap-4"><div className="w-12 h-12 bg-slate-800 text-primary rounded-xl flex items-center justify-center shadow-xl flex-shrink-0">{React.createElement((LucideIcons as any)[c.icon] || LucideIcons.Package, { size: 20 })}</div><h4 className="font-bold text-white text-lg truncate">{c.name}</h4></div></div><div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setCatData(c); setEditingId(c.id); setShowCategoryForm(true); }} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md"><Edit2 size={14}/></button><button onClick={() => deleteData('categories', c.id)} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md hover:bg-red-500"><Trash2 size={14}/></button></div></div>))}</div>)}</div>
  );

  const renderPricingTool = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-serif text-white">Pricing Calculator</h2>
            <p className="text-slate-400 text-sm">Simulate your margins and earnings for both affiliate and direct sale products.</p>
        </div>
        <SmartPricingSimulator 
            currency={settings.currency || 'ZAR'} 
            initialState={{ 
                mode: 'merchant',
                taxRate: settings.vatRate || 15 
            }} 
        />
    </div>
  );

  const renderSiteEditor = () => ( <div className="space-y-6 w-full max-w-7xl mx-auto text-left"><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">{[ {id: 'brand', label: 'Identity', icon: Globe, desc: 'Logo, Colors, Slogan', perm: 'site.identity'}, {id: 'nav', label: 'Navigation', icon: MapPin, desc: 'Menu Labels, Footer', perm: 'site.editor'}, {id: 'home', label: 'Home Page', icon: Layout, desc: 'Hero, About, Trust Strip', perm: 'site.editor'}, {id: 'collections', label: 'Collections', icon: ShoppingBag, desc: 'Shop Hero, Search Text', perm: 'site.editor'}, {id: 'about', label: 'About Page', icon: User, desc: 'Story, Values, Gallery', perm: 'site.editor'}, {id: 'contact', label: 'Contact Page', icon: Mail, desc: 'Info, Form, Socials', perm: 'site.editor'}, {id: 'legal', label: 'Legal Text', icon: Shield, desc: 'Privacy, Terms, Disclosure', perm: 'site.legal'}, {id: 'integrations', label: 'Integrations', icon: LinkIcon, desc: 'EmailJS, Tracking, Commerce', perm: 'site.integrations'} ].map(s => { if (!hasPermission(s.perm)) return null; return (<button key={s.id} onClick={() => handleOpenEditor(s.id)} className="bg-slate-900 p-6 md:p-8 rounded-[2rem] text-left border border-slate-800 hover:border-primary/50 transition-all group h-full flex flex-col justify-between"><div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-primary group-hover:text-slate-900 transition-colors shadow-lg"><s.icon size={24}/></div><div><h3 className="text-white font-bold text-xl mb-1">{s.label}</h3><p className="text-slate-500 text-xs">{s.desc}</p></div><div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Edit Section <ArrowRight size={12}/></div></button>)})}</div></div> );

  const renderTeam = () => (<div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto"><div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 text-left"><div className="text-left"><h2 className="text-3xl font-serif text-white">Staffing</h2></div>{hasPermission('team.manage') && <button onClick={() => { setAdminData({ role: 'admin', permissions: [] }); setShowAdminForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest"><Plus size={16}/> New Member</button>}</div>{showAdminForm ? (<div className="bg-slate-900 p-6 md:p-12 rounded-[2rem] border border-slate-800 space-y-12 text-left"><div className="grid md:grid-cols-2 gap-12"><div className="space-y-6"><h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Profile</h3><SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} /><SettingField label="Email" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} /></div><div className="space-y-6 text-left"><h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Privileges</h3><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Role</label><select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={adminData.role} onChange={e => setAdminData({...adminData, role: e.target.value as any, permissions: e.target.value === 'owner' ? ['*'] : []})}><option value="admin">Administrator</option><option value="owner">System Owner</option></select></div><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-6 block">Access Rights</label><PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} /></div></div><div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t border-slate-800"><button onClick={() => setShowAdminForm(false)} className="px-8 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cancel</button><button onClick={handleSaveAdmin} disabled={creatingAdmin} className="px-12 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest">{creatingAdmin ? <Loader2 size={16} className="animate-spin"/> : <ShieldCheck size={18}/>}{editingId ? 'Save' : 'Invite'}</button></div></div>) : (<div className="grid gap-6">{admins.map(a => { const isCurrentUser = user && (a.id === user.id || a.email === user.email); return (<div key={a.id} className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8"><div className="flex flex-col md:flex-row items-center gap-8 w-full min-w-0"><div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-3xl font-bold uppercase">{a.name?.charAt(0)}</div><div className="space-y-2 flex-grow text-center md:text-left min-w-0"><h4 className="text-white text-xl font-bold">{a.name}</h4><div className="text-slate-500 text-sm">{a.email}</div><span className="px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400">{a.role}</span></div></div>{hasPermission('team.manage') && <div className="flex gap-3"><button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="p-4 bg-slate-800 text-slate-400 rounded-2xl hover:text-white"><Edit2 size={20}/></button><button onClick={() => deleteData('admin_users', a.id)} className="p-4 bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl" disabled={isCurrentUser}><Trash2 size={20}/></button></div>}</div>); })}</div>)}</div>);

  const renderGuide = () => (<div className="space-y-12 md:space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 max-w-7xl mx-auto text-left w-full overflow-hidden"><div className="bg-gradient-to-br from-primary/30 to-slate-950 p-8 md:p-24 rounded-[2rem] md:rounded-[4rem] border border-primary/20 relative overflow-hidden shadow-2xl"><Rocket className="absolute -bottom-20 -right-20 text-primary/10 w-48 h-48 md:w-96 md:h-96 rotate-12" /><div className="max-w-3xl relative z-10 text-left"><div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8 border border-primary/30"><Zap size={14}/> Launch Protocol</div><h2 className="text-3xl sm:text-4xl md:text-7xl font-serif text-white mb-4 md:mb-6 leading-none break-words">Architecture <span className="text-primary italic font-light lowercase">Blueprint</span></h2><p className="text-slate-400 text-sm md:text-xl font-light leading-relaxed max-w-full">Complete the following milestones to transition from local prototype to a fully-synced global luxury bridge page.</p></div></div><div className="grid gap-16 md:gap-32 text-left">{GUIDE_STEPS.map((step, idx) => (<div key={step.id} className="relative flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-20"><div className="md:col-span-1 flex flex-row md:flex-col items-center gap-4 md:gap-0"><div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[2rem] bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-primary font-black text-xl md:text-2xl shadow-2xl sticky md:top-32 static shrink-0">{idx + 1}</div></div><div className="md:col-span-7 space-y-6 md:space-y-10 min-w-0 text-left"><div className="space-y-4 text-left"><h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight break-words">{step.title}</h3><p className="text-slate-400 text-sm md:text-lg leading-relaxed">{step.description}</p></div>{step.subSteps && (<div className="grid gap-4 text-left">{step.subSteps.map((sub, i) => (<div key={i} className="flex items-start gap-4 p-4 md:p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 hover:border-primary/30 transition-all group"><CheckCircle size={20} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" /><span className="text-slate-300 text-sm md:text-base leading-relaxed break-words w-full">{sub}</span></div>))}</div>)}{step.code && (<CodeBlock code={step.code} label={step.codeLabel} />)}</div><div className="md:col-span-4 md:sticky md:top-32 h-fit min-w-0 mt-8 md:mt-0"><GuideIllustration id={step.illustrationId} /></div></div>))}</div></div>);

  const ADMIN_TABS = [ { id: 'enquiries', label: 'Inbox', icon: Inbox, perm: 'sales.view' }, { id: 'orders', label: 'Orders', icon: ShoppingBag, perm: 'sales.orders' }, { id: 'analytics', label: 'Insights', icon: BarChart3, perm: 'analytics.view' }, { id: 'subscribers', label: 'Audience', icon: Users, perm: 'sales.view' }, { id: 'catalog', label: 'Items', icon: Tag, perm: 'catalog.view' }, { id: 'hero', label: 'Visuals', icon: LayoutPanelTop, perm: 'content.hero' }, { id: 'categories', label: 'Depts', icon: Layout, perm: 'content.categories' }, { id: 'articles', label: 'Journal', icon: BookOpen, perm: 'content.categories' }, { id: 'site_editor', label: 'Canvas', icon: Palette, perm: 'site.editor' }, { id: 'team', label: 'Maison', icon: Users, perm: 'team.view' }, { id: 'pricing', label: 'Pricing Tool', icon: Calculator, perm: 'catalog.view' }, { id: 'reviews', label: 'Reviews', icon: ThumbsUp, perm: 'catalog.view' }, { id: 'training', label: 'Training', icon: GraduationCap, perm: 'training.view' }, { id: 'system', label: 'System', icon: Activity, perm: 'system.view' }, { id: 'guide', label: 'Pilot', icon: Rocket, perm: 'system.view' } ];
  const visibleTabs = useMemo(() => ADMIN_TABS.filter(t => t.id === 'training' ? true : hasPermission(t.perm)), [myAdminProfile, user]);
  useEffect(() => { const currentTabObj = ADMIN_TABS.find(t => t.id === activeTab); if (currentTabObj && currentTabObj.id !== 'training' && !hasPermission(currentTabObj.perm)) { if (visibleTabs.length > 0) setActiveTab(visibleTabs[0].id); } }, [visibleTabs, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-32 w-full overflow-x-hidden"><style>{` @keyframes grow { from { height: 0; } to { height: 100%; } } @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } } `}</style><SaveIndicator status={saveStatus} />{selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}{replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}<header className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 text-left w-full"><div className="flex flex-col gap-6 text-left"><div className="flex items-center gap-4"><h1 className="text-3xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{isLocalMode ? 'LOCAL MODE' : (isOwner ? 'SYSTEM OWNER' : 'ADMINISTRATOR')}</div></div></div><div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto"><div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-full xl:w-auto">{visibleTabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-grow md:flex-grow-0 px-3 md:px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex flex-col md:flex-row items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}><tab.icon size={14} className="md:w-3 md:h-3" />{tab.label}</button>))}</div><button onClick={handleLogout} className="flex px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-red-500 hover:text-white transition-all w-full md:w-fit justify-center self-start"><LogOut size={14} /> Exit</button></div></header><main className="max-w-7xl mx-auto px-4 md:px-6 pb-20 w-full overflow-x-hidden text-left">{activeTab === 'enquiries' && (hasPermission('sales.view') ? renderEnquiries() : <AccessDenied />)}{activeTab === 'subscribers' && (hasPermission('sales.view') ? renderSubscribers() : <AccessDenied />)}{activeTab === 'orders' && (hasPermission('sales.orders') ? renderOrders() : <AccessDenied />)}{activeTab === 'analytics' && (hasPermission('analytics.view') ? <AnalyticsDashboard trafficEvents={trafficEvents} products={products} stats={stats} orders={orders} categories={categories} admins={admins} user={user} isOwner={isOwner} /> : <AccessDenied />)}{activeTab === 'catalog' && (hasPermission('catalog.view') ? renderCatalog() : <AccessDenied />)}{activeTab === 'hero' && (hasPermission('content.hero') ? renderHero() : <AccessDenied />)}{activeTab === 'categories' && (hasPermission('content.categories') ? renderCategories() : <AccessDenied />)}{activeTab === 'articles' && (hasPermission('content.categories') ? renderArticles() : <AccessDenied />)}{activeTab === 'site_editor' && (hasPermission('site.editor') ? renderSiteEditor() : <AccessDenied />)}{activeTab === 'team' && (hasPermission('team.view') ? renderTeam() : <AccessDenied />)}{activeTab === 'pricing' && (hasPermission('catalog.view') ? renderPricingTool() : <AccessDenied />)}{activeTab === 'reviews' && (hasPermission('catalog.view') ? renderReviews() : <AccessDenied />)}{activeTab === 'training' && <TrainingGrid />}{activeTab === 'system' && (hasPermission('system.view') ? <SystemMonitor connectionHealth={connectionHealth} systemLogs={systemLogs} storageStats={storageStats} generateTestData={handleGenerateTestData} settings={settings} /> : <AccessDenied />)}{activeTab === 'guide' && (hasPermission('system.view') ? renderGuide() : <AccessDenied />)}</main>{editorDrawerOpen && (<div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"><div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-6 md:p-12 text-left shadow-2xl slide-in-from-right duration-300"><div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6"><div><h3 className="text-3xl font-serif text-white mb-2">{activeEditorSection}</h3></div><button onClick={() => setEditorDrawerOpen(false)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800"><X size={24} /></button></div><div className="space-y-8 text-left">{activeEditorSection === 'brand' && (<><div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Core Branding</h4><SettingField label="Company Name" value={tempSettings.companyName} onChange={v => updateTempSettings({ companyName: v })} /><SettingField label="Slogan / Tagline" value={tempSettings.slogan} onChange={v => updateTempSettings({ slogan: v })} /></div><div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Visual Assets</h4><div className="grid grid-cols-2 gap-6"><SettingField label="Logo Text (Fallback)" value={tempSettings.companyLogo} onChange={v => updateTempSettings({ companyLogo: v })} /><SingleImageUploader label="Logo Image (PNG)" value={tempSettings.companyLogoUrl || ''} onChange={v => updateTempSettings({ companyLogoUrl: v })} /></div></div><div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Palette (Hex Codes)</h4><div className="grid grid-cols-3 gap-4"><SettingField label="Primary (Gold)" value={tempSettings.primaryColor} onChange={v => updateTempSettings({ primaryColor: v })} type="color" /><SettingField label="Secondary (Dark)" value={tempSettings.secondaryColor} onChange={v => updateTempSettings({ secondaryColor: v })} type="color" /><SettingField label="Accent" value={tempSettings.accentColor} onChange={v => updateTempSettings({ accentColor: v })} type="color" /></div></div></>)}{activeEditorSection === 'nav' && (<><SettingField label="Home Label" value={tempSettings.navHomeLabel} onChange={v => updateTempSettings({ navHomeLabel: v })} /><SettingField label="Collections Label" value={tempSettings.navProductsLabel} onChange={v => updateTempSettings({ navProductsLabel: v })} /><SettingField label="About Label" value={tempSettings.navAboutLabel} onChange={v => updateTempSettings({ navAboutLabel: v })} /><SettingField label="Contact Label" value={tempSettings.navContactLabel} onChange={v => updateTempSettings({ navContactLabel: v })} /><div className="pt-6 border-t border-slate-800"><SettingField label="Footer Description" value={tempSettings.footerDescription} onChange={v => updateTempSettings({ footerDescription: v })} type="textarea" /><div className="mt-4"><SettingField label="Copyright Text" value={tempSettings.footerCopyrightText} onChange={v => updateTempSettings({ footerCopyrightText: v })} /></div></div></>)}{activeEditorSection === 'home' && (<><SettingField label="Hero Badge Text" value={tempSettings.homeHeroBadge} onChange={v => updateTempSettings({ homeHeroBadge: v })} /><div className="pt-6 border-t border-slate-800 space-y-6"><h4 className="text-white font-bold">About Section</h4><SettingField label="Title" value={tempSettings.homeAboutTitle} onChange={v => updateTempSettings({ homeAboutTitle: v })} /><SettingField label="Description" value={tempSettings.homeAboutDescription} onChange={v => updateTempSettings({ homeAboutDescription: v })} type="textarea" /><SingleImageUploader label="Section Image" value={tempSettings.homeAboutImage} onChange={v => updateTempSettings({ homeAboutImage: v })} /><SettingField label="Button Text" value={tempSettings.homeAboutCta} onChange={v => updateTempSettings({ homeAboutCta: v })} /></div><div className="pt-6 border-t border-slate-800 space-y-6"><h4 className="text-white font-bold">Trust Signals</h4><div className="grid grid-cols-1 gap-4"><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 1 Title" value={tempSettings.homeTrustItem1Title} onChange={v => updateTempSettings({ homeTrustItem1Title: v })} /><SettingField label="Item 1 Desc" value={tempSettings.homeTrustItem1Desc} onChange={v => updateTempSettings({ homeTrustItem1Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem1Icon} onSelect={v => updateTempSettings({ homeTrustItem1Icon: v })} /></div><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 2 Title" value={tempSettings.homeTrustItem2Title} onChange={v => updateTempSettings({ homeTrustItem2Title: v })} /><SettingField label="Item 2 Desc" value={tempSettings.homeTrustItem2Desc} onChange={v => updateTempSettings({ homeTrustItem2Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem2Icon} onSelect={v => updateTempSettings({ homeTrustItem2Icon: v })} /></div><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 3 Title" value={tempSettings.homeTrustItem3Title} onChange={v => updateTempSettings({ homeTrustItem3Title: v })} /><SettingField label="Item 3 Desc" value={tempSettings.homeTrustItem3Desc} onChange={v => updateTempSettings({ homeTrustItem3Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem3Icon} onSelect={v => updateTempSettings({ homeTrustItem3Icon: v })} /></div></div></div></>)}{activeEditorSection === 'collections' && (<><SettingField label="Hero Title" value={tempSettings.productsHeroTitle} onChange={v => updateTempSettings({ productsHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.productsHeroSubtitle} onChange={v => updateTempSettings({ productsHeroSubtitle: v })} type="textarea" /><MultiImageUploader label="Hero Carousel Images" images={tempSettings.productsHeroImages || [tempSettings.productsHeroImage]} onChange={v => updateTempSettings({ productsHeroImages: v, productsHeroImage: v[0] || '' })} /><SettingField label="Search Placeholder" value={tempSettings.productsSearchPlaceholder} onChange={v => updateTempSettings({ productsSearchPlaceholder: v })} /></>)}{activeEditorSection === 'about' && (<><SettingField label="Hero Title" value={tempSettings.aboutHeroTitle} onChange={v => updateTempSettings({ aboutHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.aboutHeroSubtitle} onChange={v => updateTempSettings({ aboutHeroSubtitle: v })} type="textarea" /><SingleImageUploader label="Main Hero Image" value={tempSettings.aboutMainImage} onChange={v => updateTempSettings({ aboutMainImage: v })} /><div className="grid grid-cols-3 gap-4"><SettingField label="Est. Year" value={tempSettings.aboutEstablishedYear} onChange={v => updateTempSettings({ aboutEstablishedYear: v })} /><SettingField label="Founder" value={tempSettings.aboutFounderName} onChange={v => updateTempSettings({ aboutFounderName: v })} /><SettingField label="Location" value={tempSettings.aboutLocation} onChange={v => updateTempSettings({ aboutLocation: v })} /></div><SettingField label="History Title" value={tempSettings.aboutHistoryTitle} onChange={v => updateTempSettings({ aboutHistoryTitle: v })} /><SettingField label="History Body" value={tempSettings.aboutHistoryBody} onChange={v => updateTempSettings({ aboutHistoryBody: v })} type="textarea" rows={8} /><SingleImageUploader label="Founder Signature (Transparent PNG)" value={tempSettings.aboutSignatureImage} onChange={v => updateTempSettings({ aboutSignatureImage: v })} className="h-24 w-full object-contain" /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Values & Gallery</h4><SettingField label="Mission Title" value={tempSettings.aboutMissionTitle} onChange={v => updateTempSettings({ aboutMissionTitle: v })} /><SettingField label="Mission Body" value={tempSettings.aboutMissionBody} onChange={v => updateTempSettings({ aboutMissionBody: v })} type="textarea" /><SettingField label="Community Title" value={tempSettings.aboutCommunityTitle} onChange={v => updateTempSettings({ aboutCommunityTitle: v })} /><SettingField label="Community Body" value={tempSettings.aboutCommunityBody} onChange={v => updateTempSettings({ aboutCommunityBody: v })} type="textarea" /><SettingField label="Integrity Title" value={tempSettings.aboutIntegrityTitle} onChange={v => updateTempSettings({ aboutIntegrityTitle: v })} /><SettingField label="Integrity Body" value={tempSettings.aboutIntegrityBody} onChange={v => updateTempSettings({ aboutIntegrityBody: v })} type="textarea" /><MultiImageUploader label="Gallery Images" images={tempSettings.aboutGalleryImages} onChange={v => updateTempSettings({ aboutGalleryImages: v })} /></>)}{activeEditorSection === 'contact' && (<><SettingField label="Hero Title" value={tempSettings.contactHeroTitle} onChange={v => updateTempSettings({ contactHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.contactHeroSubtitle} onChange={v => updateTempSettings({ contactHeroSubtitle: v })} type="textarea" /><div className="grid grid-cols-2 gap-4"><SettingField label="Email" value={tempSettings.contactEmail} onChange={v => updateTempSettings({ contactEmail: v })} /><SettingField label="Phone" value={tempSettings.contactPhone} onChange={v => updateTempSettings({ contactPhone: v })} /></div><SettingField label="WhatsApp (No Spaces)" value={tempSettings.whatsappNumber} onChange={v => updateTempSettings({ whatsappNumber: v })} /><SettingField label="Physical Address" value={tempSettings.address} onChange={v => updateTempSettings({ address: v })} type="textarea" /><SettingField label="Google My Business URL" value={tempSettings.googleMyBusinessUrl || ''} onChange={v => updateTempSettings({ googleMyBusinessUrl: v })} placeholder="https://g.page/..." /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Form Labels</h4><SettingField label="Button Text" value={tempSettings.contactFormButtonText} onChange={v => updateTempSettings({ contactFormButtonText: v })} /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Social Media</h4><SocialLinksManager links={tempSettings.socialLinks || []} onChange={v => updateTempSettings({ socialLinks: v })} /></>)}{activeEditorSection === 'legal' && (<><div className="space-y-6"><SettingField label="Disclosure Title" value={tempSettings.disclosureTitle} onChange={v => updateTempSettings({ disclosureTitle: v })} /><SettingField label="Disclosure Content (Markdown)" value={tempSettings.disclosureContent} onChange={v => updateTempSettings({ disclosureContent: v })} type="textarea" rows={10} /></div><div className="space-y-6 pt-6 border-t border-slate-800"><SettingField label="Privacy Title" value={tempSettings.privacyTitle} onChange={v => updateTempSettings({ privacyTitle: v })} /><SettingField label="Privacy Content (Markdown)" value={tempSettings.privacyContent} onChange={v => updateTempSettings({ privacyContent: v })} type="textarea" rows={10} /></div><div className="space-y-6 pt-6 border-t border-slate-800"><SettingField label="Terms Title" value={tempSettings.termsTitle} onChange={v => updateTempSettings({ termsTitle: v })} /><SettingField label="Terms Content (Markdown)" value={tempSettings.termsContent} onChange={v => updateTempSettings({ termsContent: v })} type="textarea" rows={10} /></div></>)}{activeEditorSection === 'integrations' && (<><IntegrationGuide /><div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><Mail size={16} /> Email Automation (EmailJS)</h4><div className="space-y-4"><SettingField label="Service ID" value={tempSettings.emailJsServiceId || ''} onChange={v => updateTempSettings({ emailJsServiceId: v })} placeholder="service_..." /><SettingField label="Template ID" value={tempSettings.emailJsTemplateId || ''} onChange={v => updateTempSettings({ emailJsTemplateId: v })} placeholder="template_..." /><SettingField label="Public Key" value={tempSettings.emailJsPublicKey || ''} onChange={v => updateTempSettings({ emailJsPublicKey: v })} placeholder="user_..." /></div></div><div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><ActivityIcon size={16} /> Analytics & Pixels</h4><div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><SettingField label="Google Analytics ID" value={tempSettings.googleAnalyticsId || ''} onChange={v => updateTempSettings({ googleAnalyticsId: v })} placeholder="G-..." /><SettingField label="Facebook Pixel ID" value={tempSettings.facebookPixelId || ''} onChange={v => updateTempSettings({ facebookPixelId: v })} placeholder="123456..." /><SettingField label="TikTok Pixel ID" value={tempSettings.tiktokPixelId || ''} onChange={v => updateTempSettings({ tiktokPixelId: v })} placeholder="C..." /><SettingField label="Pinterest Tag ID" value={tempSettings.pinterestTagId || ''} onChange={v => updateTempSettings({ pinterestTagId: v })} placeholder="26..." /></div></div></div><div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard size={16} /> Commerce & Payments</h4><div className="space-y-4"><div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700"><span className="text-sm text-slate-300 font-bold">Enable Direct Sales</span><div onClick={() => updateTempSettings({ enableDirectSales: !tempSettings.enableDirectSales })} className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${tempSettings.enableDirectSales ? 'bg-primary' : 'bg-slate-700'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-1 ml-1 ${tempSettings.enableDirectSales ? 'translate-x-6' : ''}`}></div></div></div>{tempSettings.enableDirectSales && (<div className="space-y-4 animate-in fade-in slide-in-from-top-2"><SettingField label="Store Currency" value={tempSettings.currency || 'ZAR'} onChange={v => updateTempSettings({ currency: v })} /><div className="grid md:grid-cols-2 gap-4"><div className="p-4 border border-slate-800 rounded-xl bg-slate-950"><h5 className="text-xs font-black uppercase text-blue-400 tracking-widest mb-3 flex items-center gap-2"><CreditCard size={14}/> Yoco (Card)</h5><SettingField label="Public Key" value={tempSettings.yocoPublicKey || ''} onChange={v => updateTempSettings({ yocoPublicKey: v })} placeholder="pk_test_..." /></div><div className="p-4 border border-slate-800 rounded-xl bg-slate-950"><h5 className="text-xs font-black uppercase text-red-400 tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={14}/> PayFast</h5><SettingField label="Merchant ID" value={tempSettings.payfastMerchantId || ''} onChange={v => updateTempSettings({ payfastMerchantId: v })} /><SettingField label="Merchant Key" value={tempSettings.payfastMerchantKey || ''} onChange={v => updateTempSettings({ payfastMerchantKey: v })} /><SettingField label="Passphrase" value={tempSettings.payfastSaltPassphrase || ''} onChange={v => updateTempSettings({ payfastSaltPassphrase: v })} type="password" /></div></div><div className="p-4 border border-slate-800 rounded-xl bg-slate-950"><h5 className="text-xs font-black uppercase text-green-400 tracking-widest mb-3 flex items-center gap-2"><Banknote size={14}/> Manual EFT</h5><SettingField label="Bank Instructions" value={tempSettings.bankDetails || ''} onChange={v => updateTempSettings({ bankDetails: v })} type="textarea" rows={4} placeholder="Bank Name: Capitec..." /></div><div className="p-4 border border-slate-800 rounded-xl bg-slate-950"><h5 className="text-xs font-black uppercase text-amber-400 tracking-widest mb-3 flex items-center gap-2"><Zap size={14}/> Automation</h5><SettingField label="Zapier Webhook URL" value={tempSettings.zapierWebhookUrl || ''} onChange={v => updateTempSettings({ zapierWebhookUrl: v })} placeholder="https://hooks.zapier.com/..." /></div></div>)}</div></div><div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><Banknote size={16} /> Company Financials</h4><div className="grid md:grid-cols-2 gap-4"><div className="col-span-2 flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 mb-4"><span className="text-sm text-slate-300 font-bold">VAT Registered Company</span><div onClick={() => updateTempSettings({ vatRegistered: !tempSettings.vatRegistered })} className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${tempSettings.vatRegistered ? 'bg-primary' : 'bg-slate-700'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-1 ml-1 ${tempSettings.vatRegistered ? 'translate-x-6' : ''}`}></div></div></div>{tempSettings.vatRegistered && (<div className="col-span-2 grid md:grid-cols-2 gap-4 animate-in fade-in"><SettingField label="VAT Rate (%)" value={tempSettings.vatRate?.toString() || '15'} onChange={v => updateTempSettings({ vatRate: parseFloat(v) })} type="number" /><SettingField label="VAT Number" value={tempSettings.vatNumber || ''} onChange={v => updateTempSettings({ vatNumber: v })} /></div>)}<div className="col-span-2 pt-4 border-t border-slate-800 mt-4"><h5 className="text-xs font-black uppercase text-white tracking-widest mb-4 flex items-center gap-2">Banking Details</h5><div className="space-y-4"><SettingField label="Bank Name" value={tempSettings.bankName || ''} onChange={v => updateTempSettings({ bankName: v })} /><div className="grid grid-cols-2 gap-4"><SettingField label="Account Number" value={tempSettings.accountNumber || ''} onChange={v => updateTempSettings({ accountNumber: v })} /><SettingField label="Branch Code" value={tempSettings.branchCode || ''} onChange={v => updateTempSettings({ branchCode: v })} /></div></div></div></div></div></>)}</div><div className="flex gap-4 pt-8 border-t border-slate-800 mt-8 pb-20 md:pb-0"><button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="flex-1 py-4 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all">Publish Changes</button><button onClick={() => setEditorDrawerOpen(false)} className="px-8 py-4 border border-slate-800 text-slate-400 rounded-xl font-bold uppercase text-xs tracking-widest hover:text-white">Cancel</button></div></div></div>)}</div>
  );
};

export default Admin;
