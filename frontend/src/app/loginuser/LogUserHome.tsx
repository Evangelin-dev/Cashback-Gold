import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { schemes } from "../../../constants";
import Carousel from "../components/custom/Carousel";
import style from "./style.module.css";

// Helper hook for scroll animation
function useScrollFadeIn(direction: "left" | "right" | "up" | "down" = "up", duration = 700, delay = 0) {
  const dom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { current } = dom;
    if (!current) return;

    let lastVisible = false;

    const handleScroll = () => {
      const rect = current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top < windowHeight - 60 && rect.bottom > 60;
      if (isVisible && !lastVisible) {
        current.style.transition = `opacity ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms`;
        current.style.opacity = "1";
        let translate = "";
        if (direction === "left") translate = "translateX(0)";
        else if (direction === "right") translate = "translateX(0)";
        else if (direction === "up") translate = "translateY(0)";
        else if (direction === "down") translate = "translateY(0)";
        current.style.transform = translate;
        lastVisible = true;
      } else if (!isVisible && lastVisible) {
        current.style.transition = `opacity ${duration}ms cubic-bezier(.4,0,.2,1) 0ms, transform ${duration}ms cubic-bezier(.4,0,.2,1) 0ms`;
        current.style.opacity = "0";
        let translate = "";
        if (direction === "left") translate = "translateX(-60px)";
        else if (direction === "right") translate = "translateX(60px)";
        else if (direction === "up") translate = "translateY(60px)";
        else if (direction === "down") translate = "translateY(-60px)";
        current.style.transform = translate;
        lastVisible = false;
      }
    };

    // Initial state
    current.style.opacity = "0";
    let translate = "";
    if (direction === "left") translate = "translateX(-60px)";
    else if (direction === "right") translate = "translateX(60px)";
    else if (direction === "up") translate = "translateY(60px)";
    else if (direction === "down") translate = "translateY(-60px)";
    current.style.transform = translate;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [direction, duration, delay]);
  return dom;
}

