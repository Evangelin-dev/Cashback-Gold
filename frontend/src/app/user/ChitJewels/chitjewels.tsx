import { Award, Calendar, ChevronDown, ChevronUp, Gem, Shield } from 'lucide-react';
import { useEffect, useState, useState as useStateReact } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import Portal from '../Portal';


// --- Interfaces & Helpers ---
interface PlanFromApi { id: number; name: string; duration: string; amount: string; description: string; status: "ACTIVE" | "INACTIVE"; keyPoint1: string; keyPoint2: string; keyPoint3: string; }
interface ProcessedPlan extends PlanFromApi { monthlyPayment: string; features: string[]; popular: boolean; }
interface Faq { id: number; question: string; answer: string; }
const parseAmount = (amountStr: string): number => Number(amountStr.replace(/[^0-9.-]+/g, "")) || 0;
const parseDuration = (durationStr: string): number => parseInt(durationStr, 10) || 0;

const ChitJewelsPlans = () => {
  // --- Plan Confirmation Popup State ---
  const [showPlanPopup, setShowPlanPopup] = useStateReact(false);
  const carouselSlides = [
    {
      title: 'Chit Jewels',
      subtitle: 'Your Gateway to Smart Gold Investment',
      desc: 'Discover our flexible chit fund plans designed to help you build wealth through gold investments.'
    },
    {
      title: 'Flexible Gold Savings',
      subtitle: 'Start Small, Grow Big',
      desc: 'Invest monthly and accumulate gold at your own pace with bonus rewards for punctuality.'
    },
    {
      title: 'Safe & Transparent',
      subtitle: 'Insured, Trusted, Hassle-Free',
      desc: 'Your gold is securely stored and insured, with full transparency and easy redemption.'
    }
  ];
  const [carouselIdx, setCarouselIdx] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselIdx((prev) => (prev + 1) % carouselSlides.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [carouselIdx]);
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
    <div className="container pt-6 md:pt-16 px-0 md:px-0">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#7a1335] to-[#991313] text-black">
          <div className="max-w-7xl mx-auto px-2 py-8 sm:px-4 lg:px-6 flex flex-col items-center justify-center min-h-[220px] relative">
            <Gem className="h-7 w-7 text-[#f7c873] mx-auto mb-1" />
            <div className="w-full max-w-md mx-auto text-center relative">
              <div className="relative min-h-[80px] flex flex-col items-center justify-center">
                <div key={carouselSlides[carouselIdx].title} className="transition-all duration-700 ease-in-out flex flex-col items-center w-full">
                  <h1 className="text-lg md:text-2xl font-bold mb-1 text-[#f7c873] drop-shadow-sm tracking-tight">{carouselSlides[carouselIdx].title}</h1>
                  <p className="text-xs md:text-base mb-1 text-gray-800 font-semibold tracking-tight">{carouselSlides[carouselIdx].subtitle}</p>
                  <p className="text-xs md:text-sm text-gray-600 max-w-xs mx-auto leading-snug">{carouselSlides[carouselIdx].desc}</p>
                </div>
              </div>
              <div className="flex justify-center gap-1 mt-8 relative z-20">
                {carouselSlides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full border border-[#f7c873] ${carouselIdx === idx ? 'bg-[#f7c873]' : 'bg-transparent'}`}
                    onClick={() => setCarouselIdx(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:px-6 lg:px-8">
          <div className="text-center mb-8 mt-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Why Choose Chit Jewels?</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">Our chit fund plans combine group savings with modern gold investment strategies, providing flexible payment options to build your gold portfolio over time.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Shield className="h-7 w-7 text-[#bf7e1a] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Secure & Insured</h3>
              <p className="text-gray-600 text-xs">Your investments are protected with comprehensive insurance and secure storage.</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Calendar className="h-7 w-7 text-[#bf7e1a] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Flexible Plans</h3>
              <p className="text-gray-600 text-xs">Choose from various durations and payment options that suit your financial goals.</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Award className="h-7 w-7 text-[#bf7e1a] mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">Proven Returns</h3>
              <p className="text-gray-600 text-xs">Benefit from gold's historical performance and our investment expertise.</p>
            </div>
          </div>


          <div className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Our Active Plans</h2>
                <p className="text-sm text-gray-600">Select the plan that best fits your investment goals.</p>
              </div>
              {loading && <div className="text-center text-gray-500 text-xs">Loading plans...</div>}
              {error && <div className="text-center text-red-500 text-xs">{error}</div>}
           <div className="w-full flex flex-wrap justify-center items-center gap-8">
                
                {/* All Plans Centered, Larger Cards & Description */}
                <div className="flex flex-wrap justify-center items-center w-full gap-8">
                  {/* Saving Scheme Card (first plan, if exists) */}
                  {plans.length > 0 && (
                    <div className="relative bg-white rounded-2xl shadow-lg border-2 border-[#bf7e1a] flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-105 text-[11px] p-3 mx-auto flex justify-center items-center" style={{ minWidth: '220px', maxWidth: '260px', minHeight: '260px' }}>
                      <div className="w-full flex justify-center items-center absolute -top-3 left-0">
                        <span className="bg-[#bf7e1a] text-yellow-800 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap leading-tight">Saving Scheme</span>
                      </div>
                      <div className="flex-1 flex flex-col pt-5">
                        <div className="text-center mb-2">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{plans[0].name}</h3>
                          <div className="text-[#7a1335] font-bold mb-1">{plans[0].amount}</div>
                          <div className="text-gray-600 mb-1">{plans[0].duration}</div>
                          <div className="bg-yellow-50 px-2 py-1 rounded-lg inline-block text-[12px] font-semibold text-yellow-800">Monthly: {plans[0].monthlyPayment}</div>
                        </div>
                        {/* Description removed from card, only shown in popup */}
                        <div className="space-y-1 mb-2">{plans[0].features.slice(0, 3).map((feature, index) => (<div key={index} className="flex items-center text-[12px]"><div className="h-2 w-2 bg-[#bf7e1a] rounded-full mr-2"></div><span className="text-gray-700">{feature}</span></div>))}</div>
                        <div className="mt-auto flex justify-center">
                          <button onClick={() => setSelectedPlan(plans[0])} className={`bg-[#7a1335] text-white rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-[#991313] transition-colors w-full`}>Start Saving</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Other Plans */}
                  {plans.slice(1).map((plan) => (
                    <div key={plan.id} className={`relative bg-white rounded-2xl shadow-lg border-2 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-105 ${plan.popular ? 'border-[#bf7e1a]' : 'border-gray-200'} text-[11px] p-3`} style={{ minWidth: '220px', maxWidth: '260px', minHeight: '260px' }}>
                      {plan.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2"><span className="bg-[#bf7e1a] text-yellow-800 px-3 py-1 rounded-full text-[12px] font-bold">Most Popular</span></div>}
                      <div className="flex-1 flex flex-col pt-5">
                        <div className="text-center mb-2">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                          <div className="text-[#7a1335] font-bold mb-1">{plan.amount}</div>
                          <div className="text-gray-600 mb-1">{plan.duration}</div>
                          <div className="bg-yellow-50 px-2 py-1 rounded-lg inline-block text-[12px] font-semibold text-yellow-800">Monthly: {plan.monthlyPayment}</div>
                        </div>
                        <div className="text-gray-600 text-[12px] mb-2 h-24 overflow-auto">
                          {plan.description.split(/(?<=\.)\s+/).map((sentence, idx) => (
                            <div key={idx}>{sentence}</div>
                          ))}
                        </div>
                        <div className="space-y-1 mb-2">{plan.features.slice(0, 3).map((feature, index) => (<div key={index} className="flex items-center text-[12px]"><div className="h-2 w-2 bg-[#bf7e1a] rounded-full mr-2"></div><span className="text-gray-700">{feature}</span></div>))}</div>
                        <div className="mt-auto flex justify-center">
                          <button onClick={() => setSelectedPlan(plan)} className={`bg-[#7a1335] text-white rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-[#991313] transition-colors w-full`}>Start Saving</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
     
        {selectedPlan && (
          <Portal>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in text-xs">
                <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" disabled={isSubmitting}>×</button>
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-900 mb-1 text-xs">{selectedPlan.name}</h3>
                  <div className="font-bold text-[#7a1335] mb-1 text-xs">{selectedPlan.amount}</div>
                  <div className="text-gray-600 mb-2 text-xs">{selectedPlan.duration}</div>
                  <div className="bg-yellow-50 px-2 py-1 rounded-lg inline-block text-xs"><span className="font-semibold text-yellow-800">Monthly Payment: {selectedPlan.monthlyPayment}</span></div>
                </div>
                <p className="text-gray-600 mb-4 text-xs">{selectedPlan.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-xs">Plan Features:</h4>
                  <div className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs"><div className="h-2 w-2 bg-[#bf7e1a] rounded-full mr-2"></div><span className="text-gray-700">{feature}</span></div>
                    ))}
                  </div>
                </div>
                {submitError && <div className="text-center text-red-600 mb-2 bg-red-50 p-2 rounded-lg text-xs">{submitError}</div>}
                <div className="flex space-x-2">
                  <button onClick={() => setSelectedPlan(null)} className="flex-1 py-2 px-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-xs" disabled={isSubmitting}>Close</button>
                  <button 
                    onClick={handleChoosePlan} 
                    className="flex-1 py-2 px-2 bg-[#7a1335] text-white rounded-lg font-semibold hover:bg-[#991313] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
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
      <FAQSection />
    </div>
)};




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