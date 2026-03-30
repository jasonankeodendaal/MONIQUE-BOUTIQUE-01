import React, { useState } from 'react';
import { useSettings } from '../App';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateWhatsAppLink, formatInquiryMessage } from '../src/lib/whatsapp';
import LeadCaptureModal from '../src/components/LeadCaptureModal';
import { Order } from '../types';

const Cart = () => {
  const { cart, products, updateCartQuantity, removeFromCart, settings, user, updateData, logEvent, clearCart } = useSettings();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleInquiryClick = () => {
    if (!user) {
      setIsLeadModalOpen(true);
    } else {
      processInquiry({ name: user.user_metadata?.full_name || user.email, email: user.email });
    }
  };

  const processInquiry = async (leadData: { name: string; email: string }) => {
    if (!settings.whatsappNumber) {
      alert("WhatsApp inquiry is currently unavailable.");
      return;
    }

    setIsProcessing(true);
    try {
      // Shadow Order Logging
      const shadowOrder: Order = {
        id: crypto.randomUUID(),
        orderNumber: `CRT-${Date.now().toString().slice(-6)}`,
        clientId: user?.id || 'guest',
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.product!.name,
          sku: item.product!.sku,
          price: item.product!.price,
          quantity: item.quantity
        })),
        totalAmount: subtotal,
        status: 'Pending WhatsApp Inquiry',
        notes: `Inquiry from ${leadData.name} (${leadData.email})`,
        createdAt: Date.now()
      };

      await updateData('orders', shadowOrder);
      logEvent('click', 'Cart WhatsApp Inquiry');

      // Format message and redirect
      const inquiryItems = cartItems.map(item => ({
        name: item.product!.name,
        variant: item.variations ? Object.values(item.variations).join('/') : undefined,
        price: item.product!.price,
        quantity: item.quantity
      }));

      const message = formatInquiryMessage(inquiryItems);
      const link = generateWhatsAppLink(settings.whatsappNumber, message);
      
      // Clear cart after successful logging
      await clearCart();
      
      window.open(link, '_blank');
    } catch (error) {
      console.error("Failed to process inquiry:", error);
    } finally {
      setIsProcessing(false);
      setIsLeadModalOpen(false);
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
              onClick={handleInquiryClick}
              disabled={isProcessing || !settings.whatsappNumber}
              className={`w-full rounded-none border border-transparent px-4 py-3 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center justify-center gap-2 transition-all ${
                !settings.whatsappNumber 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
              title={!settings.whatsappNumber ? "WhatsApp number not configured" : ""}
            >
              {isProcessing ? 'Processing Inquiry...' : 'Send Inquiry via WhatsApp'}
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
      <LeadCaptureModal 
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onConfirm={processInquiry}
      />
    </div>
  );
};

export default Cart;
