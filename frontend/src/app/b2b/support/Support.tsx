import { useState } from "react";
import { B2B_PRIMARY } from "../theme";
import axiosInstance from "../../../utils/axiosInstance"; 
import { Loader } from "lucide-react"; 

export default function Support() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subject.trim() || !message.trim()) {
      setError("Both subject and message fields are required.");
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
      setError("Could not submit your ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: B2B_PRIMARY }}>
          Support & Relationship Manager
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              id="subject"
              className="w-full border rounded px-3 py-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
              className="w-full border rounded px-3 py-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Please provide as much detail as possible..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-6 rounded text-white font-semibold transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400"
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
          <div className="absolute left-[70%] top-18  z-50 -translate-x-1/2 animate-fade-in-down">
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

      <div className="bg-white rounded-lg shadow p-6">
        <div className="font-bold text-lg mb-2" style={{ color: B2B_PRIMARY }}>
          Account Manager Contact
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-800">
          <span className="font-semibold">Name:</span> <span>-</span>
          <span className="font-semibold">Email:</span> <span>-</span>
          <span className="font-semibold">Phone:</span> <span>-</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="font-bold text-lg mb-2" style={{ color: B2B_PRIMARY }}>
          Help Center / FAQs
        </div>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>How do I track my gold delivery?</li>
          <li>What is the process for resolving payment disputes?</li>
          <li>Where can I find my commission statements?</li>
        </ul>
      </div>
    </div>
  );
}