import React, { useState, useRef, useEffect } from "react";

// Scroll fade-in hook with direction (same as AboutUs)
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
    style: {
      opacity: visible ? 1 : 0,
      transform: visible
        ? "none"
        : `translateY(${yOffset}px) translateX(${xOffset}px)`,
      transition:
        "opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1)",
      willChange: "opacity, transform",
    },
  };
}

const ContactUsPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeSection, setActiveSection] = useState<"contact" | "chat" | "email" | "call">("contact");

  // Scroll fade-in hooks for each icon section
  const officeFade = useScrollFadeIn(0.13, 36, -80);
  const contactFade = useScrollFadeIn(0.13, 36, 0);
  const followFade = useScrollFadeIn(0.13, 36, 80);

  // Scroll fade-in for contact form/actions and map
  const contactFormFade = useScrollFadeIn(0.13, 36, 0);
  const mapFade = useScrollFadeIn(0.13, 36, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
    // Optionally reset form fields here
  };

  // Section content for Chat, Email, Call as popup
  const renderPopup = () => {
    if (activeSection === "chat") {
      return (
        <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-2xl px-10 py-8 shadow-xl flex flex-col items-center animate-fade-in min-w-[340px] max-w-[90vw] pointer-events-auto">
            <div className="text-[#7a1335] text-5xl mb-4"><i className="fa fa-comments"></i></div>
            <h2 className="text-2xl font-bold mb-2 text-[#7a1335]">Chat With Us</h2>
            <p className="text-lg text-[#4a2e1e] mb-6 text-center max-w-lg">
              Our support team is available to chat with you instantly.<br />
              <span className="font-semibold">Start a chat session below:</span>
            </p>
            <a
              href="https://wa.me/918190029992"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-lg shadow hover:bg-[#991616] transition-colors flex items-center gap-3"
            >
              <i className="fa fa-whatsapp text-2xl"></i>
              Start WhatsApp Chat
            </a>
            <a
              href="/contactus"
              className="mt-8 text-[#7a1335] underline hover:text-[#991616] transition-colors"
              style={{ display: "inline-block", textAlign: "center" }}
              onClick={() => setActiveSection("contact")}
            >
              &larr; Back to Contact Options
            </a>
          </div>
        </div>
      );
    }
    if (activeSection === "email") {
      return (
        <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-2xl px-10 py-8 shadow-xl flex flex-col items-center animate-fade-in min-w-[340px] max-w-[90vw] pointer-events-auto">
            <div className="text-[#7a1335] text-5xl mb-4"><i className="fa fa-envelope"></i></div>
            <h2 className="text-2xl font-bold mb-2 text-[#7a1335]">Write E-mail</h2>
            <p className="text-lg text-[#4a2e1e] mb-6 text-center max-w-lg">
              You can reach us anytime via email.<br />
              <span className="font-semibold">Our team will respond promptly.</span>
            </p>
            <a
              href="mailto:support@greenheapgold.com"
              className="px-8 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-lg shadow hover:bg-[#991616] transition-colors flex items-center gap-3"
            >
              <i className="fa fa-envelope-open"></i>
              support@greenheapgold.com
            </a>
            <a
              href="/contactus"
              className="mt-8 text-[#7a1335] underline hover:text-[#991616] transition-colors"
              style={{ display: "inline-block", textAlign: "center" }}
              onClick={() => setActiveSection("contact")}
            >
              &larr; Back to Contact Options
            </a>
          </div>
        </div>
      );
    }
    if (activeSection === "call") {
      return (
        <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-2xl px-10 py-8 shadow-xl flex flex-col items-center animate-fade-in min-w-[340px] max-w-[90vw] pointer-events-auto">
            <div className="text-[#7a1335] text-5xl mb-4"><i className="fa fa-phone"></i></div>
            <h2 className="text-2xl font-bold mb-2 text-[#7a1335]">Make a Call</h2>
            <p className="text-lg text-[#4a2e1e] mb-6 text-center max-w-lg">
              Call us directly and our team will assist you immediately.<br />
              <span className="font-semibold">Available 9am - 9pm IST</span>
            </p>
            <a
              href="tel:+918190059995"
              className="px-8 py-3 rounded-lg bg-[#7a1335] text-white font-bold text-lg shadow hover:bg-[#991616] transition-colors flex items-center gap-3"
            >
              <i className="fa fa-phone-square"></i>
              +91 81900 29992
            </a>
            <a
              href="/contactus"
              className="mt-8 text-[#7a1335] underline hover:text-[#991616] transition-colors"
              style={{ display: "inline-block", textAlign: "center" }}
              onClick={() => setActiveSection("contact")}
            >
              &larr; Back to Contact Options
            </a>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-[#faf6f3] to-[#fff8e7] w-screen min-h-screen overflow-x-hidden">
      {/* Top Banner */}
      <div
        style={{
          width: "100vw",
          minHeight: 320,
          height: "38vw",
          maxHeight: 420,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "url('/home/banner 2.png') center center/cover no-repeat",
          margin: 0,
          border: "none",
          boxShadow: "none",
          position: "relative",
          left: "46%",
          right: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100vw",
            height: "100%",
            background: "rgba(0,0,0,0.36)",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 2,
          }}
        />
        <h1
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "2.8rem",
            zIndex: 3,
            position: "relative",
            textAlign: "center",
            letterSpacing: 0.5,
            width: "100%",
          }}
        >
          Contact Us
        </h1>
      </div>

      {/* Popup for form submit */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-2xl px-10 py-8 shadow-xl flex flex-col items-center animate-fade-in">
            <span className="text-green-600 text-4xl mb-3">
              <i className="fa fa-check-circle"></i>
            </span>
            <div className="text-xl font-semibold text-[#7a1335] mb-2 text-center">
              Our Team Reach You within A minute
            </div>
            <button
              className="mt-2 px-6 py-2 rounded-lg bg-[#7a1335] text-white font-semibold shadow hover:bg-[#991616] transition-colors"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup for Chat/Email/Call */}
      {activeSection !== "contact" && renderPopup()}

      {/* Main Section */}
      <div className="container py-10">
        {activeSection === "contact" && (
          <>
            {/* Info Row with scroll fade-in */}
            <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-0 mb-10 border-b border-[#eee] pb-8">
              {/* Office Address */}
              <div
                className="flex-1 flex flex-col items-center justify-center px-4 border-b md:border-b-0 md:border-r border-[#eee]"
                ref={officeFade.ref}
                style={officeFade.style}
              >
                <span className="flex items-center justify-center rounded-full w-20 h-20 mb-4 bg-gradient-to-br from-[#991616] to-[#7a1335] shadow-[0_2px_16px_#f0e3d1] transition-transform duration-200 hover:scale-110">
                  <img
                    src="/home/Location 1.png"
                    alt="Office Address"
                    className="w-14 h-14 object-contain drop-shadow-lg"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </span>
                <div className="font-bold text-xl mb-2 mt-2 text-black text-center">Office Address</div>
                <div className="text-base text-[#222] text-center">
                  No. 1/PL922, 66th Street, 11th Sector Kalaignar Karunanidhi Nagar
                </div>
              </div>
              {/* Contact Us */}
              <div
                className="flex-1 flex flex-col items-center justify-center px-4 border-b md:border-b-0 md:border-r border-[#eee]"
                ref={contactFade.ref}
                style={contactFade.style}
              >
                <span className="flex items-center justify-center rounded-full w-20 h-20 mb-4 bg-gradient-to-br from-[#991616] to-[#7a1335] shadow-[0_2px_16px_#f0e3d1] transition-transform duration-200 hover:scale-110">
                  <img
                    src="/home/call 2.png"
                    alt="Contact Us"
                    className="w-14 h-14 object-contain drop-shadow-lg"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </span>
                <div className="font-bold text-xl mb-2 mt-2 text-black text-center">Contact Us</div>
                <div className="text-base text-[#222] text-center">+91 81900 29992</div>
              </div>
              {/* Follow Us */}
              <div
                className="flex-1 flex flex-col items-center justify-center px-4"
                ref={followFade.ref}
                style={followFade.style}
              >
                <span className="flex items-center justify-center rounded-full w-20 h-20 mb-4 bg-gradient-to-br from-[#991616] to-[#7a1335] shadow-[0_2px_16px_#f0e3d1] transition-transform duration-200 hover:scale-110">
                  <img
                    src="/home/Follow.png"
                    alt="Follow Us"
                    className="w-14 h-14 object-contain drop-shadow-lg"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </span>
                <div className="font-bold text-xl mb-2 mt-2 text-black text-center">Follow Us</div>
                <div className="flex justify-center gap-3 mt-2">
                  <a href="#" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow-md">
                    <img src="/home/Facebook_1.png" alt="Facebook" className="w-6 h-6 object-contain" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow-md">
                    <img src="/home/insta 1.png" alt="Instagram" className="w-6 h-6 object-contain" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow-md">
                    <img src="/home/X_1.png" alt="Twitter" className="w-6 h-6 object-contain" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow-md">
                    <img src="/home/Youtube 1.png" alt="YouTube" className="w-6 h-6 object-contain" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5e9ea] hover:bg-[#f9e9c7] transition-all duration-200 hover:scale-110 shadow-md">
                    <img src="/home/Linkedin 1.png" alt="LinkedIn" className="w-6 h-6 object-contain" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form & Actions with scroll effect */}
            <div
              className="flex flex-col md:flex-row items-center justify-center gap-10 bg-gradient-to-br from-[#fff8e7] to-[#f7eded] rounded-3xl shadow-[0_4px_24px_#f0e3d1] p-10 mb-10"
              ref={contactFormFade.ref}
              style={contactFormFade.style}
            >
              <form
                className="bg-white rounded-2xl shadow-[0_2px_12px_#f0e3d1] p-8 w-full max-w-xl border-2 border-[#f9e9c7] hover:shadow-[0_8px_32px_#f9e9c7] transition-shadow duration-200"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label font-semibold text-[#7a1335]">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-lg border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label font-semibold text-[#7a1335]">
                      Second Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-lg border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30"
                      placeholder="Second Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label font-semibold text-[#7a1335]">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-lg border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label font-semibold text-[#7a1335]">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-lg border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30"
                      placeholder="Phone"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label font-semibold text-[#7a1335]">
                      Requirement (Optional)
                    </label>
                    <textarea
                      className="form-control rounded-lg border-[#f0e3d1] focus:border-[#7a1335] focus:ring-[#7a1335]/30"
                      rows={3}
                      placeholder="Type message"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn mt-6 w-full rounded-lg bg-gradient-to-r from-[#7a1335] to-[#991616] text-white font-bold py-3 text-lg shadow hover:from-[#991616] hover:to-[#7a1335] transition-all"
                >
                  Submit
                </button>
              </form>
              {/* Contact Actions */}
              <div className="flex flex-col gap-6 items-center w-full max-w-xs">
                <button
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[#fff8e7] shadow-[0_2px_12px_#f0e3d1] text-[#7a1335] font-bold text-lg hover:bg-[#f9e9c7] transition-colors w-full justify-center"
                  style={{ border: "2px solid #f9e9c7" }}
                  onClick={() => setActiveSection("chat")}
                >
                  <i className="fa fa-comments text-2xl"></i>
                  Chat With Us
                </button>
                <button
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[#fff8e7] shadow-[0_2px_12px_#f0e3d1] text-[#7a1335] font-bold text-lg hover:bg-[#f9e9c7] transition-colors w-full justify-center"
                  style={{ border: "2px solid #f9e9c7" }}
                  onClick={() => setActiveSection("email")}
                >
                  <i className="fa fa-envelope text-2xl"></i>
                  Write E-mail
                </button>
                <button
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[#fff8e7] shadow-[0_2px_12px_#f0e3d1] text-[#7a1335] font-bold text-lg hover:bg-[#f9e9c7] transition-colors w-full justify-center"
                  style={{ border: "2px solid #f9e9c7" }}
                  onClick={() => setActiveSection("call")}
                >
                  <i className="fa fa-phone text-2xl"></i>
                  Make a Call
                </button>
              </div>
            </div>
          </>
        )}

        {/* Add gap between contact and map */}
        <div className="my-10"></div>

        {/* Google Map with scroll effect */}
        <div className="row mt-10" ref={mapFade.ref} style={mapFade.style}>
          <div className="col-12">
            <div className="rounded-2xl overflow-hidden shadow-[0_2px_12px_#f0e3d1] bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.25882327426!2d80.1805!3d13.0477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52613e7b7c1e1d%3A0x7e6e7e7e7e7e7e7e!2sChennai%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="320"
                style={{ border: 0, background: "#fff" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;

