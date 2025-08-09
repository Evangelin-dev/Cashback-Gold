import { Award, ChevronDown, ChevronUp, Clock, DollarSign, Shield, Star, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance'; // Assuming this is the correct path
import Portal from '../Portal';

// --- Interfaces ---
interface PlanFromApi {
  id: number;
  name: string;
  duration: string;
  minInvest: string;
  status: "ACTIVE" | "INACTIVE";
  description: string;
  keyPoint1: string;
  keyPoint2: string;
  keyPoint3: string;
}

interface ProcessedGoldPlan {
  id: number;
  schemeName: string;
  duration: string;
  minInvestment: string;
  description: string;
  goldPurity: string;
  featured: boolean;
}

interface FaqApiResponse {
  content: ApiFAQ[];
  last: boolean;
  totalPages: number;
  number: number;
}

interface ApiFAQ {
  id: number;
  question: string;
  answer: string;
}

// --- NEW HELPER FUNCTION ---
// Parses a currency string like "₹1,00,000" into a number 100000
const parseAmount = (amountStr: string): number => Number(amountStr.replace(/[^0-9.-]+/g, "")) || 0;

const GoldPlantSchemes = () => {
  // --- NEW STATE FOR POST-PAYMENT POPUP ---
  const [enrollmentResult, setEnrollmentResult] = useState<any | null>(null);
  // --- EXISTING STATE ---
  const [plans, setPlans] = useState<ProcessedGoldPlan[]>([]);
  const [faqs, setFaqs] = useState<ApiFAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPlan, setSelectedPlan] = useState<ProcessedGoldPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faqPage, setFaqPage] = useState(0);
  const [hasMoreFaqs, setHasMoreFaqs] = useState(true);
  const [isMoreFaqsLoading, setIsMoreFaqsLoading] = useState(false);

  // --- NEW STATE FOR ORDER SUBMISSION ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSupportPopup, setShowSupportPopup] = useState(false);

  // --- DATA FETCHING (Unchanged) ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [plansResponse, faqsResponse] = await Promise.all([
          axiosInstance.get<PlanFromApi[]>('/api/gold-plants'),
          axiosInstance.get<FaqApiResponse>(`/api/faqs?type=SCHEME&page=0&size=5`)
        ]);

        const activePlans = plansResponse.data.filter(plan => plan.status === 'ACTIVE');
        const processedPlans = activePlans.map((plan, index) => ({
          id: plan.id,
          schemeName: plan.name,
          duration: plan.duration,
          minInvestment: plan.minInvest,
          description: plan.description,
          goldPurity: plan.keyPoint1 || '99.9% Pure Gold',
          featured: index === 1,
        }));

        setPlans(processedPlans);
        setFaqs(faqsResponse.data.content || []);
        setHasMoreFaqs(!faqsResponse.data.last);
        
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Sorry, we couldn't load the scheme details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HANDLER FUNCTIONS (Unchanged) ---
  const handleLoadMoreFaqs = async () => {
    if (isMoreFaqsLoading || !hasMoreFaqs) return;
    setIsMoreFaqsLoading(true);
    const nextPage = faqPage + 1;
    try {
      const response = await axiosInstance.get<FaqApiResponse>(`/api/faqs?type=SCHEME&page=${nextPage}&size=5`);
      setFaqs(prevFaqs => [...prevFaqs, ...(response.data.content || [])]);
      setFaqPage(nextPage);
      setHasMoreFaqs(!response.data.last);
    } catch (err) {
      console.error("Failed to fetch more FAQs:", err);
    } finally {
      setIsMoreFaqsLoading(false);
    }
  };

  const toggleFaq = (index: number) => { setOpenFaq(openFaq === index ? null : index); };
  
  const openPlanDetails = (plan: ProcessedGoldPlan) => { 
    setSelectedPlan(plan);
    setSubmitError(null); // Clear previous errors when opening a new modal
  };

  const closePlanDetails = () => { setSelectedPlan(null); };

  // --- NEW FUNCTION TO HANDLE GOLD SCHEME ENROLLMENT & PAYMENT ---
  const handleInvestNow = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // 1. Initiate payment (first API)
      const initiateRes = await axiosInstance.post('/user/gold-plant/enroll/initiate', {
        schemeId: selectedPlan.id,
        amountInvested: parseAmount(selectedPlan.minInvestment)
      });
      const { razorpayOrderId, amount, schemeId } = initiateRes.data;

      // 2. Open Razorpay checkout
      const options = {
        key: window.RAZORPAY_KEY_ID,
        amount: amount * 100, // in paise
        currency: 'INR',
        name: 'Gold Plant Scheme',
        description: selectedPlan.schemeName,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          // 3. On payment success, call callback API (second API)
          try {
            const callbackRes = await axiosInstance.post('/user/gold-plant/enroll/callback', {
              schemeId,
              amountInvested: amount,
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            setEnrollmentResult(callbackRes.data);
            closePlanDetails();
          } catch (err) {
            setSubmitError(null);
            setShowSupportPopup(true);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: { color: '#7a1335' },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };
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
    } catch (err: any) {
      let apiError = "Sorry, we couldn't process your payment at this time. Please try again.";
      if (err?.response) {
        if (typeof err.response.data === 'string' && err.response.data) {
          apiError = err.response.data;
        } else if (err.response.data?.message) {
          apiError = err.response.data.message;
        }
      }
      setSubmitError(apiError);
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (selectedPlan) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => { document.body.classList.remove('overflow-hidden'); };
  }, [selectedPlan]);



  // Carousel slides data
  const carouselSlides = [
    {
      icon: <Award className="w-10 h-10 text-yellow-400 mx-auto" />,
      title: 'Gold Plant Schemes',
      desc: 'Grow Your Wealth with Premium Gold Investment Plans',
      subdesc: 'Secure your financial future with our expertly crafted gold investment schemes. Start with as little as ₹10,000 and watch your wealth grow with guaranteed pure gold.'
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-yellow-400 mx-auto" />,
      title: 'Steady Gold Growth',
      desc: 'Benefit from competitive returns and transparent pricing.',
      subdesc: 'Our plans are designed for long-term wealth creation and peace of mind.'
    },
    {
      icon: <Shield className="w-10 h-10 text-yellow-400 mx-auto" />,
      title: '100% Secure & Insured',
      desc: 'All investments are secured and insured in certified vaults.',
      subdesc: 'Your gold is always safe, pure, and accessible.'
    },
    {
      icon: <Star className="w-10 h-10 text-yellow-400 mx-auto" />,
      title: 'Pure Gold Quality',
      desc: 'Invest in 99.9% to 99.99% pure gold with certified quality.',
      subdesc: 'We guarantee the highest standards for your investment.'
    }
  ];

  // Carousel state
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  // Auto-slide
  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselIdx((prev) => (prev + 1) % carouselSlides.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [carouselIdx]);

  // Drag/Swipe handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setDragging(true);
    if ('touches' in e) {
      setDragStartX(e.touches[0].clientX);
    } else {
      setDragStartX(e.clientX);
    }
  };
  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging || dragStartX === null) return;
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const diff = clientX - dragStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCarouselIdx((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
      } else {
        setCarouselIdx((prev) => (prev + 1) % carouselSlides.length);
      }
      setDragging(false);
      setDragStartX(null);
    }
  };
  const handleDragEnd = () => {
    setDragging(false);
    setDragStartX(null);
  };

  return (
    <div className="min-h-screen bg-white text-xs sm:text-sm">
      {/* Hero Banner Carousel */}
      <section className="relative bg-yellow-100 text-yellow-900 py-8 px-2 sm:px-4 select-none">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative overflow-hidden"
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={dragging ? handleDragMove : undefined}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            role="region"
            aria-label="Gold Plant Carousel"
          >
            <div className="flex transition-all duration-500" style={{ transform: `translateX(-${carouselIdx * 100}%)` }}>
              {carouselSlides.map((slide, idx) => (
                <div key={idx} className="min-w-full flex flex-col items-center justify-center text-center px-2">
                  <div className="flex justify-center mb-3">{slide.icon}</div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xs sm:text-sm mb-1 max-w-xl mx-auto">{slide.desc}</p>
                  <p className="text-xs sm:text-sm mb-2 max-w-xl mx-auto text-yellow-800">{slide.subdesc}</p>
                </div>
              ))}
            </div>
            {/* Carousel dots */}
            <div className="flex justify-center gap-1 mt-4">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full border border-yellow-400 ${carouselIdx === idx ? 'bg-yellow-400' : 'bg-transparent'}`}
                  onClick={() => setCarouselIdx(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button className="bg-white text-yellow-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-50 transition-colors text-xs">Explore Plans</button>
            <button className="border border-yellow-900 text-yellow-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-50 transition-colors text-xs">Learn More</button>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-8 px-2 sm:px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6"><h2 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2">Why Choose Our Gold Plant Schemes?</h2><p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">Our gold investment schemes are designed to provide you with a secure, transparent, and profitable way to build your gold portfolio over time.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200"><Shield className="w-8 h-8 mx-auto mb-2 text-[#7a1335]" /><h3 className="text-base font-semibold mb-1 text-yellow-900">100% Secure</h3><p className="text-gray-600 text-xs">All investments are secured with proper documentation, insurance, and stored in certified vaults.</p></div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200"><TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#7a1335]" /><h3 className="text-base font-semibold mb-1 text-yellow-900">Guaranteed Returns</h3><p className="text-gray-600 text-xs">Enjoy competitive returns with bonus benefits and transparent pricing structure.</p></div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200"><Star className="w-8 h-8 mx-auto mb-2 text-[#7a1335]" /><h3 className="text-base font-semibold mb-1 text-yellow-900">Pure Gold Quality</h3><p className="text-gray-600 text-xs">Investment in 99.9% to 99.99% pure gold with certified quality assurance.</p></div>
          </div>
        </div>
      </section>

      {/* Active Plans Section */}
      <section className="py-8 px-2 sm:px-4 bg-yellow-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6"><h2 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2">Our Active Investment Plans</h2><p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">Choose from our carefully designed gold investment schemes tailored to meet different investment goals and budgets.</p></div>
          {isLoading && <div className="text-center text-gray-600">Loading plans...</div>}
          {error && <div className="text-center text-red-600 bg-red-100 p-2 rounded-lg text-xs">{error}</div>}
          {!isLoading && !error && plans.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full p-4 ${plan.featured ? 'ring-2 ring-yellow-500' : ''}`}>
                  {plan.featured && <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold">Popular</div>}
                  <div className="flex-1 flex flex-col">
                    <div>
                      <div className="flex items-center mb-2"><Award className="w-6 h-6 mr-2 text-[#7a1335]" /><h3 className="text-base font-bold text-yellow-900">{plan.schemeName}</h3></div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-yellow-700" /><span className="text-gray-600 text-xs">{plan.duration}</span></div>
                        <div className="flex items-center"><DollarSign className="w-4 h-4 mr-1 text-green-600" /><span className="text-gray-600 text-xs">{plan.minInvestment}</span></div>
                        <div className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-600" /><span className="text-gray-600 text-xs">{plan.goldPurity}</span></div>
                      </div>
                      <p className="text-gray-600 text-xs mb-4 line-clamp-3">{plan.description}</p>
                    </div>
                    <div className="mt-auto"><button onClick={() => openPlanDetails(plan)} className="w-full py-2 rounded-lg font-semibold transition-colors bg-[#7a1335] text-white hover:bg-[#5a1335] text-xs">View Details</button></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 px-2 sm:px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6"><h2 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2">Frequently Asked Questions</h2><p className="text-xs sm:text-sm text-gray-600">Find answers to common questions about our gold investment schemes.</p></div>
          {isLoading && <div className="text-center text-gray-600">Loading FAQs...</div>}
          {!isLoading && !error && (
            <>
              <div className="space-y-3">{faqs.map((faq, index) => (<div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden"><button onClick={() => toggleFaq(index)} className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-xs"><span className="font-semibold text-yellow-900">{faq.question}</span>{openFaq === index ? <ChevronUp className="w-4 h-4 text-[#7a1335]" /> : <ChevronDown className="w-4 h-4 text-[#7a1335]" />}</button>{openFaq === index && (<div className="px-4 py-3 bg-white border-t border-gray-200"><p className="text-gray-600 text-xs">{faq.answer}</p></div>)}</div>))}</div>
              {hasMoreFaqs && (<div className="text-center mt-6"><button onClick={handleLoadMoreFaqs} disabled={isMoreFaqsLoading} className="px-4 py-2 rounded-lg font-semibold transition-colors bg-[#7a1335] text-white hover:bg-[#5a1335] disabled:bg-gray-400 text-xs">{isMoreFaqsLoading ? 'Loading...' : 'Load More FAQs'}</button></div>)}
            </>
          )}
        </div>
      </section>

      {/* --- MODAL UPDATED WITH SUBMISSION LOGIC --- */}
      {selectedPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2000] animate-fade-in-fast">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedPlan.schemeName}</h3>
                  <button onClick={closePlanDetails} className="text-gray-500 hover:text-gray-700 text-2xl" disabled={isSubmitting}>×</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-amber-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Duration</h4><p className="text-gray-600">{selectedPlan.duration}</p></div>
                  <div className="bg-green-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Minimum Investment</h4><p className="text-gray-600">{selectedPlan.minInvestment}</p></div>
                  <div className="bg-yellow-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Gold Purity</h4><p className="text-gray-600">{selectedPlan.goldPurity}</p></div>
                  <div className="bg-blue-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Plan Type</h4><p className="text-gray-600">{selectedPlan.featured ? 'Premium' : 'Standard'}</p></div>
                </div>
                <div className="mb-6"><h4 className="font-semibold text-gray-800 mb-2">Description</h4><p className="text-gray-600">{selectedPlan.description}</p></div>
                {/* NEW: Error display for submission */}
                {submitError && <div className="text-center text-red-600 mb-4 bg-red-100 p-3 rounded-lg">{submitError}</div>}
                <div className="flex gap-4">
                  <button 
                    onClick={handleInvestNow}
                    className="flex-1 py-3 px-6 rounded-lg font-semibold transition-colors bg-[#7a1335] text-white hover:bg-[#5a0f28] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Invest Now'}
                  </button>
                  <button 
                    onClick={closePlanDetails} 
                    className="flex-1 py-3 px-6 border-2 border-[#7a1335] text-[#7a1335] rounded-lg font-semibold transition-colors hover:bg-[#7a1335] hover:text-white"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <style>{`.animate-fade-in-fast { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </Portal>
      )}
      {/* --- ENROLLMENT RESULT POPUP --- */}
      {enrollmentResult && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2100] animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative flex flex-col items-center justify-center p-0">
              <button onClick={() => setEnrollmentResult(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
              <div className="p-8 w-full flex flex-col items-center">
                <div className="flex flex-col items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#7a1335] mb-2 text-center">Enrollment Successful!</h3>
                  <span className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full font-semibold text-xs mb-2">{enrollmentResult.status}</span>
                </div>
                <div className="grid grid-cols-1 gap-3 w-full mb-6">
                  <div className="bg-amber-50 p-3 rounded-lg text-center"><h4 className="font-semibold text-gray-800 mb-1">Scheme Name</h4><p className="text-gray-600">{enrollmentResult.schemeName}</p></div>
                  <div className="bg-green-50 p-3 rounded-lg text-center"><h4 className="font-semibold text-gray-800 mb-1">Amount Invested</h4><p className="text-gray-600">₹{enrollmentResult.amountInvested}</p></div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center"><h4 className="font-semibold text-gray-800 mb-1">Start Date</h4><p className="text-gray-600">{enrollmentResult.startDate}</p></div>
                </div>
                <div className="flex justify-center w-full">
                  <button onClick={() => setEnrollmentResult(null)} className="py-2 px-6 rounded bg-[#7a1335] text-white font-semibold transition-transform hover:scale-105">Close</button>
                </div>
              </div>
            </div>
          </div>
          <style>{`.animate-fade-in-fast { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </Portal>
      )}
      {showSupportPopup && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2200] p-2">
            <div className="bg-white rounded-xl shadow-2xl max-w-xs w-full mx-auto p-8 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-4 text-center text-red-700">Payment succeeded but enrollment failed. Please contact support.</h3>
              <button
                className="mt-4 bg-[#7a1335] text-white py-2 px-6 rounded hover:bg-[#991313] font-semibold"
                onClick={() => setShowSupportPopup(false)}
              >Close</button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default GoldPlantSchemes;