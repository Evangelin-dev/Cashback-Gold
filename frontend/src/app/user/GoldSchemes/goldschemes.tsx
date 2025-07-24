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

  // --- NEW FUNCTION TO HANDLE ORDER SUBMISSION ---
  const handleInvestNow = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const orderPayload = {
      planType: "SCHEME",
      planName: selectedPlan.schemeName,
      duration: selectedPlan.duration,
      amount: parseAmount(selectedPlan.minInvestment),
      paymentMethod: "Razorpay"
    };

    try {
      await axiosInstance.post('/api/orders', orderPayload);
      alert(`Your order for "${selectedPlan.schemeName}" has been placed successfully!`);
      closePlanDetails();
    } catch (err) {
      console.error("Failed to submit order:", err);
      setSubmitError("Could not place your order at this time. Please try again.");
    } finally {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Banner (Unchanged) */}
      <section className="relative bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6"><Award className="w-16 h-16 text-yellow-400" /></div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">Gold Plant Schemes</h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100">Grow Your Wealth with Premium Gold Investment Plans</p>
          <p className="text-lg mb-10 text-amber-200 max-w-3xl mx-auto">Secure your financial future with our expertly crafted gold investment schemes. Start with as little as ₹10,000 and watch your wealth grow with guaranteed pure gold.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-amber-900 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors">Explore Plans</button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-amber-900 transition-colors">Learn More</button>
          </div>
        </div>
      </section>

      {/* Information Section (Unchanged) */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Gold Plant Schemes?</h2><p className="text-lg text-gray-600 max-w-3xl mx-auto">Our gold investment schemes are designed to provide you with a secure, transparent, and profitable way to build your gold portfolio over time.</p></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"><Shield className="w-12 h-12 mx-auto mb-4 text-[#7a1335]" /><h3 className="text-xl font-semibold mb-3 text-gray-800">100% Secure</h3><p className="text-gray-600">All investments are secured with proper documentation, insurance, and stored in certified vaults.</p></div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"><TrendingUp className="w-12 h-12 mx-auto mb-4 text-[#7a1335]" /><h3 className="text-xl font-semibold mb-3 text-gray-800">Guaranteed Returns</h3><p className="text-gray-600">Enjoy competitive returns with bonus benefits and transparent pricing structure.</p></div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"><Star className="w-12 h-12 mx-auto mb-4 text-[#7a1335]" /><h3 className="text-xl font-semibold mb-3 text-gray-800">Pure Gold Quality</h3><p className="text-gray-600">Investment in 99.9% to 99.99% pure gold with certified quality assurance.</p></div>
          </div>
        </div>
      </section>

      {/* Active Plans Section (Unchanged) */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-800 mb-4">Our Active Investment Plans</h2><p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose from our carefully designed gold investment schemes tailored to meet different investment goals and budgets.</p></div>
          {isLoading && <div className="text-center text-gray-600">Loading plans...</div>}
          {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
          {!isLoading && !error && plans.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                  {plan.featured && <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">Popular</div>}
                  <div className="p-6 flex-1 flex flex-col">
                    <div>
                      <div className="flex items-center mb-4"><Award className="w-8 h-8 mr-3 text-[#7a1335]" /><h3 className="text-xl font-bold text-gray-800">{plan.schemeName}</h3></div>
                      <div className="space-y-3 mb-6"><div className="flex items-center"><Clock className="w-5 h-5 mr-2 text-amber-600" /><span className="text-gray-600">{plan.duration}</span></div><div className="flex items-center"><DollarSign className="w-5 h-5 mr-2 text-green-600" /><span className="text-gray-600">{plan.minInvestment}</span></div><div className="flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-600" /><span className="text-gray-600">{plan.goldPurity}</span></div></div>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">{plan.description}</p>
                    </div>
                    <div className="mt-auto"><button onClick={() => openPlanDetails(plan)} className="w-full py-3 rounded-lg font-semibold transition-colors bg-[#7a1335] text-white hover:bg-[#5a1335]">View Details</button></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section (Unchanged) */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2><p className="text-lg text-gray-600">Find answers to common questions about our gold investment schemes.</p></div>
          {isLoading && <div className="text-center text-gray-600">Loading FAQs...</div>}
          {!isLoading && !error && (
            <>
              <div className="space-y-4">{faqs.map((faq, index) => (<div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden"><button onClick={() => toggleFaq(index)} className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"><span className="font-semibold text-gray-800">{faq.question}</span>{openFaq === index ? <ChevronUp className="w-5 h-5 text-[#7a1335]" /> : <ChevronDown className="w-5 h-5 text-[#7a1335]" />}</button>{openFaq === index && (<div className="px-6 py-4 bg-white border-t border-gray-200"><p className="text-gray-600">{faq.answer}</p></div>)}</div>))}</div>
              {hasMoreFaqs && (<div className="text-center mt-8"><button onClick={handleLoadMoreFaqs} disabled={isMoreFaqsLoading} className="px-6 py-3 rounded-lg font-semibold transition-colors bg-[#7a1335] text-white hover:bg-[#5a1335] disabled:bg-gray-400">{isMoreFaqsLoading ? 'Loading...' : 'Load More FAQs'}</button></div>)}
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
                    Learn More
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

export default GoldPlantSchemes;