import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Chrome, ArrowRight, CheckCircle2, ShieldCheck, Loader2, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { useSettings } from '../App';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden selection:bg-primary/30 selection:text-primary">
      {/* Left Side: Immersive Brand Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-screen sticky top-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={settings.adminLoginHeroImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"} 
            alt="Admin Portal" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/20 to-slate-950"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </motion.div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                <Shield className="text-primary" size={24} />
              </div>
              <span className="text-white font-serif text-2xl tracking-tight">{settings.companyName || 'Admin Portal'}</span>
            </div>
          </motion.div>

          <div className="max-w-xl">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-6 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]">
                <Sparkles size={12} className="animate-pulse" />
                {settings.adminLoginHeroBadge || 'Secure Access'}
              </span>
              <h1 className="text-7xl font-serif text-white leading-[0.9] tracking-tighter mb-6">
                {settings.adminLoginHeroTitle || 'Management Infrastructure'}
              </h1>
              <p className="text-2xl text-slate-300 font-serif italic leading-relaxed opacity-80">
                {settings.adminLoginHeroDescription || 'Oversee operations with precision and security.'}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="h-px w-32 bg-gradient-to-r from-primary to-transparent my-10 origin-left"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-slate-400 font-light leading-relaxed text-lg"
            >
              Authorized personnel only. This environment is protected by multi-layered encryption and continuous monitoring.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              System Online
            </div>
            <div>v2.4.0-Stable</div>
            <div>Encrypted Session</div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative">
        {/* Mobile Background Visual */}
        <div className="lg:hidden absolute inset-0 z-0">
          <img 
            src={settings.adminLoginHeroImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"} 
            alt="Admin Portal" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md space-y-10"
          >
            <div className="flex justify-between items-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span>{settings.adminLoginBackToSite || 'Back to Site'}</span>
              </button>
              
              <div className="lg:hidden flex items-center gap-2">
                <Shield className="text-primary" size={16} />
                <span className="text-white font-serif text-sm tracking-tight">{settings.companyName}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] mb-8`}>
                <Shield size={40} />
              </div>
              <h2 className="text-4xl font-serif text-white tracking-tight">
                {view === 'login' ? (settings.adminLoginHeroTitle || 'Admin Login') : 'Reset Password'}
              </h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                {view === 'login' 
                  ? 'Access the central command interface. Your session is monitored for security.' 
                  : 'Enter your email to receive recovery instructions.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-bold text-xs">!</span>
                  </div>
                  {error}
                </motion.div>
              )}

              {successMessage && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm flex items-start gap-3"
                >
                  <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {view === 'login' ? (
              <div className="space-y-8">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-16 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-primary/30 text-white rounded-2xl flex items-center justify-center gap-4 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] group disabled:opacity-50"
                >
                  <Chrome size={24} className="text-primary group-hover:rotate-12 transition-transform" />
                  <span className="font-serif text-lg">{settings.adminLoginGoogleLabel || 'Continue with Google'}</span>
                </button>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="px-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                    {settings.adminLoginDividerLabel || 'Secure Protocol'}
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                      {settings.adminLoginEmailLabel || 'Email Address'}
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="email" 
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-slate-900/40 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary/50 focus:bg-slate-900 transition-all placeholder:text-slate-700 text-base"
                        placeholder={settings.adminLoginEmailPlaceholder || 'admin@infrastructure.com'}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                        {settings.adminLoginPasswordLabel || 'Security Key'}
                      </label>
                      <button 
                        type="button" 
                        onClick={() => { setView('forgot-password'); setError(null); setSuccessMessage(null); }}
                        className="text-[10px] text-primary font-black uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Recovery
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="password" 
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-slate-900/40 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary/50 focus:bg-slate-900 transition-all placeholder:text-slate-700 text-base"
                        placeholder={settings.adminLoginPasswordPlaceholder || '••••••••'}
                      />
                    </div>
                  </div>
    
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-6 bg-primary text-slate-950 font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(var(--primary-rgb),0.2)] disabled:opacity-50 mt-4"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <span>{settings.adminLoginSubmitLabel || 'Initialize Session'}</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                      {settings.adminLoginEmailLabel || 'Email Address'}
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="email" 
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-slate-900/40 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary/50 focus:bg-slate-900 transition-all placeholder:text-slate-700 text-base"
                        placeholder={settings.adminLoginEmailPlaceholder || 'admin@infrastructure.com'}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-6 bg-primary text-slate-950 font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <span>Request Access Link</span>}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setView('login'); setError(null); setSuccessMessage(null); }}
                    className="w-full py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    <ArrowLeft size={16} />
                    <span>Return to Authentication</span>
                  </button>
                </form>
              </div>
            )}
            
            <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-slate-600 text-[10px] uppercase tracking-widest">
                <ShieldCheck size={14} className="text-primary/50"/> 
                <span>Secure Environment</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors text-[10px] uppercase tracking-widest">Privacy</a>
                <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors text-[10px] uppercase tracking-widest">Terms</a>
                <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors text-[10px] uppercase tracking-widest">Support</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
