import React, { useState } from 'react';
import { useSettings } from '../App';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateWhatsAppMessage } from '../lib/whatsapp';

const Cart = () => {
  const { cart, products, updateCartQuantity, removeFromCart, settings, user, updateData, logEvent } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleWhatsAppInquiry = async () => {
    if (!user && (!guestName || !guestEmail)) {
      setIsModalOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      const orderId = crypto.randomUUID();
      const orderData = {
        id: orderId,
        userId: user?.id || 'guest',
        status: 'Pending WhatsApp Inquiry',
        totalAmount: subtotal,
        shippingAddress: { name: user?.user_metadata?.full_name || guestName, email: user?.email || guestEmail },
        createdAt: Date.now()
      };

      // Shadow Order Logging
      await updateData('orders', orderData);
      
      // Log items
      for (const item of cartItems) {
        await updateData('order_items', {
          id: crypto.randomUUID(),
          orderId: orderId,
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.product?.price || 0,
          variations: item.variations
        });
      }

      logEvent('checkout', `WhatsApp Inquiry - Total: ${subtotal}`);

      const message = generateWhatsAppMessage(cartItems, subtotal, settings.currencySymbol);
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '')}?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error logging shadow order:', error);
      // Fallback to just opening WhatsApp if DB fails
      const message = generateWhatsAppMessage(cartItems, subtotal, settings.currencySymbol);
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our latest collections.
        </p>
        <Link 
          to="/products"
          className="bg-black text-white px-8 py-3 rounded-none hover:bg-gray-900 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif text-gray-900 mb-12">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <img
                    src={item.product?.media?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                    alt={item.product?.name}
                    className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link to={`/product/${item.product?.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                            {item.product?.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">{settings.currencySymbol}{item.product?.price.toLocaleString()}</p>
                      {item.variations && Object.entries(item.variations).map(([key, value]) => (
                        <p key={key} className="mt-1 text-sm text-gray-500">
                          {key}: {value}
                        </p>
                      ))}
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="flex items-center border border-gray-300 rounded-none w-max">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">{settings.currencySymbol}{subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm text-gray-600">
                <span>Shipping estimate</span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Order total</dt>
              <dd className="text-base font-medium text-gray-900">{settings.currencySymbol}{subtotal.toLocaleString()}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button
              onClick={handleWhatsAppInquiry}
              disabled={isProcessing}
              className="w-full rounded-none border border-transparent bg-[#25D366] px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center justify-center gap-2 transition-colors"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
              Send Inquiry via WhatsApp
            </button>
          </div>
        </section>
      </div>

      {/* Lead Capture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Almost there!</h3>
            <p className="text-sm text-gray-500 mb-6">Please provide your details so we can assist you better on WhatsApp.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Name</label>
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Email</label>
                <input 
                  type="email" 
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <button 
                onClick={handleWhatsAppInquiry}
                disabled={!guestName || !guestEmail || isProcessing}
                className="w-full mt-4 py-3 bg-[#25D366] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
                Continue to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
