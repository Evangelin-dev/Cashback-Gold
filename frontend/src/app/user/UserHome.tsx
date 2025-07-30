import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { feedbacks, schemes } from "../../../constants";
import Carousel from "../components/custom/Carousel";
import axiosInstance from "../../utils/axiosInstance";
import { ShieldCheck, Star } from 'lucide-react';
import style from "./style.module.css";
import { FaArrowAltCircleRight } from "react-icons/fa";


function useScrollFadeInTailwind(direction: "left" | "right" | "up" | "down" = "up", duration = 700, delay = 100) {
  const dom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { current } = dom;
    if (!current) return;

    const initialClasses = ['opacity-0', direction === 'up' ? 'translate-y-12' : '', direction === 'down' ? '-translate-y-12' : '', direction === 'left' ? '-translate-x-12' : '', direction === 'right' ? 'translate-x-12' : ''].filter(Boolean);
    const finalClasses = ['opacity-100', 'translate-y-0', 'translate-x-0'];

    current.classList.add('transition-all', `duration-${duration}`, `delay-${delay}`, 'ease-out');
    current.classList.add(...initialClasses);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(...initialClasses);
          entry.target.classList.add(...finalClasses);
        } else {
          entry.target.classList.remove(...finalClasses);
          entry.target.classList.add(...initialClasses);
        }
      });
    }, { threshold: 0.1 });

    if (current) { observer.observe(current); }
    return () => { if (current) { observer.unobserve(current); } };
  }, [direction, duration, delay]);

  return { ref: dom };
}


// NEW: Interface that matches the actual data from the /api/flyers endpoint
interface ApiFlyerData {
  id: number;
  type: 'GOLD_PLANT' | 'SIP_PLAN' | 'SAVING_PLAN';
  uploadDate: string;
  url: string; // API sends 'url', not 'imageUrl'
}

// Interface for the processed data that the UI will use
interface ProcessedFlyer {
  id: number;
  flyerName: string;
  imageUrl: string;
  redirectUrl: string;
  type: 'GOLD_PLANT' | 'SIP_PLAN' | 'SAVING_PLAN';
}


const UserHome = () => {
    const navigate = useNavigate();
  // NEW: State for the dynamic schemes section
    const [dynamicSchemes, setDynamicSchemes] = useState<ProcessedFlyer[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [schemesError, setSchemesError] = useState<string | null>(null);

  // NEW: Fetch dynamic schemes on component mount
  const getButtonLabel = (type: ProcessedFlyer['type']) => {
    switch (type) {
      case 'SAVING_PLAN': return 'Buy Chit';
      case 'SIP_PLAN': return 'Start SIP';
      case 'GOLD_PLANT': return 'Buy Gold';
      default: return 'View Scheme';
    }
  };

  // Helper to generate a descriptive name from the type
  const getFlyerName = (type: ProcessedFlyer['type']) => {
    switch (type) {
      case 'SAVING_PLAN': return 'DIGI GOLD CHIT PLAN';
      case 'SIP_PLAN': return 'DIGI GOLD SIP PLAN';
      case 'GOLD_PLANT': return 'GOLD PLANT SCHEME';
      default: return 'Gold Scheme';
    }
  };

  // Helper to determine the navigation path from the type
  const getRedirectUrl = (type: ProcessedFlyer['type']) => {
    switch (type) {
      case 'SAVING_PLAN': return '/chit';
      case 'SIP_PLAN': return '/goldsip';
      case 'GOLD_PLANT': return '/schemes';
      default: return '/';
    }
  };


  // Fetch and process dynamic schemes on component mount
  useEffect(() => {
    const fetchSchemes = async () => {
      setSchemesLoading(true);
      setSchemesError(null);
      try {
        const flyerTypes: ApiFlyerData['type'][] = ['SAVING_PLAN', 'SIP_PLAN', 'GOLD_PLANT'];
        
        const responses = await Promise.all(
          flyerTypes.map(type => axiosInstance.get<ApiFlyerData[]>(`/api/flyers?type=${type}`))
        );

        // Map the raw API data to the structure our UI needs
        const fetchedFlyers = responses
          .map(response => response.data?.[0]) 
          .filter((flyer): flyer is ApiFlyerData => !!flyer) // Filter out any empty responses
          .map((flyer: ApiFlyerData): ProcessedFlyer => ({ // Transform the data
            id: flyer.id,
            type: flyer.type,
            imageUrl: flyer.url, // Map 'url' to 'imageUrl'
            flyerName: getFlyerName(flyer.type), // Generate the name
            redirectUrl: getRedirectUrl(flyer.type), // Generate the redirect URL
          }));

        setDynamicSchemes(fetchedFlyers);

      } catch (err) {
        console.error("Failed to fetch schemes:", err);
        setSchemesError("Could not load schemes at this time.");
      } finally {
        setSchemesLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const partners = [
    { src: "/assets/amazon.png", alt: "Amazon Pay" },
    { src: "/assets/axis.png", alt: "Axis Bank" },
    { src: "/assets/cart.png", alt: "CaratLane" },
    { src: "/assets/tanis.png", alt: "Tanishq" },
    { src: "/assets/phonepe.png", alt: "PhonePe" }
  ];

  const bannerRef = useScrollFadeInTailwind("up", 700, 100);
  const feedbackRef = useScrollFadeInTailwind("up", 700, 100);
  const wealthRef = useScrollFadeInTailwind("right", 700, 0);
  const whyRef = useScrollFadeInTailwind("left", 700, 0);
  const convertRef = useScrollFadeInTailwind("right", 700, 0);
  const faqRef = useScrollFadeInTailwind("up", 700, 0);

  return (
    <div className="pt-[102px] bg-gray-50">
      <div style={{ position: "relative", zIndex: 1 }}>
        <Carousel />
        <div className="d-flex   justify-content-center ">
          <div
            className="goldsiver-box bg-white p-4 mt-5"
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 16px #e6e6e6",
              maxWidth: 650,
              width: "100%",
              margin: "0 auto",
              padding: "32px 28px 28px 28px",
            }}
          >
            <div>
              <div className="mb-3" style={{ borderBottom: "2px solid #991313", paddingBottom: 8, display: "flex", alignItems: "center" }}>
                <span style={{ color: "#991313", fontWeight: 600, fontSize: 28, marginRight: 18 }}>
                  Digital gold / Silver
                </span>
              </div>
              <div className="row" style={{ fontFamily: "inherit" }}>
                {/* 22k Gold */}
                <div className="col-12 col-md-6 mb-2" style={{ borderRight: "1px solid #e0e0e0" }}>
                  <div className="d-flex align-items-center mb-1">
                    <span style={{ color: "#991313", fontSize: 18, marginRight: 8 }}>
                      <i className="fa fa-dot-circle-o" style={{ color: "#991313", fontSize: 18 }}></i>
                    </span>
                    <span style={{ fontWeight: 500, color: "#7a1335", fontSize: 18 }}>
                      Live Buy Price (Gold)
                    </span>
                    <span
                      style={{
                        background: "#fff3cd",
                        color: "#bfa21a",
                        fontWeight: 600,
                        fontSize: 15,
                        borderRadius: 6,
                        padding: "2px 10px",
                        marginLeft: 10,
                        display: "inline-block",
                      }}
                    >
                      22k
                    </span>
                  </div>
                  <div className="d-flex align-items-end mb-1">
                    <span style={{ fontWeight: 700, fontSize: 28, color: "#7a1335" }}>8000/gm</span>
                    <span style={{ color: "#888", fontSize: 15, marginLeft: 12, marginBottom: 2 }}>
                      +3% GST applicable
                    </span>
                  </div>
                </div>
                {/* 24k Gold */}
                <div className="col-12 col-md-6 mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <span style={{ color: "#991313", fontSize: 18, marginRight: 8 }}>
                      <i className="fa fa-dot-circle-o" style={{ color: "#991313", fontSize: 18 }}></i>
                    </span>
                    <span style={{ fontWeight: 500, color: "#7a1335", fontSize: 18 }}>
                      Live Buy Price (Gold)
                    </span>
                    <span
                      style={{
                        background: "#fff3cd",
                        color: "#bfa21a",
                        fontWeight: 600,
                        fontSize: 15,
                        borderRadius: 6,
                        padding: "2px 10px",
                        marginLeft: 10,
                        display: "inline-block",
                      }}
                    >
                      24k
                    </span>
                  </div>
                  <div className="d-flex align-items-end mb-1">
                    <span style={{ fontWeight: 700, fontSize: 28, color: "#7a1335" }}>8705/gm</span>
                    <span style={{ color: "#888", fontSize: 15, marginLeft: 12, marginBottom: 2 }}>
                      +3% GST applicable
                    </span>
                  </div>
                </div>
                {/* Silver */}
                <div className="col-12 col-md-6 mt-2">
                  <div className="d-flex align-items-center mb-1">
                    <span style={{ color: "#991313", fontSize: 18, marginRight: 8 }}>
                      <i className="fa fa-dot-circle-o" style={{ color: "#991313", fontSize: 18 }}></i>
                    </span>
                    <span style={{ fontWeight: 500, color: "#7a1335", fontSize: 18 }}>
                      Live Buy Price (Silver)
                    </span>
                    <span
                      style={{
                        background: "#fff3cd",
                        color: "#bfa21a",
                        fontWeight: 600,
                        fontSize: 15,
                        borderRadius: 6,
                        padding: "2px 10px",
                        marginLeft: 10,
                        display: "inline-block",
                      }}
                    >
                      99.9%
                    </span>
                  </div>
                  <div className="d-flex align-items-end mb-1">
                    <span style={{ fontWeight: 700, fontSize: 28, color: "#7a1335" }}>107/gm</span>
                    <span style={{ color: "#888", fontSize: 15, marginLeft: 12, marginBottom: 2 }}>
                      +3% GST applicable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


          <section className={`mb-5 mt-6 pt-6 ${style.home_scheme_section}`}>
        <h3 className="text-center" style={{ fontSize: "2rem", fontWeight: 700, marginTop: "180px", marginBottom: "24px", position: "relative", zIndex: 2, color: "#bf7e1a" }}>Quick overview of schemes</h3>
        <div className="w-100 d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-4 mt-4" style={{ maxWidth: 1200, margin: "0 auto", minHeight: 500 }}>
          {schemesLoading && <div className="text-center w-100 text-gray-600">Loading schemes...</div>}
          {schemesError && <div className="text-center w-100 text-red-600">{schemesError}</div>}
          {!schemesLoading && !schemesError && dynamicSchemes.map((scheme) => {
            const buttonLabel = getButtonLabel(scheme.type);
            return (
              <div key={scheme.id} className="bg-white d-flex align-items-center justify-content-center position-relative" style={{ borderRadius: 18, maxWidth: 400, minWidth: 220, height: 500, overflow: "hidden", boxShadow: "0 4px 24px #e6d7b7", border: "10px solid #bf7e1a" }}>
                <img src={scheme.imageUrl} alt={scheme.flyerName} style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
                <button style={{ position: "absolute", left: 14, bottom: 10, background: "#8a2342", color: "#fff", border: "none", borderRadius: 40, padding: "10px 28px 10px 22px", fontWeight: 500, fontSize: 18, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 8px #c4912e33", cursor: "pointer", transition: "background 0.2s" }} onClick={() => navigate(scheme.redirectUrl)}>
                  {buttonLabel}
                  <span style={{ fontSize: 22, marginLeft: 8, display: "flex", alignItems: "center" }}><svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 4L22 11M22 11L15.5 18M22 11H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div ref={feedbackRef.ref} className="w-full min-h-[14rem] bg-[#8a2342] flex items-center justify-center my-12">
        <img src="/assets/red_banner.png" alt="Discover Our Jewel Collection" className="w-full h-auto object-cover" />
      </div>

      <section className="bg-white py-12">
        <h3 className="text-center text-[#7a1335] font-bold text-3xl mb-8"><span className="inline-block border-b-2 border-[#bf7e1a] pb-2">Clients Say's?</span></h3>
        <ClientFeedbackCarousel />
      </section>

      <div ref={wealthRef.ref} className="bg-[#f3ffe8] rounded-3xl max-w-[98%] mx-auto my-10 p-8 md:p-0 flex flex-col md:flex-row items-center justify-between min-h-[140px]">
        <div className="flex items-center gap-6 md:pl-12 text-center md:text-left">
          <svg className="hidden md:block" width="54" height="54" viewBox="0 0 54 54" fill="none"><rect x="8" y="32" width="8" height="14" rx="2" fill="#9B1C1C" /><rect x="22" y="22" width="8" height="24" rx="2" fill="#9B1C1C" /><rect x="36" y="12" width="8" height="34" rx="2" fill="#9B1C1C" /><circle cx="44" cy="44" r="11" fill="#FFE066" /><path d="M44 40v5m0 0v-5m0 5h-3m3 0h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div>
            <div className="font-bold text-3xl text-[#7a1335] leading-tight">Grow your wealth smarter</div>
            <div className="text-xl text-[#7a1335] mt-1">Start an SIP to invest in gold every month.</div>
          </div>
        </div>
        <button onClick={() => navigate("/goldsip")} className="bg-gradient-to-r from-[#bf7e1a] to-[#8a2342] text-white rounded-full py-4 px-10 font-medium text-xl mt-6 md:mt-0 md:mr-12 flex items-center gap-3 transition-transform hover:scale-105">
          Start investing
          <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 4L22 11M22 11L15.5 18M22 11H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <section ref={whyRef.ref} className="bg-[#991313] py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <img src="/assets/physical.png" alt="Gold Jar" className="w-[400px] h-[400px] object-contain rounded-3xl bg-gradient-to-br from-yellow-50 to-white shadow-2xl border-4 border-[#bf7e1a] transition-transform hover:scale-105 cursor-pointer" />
          </div>
          <div className="flex-[2] min-w-0">
            <div className="text-left font-bold text-4xl text-[#bf7e1a] mb-6 leading-tight">Why Choose Digital Gold?</div>
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 min-w-[220px] max-w-xs flex flex-col items-center text-center border-2 border-[#f9e9c7] relative"><img src="/assets/0.png" alt="Guaranteed 24K Gold" className="w-14 h-14 mb-4" /><div className="font-bold text-[#991313] text-xl mb-2">Guaranteed 24K Gold</div><p className="text-[#7a1335] text-sm">100% purity, certified and insured.</p><span className="absolute top-4 right-4 text-[#bf7e1a]/10 text-3xl font-black">01</span></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 min-w-[220px] max-w-xs flex flex-col items-center text-center border-2 border-[#f9e9c7] relative"><img src="/assets/1.png" alt="Sell anytime from home" className="w-14 h-14 mb-4" /><div className="font-bold text-[#991313] text-xl mb-2">Sell Anytime, Anywhere</div><p className="text-[#7a1335] text-sm">24x7 liquidity, instant sale and redemption.</p><span className="absolute top-4 right-4 text-[#bf7e1a]/10 text-3xl font-black">02</span></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 min-w-[220px] max-w-xs flex flex-col items-center text-center border-2 border-[#f9e9c7] relative"><img src="/assets/2.png" alt="Earn income on gold" className="w-14 h-14 mb-4" /><div className="font-bold text-[#991313] text-xl mb-2">Earn Income on Gold</div><p className="text-[#7a1335] text-sm">Get rewards, cashback, and interest on your savings.</p><span className="absolute top-4 right-4 text-[#bf7e1a]/10 text-3xl font-black">03</span></div>
            </div>
            <div className="mt-8 text-white font-medium text-base bg-[#bf7e1a] rounded-xl p-5 shadow-lg border-2 border-[#f9e9c7] max-w-2xl text-center mx-auto lg:mx-0"><span className="font-bold text-white">Bonus:</span> Digital gold is easy to gift, track, and manage.</div>
          </div>
        </div>
      </section>

      <section ref={convertRef.ref} className="bg-gradient-to-r from-yellow-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-[2] min-w-0">
            <div className="font-bold text-3xl text-[#7a1335] mb-3">Convert Digital to Physical Gold & Silver</div><div className="text-[#7a1335] text-lg mb-4 font-medium">24K Gold / Silver Coins & Bars delivered to your doorstep</div>
            <p className="text-[#7a1335] text-base mb-6 leading-relaxed">Convert your digital gold to physical gold by paying a nominal minting charge. Your delivery comes with free insurance, to ensure your coins and bars reach you safely.</p>
            <button className="bg-gradient-to-r from-[#bf7e1a] to-[#8a2342] text-[#7a1436] rounded-full py-3 px-8 font-semibold text-xl flex items-center gap-3 shadow-lg transition-transform hover:scale-105">Buy Gold
              <FaArrowAltCircleRight size={24} />
            </button>
            <div className="mt-6 text-[#bfa21a] font-medium text-sm flex items-center gap-2"><ShieldCheck size={18} /> 100% insured delivery & purity guaranteed</div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/assets/golds.png" alt="Gold & Silver Coins" className="w-[360px] h-[360px] object-contain" />
          </div>
        </div>
      </section>

      <section ref={faqRef.ref} className="bg-[#991313] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center font-bold text-4xl mb-8 text-[#ffe066]">Frequently Asked Questions<div className="w-32 h-1.5 mx-auto mt-3 bg-gradient-to-r from-[#ffe066] to-white rounded-full opacity-50" /></div>
          <FAQList />
        </div>
      </section>

      <section className="py-12 bg-white text-center">
        <div className="mb-6 flex justify-center items-center gap-2"><div className="w-10 h-1 bg-yellow-400 rounded-full"></div><h2 className="text-2xl font-semibold">Our Trusted Partners</h2><div className="w-10 h-1 bg-yellow-400 rounded-full"></div></div>
        <div className="mt-8 flex justify-center items-center gap-x-16 md:gap-x-32 px-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">{[...partners, ...partners].map((partner, index) => (<div key={index} className="flex-shrink-0 mx-8 md:mx-16"><img src={partner.src} alt={partner.alt} className="h-16 md:h-20 object-contain hover:scale-105 transition-transform" /></div>))}</div>
        </div>
      </section>

      <style >{`@keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 20s linear infinite; } .animate-marquee:hover { animation-play-state: paused; }`}</style>
    </div>
  );
};

// ... ClientFeedbackCarousel component (unchanged) ...
function ClientFeedbackCarousel() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(feedbacks.length / perPage);

  useEffect(() => {
    const interval = setInterval(() => { setPage((prev) => (prev + 1) % totalPages); }, 5000);
    return () => clearInterval(interval);
  }, [totalPages]);

  let visibleFeedbacks = feedbacks.slice(page * perPage, page * perPage + perPage);
  if (visibleFeedbacks.length < perPage) { visibleFeedbacks = [...visibleFeedbacks, ...feedbacks.slice(0, perPage - visibleFeedbacks.length)]; }

  return (
    <div className="w-full max-w-7xl mx-auto flex justify-center items-center relative min-h-[370px] px-3">
      <div className="flex flex-col md:flex-row gap-9 justify-center items-stretch w-full">
        {visibleFeedbacks.map((fb, idx) => (
          <div key={idx} className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-lg p-8 flex-1 min-w-[260px] max-w-sm flex flex-col items-center transition-transform duration-300 hover:-translate-y-1.5 hover:scale-105 border-2 border-yellow-200/50 cursor-pointer overflow-hidden relative">
            <div className="absolute top-4 left-4 text-7xl text-[#bf7e1a]/10 font-black z-0">❝</div>
            <div className="z-10 flex flex-col items-center w-full">
              <div className="rounded-full border-4 border-[#bf7e1a] p-1 mb-3 shadow-md bg-white">
                <img src={fb.img} alt={fb.name} className="w-14 h-14 rounded-full" />
              </div>
              <div className="font-bold text-[#7a1335] text-lg mb-1">{fb.name}</div>
              <div className="text-[#bfa21a] text-sm mb-3">{fb.location}</div>
              <p className="text-gray-600 text-center text-base italic leading-relaxed h-32 overflow-y-auto">{fb.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-6 justify-center absolute -bottom-8 left-0 right-0">
        {Array.from({ length: totalPages }).map((_, idx) => (<span key={idx} className={`w-3 h-3 rounded-full transition-all ${idx === page ? "w-6 bg-gradient-to-r from-[#bf7e1a] to-[#7a1335] shadow-md" : "bg-gray-300"}`} />))}
      </div>
    </div>
  );
}

// Interface for a single FAQ item
interface Faq { id: number; question: string; answer: string; }

// FAQList Component with API integration
function FAQList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axiosInstance.get('/api/faqs?type=HOME&page=0&size=6');
        setFaqs(response.data.content || []);
      } catch (err) { setError("Could not load questions at this time."); } finally { setLoading(false); }
    };
    fetchFaqs();
  }, []);

  const toggle = (idx: number) => { setOpenIndex(openIndex === idx ? null : idx); };

  if (loading) return <div className="text-white text-center p-10">Loading FAQs...</div>;
  if (error) return <div className="text-red-200 text-center p-10">{error}</div>;
  if (faqs.length === 0) return <div className="text-white text-center p-10">No FAQs found.</div>;

  return (
    <div className="flex flex-col gap-6">
      {faqs.map((faq, idx) => (
        <div key={faq.id} onClick={() => toggle(idx)} className="bg-white rounded-2xl shadow-lg p-6 w-full border-2 border-[#f7e0c7] cursor-pointer transition-all hover:shadow-xl hover:border-[#bf7e1a]">
          <div className="flex items-center justify-between">
            <h4 className="text-[#991313] font-bold text-lg">{faq.question}</h4>
            <span className={`text-[#bf7e1a] text-3xl transition-transform duration-300 ${openIndex === idx ? "rotate-90" : ""}`}>▶</span>
          </div>
          {openIndex === idx && (
            <div className="text-gray-700 text-base mt-4 pt-4 border-t border-[#f7e0c7] leading-relaxed animate-fade-in">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
      <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

export default UserHome;