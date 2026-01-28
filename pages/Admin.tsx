
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, 
  Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown,
  Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, 
  BookOpen, FileText, Share2, Tag, ArrowRight, Video, Image, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut,
  Rocket, Terminal, Copy, Check, Database, Github, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash,
  Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin,
  FileBox, Lightbulb, Tablet, Laptop, CheckCircle2, SearchCode, GraduationCap, Pin, MousePointerClick, Puzzle, AtSign, Ghost, Gamepad2, HardDrive, Cpu, XCircle, DollarSign,
  Truck, Printer, Box, UserCheck, Repeat, Coins, Banknote, Power, TrendingDown, PieChart, CornerUpRight
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { EMAIL_TEMPLATE_HTML, GUIDE_STEPS, PERMISSION_TREE, TRAINING_MODULES } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats, Order, OrderItem } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

// --- SUB-COMPONENTS ---

const AdminTip: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-yellow-500/5 border border-yellow-500/20 p-5 md:p-6 rounded-3xl mb-8 flex gap-4 md:gap-5 items-start text-left animate-in fade-in slide-in-from-top-2">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 flex-shrink-0">
      <Lightbulb size={18} className="md:w-5 md:h-5" />
    </div>
    <div className="space-y-1 min-w-0 flex-1">
      <h4 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{title}</h4>
      <div className="text-slate-400 text-xs leading-relaxed font-medium break-words">
        {children}
      </div>
    </div>
  </div>
);

const SaveIndicator: React.FC<{ status: 'idle' | 'saving' | 'saved' | 'error' }> = ({ status }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'saved' || status === 'error') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-24 right-6 z-[100] ${status === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-6 border border-white/20`}>
      <div className="p-2 bg-white/20 rounded-full">
        {status === 'error' ? <AlertOctagon size={24} /> : <CheckCircle2 size={24} />}
      </div>
      <div>
         <h4 className="font-bold text-sm uppercase tracking-widest">{status === 'error' ? 'Connection Error' : 'System Synced'}</h4>
         <p className="text-[10px] opacity-90 font-medium">{status === 'error' ? 'Check cloud configuration.' : 'Changes successfully recorded.'}</p>
      </div>
    </div>
  );
};

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full min-w-0">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={rows} className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input type={type} className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

// --- IMAGE COMPRESSION HELPER ---
const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Pass through non-images (videos) without compression, size check handled by uploader
    if (!file.type.startsWith('image/')) {
       const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = (e) => resolve(e.target?.result as string);
       reader.onerror = (e) => reject(e);
       return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scaleSize = MAX_WIDTH / img.width;
        
        if (scaleSize < 1) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Canvas context failed'));
            return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress to JPEG 0.7
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const SingleImageUploader: React.FC<{ value: string; onChange: (v: string) => void; label: string; accept?: string; className?: string }> = ({ value, onChange, label, accept = "image/*", className = "h-40 w-40" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Compress first
      const compressedDataUrl = await compressImage(file);
      
      // Check Size (~4MB limit for Local Storage safety)
      if (compressedDataUrl.length > 5 * 1024 * 1024) { // ~5MB string length is roughly 3.7MB binary
          alert("File is too large. Please use an image under 4MB.");
          setUploading(false);
          return;
      }

      if (isSupabaseConfigured) {
        // Convert Base64 back to File for upload
        const res = await fetch(compressedDataUrl);
        const blob = await res.blob();
        const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
        
        const url = await uploadMedia(compressedFile, 'media');
        if (url) onChange(url);
      } else {
        onChange(compressedDataUrl);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Ensure Supabase storage is configured or image is valid.");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || accept?.includes('video');

  return (
    <div className="space-y-2 text-left w-full min-w-0">
       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
       <div 
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative ${className} overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-primary/50 transition-all cursor-pointer group rounded-2xl flex-shrink-0 max-w-full`}
       >
          {uploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-primary bg-slate-900 z-10 p-2 text-center">
               <Loader2 size={24} className="animate-spin mb-2" />
               <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                 <div className="bg-primary h-full animate-[grow_2s_infinite]"></div>
               </div>
            </div>
          ) : value ? (
            <>
              {isVideo ? (
                 <video src={value} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" autoPlay muted loop playsInline />
              ) : (
                 <img src={value} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" alt="preview" />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-xs font-bold">
                   <Edit2 size={16}/>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
               <Image size={24} className="mb-2 opacity-50" />
               <span className="text-[8px] font-black uppercase tracking-widest text-center px-2">Upload</span>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            accept={accept}
            onChange={handleUpload}
            disabled={uploading}
          />
       </div>
    </div>
  );
};

const MultiImageUploader: React.FC<{ images: string[]; onChange: (images: string[]) => void; label: string }> = ({ images = [], onChange, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const processFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setUploading(true);
    
    const newUrls: string[] = [];
    
    try {
      for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i];
        
        const compressedDataUrl = await compressImage(file);
        
        if (compressedDataUrl.length > 5 * 1024 * 1024) {
            alert(`Skipped ${file.name}: Too large (>4MB)`);
            continue;
        }

        if (isSupabaseConfigured) {
          const res = await fetch(compressedDataUrl);
          const blob = await res.blob();
          const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          const url = await uploadMedia(compressedFile, 'media');
          if (url) newUrls.push(url);
        } else {
           newUrls.push(compressedDataUrl);
        }
      }
      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4 text-left w-full min-w-0">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {/* Upload Button */}
        <div onClick={() => !uploading && fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 group">
          {uploading ? (
             <Loader2 size={24} className="animate-spin text-primary" />
          ) : (
             <Plus className="text-slate-400 group-hover:text-white" size={24} />
          )}
          <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={e => processFiles(e.target.files)} />
        </div>

        {images.map((url, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900">
              <img src={url} className="w-full h-full object-cover" alt="preview" />
              <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
            </div>
        ))}
      </div>
    </div>
  );
};

const SocialLinksManager: React.FC<{ links: SocialLink[]; onChange: (links: SocialLink[]) => void }> = ({ links, onChange }) => {
  const handleAdd = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      name: 'New Platform',
      url: 'https://',
      iconUrl: ''
    };
    onChange([...links, newLink]);
  };

  const handleUpdate = (id: string, field: keyof SocialLink, value: string) => {
    const updated = links.map(link => link.id === id ? { ...link, [field]: value } : link);
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    onChange(links.filter(link => link.id !== id));
  };

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Social Profiles</label>
        <button onClick={handleAdd} className="text-[10px] font-black uppercase text-primary hover:text-white flex items-center gap-1">
          <Plus size={12}/> Add
        </button>
      </div>
      
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-start">
             {/* Icon Uploader */}
             <div className="flex-shrink-0">
                <SingleImageUploader 
                  label="" 
                  value={link.iconUrl} 
                  onChange={v => handleUpdate(link.id, 'iconUrl', v)}
                  className="w-12 h-12 rounded-xl"
                />
             </div>
             
             {/* Fields */}
             <div className="flex-grow grid grid-cols-2 gap-3 w-full">
                <input 
                  type="text" 
                  value={link.name} 
                  onChange={e => handleUpdate(link.id, 'name', e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-primary"
                  placeholder="Platform Name"
                />
                <input 
                  type="text" 
                  value={link.url} 
                  onChange={e => handleUpdate(link.id, 'url', e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-primary"
                  placeholder="Profile URL"
                />
             </div>

             <button onClick={() => handleRemove(link.id)} className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-colors">
               <Trash2 size={16} />
             </button>
          </div>
        ))}
        {links.length === 0 && (
          <div className="text-center p-6 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
             No social profiles added.
          </div>
        )}
      </div>
    </div>
  );
};

