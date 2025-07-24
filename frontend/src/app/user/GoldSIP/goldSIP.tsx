import { Award, ChevronDown, ChevronUp, Shield, Star, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Portal from '../Portal'; // Make sure this path is correct
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct

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
        const response = await axiosInstance.get<SIPPlanFromApi[]>('/admin/sip-plans');
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
        console.error("Failed to fetch SIP plans:", err);
        setError("Could not load SIP plans at this time.");
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
      await axiosInstance.post('/api/orders', orderPayload);
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

  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Hero Banner (Unchanged) */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6"><div className="bg-white bg-opacity-20 rounded-full p-4"><Award className="w-12 h-12 text-yellow-200" /></div></div>
          <h1 className="text-5xl font-bold mb-6 text-black">Gold SIP Plans</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-yellow-300">Invest in gold systematically with our flexible SIP plans. Build wealth steadily with the timeless value of gold.</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex text-black items-center gap-2"><Shield className="w-5 h-5" /><span>100% Secure & Insured</span></div>
            <div className="flex text-black items-center gap-2"><TrendingUp className="w-5 h-5" /><span>Guaranteed Returns</span></div>
            <div className="flex text-black items-center gap-2"><Star className="w-5 h-5" /><span>24/7 Support</span></div>
          </div>
        </div>
      </div>

      {/* Information Section (Unchanged) */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Gold SIP?</h2><p className="text-gray-600 max-w-3xl mx-auto">Gold SIP (Systematic Investment Plan) allows you to invest in gold regularly with small amounts. It's a disciplined approach to wealth creation that helps you benefit from rupee cost averaging and the long-term appreciation of gold prices.</p></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50"><div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><TrendingUp className="w-8 h-8 text-yellow-600" /></div><h3 className="text-xl font-semibold mb-2">Rupee Cost Averaging</h3><p className="text-gray-600">Reduce market volatility impact through systematic investments</p></div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50"><div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><Shield className="w-8 h-8 text-yellow-600" /></div><h3 className="text-xl font-semibold mb-2">Secure Storage</h3><p className="text-gray-600">Your gold is stored in insured vaults with 24/7 security</p></div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50"><div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><Award className="w-8 h-8 text-yellow-600" /></div><h3 className="text-xl font-semibold mb-2">Flexible Options</h3><p className="text-gray-600">Choose from various tenure and investment amount options</p></div>
          </div>
        </div>
      </div>

      {/* SIP Plans Section (Unchanged) */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your SIP Plan</h2><p className="text-gray-600">Select the plan that best fits your investment goals and budget</p></div>
          {loading && <div className="text-center text-gray-500">Loading plans...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full p-6 ${plan.popular ? 'ring-2 ring-yellow-500' : ''}`}>
                {plan.popular && (<div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">POPULAR</span></div>)}
                <div className="flex-1 flex flex-col">
                  <div className="text-center mb-6"><h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3><div className="text-3xl font-bold text-yellow-600 mb-2">{plan.monthlyAmount}</div><p className="text-gray-600 text-sm mb-2">Duration: {plan.tenure}</p><p className="text-green-600 font-semibold">Returns: {plan.returns}</p></div>
                  <p className="text-gray-600 text-sm mb-4 h-24">{plan.description}</p>
                  <div className="mb-6"><h4 className="font-semibold text-gray-800 mb-2">Features:</h4><ul className="text-sm text-gray-600 space-y-1">{plan.features.map((feature, index) => (<li key={index} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>{feature}</li>))}</ul></div>
                  <div className="mt-auto"><button onClick={() => handleChoosePlan(plan)} className="w-full py-3 rounded-lg font-semibold transition-colors duration-300 bg-gray-800 text-white hover:bg-gray-700">Choose Plan</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FAQSection />

      {/* --- MODAL UPDATED WITH SUBMISSION LOGIC --- */}
      {showModal && selectedPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" disabled={isSubmitting}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><Award className="w-8 h-8 text-yellow-600" /></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Plan</h3>
                <p className="text-gray-600 mb-6">You've chosen the {selectedPlan.name}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="flex justify-between items-center mb-2"><span className="text-gray-600">Monthly Amount:</span><span className="font-semibold text-yellow-600">{selectedPlan.monthlyAmount}</span></div>
                  <div className="flex justify-between items-center mb-2"><span className="text-gray-600">Tenure:</span><span className="font-semibold">{selectedPlan.tenure}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-600">Expected Returns:</span><span className="font-semibold text-green-600">{selectedPlan.returns}</span></div>
                </div>

                {/* NEW: Display submission error here */}
                {submitError && <div className="text-center text-red-600 mb-4 bg-red-50 p-3 rounded-lg">{submitError}</div>}

                <div className="space-y-3">
                  <button onClick={handlePlaceOrder} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Start SIP Now'}
                  </button>
                  <button onClick={handlePlaceOrder} className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Buy This Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <style>{`.animate-fade-in-fast { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
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
                // Assuming FAQ type for SIP is 'SIP'
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