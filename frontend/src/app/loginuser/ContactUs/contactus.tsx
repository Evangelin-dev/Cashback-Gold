import {
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Users,
  XCircle,
  Youtube
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
// Correcting the import path to be more standard
import axiosInstance from "../../../utils/axiosInstance"; 

// Scroll fade-in hook (no changes)
function useScrollFadeIn(threshold = 0.15, yOffset = 40, xOffset = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return {
    ref,
    fadeClass: visible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 translate-y-[${yOffset}px] translate-x-[${xOffset}px]`,
  };
}

const LContactUsPage = () => {
  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // State for API call status and errors
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [apiError, setApiError] = useState<string | null>(null);

  // CORRECTED STATE: This now only controls the popups, not the main page content.
  const [activePopup, setActivePopup] = useState<"none" | "chat" | "email" | "call">("none");

  // Scroll fade-in hooks
  const officeFade = useScrollFadeIn(0.13, 36, -80);
  const contactFade = useScrollFadeIn(0.13, 36, 0);
  const followFade = useScrollFadeIn(0.13, 36, 80);
  const contactFormFade = useScrollFadeIn(0.13, 36, 0);
  const mapFade = useScrollFadeIn(0.13, 36, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setApiError(null);

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      message,
    };

    try {
      await axiosInstance.post('/api/contact', formData);
      setStatus('succeeded');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error: any) {
      setStatus('failed');
      const errorMessage = error.response?.data?.message || error.message || 'Could not connect to the server.';
      setApiError(errorMessage);
    }
  };

  // Status Popup for form submission success/failure
  const StatusPopup = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center animate-fade-in w-80">
        {status === 'succeeded' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-[#7a1335] mb-2 text-center">Message Sent!</h2>
            <p className="text-gray-600 text-center mb-5">Our team will get back to you shortly.</p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-[#7a1335] mb-2 text-center">Submission Failed</h2>
            <p className="text-gray-600 text-center mb-5">{apiError}</p>
          </>
        )}
        <button
          className="mt-2 w-full py-2 rounded-lg bg-[#7a1335] text-white font-semibold shadow hover:bg-[#991616] transition-colors"
          onClick={() => setStatus('idle')}
        >
          Close
        </button>
      </div>
    </div>
  );

  // This function now renders the popups based on the `activePopup` state
  const renderActionPopup = () => {
    // A single close button for all popups
    const backButton = (
      <button
        onClick={() => setActivePopup("none")} // This now simply closes the popup
        className="mt-8 text-[#7a1335] underline hover:text-[#991616] transition-colors"
      >
        &larr; Back to Contact Page
      </button>
    );

    const popupContent = {
      chat: {
        icon: MessageCircle,
        title: "Chat With Us",
        text: "Our support team is available to chat with you instantly.",
        action: <a href="https://wa.me/918190029992" target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-lg shadow hover:bg-[#991616] transition-colors flex items-center gap-3">Start WhatsApp Chat</a>
      },
      email: {
        icon: Mail,
        title: "Write E-mail",
        text: "Our team will respond promptly.",
        action: <a href="mailto:support@greenheapgold.com" className="px-8 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-lg shadow hover:bg-[#991616] transition-colors flex items-center gap-3">support@greenheapgold.com</a>
      },
      call: {
        icon: Phone,
        title: "Make a Call",
        text: "Available 9am - 9pm IST",
        action: <a href="tel:+918190059995" className="px-8 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-lg shadow hover:bg-[#991616] transition-colors flex items-center gap-3">+91 81900 29992</a>
      }
    };
    
    // Return null if no popup should be active
    if (activePopup === 'none') return null;
    
    const { icon: Icon, title, text, action } = popupContent[activePopup];

    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center z-40 bg-black/50">
        <div className="bg-white rounded-2xl px-10 py-8 shadow-xl flex flex-col items-center animate-fade-in min-w-[340px] max-w-[90vw] pointer-events-auto">
          <Icon className="text-[#7a1335] w-14 h-14 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-[#7a1335]">{title}</h2>
          <p className="text-lg text-[#4a2e1e] mb-6 text-center max-w-lg">{text}</p>
          {action}
          {backButton}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#faf6f3] to-[#fff8e7] w-full min-h-screen overflow-x-hidden">
      {/* Top Banner */}
      <div className="w-full min-h-[180px] h-[28vw] max-h-[260px] flex items-center justify-center relative" style={{backgroundImage: "url('/home/banner 2.png')", backgroundSize: "cover", backgroundPosition: "center"}}>
        <div className="absolute inset-0 bg-black/40 z-1" />
        <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl z-10 relative text-center tracking-wide w-full">Contact Us</h1>
      </div>

      {/* API Status Popup */}
      {(status === 'succeeded' || status === 'failed') && <StatusPopup />}
      
      {/* Popups for Chat/Email/Call - now overlays */}
      {renderActionPopup()}

      {/* Main Section */}
      <div className="container py-10">
        {/* The main content is NO LONGER conditional. It always shows. */}
        <>
          {/* Info Row */}
          <div className="w-full flex flex-col sm:flex-row justify-center items-stretch gap-0 mb-8 border-b border-[#eee] pb-6 text-sm">
            <div ref={officeFade.ref} className={`flex-1 flex flex-col items-center justify-center px-2 py-4 sm:py-0 border-b sm:border-b-0 sm:border-r border-[#eee] transition-all duration-700 ${officeFade.fadeClass}`}>
              <span className="flex items-center justify-center rounded-full w-12 h-12 mb-2 bg-[#991616] shadow-md hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-white" />
              </span>
              <div className="font-bold text-base mb-1 mt-1 text-black text-center">Office Address</div>
              <div className="text-xs text-[#222] text-center">No. 1/PL922, 66th Street, 11th Sector<br />Kalaignar Karunanidhi Nagar<br />Tamil Nadu, Chennai, India.</div>
            </div>
            <div ref={contactFade.ref} className={`flex-1 flex flex-col items-center justify-center px-2 py-4 sm:py-0 border-b sm:border-b-0 sm:border-r border-[#eee] transition-all duration-700 ${contactFade.fadeClass}`}>
              <span className="flex items-center justify-center rounded-full w-12 h-12 mb-2 bg-[#991616] shadow-md hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-white" />
              </span>
              <div className="font-bold text-base mb-1 mt-1 text-black text-center">Contact Us</div>
              <div className="text-xs text-[#222] text-center">+91 81900 29992</div>
            </div>
            <div ref={followFade.ref} className={`flex-1 flex flex-col items-center justify-center px-2 py-4 sm:py-0 transition-all duration-700 ${followFade.fadeClass}`}>
              <span className="flex items-center justify-center rounded-full w-12 h-12 mb-2 bg-[#991616] shadow-md hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </span>
              <div className="font-bold text-base mb-1 mt-1 text-black text-center">Follow Us</div>
              <div className="flex justify-center gap-2 mt-1">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow"><Facebook className="w-5 h-5 text-[#7a1335]" /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow"><Instagram className="w-5 h-5 text-[#7a1335]" /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow"><Twitter className="w-5 h-5 text-[#7a1335]" /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow"><Youtube className="w-5 h-5 text-[#7a1335]" /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow"><Linkedin className="w-5 h-5 text-[#7a1335]" /></a>
              </div>
            </div>
          </div>

          {/* Contact Form & Actions with scroll effect */}
          <div ref={contactFormFade.ref} className={`flex flex-col sm:flex-row items-center justify-center gap-6 bg-gradient-to-br from-[#fff8e7] to-[#f7eded] rounded-2xl shadow p-6 mb-8 transition-all duration-700 ${contactFormFade.fadeClass}`}>
            <form className="bg-white rounded-xl shadow p-4 w-full max-w-md border-2 border-[#f9e9c7] hover:shadow-lg transition-shadow duration-200" onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#7a1335] mb-1 text-sm">First Name <span className="text-red-500">*</span></label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="block w-full rounded-lg border border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30 px-3 py-2 text-sm" placeholder="First Name" required />
                </div>
                <div>
                  <label className="block font-semibold text-[#7a1335] mb-1 text-sm">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="block w-full rounded-lg border border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30 px-3 py-2 text-sm" placeholder="Last Name" required />
                </div>
                <div>
                  <label className="block font-semibold text-[#7a1335] mb-1 text-sm">Email <span className="text-red-500">*</span></label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full rounded-lg border border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30 px-3 py-2 text-sm" placeholder="Email" required />
                </div>
                <div>
                  <label className="block font-semibold text-[#7a1335] mb-1 text-sm">Phone <span className="text-red-500">*</span></label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full rounded-lg border border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30 px-3 py-2 text-sm" placeholder="Phone" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#7a1335] mb-1 text-sm">Message (Optional)</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} className="block w-full rounded-lg border border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30 px-3 py-2 text-sm" rows={2} placeholder="Type message"></textarea>
                </div>
              </div>
              <button type="submit" disabled={status === 'loading'} className="mt-4 w-full rounded-lg bg-[#7a1335] text-white font-bold py-2 text-base shadow hover:bg-[#991616] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                {status === 'loading' ? 'Submitting...' : 'Submit'}
              </button>
            </form>
            {/* Contact Actions */}
            <div className="flex flex-col gap-4 items-center w-full max-w-xs">
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-base shadow hover:bg-[#991616] transition-colors w-full justify-center border-2 border-[#7a1335]" onClick={() => setActivePopup("chat")}> <MessageCircle className="w-5 h-5" /> Chat With Us </button>
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-base shadow hover:bg-[#991616] transition-colors w-full justify-center border-2 border-[#7a1335]" onClick={() => setActivePopup("email")}> <Mail className="w-5 h-5" /> Write E-mail </button>
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-base shadow hover:bg-[#991616] transition-colors w-full justify-center border-2 border-[#7a1335]" onClick={() => setActivePopup("call")}> <Phone className="w-5 h-5" /> Make a Call </button>
            </div>
          </div>
        </>

        {/* Add gap between contact and map */}
        <div className="my-10"></div>

        {/* Google Map with scroll effect */}
        <div ref={mapFade.ref} className={`mt-8 transition-all duration-700 ${mapFade.fadeClass}`}>
          <div className="rounded-xl overflow-hidden shadow bg-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.993011985452!2d80.1983058758832!3d13.03603341399778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266d2507e1e69%3A0x82f4277a561e5616!2sGREENHEAP%20TECHNOLOGIES%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1715082196657!5m2!1sen!2sin"
              width="100%"
              height="220"
              className="border-0 bg-white w-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LContactUsPage;