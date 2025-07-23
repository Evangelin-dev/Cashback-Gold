import { Award, ChevronDown, ChevronUp, Shield, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

// Define interfaces for SIP plan and FAQ
interface SIPPlan {
  id: number;
  name: string;
  tenure: string;
  monthlyAmount: string;
  description: string;
  returns: string;
  popular: boolean;
  features: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

const GoldSIPPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<SIPPlan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const sipPlans: SIPPlan[] = [
    {
      id: 1,
      name: "Gold Starter SIP",
      tenure: "12 months",
      monthlyAmount: "₹1,000",
      description: "Perfect for beginners looking to start their gold investment journey with small, manageable amounts.",
      returns: "8-12%",
      popular: false,
      features: ["Low minimum investment", "Flexible tenure", "Digital gold storage"]
    },
    {
      id: 2,
      name: "Gold Growth SIP",
      tenure: "24 months",
      monthlyAmount: "₹2,500",
      description: "Ideal for steady wealth building with moderate investment amounts and extended tenure.",
      returns: "10-14%",
      popular: true,
      features: ["Higher returns", "Extended tenure", "Premium support", "Physical delivery option"]
    },
    {
      id: 3,
      name: "Gold Premium SIP",
      tenure: "36 months",
      monthlyAmount: "₹5,000",
      description: "Maximum growth potential with higher investment amounts and long-term commitment.",
      returns: "12-16%",
      popular: false,
      features: ["Maximum returns", "Long-term benefits", "Priority support", "Free physical delivery"]
    },
    {
      id: 4,
      name: "Gold Elite SIP",
      tenure: "60 months",
      monthlyAmount: "₹10,000",
      description: "Elite tier investment plan for serious investors seeking maximum wealth creation through gold.",
      returns: "14-18%",
      popular: false,
      features: ["Elite returns", "Exclusive benefits", "Dedicated advisor", "Multiple delivery options"]
    }
  ];

  const faqData: FAQ[] = [
    {
      question: "What is digital gold and how does it work?",
      answer: "Digital gold is a modern way to invest in gold electronically. When you buy digital gold, you own actual gold that is stored securely in insured vaults. You can buy, sell, or even convert it to physical gold anytime through our platform."
    },
    {
      question: "Can I convert my digital gold to physical gold?",
      answer: "Yes, you can convert your digital gold to physical gold coins or bars. We offer free delivery for amounts above ₹50,000. For smaller amounts, minimal delivery charges apply."
    },
    {
      question: "Is my digital gold safe and insured?",
      answer: "Absolutely! Your digital gold is stored in secure, insured vaults with 24/7 monitoring. All gold purchases are backed by physical gold and are fully insured against theft, loss, or damage."
    },
    {
      question: "How do I sell my digital gold?",
      answer: "You can sell your digital gold instantly through our platform at current market rates. The proceeds are credited to your bank account within 24-48 hours of the sale confirmation."
    }
  ];

  const handleChoosePlan = (plan: SIPPlan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Award className="w-12 h-12 text-yellow-200" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Gold SIP Plans</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Invest in gold systematically with our flexible SIP plans. Build wealth steadily with the timeless value of gold.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>100% Secure & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Guaranteed Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Gold SIP?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Gold SIP (Systematic Investment Plan) allows you to invest in gold regularly with small amounts. 
              It's a disciplined approach to wealth creation that helps you benefit from rupee cost averaging 
              and the long-term appreciation of gold prices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rupee Cost Averaging</h3>
              <p className="text-gray-600">Reduce market volatility impact through systematic investments</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">Your gold is stored in insured vaults with 24/7 security</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Options</h3>
              <p className="text-gray-600">Choose from various tenure and investment amount options</p>
            </div>
          </div>
        </div>
      </div>

      {/* SIP Plans Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your SIP Plan</h2>
            <p className="text-gray-600">Select the plan that best fits your investment goals and budget</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sipPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full p-6 ${
                  plan.popular ? 'ring-2 ring-yellow-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{plan.monthlyAmount}</div>
                    <p className="text-gray-600 text-sm mb-2">Duration: {plan.tenure}</p>
                    <p className="text-green-600 font-semibold">Returns: {plan.returns}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => handleChoosePlan(plan)}
                      className="w-full py-3 rounded-lg font-semibold transition-colors duration-300 bg-gray-800 text-white hover:bg-gray-700"
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-red-800 to-red-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-yellow-300">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <div className="text-yellow-600">
                    {openFAQ === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>
                
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPlan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Plan Selected!</h3>
              <p className="text-gray-600 mb-6">You've chosen the {selectedPlan.name}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Monthly Amount:</span>
                  <span className="font-semibold text-yellow-600">{selectedPlan.monthlyAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tenure:</span>
                  <span className="font-semibold">{selectedPlan.tenure}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expected Returns:</span>
                  <span className="font-semibold text-green-600">{selectedPlan.returns}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors duration-300">
                  Start SIP Now
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
                >
                  Buy This Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldSIPPlansPage;