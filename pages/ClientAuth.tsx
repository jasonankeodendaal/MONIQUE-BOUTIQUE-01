
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Mail, Lock, ArrowRight, User, ShoppingBag, ArrowLeft, Phone, MapPin, Building, Home, Globe, Chrome } from 'lucide-react';
import { useSettings } from '../App';

const ClientAuth: React.FC = () => {
  const { settings, user, isLocalMode } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consolidated Single State Object for Form Data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    building: '',
    street: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: ''
  });

  // Helper to safely determine redirect target
  const getSafeRedirect = (path: string | null) => {
    if (path && !path.startsWith('/admin') && path !== '/login') {
        return path;
    }
    return '/account';
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(getSafeRedirect(redirectPath));
    }
  }, [user, navigate, redirectPath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    if (isLocalMode) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect to current URL to preserve intent if possible, otherwise Supabase defaults to Site URL
          redirectTo: window.location.href, 
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        // 1. Sign Up User
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              role: 'customer'
            }
          }
        });

        if (authError) throw authError;

        // 2. Create Profile Record (if Supabase is configured and user created)
        if (authData.user && isSupabaseConfigured) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: authData.user.id,
                fullName: formData.fullName,
                phone: formData.phone,
                building: formData.building,
                street: formData.street,
                suburb: formData.suburb,
                city: formData.city,
                province: formData.province,
                postalCode: formData.postalCode,
                updatedAt: Date.now()
            });

            if (profileError) {
                console.error("Profile creation failed:", profileError);
                // We log but don't block the auth flow if profile fails, 
                // though ideally we might want to retry or warn.
            }
        }

        // 3. Handle Session & Redirect
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            navigate(getSafeRedirect(redirectPath));
        } else {
            setError("Please check your email to confirm your account.");
        }

      } else {
        // Login Flow
        const { error } = await supabase.auth.signInWithPassword({ 
            email: formData.email, 
            password: formData.password 
        });
        if (error) throw error;
        
        // Success - navigate
        navigate(getSafeRedirect(redirectPath));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        {/* Nav */}
        <div className="relative z-10 p-6 flex justify-between items-center">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-primary/50 transition-all">
                    <ArrowLeft size={14} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Return Home</span>
            </button>
        </div>

        <div className="flex-grow flex items-center justify-center p-6 relative z-10 overflow-y-auto">
            <div className={`w-full transition-all duration-500 ${mode === 'register' ? 'max-w-2xl' : 'max-w-md'}`}>
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg"></div>
                        <ShoppingBag className="text-primary relative z-10" size={24} />
                    </div>
                    <h1 className="text-3xl font-serif text-white mb-2 tracking-tight">{mode === 'login' ? 'Welcome Back' : 'Join the Maison'}</h1>
                    <p className="text-slate-500 text-sm font-light">
                        {mode === 'login' 
                            ? 'Sign in to access your curated bag and history.' 
                            : 'Create a profile for expedited concierge checkout.'}
                    </p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Glass Shine */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium animate-in slide-in-from-top-2">
                           {error}
                        </div>
                    )}

                    {/* Google Login Section */}
                    <div className="mb-8">
                      <button 
                        onClick={handleGoogleLogin}
                        disabled={loading || isLocalMode}
                        className="w-full py-4 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                         <Chrome size={18} />
                         <span>Continue with Google</span>
                      </button>

                      <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest">Or via Email</span>
                        <div className="flex-grow border-t border-slate-800"></div>
                      </div>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        
                        {/* --- PERSONAL DETAILS --- */}
                        <div className="space-y-5">
                            {mode === 'register' && (
                                <div className="grid md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                            <input 
                                                type="text" 
                                                name="fullName"
                                                required
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Mobile</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                                placeholder="+27..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-1 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Identity</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                        <input 
                                            type="email" 
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Passkey</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                        <input 
                                            type="password" 
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- ADDRESS DETAILS (Register Only) --- */}
                        {mode === 'register' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 pt-4 border-t border-slate-800">
                                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-2 flex items-center gap-2">
                                    <MapPin size={12}/> Shipping Destination
                                </h4>
                                
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Building / Unit</label>
                                        <div className="relative group">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                            <input 
                                                type="text" 
                                                name="building"
                                                value={formData.building}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                                placeholder="Apt 4B"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Street Address</label>
                                        <div className="relative group">
                                            <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                            <input 
                                                type="text" 
                                                name="street"
                                                required
                                                value={formData.street}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                                placeholder="123 Fashion Ave"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Suburb</label>
                                        <input 
                                            type="text" 
                                            name="suburb"
                                            value={formData.suburb}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                            placeholder="Sandton"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">City</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                                            <input 
                                                type="text" 
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                                placeholder="Johannesburg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Province</label>
                                        <input 
                                            type="text" 
                                            name="province"
                                            required
                                            value={formData.province}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                            placeholder="Gauteng"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Postal Code</label>
                                        <input 
                                            type="text" 
                                            name="postalCode"
                                            required
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-700 text-sm font-medium"
                                            placeholder="2196"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-primary text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-50 mt-6 group"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>{mode === 'login' ? 'Authenticate' : 'Create Profile'}</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center border-t border-slate-800 pt-6">
                        <p className="text-slate-500 text-xs">
                            {mode === 'login' ? "New to the Maison?" : "Already hold an account?"}
                            <button 
                                onClick={() => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    setError(null);
                                    if(mode === 'register') {
                                        // Optional: Reset non-login fields when switching back
                                        setFormData(prev => ({...prev, email: prev.email, password: prev.password}));
                                    }
                                }}
                                className="text-primary font-bold uppercase tracking-widest ml-2 hover:text-white transition-colors focus:outline-none"
                            >
                                {mode === 'login' ? 'Join Now' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ClientAuth;
