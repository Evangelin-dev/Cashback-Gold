import { Award, Check, Crown, Eye, Filter, Heart, Loader, Minus, Plus, Share2, Shield, ShoppingCart, Sparkles, Zap } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from '../../../../store';
import axiosInstance from '../../../../utils/axiosInstance';
import Portal from '../../Portal';


// --- Updated Interfaces to match the new API response ---
interface PriceBreakup {
  component: string;
  netWeight: number | null;
  value: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  itemType: string | null;
  details: string;
  description: string;
  description1?: string;
  description2?: string;
  description3?: string;
  material: string;
  purity: string;
  quality: string;
  warranty: string;
  origin: string;
  mainImage: string;
  subImages: string[];
  priceBreakups: PriceBreakup[];
  // New detailed pricing fields
  goldPerGramPrice: number;
  makingChargePercent: number;
  grossWeight: number;
  discount: number;
  totalPrice: number; // Price before discount
  totalPriceAfterDiscount: number; // Final price
}

const JewelryProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // --- EXISTING STATE ---
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');


  // --- NEW STATE for Cart Functionality ---
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // --- Razorpay Payment State ---
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<any | null>(null);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      setSimilarProducts([]);
      try {
        const productResponse = await axiosInstance.get<Product>(`/admin/ornaments/${id}`);
        const mainProduct = productResponse.data;
        setProduct(mainProduct);
        setSelectedImage(0);
        setQuantity(1); // Reset quantity when product changes

        if (mainProduct?.itemType) {
          try {
            const similarResponse = await axiosInstance.get(`/admin/ornaments/by-item-type?itemType=${mainProduct.itemType}&page=0&size=6`);
            const filteredSimilar = (similarResponse.data || []).filter((p: Product) => p.id !== mainProduct.id).slice(0, 5);
            setSimilarProducts(filteredSimilar);
          } catch (similarError) {
            console.error("Failed to fetch similar products:", similarError);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Could not load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);


  // --- NEW HANDLER for Add to Cart ---
  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate("/SignupPopup");
      return;
    }
    if (!product) return;
    setIsAddingToCart(true);
    try {
      const url = `/api/cart/add?ornamentId=${product.id}&qty=${quantity}`;
      await axiosInstance.post(url);
      alert(`${quantity} x "${product.name}" added to your cart successfully!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("There was an issue adding this item to your cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // --- Razorpay Payment Integration ---
  const handleBuyNow = () => {
    if (!currentUser) {
      navigate("/SignupPopup");
      return;
    }
    setShowPaymentSummary(true);
    setPaymentError(null);
  };

  // Main payment flow: enroll, initiate, open Razorpay, callback
  const handleMakePayment = async () => {
    if (!product) return;
    setIsPaying(true);
    setPaymentError(null);
    try {
      // 1. Initiate payment (no enrollment step)
      const totalPrice = (() => {
        let t = typeof product.totalPrice === 'number' ? product.totalPrice : NaN;
        if (isNaN(t) && Array.isArray(product.priceBreakups)) {
          t = product.priceBreakups.reduce((sum, pb) => sum + (typeof pb.finalValue === 'number' ? pb.finalValue : 0), 0);
        }
        if (!Number.isFinite(t)) t = 0;
        return t * quantity;
      })();
      let initiateRes;
      try {
        initiateRes = await axiosInstance.post('/api/orders/checkout/initiate', {
          ornamentId: product.id,
          quantity,
          amountPaid: totalPrice,
        });
      } catch (apiErr: any) {
        console.error('Payment initiation error:', apiErr);
        let apiErrorMsg = 'Sorry, we could not initiate payment. Please check your network or contact support.';
        if (apiErr?.response) {
          if (typeof apiErr.response.data === 'string' && apiErr.response.data) {
            apiErrorMsg = apiErr.response.data;
          } else if (apiErr.response.data?.message) {
            apiErrorMsg = apiErr.response.data.message;
          }
        } else if (apiErr?.message) {
          apiErrorMsg = apiErr.message;
        }
        setPaymentError(apiErrorMsg);
        setIsPaying(false);
        return;
      }
      const orderIdFromApi = initiateRes.data.orderId || initiateRes.data.id;
      setOrderId(orderIdFromApi);

      // 2. Open Razorpay checkout using API response fields
      const options = {
        key: initiateRes.data.key,
        amount: Math.round(initiateRes.data.amount * 100), // Razorpay expects paise
        currency: initiateRes.data.currency,
        name: 'Greenheap Gold',
        description: product.name,
        order_id: initiateRes.data.orderId,
        handler: async function (response: any) {
          try {
            // 3. Callback to backend (match chitjewels and DB fields exactly)
            const callbackPayload = {
              razorpay_order_id: initiateRes.data.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: initiateRes.data.amount,
              payment_type: 'RAZORPAY',
              enrollment_id: orderIdFromApi,
            };
            const token = localStorage.getItem('authToken');
            console.log('Sending callback payload to backend:', callbackPayload);
            console.log('Auth token for callback:', token);
            // Optionally, show currentUser for debugging
            console.log('Current user:', currentUser);
            const callbackRes = await axiosInstance.post('/api/orders/ornaments/checkout/callback', callbackPayload);
            setPaymentResult(callbackRes.data);
            setShowPaymentSummary(false);
          } catch (err) {
            console.error('Payment callback error:', err);
            let callbackErrorMsg = "Payment succeeded but callback failed. Please contact support.";
            if (typeof err === 'object' && err !== null && 'response' in err) {
              const errorResponse = (err as any).response;
              if (typeof errorResponse?.data === 'string' && errorResponse.data) {
                callbackErrorMsg = errorResponse.data;
              } else if (errorResponse?.data?.message) {
                callbackErrorMsg = errorResponse.data.message;
              }
            } else if (typeof err === 'string') {
              callbackErrorMsg = err;
            } else if (err && typeof err === 'object' && 'message' in err) {
              callbackErrorMsg = (err as any).message;
            }
            setPaymentError(callbackErrorMsg);
          }
          setIsPaying(false);
        },
        prefill: {
          name: currentUser?.email || '',
          email: currentUser?.email || '',
          contact: currentUser?.mobile || '',
        },
        theme: { color: '#7a1335' },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          }
        }
      };
      // Load Razorpay script if not present
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <Loader className="w-12 h-12 text-[#7a1335] animate-spin" />
        <p className="mt-4 text-gray-600">Loading ornament details...</p>
      </div>
    );
  }

  if (error || !product) {
    return ( <div className="min-h-screen flex items-center justify-center text-xl text-red-500"><div>{error || "Product not found."}</div></div> );
  }

  const productImages = [product.mainImage, ...product.subImages].filter(Boolean);
  const keyFeatures = [product.description1, product.description2, product.description3].filter(Boolean);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzdhMTMzNSIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPgo8L2c+CjwvZz4KPC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="flex items-center justify-between py-3 mb-4">
            <div className="flex items-center space-x-1 text-xs text-[#7a1335]/70">
              <span className="hover:text-[#7a1335] cursor-pointer" onClick={() => navigate('/')}>Home</span><span>/</span>
              <span className="hover:text-[#7a1335] cursor-pointer" onClick={() => navigate('/buyornaments')}>Jewelry</span><span>/</span>
              <span className="font-medium text-[#7a1335]">{product.name}</span>
            </div>
            <div className="flex items-center space-x-2"><span className="text-xs bg-[#7a1335] text-white px-2 py-1 rounded-full">PREMIUM</span><span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">IN STOCK</span></div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-6 space-y-3">
              <div className="relative group">
                <div className="aspect-square bg-gradient-to-br from-[#7a1335]/5 to-purple-100 rounded-2xl overflow-hidden shadow-2xl">
                  <img src={productImages[selectedImage]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 flex flex-col space-y-2"><button onClick={() => setIsLiked(!isLiked)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300"><Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-[#7a1335]'}`} /></button><button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-all duration-300"><Share2 className="w-4 h-4 text-[#7a1335]" /></button></div>
                </div>
                <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">{productImages.map((img, i) => (<button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === i ? 'ring-2 ring-[#7a1335] scale-110 shadow-lg' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}><img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" /></button>))}</div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 flex flex-col">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                <h1 className="text-2xl font-bold text-[#7a1335] mb-2">{product.name}</h1>
                <div className="flex items-baseline space-x-3">
                  <div className="text-3xl font-semibold text-[#7a1335] tracking-tight">
                    ₹{product.totalPriceAfterDiscount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-lg font-medium text-gray-400 line-through">
                    ₹{product.totalPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    SAVE ₹{product.discount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">{[ { icon: Award, label: "Material", value: product.material }, { icon: Shield, label: "Purity", value: product.purity }, { icon: Sparkles, label: "Quality", value: product.quality }, { icon: Zap, label: "Warranty", value: product.warranty }].map((item, index) => (<div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"><div className="flex items-center space-x-2"><item.icon className="w-4 h-4 text-[#7a1335] group-hover:scale-110 transition-transform" /><div><div className="text-xs text-[#7a1335]/70">{item.label}</div><div className="font-semibold text-[#7a1335] text-sm">{item.value}</div></div></div></div>))}</div>

              {/* --- NEW QUANTITY SELECTOR & UPDATED BUTTONS --- */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#7a1335]">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#7a1335] text-[#7a1335] transition-colors hover:bg-[#7a1335] hover:text-white disabled:opacity-50" disabled={quantity <= 1 || isAddingToCart}><Minus className="h-4 w-4" /></button>
                    <span className="w-12 text-center text-lg font-bold text-gray-800">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#7a1335] text-[#7a1335] transition-colors hover:bg-[#7a1335] hover:text-white disabled:opacity-50" disabled={isAddingToCart}><Plus className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleAddToCart} disabled={isAddingToCart} className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#7a1335] bg-transparent py-4 px-6 font-bold text-[#7a1335] transition-all duration-300 ease-in-out hover:bg-[#7a1335] hover:text-black hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isPaying}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#7a1335] py-4 px-6 font-bold text-white shadow-md transition-all duration-300 ease-in-out hover:bg-[#6b1130] hover:shadow-xl hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Zap className="h-5 w-5" />
                    <span>{isPaying ? 'Processing...' : 'Buy Now'}</span>
                  </button>
                </div>
      {/* Payment Summary Popup */}
      {showPaymentSummary && product && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-4 max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-fade-in text-xs">
              <button onClick={() => setShowPaymentSummary(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" disabled={isPaying}>×</button>
              <div className="text-center mb-4">
                <h3 className="font-bold text-gray-900 mb-1 text-xs">Payment Summary</h3>
                <div className="font-bold text-[#7a1335] mb-1 text-xs">{product.name}</div>
                <div className="text-gray-600 mb-2 text-xs">Quantity: {quantity}</div>
                <div className="text-gray-600 mb-2 text-xs">Total Amount: {(() => {
                  let t = typeof product.totalPrice === 'number' ? product.totalPrice : NaN;
                  if (isNaN(t) && Array.isArray(product.priceBreakups)) {
                    t = product.priceBreakups.reduce((sum, pb) => sum + (typeof pb.finalValue === 'number' ? pb.finalValue : 0), 0);
                  }
                  if (!Number.isFinite(t)) t = 0;
                  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(t * quantity);
                })()}</div>
                <div className="mt-2 text-xs text-gray-700">Payment Method: <span className="font-semibold">Razorpay</span></div>
              </div>
              {paymentError && <div className="text-center text-red-600 mb-2 bg-red-50 p-2 rounded-lg text-xs">{paymentError}</div>}
              <div className="flex space-x-2">
                <button onClick={() => setShowPaymentSummary(false)} className="flex-1 py-2 px-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-xs" disabled={isPaying}>Back</button>
                <button
                  onClick={handleMakePayment}
                  className="flex-1 py-2 px-2 bg-[#7a1335] text-white rounded-lg font-semibold hover:bg-[#991313] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                  disabled={isPaying}
                >
                  {isPaying ? 'Processing...' : 'Make Payment'}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Final Payment Result Popup */}
      {paymentResult && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-4 max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-fade-in text-xs">
              <button onClick={() => { setPaymentResult(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
              <div className="text-center mb-4">
                <h3 className="font-bold text-[#7a1335] mb-2 text-base">Payment Successful!</h3>
                <div className="font-bold text-gray-900 mb-1 text-xs">{paymentResult.productName || paymentResult.planName || product?.name}</div>
                <div className="text-gray-600 mb-2 text-xs">Order ID: {paymentResult.orderId || orderId}</div>
                <div className="text-gray-600 mb-2 text-xs">Status: {paymentResult.status || 'Success'}</div>
                <div className="text-gray-600 mb-2 text-xs">Total Amount Paid: <span className="font-bold">₹{paymentResult.totalAmountPaid || paymentResult.amountPaid || ''}</span></div>
                {/* Add more details as needed */}
              </div>
              <div className="flex justify-center">
                <button onClick={() => { setPaymentResult(null); }} className="py-2 px-6 rounded bg-[#7a1335] text-white font-semibold transition-transform hover:scale-105">Close</button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Fade-in animation style */}
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-12">
            <div className="flex border-b border-[#7a1335]/20">{['details', 'pricing'].map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-medium text-sm transition-all duration-300 ${activeTab === tab ? 'text-[#7a1335] border-b-2 border-[#7a1335] bg-[#7a1335]/5' : 'text-[#7a1335]/70 hover:text-[#7a1335] hover:bg-[#7a1335]/5'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>))}</div>
            <div className="p-6">
              {activeTab === 'details' && ( <div className="grid md:grid-cols-2 gap-6"> <div> <h3 className="font-bold text-[#7a1335] mb-3">{product.description}</h3> <div className="space-y-2">{keyFeatures.map((point, idx) => (<div key={idx} className="flex items-start space-x-2 group"><div className="w-2 h-2 bg-[#7a1335] rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div><span className="text-sm text-[#7a1335]/80">{point}</span></div>))}</div></div><div className="bg-gradient-to-br from-[#7a1335]/5 to-purple-100 rounded-xl p-4"><h4 className="font-semibold text-[#7a1335] mb-2">Care Instructions</h4><ul className="text-sm text-[#7a1335]/80 space-y-1"><li>• Store in provided jewelry box</li><li>• Clean with soft cloth regularly</li><li>• Avoid exposure to chemicals</li><li>• Professional cleaning recommended</li></ul></div></div>)}
              {activeTab === 'pricing' && (
                <div className="bg-gradient-to-br from-[#7a1335]/5 to-purple-100 rounded-xl p-4">
                  <h3 className="font-bold text-[#7a1335] mb-4">Price Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#7a1335]/20">
                          <th className="text-left py-2 px-2 text-[#7a1335] font-semibold">Component</th>
                          <th className="text-left py-2 px-2 text-[#7a1335] font-semibold">Net Weight</th>
                          <th className="text-left py-2 px-2 text-[#7a1335] font-semibold">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.priceBreakups.map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/50 transition-colors">
                            <td className="py-2 px-2 font-medium text-[#7a1335]">{row.component}</td>
                            <td className="py-2 px-2 text-[#7a1335]">{row.netWeight != null ? row.netWeight.toFixed(2) + 'g' : 'N/A'}</td>
                            <td className="py-2 px-2 font-bold text-[#7a1335]">{row.value != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.value) : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 pt-4 border-t border-[#7a1335]/20 text-right space-y-1">
                       <div className="flex justify-end items-center gap-4">
                            <span className="text-gray-600">Sub-total:</span>
                            <span className="font-medium text-gray-700 w-32 text-left">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.totalPrice)}
                            </span>
                        </div>
                        <div className="flex justify-end items-center gap-4">
                            <span className="text-green-600">Discount:</span>
                            <span className="font-medium text-green-600 w-32 text-left">
                                - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.discount)}
                            </span>
                        </div>
                        <div className="flex justify-end items-center gap-4 text-xl font-bold text-[#7a1335] mt-2">
                            <span className="">Total:</span>
                            <span className="w-32 text-left">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.totalPriceAfterDiscount)}
                            </span>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {similarProducts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#7a1335] mb-6 text-center">Similar Products You May Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {similarProducts?.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/buyornaments/${p.id}`)}>
                    <div className="aspect-square overflow-hidden">
                      <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-1 truncate">{p.name}</h4>
                      <p className="text-lg font-bold text-[#7a1335] mb-2">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p.totalPriceAfterDiscount)}</p>
                      <button className="w-full bg-[#7a1335]/10 text-[#7a1335] py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#7a1335] hover:text-white transition-all duration-300">View Details</button>
                    </div>
                  </div>
                )
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default JewelryProductPage;