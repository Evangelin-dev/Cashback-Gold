import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingBag, X, Loader2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// --- REDUX IMPORTS ---
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchCart, removeFromCart, clearCart, updateCartItemQuantity, checkoutCart } from '../../features/thunks/cartThunks'; // Assuming you create these thunks
import Portal from '../../user/Portal';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // --- GLOBAL STATE FROM REDUX ---
  const { currentUser } = useSelector((state: RootState) => state.auth);
  // Get all cart data directly from the Redux store
  const { items: cartItems, status: cartStatus, error: cartError } = useSelector((state: RootState) => state.cart);

  // --- LOCAL UI STATE (This does NOT change!) ---
  const [isUpdating, setIsUpdating] = useState<number | 'all' | 'checkout' | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{ type: 'remove' | 'clear', itemId?: number } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/SignupPopup');
  }, [currentUser, navigate]);

  // --- DATA FETCHING (Now handled by Redux) ---
  useEffect(() => {
    // If the user is logged in but the cart hasn't been fetched yet, dispatch the action.
    if (currentUser && cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [currentUser, cartStatus, dispatch]);

  // --- HANDLER FUNCTIONS (Now dispatching Redux actions) ---
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

    // Use `.unwrap()` to handle promise states for local UI updates
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

    // Reset local UI state
    setIsUpdating(null);
    setShowConfirmPopup(false);
    setActionToConfirm(null);
  };

  const handleUpdateQuantity = (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(cartItemId);
    dispatch(updateCartItemQuantity({ cartItemId, quantity: newQuantity }))
      .finally(() => setIsUpdating(null));
  };
  
  const handleCheckout = async () => {
    setIsUpdating('checkout');
    try {
      await dispatch(checkoutCart()).unwrap();
      alert("Checkout successful! Your order has been placed.");
      // navigate('/order-confirmation');
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsUpdating(null);
    }
  };

  // --- DYNAMIC CALCULATIONS (No change needed) ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.ornament.price * item.quantity, 0);
  const tax = subtotal * 0.03;
  const total = subtotal + tax;

  // --- UI RENDER LOGIC ---
  if (cartStatus === 'loading') return <div className="flex min-h-[80vh] items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-[#7a1436]" /></div>;
  if (cartError) return <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-6"><div className="text-center text-red-600"><p className="mb-2 text-xl font-semibold">Error</p><p>{cartError}</p></div></div>;
  
  // ... The rest of your JSX remains almost identical ...
  // The only change is in the quantity handler
  return (
      <>
      <div className="min-h-screen bg-slate-50 py-12 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-[#7a1436] sm:text-4xl mt-2">Your Shopping Cart</h1>
            {cartItems.length > 0 && (
              <button onClick={handleClearCart} disabled={isUpdating === 'all'} className="flex mt-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed">
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                    <img src={item.ornament.mainImage} alt={item.ornament.name} className="h-28 w-28 flex-shrink-0 self-center rounded-lg bg-gray-100 object-cover sm:h-24 sm:w-24" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800">{item.ornament.name}</h3>
                      <p className="text-sm text-gray-500">{item.ornament.category}</p>
                      <p className="mt-1 text-base font-semibold text-[#7a1436]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.ornament.price)}</p>
                    </div>
                    <div className="flex w-full items-center justify-between self-stretch sm:w-auto sm:flex-col sm:items-end">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" disabled={isUpdating === item.id}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" disabled={isUpdating === item.id}>
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
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
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(subtotal)}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Taxes (3%)</span><span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tax)}</span></div>
                    <div className="flex justify-between border-t pt-3 text-lg font-bold text-gray-800"><span>Total</span><span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(total)}</span></div>
                  </div>
                  <button onClick={handleCheckout} disabled={isUpdating === 'checkout' || cartItems.length === 0} className="mt-6 w-full rounded-lg bg-[#7a1436] py-3 font-semibold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400">
                    {isUpdating === 'checkout' ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 'Proceed to Checkout'}
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