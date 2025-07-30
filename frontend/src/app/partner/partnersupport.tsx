import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Loader, LifeBuoy, HelpCircle, Mail, Phone } from "lucide-react";
import { B2B_PRIMARY } from "../b2b/theme";

// Type for FAQ data from API
interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const PartnerSupport = () => {
  // State for the support ticket form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // State for the FAQs section
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState<string | null>(null);

  // --- API: Submit Support Ticket ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!subject.trim() || !message.trim()) {
      setSubmitError("Both subject and message fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { subject, message };
      await axiosInstance.post('/api/b2b/support', payload);

      setShowSuccessPopup(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setShowSuccessPopup(false), 3000);

    } catch (err) {
      console.error("Failed to submit ticket:", err);
      setSubmitError("Could not submit your ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- API: Fetch FAQs ---
  const fetchFaqs = useCallback(async () => {
    setFaqsLoading(true);
    setFaqsError(null);
    try {
      const response = await axiosInstance.get('/api/faqs'); // Fetching all FAQs for partners
      setFaqs(response.data.content || []);
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
      setFaqsError("Could not load FAQs at this time.");
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);


  const renderFaqs = () => {
    if (faqsLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin text-[#7a1335]" />
          <span className="ml-2">Loading FAQs...</span>
        </div>
      );
    }

    if (faqsError) {
      return <div className="text-center py-10 text-red-600">{faqsError}</div>;
    }
    
    if (faqs.length === 0) {
        return <div className="text-center py-10 text-gray-500">No FAQs found.</div>;
    }

    return (
      <ul className="space-y-4">
        {faqs.map((f) => (
          <li key={f.id} className="border-b border-gray-200 pb-3 last:border-b-0">
            <details>
              <summary className="font-semibold text-gray-800 cursor-pointer hover:text-[#7a1335] transition-colors">
                {f.question}
              </summary>
              <div className="text-gray-600 mt-2 pl-4">{f.answer}</div>
            </details>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#7a1335] mb-2">Support & Help Center</h1>
          <p className="text-gray-600">We're here to help you with any questions or issues.</p>
        </div>
        
        {/* Support Ticket Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#7a1335]">
            <LifeBuoy size={22} />
            Raise a Support Ticket
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                id="subject"
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:border-[#9d2f52] focus:ring-[#9d2f52]"
                placeholder="e.g., Issue with recent top-up"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Describe your issue</label>
              <textarea
                id="message"
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:border-[#9d2f52] focus:ring-[#9d2f52]"
                placeholder="Please provide as much detail as possible..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-lg text-white font-semibold transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 w-full sm:w-auto"
              style={{ background: isSubmitting ? undefined : B2B_PRIMARY }}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                "Raise Ticket"
              )}
            </button>
          </form>

          {showSuccessPopup && (
            <div className="fixed flex justify-center top-2 z-50 -translate-x-1/2 animate-fade-in-down">
              <div className="bg-white border-2 border-green-500 rounded-lg shadow-2xl px-8 py-4 text-center">
                <div className="text-green-700 font-bold text-base">
                  Ticket submitted successfully!
                  <br />
                  Our team will contact you soon.
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* FAQs Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#7a1335]">
            <HelpCircle size={22} />
            Frequently Asked Questions
          </h2>
          {renderFaqs()}
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-[#7a1335]">Contact Support</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="text-[#7a1335]" />
              Email: <a href="mailto:partner-support@example.com" className="text-blue-600 hover:underline">partner-support@example.com</a>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="text-[#7a1335]" />
              Phone: <a href="tel:+919999999999" className="text-blue-600 hover:underline">+91 99999 99999</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSupport;