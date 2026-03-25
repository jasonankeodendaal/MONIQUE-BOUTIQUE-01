
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Info, Chrome, ArrowRight, CheckCircle2, ShieldCheck, Loader2, ArrowLeft, Rocket, Shield } from 'lucide-react';
import { useSettings } from '../App';

const AdminLogin: React.FC = () => {
  const { settings, user } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'forgot-password'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    if (viewParam === 'forgot-password') {
      setView('forgot-password');
    } else {
      setView('login');
    }
  }, [location.search]);

  // Redirect to Admin if already authenticated as admin
  useEffect(() => {
    if (user) {
      if (user.user_metadata?.role !== 'client') {
        navigate('/admin', { replace: true });
      } else {
        // If a client tries to access admin login, maybe sign them out or redirect to account
        navigate('/account', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user?.user_metadata?.role === 'client') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This portal is for administrators only.');
      }
      
      navigate('/admin', { replace: true });
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Incorrect email or password. Please verify your credentials.');
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (error) throw error;
      setSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-slate-950 p-4 lg:p-8 xl:p-12 overflow-hidden">
      <div className="w-full h-full lg:h-auto lg:max-w-5xl flex bg-slate-900 lg:rounded-[3rem] lg:shadow-2xl overflow-hidden border border-transparent lg:border-slate-800">
        
        {/* Left Side: Visual / Brand */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900">
            <img 
              src={settings.adminLoginHeroImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"} 
              alt="Admin Portal" 
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-16 w-full">
             <div className="mb-6">
               <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4">
                  {settings.adminLoginHeroBadge}
               </span>
               <h1 className="text-6xl font-serif text-white leading-none tracking-tighter">
                  {settings.adminLoginHeroTitle}
               </h1>
               <p className="text-xl text-slate-400 font-serif italic mt-2">
                  {settings.adminLoginHeroDescription}
               </p>
             </div>
             <div className="h-px w-24 bg-primary/50 mb-6"></div>
             <p className="text-slate-500 max-w-md font-light leading-relaxed">
               Secure access to the global luxury bridge infrastructure. Manage inventory, process orders, and oversee system operations.
             </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative bg-slate-950/50">
          <div className="w-full max-w-md space-y-12 relative z-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>{settings.adminLoginBackToSite}</span>
          </button>
          <div className="text-center md:text-left">
            <div className={`w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0 border border-primary/20 ${settings.adminLoginAccentEnabled ? 'shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : ''}`}>
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-serif text-white mb-2">
              {view === 'login' ? 'Admin Login' : 'Reset Password'}
            </h2>
            <p className="text-slate-500">Authorized personnel only. All access is logged and monitored.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm animate-in slide-in-from-left">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-500/10 border-l-4 border-green-500 text-green-400 text-sm animate-in slide-in-from-left flex items-center gap-2">
              <CheckCircle2 size={16} />
              {successMessage}
            </div>
          )}

          {view === 'login' ? (
            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-16 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Chrome size={24} className="text-primary group-hover:rotate-12 transition-transform" />
                <span className="font-serif text-lg">{settings.adminLoginGoogleLabel}</span>
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                  <span className="bg-slate-950 px-4 text-slate-500">{settings.adminLoginDividerLabel}</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{settings.adminLoginEmailLabel}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                    placeholder={settings.adminLoginEmailPlaceholder}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{settings.adminLoginPasswordLabel}</label>
                  <button 
                    type="button" 
                    onClick={() => { setView('forgot-password'); setError(null); setSuccessMessage(null); }}
                    className="text-[10px] text-primary hover:text-white transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                    placeholder={settings.adminLoginPasswordPlaceholder}
                  />
                </div>
              </div>
 
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>{settings.adminLoginSubmitLabel}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{settings.adminLoginEmailLabel}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder={settings.adminLoginEmailPlaceholder}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-primary text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Send Recovery Link</span>}
                </button>

                <button 
                  type="button" 
                  onClick={() => { setView('login'); setError(null); setSuccessMessage(null); }}
                  className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>Return to Login</span>
                </button>
              </form>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck size={12}/> Secure Admin Environment
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminLogin;