const LUserHome = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const partners = [
    { src: "/assets/amazon.png", alt: "Amazon Pay" },
    { src: "/assets/axis.png", alt: "Axis Bank" },
    { src: "/assets/cart.png", alt: "CaratLane" },
    { src: "/assets/tanis.png", alt: "Tanishq" },
    { src: "/assets/phonepe.png", alt: "PhonePe" }
  ];


  const navigate = useNavigate();
  // refs for scroll animation
  const schemeRef = useScrollFadeIn("up", 700, 0);
  const bannerRef = useScrollFadeIn("right", 700, 100);
  const feedbackRef = useScrollFadeIn("left", 700, 100);
  const wealthRef = useScrollFadeIn("right", 700, 0);
  const whyRef = useScrollFadeIn("left", 700, 0);
  const convertRef = useScrollFadeIn("right", 700, 0);
  const faqRef = useScrollFadeIn("up", 700, 0);


  return (
    <div >
      <div style={{ position: "relative", zIndex: 1 }}>
        <Carousel />
        <div className="d-flex   justify-content-center ">
          <div
            className="goldsiver-box bg-white p-2 mt-3"
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px #e6e6e6",
              maxWidth: 420,
              width: "100%",
              margin: "0 auto",
              padding: "12px 8px 8px 8px",
            }}
            ref={schemeRef}
          >
            <div>
              <div className="mb-2" style={{ borderBottom: "2px solid #991313", paddingBottom: 4, display: "flex", alignItems: "center" }}>
                <span style={{ color: "#991313", fontWeight: 600, fontSize: 16, marginRight: 8 }}>
                  Digital gold / Silver
                </span>
              </div>
              <div className="row" style={{ fontFamily: "inherit" }}>
                {/* 22k Gold */}
                <div className="col-12 col-md-6 mb-1" style={{ borderRight: "1px solid #e0e0e0" }}>
                  <div className="d-flex align-items-center mb-1">
                    <span style={{ color: "#991313", fontSize: 12, marginRight: 4 }}>
                      <i className="fa fa-dot-circle-o" style={{ color: "#991313", fontSize: 12 }}></i>
                    </span>
                    <span style={{ fontWeight: 500, color: "#7a1335", fontSize: 12 }}>
                      Live Buy Price (Gold)
                    </span>
                    <span
                      style={{
                        background: "#fff3cd",
                        color: "#bfa21a",
                        fontWeight: 600,
                        fontSize: 10,
                        borderRadius: 4,
                        padding: "1px 6px",
                        marginLeft: 5,
                        display: "inline-block",
                      }}
                    >
                      22k
                    </span>
                  </div>
                  <div className="d-flex align-items-end mb-1">
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#7a1335" }}>8000/gm</span>
                    <span style={{ color: "#888", fontSize: 10, marginLeft: 6, marginBottom: 1 }}>
                      +3% GST applicable
                    </span>
                  </div>
                </div>
                {/* 24k Gold */}
                <div className="col-12 col-md-6 mb-1">
                  <div className="d-flex align-items-center mb-1">
                    <span style={{ color: "#991313", fontSize: 12, marginRight: 4 }}>
                      <i className="fa fa-dot-circle-o" style={{ color: "#991313", fontSize: 12 }}></i>
                    </span>
                    <span style={{ fontWeight: 500, color: "#7a1335", fontSize: 12 }}>
                      Live Buy Price (Gold)
                    </span>
                    <span
                      style={{
                        background: "#fff3cd",
                        color: "#bfa21a",
                        fontWeight: 600,
                        fontSize: 10,
                        borderRadius: 4,
                        padding: "1px 6px",
                        marginLeft: 5,
                        display: "inline-block",
                      }}
                    >
                      24k
                    </span>
                  </div>
                  <div className="d-flex align-items-end mb-1">
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#7a1335" }}>8705/gm</span>
                    <span style={{ color: "#888", fontSize: 10, marginLeft: 6, marginBottom: 1 }}>
                      +3% GST applicable
                    </span>
                  </div>
                </div>
                {/* Silver */}
                <div className="col-12 col-md-6 mt-1">
                  <div className="d-flex align-items-center mb-1">
                    <span style={{ color: "#991313", fontSize: 12, marginRight: 4 }}>
                      <i className="fa fa-dot-circle-o" style={{ color: "#991313", fontSize: 12 }}></i>
                    </span>
                    <span style={{ fontWeight: 500, color: "#7a1335", fontSize: 12 }}>
                      Live Buy Price (Silver)
                    </span>
                    <span
                      className="bg-[#fff3cd] text-[#bfa21a] font-semibold text-[10px] rounded px-[6px] py-[1px] ml-[5px] inline-block"
                    >
                      99.9%
                    </span>
                  </div>
                  <div className="flex items-end mb-1">
                    <span className="font-bold text-[14px] text-[#7a1335]">107/gm</span>
                    <span className="text-[#888] text-[10px] ml-[6px] mb-[1px]">
                      +3% GST applicable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section
      className={`mb-5 mt-6  ${style.home_scheme_section}`}
      ref={bannerRef}
    >
      <h3
        className="text-center text-[1.1rem] font-bold mt-[60px] mb-3 relative z-[2] text-[#bf7e1a]"
      >
        Quick overview of schemes
      </h3>

      <div
        className="w-full flex flex-col md:flex-row justify-center items-stretch gap-2 mt-2 max-w-[900px] mx-auto"
      >
        {schemes.map((scheme) => {
          let buttonLabel = "Buy scheme";
          const titleLower = scheme.title.toLowerCase();
          if (titleLower.includes("chit")) buttonLabel = "Buy Chit";
          else if (titleLower.includes("sip")) buttonLabel = "Start SIP";
          else if (titleLower.includes("gold")) buttonLabel = "Buy Gold";
          return (
            <div
              key={scheme.id}
              className="bg-white flex items-center justify-center relative rounded-[10px] max-w-[220px] min-w-[120px] h-[260px] overflow-hidden shadow-md border-4 border-[#bf7e1a]"
            >
              <img
                src={scheme.image}
                alt={scheme.title}
                className="w-full h-full object-contain"
              />
              <button
                className="absolute left-[6px] bottom-[6px] bg-[#8a2342] text-white border-none rounded-[20px] px-[14px] py-[5px] pl-[10px] font-medium text-xs flex items-center gap-[6px] shadow-sm cursor-pointer transition-colors"
                onClick={() => navigate(scheme.link)}
              >
                {buttonLabel}
                <span className="ml-1 flex items-center text-[14px]">
                  {/* Lucide-react ArrowRight icon (solid color) */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
      

      {/* Discover Our Jewel Collection Banner */}
      <div
        ref={feedbackRef}
        className="w-full min-h-[220px] bg-[#8a2342] flex items-center justify-center m-0 p-0 overflow-hidden"
      >
        <img
          src="/assets/red_banner.png"
          alt="Discover Our Jewel Collection"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Clients Say's Section */}
      <section
        className="bg-white pt-12 pb-0"
        ref={useScrollFadeIn("left", 700, 0)}
      >
        <h3 className="text-center text-[#7a1335] font-bold text-[28px] mb-8 font-sans">
          <span className="inline-block border-b-2 border-[#bf7e1a] pb-1 mb-2">Clients Say's?</span>
        </h3>
        <ClientFeedbackCarousel />
      </section>
      {/* Grow your wealth smarter */}
      <div
        ref={wealthRef}
        className="bg-[#f3ffe8] rounded-[32px] max-w-[98%] w-[98%] mx-auto my-10 p-0 flex items-center justify-between min-h-[140px] relative"
      >
        {/* Icon and text */}
        <div className="flex items-center gap-6 pl-12">
          {/* Icon */}
          <span className="flex items-center">
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
              <rect x="8" y="32" width="8" height="14" rx="2" fill="#9B1C1C"/>
              <rect x="22" y="22" width="8" height="24" rx="2" fill="#9B1C1C"/>
              <rect x="36" y="12" width="8" height="34" rx="2" fill="#9B1C1C"/>
              <circle cx="44" cy="44" r="11" fill="#FFE066"/>
              <path d="M44 40v5m0 0v-5m0 5h-3m3 0h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <div>
            <div className="font-bold text-[32px] text-[#7a1335] mb-[2px] leading-[1.1] tracking-normal">
              Grow your wealth smarter
            </div>
            <div className="text-[20px] text-[#7a1335] font-normal mt-[2px] leading-[1.3]">
              Start an SIP to invest in gold every month.
            </div>
          </div>
        </div>
        {/* Button on the right */}
        <button
          className="bg-gradient-to-r from-[#bf7e1a] to-[#8a2342] text-white border-none rounded-[32px] px-[44px] py-[18px] font-medium text-[20px] mr-12 flex items-center gap-[10px] shadow-none cursor-pointer transition-transform duration-200 outline-none"
          onClick={() => navigate("/lgoldsip")}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          Start investing
          <span className="text-[24px] ml-[10px] flex items-center">
            <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 4L22 11M22 11L15.5 18M22 11H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
      {/* Why choose digital gold */}
      <section
        ref={whyRef}
        className="bg-[#991313] py-[60px] pt-[60px] pb-[40px] m-0"
      >
        <div
          className="max-w-[1200px] mx-auto flex flex-row items-center gap-12 flex-wrap"
        >
          {/* Left side image */}
          <div className="flex-1 flex items-center justify-center min-w-[220px]">
            <img
              src="/assets/physical.png"
              alt="Gold Jar"
              className="w-[400px] h-[400px] object-contain rounded-[24px] bg-gradient-to-br from-[#fffbe8] to-[#f9f7f6] shadow-[0_8px_32px_#e6d7b7] block border-4 border-[#bf7e1a] p-0 m-0 transition-transform duration-200 cursor-pointer"
              onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
          </div>
          {/* Right side content */}
          <div className="flex-2 min-w-[320px]">
            <div className="text-left font-bold text-[34px] text-[#bf7e1a] mb-[18px] font-inherit tracking-[0.5px] leading-[1.2]">
              Why Choose <span className="text-[#bf7e1a]">Digital Gold</span>?
            </div>
            <div className="flex flex-row gap-6 justify-start flex-wrap">
              {/* Card 1 */}
              <div
                className="bg-white rounded-[18px] shadow-[0_2px_12px_#e6e6e6] p-8 flex-1 min-w-[220px] max-w-[320px] flex flex-col items-center text-center border-2 border-[#f9e9c7] transition-shadow duration-200 relative"
              >
                <img
                  src="/assets/0.png"
                  alt="Guaranteed 24K Gold"
                  className="w-[54px] h-[54px] mb-4"
                />
                <div className="font-bold text-[#991313] text-[20px] mb-2.5">
                  Guaranteed 24K Gold
                </div>
                <div className="text-[#7a1335] text-[15px] mb-2">
                  100% purity, certified and insured. No risk of adulteration or fraud.
                </div>
                <span className="absolute top-[18px] right-[18px] text-[#bf7e1a] text-[22px] opacity-15 font-black pointer-events-none">01</span>
              </div>
              {/* Card 2 */}
              <div
                className="bg-white rounded-[18px] shadow-[0_2px_12px_#e6e6e6] p-8 flex-1 min-w-[220px] max-w-[320px] flex flex-col items-center text-center border-2 border-[#f9e9c7] transition-shadow duration-200 relative"
              >
                <img
                  src="/assets/1.png"
                  alt="Sell anytime from home"
                  className="w-[54px] h-[54px] mb-4"
                />
                <div className="font-bold text-[#991313] text-[20px] mb-2.5">
                  Sell Anytime, Anywhere
                </div>
                <div className="text-[#7a1335] text-[15px] mb-2">
                  24x7 liquidity, instant sale and redemption. No need to visit a store.
                </div>
                <span className="absolute top-[18px] right-[18px] text-[#bf7e1a] text-[22px] opacity-15 font-black pointer-events-none">02</span>
              </div>
              {/* Card 3 */}
              <div
                className="bg-white rounded-[18px] shadow-[0_2px_12px_#e6e6e6] p-8 flex-1 min-w-[220px] max-w-[320px] flex flex-col items-center text-center border-2 border-[#f9e9c7] transition-shadow duration-200 relative"
              >
                <img
                  src="/assets/2.png"
                  alt="Earn income on gold"
                  className="w-[54px] h-[54px] mb-4"
                />
                <div className="font-bold text-[#991313] text-[20px] mb-2.5">
                  Earn Income on Gold
                </div>
                <div className="text-[#7a1335] text-[15px] mb-2">
                  Get rewards, cashback, and interest on your digital gold savings.
                </div>
                <span className="absolute top-[18px] right-[18px] text-[#bf7e1a] text-[22px] opacity-15 font-black pointer-events-none">03</span>
              </div>
            </div>
            {/* Bonus section - make visible and responsive */}
            <div
              className="mt-8 text-white font-medium text-[17px] bg-[#bf7e1a] rounded-[12px] px-7 py-[18px] shadow-[0_2px_8px_#f3e6d7] border border-[#f9e9c7] max-w-[600px] text-center self-center relative mx-auto z-[2]"
            >
              <span className="font-bold text-white">Bonus:</span> Digital gold is easy to gift, track, and manage. Start your journey to smarter wealth today!
            </div>
          </div>
        </div>
      </section>
      {/* Convert digital to physical gold/silver */}
      <section
        ref={convertRef}
        className="bg-gradient-to-r from-[#fffbe8] to-[#f9f7f6] py-[60px] pt-[60px] pb-[40px] m-0"
      >
        <div
          className="max-w-[1200px] mx-auto flex flex-row items-center gap-12 flex-wrap"
        >
          {/* Left content */}
          <div className="flex-2 min-w-[320px]">
            <div className="font-bold text-[28px] text-[#7a1335] mb-3 font-inherit tracking-[0.5px]">
              Convert Digital to Physical Gold & Silver
            </div>
            <div className="text-[#7a1335] text-[18px] mb-2.5 font-medium">
              24K Gold / Silver Coins & Bars delivered to your doorstep
            </div>
            <div className="text-[#7a1335] text-[16px] mb-6 leading-[1.6]">
              Convert your digital gold to physical gold by paying a nominal minting charge. Your delivery comes with free insurance, to ensure your coins and bars reach you safely. Enjoy the flexibility to redeem your investment in the form you desire, with complete transparency and security.
            </div>
            <button
              className="bg-gradient-to-r from-[#bf7e1a] to-[#8a2342] text-white border-none rounded-[30px] px-[38px] py-[12px] font-semibold text-[20px] mt-2 flex items-center gap-[10px] shadow-[0_4px_16px_#c4912e33] cursor-pointer transition-transform duration-200 tracking-[0.5px]"
              onClick={() => navigate("/buyornaments")}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              Buy Gold
              <span className="text-[24px] ml-[10px] flex items-center">
                <svg width="28" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 4L22 11M22 11L15.5 18M22 11H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div className="mt-6 text-[#bfa21a] font-medium text-[15px] flex items-center gap-2">
              <svg width="22" height="22" fill="#bfa21a" className="mr-1.5" viewBox="0 0 24 24"><path d="M12 2L2 7v2c0 5.25 3.66 10.74 10 13 6.34-2.26 10-7.75 10-13V7l-10-5zm0 2.18L19.5 7.09V9c0 4.42-2.97 8.87-7.5 10.93C5.47 17.87 2.5 13.42 2.5 9V7.09l7.5-2.91z"/></svg>
              100% insured delivery & purity guaranteed
            </div>
          </div>
          {/* Right image */}
          <div className="flex-[1.2] flex items-center justify-center min-w-[260px]">
            <img
              src="/assets/golds.png"
              alt="Gold & Silver Coins"
              className="w-[360px] h-[360px] object-contain rounded-none bg-transparent shadow-none block"
            />
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section
        ref={faqRef}
        className="bg-[#991313] py-[60px] pt-[60px] pb-[40px] m-0"
      >
        <div className="max-w-[900px] mx-auto text-[#7a1335]">
          <div className="text-center font-bold text-[32px] mb-8 font-inherit text-[#ffe066] tracking-[0.5px]">
            Frequently Asked Questions
            <div className="w-[120px] h-[6px] mt-3 mx-auto bg-gradient-to-r from-[#ffe066] to-[#fff] rounded opacity-50" />
          </div>
          <FAQList />
        </div>
      </section>
       <section className="py-12 bg-white text-center">
             <div className="mb-6">
               <div className="flex justify-center items-center gap-2">
                 <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                 <h2 className="text-2xl font-semibold">Our Trusted Partners</h2>
                 <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
               </div>
             </div>
             
             {/* Desktop View - Normal Layout */}
             <div className="hidden md:block">
               <div className="mt-8 flex justify-center flex-wrap gap-[128px] px-4">
                 {partners.map((partner, index) => (
                   <img 
                     key={index}
                     src={partner.src} 
                     alt={partner.alt} 
                     className="h-20 object-contain hover:scale-105 transition-transform duration-300" 
                   />
                 ))}
               </div>
             </div>
       
             {/* Mobile View - Marquee Slider */}
             <div className="md:hidden mt-8 overflow-hidden">
               <div className="flex animate-marquee whitespace-nowrap">
                 {/* First set of partners */}
                 {partners.map((partner, index) => (
                   <div key={index} className="flex-shrink-0 mx-8">
                     <img 
                       src={partner.src} 
                       alt={partner.alt} 
                       className="h-16 object-contain" 
                     />
                   </div>
                 ))}
                 {/* Duplicate set for seamless loop */}
                 {partners.map((partner, index) => (
                   <div key={`duplicate-${index}`} className="flex-shrink-0 mx-8">
                     <img 
                       src={partner.src} 
                       alt={partner.alt} 
                       className="h-16 object-contain" 
                     />
                   </div>
                 ))}
               </div>
             </div>
       
             <style >{`
               @keyframes marquee {
                 0% {
                   transform: translateX(0%);
                 }
                 100% {
                   transform: translateX(-50%);
                 }
               }
               
               .animate-marquee {
                 animation: marquee 15s linear infinite;
               }
               
               /* Pause animation on hover */
               .animate-marquee:hover {
                 animation-play-state: paused;
               }
             `}</style>
           </section>
    </div>
  );
};

export default LUserHome;

// Add this component at the bottom of the file (outside UserHome)
const feedbacks = [
  {
    img: "/home/admin.png",
    name: "Admin",
    location: "Chennai",
    text: "I had an amazing experience purchasing from Greenheap! The craftsmanship is exquisite, and each piece truly stands out. Their customer service was exceptional, guiding me through every step. I felt valued as a customer and will definitely return for future purchases.",
  },
  {
    img: "/home/user2.png",
    name: "Yogii M",
    location: "Hyderabad",
    text: "Greenheap's digital gold platform is so easy to use. I could invest small amounts and track my savings anytime. The support team is responsive and helpful. Highly recommended for new investors!",
  },
  {
    img: "/home/user3.png",
    name: "Priya S",
    location: "Bangalore",
    text: "The delivery of physical gold was quick and secure. I loved the packaging and the purity certificate. Greenheap is trustworthy and transparent in their process.",
  },
  {
    img: "/home/user4.png",
    name: "Rahul K",
    location: "Mumbai",
    text: "I started a gold SIP with Greenheap and it’s been a great way to build my savings. The app is user-friendly and the rates are competitive. Very happy with my experience.",
  },
  {
    img: "/home/user5.png",
    name: "Sneha T",
    location: "Delhi",
    text: "Excellent service and genuine products. The digital gold feature is a game changer for people who want to invest without any hassle. I recommend Greenheap to all my friends.",
  },
];

function ClientFeedbackCarousel() {
  const [page, setPage] = useState(0);

  // Show 3 feedbacks per page
  const perPage = 3;
  const totalPages = Math.ceil(feedbacks.length / perPage);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [totalPages]);

  const start = page * perPage;
  let visibleFeedbacks = feedbacks.slice(start, start + perPage);

  // If at the end and not enough for 3, wrap around but keep length always 3
  if (visibleFeedbacks.length < perPage) {
    visibleFeedbacks = [
      ...visibleFeedbacks,
      ...feedbacks.slice(0, perPage - visibleFeedbacks.length)
    ];
  }

  // UI/UX improvements: hover effect, subtle animation, better spacing, avatar ring, quote icon
  return (
    <div style={{
      width: "100%",
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      minHeight: 370,
      padding: "0 12px",
    }}>
      <div style={{
        display: "flex",
        gap: 36,
        justifyContent: "center",
        alignItems: "stretch",
        width: "100%",
        maxWidth: 1100,
        minHeight: 320,
        transition: "none",
      }}>
        {visibleFeedbacks.map((fb, idx) => (
          <div
            key={idx}
            style={{
              background: "#fff",
              borderRadius: 22,
              boxShadow: "0 4px 24px #e6e6e6",
              padding: "38px 30px 32px 30px",
              flex: 1,
              minWidth: 260,
              maxWidth: 360,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "box-shadow 0.2s, transform 0.2s",
              minHeight: 320,
              height: 320,
              position: "relative",
              border: "2px solid #f9e9c7",
              cursor: "pointer",
              overflow: "hidden",
              backgroundImage: "linear-gradient(120deg, #fffbe8 80%, #f9f7f6 100%)",
              boxSizing: "border-box",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "translateY(-6px) scale(1.03)")}
            onMouseOut={e => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
          >
            <div style={{
              position: "absolute",
              top: 18,
              left: 18,
              opacity: 0.12,
              fontSize: 54,
              color: "#bf7e1a",
              pointerEvents: "none",
              zIndex: 0,
              fontWeight: 900,
            }}>
              &#10077;
            </div>
            <div style={{
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%"
            }}>
              <div style={{
                borderRadius: "50%",
                border: "3px solid #bf7e1a",
                padding: 3,
                marginBottom: 10,
                boxShadow: "0 2px 8px #f3e6d7",
                background: "#fff"
              }}>
                <img src={fb.img} alt={fb.name} style={{ width: 56, height: 56, borderRadius: "50%" }} />
              </div>
              <div style={{ fontWeight: 700, color: "#7a1335", fontSize: 18, marginBottom: 2 }}>{fb.name}</div>
              <div style={{ color: "#bfa21a", fontSize: 14, marginBottom: 10 }}>{fb.location}</div>
              <div style={{
                color: "#444",
                fontSize: 16,
                textAlign: "center",
                minHeight: 100,
                maxHeight: 120,
                overflow: "auto",
                display: "block",
                marginTop: 8,
                fontStyle: "italic",
                lineHeight: 1.6,
                letterSpacing: 0.1,
                padding: "0 2px"
              }}>
                {fb.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 24,
        justifyContent: "center",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -32,
      }}>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <span
            key={idx}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: idx === page ? "linear-gradient(90deg,#bf7e1a,#7a1335)" : "#e6e6e6",
              display: "inline-block",
              transition: "background 0.2s",
              border: idx === page ? "2px solid #fff" : "none",
              boxShadow: idx === page ? "0 0 6px #bf7e1a55" : "none"
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Add this component at the bottom of the file (outside UserHome)
const faqData = [
  {
    question: "What is digital gold and how does it work?",
    answer:
      "Digital gold is an online investment product that allows you to buy, sell, and store gold virtually. Each unit you buy is backed by real physical gold stored securely by the provider.",
  },
  {
    question: "Can I convert my digital gold to physical gold?",
    answer:
      "Yes, you can redeem your digital gold for physical gold coins or bars and have them delivered to your doorstep.",
  },
  {
    question: "Is my digital gold safe and insured?",
    answer:
      "Yes, your digital gold is stored in secure vaults and is fully insured by the provider.",
  },
  {
    question: "How do I sell my digital gold?",
    answer:
      "You can sell your digital gold instantly online at the current market price and receive the amount directly in your account.",
  },
];

function FAQList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Split FAQ data into rows of 2
  const rows = [];
  for (let i = 0; i < faqData.length; i += 2) {
    rows.push(faqData.slice(i, i + 2));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {row.map((faq, idx) => {
            const realIdx = rowIdx * 2 + idx;
            return (
              <div
                key={realIdx}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 2px 12px #f3e6d7",
                  padding: "22px 28px",
                  minWidth: 280,
                  maxWidth: 420,
                  flex: 1,
                  border: "1.5px solid #f7e0c7",
                  position: "relative",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  margin: "0 auto",
                }}
                onClick={() => toggle(realIdx)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ color: "#991313", fontWeight: 700, fontSize: 19 }}>
                    {faq.question}
                  </div>
                  <span
                    style={{
                      color: "#bf7e1a",
                      fontSize: 28,
                      marginLeft: 18,
                      transition: "transform 0.2s",
                      transform: openIndex === realIdx ? "rotate(90deg)" : "rotate(0deg)",
                      userSelect: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    ▶
                  </span>
                </div>
                {openIndex === realIdx && (
                  <div
                    style={{
                      color: "#444",
                      fontSize: 16,
                      fontWeight: 400,
                      marginTop: 16,
                      lineHeight: 1.6,
                      borderTop: "1px solid #f7e0c7",
                      paddingTop: 14,
                      animation: "fadeIn 0.2s",
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}