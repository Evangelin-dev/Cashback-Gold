import { Home, Loader2, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import axiosInstance from '../../../utils/axiosInstance';
import Portal from '../../user/Portal';
import { CartItem } from '../../types/type'; 
import useRazorpay from './useRazorpay'; // Your custom hook path

// --- Interface to match API ---
interface Address {
  id: number;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  mobile: string;
}

type NewAddressData = Omit<Address, 'id'>;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const { isLoaded: isRazorpayLoaded, error: razorpayError } = useRazorpay();

  const { totalAmount, cartItems } = location.state || {};

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const [newAddress, setNewAddress] = useState<NewAddressData>({
    fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', mobile: ''
  });

  useEffect(() => {
    if (!totalAmount || !cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [totalAmount, cartItems, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get('/user/addresses');
        setAddresses(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
        } else {
          setShowAddressForm(true);
        }
      } catch (error) { console.error("Failed to fetch addresses:", error); } 
      finally { setLoadingAddresses(false); }
    };
    if (currentUser) { fetchAddresses(); }
  }, [currentUser]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/addresses', newAddress);
      const savedAddress = response.data;
      setAddresses([...addresses, savedAddress]);
      setSelectedAddressId(savedAddress.id);
      setShowAddressForm(false);
      setNewAddress({ fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', mobile: '' });
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Failed to save address.");
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddressId) {
      setSubmitError("Please select a delivery address.");
      return;
    }
    
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
        setSubmitError("Selected address not found. Please try again.");
        return;
    }

    setIsSubmittingPayment(true);
    setSubmitError(null);

    try {
      // --- THE FINAL FIX: Sending the full address object to the initiate API ---
      const addressPayload = {
        fullName: selectedAddress.fullName,
        mobile: selectedAddress.mobile,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2 || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
      };

      const initiateRes = await axiosInstance.post('/api/orders/checkout/initiate', addressPayload);
      const { orderId: razorpayOrderId, amount, receipt } = initiateRes.data;

      const options = {
        key: window.RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Ornaments Purchase',
        description: `Receipt: ${receipt}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          const callbackPayload = {
            razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            amount,
          };
          try {
            await axiosInstance.post('/api/orders/checkout/callback', callbackPayload);
            setShowSuccessPopup(true);
          } catch (err: any) {
            setSubmitError(err.response?.data?.message || 'Payment verification failed.');
          } finally {
            setIsSubmittingPayment(false);
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: currentUser?.email || '',
          contact: selectedAddress.mobile,
        },
        theme: { color: '#7a1335' },
        modal: { ondismiss: () => setIsSubmittingPayment(false) }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Could not initiate payment.");
      setIsSubmittingPayment(false);
    }
  };

  if (!totalAmount) return null;

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-[#7a1436] sm:text-4xl mt-2 mb-8">Checkout</h1>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Delivery Address</h2>
                {loadingAddresses ? <Loader2 className="animate-spin" /> : (
                  <div className="space-y-4">{addresses.map(address => (<div key={address.id} onClick={() => setSelectedAddressId(address.id)} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedAddressId === address.id ? 'border-[#7a1436] bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}><p className="font-bold text-gray-800">{address.fullName}</p><p className="text-sm text-gray-600">{address.addressLine1}, {address.addressLine2}</p><p className="text-sm text-gray-600">{address.city}, {address.state} - {address.postalCode}</p><p className="text-sm text-gray-600">Mobile: {address.mobile}</p></div>))}
                    {!showAddressForm && ( <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#7a1436] transition-colors hover:bg-rose-50"><Plus className="h-4 w-4" /> Add a New Address</button> )}</div>
                )}
              </div>
              {showAddressForm && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Add a New Address</h2>
                  <form onSubmit={handleSaveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4"><input name="fullName" value={newAddress.fullName} onChange={handleFormChange} placeholder="Full Name" required className="p-2 border rounded-md" /><input name="mobile" value={newAddress.mobile} onChange={handleFormChange} placeholder="Mobile Number" required className="p-2 border rounded-md" /><input name="addressLine1" value={newAddress.addressLine1} onChange={handleFormChange} placeholder="Address Line 1" required className="sm:col-span-2 p-2 border rounded-md" /><input name="addressLine2" value={newAddress.addressLine2} onChange={handleFormChange} placeholder="Address Line 2 (Optional)" className="sm:col-span-2 p-2 border rounded-md" /><input name="city" value={newAddress.city} onChange={handleFormChange} placeholder="City" required className="p-2 border rounded-md" /><input name="state" value={newAddress.state} onChange={handleFormChange} placeholder="State" required className="p-2 border rounded-md" /><input name="postalCode" value={newAddress.postalCode} onChange={handleFormChange} placeholder="Postal Code" required className="p-2 border rounded-md" /><div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setShowAddressForm(false)} className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-300">Cancel</button><button type="submit" className="rounded-lg bg-[#7a1436] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#5a0f28]">Save Address</button></div>
                  </form>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
                <div className="space-y-2 border-b pb-4 mb-4">{cartItems.map((item: CartItem) => {
                  const price = item.ornament.totalPriceAfterDiscount ?? 0;
                  return (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>{item.ornament.name} x {item.quantity}</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}</div>
                <div className="flex justify-between text-lg font-bold text-gray-800"><span>To Pay</span><span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount)}</span></div>
                {submitError && <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg">{submitError}</div>}
                
                <button 
                  onClick={handleProceedToPayment} 
                  disabled={!selectedAddressId || !isRazorpayLoaded || isSubmittingPayment} 
                  className="mt-6 w-full rounded-lg bg-[#7a1436] py-3 font-semibold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSubmittingPayment ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : !isRazorpayLoaded ? 'Loading Payment...' : `Pay ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount)}`}
                </button>
                {razorpayError && <div className="mt-2 text-center text-xs text-red-500">{razorpayError}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showSuccessPopup && (<Portal><div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="m-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"><h3 className="text-xl font-bold text-green-600">Order Placed!</h3><p className="mt-2 text-gray-600">Your order is confirmed. Thank you for your purchase!</p><div className="mt-6 flex justify-center gap-4"><button onClick={() => navigate('/users')} className="rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-green-700">View Orders</button></div></div></div></Portal>)}
    </>
  );
};

export default CheckoutPage;