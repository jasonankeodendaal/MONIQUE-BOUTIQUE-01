import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../App';
import { Package, Clock, CheckCircle2, XCircle, ArrowLeft, LogOut, Heart, Trash2, User, Save, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order, Product, WishlistItem } from '../types';
import { generateWhatsAppMessage } from '../lib/whatsapp';

const Account: React.FC = () => {
  const { user, orders, settings, wishlist, products, deleteData, updateData, logEvent } = useSettings();
  const navigate = useNavigate();
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  
  // Profile state
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.name || '',
    phone: user?.phone || '',
    buildingNumber: user?.buildingNumber || '',
    streetName: user?.streetName || '',
    suburb: user?.suburb || '',
    city: user?.city || '',
    province: user?.province || '',
    postalCode: user?.postalCode || '',
    country: user?.country || ''
  });
  
  // Order modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSavingProfile(true);
    try {
      // Update Supabase auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profileData.name }
      });
      
      if (authError) throw authError;
      
      // Update clients table
      const success = await updateData('clients', {
        id: user.id,
        ...profileData
      });
      
      if (success) {
        logEvent('system', 'Profile updated successfully');
        // Show success toast or message here if needed
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleWhatsAppInquiry = async () => {
    if (!user || wishlistProducts.length === 0) return;

    setIsProcessing(true);
    try {
      const orderId = crypto.randomUUID();
      
      const subtotal = wishlistProducts.reduce((sum, wp) => sum + wp.product.price, 0);

      const orderData = {
        id: orderId,
        userId: user.id,
        status: 'Pending WhatsApp Inquiry',
        totalAmount: subtotal,
        shippingAddress: { name: user.user_metadata?.full_name, email: user.email },
        createdAt: Date.now()
      };

      // Shadow Order Logging
      await updateData('orders', orderData);
      
      // Log items
      for (const wp of wishlistProducts) {
        await updateData('order_items', {
          id: crypto.randomUUID(),
          orderId: orderId,
          productId: wp.product.id,
          quantity: 1,
          priceAtTime: wp.product.price,
          variations: wp.item.variations
        });
      }

      logEvent('checkout', `WhatsApp Inquiry Wishlist - Total: ${subtotal}`);

      const itemsForMessage = wishlistProducts.map(wp => ({
        product: wp.product,
        quantity: 1,
        variations: wp.item.variations
      }));

      const message = generateWhatsAppMessage(itemsForMessage, subtotal, settings.currencySymbol);
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '')}?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error logging shadow order:', error);
      const subtotal = wishlistProducts.reduce((sum, wp) => sum + wp.product.price, 0);
      const itemsForMessage = wishlistProducts.map(wp => ({
        product: wp.product,
        quantity: 1,
        variations: wp.item.variations
      }));
      const message = generateWhatsAppMessage(itemsForMessage, subtotal, settings.currencySymbol);
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsProcessing(false);
    }
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
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'profile' ? 'bg-white text-slate-900 border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <User size={18} /> Profile & Address
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
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Total</p>
                            <p className="text-sm text-slate-900 font-medium">${order.totalAmount.toFixed(2)}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </div>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="ml-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            View Details
                          </button>
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
                <div className="space-y-8">
                  <div className="flex justify-end">
                    <button
                      onClick={handleWhatsAppInquiry}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#128C7E] transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                      Send Inquiry via WhatsApp
                    </button>
                  </div>
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
                        
                        <Link to={`/product/${product.id}`} className="block aspect-square bg-slate-50 overflow-hidden">
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
                          <Link to={`/product/${product.id}`} className="block mb-2">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                          </Link>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                          
                          {item.variations && Object.keys(item.variations).length > 0 && (
                            <div className="mb-4 text-xs text-slate-500">
                              {Object.entries(item.variations).map(([k, v]) => (
                                <span key={k} className="inline-block bg-slate-100 px-2 py-1 rounded mr-2 mb-1">{k}: {v as string}</span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-lg font-serif text-slate-900">{settings.currencySymbol}{product.price.toFixed(2)}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Added {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-xl font-serif text-slate-900 mb-2">Profile & Address</h3>
                  <p className="text-sm text-slate-500">
                    Manage your personal information and default shipping address for faster checkout.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                      <User size={16} /> Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin size={16} /> Default Shipping Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Building / Unit</label>
                        <input
                          type="text"
                          value={profileData.buildingNumber}
                          onChange={(e) => setProfileData({ ...profileData, buildingNumber: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. Apt 4B, Building Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Street Name</label>
                        <input
                          type="text"
                          value={profileData.streetName}
                          onChange={(e) => setProfileData({ ...profileData, streetName: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. 123 Main St"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Suburb</label>
                        <input
                          type="text"
                          value={profileData.suburb}
                          onChange={(e) => setProfileData({ ...profileData, suburb: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. Sandton"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">City</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. Johannesburg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Province / State</label>
                        <input
                          type="text"
                          value={profileData.province}
                          onChange={(e) => setProfileData({ ...profileData, province: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. Gauteng"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={profileData.postalCode}
                          onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. 2000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Country</label>
                        <input
                          type="text"
                          value={profileData.country}
                          onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. South Africa"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isSavingProfile ? (
                        <>Saving...</>
                      ) : (
                        <><Save size={16} /> Save Profile</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-xl font-serif text-slate-900">Order Details</h3>
                <p className="text-sm text-slate-500 mt-1">Order #{selectedOrder.id.substring(0, 8)}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Date Placed</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Shipping Address</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedOrder.shippingAddress || 'No shipping address provided.'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tracking Information</h4>
                  {selectedOrder.trackingNumber ? (
                    <div>
                      <p className="text-sm font-mono font-medium text-slate-900 mb-2">{selectedOrder.trackingNumber}</p>
                      <a 
                        href={`https://www.google.com/search?q=${selectedOrder.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        Track Package &rarr;
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Tracking details will appear here once your order ships.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl">
                      <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Package size={20} />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-1">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">${item.price.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">Subtotal</span>
                  <span className="text-sm font-medium text-slate-900">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-500">Shipping</span>
                  <span className="text-sm font-medium text-slate-900">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-xl font-serif text-slate-900">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-3 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-800 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
