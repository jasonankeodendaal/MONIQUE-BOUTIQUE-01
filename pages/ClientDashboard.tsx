
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSettings } from '../App';
import { useCart } from '../context/CartContext';
import { Order } from '../types';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, LogOut, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ClientDashboard: React.FC = () => {
  const { user, orders, loadingAuth, updateData, settings } = useSettings();
  const { cart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(false);

  // Authentication Check
  useEffect(() => {
    if (!loadingAuth && !user) {
        navigate('/client-login');
    }
  }, [user, loadingAuth, navigate]);

  // Load User Orders
  useEffect(() => {
    if (user) {
       const userOrders = orders.filter(o => o.userId === user.id);
       setMyOrders(userOrders.sort((a, b) => b.createdAt - a.createdAt));
    }
  }, [user, orders]);

  // Handle PayFast Return
  useEffect(() => {
    const handlePayFastReturn = async () => {
      const status = searchParams.get('status');
      if (status === 'success' && cart.length > 0 && user) {
          setIsProcessingOrder(true);
          
          // Recover shipping details stored in Checkout.tsx
          const storedShipping = localStorage.getItem('pending_order_shipping');
          const shippingDetails = storedShipping ? JSON.parse(storedShipping) : {
              fullName: user.user_metadata?.full_name || 'Customer',
              email: user.email,
              address: 'Address not provided (PayFast Return)',
              city: '',
              zipCode: ''
          };

          const orderId = `ORD-${Date.now().toString().slice(-6)}`;
          const newOrder: Order = {
              id: orderId,
              userId: user.id,
              customerName: shippingDetails.fullName,
              customerEmail: shippingDetails.email,
              shippingAddress: `${shippingDetails.address}, ${shippingDetails.city} ${shippingDetails.zipCode}`,
              total: cartTotal,
              status: 'paid',
              paymentMethod: 'payfast',
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
              // 1. Save Order
              await updateData('orders', newOrder);
              
              // 2. Save Order Items (Cloud Sync)
              const { isSupabaseConfigured } = await import('../lib/supabase');
              if (isSupabaseConfigured) {
                   await supabase.from('order_items').insert(newOrder.items);
              }

              // 3. Trigger Automation
              if (settings.zapierWebhookUrl) {
                   fetch(settings.zapierWebhookUrl, { method: 'POST', body: JSON.stringify(newOrder), mode: 'no-cors' }).catch(console.warn);
              }

              // 4. Cleanup
              clearCart();
              localStorage.removeItem('pending_order_shipping');
              
              // Clean URL
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('status');
              setSearchParams(newParams);
              
              setOrderSuccessMsg(true);

          } catch (e) {
              console.error("Order generation failed", e);
          } finally {
              setIsProcessingOrder(false);
          }
      } else if (status === 'success' && searchParams.get('order_success')) {
          // If manually navigating or already processed
          setOrderSuccessMsg(true);
      }
    };
    
    if (user && !loadingAuth) {
        handlePayFastReturn();
    }
  }, [searchParams, cart, user, loadingAuth]);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'paid': return 'bg-blue-500 text-white';
          case 'shipped': return 'bg-purple-500 text-white';
          case 'delivered': return 'bg-green-500 text-white';
          case 'cancelled': return 'bg-red-500 text-white';
          default: return 'bg-yellow-500 text-white';
      }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'paid': return <CheckCircle size={14} />;
          case 'shipped': return <Truck size={14} />;
          case 'delivered': return <Package size={14} />;
          default: return <Clock size={14} />;
      }
  };

  const handleLogout = async () => {
     await supabase.auth.signOut();
     navigate('/');
  };

  if (loadingAuth || isProcessingOrder) return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-slate-900" size={32}/>
          {isProcessingOrder && <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Finalizing Transaction...</p>}
      </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20">
       <div className="max-w-5xl mx-auto px-6">
          
          <div className="flex items-end justify-between mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-2">My Account</h1>
                <p className="text-slate-500">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
             </div>
             <button onClick={handleLogout} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-2">
                <LogOut size={16}/> Logout
             </button>
          </div>

          {(searchParams.get('order_success') || orderSuccessMsg) && (
             <div className="mb-10 p-6 bg-green-500/10 border border-green-500/20 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                   <CheckCircle size={24}/>
                </div>
                <div>
                   <h3 className="text-green-700 font-bold text-lg">Order Successfully Placed</h3>
                   <p className="text-green-600 text-sm">Thank you for your purchase. We are processing your order.</p>
                </div>
             </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
             {/* Stats Card */}
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>
                   <h3 className="text-xl font-serif mb-6 relative z-10">Lifetime Value</h3>
                   <div className="text-4xl font-black text-primary mb-2 relative z-10">
                      R {myOrders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0).toLocaleString()}
                   </div>
                   <p className="text-slate-400 text-xs uppercase tracking-widest relative z-10">Total Spend</p>
                </div>

                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem]">
                   <h3 className="text-lg font-serif text-slate-900 mb-6">Quick Actions</h3>
                   <div className="space-y-3">
                      <button onClick={() => navigate('/products')} className="w-full py-4 bg-slate-50 hover:bg-primary hover:text-slate-900 text-slate-600 rounded-xl font-bold uppercase text-xs tracking-widest transition-colors flex items-center justify-between px-6 group">
                         <span>Browse Collections</span>
                         <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900"/>
                      </button>
                      <button onClick={() => navigate('/contact')} className="w-full py-4 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 rounded-xl font-bold uppercase text-xs tracking-widest transition-colors flex items-center justify-between px-6 group">
                         <span>Contact Concierge</span>
                         <ArrowRight size={16} className="text-slate-300 group-hover:text-white"/>
                      </button>
                   </div>
                </div>
             </div>

             {/* Orders List */}
             <div className="lg:col-span-2">
                <h3 className="text-2xl font-serif text-slate-900 mb-6">Order History</h3>
                
                {myOrders.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                      <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4"/>
                      <p className="text-slate-400">No orders found.</p>
                      <button onClick={() => navigate('/products')} className="mt-4 text-primary font-bold uppercase text-xs tracking-widest hover:underline">Start Shopping</button>
                   </div>
                ) : (
                   <div className="space-y-4">
                      {myOrders.map(order => (
                         <div key={order.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                               <div>
                                  <div className="flex items-center gap-3 mb-1">
                                     <span className="text-sm font-black text-slate-900">{order.id}</span>
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)} {order.status.replace('_', ' ')}
                                     </span>
                                  </div>
                                  <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-xl font-black text-slate-900">R {order.total.toLocaleString()}</p>
                                  <p className="text-[10px] uppercase font-bold text-slate-400">{order.paymentMethod}</p>
                               </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                               {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-sm">
                                     <span className="text-slate-700 font-medium"><span className="text-slate-400 mr-2">{item.quantity}x</span> {item.productName}</span>
                                     <span className="text-slate-900 font-bold">R {(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default ClientDashboard;
