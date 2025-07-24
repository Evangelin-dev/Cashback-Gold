import { Award, Calendar, ChevronDown, ChevronUp, Gem, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import Portal from '../Portal';

// --- Interfaces & Helpers ---
interface PlanFromApi { id: number; name: string; duration: string; amount: string; description: string; status: "ACTIVE" | "INACTIVE"; keyPoint1: string; keyPoint2: string; keyPoint3: string; }
interface ProcessedPlan extends PlanFromApi { monthlyPayment: string; features: string[]; popular: boolean; }
interface Faq { id: number; question: string; answer: string; }
const parseAmount = (amountStr: string): number => Number(amountStr.replace(/[^0-9.-]+/g, "")) || 0;
const parseDuration = (durationStr: string): number => parseInt(durationStr, 10) || 0;

const ChitJewelsPlans = () => {
  // --- EXISTING STATE ---
  const [plans, setPlans] = useState<ProcessedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ProcessedPlan | null>(null);

  // --- NEW STATE FOR ORDER SUBMISSION ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- DATA FETCHING (Unchanged) ---
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get<PlanFromApi[]>('/api/saving-plans');
        const activePlans = response.data.filter(plan => plan.status === 'ACTIVE');
        const processedPlans = activePlans.map((plan, index) => {
          const amount = parseAmount(plan.amount);
          const durationMonths = parseDuration(plan.duration);
          const monthlyPayment = durationMonths > 0 ? (amount / durationMonths) : 0;
          return { ...plan, monthlyPayment: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(monthlyPayment), features: [plan.keyPoint1, plan.keyPoint2, plan.keyPoint3].filter(Boolean), popular: index === 1 };
        });
        setPlans(processedPlans);
      } catch (err) { setError("Could not load plans at this time."); } finally { setLoading(false); }
    };
    fetchPlans();
  }, []);

  // Effect to lock body scroll when modal is open (Unchanged)
  useEffect(() => {
    if (selectedPlan) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => { document.body.classList.remove('overflow-hidden'); };
  }, [selectedPlan]);
  
  // --- NEW FUNCTION TO HANDLE PLAN SELECTION AND API POST ---
  const handleChoosePlan = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const orderPayload = {
      planType: "CHIT",
      planName: selectedPlan.name,
      duration: selectedPlan.duration,
      amount: parseAmount(selectedPlan.amount),
      paymentMethod: "Razorpay"
    };

    try {
      await axiosInstance.post('/api/orders', orderPayload);
      
      // On success
      alert(`Successfully placed order for "${selectedPlan.name}"! You will be redirected for payment.`);
      setSelectedPlan(null); // Close the modal

    } catch (err) {
      console.error("Failed to submit order:", err);
      setSubmitError("Sorry, we couldn't process your order at this time. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- JSX (RETURN STATEMENT) ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#7a1335] to-[#991313] text-black">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <Gem className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Chit Jewels</h1>
          <p className="text-xl md:text-2xl mb-8 text-yellow-500">Your Gateway to Smart Gold Investment</p><p className="text-lg md:text-xl max-w-3xl mx-auto text-yellow-300">Discover our flexible chit fund plans designed to help you build wealth through gold investments.</p></div></div>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Why Choose Chit Jewels?</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">Our chit fund plans combine group savings with modern gold investment strategies, providing flexible payment options to build your gold portfolio over time.</p></div><div className="grid md:grid-cols-3 gap-8 mb-16"><div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"><Shield className="h-12 w-12 text-[#bf7e1a] mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Insured</h3><p className="text-gray-600">Your investments are protected with comprehensive insurance and secure storage.</p></div><div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"><Calendar className="h-12 w-12 text-[#bf7e1a] mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Plans</h3><p className="text-gray-600">Choose from various durations and payment options that suit your financial goals.</p></div><div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"><Award className="h-12 w-12 text-[#bf7e1a] mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Returns</h3><p className="text-gray-600">Benefit from gold's historical performance and our investment expertise.</p></div></div></div>
      <div className="bg-white py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Active Plans</h2><p className="text-lg text-gray-600">Select the plan that best fits your investment goals.</p></div>{loading && <div className="text-center text-gray-500">Loading plans...</div>}{error && <div className="text-center text-red-500">{error}</div>}<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">{plans.map((plan) => (<div key={plan.id} className={`relative bg-white rounded-2xl shadow-lg border-2 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-105 ${plan.popular ? 'border-[#bf7e1a]' : 'border-gray-200'}`}>{plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><span className="bg-[#bf7e1a] text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">Most Popular</span></div>}<div className="p-6 flex-1 flex flex-col"><div className="text-center mb-6"><h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3><div className="text-3xl font-bold text-[#7a1335] mb-2">{plan.amount}</div><div className="text-gray-600 mb-4">{plan.duration}</div><div className="bg-yellow-50 px-3 py-2 rounded-lg"><span className="text-sm font-semibold text-yellow-800">Monthly: {plan.monthlyPayment}</span></div></div><p className="text-gray-600 text-sm mb-6 h-20">{plan.description}</p><div className="space-y-2 mb-6">{plan.features.slice(0, 3).map((feature, index) => (<div key={index} className="flex items-center text-sm"><div className="h-2 w-2 bg-[#bf7e1a] rounded-full mr-3"></div><span className="text-gray-700">{feature}</span></div>))}</div><div className="mt-auto"><button onClick={() => setSelectedPlan(plan)} className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-[#7a1335] text-white hover:bg-[#991313]' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>View Details</button></div></div></div>))}</div></div></div>

      <FAQSection />

      {/* --- MODAL UPDATED WITH SUBMISSION LOGIC --- */}
      {selectedPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
              <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" disabled={isSubmitting}>×</button>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlan.name}</h3>
                <div className="text-4xl font-bold text-[#7a1335] mb-2">{selectedPlan.amount}</div>
                <div className="text-gray-600 mb-4">{selectedPlan.duration}</div>
                <div className="bg-yellow-50 px-4 py-2 rounded-lg inline-block"><span className="font-semibold text-yellow-800">Monthly Payment: {selectedPlan.monthlyPayment}</span></div>
              </div>
              <p className="text-gray-600 mb-6">{selectedPlan.description}</p>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Plan Features:</h4>
                <div className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center"><div className="h-2 w-2 bg-[#bf7e1a] rounded-full mr-3"></div><span className="text-gray-700">{feature}</span></div>
                  ))}
                </div>
              </div>
              
              {/* NEW: Error display for submission */}
              {submitError && <div className="text-center text-red-600 mb-4 bg-red-50 p-3 rounded-lg">{submitError}</div>}

              <div className="flex space-x-4">
                <button onClick={() => setSelectedPlan(null)} className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors" disabled={isSubmitting}>Close</button>
                <button 
                  onClick={handleChoosePlan} 
                  className="flex-1 py-3 px-4 bg-[#7a1335] text-white rounded-lg font-semibold hover:bg-[#991313] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Choose This Plan'}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};

// --- FAQ SECTION (Unchanged) ---
function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axiosInstance.get('/api/faqs?type=CHIT&page=0&size=5');
        setFaqs(response.data.content || []);
      } catch (err) { console.error("Failed to fetch FAQs:", err); } finally { setLoading(false); }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (index: number) => { setOpenFaq(openFaq === index ? null : index); };

  return (
    <div className="py-16 bg-[#7a1335]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-300">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-yellow-300 mx-auto"></div>
        </div>
        <div className="space-y-4">
          {loading ? <div className="text-center text-white">Loading FAQs...</div> : faqs.map((faq, index) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button onClick={() => toggleFaq(index)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 flex items-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-[#7a1335]"><div className="w-3 h-3 bg-yellow-400 rounded-full"></div></div>
                  {faq.question}
                </span>
                <div className="text-[#7a1335]">{openFaq === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</div>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 pt-2">
                  <div className="pl-9 text-gray-600 border-l-2 border-gray-200 ml-3">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChitJewelsPlans;