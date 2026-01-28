
import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../App';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { settings, products } = useSettings();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/client-login?redirect=/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={toggleCart}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
             <ShoppingBag size={20} className="text-primary"/>
             <h2 className="text-white font-serif text-xl tracking-tight">Shopping Bag</h2>
             <span className="bg-white/10 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
          <button onClick={toggleCart} className="p-2 bg-white/5 text-slate-400 hover:text-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
               <ShoppingBag size={48} className="text-slate-600"/>
               <p className="text-slate-400 text-sm">Your bag is currently empty.</p>
               <button 
                onClick={() => { toggleCart(); navigate('/products'); }}
                className="text-primary font-bold uppercase tracking-widest text-xs border-b border-primary pb-0.5"
               >
                 Start Curating
               </button>
            </div>
          ) : (
            cart.map((item) => {
              const productInfo = products.find(p => p.id === item.id);
              const maxStock = productInfo?.stockQuantity ?? item.stockQuantity ?? 0;
              const isMaxed = item.isDirectSale && item.quantity >= maxStock;

              return (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-24 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                  <img src={item.media?.[0]?.url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                   <div>
                     <div className="flex justify-between items-start">
                        <h4 className="text-white font-bold text-sm line-clamp-2 pr-4">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                           <Trash2 size={14} />
                        </button>
                     </div>
                     <p className="text-primary text-xs font-bold mt-1">R {item.price.toLocaleString()}</p>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-800 rounded-lg border border-white/5">
                         <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                         >
                           <Minus size={12} />
                         </button>
                         <span className="w-8 text-center text-xs text-white font-bold">{item.quantity}</span>
                         <button 
                          onClick={() => !isMaxed && updateQuantity(item.id, item.quantity + 1)}
                          className={`p-1.5 text-slate-400 transition-colors ${isMaxed ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                          disabled={isMaxed}
                         >
                           <Plus size={12} />
                         </button>
                      </div>
                      {isMaxed && <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Max Stock</span>}
                   </div>
                </div>
              </div>
            )})
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-slate-950 border-t border-white/10 space-y-4">
             <div className="space-y-2">
                <div className="flex justify-between text-slate-400 text-xs">
                   <span>Subtotal</span>
                   <span>R {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg">
                   <span>Total</span>
                   <span className="text-primary">R {cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-500 text-right">Shipping calculated at checkout.</p>
             </div>
             
             <button 
               onClick={handleCheckout}
               className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
             >
               <span>Proceed to Checkout</span>
               <ArrowRight size={16} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
