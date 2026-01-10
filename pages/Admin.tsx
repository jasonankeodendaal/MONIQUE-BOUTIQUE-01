
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, X, ChevronDown, Search, Filter, Loader2, CheckCircle, 
  Settings as SettingsIcon, Layout, Info, Palette, Globe, Mail, Phone, 
  Briefcase, Database, RefreshCcw, LogOut, BarChart3, Rocket, Terminal, Copy, Check, Megaphone
} from 'lucide-react';
import { Product, Category, CarouselSlide, MediaFile, SiteSettings, Enquiry } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, upsertData, deleteData, SUPABASE_SCHEMA } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, setSaveStatus, refreshAllData,
    products, categories, subCategories, heroSlides, enquiries
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [connectionHealth, setConnectionHealth] = useState<any>(null);

  const [showProductForm, setShowProductForm] = useState(false);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const checkConn = async () => setConnectionHealth(await measureConnection());
    checkConn();
    const interval = setInterval(checkConn, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const performSave = async (tableName: string, data: any, isDelete = false) => {
    setSaveStatus('saving');
    const { error } = isDelete 
      ? await deleteData(tableName, data) 
      : await upsertData(tableName, data);
    
    if (error) setSaveStatus('error');
    else {
      setSaveStatus('saved');
      refreshAllData();
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const renderEnquiries = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif text-white text-left">Inbox</h2>
      {enquiries.map(e => (
        <div key={e.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 text-left">
          <div className="flex-grow">
            <h4 className="text-white font-bold">{e.name} ({e.email})</h4>
            <p className="text-slate-400 text-sm mt-1">{e.message}</p>
          </div>
          <button onClick={() => performSave('enquiries', e.id, true)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-8 text-left">
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
        <h3 className="text-white font-bold text-xl mb-4">Cloud Health</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800 rounded-xl">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Status</span>
            <p className="text-white font-bold">{connectionHealth?.status || 'Unknown'}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Latency</span>
            <p className="text-white font-bold">{connectionHealth?.latency || 0}ms</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
        <h3 className="text-white font-bold text-xl mb-4">SQL Deployment</h3>
        <p className="text-slate-400 text-sm mb-4">Run this in Supabase SQL Editor to refresh schema.</p>
        <div className="bg-slate-950 p-4 rounded-xl overflow-x-auto">
          <pre className="text-[10px] text-primary">{SUPABASE_SCHEMA}</pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <h1 className="text-4xl font-serif text-white">Maison <span className="text-primary italic font-light">Portal</span></h1>
        <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {['enquiries', 'catalog', 'system'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === t ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>
              {t}
            </button>
          ))}
          <button onClick={handleLogout} className="px-6 py-3 text-red-500"><LogOut size={16}/></button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'system' && renderSystem()}
        {activeTab === 'catalog' && (
           <div className="text-white text-left">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif">Catalog</h2>
                <button onClick={() => setShowProductForm(true)} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs">Add Item</button>
              </div>
              <div className="grid gap-4">
                {products.map(p => (
                   <div key={p.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <span>{p.name} - R{p.price}</span>
                      <button onClick={() => performSave('products', p.id, true)} className="text-red-500"><Trash2 size={18}/></button>
                   </div>
                ))}
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
