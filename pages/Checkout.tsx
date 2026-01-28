
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Banknote, Truck, CheckCircle2, Lock, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { useSettings } from '../App';
import { useCart } from '../context/CartContext';
import { Order } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Helper for Yoco SDK type
declare global {
  interface Window {
    YocoSDK: any;
  }
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { settings, user, updateData, products } = useSettings();
  const { cart, cartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.user_metadata?.name || user?.user_metadata?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    phone: user?.user_metadata?.phone || ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'yoco' | 'payfast' | 'manual_eft'>('yoco');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect validation
  useEffect(() => {
    if (!settings.enableDirectSales) {
      navigate('/');
      return;
    }
    if (cart.length === 0) {
      navigate('/products');
      return;
    }
  }, [settings.enableDirectSales, cart.length, navigate]);

  // Fetch Profile for Autofill
  useEffect(() => {
    const fetchProfile = async () => {
        if (!user || !isSupabaseConfigured) return;
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (data && !error) {
                // Construct address string from components
                const streetPart = data.street || '';
                const buildingPart = data.building ? `${data.building}, ` : '';
                const suburbPart = data.suburb ? `, ${data.suburb}` : '';
                const fullAddress = `${buildingPart}${streetPart}${suburbPart}`;

                setShippingDetails(prev => ({
                    ...prev,
                    fullName: data.fullName || prev.fullName,
                    phone: data.phone || prev.phone,
                    address: fullAddress || prev.address,
                    city: data.city || prev.city,
                    zipCode: data.postalCode || prev.zipCode,
                    // If email wasn't in metadata but user is logged in
                    email: prev.email || user.email || ''
                }));
            }
        } catch (e) {
            console.warn("Profile fetch failed, using manual entry.");
        }
    };
    fetchProfile();
  }, [user, isSupabaseConfigured]);

  const handleOrderSuccess = async (method: 'yoco' | 'payfast' | 'manual_eft') => {
    setIsProcessing(true);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    const newOrder: Order = {
      id: orderId,
      userId: user?.id,
      customerName: shippingDetails.fullName,
      customerEmail: shippingDetails.email,
      shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zipCode}`,
      total: cartTotal,
      status: method === 'manual_eft' ? 'pending_payment' : 'paid',
      paymentMethod: method,
      createdAt: Date.now(),
      items: cart.map(c => ({
          id: Math.random().toString(36).substr(2, 9),
          orderId: orderId,
          productId: c.id,
          productName: c.name,
          quantity: c.quantity,
          price: c.price
      }))
    };

    try {
      // 1. Save Order to DB
      await updateData('orders', newOrder);
      
      // 2. Save Items (If using relational DB structure)
      if (isSupabaseConfigured) {
         const { error } = await supabase.from('order_items').insert(newOrder.items);
         if (error) console.error("Item save error", error);
      }

      // 3. Decrement Stock
      if (newOrder.items) {
          for (const item of newOrder.items) {
              const product = products.find(p => p.id === item.productId);
              if (product && product.isDirectSale && typeof product.stockQuantity === 'number') {
                  const newStock = Math.max(0, product.stockQuantity - item.quantity);
                  await updateData('products', { ...product, stockQuantity: newStock });
              }
          }
      }

      // 4. Trigger Zapier Automation
      if (settings.zapierWebhookUrl) {
        fetch(settings.zapierWebhookUrl, {
          method: 'POST',
          body: JSON.stringify(newOrder),
          mode: 'no-cors' // Often needed for webhooks to avoid CORS blocks
        }).catch(err => console.warn("Zapier trigger warning", err));
      }

      // 5. Cleanup
      clearCart();
      navigate('/account?order_success=true');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
      setIsProcessing(false);
    }
  };

  const handleYocoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.YocoSDK) {
        setError("Payment gateway initializing...");
        return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
        const yoco = new window.YocoSDK({ publicKey: settings.yocoPublicKey });
        yoco.showPopup({
            amountInCents: Math.round(cartTotal * 100),
            currency: settings.currency || 'ZAR',
            name: settings.companyName,
            description: `Order by ${shippingDetails.email}`,
            callback: (result: any) => {
                if (result.error) {
                    setError(result.error.message);
                    setIsProcessing(false);
                } else {
                    console.log("Yoco Token Generated:", result.id);
                    // Token successful, proceed to create order
                    handleOrderSuccess('yoco');
                }
            }
        });
    } catch (err: any) {
        setError(err.message);
        setIsProcessing(false);
    }
  };

  const handlePayFastRedirect = () => {
      // Persist shipping details so we can create the order on the return page
      localStorage.setItem('pending_order_shipping', JSON.stringify(shippingDetails));
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 md:pt-40 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Steps */}
          <div className="w-full lg:w-7/12 space-y-8">
            <div className="flex items-center gap-4 mb-8">
               <h1 className="text-3xl md:text-5xl font-serif text-slate-900">Secure Checkout</h1>
               <Lock size={24} className="text-primary" />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            {/* Step 1: Shipping */}
            <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${step === 'shipping' ? 'bg-white border-primary shadow-2xl shadow-primary/5' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                    Shipping Details
                  </h3>
                  {step === 'payment' && <button onClick={() => setStep('shipping')} className="text-xs font-bold uppercase tracking-widest text-primary">Edit</button>}
               </div>

               {step === 'shipping' && (
                 <form onSubmit={(e) => { e.preventDefault(); setStep('payment'); }} className="space-y-6 animate-in fade-in">
                    {user && (
                       <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3 text-xs text-slate-600 mb-4">
                          <CheckCircle2 size={16} className="text-primary"/>
                          Details pre-filled from your profile.
                       </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Full Name</label>
                          <input required type="text" value={shippingDetails.fullName} onChange={e => setShippingDetails({...shippingDetails, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email Address</label>
                          <input required type="email" value={shippingDetails.email} onChange={e => setShippingDetails({...shippingDetails, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" />
                       </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Street Address</label>
                        <input required type="text" value={shippingDetails.address} onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" placeholder="123 Fashion Ave" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                       <div className="space-y-2 md:col-span-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">City</label>
                          <input required type="text" value={shippingDetails.city} onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" />
                       </div>
                       <div className="space-y-2 md:col-span-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Zip Code</label>
                          <input required type="text" value={shippingDetails.zipCode} onChange={e => setShippingDetails({...shippingDetails, zipCode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" />
                       </div>
                       <div className="space-y-2 md:col-span-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Mobile</label>
                          <input required type="tel" value={shippingDetails.phone} onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900" />
                       </div>
                    </div>
                    <button type="submit" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-slate-900 transition-colors flex items-center gap-2">
                       Continue to Payment <ArrowRight size={16}/>
                    </button>
                 </form>
               )}
            </div>

            {/* Step 2: Payment */}
            <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${step === 'payment' ? 'bg-white border-primary shadow-2xl shadow-primary/5' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                    Payment Method
                  </h3>
               </div>

               {step === 'payment' && (
                 <div className="space-y-8 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       <button 
                        onClick={() => setPaymentMethod('yoco')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'yoco' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                       >
                          <CreditCard size={24}/>
                          <span className="text-xs font-bold uppercase">Card (Yoco)</span>
                       </button>
                       <button 
                        onClick={() => setPaymentMethod('payfast')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'payfast' ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                       >
                          <ShieldCheck size={24}/>
                          <span className="text-xs font-bold uppercase">PayFast</span>
                       </button>
                       <button 
                        onClick={() => setPaymentMethod('manual_eft')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'manual_eft' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                       >
                          <Banknote size={24}/>
                          <span className="text-xs font-bold uppercase">Manual EFT</span>
                       </button>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 min-h-[200px]">
                       {paymentMethod === 'yoco' && (
                          <div className="space-y-4">
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                <CreditCard size={14}/> Secure Card Payment via Yoco
                             </div>
                             {settings.yocoPublicKey ? (
                               <>
                                 <button onClick={handleYocoSubmit} disabled={isProcessing} className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-widest text-xs rounded-xl hover:brightness-110 flex items-center justify-center gap-2 transition-all">
                                    {isProcessing ? <Loader2 className="animate-spin" size={16}/> : `Pay R ${cartTotal.toLocaleString()}`}
                                 </button>
                                 <p className="text-[10px] text-center text-slate-400">A secure popup will appear to process your card details.</p>
                               </>
                             ) : (
                               <div className="text-red-500 text-sm">Yoco Public Key not configured in Admin settings.</div>
                             )}
                          </div>
                       )}

                       {paymentMethod === 'payfast' && (
                          <div className="text-center py-4 space-y-6">
                             <p className="text-slate-500 text-sm">You will be redirected to PayFast to complete your payment securely.</p>
                             <form action="https://www.payfast.co.za/eng/process" method="POST" onSubmit={handlePayFastRedirect}>
                                <input type="hidden" name="merchant_id" value={settings.payfastMerchantId} />
                                <input type="hidden" name="merchant_key" value={settings.payfastMerchantKey} />
                                <input type="hidden" name="return_url" value={`${window.location.origin}/#/account?status=success`} />
                                <input type="hidden" name="cancel_url" value={`${window.location.origin}/#/checkout`} />
                                <input type="hidden" name="amount" value={cartTotal.toFixed(2)} />
                                <input type="hidden" name="item_name" value={`Order for ${shippingDetails.fullName}`} />
                                <button type="submit" className="px-8 py-4 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20">
                                   Proceed to PayFast
                                </button>
                             </form>
                          </div>
                       )}

                       {paymentMethod === 'manual_eft' && (
                          <div className="space-y-6">
                             <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm space-y-2 font-mono text-slate-600">
                                <p className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">Banking Details:</p>
                                <div className="whitespace-pre-wrap">{settings.bankDetails || 'No banking details configured.'}</div>
                                <p className="pt-2 text-xs text-primary font-bold">Ref: Use your Name/Email</p>
                             </div>
                             <button onClick={() => handleOrderSuccess('manual_eft')} disabled={isProcessing} className="w-full py-4 bg-green-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-green-700 flex items-center justify-center gap-2">
                                {isProcessing ? <Loader2 className="animate-spin" size={16}/> : 'Place Order (EFT)'}
                             </button>
                          </div>
                       )}
                    </div>
                 </div>
               )}
            </div>

          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="w-full lg:w-5/12">
             <div className="sticky top-32">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[60px] -mr-10 -mt-10"></div>
                   
                   <h3 className="text-2xl font-serif mb-6 relative z-10">Order Summary</h3>
                   
                   <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar relative z-10">
                      {cart.map(item => (
                         <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                               <img src={item.media?.[0]?.url} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-grow">
                               <h4 className="font-bold text-sm line-clamp-2">{item.name}</h4>
                               <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                                  <span className="text-sm font-mono text-primary">R {item.price.toLocaleString()}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="space-y-3 pt-6 border-t border-white/10 relative z-10">
                      <div className="flex justify-between text-slate-400 text-sm">
                         <span>Subtotal</span>
                         <span>R {cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-sm">
                         <span>Shipping</span>
                         <span className="text-green-400">Free</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10">
                         <span>Total</span>
                         <span className="text-primary">R {cartTotal.toLocaleString()}</span>
                      </div>
                   </div>

                   <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest relative z-10">
                      <Truck size={14}/> Secure Shipping via Aramex
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
