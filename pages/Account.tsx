import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../App';
import { Package, Clock, CheckCircle2, XCircle, ArrowLeft, LogOut, Heart, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order, Product, WishlistItem } from '../types';

const Account: React.FC = () => {
  const { user, orders, settings, wishlist, products, deleteData, logEvent } = useSettings();
  const navigate = useNavigate();
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');

  const myWishlistItems = wishlist.filter(item => item.userId === user?.id);
  const wishlistProducts = myWishlistItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { item, product };
  }).filter(wp => wp.product !== undefined) as { item: WishlistItem, product: Product }[];

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

  const handleRemoveWishlist = async (id: string, productId: string) => {
    await deleteData('wishlist', id);
    logEvent('click', `Removed from Wishlist (Account): ${productId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-12">
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
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'orders' ? 'bg-white text-slate-900 border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <Package size={18} /> Order History
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'wishlist' ? 'bg-white text-slate-900 border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <Heart size={18} /> My Wishlist ({wishlistProducts.length})
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'orders' && (
              clientOrders.length === 0 ? (
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Shipping Information</h4>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">{order.shippingAddress || 'No shipping address provided.'}</p>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tracking Number</h4>
                              {order.trackingNumber ? (
                                <p className="text-sm font-mono font-medium text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">{order.trackingNumber}</p>
                              ) : (
                                <p className="text-sm text-slate-500 italic">Not available yet</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Items</h4>
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
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'wishlist' && (
              wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={24} className="text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Save items you love to your wishlist to easily find them later.
                  </p>
                  <button 
                    onClick={() => navigate('/products')}
                    className="mt-6 px-6 py-3 bg-primary text-slate-900 font-bold uppercase tracking-widest text-xs rounded-xl hover:brightness-110 transition-all"
                  >
                    Discover Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map(({ item, product }) => (
                    <div key={item.id} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col">
                      <button 
                        onClick={(e) => { e.preventDefault(); handleRemoveWishlist(item.id, product.id); }}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all shadow-sm"
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <Link to={`/products/${product.id}`} className="block aspect-square bg-slate-50 overflow-hidden">
                        {product.media?.[0]?.type?.startsWith('image/') ? (
                          <img 
                            src={product.media[0].url} 
                            alt={product.media[0].altText || product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package size={48} strokeWidth={1} />
                          </div>
                        )}
                      </Link>
                      
                      <div className="p-5 flex flex-col flex-grow">
                        <Link to={`/products/${product.id}`} className="block mb-2">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-lg font-serif text-slate-900">R{product.price.toFixed(2)}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Added {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
