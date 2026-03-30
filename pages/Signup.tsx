
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Mail, Lock, User, Phone, MapPin, Building, Home, Building2, 
  Globe, Hash, CheckCircle2, AlertCircle, Eye, EyeOff, 
  ArrowRight, ArrowLeft, Loader2, Chrome, Facebook, Apple,
  ShieldCheck, Info, Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import { useSettings } from '../App';

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

const Signup: React.FC = () => {
  console.log('Signup component rendering');
  const { settings } = useSettings();
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
    buildingNumber: '',
    streetName: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    newsletter: false,
    termsAccepted: false
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ a: 0, b: 0 });

  // Password Strength Logic
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  // Simple Math CAPTCHA
  useEffect(() => {
    setCaptchaChallenge({
      a: Math.floor(Math.random() * 10),
      b: Math.floor(Math.random() * 10)
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const validateForm = () => {
    if (formData.email !== formData.confirmEmail) {
      setError('Emails do not match.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (passwordStrength < 75) {
      setError('Password is too weak. Please use at least 8 characters, including uppercase, numbers, and symbols.');
      return false;
    }
    if (parseInt(captchaValue) !== captchaChallenge.a + captchaChallenge.b) {
      setError('Incorrect CAPTCHA answer. Please try again.');
      return false;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the Terms and Conditions.');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            buildingNumber: formData.buildingNumber,
            streetName: formData.streetName,
            suburb: formData.suburb,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            country: formData.country,
            newsletter: formData.newsletter,
            role: 'client'
          }
        }
      });

      if (signupError) throw signupError;

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('An account with this email already exists.');
      }

      // Send welcome email via EmailJS if configured
      if (settings.emailJsServiceId && settings.emailJsWelcomeTemplateId && settings.emailJsPublicKey) {
        try {
          await emailjs.send(
            settings.emailJsServiceId,
            settings.emailJsWelcomeTemplateId,
            {
              user_name: formData.fullName,
              user_email: formData.email,
              company_name: settings.companyName,
              company_website: window.location.origin,
              contact_email: settings.contactEmail,
              year: new Date().getFullYear().toString(),
            },
            settings.emailJsPublicKey
          );
          console.log('Welcome email sent successfully');
        } catch (emailErr) {
          console.error('Failed to send welcome email:', emailErr);
          // We don't throw here to not block the user if email fails
        }
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900 rounded-[2.5rem] p-12 text-center border border-slate-800 shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-white mb-4">Account Created!</h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Welcome to {settings.companyName}. Your account has been successfully created. 
            Please check your email to verify your account before logging in.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white transition-all"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950">
      {/* Left Side: Visual / Brand */}
      <div className="hidden md:flex md:w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src={settings.clientLoginHeroImage || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000"} 
            alt="Editorial Fashion" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-12 w-full">
           <h1 className="text-4xl font-serif text-white mb-4 tracking-tighter italic">Join the Collection.</h1>
           <p className="text-slate-400 font-light leading-relaxed mb-8">
             Create an account to access exclusive products, track your orders, and receive personalized recommendations.
           </p>
           
           <div className="space-y-6">
             <div className="flex items-start gap-4">
               <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                 <ShieldCheck size={18} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-xs uppercase tracking-wider">Secure Access</h4>
                 <p className="text-slate-500 text-[10px]">Your data is protected with industry-standard encryption.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                 <CheckCircle2 size={18} />
               </div>
               <div>
                 <h4 className="text-white font-bold text-xs uppercase tracking-wider">Verified Profiles</h4>
                 <p className="text-slate-500 text-[10px]">Join a community of verified curators and enthusiasts.</p>
               </div>
             </div>
           </div>

           <div className="mt-12 pt-8 border-t border-slate-700">
             <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-4">Already have an account?</p>
             <Link 
               to="/login" 
               className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
             >
               Log in here <ArrowRight size={14} />
             </Link>
           </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-slate-950">
        <div className="w-full max-w-2xl space-y-8 relative z-10">
          <form onSubmit={handleSignup} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {/* Section: Personal Info */}
            <div className="space-y-6">
              <h3 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] border-b border-slate-800 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Number</label>
                  <div className="relative group flex">
                    <div className="flex items-center px-4 bg-slate-800 border border-slate-800 border-r-0 rounded-l-xl text-slate-400 text-sm font-bold">
                      +27
                    </div>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-slate-900/50 border border-slate-800 rounded-r-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="82 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Confirm Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="email" 
                      name="confirmEmail"
                      required
                      value={formData.confirmEmail}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="Confirm email"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Security */}
            <div className="space-y-6">
              <h3 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] border-b border-slate-800 pb-2">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        className={`h-full ${
                          passwordStrength <= 25 ? 'bg-red-500' :
                          passwordStrength <= 50 ? 'bg-orange-500' :
                          passwordStrength <= 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
                      Strength: {
                        passwordStrength <= 25 ? 'Weak' :
                        passwordStrength <= 50 ? 'Fair' :
                        passwordStrength <= 75 ? 'Good' :
                        'Strong'
                      }
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Address */}
            <div className="space-y-6">
              <h3 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] border-b border-slate-800 pb-2">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Building / Unit (Optional)</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="buildingNumber"
                      value={formData.buildingNumber}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="Unit 4B, Sky Towers"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Street Name</label>
                  <div className="relative group">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="streetName"
                      required
                      value={formData.streetName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="123 Fashion Street"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Suburb</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="suburb"
                      required
                      value={formData.suburb}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="Sandton"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">City</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="Johannesburg"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Province</label>
                  <div className="relative group">
                    <select 
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all text-sm appearance-none"
                    >
                      <option value="" disabled>Select Province</option>
                      {PROVINCES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <ArrowRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Postal Code</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-sm"
                      placeholder="2196"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Country</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      name="country"
                      required
                      readOnly
                      value={formData.country}
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 outline-none cursor-not-allowed text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Options & CAPTCHA */}
            <div className="space-y-6">
              <h3 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] border-b border-slate-800 pb-2">Preferences & Verification</h3>
              
              <div className="space-y-4">
                <label htmlFor="newsletter" className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1 w-5 h-5">
                    <input 
                      type="checkbox" 
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all ${formData.newsletter ? 'bg-primary border-primary' : 'border-slate-800'}`}></div>
                    <CheckCircle2 size={12} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 transition-opacity pointer-events-none ${formData.newsletter ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-bold group-hover:text-primary transition-colors">Newsletter Opt-in</span>
                    <span className="text-[10px] text-slate-500">Stay updated with our latest collections and exclusive offers.</span>
                  </div>
                </label>

                <label htmlFor="termsAccepted" className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1 w-5 h-5">
                    <input 
                      type="checkbox" 
                      id="termsAccepted"
                      name="termsAccepted"
                      required
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all ${formData.termsAccepted ? 'bg-primary border-primary' : 'border-slate-800'}`}></div>
                    <CheckCircle2 size={12} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 transition-opacity pointer-events-none ${formData.termsAccepted ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-bold group-hover:text-primary transition-colors">
                      I accept the <Link to="/terms" className="text-primary underline underline-offset-4" onClick={(e) => e.stopPropagation()}>Terms and Conditions</Link>
                    </span>
                    <span className="text-[10px] text-slate-500">By creating an account, you agree to our privacy policy and terms.</span>
                  </div>
                </label>
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Bot Protection</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-2xl font-serif text-white italic tracking-widest bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                    {captchaChallenge.a} + {captchaChallenge.b} = ?
                  </div>
                  <input 
                    type="number" 
                    required
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    className="w-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary transition-all text-center text-lg font-bold"
                    placeholder="?"
                  />
                </div>
                <p className="text-[9px] text-slate-600 uppercase tracking-widest">Solve this simple challenge to prove you're human.</p>
              </div>
            </div>

            {/* Social Sign-in */}
            <div className="space-y-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Or continue with</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center p-4 bg-slate-800 hover:bg-white hover:text-slate-900 rounded-xl transition-all group"
                >
                  <Chrome size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex items-center justify-center p-4 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all group"
                >
                  <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  className="flex items-center justify-center p-4 bg-slate-800 hover:bg-white hover:text-slate-900 rounded-xl transition-all group"
                >
                  <Apple size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-primary text-slate-900 font-black uppercase tracking-[0.4em] text-xs rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 disabled:opacity-50 mt-8"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Create Your Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
