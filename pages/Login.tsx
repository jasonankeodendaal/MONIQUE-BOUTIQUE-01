
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Info, Chrome, ArrowRight, CheckCircle2, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { useSettings } from '../App';

const Login: React.FC = () => {
  const { settings, user } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    if (viewParam === 'signup') {
      setView('signup');
    } else if (viewParam === 'forgot-password') {
      setView('forgot-password');
    } else {
      setView('login');
    }
  }, [location.search]);

  // Redirect to Account if already authenticated
  useEffect(() => {
    if (user) {
      if (user.user_metadata?.role === 'client') {
        navigate('/account', { replace: true });
      } else {
        // Admins can also see their account or be redirected to admin
        navigate('/admin', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSuccessfulAuth = async (authUser: any) => {
    if (authUser?.user_metadata?.role === 'client') {
      navigate('/account', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      handleSuccessfulAuth(data.user);
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Incorrect email or password. Please verify your credentials.');
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
            role: 'client'
          }
        }
      });
      if (error) throw error;
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Account created successfully! You can now log in.');
      setView('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`, 
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

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-slate-950 p-4 lg:p-8 xl:p-12 overflow-hidden">
      <div className="w-full h-full lg:h-auto lg:max-w-5xl flex bg-slate-900 lg:rounded-[3rem] lg:shadow-2xl overflow-hidden border border-transparent lg:border-slate-800">
        
        {/* Left Side: Visual / Brand */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
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
                  Exclusive Access
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
               Join our community of fashion enthusiasts. Track your orders, manage your preferences, and stay updated with our latest collections.
             </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative bg-slate-950/50">
          <div className="absolute inset-0 md:hidden overflow-hidden z-0">
             <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="w-full max-w-md space-y-12 relative z-10">
          <div>
            <h2 className={`text-3xl font-serif text-white mb-2 flex items-center gap-3 ${settings.adminLoginAccentEnabled ? 'drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : ''}`}>
              <Lock size={24} className="text-primary"/> {view === 'login' ? settings.loginHeroTitle : view === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-slate-500">{view === 'login' ? settings.loginHeroDescription : view === 'signup' ? 'Sign up to track your orders and history.' : 'Enter your email to receive password reset instructions.'}</p>
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

          {view === 'login' || view === 'signup' ? (
            <div className="space-y-6">
               <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                 {loading ? <Loader2 size={18} className="animate-spin" /> : <Chrome size={18} />}
                 <span>{settings.loginGoogleLabel}</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-600 text-xs font-bold uppercase tracking-widest">{settings.loginDividerLabel}</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <form onSubmit={view === 'login' ? handleEmailLogin : handleEmailSignup} className="space-y-6">
                {view === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{settings.loginEmailLabel}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder={settings.loginEmailPlaceholder}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{settings.loginPasswordLabel}</label>
                    {view === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => { navigate('/login?view=forgot-password', { replace: true }); setError(null); setSuccessMessage(null); }}
                        className="text-[10px] text-primary hover:text-white transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="password" 
                      required
                      autoComplete={view === 'login' ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder={settings.loginPasswordPlaceholder}
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
                      <span>{view === 'login' ? settings.loginSubmitLabel : 'Create Account'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center mt-6">
                <button 
                  type="button"
                  onClick={() => { 
                    const newView = view === 'login' ? 'signup' : 'login';
                    navigate(`/login?view=${newView}`, { replace: true });
                    setError(null); 
                    setSuccessMessage(null); 
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {view === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{settings.loginEmailLabel}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder={settings.loginEmailPlaceholder}
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
                      <span>Send Reset Link</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={() => { navigate('/login?view=login', { replace: true }); setError(null); setSuccessMessage(null); }}
                  className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Login</span>
                </button>
              </form>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">
              Secure Environment • v2.0.1
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
