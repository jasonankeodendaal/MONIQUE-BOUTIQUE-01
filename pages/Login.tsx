
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Info, Chrome, ArrowRight, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { useSettings } from '../App';

const Login: React.FC = () => {
  const { isLocalMode, settings, user } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to Admin if already authenticated
  useEffect(() => {
    if (user && !loginSuccess) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate, loginSuccess]);

  const handleSuccessfulAuth = () => {
    setLoginSuccess(true);
    setLoading(false);
    
    // Aesthetic delay for the "Successful" message
    setTimeout(() => {
      navigate('/admin', { replace: true });
    }, 1800);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLocalMode) {
      setTimeout(() => {
        handleSuccessfulAuth();
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      handleSuccessfulAuth();
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
    if (isLocalMode) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/admin`, 
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });
      if (error) throw error;
      // Note: OAuth redirects immediately, success is handled on the return route
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        <div className="max-w-md w-full px-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
           <div className="relative mb-12">
              {/* Outer Golden Glow */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-[80px] animate-pulse"></div>
              
              {/* Success Ring */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-xl border border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] animate-soft-flicker">
                 <CheckCircle2 size={70} className="text-primary" strokeWidth={1} />
              </div>
           </div>

           <div className="space-y-4">
              <span className="text-primary font-black uppercase text-[10px] tracking-[0.6em] animate-in slide-in-from-bottom-2 duration-500 delay-200 block">Identity Verified</span>
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight leading-none animate-in slide-in-from-bottom-4 duration-700 delay-300">
                Login <br/> <span className="italic font-light text-primary">Successful</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-light animate-in fade-in duration-1000 delay-500">Establishing high-fidelity link to Maison Portal...</p>
           </div>

           <div className="mt-16 w-full max-w-[240px] space-y-4">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-primary animate-[grow_1.8s_ease-in-out]"></div>
              </div>
              <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                 <ShieldCheck size={12} className="text-green-500" />
                 Secure Session Protocol Active
              </div>
           </div>
        </div>
        <style>{`
          @keyframes grow { from { width: 0%; } to { width: 100%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950">
      
      {/* Left Side: Visual / Brand */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src={settings.adminLoginHeroImage || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000"} 
            alt="Editorial Fashion" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-16 w-full">
           <div className="mb-6">
             <span className="inline-block px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white font-black uppercase text-[10px] tracking-[0.3em] mb-4">
                Internal Portal
             </span>
             <h1 className="text-6xl font-serif text-white leading-none tracking-tighter">
                {settings.companyName}
             </h1>
             <p className="text-xl text-primary font-serif italic mt-2">
                {settings.slogan}
             </p>
           </div>
           <div className="h-px w-24 bg-primary/50 mb-6"></div>
           <p className="text-slate-400 max-w-md font-light leading-relaxed">
             Access the central nervous system of your fashion empire. Manage collections, track affiliate performance, and curate the aesthetic.
           </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="absolute inset-0 lg:hidden overflow-hidden z-0">
           <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md space-y-12 relative z-10">
          <div>
            <h2 className={`text-3xl font-serif text-white mb-2 flex items-center gap-3 ${settings.adminLoginAccentEnabled ? 'drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : ''}`}>
              <Lock size={24} className="text-primary"/> {settings.adminLoginTitle || "Concierge Access"}
            </h2>
            <p className="text-slate-500">{settings.adminLoginSubtitle || "Authenticate to enter the bridge dashboard."}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm animate-in slide-in-from-left">
              {error}
            </div>
          )}

          {isLocalMode && (
             <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-4 items-start">
               <Info size={20} className="text-blue-500 flex-shrink-0 mt-1" />
               <div>
                 <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">Local Mode Active</h4>
                 <p className="text-slate-400 text-xs leading-relaxed">
                   Enter any email/password to simulate access. Data is stored locally until you connect Supabase.
                 </p>
               </div>
             </div>
          )}

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading || isLocalMode}
              className="w-full py-4 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
               {loading ? <Loader2 size={18} className="animate-spin" /> : <Chrome size={18} />}
               <span>Continue with Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-600 text-xs font-bold uppercase tracking-widest">Or via Credentials</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Identity</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                    placeholder="admin@brand.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Passkey</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-primary text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Enter Portal</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="text-center">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">
              Secure Environment • v2.0.1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
