import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../App';
import { Package, Clock, CheckCircle2, XCircle, ArrowLeft, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';

const Account: React.FC = () => {
  const { user, orders, settings } = useSettings();
  const navigate = useNavigate();
  const [clientOrders, setClientOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Filter orders for the current client
    const myOrders = orders.filter(order => order.clientId === user.id);
    // Sort by createdAt descending
    myOrders.sort((a, b) => b.createdAt - a.createdAt);
    setClientOrders(myOrders);
  }, [user, orders, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="text-amber-500" size={18} />;
      case 'Processing': return <Package className="text-blue-500" size={18} />;
      case 'Shipped': return <Package className="text-indigo-500" size={18} />;
      case 'Completed': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'Cancelled': return <XCircle className="text-red-500" size={18} />;
      default: return <Clock className="text-slate-500" size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>
            <h1 className="text-3xl font-serif text-slate-900">My Account</h1>
            <p className="text-slate-500 mt-1">Welcome back, {user.user_metadata?.full_name || user.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <Package size={20} className="text-primary" /> Order History
            </h2>
          </div>
          
          <div className="p-6">
            {clientOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  When you place an order via WhatsApp, it will appear here so you can track its status.
                </p>
                <button 
                  onClick={() => navigate('/products')}
                  className="mt-6 px-6 py-3 bg-primary text-slate-900 font-bold uppercase tracking-widest text-xs rounded-xl hover:brightness-110 transition-all"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {clientOrders.map((order) => (
                  <div key={order.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-slate-900 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Total</p>
                          <p className="text-sm text-slate-900 font-medium">${order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package size={20} />
                              </div>
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-medium text-slate-900">{item.name}</p>
                              <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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

export default Account;
