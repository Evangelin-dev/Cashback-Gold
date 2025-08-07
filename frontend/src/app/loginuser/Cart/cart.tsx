import { Loader2, ShoppingBag, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { clearCart, fetchCart, removeFromCart, updateCartItemQuantity } from '../../features/thunks/cartThunks';
import Portal from '../../user/Portal';

interface OrnamentInCart {
  id: number;
  name: string;
  category: string;
  mainImage: string;
  totalPrice: number;
  totalPriceAfterDiscount: number;
}

interface CartItem {
  id: number;
  userId: number;
  ornament: OrnamentInCart;
  quantity: number;
  createdAt: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { items: cartItems, status: cartStatus, error: cartError } = useSelector((state: RootState) => ({
    ...state.cart,
    items: state.cart.items as unknown as CartItem[],
  }));

  const [isUpdating, setIsUpdating] = useState<number | 'all' | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{ type: 'remove' | 'clear', itemId?: number } | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/SignupPopup');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [currentUser, cartStatus, dispatch]);

  const handleRemoveItem = (cartItemId: number) => {
    setActionToConfirm({ type: 'remove', itemId: cartItemId });
    setShowConfirmPopup(true);
  };

  const handleClearCart = () => {
    setActionToConfirm({ type: 'clear' });
    setShowConfirmPopup(true);
  };

  const handleConfirmAction = async () => {
    if (!actionToConfirm) return;
    const { type, itemId } = actionToConfirm;

    if (type === 'remove' && itemId) {
      setIsUpdating(itemId);
      try {
        await dispatch(removeFromCart({ cartItemId: itemId })).unwrap();
      } catch (err) { alert("Failed to remove item."); }
    }

    if (type === 'clear') {
      setIsUpdating('all');
      try {
        await dispatch(clearCart()).unwrap();
      } catch (err) { alert("Failed to clear the cart."); }
    }

    setIsUpdating(null);
    setShowConfirmPopup(false);
    setActionToConfirm(null);
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.ornament.totalPriceAfterDiscount * item.quantity);
  }, 0);

  // --- REVISED HANDLECHECKOUT: Navigates to the address page ---
  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout', { state: { totalAmount: total, cartItems: cartItems } });
    } else {
      alert("Your cart is empty.");
    }
  };

  if (cartStatus === 'loading') return <div className="flex min-h-[80vh] items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-[#7a1436]" /></div>;
  if (cartError) return <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-6"><div className="text-center text-red-600"><p className="mb-2 text-xl font-semibold">Error</p><p>{cartError}</p></div></div>;
  
  return (
    <>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-[#7a1436] sm:text-4xl mt-2">Your Shopping Cart</h1>
            {cartItems.length > 0 && (
              <button onClick={handleClearCart} disabled={isUpdating === 'all'} className="flex mt-2 sm:mt-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed">
                {isUpdating === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} Clear All
              </button>
            )}
          </div>

          {cartItems.length === 0 && cartStatus === 'succeeded' ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm md:p-12">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
              <h2 className="mt-6 text-xl font-semibold text-gray-800 sm:text-2xl">Your cart is empty</h2>
              <p className="mt-2 text-gray-500">Looks like you haven't added any ornaments yet.</p>
              <button onClick={() => navigate('/buyornaments')} className="mt-6 rounded-lg bg-[#7a1436] px-6 py-3 font-semibold text-white transition-transform hover:scale-105">Start Shopping</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
              <div className="space-y-4 lg:col-span-2">
                {[...cartItems].reverse().map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                    <img src={item.ornament.mainImage} alt={item.ornament.name} className="h-28 w-28 flex-shrink-0 self-center rounded-lg bg-gray-100 object-cover sm:h-24 sm:w-24" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800">{item.ornament.name}</h3>
                      <p className="text-sm text-gray-500">{item.ornament.category}</p>
                      <p className="mt-1 text-base font-semibold text-[#7a1436]">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.ornament.totalPriceAfterDiscount)}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between self-stretch sm:w-auto sm:flex-col sm:items-end sm:gap-4">
                      <div className="font-semibold text-gray-700 text-sm">Qty: {item.quantity}</div>
                      <button onClick={() => handleRemoveItem(item.id)} disabled={isUpdating === item.id} className="flex items-center gap-1.5 rounded-lg p-2 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed">
                        {isUpdating === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-32 rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
                  <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(total)}</span>
                  </div>
                  <button onClick={handleProceedToCheckout} disabled={cartItems.length === 0} className="mt-6 w-full rounded-lg bg-[#7a1436] py-3 font-semibold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showConfirmPopup && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="m-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
              <h3 className="text-xl font-bold text-gray-800">Are you sure?</h3>
              <p className="mt-2 text-gray-600">{actionToConfirm?.type === 'clear' ? "This will remove all items from your cart." : "This will remove the item from your cart."}</p>
              <div className="mt-6 flex justify-center gap-4">
                <button onClick={() => setShowConfirmPopup(false)} className="rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-800 transition-colors hover:bg-gray-300">Cancel</button>
                <button onClick={handleConfirmAction} className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700">Confirm</button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Cart;