const GuideIllustration: React.FC<{ id?: string }> = ({ id }) => {
  switch (id) {
    case 'forge':
      return (<div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden min-w-0"><div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--primary-color),transparent_70%)]" /><div className="relative z-10 flex flex-col items-center"><div className="flex gap-4 mb-8"><div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl rotate-[-12deg]"><FileCode size={32} /></div><div className="w-16 h-16 bg-primary text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl rotate-[12deg]"><Terminal size={32} /></div></div><div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary w-2/3 animate-[shimmer_2s_infinite]" /></div></div></div>);
    default:
      return (<div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center min-w-0"><Rocket className="text-slate-800 w-24 h-24" /></div>);
  }
};

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (perms: string[]) => void; role: 'owner' | 'admin'; }> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access by default.</div>;
  const togglePermission = (id: string) => { if (permissions.includes(id)) { onChange(permissions.filter(p => p !== id)); } else { onChange([...permissions, id]); } };
  const toggleGroup = (node: PermissionNode) => { const childIds = node.children?.map(c => c.id) || []; const allSelected = childIds.every(id => permissions.includes(id)); if (allSelected) { onChange(permissions.filter(p => !childIds.includes(p))); } else { const newPerms = [...permissions]; childIds.forEach(id => { if (!newPerms.includes(id)) newPerms.push(id); }); onChange(newPerms); } };
  return (
    <div className="space-y-6">{PERMISSION_TREE.map(group => { const childIds = group.children?.map(c => c.id) || []; const isAllSelected = childIds.every(id => permissions.includes(id)); return (<div key={group.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left"><div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3"><div className="flex flex-col"><span className="text-white font-bold text-sm">{group.label}</span><span className="text-slate-500 text-[10px]">{group.description}</span></div><button onClick={() => toggleGroup(group)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">{isAllSelected ? 'Deselect All' : 'Select All'}</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{group.children?.map(perm => { const isSelected = permissions.includes(perm.id); return (<button key={perm.id} onClick={() => togglePermission(perm.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>{isSelected ? <CheckSquare size={16} className="text-primary flex-shrink-0" /> : <Square size={16} className="flex-shrink-0" />}<span className="text-xs font-medium">{perm.label}</span></button>); })}</div></div>); })}</div>
  );
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const [search, setSearch] = useState(''); const [isOpen, setIsOpen] = useState(false); const [limit, setLimit] = useState(100);
  const CUSTOM_KEYS = Object.keys(CustomIcons); const LUCIDE_KEYS = Object.keys(LucideIcons).filter(key => { const val = (LucideIcons as any)[key]; return /^[A-Z]/.test(key) && typeof val === 'function' && !key.includes('Icon') && !key.includes('Context'); });
  const ALL_ICONS = [...CUSTOM_KEYS, ...LUCIDE_KEYS]; const filtered = search ? ALL_ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase())) : ALL_ICONS; const displayed = filtered.slice(0, limit); const SelectedIconComponent = CustomIcons[selected] || (LucideIcons as any)[selected] || LucideIcons.Package;
  return (<div className="relative text-left w-full"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"><div className="flex items-center gap-3"><SelectedIconComponent size={18} /><span className="text-xs font-bold">{selected}</span></div><ChevronDown size={14} /></button>{isOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"><div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800"><div><h3 className="text-white font-bold text-lg flex items-center gap-2"><Grid size={18} className="text-primary"/> Icon Library</h3><p className="text-slate-400 text-xs mt-1">Select from {filtered.length} curated icons</p></div><button onClick={() => setIsOpen(false)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors"><X size={20}/></button></div><div className="p-4 bg-slate-900 border-b border-slate-800"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none text-white focus:border-primary transition-all" placeholder="Search icons..." value={search} onChange={e => { setSearch(e.target.value); setLimit(100); }} autoFocus /></div></div><div className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-slate-950"><div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">{displayed.map(name => { const IconComp = CustomIcons[name] || (LucideIcons as any)[name]; if (!IconComp) return null; return (<button key={name} onClick={() => { onSelect(name); setIsOpen(false); }} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all border ${selected === name ? 'bg-primary text-slate-900 border-primary shadow-lg scale-105' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}><IconComp size={24} /><span className="text-[9px] font-medium truncate w-full px-2 text-center opacity-70">{name}</span></button>) })}</div>{displayed.length < filtered.length && (<button onClick={() => setLimit(prev => prev + 100)} className="w-full mt-6 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-colors">Load More</button>)}</div></div></div>)}</div>);
};

const EmailReplyModal: React.FC<{ enquiry: Enquiry; onClose: () => void }> = ({ enquiry, onClose }) => {
  const { settings } = useSettings();
  const [subject, setSubject] = useState(`Re: ${enquiry.subject}`);
  const [message, setMessage] = useState(`Dear ${enquiry.name},\n\nThank you for contacting ${settings.companyName}.\n\n[Your response here]\n\nBest regards,\n${settings.companyName}\n${settings.address}\n${settings.contactEmail}`);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false); const [success, setSuccess] = useState(false); const [error, setError] = useState<string | null>(null);
  const handleSend = async () => { const serviceId = settings.emailJsServiceId?.trim(); const templateId = settings.emailJsTemplateId?.trim(); const publicKey = settings.emailJsPublicKey?.trim(); if (!serviceId || !templateId || !publicKey) { setError("Email.js is not configured."); return; } setSending(true); setError(null); try { const fileLinks: string[] = []; if (attachments.length > 0) { if (!isSupabaseConfigured) throw new Error("Supabase is required for attachments."); for (const file of attachments) { const url = await uploadMedia(file, 'media'); if (url) fileLinks.push(`${file.name}: ${url}`); } } let finalMessage = message.replace(/\n/g, '<br>'); if (fileLinks.length > 0) finalMessage += `<br><br><strong>Attachments:</strong><br>${fileLinks.map(l => `<a href="${l.split(': ')[1]}">${l.split(': ')[0]}</a>`).join('<br>')}`; let logoUrl = settings.companyLogoUrl || ''; const productsHtml = ''; const socialsHtml = ''; const templateParams = { to_name: enquiry.name, to_email: enquiry.email, subject, message: finalMessage, reply_to: enquiry.email, company_name: settings.companyName, company_address: settings.address, company_website: window.location.origin, company_logo_url: logoUrl, products_html: productsHtml, socials_html: socialsHtml, year: new Date().getFullYear().toString() }; await emailjs.send(serviceId, templateId, templateParams, publicKey); setSuccess(true); setTimeout(onClose, 2000); } catch (err: any) { console.error('EmailJS Error:', err); setError(err.text || err.message); } finally { setSending(false); } };
  if (success) return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"><div className="bg-white rounded-3xl p-10 text-center animate-in zoom-in"><div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4"><CheckCircle size={40} /></div><h3 className="text-2xl font-bold text-slate-900">Email Sent!</h3></div></div>);
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"><div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"><div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-3"><Reply size={20} className="text-primary"/> Reply to {enquiry.name}</h3><button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24}/></button></div><div className="p-6 overflow-y-auto space-y-6 text-left">{error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}<div className="space-y-4"><div className="grid grid-cols-2 gap-4"><SettingField label="To" value={enquiry.email} onChange={() => {}} type="text" /><SettingField label="Subject" value={subject} onChange={setSubject} /></div><SettingField label="Message (HTML Support Enabled)" value={message} onChange={setMessage} type="textarea" rows={12} /><div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Paperclip size={12}/> Attachments (Requires Storage)</label><input type="file" multiple onChange={e => e.target.files && setAttachments(Array.from(e.target.files))} className="block w-full text-xs text-slate-400 file:bg-slate-800 file:text-primary file:rounded-full file:border-0 file:py-2 file:px-4" /></div></div></div><div className="p-6 border-t border-slate-800 flex justify-end gap-3"><button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest">Cancel</button><button onClick={handleSend} disabled={sending} className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">{sending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>} Send Email</button></div></div></div>);
};

const PLATFORMS = [ { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C', maxLength: 2200, hashTags: true }, { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', maxLength: 63206, hashTags: false }, { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#1DA1F2', maxLength: 280, hashTags: true }, { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', maxLength: 3000, hashTags: true }, { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366', maxLength: 1000, hashTags: false } ];
const AdGeneratorModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { settings } = useSettings(); const [copied, setCopied] = useState(false); const [platform, setPlatform] = useState(PLATFORMS[0]); const [customText, setCustomText] = useState('');
  useEffect(() => { 
    const baseText = `Check out the ${product.name} from ${settings.companyName}.`; 
    const price = `Price: R ${product.price}`; 
    const link = `${window.location.origin}/#/product/${product.id}`; 
    const features = product.features ? product.features.slice(0, 3).map(f => `• ${f}`).join('\n') : ''; 
    const discount = product.discountRules?.[0];
    const discountText = discount ? (discount.type === 'percentage' ? `🔥 ${discount.value}% OFF` : `🔥 R${discount.value} OFF`) : '';

    let generated = ''; 
    switch(platform.id) { 
        case 'instagram': 
            generated = `✨ NEW DROP: ${product.name} ✨\n\n${product.description.substring(0, 100)}...\n\n💎 ${price}\n${discountText ? `${discountText}\n` : ''}\n${features}\n\n👇 SHOP NOW\nLink in bio / story!\n\n#${settings.companyName.replace(/\s/g, '')} #LuxuryFashion`; 
            break; 
        default: 
            generated = `${product.name} is now available.\n\n${product.description.substring(0, 200)}...\n\n${discountText ? `${discountText}\n` : ''}${features}\n\nShop securely here: ${link}`; 
    } 
    setCustomText(generated); 
  }, [platform, product, settings]);
  const handleCopy = () => { navigator.clipboard.writeText(customText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  
  const handleShareBundle = async () => {
    if (!navigator.share) {
      alert("Sharing not supported on this device/browser. Please copy text and save image manually.");
      return;
    }
    try {
      const link = `${window.location.origin}/#/product/${product.id}`;
      const shareData: any = { title: settings.companyName, text: customText, url: link };
      if (product.media?.[0]?.url) {
        try {
          const response = await fetch(product.media[0].url);
          const blob = await response.blob();
          const file = new File([blob], `${product.name.replace(/\s/g, '_')}.jpg`, { type: blob.type });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
             shareData.files = [file];
          }
        } catch (e) { console.warn("Could not bundle image for share", e); }
      }
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing', error);
      alert("Device sharing failed. Please use 'Save Image' and 'Copy Text' manually.");
    }
  };

  return (<div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-slate-950 animate-in fade-in duration-300"><div className="w-full md:w-1/2 bg-black/40 border-r border-slate-800 flex flex-col h-full relative"><div className="p-8 flex justify-between items-center border-b border-slate-800"><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Content Preview</span><button onClick={onClose} className="md:hidden p-2 text-slate-500"><X size={24} /></button></div><div className="flex-grow flex items-center justify-center p-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"><div className="w-[320px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden relative"><div className="bg-slate-100 h-6 w-full absolute top-0 left-0 z-20 flex justify-center"><div className="w-20 h-4 bg-slate-900 rounded-b-xl"></div></div><div className="mt-8 px-4 pb-2 flex items-center gap-2 border-b border-slate-100"><div className="w-8 h-8 rounded-full bg-slate-200"></div><span className="text-xs font-bold text-slate-900">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span><platform.icon size={14} style={{ color: platform.color }} className="ml-auto"/></div><div className="aspect-square bg-slate-100 relative text-left"><img src={product.media[0]?.url} className="w-full h-full object-cover" /></div><div className="p-4 text-left"><p className="text-[10px] text-slate-800 whitespace-pre-wrap leading-relaxed"><span className="font-bold mr-1">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>{customText}</p></div></div></div></div><div className="w-full md:w-1/2 bg-slate-950 flex flex-col h-full relative p-8 md:p-12 overflow-y-auto text-left"><button onClick={onClose} className="hidden md:block absolute top-10 right-10 p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white"><X size={24} /></button><div className="max-w-xl mx-auto space-y-8 w-full"><div><h3 className="text-3xl font-serif text-white mb-2">Social <span className="text-primary italic">Manager</span></h3><p className="text-slate-500 text-sm">Generate optimized assets.</p></div><div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">{PLATFORMS.map(p => (<button key={p.id} onClick={() => setPlatform(p)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all min-w-[100px] ${platform.id === p.id ? 'bg-slate-800 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'}`}><p.icon size={24} style={{ color: platform.id === p.id ? '#fff' : p.color }} /><span className="text-[10px] font-bold uppercase">{p.name}</span></button>))}</div><div className="space-y-2"><div className="flex justify-between"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Caption</label><span className={`text-[10px] font-bold ${customText.length > platform.maxLength ? 'text-red-500' : 'text-slate-600'}`}>{customText.length} / {platform.maxLength}</span></div><textarea rows={10} value={customText} onChange={e => setCustomText(e.target.value)} className="w-full p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm leading-relaxed outline-none focus:border-primary resize-none font-sans"/></div><div className="grid grid-cols-2 gap-4"><button onClick={handleCopy} className="col-span-2 py-4 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-white flex items-center justify-center gap-2 border border-dashed border-slate-600">{copied ? <Check size={16}/> : <Copy size={16}/>} 1. Copy Caption First</button><button onClick={handleShareBundle} className="col-span-2 py-4 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"><Share2 size={16}/> 2. Share Bundle (Img + Text)</button><div className="col-span-2 text-center text-slate-600 text-[9px] uppercase font-bold tracking-widest mt-2">Note: Many apps discard captions when sharing files. Copy text first.</div></div></div></div></div>);
};

const CodeBlock: React.FC<{ code: string; language?: string; label?: string }> = ({ code, language = 'bash', label }) => {
  const [copied, setCopied] = useState(false); const copyToClipboard = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (<div className="relative group mb-6 text-left max-w-full overflow-hidden w-full min-w-0">{label && <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2"><Terminal size={12}/>{label}</div>}<div className="absolute top-8 right-4 z-10"><button onClick={copyToClipboard} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/5">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div><pre className="p-6 bg-black rounded-2xl text-[10px] md:text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800 leading-relaxed custom-scrollbar shadow-inner w-full max-w-full"><code>{code}</code></pre></div>);
};

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string; accept?: string; }> = ({ files, onFilesChange, multiple = true, label = "media", accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const processFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setUploading(true);
    
    const newFiles: MediaFile[] = [];

    for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i];
        try {
            const compressedDataUrl = await compressImage(file);
            
            if (compressedDataUrl.length > 5 * 1024 * 1024) {
                alert(`Skipped ${file.name}: Too large (>4MB)`);
                continue;
            }

            let result = compressedDataUrl;

            if (isSupabaseConfigured) {
               const res = await fetch(compressedDataUrl);
               const blob = await res.blob();
               const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
               try {
                 const publicUrl = await uploadMedia(compressedFile, 'media');
                 if (publicUrl) result = publicUrl;
               } catch (err) { console.error("Upload failed", err); }
            }
            
            newFiles.push({ 
              id: Math.random().toString(36).substr(2, 9), 
              url: result, 
              name: file.name, 
              type: file.type.startsWith('image/') ? 'image/jpeg' : file.type, // Compression converts to jpeg
              size: file.size // Approximate
            });
        } catch (e) {
            console.error("Processing failed", e);
        }
    }
    
    onFilesChange(multiple ? [...files, ...newFiles] : newFiles);
    setUploading(false);
  };
  return (
    <div className="space-y-4 text-left w-full min-w-0">
      <div onClick={() => !uploading && fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 group min-h-[100px]">
        {uploading ? (
           <div className="flex flex-col items-center">
             <Loader2 size={24} className="animate-spin text-primary mb-2" />
             <div className="w-24 bg-slate-700 h-1 rounded-full overflow-hidden"><div className="bg-primary h-full animate-[grow_2s_infinite]"></div></div>
             <span className="text-[9px] mt-2 uppercase font-black text-slate-500">Processing...</span>
           </div>
        ) : (
           <>
            <Upload className="text-slate-400 group-hover:text-white mb-2" size={20} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Add {label}</p>
           </>
        )}
        <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={e => processFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 animate-in fade-in slide-in-from-bottom-2">
          {files.map(f => (
            <div key={f.id} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900">
              {f.type.startsWith('video') ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-500"><Video size={20}/><span className="text-[8px] mt-1 uppercase font-bold">Video</span></div>
              ) : (
                 <img src={f.url} className="w-full h-full object-cover" alt="preview" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => onFilesChange(files.filter(x => x.id !== f.id))} className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const IntegrationGuide: React.FC = () => (
  <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 mb-8 text-left">
     <h4 className="text-primary font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
       <Lightbulb size={16}/> Integration Setup Guide
     </h4>
     <div className="space-y-4 text-xs text-slate-400">
        <details className="group">
          <summary className="cursor-pointer font-bold text-white mb-2 list-none flex items-center gap-2 group-open:text-primary transition-colors">
            <Mail size={14} /> EmailJS (Forms)
          </summary>
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2">
            <p>1. Sign up at <a href="https://www.emailjs.com" target="_blank" className="text-white underline">EmailJS.com</a>.</p>
            <p>2. Create a new "Email Service" (e.g., Gmail) to get your <strong>Service ID</strong>.</p>
            <p>3. Create an "Email Template". Use variables like <code>{`{{name}}`}</code>, <code>{`{{message}}`}</code>. Get your <strong>Template ID</strong>.</p>
            <p>4. Go to Account &gt; API Keys to copy your <strong>Public Key</strong>.</p>
          </div>
        </details>
     </div>
  </div>
);

// --- VISUAL CHARTS & DIAGRAMS ---

const SimpleLineChart = ({ data, color, height = 120 }: { data: number[], color: string, height?: number }) => {
  if (!data || data.length < 2) return <div className="h-full flex items-center justify-center text-xs text-slate-600 font-medium">Insufficient Data</div>;
  
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 80 - 10; // buffer 10%
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full relative overflow-hidden" style={{ height: `${height}px` }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeWidth="0.1" strokeDasharray="2 2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.1" strokeDasharray="2 2" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="#334155" strokeWidth="0.1" strokeDasharray="2 2" />

            {/* Gradient Fill */}
            <defs>
               <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
               </linearGradient>
            </defs>
            <path 
                d={`M0,100 L0,${100 - ((data[0]-min)/range)*80-10} ${points.split(' ').map(p => 'L'+p).join(' ')} L100,100 Z`} 
                fill={`url(#grad-${color})`} 
                stroke="none"
            />
            {/* Line */}
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                points={points}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
  );
};

const SimpleBarChart = ({ data, color, showLabels = true }: { data: { label: string, value: number }[], color: string, showLabels?: boolean }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    
    return (
        <div className="flex items-end justify-between gap-2 h-full w-full">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                    <div 
                        className="w-full rounded-t-sm transition-all duration-500 hover:opacity-80 min-h-[4px]" 
                        style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-bold">
                            {d.value}
                        </div>
                    </div>
                    {showLabels && <span className="text-[8px] text-slate-500 mt-2 truncate w-full text-center font-medium uppercase tracking-wider">{d.label}</span>}
                </div>
            ))}
        </div>
    );
}

const HorizontalBarChart = ({ data, color }: { data: { label: string, value: number }[], color: string }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="space-y-4 w-full">
            {data.map((d, i) => (
                <div key={i} className="w-full group">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-medium">
                        <span>{d.label}</span>
                        <span className="font-bold text-slate-300">{d.value}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125" 
                            style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

const SimpleDonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
    let accumulated = 0;
    
    return (
       <div className="relative w-32 h-32 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
             {data.map((d, i) => {
                const percent = d.value / total;
                const dashArray = `${percent * 283} 283`; // 2 * pi * 45 ≈ 283
                const dashOffset = -accumulated * 283;
                accumulated += percent;
                
                return (
                   <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={d.color}
                      strokeWidth="10"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-500 hover:stroke-[12px]"
                   />
                );
             })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-xl font-bold text-white">{total > 999 ? '1k+' : total}</span>
             <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Hits</span>
          </div>
       </div>
    );
};

const AnalyticsDashboard: React.FC<{ trafficEvents: any[]; products: Product[]; stats: ProductStats[]; orders: Order[]; categories: Category[] }> = ({ trafficEvents, products, stats, orders, categories }) => {
  // --- Data Aggregation Logic ---
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = activeOrders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const totalVisits = Math.max(trafficEvents.length, 1);
  const conversionRate = totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const [matrixView, setMatrixView] = useState<'products' | 'categories'>('products');

  // Timeline Data (Last 7 Days)
  const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  // Hourly Traffic Breakdown
  const hourlyTraffic = useMemo(() => {
    const hours = Array(24).fill(0);
    trafficEvents.forEach(e => {
      const h = new Date(e.timestamp).getHours();
      if (h >= 0 && h < 24) hours[h]++;
    });
    // Convert to format for chart
    return hours.map((count, hour) => ({
      label: `${hour.toString().padStart(2, '0')}:00`,
      value: count
    }));
  }, [trafficEvents]);

  // Find Peak Hour
  const peakHour = useMemo(() => {
     const max = Math.max(...hourlyTraffic.map(h => h.value));
     const hour = hourlyTraffic.find(h => h.value === max);
     return { time: hour?.label || '00:00', count: max };
  }, [hourlyTraffic]);

  // Simulated trend data based on real (aggregated) counts
  const getTimelineData = (sourceArr: any[], dateField: string) => {
      const counts = Array(7).fill(0);
      const now = new Date();
      sourceArr.forEach(item => {
          const d = new Date(item[dateField]);
          const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));
          if (diffDays < 7 && diffDays >= 0) {
              counts[6 - diffDays]++;
          }
      });
      return counts;
  };

  const trafficTrend = getTimelineData(trafficEvents, 'timestamp');
  const orderTrend = getTimelineData(activeOrders, 'createdAt');
  
  // Device Distribution
  const devices = trafficEvents.reduce((acc: any, curr) => {
      const d = curr.device || 'Desktop';
      acc[d] = (acc[d] || 0) + 1;
      return acc;
  }, {});
  const deviceData = [
      { label: 'Mobile', value: devices['Mobile'] || 0, color: '#ec4899' }, // Pink
      { label: 'Desktop', value: devices['Desktop'] || 0, color: '#3b82f6' }, // Blue
      { label: 'Tablet', value: devices['Tablet'] || 0, color: '#a855f7' } // Purple
  ].filter(d => d.value > 0);

  // Top Products
  const topProducts = stats
      .sort((a,b) => b.views - a.views)
      .slice(0, 5)
      .map(s => ({
          label: products.find(p => p.id === s.productId)?.name || 'Unknown',
          value: s.views
      }));

  // Top Sources
  const sources = trafficEvents.reduce((acc: any, curr) => {
      const s = curr.source || 'Direct';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
  }, {});
  const sourceData = Object.entries(sources)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 5)
      .map(([label, value]) => ({ label, value: value as number }));

  const metrics = [
    { label: 'Net Revenue', value: `R ${totalRevenue.toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Orders', value: totalOrders, change: '+5%', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Site Visits', value: totalVisits.toLocaleString(), change: '+24%', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Conversion', value: `${conversionRate.toFixed(2)}%`, change: '-1%', icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10', negative: true },
  ];

  // --- MATRIX DATA PREP ---
  const productMatrix = useMemo(() => {
    return products.map(p => {
        const stat = stats.find(s => s.productId === p.id) || { productId: p.id, views: 0, clicks: 0, shares: 0, totalViewTime: 0, lastUpdated: 0 };
        const ctr = stat.views > 0 ? (stat.clicks / stat.views) * 100 : 0;
        return { ...p, stats: stat, ctr };
    }).sort((a, b) => b.stats.views - a.stats.views);
  }, [products, stats]);

  const maxProductViews = Math.max(...productMatrix.map(p => p.stats.views), 1);
  const maxProductClicks = Math.max(...productMatrix.map(p => p.stats.clicks), 1);

  const categoryMatrix = useMemo(() => {
    return categories.map(cat => {
        const catProducts = products.filter(p => p.categoryId === cat.id);
        const catStats = catProducts.reduce((acc, p) => {
            const stat = stats.find(s => s.productId === p.id);
            if (stat) {
                acc.views += stat.views;
                acc.clicks += stat.clicks;
            }
            return acc;
        }, { views: 0, clicks: 0 });
        
        return {
            ...cat,
            stats: catStats,
            productCount: catProducts.length
        };
    }).sort((a, b) => b.stats.views - a.stats.views);
  }, [categories, products, stats]);

  const maxCatViews = Math.max(...categoryMatrix.map(c => c.stats.views), 1);
  const maxCatClicks = Math.max(...categoryMatrix.map(c => c.stats.clicks), 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div className="space-y-2">
            <h2 className="text-3xl font-serif text-white">Intelligence Center</h2>
            <p className="text-slate-400 text-sm">Real-time telemetry and performance analytics.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs font-bold hover:text-white transition-colors">Last 7 Days</button>
            <button onClick={() => window.location.reload()} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white"><RefreshCcw size={16}/></button>
         </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {metrics.map((m, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg">
               <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                     <m.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${m.negative ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                     {m.negative ? <TrendingDown size={12}/> : <TrendingUp size={12}/>} {m.change}
                  </div>
               </div>
               <div>
                  <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight">{m.value}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{m.label}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
          
          {/* MAIN CHART */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                  <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><Activity size={18} className="text-primary"/> Performance Timeline</h3>
                      <p className="text-xs text-slate-500 mt-1">Traffic vs Sales volume over the last week.</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Traffic</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Orders</div>
                  </div>
              </div>
              
              <div className="h-64 w-full relative">
                  {/* Layered Charts */}
                  <div className="absolute inset-0 opacity-100"><SimpleLineChart data={trafficTrend} color="#3b82f6" height={250} /></div>
                  <div className="absolute inset-0 opacity-70"><SimpleLineChart data={orderTrend} color="#22c55e" height={250} /></div>
              </div>
              
              <div className="flex justify-between mt-4 text-[10px] font-mono text-slate-500 uppercase">
                  {days.map(d => <span key={d}>{d}</span>)}
              </div>
          </div>

          {/* DEVICE BREAKDOWN */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Smartphone size={18} className="text-pink-500"/> Device Access</h3>
              <p className="text-xs text-slate-500 mb-8">Platform distribution of your visitors.</p>
              
              <div className="flex-grow flex items-center justify-center">
                  <SimpleDonutChart data={deviceData} />
              </div>

              <div className="mt-8 space-y-3">
                  {deviceData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                              <span className="text-slate-300 font-medium">{d.label}</span>
                          </div>
                          <span className="text-slate-500 font-mono">{d.value}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* NEW: HOURLY TRAFFIC CHART */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <Clock size={18} className="text-orange-500"/> Peak Activity Times
                  </h3>
                  <p className="text-xs text-slate-500">Distribution of visits by hour of the day.</p>
              </div>
              <div className="px-4 py-2 bg-orange-500/10 rounded-xl border border-orange-500/20 text-right">
                  <span className="block text-[9px] font-black uppercase tracking-widest text-orange-500">Peak Hour</span>
                  <span className="text-lg font-bold text-white">{peakHour.time}</span>
              </div>
          </div>
          <div className="h-48 w-full">
              <SimpleBarChart data={hourlyTraffic} color="#f97316" showLabels={false} />
          </div>
          <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-600">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
          </div>
      </div>

      {/* GRANULAR PERFORMANCE MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <LayoutGrid size={18} className="text-primary"/> Granular Performance Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Detailed breakdown of asset efficiency.</p>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button onClick={() => setMatrixView('products')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${matrixView === 'products' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>Products</button>
                  <button onClick={() => setMatrixView('categories')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${matrixView === 'categories' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>Categories</button>
              </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <th className="pb-4 pl-4">{matrixView === 'products' ? 'Item' : 'Department'}</th>
                          <th className="pb-4 w-48">Engagement (Views)</th>
                          <th className="pb-4 w-48">Conversion (Clicks)</th>
                          {matrixView === 'products' && <th className="pb-4 text-right pr-4">Efficiency (CTR)</th>}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {matrixView === 'products' ? (
                        // Product Rows
                        productMatrix.map(item => (
                            <tr key={item.id} className="group hover:bg-slate-800/20 transition-colors">
                                <td className="py-3 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                                            <img src={item.media?.[0]?.url} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white line-clamp-1 max-w-[150px]">{item.name}</div>
                                            <div className="text-[10px] text-slate-500 font-mono">R {item.price}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>{item.stats.views}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${(item.stats.views / maxProductViews) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between text-[10px] text-slate-400">
                                            <span>{item.stats.clicks}</span>
                                            <span className="flex items-center gap-1 text-[9px]"><Share2 size={8}/> {item.stats.shares}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500" style={{ width: `${(item.stats.clicks / maxProductClicks) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 pr-4 text-right">
                                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold border ${
                                        item.ctr > 5 ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        item.ctr > 2 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        'bg-slate-800 text-slate-500 border-slate-700'
                                    }`}>
                                        {item.ctr.toFixed(1)}%
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Category Rows
                        categoryMatrix.map(cat => {
                            const Icon = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LayoutGrid;
                            return (
                                <tr key={cat.id} className="group hover:bg-slate-800/20 transition-colors">
                                    <td className="py-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{cat.name}</div>
                                                <div className="text-[10px] text-slate-500">{cat.productCount} Items</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-[10px] text-slate-400">
                                                <span>{cat.stats.views}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${(cat.stats.views / maxCatViews) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-[10px] text-slate-400">
                                                <span>{cat.stats.clicks}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500" style={{ width: `${(cat.stats.clicks / maxCatClicks) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                  </tbody>
              </table>
          </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          
          {/* TOP PRODUCTS */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Star size={18} className="text-yellow-500"/> Product Interest</h3>
              <p className="text-xs text-slate-500 mb-6">Top performing items by unique page views.</p>
              <HorizontalBarChart data={topProducts} color="#eab308" />
          </div>

          {/* TRAFFIC SOURCES */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Globe size={18} className="text-cyan-500"/> Acquisition Channels</h3>
              <p className="text-xs text-slate-500 mb-6">Where your visitors are coming from.</p>
              <div className="h-48">
                  <SimpleBarChart data={sourceData} color="#06b6d4" />
              </div>
          </div>

      </div>

      {/* GEO MAP SIMULATION */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><MapPin size={18} className="text-red-500"/> Geographic Reach</h3>
                  <p className="text-xs text-slate-500 mb-6">Top cities interacting with your bridge page.</p>
                  
                  <div className="space-y-4">
                      {/* Mock Top Cities - In real app, calculate from trafficEvents.city */}
                      {[
                          { city: 'Johannesburg', percent: 45 },
                          { city: 'Cape Town', percent: 30 },
                          { city: 'Durban', percent: 15 },
                          { city: 'Pretoria', percent: 10 },
                      ].map((c, i) => (
                          <div key={i}>
                              <div className="flex justify-between text-xs text-slate-300 mb-1">
                                  <span>{c.city}</span>
                                  <span>{c.percent}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-500" style={{ width: `${c.percent}%` }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="w-full md:w-2/3 h-64 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                  {/* Abstract Map Dots */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center invert grayscale"></div>
                  
                  {/* Pulsing Beacons */}
                  <div className="absolute top-[60%] left-[55%] w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute top-[60%] left-[55%] w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
                  
                  <div className="absolute top-[65%] left-[53%] w-2 h-2 bg-red-500 rounded-full animate-ping delay-300"></div>
                  <div className="absolute top-[65%] left-[53%] w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></div>

                  <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-500">Live Activity Feed</div>
              </div>
          </div>
      </div>
    </div>
  );
};

const SystemMonitor: React.FC<{ connectionHealth: any; systemLogs: any[]; storageStats: any }> = ({ connectionHealth, systemLogs, storageStats }) => {
   // High-Density Sci-Fi Dashboard State
   const [serverLoad, setServerLoad] = useState<number[]>(new Array(20).fill(20));
   const [apiRequestRate, setApiRequestRate] = useState<{label: string, value: number}[]>(
     ['GET', 'POST', 'PUT', 'DEL'].map(l => ({ label: l, value: Math.floor(Math.random() * 50) + 10 }))
   );
   const [cacheHealth, setCacheHealth] = useState(98);

   // Animation Loop
   useEffect(() => {
      const interval = setInterval(() => {
         // Simulate CPU/Memory Load
         setServerLoad(prev => {
            const nextVal = Math.max(10, Math.min(90, prev[prev.length - 1] + (Math.random() * 20 - 10)));
            return [...prev.slice(1), nextVal];
         });
         
         // Simulate API Requests fluctuation
         setApiRequestRate(prev => prev.map(p => ({
             ...p,
             value: Math.max(5, Math.min(100, p.value + (Math.random() * 20 - 10)))
         })));

         // Cache health drift
         setCacheHealth(prev => Math.min(100, Math.max(90, prev + (Math.random() * 2 - 1))));

      }, 1000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
         <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-3xl font-serif text-white flex items-center gap-3">
               <Activity className="text-primary animate-pulse" size={28}/> System Core
            </h2>
            <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">Real-time Infrastructure Telemetry</p>
         </div>

         {/* TOP ROW: Vital Stats Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Cpu size={48} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">CPU Load</h4>
                <div className="text-2xl font-mono font-bold text-white mb-2">{serverLoad[serverLoad.length-1].toFixed(1)}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${serverLoad[serverLoad.length-1]}%` }}></div>
                </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><HardDrive size={48} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Memory Usage</h4>
                <div className="text-2xl font-mono font-bold text-white mb-2">{(storageStats.dbSize / 1024).toFixed(1)} KB</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: '45%' }}></div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Zap size={48} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Cache Health</h4>
                <div className="text-2xl font-mono font-bold text-white mb-2">{cacheHealth.toFixed(1)}%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${cacheHealth}%` }}></div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Activity size={48} /></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Latency</h4>
                <div className="text-2xl font-mono font-bold text-white mb-2">{connectionHealth?.latency || 0}ms</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${connectionHealth?.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                    {connectionHealth?.status || 'OFFLINE'}
                </div>
            </div>
         </div>

         {/* MIDDLE ROW: Charts */}
         <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Server Load Line Chart */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2"><Server size={16} className="text-blue-500"/> Server Load Distribution</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-[10px] font-mono text-slate-500">LIVE</span>
                    </div>
                </div>
                <div className="h-64 w-full bg-slate-950/50 rounded-xl border border-slate-800/50 overflow-hidden relative">
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <SimpleLineChart data={serverLoad} color="#3b82f6" height={250} />
                </div>
            </div>

            {/* API Request Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 flex flex-col">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-6"><Globe size={16} className="text-purple-500"/> API Throughput</h3>
                <div className="flex-grow flex items-end gap-2 pb-2">
                    <SimpleBarChart data={apiRequestRate} color="#a855f7" showLabels={true} />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
                    Requests per Second (RPS)
                </div>
            </div>
         </div>
         
         {/* BOTTOM ROW: System Log Terminal */}
         <div className="bg-slate-950 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm flex items-center gap-2"><Terminal size={16} className="text-green-500"/> System Events Log</h3>
                <span className="text-[10px] font-mono text-slate-500">{systemLogs.length} Events Recorded</span>
            </div>
            <div className="p-4 h-60 overflow-y-auto custom-scrollbar font-mono text-xs space-y-1">
               {systemLogs.map(log => (
                  <div key={log.id} className="flex gap-4 p-2 hover:bg-white/5 rounded transition-colors group">
                     <span className="text-slate-600 w-24 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                     <span className={`w-16 flex-shrink-0 font-bold ${log.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>{log.type}</span>
                     <span className="text-slate-400 group-hover:text-white transition-colors">{log.message}</span>
                  </div>
               ))}
               {systemLogs.length === 0 && <div className="text-slate-600 text-center py-10">No events logged in current session.</div>}
            </div>
         </div>
      </div>
   );
};

const TrainingGrid: React.FC = () => {
   const [filter, setFilter] = useState('All');
   const categories = ['All', 'Social', 'Marketplace', 'SEO', 'Email'];
   const [expandedModule, setExpandedModule] = useState<string | null>(null);

   const filteredModules = TRAINING_MODULES.filter(m => {
      if (filter === 'All') return true;
      if (filter === 'Social') return ['Instagram', 'TikTok', 'Pinterest', 'Facebook'].includes(m.platform);
      if (filter === 'Marketplace') return ['General', 'Amazon'].includes(m.platform);
      return m.platform === filter;
   });

   return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
               <h2 className="text-3xl font-serif text-white">Academy</h2>
               <p className="text-slate-400 text-sm">Master the art of affiliate curation.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
               {categories.map(cat => (
                  <button 
                     key={cat}
                     onClick={() => setFilter(cat)} 
                     className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filter === cat ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'}`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map((module, i) => {
               const Icon = CustomIcons[module.icon] || (LucideIcons as any)[module.icon] || GraduationCap;
               const isExpanded = expandedModule === module.id;
               
               return (
                  <div key={module.id} className={`bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col transition-all duration-300 ${isExpanded ? 'md:col-span-2 row-span-2 border-primary/50 shadow-2xl z-10' : 'hover:border-slate-600'}`}>
                     <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${module.platform === 'Pinterest' ? 'bg-red-600' : 'bg-slate-800 border border-slate-700'}`}>
                              <Icon size={20} />
                           </div>
                           <span className="px-2 py-1 rounded-md bg-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{module.platform}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2 leading-tight">{module.title}</h3>
                        <p className="text-slate-500 text-xs line-clamp-3 mb-4">{module.description}</p>
                        
                        <div className="mt-auto">
                           <button 
                              onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                              className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                           >
                              {isExpanded ? 'Close Module' : 'Start Lesson'} <ArrowRight size={12}/>
                           </button>
                        </div>
                     </div>

                     {isExpanded && (
                        <div className="px-6 pb-6 bg-slate-900 border-t border-slate-800 animate-in fade-in">
                           <div className="pt-6 space-y-6">
                              <div>
                                 <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Target size={14}/> Strategy</h4>
                                 <ul className="space-y-2">
                                    {module.strategies.map((s, idx) => (
                                       <li key={idx} className="text-slate-300 text-xs pl-4 border-l-2 border-slate-700">{s}</li>
                                    ))}
                                 </ul>
                              </div>
                              <div>
                                 <h4 className="text-green-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><Rocket size={14}/> Action Items</h4>
                                 <div className="space-y-2">
                                    {module.actionItems.map((item, idx) => (
                                       <label key={idx} className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer hover:border-green-500/30 transition-colors">
                                          <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-green-500 focus:ring-0" />
                                          <span className="text-slate-400 text-xs">{item}</span>
                                       </label>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );
};

// --- MAIN ADMIN COMPONENT ---

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, isLocalMode, saveStatus, setSaveStatus,
    products, categories, subCategories, heroSlides, enquiries, admins, stats, orders,
    updateData, deleteData, refreshAllData, connectionHealth, systemLogs, storageStats
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide' | 'training' | 'orders'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | 'integrations' | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  
  // Real-time error handling state
  const [trafficEvents, setTrafficEvents] = useState<any[]>([]);

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });
  const [tempFeature, setTempFeature] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Orders State
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState({ courier: '', tracking: '' });

  const myAdminProfile = useMemo(() => admins.find(a => a.id === user?.id || a.email === user?.email), [admins, user]);
  const isOwner = isLocalMode || (myAdminProfile?.role === 'owner') || (user?.email === 'admin@kasicouture.com');
  const userId = user?.id;
  const displayProducts = useMemo(() => isOwner ? products : products.filter(p => !p.createdBy || p.createdBy === userId), [products, isOwner, userId]);
  const displayCategories = useMemo(() => isOwner ? categories : categories.filter(c => !c.createdBy || c.createdBy === userId), [categories, isOwner, userId]);
  const displayHeroSlides = useMemo(() => isOwner ? heroSlides : heroSlides.filter(s => !s.createdBy || s.createdBy === userId), [heroSlides, isOwner, userId]);

  useEffect(() => {
    const fetchTraffic = async () => {
       try {
         if (isSupabaseConfigured) {
            const { data } = await supabase.from('traffic_logs').select('*').order('timestamp', { ascending: false }).limit(2000);
            if (data) setTrafficEvents(data);
         } else {
             const rawLogs = localStorage.getItem('site_traffic_logs');
             const logs = rawLogs ? JSON.parse(rawLogs) : [];
             if (Array.isArray(logs)) setTrafficEvents(logs);
         }
       } catch (e) {
         setTrafficEvents([]);
       }
    };
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);
    return () => clearInterval(interval);
  }, [isSupabaseConfigured]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  
  const handleSaveProduct = async () => { const newProduct = { ...productData, id: editingId || Date.now().toString(), createdAt: productData.createdAt || Date.now(), createdBy: productData.createdBy || user?.id }; const ok = await updateData('products', newProduct); if (ok) { setShowProductForm(false); setEditingId(null); } };
  const handleSaveCategory = async () => { const newCat = { ...catData, id: editingId || Date.now().toString(), createdBy: catData.createdBy || user?.id }; const ok = await updateData('categories', newCat); if (ok) { setShowCategoryForm(false); setEditingId(null); } };
  const handleSaveHero = async () => { const newSlide = { ...heroData, id: editingId || Date.now().toString(), createdBy: heroData.createdBy || user?.id }; const ok = await updateData('hero_slides', newSlide); if (ok) { setShowHeroForm(false); setEditingId(null); } };
  const handleSaveAdmin = async () => { if (!adminData.email) return; setCreatingAdmin(true); try { const newAdmin = { ...adminData, id: editingId || Date.now().toString(), createdAt: adminData.createdAt || Date.now() }; const ok = await updateData('admin_users', newAdmin); if (ok) { setShowAdminForm(false); setEditingId(null); } } catch (err: any) { alert(`Error saving member: ${err.message}`); } finally { setCreatingAdmin(false); } };

  const toggleEnquiryStatus = async (enquiry: Enquiry) => { const updated = { ...enquiry, status: enquiry.status === 'read' ? 'unread' : 'read' }; await updateData('enquiries', updated); };
  const handleAddSubCategory = async (categoryId: string) => { if (!tempSubCatName.trim()) return; const newSub: SubCategory = { id: Date.now().toString(), categoryId, name: tempSubCatName, createdBy: user?.id }; await updateData('subcategories', newSub); setTempSubCatName(''); };
  const handleDeleteSubCategory = async (id: string) => await deleteData('subcategories', id);
  
  // Order Handlers
  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    await updateData('orders', { ...order, status: newStatus });
    if(viewingOrder && viewingOrder.id === orderId) setViewingOrder({ ...order, status: newStatus as any });
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    for(const oid of selectedOrderIds) {
       const order = orders.find(o => o.id === oid);
       if(order) await updateData('orders', { ...order, status: newStatus });
    }
    setSelectedOrderIds([]);
  };

  const handleSaveTracking = async () => {
    if(!viewingOrder) return;
    const updated = { ...viewingOrder, courierName: trackingInfo.courier, trackingNumber: trackingInfo.tracking, status: 'shipped' as const };
    await updateData('orders', updated);
    setViewingOrder(updated);
    // Simulate notification
    alert(`Status updated to Shipped. Notification sent to ${viewingOrder.customerEmail}`);
  };

  const printInvoice = (order: Order) => {
    const w = window.open('', '_blank');
    if(w) {
        w.document.write(`
            <html><head><title>Invoice ${order.id}</title>
            <style>body { font-family: sans-serif; padding: 40px; } .header { margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; } .total { margin-top: 20px; text-align: right; font-size: 20px; font-weight: bold; }</style>
            </head><body>
            <div class="header"><h1>${settings.companyName}</h1><p>Invoice #${order.id}</p><p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p></div>
            <p><strong>Bill To:</strong> ${order.customerName}<br>${order.shippingAddress}<br>${order.customerEmail}</p>
            <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
            ${order.items?.map(i => `<tr><td>${i.productName}</td><td>${i.quantity}</td><td>R ${i.price}</td><td>R ${i.price * i.quantity}</td></tr>`).join('')}
            </tbody></table>
            <div class="total">Total: R ${order.total.toLocaleString()}</div>
            </body></html>
        `);
        w.document.close();
        w.print();
    }
  };

  const handleAddDiscountRule = () => { if (!tempDiscountRule.value || !tempDiscountRule.description) return; const newRule: DiscountRule = { id: Date.now().toString(), type: tempDiscountRule.type || 'percentage', value: Number(tempDiscountRule.value), description: tempDiscountRule.description }; setProductData({ ...productData, discountRules: [...(productData.discountRules || []), newRule] }); setTempDiscountRule({ type: 'percentage', value: 0, description: '' }); };
  const handleRemoveDiscountRule = (id: string) => { setProductData({ ...productData, discountRules: (productData.discountRules || []).filter(r => r.id !== id) }); };
  const handleAddFeature = () => { if (!tempFeature.trim()) return; setProductData(prev => ({ ...prev, features: [...(prev.features || []), tempFeature] })); setTempFeature(''); };
  const handleRemoveFeature = (index: number) => { setProductData(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) })); };
  const handleAddSpec = () => { if (!tempSpec.key.trim() || !tempSpec.value.trim()) return; setProductData(prev => ({ ...prev, specifications: { ...(prev.specifications || {}), [tempSpec.key]: tempSpec.value } })); setTempSpec({ key: '', value: '' }); };
  const handleRemoveSpec = (key: string) => { setProductData(prev => { const newSpecs = { ...(prev.specifications || {}) }; delete newSpecs[key]; return { ...prev, specifications: newSpecs }; }); };

  const handleOpenEditor = (section: any) => { setTempSettings({...settings}); setActiveEditorSection(section); setEditorDrawerOpen(true); };
  const updateTempSettings = (newSettings: Partial<SiteSettings>) => setTempSettings(prev => ({ ...prev, ...newSettings }));
  const exportEnquiries = () => { const csvContent = "data:text/csv;charset=utf-8," + "Name,Email,Subject,Message,Date\n" + enquiries.map(e => `${e.name},${e.email},${e.subject},"${e.message}",${new Date(e.createdAt).toLocaleDateString()}`).join("\n"); const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", "enquiries_export.csv"); document.body.appendChild(link); link.click(); };
  const filteredEnquiries = enquiries.filter(e => { const matchesSearch = e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || e.email.toLowerCase().includes(enquirySearch.toLowerCase()) || e.subject.toLowerCase().includes(enquirySearch.toLowerCase()); const matchesStatus = enquiryFilter === 'all' || e.status === enquiryFilter; return matchesSearch && matchesStatus; });

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Inbox</h2><p className="text-slate-400 text-sm">Manage incoming client communications.</p></div>
         <div className="flex gap-3 w-full md:w-auto">
            <button onClick={exportEnquiries} className="flex-1 md:flex-none justify-center px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><FileSpreadsheet size={16}/> Export CSV</button>
         </div>
      </div>
      <AdminTip title="Communication Hub">This is your central command for client interactions. All inquiries from your contact form are routed here.</AdminTip>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search sender, email, or subject..." value={enquirySearch} onChange={e => setEnquirySearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" /></div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar">{['all', 'unread', 'read'].map(filter => (<button key={filter} onClick={() => setEnquiryFilter(filter as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${enquiryFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}>{filter}</button>))}</div>
      </div>
      {filteredEnquiries.length === 0 ? <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] md:rounded-[3rem] border border-dashed border-slate-800 text-slate-500">No enquiries found.</div> : 
        filteredEnquiries.map(e => (
          <div key={e.id} className={`bg-slate-900 border transition-all rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 flex flex-col md:flex-row gap-6 text-left ${e.status === 'unread' ? 'border-primary/30 shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
            <div className="flex-grow space-y-2 min-w-0"><div className="flex items-center gap-3"><h4 className="text-white font-bold truncate">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase flex-shrink-0">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold truncate">{e.email}</p><div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic leading-relaxed break-words">"{e.message}"</div></div>
            <div className="flex gap-2 items-start w-full md:w-auto flex-shrink-0 min-w-0">
              <button onClick={() => setReplyEnquiry(e)} className="flex-1 md:flex-none p-4 bg-primary/20 text-primary rounded-2xl hover:bg-primary hover:text-slate-900 transition-colors" title="Reply"><Reply size={20}/></button>
              <button onClick={() => toggleEnquiryStatus(e)} className={`flex-1 md:flex-none p-4 rounded-2xl transition-colors ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`} title={e.status === 'read' ? 'Mark Unread' : 'Mark Read'}><CheckCircle size={20}/></button>
              <button onClick={() => deleteData('enquiries', e.id)} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={20}/></button>
            </div>
          </div>
        ))
      }
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
      {showProductForm ? (
        <div className="bg-slate-900 p-6 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6"><h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Masterpiece' : 'New Collection Item'}</h3><button onClick={() => setShowProductForm(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button></div>
          <AdminTip title="Inventory Deployment">Optimize your listing with detailed specifications and high-res media.</AdminTip>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
                <SettingField label="SKU / Reference ID" value={productData.sku || ''} onChange={v => setProductData({...productData, sku: v})} />
                <div className="grid grid-cols-2 gap-4">
                   <SettingField label="Price (ZAR)" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
                   {productData.isDirectSale && (
                      <SettingField label="Stock Quantity" value={productData.stockQuantity?.toString() || '0'} onChange={v => setProductData({...productData, stockQuantity: parseInt(v) || 0})} type="number" />
                   )}
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                   <span className="text-white font-bold text-sm">Sell Directly on Site?</span>
                   <div onClick={() => setProductData({...productData, isDirectSale: !productData.isDirectSale})} className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${productData.isDirectSale ? 'bg-primary' : 'bg-slate-700'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-1 ml-1 ${productData.isDirectSale ? 'translate-x-6' : ''}`}></div>
                   </div>
                </div>
                <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
             </div>
             <div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value, subCategoryId: ''})}><option value="">Select Department</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sub-Category</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none disabled:opacity-50" value={productData.subCategoryId} onChange={e => setProductData({...productData, subCategoryId: e.target.value})} disabled={!productData.categoryId}><option value="">Select Sub-Category</option>{subCategories.filter(s => s.categoryId === productData.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
              <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Sparkles size={18} className="text-primary"/> Highlights</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex gap-2"><input type="text" placeholder="Add highlight (e.g. '100% Silk')" value={tempFeature} onChange={e => setTempFeature(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && handleAddFeature()} /><button onClick={handleAddFeature} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{(productData.features || []).map((feat, idx) => (<div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"><span className="text-sm text-slate-300 flex items-center gap-2"><Check size={14} className="text-primary"/> {feat}</span><button onClick={() => handleRemoveFeature(idx)} className="text-slate-500 hover:text-red-500"><X size={14}/></button></div>))}</div></div></div>
              <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Tag size={18} className="text-primary"/> Specifications</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex gap-2"><input type="text" placeholder="Key (e.g. Material)" value={tempSpec.key} onChange={e => setTempSpec({...tempSpec, key: e.target.value})} className="w-1/3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" /><input type="text" placeholder="Value (e.g. Silk)" value={tempSpec.value} onChange={e => setTempSpec({...tempSpec, value: e.target.value})} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && handleAddSpec()} /><button onClick={handleAddSpec} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{Object.entries(productData.specifications || {}).map(([key, value]) => (<div key={key} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"><div className="flex flex-col"><span className="text-[10px] font-black uppercase text-slate-500">{key}</span><span className="text-sm text-slate-300">{value}</span></div><button onClick={() => handleRemoveSpec(key)} className="text-slate-500 hover:text-red-500"><X size={14}/></button></div>))}</div></div></div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-left"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><Image size={18} className="text-primary"/> Media Gallery</h4><FileUploader files={productData.media || []} onFilesChange={f => setProductData({...productData, media: f})} /></div>
          <div className="pt-8 border-t border-slate-800 text-left"><h4 className="text-white font-bold mb-6 flex items-center gap-2"><Percent size={18} className="text-primary"/> Discount Rules</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex flex-col md:flex-row gap-4 md:items-end"><div className="flex-1"><SettingField label="Description" value={tempDiscountRule.description || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, description: v})} /></div><div className="w-full md:w-32"><SettingField label="Value" value={tempDiscountRule.value?.toString() || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, value: Number(v)})} type="number" /></div><div className="w-full md:w-32 space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-4 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none text-sm" value={tempDiscountRule.type} onChange={e => setTempDiscountRule({...tempDiscountRule, type: e.target.value as any})}><option value="percentage">Percent (%)</option><option value="fixed">Fixed (R)</option></select></div><button onClick={handleAddDiscountRule} className="p-4 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{(productData.discountRules || []).map(rule => (<div key={rule.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800"><span className="text-sm text-slate-300 font-medium">{rule.description}</span><div className="flex items-center gap-4"><span className="text-xs font-bold text-primary">{rule.type === 'percentage' ? `-${rule.value}%` : `-R${rule.value}`}</span><button onClick={() => handleRemoveDiscountRule(rule.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button></div></div>))}</div></div></div>
          <div className="flex flex-col md:flex-row gap-4 pt-8"><button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Save Product</button><button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 text-left"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Catalog</h2><p className="text-slate-400 text-sm">Curate your collection of affiliate products.</p></div><button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3 w-full md:w-auto justify-center"><Plus size={18} /> Add Product</button></div>
          <AdminTip title="Inventory Management">Filter by department or keyword. Use the megaphone icon to generate shareable social assets instantly.</AdminTip>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
             <div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search by name..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" /></div>
             <div className="relative min-w-[200px]"><Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><select value={productCatFilter} onChange={e => setProductCatFilter(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer"><option value="all">All Departments</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} /></div>
          </div>
          <div className="grid gap-4">
            {displayProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && (productCatFilter === 'all' || p.categoryId === productCatFilter)).map(p => (
              <div key={p.id} className="bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-primary/30 transition-colors group gap-4">
                <div className="flex items-center gap-6 min-w-0 text-left">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative flex-shrink-0"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold line-clamp-1 break-words flex items-center gap-2">
                      {p.name}
                      {p.isDirectSale && <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-[8px] font-black uppercase tracking-widest border border-green-500/20">Direct Sale</span>}
                    </h4>
                    <div className="flex items-center gap-2 mt-1"><span className="text-primary text-xs font-bold">R {p.price}</span><span className="text-slate-600 text-[10px] uppercase font-black tracking-widest hidden md:inline">• {categories.find(c => c.id === p.categoryId)?.name}</span></div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto flex-shrink-0"><button onClick={() => setSelectedAdProduct(p)} className="flex-1 md:flex-none p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-slate-900 transition-colors" title="Social Share"><Megaphone size={18}/></button><button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button><button onClick={() => deleteData('products', p.id)} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderOrders = () => {
    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                              o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                              o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
        const matchesFilter = orderFilter === 'all' ? true : o.status === orderFilter;
        return matchesSearch && matchesFilter;
    }).sort((a, b) => b.createdAt - a.createdAt);

    const toggleOrderSelection = (id: string) => {
        setSelectedOrderIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            paid: 'bg-blue-500/20 text-blue-400',
            shipped: 'bg-purple-500/20 text-purple-400',
            delivered: 'bg-green-500/20 text-green-400',
            cancelled: 'bg-red-500/20 text-red-400',
            pending_payment: 'bg-yellow-500/20 text-yellow-400',
            processing: 'bg-orange-500/20 text-orange-400'
        };
        return <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status] || styles.pending_payment}`}>{status.replace('_', ' ')}</span>;
    };

    return (
      <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div className="space-y-2">
               <h2 className="text-3xl font-serif text-white">Fulfillment</h2>
               <p className="text-slate-400 text-sm">Manage orders, update logistics, and print invoices.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['all', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setOrderFilter(f)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${orderFilter === f ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'}`}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>
         </div>

         {/* Bulk Actions */}
         {selectedOrderIds.length > 0 && (
             <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-primary text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10">
                 <span className="text-xs font-bold">{selectedOrderIds.length} Selected</span>
                 <div className="h-4 w-px bg-slate-900/20"></div>
                 <button onClick={() => handleBulkStatusUpdate('processing')} className="text-[10px] font-black uppercase hover:text-white transition-colors">Mark Processing</button>
                 <button onClick={() => handleBulkStatusUpdate('shipped')} className="text-[10px] font-black uppercase hover:text-white transition-colors">Mark Shipped</button>
                 <button onClick={() => setSelectedOrderIds([])} className="p-1 rounded-full hover:bg-white/20"><X size={14}/></button>
             </div>
         )}

         {/* Search Bar */}
         <div className="relative mb-6">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
             <input 
                type="text" 
                placeholder="Search orders by ID, name or email..." 
                value={orderSearch} 
                onChange={e => setOrderSearch(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" 
             />
         </div>

         {/* Orders Table */}
         <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
             <table className="w-full text-left border-collapse">
                 <thead>
                     <tr className="bg-slate-950/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                         <th className="p-4 w-12 text-center">
                             <input 
                                type="checkbox" 
                                className="rounded bg-slate-800 border-slate-700 text-primary focus:ring-0" 
                                onChange={(e) => setSelectedOrderIds(e.target.checked ? filteredOrders.map(o => o.id) : [])}
                                checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                             />
                         </th>
                         <th className="p-4">Order ID</th>
                         <th className="p-4">Date</th>
                         <th className="p-4">Customer</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Total</th>
                         <th className="p-4 w-12"></th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                     {filteredOrders.length === 0 ? (
                         <tr><td colSpan={7} className="p-8 text-center text-slate-500 text-sm">No orders found.</td></tr>
                     ) : (
                         filteredOrders.map(order => (
                             <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => { setViewingOrder(order); setTrackingInfo({ courier: order.courierName || '', tracking: order.trackingNumber || '' }); }}>
                                 <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                     <input 
                                        type="checkbox" 
                                        checked={selectedOrderIds.includes(order.id)}
                                        onChange={() => toggleOrderSelection(order.id)}
                                        className="rounded bg-slate-800 border-slate-700 text-primary focus:ring-0"
                                     />
                                 </td>
                                 <td className="p-4 font-mono text-xs text-white">{order.id}</td>
                                 <td className="p-4 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                 <td className="p-4">
                                     <div className="flex flex-col">
                                         <span className="text-sm font-bold text-white">{order.customerName}</span>
                                         <span className="text-[10px] text-slate-500">{order.customerEmail}</span>
                                     </div>
                                 </td>
                                 <td className="p-4">{getStatusBadge(order.status)}</td>
                                 <td className="p-4 text-right text-sm font-bold text-white">R {order.total.toLocaleString()}</td>
                                 <td className="p-4 text-slate-500 group-hover:text-primary transition-colors"><ChevronRight size={16}/></td>
                             </tr>
                         ))
                     )}
                 </tbody>
             </table>
         </div>

         {/* Detail Drawer */}
         {viewingOrder && (
             <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingOrder(null)}>
                 <div className="w-full max-w-lg bg-slate-900 h-full shadow-2xl border-l border-slate-800 overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                     
                     {/* Drawer Header */}
                     <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/50">
                         <div>
                             <h3 className="text-2xl font-serif text-white mb-1">Order Details</h3>
                             <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                 <span>#{viewingOrder.id}</span>
                                 <span>•</span>
                                 <span>{new Date(viewingOrder.createdAt).toLocaleString()}</span>
                             </div>
                         </div>
                         <button onClick={() => setViewingOrder(null)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={20}/></button>
                     </div>

                     <div className="flex-grow p-6 space-y-8">
                         
                         {/* Status & Actions */}
                         <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Order Status</label>
                             <select 
                                value={viewingOrder.status} 
                                onChange={(e) => handleOrderStatusUpdate(viewingOrder.id, e.target.value)}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                             >
                                 {['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                     <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                                 ))}
                             </select>
                         </div>

                         {/* Customer Info */}
                         <div className="space-y-4">
                             <h4 className="text-white font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-2"><User size={16} className="text-primary"/> Customer</h4>
                             <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                                 <div><span className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Name</span>{viewingOrder.customerName}</div>
                                 <div><span className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Email</span>{viewingOrder.customerEmail}</div>
                                 <div className="col-span-2">
                                     <span className="block text-slate-500 uppercase text-[9px] font-bold mb-1">Shipping Address</span>
                                     <p className="leading-relaxed whitespace-pre-wrap">{viewingOrder.shippingAddress}</p>
                                 </div>
                             </div>
                         </div>

                         {/* Order Items */}
                         <div className="space-y-4">
                             <h4 className="text-white font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-2"><ShoppingBag size={16} className="text-primary"/> Items</h4>
                             <div className="space-y-3">
                                 {viewingOrder.items?.map((item: OrderItem) => (
                                     <div key={item.id} className="flex justify-between items-center bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
                                         <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-white">{item.quantity}x</div>
                                             <span className="text-sm text-slate-300">{item.productName}</span>
                                         </div>
                                         <span className="text-xs font-mono text-white">R {(item.price * item.quantity).toLocaleString()}</span>
                                     </div>
                                 ))}
                                 <div className="flex justify-between items-center pt-2 text-sm font-bold text-white">
                                     <span>Total</span>
                                     <span className="text-primary text-lg">R {viewingOrder.total.toLocaleString()}</span>
                                 </div>
                             </div>
                         </div>

                         {/* Logistics */}
                         <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                             <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2"><Truck size={16} className="text-blue-500"/> Logistics</h4>
                             <div className="space-y-3">
                                 <div className="space-y-1">
                                     <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Courier Name</label>
                                     <input type="text" value={trackingInfo.courier} onChange={e => setTrackingInfo({...trackingInfo, courier: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-primary" placeholder="e.g. Aramex" />
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Tracking Number</label>
                                     <input type="text" value={trackingInfo.tracking} onChange={e => setTrackingInfo({...trackingInfo, tracking: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-primary" placeholder="e.g. DBP123456789" />
                                 </div>
                                 <button onClick={handleSaveTracking} className="w-full py-3 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-colors">Update & Notify Client</button>
                             </div>
                         </div>

                     </div>

                     {/* Drawer Footer */}
                     <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex gap-4">
                         <button onClick={() => printInvoice(viewingOrder)} className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-xl font-bold uppercase text-xs tracking-widest hover:text-white hover:bg-slate-700 flex items-center justify-center gap-2">
                             <Printer size={16}/> Print Invoice
                         </button>
                     </div>
                 </div>
             </div>
         )}
      </div>
    );
  };

  const renderHero = () => (
     <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        <AdminTip title="Hero Master Visuals">Set the tone for your bridge page with cinematic hero visuals. Videos increase dwell time by up to 40%.</AdminTip>
        {showHeroForm ? ( 
           <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-800 space-y-6">
              <div className="grid md:grid-cols-2 gap-6"><SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={heroData.type} onChange={e => setHeroData({...heroData, type: e.target.value as any})}><option value="image">Image</option><option value="video">Video</option></select></div></div>
              <SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" />
              <SettingField label="Button Label" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} />
              <SingleImageUploader label="Media Asset" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} accept={heroData.type === 'video' ? "video/*" : "image/*"} />
              <div className="flex gap-4"><button onClick={handleSaveHero} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Slide</button><button onClick={() => setShowHeroForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
           </div> 
        ) : ( 
           <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => { setHeroData({ title: '', subtitle: '', cta: 'Explore', image: '', type: 'image' }); setShowHeroForm(true); setEditingId(null); }} className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary min-h-[250px]"><Plus size={48} /><span className="font-black uppercase tracking-widest text-xs">New Hero Slide</span></button>
              {displayHeroSlides.map(s => (
                 <div key={s.id} className="relative aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden group border border-slate-800">
                    {s.type === 'video' ? <video src={s.image} className="w-full h-full object-cover" muted /> : <img src={s.image} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/60 p-6 md:p-10 flex flex-col justify-end text-left"><h4 className="text-white text-xl font-serif">{s.title}</h4><div className="flex gap-2 mt-4"><button onClick={() => { setHeroData(s); setEditingId(s.id); setShowHeroForm(true); }} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20"><Edit2 size={16}/></button><button onClick={() => deleteData('hero_slides', s.id)} className="p-3 bg-white/10 text-white rounded-xl hover:bg-red-500"><Trash2 size={16}/></button></div></div>
                 </div>
              ))}
           </div> 
        )}
     </div>
  );

  const renderCategories = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left w-full max-w-7xl mx-auto">
       {showCategoryForm ? (
          <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-800 space-y-8">
             <AdminTip title="Department Structuring">Define your niches. Departments categorize your curations into logical shopping flows for the end user.</AdminTip>
             <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="space-y-6"><h3 className="text-white font-bold text-xl mb-4">Department Details</h3><SettingField label="Department Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={catData.icon || 'Package'} onSelect={icon => setCatData({...catData, icon})} /></div><SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} type="textarea" /></div>
                <div className="space-y-6"><SingleImageUploader label="Cover Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} className="h-48 w-full object-cover rounded-2xl" /><div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800"><h4 className="text-white font-bold text-sm mb-4">Subcategories</h4><div className="flex gap-2 mb-4"><input type="text" placeholder="New Subcategory Name" value={tempSubCatName} onChange={e => setTempSubCatName(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" /><button onClick={() => editingId && handleAddSubCategory(editingId)} className="px-4 bg-slate-700 text-white rounded-xl hover:bg-primary hover:text-slate-900 transition-colors"><Plus size={18}/></button></div><div className="flex flex-wrap gap-2">{editingId && subCategories.filter(s => s.categoryId === editingId).map(s => (<div key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800"><span className="text-xs text-slate-300">{s.name}</span><button onClick={() => handleDeleteSubCategory(s.id)} className="text-slate-500 hover:text-red-500"><X size={12}/></button></div>))}</div></div></div>
             </div>
             <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-800"><button onClick={handleSaveCategory} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Dept</button><button onClick={() => setShowCategoryForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
          </div>
       ) : (
          <>
            <AdminTip title="Collections Navigation">Each department acts as a portal. Use high-fashion imagery to attract attention to specific collections.</AdminTip>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               <button onClick={() => { setCatData({ name: '', icon: 'Package', description: '', image: '' }); setShowCategoryForm(true); setEditingId(null); }} className="w-full h-40 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-primary"><Plus size={32} /><span className="font-black text-[10px] uppercase tracking-widest">New Dept</span></button>
               {displayCategories.map(c => (
                  <div key={c.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col relative group">
                     <div className="h-32 overflow-hidden relative"><img src={c.image} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center px-8 gap-4"><div className="w-12 h-12 bg-slate-800 text-primary rounded-xl flex items-center justify-center shadow-xl flex-shrink-0">{React.createElement((LucideIcons as any)[c.icon] || LucideIcons.Package, { size: 20 })}</div><h4 className="font-bold text-white text-lg truncate">{c.name}</h4></div></div>
                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setCatData(c); setEditingId(c.id); setShowCategoryForm(true); }} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md"><Edit2 size={14}/></button><button onClick={() => deleteData('categories', c.id)} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md hover:bg-red-500"><Trash2 size={14}/></button></div>
                  </div>
               ))}
            </div>
          </>
       )}
    </div>
  );

  const renderSiteEditor = () => (
     <div className="space-y-6 w-full max-w-7xl mx-auto text-left">
       <AdminTip title="Canvas Editor">Control your site's visual identity. Publishing changes here will synchronize with Supabase and update for all visitors.</AdminTip>
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
          {[ {id: 'brand', label: 'Identity', icon: Globe, desc: 'Logo, Colors, Slogan'}, {id: 'nav', label: 'Navigation', icon: MapPin, desc: 'Menu Labels, Footer'}, {id: 'home', label: 'Home Page', icon: Layout, desc: 'Hero, About, Trust Strip'}, {id: 'collections', label: 'Collections', icon: ShoppingBag, desc: 'Shop Hero, Search Text'}, {id: 'about', label: 'About Page', icon: User, desc: 'Story, Values, Gallery'}, {id: 'contact', label: 'Contact Page', icon: Mail, desc: 'Info, Form, Socials'}, {id: 'legal', label: 'Legal Text', icon: Shield, desc: 'Privacy, Terms, Disclosure'}, {id: 'integrations', label: 'Integrations & Payments', icon: LinkIcon, desc: 'EmailJS, Tracking, Commerce'} ].map(s => ( 
            <button key={s.id} onClick={() => handleOpenEditor(s.id)} className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-left border border-slate-800 hover:border-primary/50 hover:bg-slate-800 transition-all group h-full flex flex-col justify-between">
               <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-primary group-hover:text-slate-900 transition-colors shadow-lg"><s.icon size={24}/></div><div><h3 className="text-white font-bold text-xl mb-1">{s.label}</h3><p className="text-slate-500 text-xs">{s.desc}</p></div><div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest edit-hover transition-opacity">Edit Section <ArrowRight size={12}/></div>
            </button> 
          ))}
       </div>
       <style>{`.edit-hover { opacity: 0; } .group:hover .edit-hover { opacity: 1; }`}</style>
     </div>
  );

  const renderTeam = () => (
     <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 text-left">
           <div className="text-left"><h2 className="text-3xl font-serif text-white">Maison Staffing</h2><p className="text-slate-400 text-sm mt-2">Roles and permissions for collaborative curation.</p></div>
           
           <div className="flex gap-4">
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3 text-left max-w-xs">
                 <Info size={16} className="text-blue-400 flex-shrink-0" />
                 <p className="text-[9px] text-blue-300 font-medium leading-tight">
                    <strong>Invitation Guide:</strong> Users must first be invited via the Supabase Auth Dashboard or sign up publicly. Once their account exists, add their email here to grant privileges.
                 </p>
              </div>
              <button onClick={() => { setAdminData({ role: 'admin', permissions: [] }); setShowAdminForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest w-full md:w-auto flex-shrink-0 h-fit self-center"><Plus size={16}/> New Member</button>
           </div>
        </div>
        {showAdminForm ? (
           <div className="bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-800 space-y-12 text-left">
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-start gap-4">
                 <div className="p-2 bg-blue-500/20 rounded-full text-blue-400"><Info size={20}/></div>
                 <div><h4 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-1">Identity Sync</h4><p className="text-slate-400 text-xs leading-relaxed">Ensure the email matches the Supabase Auth identity exactly.</p></div>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Profile</h3>
                    <SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} />
                    <SettingField label="Contact Number" value={adminData.phone || ''} onChange={v => setAdminData({...adminData, phone: v})} />
                    <SettingField label="Primary Address" value={adminData.address || ''} onChange={v => setAdminData({...adminData, address: v})} type="textarea" />
                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4 pt-6">Credentials</h3>
                    <SettingField label="Email Identity" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} />
                 </div>
                 <div className="space-y-6 text-left"><h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Privileges</h3><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Role</label><select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={adminData.role} onChange={e => setAdminData({...adminData, role: e.target.value as any, permissions: e.target.value === 'owner' ? ['*'] : []})}><option value="admin">Administrator</option><option value="owner">System Owner</option></select></div><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-6 block">Access Rights</label><PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} /></div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t border-slate-800"><button onClick={() => setShowAdminForm(false)} className="px-8 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cancel</button><button onClick={handleSaveAdmin} disabled={creatingAdmin} className="px-12 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2">{creatingAdmin ? <Loader2 size={16} className="animate-spin"/> : <ShieldCheck size={18}/>}{editingId ? 'Save' : 'Invite'}</button></div>
           </div>
        ) : (
           <>
             <AdminTip title="Role Management">Manage your staff here. Only Owners can delete other members or factory reset the system.</AdminTip>
             <div className="grid gap-6">
               {admins.map(a => {
                 const isCurrentUser = user && (a.id === user.id || a.email === user.email);
                 return (
                 <div key={a.id} className={`bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/40 transition-all group ${isCurrentUser ? 'border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
                   <div className="flex flex-col md:flex-row items-center gap-8 w-full min-w-0">
                      <div className="relative flex-shrink-0"><div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-3xl font-bold uppercase border border-slate-700 shadow-inner group-hover:text-primary transition-colors">{a.profileImage ? <img src={a.profileImage} className="w-full h-full object-cover rounded-3xl"/> : a.name?.charAt(0)}</div>{isCurrentUser && <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">You</div>}</div>
                      <div className="space-y-2 flex-grow text-center md:text-left min-w-0">
                        <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start"><h4 className="text-white text-xl font-bold break-words">{a.name}</h4><span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${a.role === 'owner' ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-400'}`}>{a.role}</span></div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 text-slate-500 text-sm break-words"><span className="flex items-center gap-2"><Mail size={14} className="text-primary"/> {a.email}</span>{a.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-primary"/> {a.phone}</span>}</div>
                        <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2"><span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Access:</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.role === 'owner' ? 'Full System' : `${a.permissions.length} modules`}</span></div>
                      </div>
                   </div>
                   <div className="flex gap-3 w-full md:w-auto flex-shrink-0"><button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-700 hover:text-white transition-all"><Edit2 size={20}/></button><button onClick={() => deleteData('admin_users', a.id)} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all" disabled={isCurrentUser}><Trash2 size={20}/></button></div>
                 </div>
                 );
               })}
             </div>
           </>
        )}
     </div>
  );

  const renderGuide = () => (
     <div className="space-y-12 md:space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 max-w-7xl mx-auto text-left w-full overflow-hidden">
        <div className="bg-gradient-to-br from-primary/30 to-slate-950 p-8 md:p-24 rounded-[2rem] md:rounded-[4rem] border border-primary/20 relative overflow-hidden shadow-2xl">
            <Rocket className="absolute -bottom-20 -right-20 text-primary/10 w-48 h-48 md:w-96 md:h-96 rotate-12" />
            <div className="max-w-3xl relative z-10 text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8 border border-primary/30"><Zap size={14}/> Launch Protocol</div>
                <h2 className="text-3xl sm:text-4xl md:text-7xl font-serif text-white mb-4 md:mb-6 leading-none break-words">Architecture <span className="text-primary italic font-light lowercase">Blueprint</span></h2>
                <p className="text-slate-400 text-sm md:text-xl font-light leading-relaxed max-w-full">Complete the following milestones to transition from local prototype to a fully-synced global luxury bridge page.</p>
            </div>
        </div>
        <div className="grid gap-16 md:gap-32 text-left">
            {GUIDE_STEPS.map((step, idx) => (
                <div key={step.id} className="relative flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-20">
                    <div className="md:col-span-1 flex flex-row md:flex-col items-center gap-4 md:gap-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[2rem] bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-primary font-black text-xl md:text-2xl shadow-2xl sticky md:top-32 static shrink-0">{idx + 1}</div>
                        <div className="md:hidden text-lg font-bold text-white">Step {idx + 1}</div>
                        <div className="hidden md:block flex-grow w-0.5 bg-gradient-to-b from-slate-800 to-transparent my-4" />
                    </div>
                    <div className="md:col-span-7 space-y-6 md:space-y-10 min-w-0 text-left">
                        <div className="space-y-4 text-left">
                            <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight break-words">{step.title}</h3>
                            <p className="text-slate-400 text-sm md:text-lg leading-relaxed">{step.description}</p>
                        </div>
                        {step.subSteps && (
                            <div className="grid gap-4 text-left">
                                {step.subSteps.map((sub, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 md:p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 hover:border-primary/30 transition-all group">
                                        <CheckCircle size={20} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-slate-300 text-sm md:text-base leading-relaxed break-words w-full">{sub}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {step.code && (<CodeBlock code={step.code} label={step.codeLabel} />)}
                    </div>
                    <div className="md:col-span-4 md:sticky md:top-32 h-fit min-w-0 mt-8 md:mt-0"><GuideIllustration id={step.illustrationId} /></div>
                </div>
            ))}
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-32 w-full overflow-x-hidden">
      <style>{` @keyframes grow { from { height: 0; } to { height: 100%; } } @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } } `}</style>
      <SaveIndicator status={saveStatus} />
      {selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}
      {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}

      <header className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 text-left w-full">
        <div className="flex flex-col gap-6 text-left"><div className="flex items-center gap-4"><h1 className="text-3xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{isLocalMode ? 'LOCAL MODE' : (isOwner ? 'SYSTEM OWNER' : 'ADMINISTRATOR')}</div></div></div>
        <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-full xl:w-auto">
            {[ { id: 'enquiries', label: 'Inbox', icon: Inbox }, { id: 'orders', label: 'Orders', icon: ShoppingBag }, { id: 'analytics', label: 'Insights', icon: BarChart3 }, { id: 'catalog', label: 'Items', icon: Tag }, { id: 'hero', label: 'Visuals', icon: LayoutPanelTop }, { id: 'categories', label: 'Depts', icon: Layout }, { id: 'site_editor', label: 'Canvas', icon: Palette }, { id: 'team', label: 'Maison', icon: Users }, { id: 'training', label: 'Training', icon: GraduationCap }, { id: 'system', label: 'System', icon: Activity }, { id: 'guide', label: 'Pilot', icon: Rocket } ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-grow md:flex-grow-0 px-3 md:px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex flex-col md:flex-row items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}><tab.icon size={14} className="md:w-3 md:h-3" />{tab.label}</button>
            ))}
          </div>
          <button onClick={handleLogout} className="flex px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-red-500 hover:text-white transition-all w-full md:w-fit justify-center self-start"><LogOut size={14} /> Exit</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20 w-full overflow-x-hidden text-left">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'analytics' && <AnalyticsDashboard trafficEvents={trafficEvents} products={products} stats={stats} orders={orders} categories={categories} />}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'hero' && renderHero()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'site_editor' && renderSiteEditor()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'training' && <TrainingGrid />}
        {activeTab === 'system' && <SystemMonitor connectionHealth={connectionHealth} systemLogs={systemLogs} storageStats={storageStats} />}
        {activeTab === 'guide' && renderGuide()}
      </main>

      {/* Editor Drawer */}
      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-6 md:p-12 text-left shadow-2xl slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="text-3xl font-serif text-white mb-2">
                    {activeEditorSection === 'brand' && 'Brand Identity'}
                    {activeEditorSection === 'nav' && 'Navigation & Footer'}
                    {activeEditorSection === 'home' && 'Home Page'}
                    {activeEditorSection === 'collections' && 'Collections Page'}
                    {activeEditorSection === 'about' && 'About Page'}
                    {activeEditorSection === 'contact' && 'Contact Page'}
                    {activeEditorSection === 'legal' && 'Legal & Policy'}
                    {activeEditorSection === 'integrations' && 'Integrations & Payments'}
                  </h3>
                  <p className="text-slate-500 text-sm">Real-time configuration.</p>
                </div>
                <button onClick={() => setEditorDrawerOpen(false)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800"><X size={24} /></button>
             </div>
             <div className="space-y-8 text-left">
               {activeEditorSection === 'brand' && (
                 <>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Core Branding</h4><SettingField label="Company Name" value={tempSettings.companyName} onChange={v => updateTempSettings({ companyName: v })} /><SettingField label="Slogan / Tagline" value={tempSettings.slogan} onChange={v => updateTempSettings({ slogan: v })} /></div>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Visual Assets</h4><div className="grid grid-cols-2 gap-6"><SettingField label="Logo Text (Fallback)" value={tempSettings.companyLogo} onChange={v => updateTempSettings({ companyLogo: v })} /><SingleImageUploader label="Logo Image (PNG)" value={tempSettings.companyLogoUrl || ''} onChange={v => updateTempSettings({ companyLogoUrl: v })} /></div></div>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Palette (Hex Codes)</h4><div className="grid grid-cols-3 gap-4"><SettingField label="Primary (Gold)" value={tempSettings.primaryColor} onChange={v => updateTempSettings({ primaryColor: v })} type="color" /><SettingField label="Secondary (Dark)" value={tempSettings.secondaryColor} onChange={v => updateTempSettings({ secondaryColor: v })} type="color" /><SettingField label="Accent" value={tempSettings.accentColor} onChange={v => updateTempSettings({ accentColor: v })} type="color" /></div></div>
                 </>
               )}
               {activeEditorSection === 'nav' && (
                  <><SettingField label="Home Label" value={tempSettings.navHomeLabel} onChange={v => updateTempSettings({ navHomeLabel: v })} /><SettingField label="Collections Label" value={tempSettings.navProductsLabel} onChange={v => updateTempSettings({ navProductsLabel: v })} /><SettingField label="About Label" value={tempSettings.navAboutLabel} onChange={v => updateTempSettings({ navAboutLabel: v })} /><SettingField label="Contact Label" value={tempSettings.navContactLabel} onChange={v => updateTempSettings({ navContactLabel: v })} /><div className="pt-6 border-t border-slate-800"><SettingField label="Footer Description" value={tempSettings.footerDescription} onChange={v => updateTempSettings({ footerDescription: v })} type="textarea" /><div className="mt-4"><SettingField label="Copyright Text" value={tempSettings.footerCopyrightText} onChange={v => updateTempSettings({ footerCopyrightText: v })} /></div></div></>
               )}
               {activeEditorSection === 'home' && (
                  <><SettingField label="Hero Badge Text" value={tempSettings.homeHeroBadge} onChange={v => updateTempSettings({ homeHeroBadge: v })} /><div className="pt-6 border-t border-slate-800 space-y-6"><h4 className="text-white font-bold">About Section</h4><SettingField label="Title" value={tempSettings.homeAboutTitle} onChange={v => updateTempSettings({ homeAboutTitle: v })} /><SettingField label="Description" value={tempSettings.homeAboutDescription} onChange={v => updateTempSettings({ homeAboutDescription: v })} type="textarea" /><SingleImageUploader label="Section Image" value={tempSettings.homeAboutImage} onChange={v => updateTempSettings({ homeAboutImage: v })} /><SettingField label="Button Text" value={tempSettings.homeAboutCta} onChange={v => updateTempSettings({ homeAboutCta: v })} /></div><div className="pt-6 border-t border-slate-800 space-y-6"><h4 className="text-white font-bold">Trust Signals</h4><div className="grid grid-cols-1 gap-4"><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 1 Title" value={tempSettings.homeTrustItem1Title} onChange={v => updateTempSettings({ homeTrustItem1Title: v })} /><SettingField label="Item 1 Desc" value={tempSettings.homeTrustItem1Desc} onChange={v => updateTempSettings({ homeTrustItem1Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem1Icon} onSelect={v => updateTempSettings({ homeTrustItem1Icon: v })} /></div><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 2 Title" value={tempSettings.homeTrustItem2Title} onChange={v => updateTempSettings({ homeTrustItem2Title: v })} /><SettingField label="Item 2 Desc" value={tempSettings.homeTrustItem2Desc} onChange={v => updateTempSettings({ homeTrustItem2Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem2Icon} onSelect={v => updateTempSettings({ homeTrustItem2Icon: v })} /></div><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 3 Title" value={tempSettings.homeTrustItem3Title} onChange={v => updateTempSettings({ homeTrustItem3Title: v })} /><SettingField label="Item 3 Desc" value={tempSettings.homeTrustItem3Desc} onChange={v => updateTempSettings({ homeTrustItem3Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem3Icon} onSelect={v => updateTempSettings({ homeTrustItem3Icon: v })} /></div></div></div></>
               )}
               {activeEditorSection === 'collections' && (
                  <><SettingField label="Hero Title" value={tempSettings.productsHeroTitle} onChange={v => updateTempSettings({ productsHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.productsHeroSubtitle} onChange={v => updateTempSettings({ productsHeroSubtitle: v })} type="textarea" /><MultiImageUploader label="Hero Carousel Images" images={tempSettings.productsHeroImages || [tempSettings.productsHeroImage]} onChange={v => updateTempSettings({ productsHeroImages: v, productsHeroImage: v[0] || '' })} /><SettingField label="Search Placeholder" value={tempSettings.productsSearchPlaceholder} onChange={v => updateTempSettings({ productsSearchPlaceholder: v })} /></>
               )}
               {activeEditorSection === 'about' && (
                  <><SettingField label="Hero Title" value={tempSettings.aboutHeroTitle} onChange={v => updateTempSettings({ aboutHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.aboutHeroSubtitle} onChange={v => updateTempSettings({ aboutHeroSubtitle: v })} type="textarea" /><SingleImageUploader label="Main Hero Image" value={tempSettings.aboutMainImage} onChange={v => updateTempSettings({ aboutMainImage: v })} /><div className="grid grid-cols-3 gap-4"><SettingField label="Est. Year" value={tempSettings.aboutEstablishedYear} onChange={v => updateTempSettings({ aboutEstablishedYear: v })} /><SettingField label="Founder" value={tempSettings.aboutFounderName} onChange={v => updateTempSettings({ aboutFounderName: v })} /><SettingField label="Location" value={tempSettings.aboutLocation} onChange={v => updateTempSettings({ aboutLocation: v })} /></div><SettingField label="History Title" value={tempSettings.aboutHistoryTitle} onChange={v => updateTempSettings({ aboutHistoryTitle: v })} /><SettingField label="History Body" value={tempSettings.aboutHistoryBody} onChange={v => updateTempSettings({ aboutHistoryBody: v })} type="textarea" rows={8} /><SingleImageUploader label="Founder Signature (Transparent PNG)" value={tempSettings.aboutSignatureImage} onChange={v => updateTempSettings({ aboutSignatureImage: v })} className="h-24 w-full object-contain" /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Values & Gallery</h4><SettingField label="Mission Title" value={tempSettings.aboutMissionTitle} onChange={v => updateTempSettings({ aboutMissionTitle: v })} /><SettingField label="Mission Body" value={tempSettings.aboutMissionBody} onChange={v => updateTempSettings({ aboutMissionBody: v })} type="textarea" /><SettingField label="Community Title" value={tempSettings.aboutCommunityTitle} onChange={v => updateTempSettings({ aboutCommunityTitle: v })} /><SettingField label="Community Body" value={tempSettings.aboutCommunityBody} onChange={v => updateTempSettings({ aboutCommunityBody: v })} type="textarea" /><SettingField label="Integrity Title" value={tempSettings.aboutIntegrityTitle} onChange={v => updateTempSettings({ aboutIntegrityTitle: v })} /><SettingField label="Integrity Body" value={tempSettings.aboutIntegrityBody} onChange={v => updateTempSettings({ aboutIntegrityBody: v })} type="textarea" /><MultiImageUploader label="Gallery Images" images={tempSettings.aboutGalleryImages} onChange={v => updateTempSettings({ aboutGalleryImages: v })} /></>
               )}
               {activeEditorSection === 'contact' && (
                  <><SettingField label="Hero Title" value={tempSettings.contactHeroTitle} onChange={v => updateTempSettings({ contactHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.contactHeroSubtitle} onChange={v => updateTempSettings({ contactHeroSubtitle: v })} type="textarea" /><div className="grid grid-cols-2 gap-4"><SettingField label="Email" value={tempSettings.contactEmail} onChange={v => updateTempSettings({ contactEmail: v })} /><SettingField label="Phone" value={tempSettings.contactPhone} onChange={v => updateTempSettings({ contactPhone: v })} /></div><SettingField label="WhatsApp (No Spaces)" value={tempSettings.whatsappNumber} onChange={v => updateTempSettings({ whatsappNumber: v })} /><SettingField label="Physical Address" value={tempSettings.address} onChange={v => updateTempSettings({ address: v })} type="textarea" /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Form Labels</h4><SettingField label="Button Text" value={tempSettings.contactFormButtonText} onChange={v => updateTempSettings({ contactFormButtonText: v })} /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Social Media</h4><SocialLinksManager links={tempSettings.socialLinks || []} onChange={v => updateTempSettings({ socialLinks: v })} /></>
               )}
               {activeEditorSection === 'legal' && (
                  <><div className="space-y-6"><SettingField label="Disclosure Title" value={tempSettings.disclosureTitle} onChange={v => updateTempSettings({ disclosureTitle: v })} /><SettingField label="Disclosure Content (Markdown)" value={tempSettings.disclosureContent} onChange={v => updateTempSettings({ disclosureContent: v })} type="textarea" rows={10} /></div><div className="space-y-6 pt-6 border-t border-slate-800"><SettingField label="Privacy Title" value={tempSettings.privacyTitle} onChange={v => updateTempSettings({ privacyTitle: v })} /><SettingField label="Privacy Content (Markdown)" value={tempSettings.privacyContent} onChange={v => updateTempSettings({ privacyContent: v })} type="textarea" rows={10} /></div><div className="space-y-6 pt-6 border-t border-slate-800"><SettingField label="Terms Title" value={tempSettings.termsTitle} onChange={v => updateTempSettings({ termsTitle: v })} /><SettingField label="Terms Content (Markdown)" value={tempSettings.termsContent} onChange={v => updateTempSettings({ termsContent: v })} type="textarea" rows={10} /></div></>
               )}
               {activeEditorSection === 'integrations' && (
                  <>
                    <IntegrationGuide />
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard size={16} /> Commerce & Payments</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                                <span className="text-sm text-slate-300 font-bold">Enable Direct Sales</span>
                                <div onClick={() => updateTempSettings({ enableDirectSales: !tempSettings.enableDirectSales })} className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${tempSettings.enableDirectSales ? 'bg-primary' : 'bg-slate-700'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-1 ml-1 ${tempSettings.enableDirectSales ? 'translate-x-6' : ''}`}></div>
                                </div>
                            </div>
                            {tempSettings.enableDirectSales && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <SettingField label="Store Currency" value={tempSettings.currency || 'ZAR'} onChange={v => updateTempSettings({ currency: v })} />
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-800 rounded-xl bg-slate-950">
                                            <h5 className="text-xs font-black uppercase text-blue-400 tracking-widest mb-3 flex items-center gap-2"><CreditCard size={14}/> Yoco (Card)</h5>
                                            <SettingField label="Public Key" value={tempSettings.yocoPublicKey || ''} onChange={v => updateTempSettings({ yocoPublicKey: v })} placeholder="pk_test_..." />
                                        </div>
                                        <div className="p-4 border border-slate-800 rounded-xl bg-slate-950">
                                            <h5 className="text-xs font-black uppercase text-red-400 tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={14}/> PayFast</h5>
                                            <SettingField label="Merchant ID" value={tempSettings.payfastMerchantId || ''} onChange={v => updateTempSettings({ payfastMerchantId: v })} />
                                            <SettingField label="Merchant Key" value={tempSettings.payfastMerchantKey || ''} onChange={v => updateTempSettings({ payfastMerchantKey: v })} />
                                            <SettingField label="Passphrase" value={tempSettings.payfastSaltPassphrase || ''} onChange={v => updateTempSettings({ payfastSaltPassphrase: v })} type="password" />
                                        </div>
                                    </div>

                                    <div className="p-4 border border-slate-800 rounded-xl bg-slate-950">
                                        <h5 className="text-xs font-black uppercase text-green-400 tracking-widest mb-3 flex items-center gap-2"><Banknote size={14}/> Manual EFT</h5>
                                        <SettingField label="Bank Instructions" value={tempSettings.bankDetails || ''} onChange={v => updateTempSettings({ bankDetails: v })} type="textarea" rows={4} placeholder="Bank Name: Capitec..." />
                                    </div>

                                    <div className="p-4 border border-slate-800 rounded-xl bg-slate-950">
                                        <h5 className="text-xs font-black uppercase text-amber-400 tracking-widest mb-3 flex items-center gap-2"><Zap size={14}/> Automation</h5>
                                        <SettingField label="Zapier Webhook URL" value={tempSettings.zapierWebhookUrl || ''} onChange={v => updateTempSettings({ zapierWebhookUrl: v })} placeholder="https://hooks.zapier.com/..." />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-6">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Mail size={16} /> EmailJS Configuration</h4>
                        <div className="space-y-4">
                            <SettingField label="Service ID" value={tempSettings.emailJsServiceId || ''} onChange={v => updateTempSettings({ emailJsServiceId: v })} />
                            <SettingField label="Template ID" value={tempSettings.emailJsTemplateId || ''} onChange={v => updateTempSettings({ emailJsTemplateId: v })} />
                            <SettingField label="Public Key" value={tempSettings.emailJsPublicKey || ''} onChange={v => updateTempSettings({ emailJsPublicKey: v })} />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={16} /> Analytics & Tracking</h4>
                        <div className="space-y-4">
                            <SettingField label="Google Analytics ID (G-XXXX)" value={tempSettings.googleAnalyticsId || ''} onChange={v => updateTempSettings({ googleAnalyticsId: v })} />
                            <SettingField label="Facebook Pixel ID" value={tempSettings.facebookPixelId || ''} onChange={v => updateTempSettings({ facebookPixelId: v })} />
                            <SettingField label="TikTok Pixel ID" value={tempSettings.tiktokPixelId || ''} onChange={v => updateTempSettings({ tiktokPixelId: v })} />
                            <SettingField label="Pinterest Tag ID" value={tempSettings.pinterestTagId || ''} onChange={v => updateTempSettings({ pinterestTagId: v })} />
                        </div>
                    </div>
                  </>
               )}
             </div>
             <div className="sticky bottom-0 bg-slate-950 pt-6 pb-2 border-t border-slate-800 mt-8 flex gap-4"><button onClick={() => { setEditorDrawerOpen(false); setTempSettings(settings); }} className="flex-1 py-4 bg-slate-800 text-slate-400 font-bold uppercase text-xs rounded-xl hover:text-white transition-colors">Cancel</button><button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="flex-1 py-4 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-colors shadow-lg shadow-primary/20">Publish Changes</button></div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-600'}`}></div>
                 <span className="text-slate-500">Supabase: <span className={isSupabaseConfigured ? 'text-green-500' : 'text-slate-400'}>{isSupabaseConfigured ? 'Synced' : 'Local'}</span></span>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${connectionHealth?.status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]'}`}></div>
                 <span className="text-slate-500">Latency: <span className="text-white">{connectionHealth?.latency || 0}ms</span></span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <span className="text-slate-600">Session ID: <span className="text-white font-mono">{userId?.substring(0, 8) || 'LOCAL'}</span></span>
              <button onClick={() => refreshAllData()} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                 <RefreshCcw size={12} className={saveStatus === 'saving' ? 'animate-spin' : ''} /> Force Resync
              </button>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-slate-600">Maison Portal v2.5.5</span>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <span className="text-slate-500">100% Secure Handshake</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
