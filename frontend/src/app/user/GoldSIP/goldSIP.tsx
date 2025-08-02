import { Award, ChevronDown, ChevronUp, Shield, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct
import Portal from '../Portal'; // Make sure this path is correct

// --- Interfaces for API Data ---
interface SIPPlanFromApi {
  id: number;
  name: string;
  tenure: string;
  monthlyAmount: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  keyPoint1: string;
  keyPoint2: string;
  keyPoint3: string;
}

interface ProcessedSIPPlan extends SIPPlanFromApi {
  returns: string;
  popular: boolean;
  features: string[];
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}


const parseAmount = (amountStr: string): number => Number(amountStr.replace(/[^0-9.-]+/g, "")) || 0;

const GoldSIPPlansPage = () => {
  // --- EXISTING STATE ---
  const [plans, setPlans] = useState<ProcessedSIPPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ProcessedSIPPlan | null>(null);
  const [showModal, setShowModal] = useState(false);

  // --- NEW STATE FOR ORDER SUBMISSION ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- DATA FETCHING (Unchanged) ---
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get<SIPPlanFromApi[]>('/api/cashback-gold-schemes');
        const activePlans = response.data.filter(plan => plan.status === 'ACTIVE');
        const mockReturns = ["8-12%", "10-14%", "12-16%", "14-18%"];
        const processedPlans = activePlans.map((plan, index) => ({
          ...plan,
          returns: mockReturns[index % mockReturns.length],
          popular: index === 0,
          features: [plan.keyPoint1, plan.keyPoint2, plan.keyPoint3].filter(Boolean),
        }));
        setPlans(processedPlans);
      } catch (err) {
        console.error("Failed to fetch Gold Plans:", err);
        setError("Could not load Gold Plans at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleChoosePlan = (plan: ProcessedSIPPlan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setSubmitError(null); // Clear previous errors when opening the modal
  };

  // --- NEW FUNCTION TO PLACE THE ORDER ---
  const handlePlaceOrder = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const orderPayload = {
      planType: "SIP",
      planName: selectedPlan.name,
      duration: selectedPlan.tenure,
      amount: parseAmount(selectedPlan.monthlyAmount),
      paymentMethod: "Razorpay"
    };

    try {
      await axiosInstance.post('/api/cashback-gold-user/enroll', orderPayload);
      alert(`Your order for "${selectedPlan.name}" has been placed successfully!`);
      setShowModal(false); // Close the modal on success
    } catch (err) {
      console.error("Failed to place order:", err);
      setSubmitError("Failed to place the order. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal]);


  // Carousel slides data
  const carouselSlides = [
    {
      icon: <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto" />,
      title: 'Cashback Gold',
      desc: 'Invest in gold systematically with our flexible Gold Plans. Build wealth steadily with the timeless value of gold.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto" />,
      title: 'Steady Growth',
      desc: 'Benefit from rupee cost averaging and long-term appreciation of gold prices.'
    },
    {
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto" />,
      title: '100% Secure & Insured',
      desc: 'Your gold is stored in insured vaults with 24/7 security.'
    },
    {
      icon: <Star className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto" />,
      title: '24/7 Support',
      desc: 'Our support team is always available to help you with your gold Cashback Gold journey.'
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
    <div className="min-h-screen mt-16 bg-white text-xs sm:text-sm">
      {/* Hero Banner Carousel */}
      <div className="bg-yellow-100 text-yellow-900 py-8 px-2 sm:px-4 select-none">
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
            aria-label="Gold Cashback Gold Carousel"
          >
            <div className="flex transition-all duration-500" style={{ transform: `translateX(-${carouselIdx * 100}%)` }}>
              {carouselSlides.map((slide, idx) => (
                <div key={idx} className="min-w-full flex flex-col items-center justify-center text-center px-2">
                  <div className="flex justify-center mb-3">{slide.icon}</div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-xs sm:text-sm mb-2 max-w-xl mx-auto">{slide.desc}</p>
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
          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm mt-6">
            <div className="flex items-center gap-1"><Shield className="w-4 h-4" /><span>100% Secure & Insured</span></div>
            <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /><span>Guaranteed Returns</span></div>
            <div className="flex items-center gap-1"><Star className="w-4 h-4" /><span>24/7 Support</span></div>
          </div>
        </div>
      </div>

    {/* Information Section */}
    <div className="py-8 px-2 sm:px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2">Why Choose Gold SIP?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm">Gold Cashback Gold (Systematic Investment Plan) allows you to invest in gold regularly with small amounts. It's a disciplined approach to wealth creation that helps you benefit from rupee cost averaging and the long-term appreciation of gold prices.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-yellow-50">
            <div className="bg-yellow-200 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2"><TrendingUp className="w-5 h-5 text-yellow-700" /></div>
            <h3 className="text-base font-semibold mb-1">Rupee Cost Averaging</h3>
            <p className="text-gray-600 text-xs">Reduce market volatility impact through systematic investments</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-50">
            <div className="bg-yellow-200 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2"><Shield className="w-5 h-5 text-yellow-700" /></div>
            <h3 className="text-base font-semibold mb-1">Secure Storage</h3>
            <p className="text-gray-600 text-xs">Your gold is stored in insured vaults with 24/7 security</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-50">
            <div className="bg-yellow-200 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2"><Award className="w-5 h-5 text-yellow-700" /></div>
            <h3 className="text-base font-semibold mb-1">Flexible Options</h3>
            <p className="text-gray-600 text-xs">Choose from various tenure and investment amount options</p>
          </div>
        </div>
      </div>
    </div>

    {/* Gold Plans Section */}
    <div className="py-8 px-2 sm:px-4 bg-yellow-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2">Choose Your Cashback Gold Plan</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Select the plan that best fits your investment goals and budget</p>
        </div>
        {loading && <div className="text-center text-gray-500">Loading plans...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full p-4 ${plan.popular ? 'ring-2 ring-yellow-500' : ''}`}>
              {plan.popular && (<div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-yellow-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold">POPULAR</span></div>)}
              <div className="flex-1 flex flex-col">
                <div className="text-center mb-3">
                  <h3 className="text-base font-bold text-yellow-900 mb-1">{plan.name}</h3>
                  <div className="text-lg font-bold text-yellow-700 mb-1">{plan.monthlyAmount}</div>
                  <p className="text-gray-600 text-xs mb-1">Duration: {plan.tenure}</p>
                  <p className="text-green-600 font-semibold text-xs">Returns: {plan.returns}</p>
                </div>
                <p className="text-gray-600 text-xs mb-2 min-h-[48px]">{plan.description}</p>
                <div className="mb-3">
                  <h4 className="font-semibold text-yellow-900 mb-1 text-xs">Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  <button onClick={() => handleChoosePlan(plan)} className="w-full py-2 rounded-lg font-semibold transition-colors duration-200 bg-yellow-700 text-white hover:bg-yellow-800 text-xs">Choose Plan</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <FAQSection />

    {/* Modal */}
    {showModal && selectedPlan && (
      <Portal>
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000] p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-2 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2"><Award className="w-5 h-5 text-yellow-700" /></div>
              <h3 className="text-lg font-bold text-yellow-900 mb-1">Confirm Your Plan</h3>
              <p className="text-gray-600 mb-2 text-xs">You've chosen the {selectedPlan.name}</p>
              <div className="bg-yellow-50 rounded-lg p-3 mb-3 text-left">
                <div className="flex justify-between items-center mb-1"><span className="text-gray-600">Monthly Amount:</span><span className="font-semibold text-yellow-700">{selectedPlan.monthlyAmount}</span></div>
                <div className="flex justify-between items-center mb-1"><span className="text-gray-600">Tenure:</span><span className="font-semibold">{selectedPlan.tenure}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Expected Returns:</span><span className="font-semibold text-green-600">{selectedPlan.returns}</span></div>
              </div>
              {submitError && <div className="text-center text-red-600 mb-2 bg-red-50 p-2 rounded-lg text-xs">{submitError}</div>}
              <div className="space-y-2">
                <button onClick={handlePlaceOrder} className="w-full bg-yellow-700 text-white py-2 rounded-lg font-semibold hover:bg-yellow-800 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Start Cashback Gold Now'}
                </button>
               
              </div>
            </div>
          </div>
        </div>
      </Portal>
    )}
  </div>
);
};

// --- FAQ SECTION (Unchanged) ---
function FAQSection() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                // Assuming FAQ type for Cashback Gold is 'SIP'
                const response = await axiosInstance.get('/api/faqs?type=SIP');
                setFaqs(response.data.content || []);
            } catch (err) {
                console.error("Failed to fetch FAQs:", err);
                setError("Could not load FAQs.");
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const toggleFAQ = (index: number) => { setOpenFAQ(openFAQ === index ? null : index); };

    return (
        <div className="py-16 px-4 bg-gradient-to-r from-red-800 to-red-900">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-yellow-300">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {loading && <div className="text-center text-white/80">Loading questions...</div>}
                    {error && <div className="text-center text-red-300">{error}</div>}
                    {faqs.map((faq, index) => (
                        <div key={faq.id} className="bg-white rounded-lg shadow-md">
                            <button onClick={() => toggleFAQ(index)} className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                <span className="font-semibold text-gray-800">{faq.question}</span>
                                <div className="text-yellow-600">{openFAQ === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                            </button>
                            {openFAQ === index && (
                                <div className="px-6 pb-4 pt-2">
                                    <p className="text-gray-600 leading-relaxed border-l-2 pl-4 ml-2 border-gray-200">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GoldSIPPlansPage;