import React, { useState } from 'react';
import { useSettings } from '../types';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, products, settings, clearCart, updateData, user } = useSettings();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: ''
  });

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const newOrder = {
        id: crypto.randomUUID(),
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
          variations: item.variations
        })),
        total: subtotal,
        status: 'pending',
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        createdAt: new Date().toISOString()
      };
      
      await updateData('orders', newOrder);
      await clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Order Confirmed</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Thank you for your purchase. We've received your order and will begin processing it shortly.
        </p>
        <Link 
          to="/account"
          className="bg-black text-white px-8 py-3 rounded-none hover:bg-gray-900 transition-colors"
        >
          View Order History
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-serif text-gray-900 mb-4">Your Cart is Empty</h2>
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
      <div className="flex items-center mb-8">
        <Link to="/cart" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>
      
      <h1 className="text-4xl font-serif text-gray-900 mb-12">Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-none border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-3 border"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-none border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
            Order summary
          </h2>

          <ul className="divide-y divide-gray-200 border-t border-b border-gray-200 mt-6">
            {cartItems.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="flex-shrink-0">
                  <img
                    src={item.product?.media?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                    alt={item.product?.name}
                    className="w-16 h-16 rounded-md object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product?.name}
                      </h3>
                      {item.variations && Object.entries(item.variations).map(([key, value]) => (
                        <p key={key} className="mt-1 text-xs text-gray-500">
                          {key}: {value}
                        </p>
                      ))}
                      <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:pr-9 text-right">
                      <p className="text-sm font-medium text-gray-900">{settings.currencySymbol}{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">{settings.currencySymbol}{subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm text-gray-600">
                <span>Shipping</span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Order total</dt>
              <dd className="text-base font-medium text-gray-900">{settings.currencySymbol}{subtotal.toLocaleString()}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
