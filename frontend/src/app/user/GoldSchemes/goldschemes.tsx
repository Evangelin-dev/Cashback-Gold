import { Award, Calendar, ChevronDown, ChevronUp, Clock, DollarSign, Shield, Star, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Portal from '../Portal'; // 1. IMPORT THE PORTAL

// --- Interfaces ---
interface GoldPlan {
  id: number;
  schemeName: string;
  duration: string;
  minInvestment: string;
  description: string;
  goldPurity: string;
  featured: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

const GoldPlantSchemes = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPlan, setSelectedPlan] = useState<GoldPlan | null>(null);

  // Hardcoded data (can be replaced with API call later)
  const plans: GoldPlan[] = [
    { id: 1, schemeName: "Golden Harvest Basic", duration: "12 Months", minInvestment: "₹25,000", description: "Perfect for beginners looking to start their gold investment journey with flexible monthly contributions and guaranteed returns.", goldPurity: "99.9% Pure Gold", featured: false },
    { id: 2, schemeName: "Premium Gold Growth", duration: "24 Months", minInvestment: "₹50,000", description: "Ideal for serious investors seeking substantial growth with premium gold accumulation and bonus rewards.", goldPurity: "99.99% Pure Gold", featured: true },
    { id: 3, schemeName: "Elite Gold Reserve", duration: "36 Months", minInvestment: "₹1,00,000", description: "Our flagship scheme offering maximum returns with exclusive benefits and priority customer support.", goldPurity: "99.99% Pure Gold", featured: false },
    { id: 4, schemeName: "Flexi Gold Saver", duration: "6-60 Months", minInvestment: "₹10,000", description: "Flexible investment scheme with customizable duration and investment amounts to suit your financial goals.", goldPurity: "99.9% Pure Gold", featured: false }
  ];

  const faqs: FAQ[] = [
    { question: "What is a Gold Plant Scheme?", answer: "A Gold Plant Scheme is an investment plan where you contribute regular amounts to accumulate gold over time. The scheme allows you to build your gold portfolio systematically with guaranteed purity and competitive rates." },
    { question: "How do I start investing in a Gold Plant Scheme?", answer: "Starting is simple! Choose your preferred scheme, make the minimum investment, and set up your monthly contributions. Our team will guide you through the entire process and provide regular updates on your investment." },
    { question: "Can I withdraw my gold before the scheme matures?", answer: "Yes, most schemes offer partial withdrawal options after completing a minimum investment period. However, early withdrawal may affect your bonus benefits and returns." },
    { question: "What are the charges associated with these schemes?", answer: "Our schemes have transparent pricing with minimal processing fees. Making charges and storage fees are clearly outlined in each scheme's terms and conditions." },
    { question: "Is my investment secure?", answer: "Absolutely! All gold investments are secured with proper documentation, insurance coverage, and are stored in certified vaults. We provide complete transparency and regular audit reports." }
  ];

  const toggleFaq = (index: number) => { setOpenFaq(openFaq === index ? null : index); };
  const openPlanDetails = (plan: GoldPlan) => { setSelectedPlan(plan); };
  const closePlanDetails = () => { setSelectedPlan(null); };

  // This will now work perfectly to lock the background scroll
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
      {/* Hero Banner */}
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

      {/* Information Section */}
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

      {/* Active Plans Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-800 mb-4">Our Active Investment Plans</h2><p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose from our carefully designed gold investment schemes tailored to meet different investment goals and budgets.</p></div>
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
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2><p className="text-lg text-gray-600">Find answers to common questions about our gold investment schemes.</p></div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => toggleFaq(index)} className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"><span className="font-semibold text-gray-800">{faq.question}</span>{openFaq === index ? <ChevronUp className="w-5 h-5 text-[#7a1335]" /> : <ChevronDown className="w-5 h-5 text-[#7a1335]" />}</button>
                {openFaq === index && (<div className="px-6 py-4 bg-white border-t border-gray-200"><p className="text-gray-600">{faq.answer}</p></div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. WRAP THE POPUP IN THE PORTAL COMPONENT */}
      {selectedPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2000] animate-fade-in-fast">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-gray-800">{selectedPlan.schemeName}</h3><button onClick={closePlanDetails} className="text-gray-500 hover:text-gray-700 text-2xl">×</button></div>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-amber-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Duration</h4><p className="text-gray-600">{selectedPlan.duration}</p></div>
                  <div className="bg-green-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Minimum Investment</h4><p className="text-gray-600">{selectedPlan.minInvestment}</p></div>
                  <div className="bg-yellow-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Gold Purity</h4><p className="text-gray-600">{selectedPlan.goldPurity}</p></div>
                  <div className="bg-blue-50 p-4 rounded-lg"><h4 className="font-semibold text-gray-800 mb-2">Plan Type</h4><p className="text-gray-600">{selectedPlan.featured ? 'Premium' : 'Standard'}</p></div>
                </div>
                <div className="mb-6"><h4 className="font-semibold text-gray-800 mb-2">Description</h4><p className="text-gray-600">{selectedPlan.description}</p></div>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 px-6 rounded-lg font-semibold transition-colors bg-[#7a1335] text-white hover:bg-[#5a0f28]">Invest Now</button>
                  <button onClick={closePlanDetails} className="flex-1 py-3 px-6 border-2 border-[#7a1335] text-[#7a1335] rounded-lg font-semibold transition-colors hover:bg-[#7a1335] hover:text-white">Learn More</button>
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