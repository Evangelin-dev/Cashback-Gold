import { ArrowRight, Clock, Coins, Gift, Quote, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { schemes } from "../../../constants";
import Carousel from "../components/custom/Carousel";
import style from "./style.module.css";
import axiosInstance from "../../utils/axiosInstance";

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

  // Live metal rates state (same as AdminDashboard)
  const [apiGoldPrice, setApiGoldPrice] = useState<string | null>(null);
  const [apiSilverPrice, setApiSilverPrice] = useState<string | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);

  // Fetch rates logic (copied from AdminDashboard)
  const fetchRates = useCallback(async () => {
    setRateLoading(true);
    setRateError(null);
    try {
      const response = await axiosInstance.get('/api/metal-rates');
      const { goldRateInrPerGram, silverRateInrPerGram } = response.data;
      setApiGoldPrice(goldRateInrPerGram.toFixed(2));
      setApiSilverPrice(silverRateInrPerGram.toFixed(2));
    } catch (err) {
      setRateError("Failed to fetch rates.");
    } finally {
      setRateLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

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
      <div className="relative z-[1] w-full flex flex-col items-center">
        <Carousel />
        <div className="flex justify-center w-full">
          <div
            className="goldsiver-box bg-white p-3 mt-3 rounded-xl shadow max-w-[420px] w-full mx-auto"
            ref={schemeRef}
          >
            <div>
              <div className="mb-2 border-b-2 border-[#991313] pb-1 flex items-center">
                <span className="text-[#991313] font-semibold text-[16px] mr-2">
                  Digital Gold / Silver
                </span>
              </div>
              <div className="row font-sans">
                {/* 22k Gold */}
                <div className="col-12 col-md-6 mb-1 border-r border-[#e0e0e0]">
                  <div className="flex items-center mb-1">
                    <span className="text-[#991313] text-[12px] mr-1">
                      <i className="fa fa-dot-circle-o text-[#991313] text-[12px]"></i>
                    </span>
                    <span className="font-medium text-[#7a1335] text-[12px]">
                      Live Buy Price (Gold)
                    </span>
                    <span
                      className="bg-[#fff3cd] text-[#bfa21a] font-semibold text-[10px] rounded px-[6px] py-[1px] ml-[5px] inline-block"
                    >
                      22k
                    </span>
                  </div>
                  <div className="flex items-end mb-1">
                    <span className="font-bold text-[14px] text-[#7a1335]">
                      {rateLoading ? '...' : rateError ? '--' : apiGoldPrice ? `${(Number(apiGoldPrice) * 0.9167).toFixed(0)}/gm` : '--'}
                    </span>
                    <span className="text-[#888] text-[10px] ml-[6px] mb-[1px]">
                      +3% GST applicable
                    </span>
                  </div>
                </div>
                {/* 24k Gold */}
                <div className="col-12 col-md-6 mb-1">
                  <div className="flex items-center mb-1">
                    <span className="text-[#991313] text-[12px] mr-1">
                      <i className="fa fa-dot-circle-o text-[#991313] text-[12px]"></i>
                    </span>
                    <span className="font-medium text-[#7a1335] text-[12px]">
                      Live Buy Price (Gold)
                    </span>
                    <span
                      className="bg-[#fff3cd] text-[#bfa21a] font-semibold text-[10px] rounded px-[6px] py-[1px] ml-[5px] inline-block"
                    >
                      24k
                    </span>
                  </div>
                  <div className="flex items-end mb-1">
                    <span className="font-bold text-[14px] text-[#7a1335]">
                      {rateLoading ? '...' : rateError ? '--' : apiGoldPrice ? `${apiGoldPrice}/gm` : '--'}
                    </span>
                    <span className="text-[#888] text-[10px] ml-[6px] mb-[1px]">
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
                    <span className="font-bold text-[14px] text-[#7a1335]">
                      {rateLoading ? '...' : rateError ? '--' : apiSilverPrice ? `${apiSilverPrice}/gm` : '--'}
                    </span>
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
        className={`mb-4 mt-6 ${style.home_scheme_section} w-full flex flex-col items-center`}
        ref={bannerRef}
      >
        <h3
          className="text-center text-[1.35rem] font-bold mt-12 mb-4 relative z-[2] text-[#bf7e1a]"
        >
          Quick overview of schemes
        </h3>
        <div
          className="w-full flex flex-col md:flex-row justify-center items-stretch gap-4 mt-3 max-w-[1000px] mx-auto"
        >
          {schemes.map((scheme) => {
            let buttonLabel = "Buy scheme";
            const titleLower = scheme.title.toLowerCase();
            if (titleLower.includes("chit")) buttonLabel = "Saving Scheme";
            else if (titleLower.includes("sip")) buttonLabel = "CashBack Gold";
            else if (titleLower.includes("gold")) buttonLabel = "Gold Plant";
            return (
              <div
                key={scheme.id}
                className="bg-white flex items-center justify-center relative rounded-[14px] max-w-[260px] min-w-[140px] h-[320px] overflow-hidden shadow-lg border-4 border-[#bf7e1a]"
              >
                <img
                  src={scheme.image}
                  alt={scheme.title}
                  className="w-full h-full object-contain"
                />
                <button
                  className="absolute left-2 bottom-2 bg-[#8a2342] text-white border-none rounded-[20px] px-5 py-2 font-medium text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                  onClick={() => navigate(scheme.link)}
                >
                  {buttonLabel}
                  <ArrowRight size={18} strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
      

      {/* Discover Our Jewel Collection Banner */}
      <div
        ref={feedbackRef}
        className="w-full min-h-[120px] bg-[#8a2342] flex items-center justify-center m-0 p-0 overflow-hidden"
      >
        <img
          src="/assets/red_banner.png"
          alt="Discover Our Jewel Collection"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Clients Say's Section */}
      <section
        className="bg-white pt-6 pb-0 w-full flex flex-col items-center"
        ref={useScrollFadeIn("left", 700, 0)}
      >
        <h3 className="text-center text-[#7a1335] font-bold text-[18px] mb-4 font-sans">
          <span className="inline-block border-b border-[#bf7e1a] pb-1 mb-1">Clients Say's?</span>
        </h3>
        <div className="w-full flex justify-center">
          <ClientFeedbackCarousel />
        </div>
      </section>
      {/* Grow your wealth smarter */}
      <div
        ref={wealthRef}
        className="bg-[#f3ffe8] rounded-[18px] max-w-[98%] w-[98%] mx-auto my-4 p-0 flex flex-col items-center justify-center min-h-[70px] relative text-center md:flex-row md:justify-between md:text-left"
      >
        {/* Icon and text */}
        <div className="flex flex-col items-center gap-2 py-3 md:flex-row md:items-center md:gap-3 md:pl-4">
          <span className="flex items-center justify-center">
            <Coins size={32} color="#9B1C1C" fill="#FFE066" />
          </span>
          <div>
            <div className="font-bold text-[18px] text-[#7a1335] mb-[1px] leading-[1.1] tracking-normal">
              Grow your wealth smarter
            </div>
            <div className="text-[13px] text-[#7a1335] font-normal mt-[1px] leading-[1.3]">
              Start an SIP to invest in gold every month.
            </div>
          </div>
        </div>
        {/* Button on the right */}
        <div className="flex justify-center md:justify-end w-full md:w-auto pb-3 md:pb-0">
          <button
            className="bg-gradient-to-r from-[#bf7e1a] to-[#8a2342] text-white border-none rounded-[18px] px-[18px] py-[7px] font-medium text-[13px] flex items-center gap-[6px] shadow-none cursor-pointer transition-transform duration-200 outline-none"
            onClick={() => navigate("/lgoldsip")}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            Start investing
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      {/* Why choose digital gold */}
      <section
        ref={whyRef}
        className="bg-[#991313] py-6 m-0 w-full flex flex-col items-center"
      >
        <div
          className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center gap-4 flex-wrap w-full"
        >
          {/* Left side image */}
          <div className="flex-1 flex items-center  justify-center min-w-[120px] w-full md:w-auto">
            <img
              src="/assets/physical.png"
              alt="Gold Jar"
              className="w-[120px] h-[120px] object-contain rounded-[12px] bg-white shadow block border-2 border-[#bf7e1a] p-0 m-0 transition-transform duration-200 cursor-pointer"
              onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
          </div>
          {/* Right side content */}
          <div className="flex-2 min-w-[160px] w-full md:w-auto">
<div className="text-center font-bold text-[18px] text-[#bf7e1a] mb-[8px] font-inherit tracking-[0.5px] leading-[1.2]">
              Why Choose <span className="text-[#bf7e1a]">Digital Gold</span>?
            </div>
            <div className="flex flex-row gap-2 justify-start flex-wrap">
              {/* Card 1 */}
              <div
                className="bg-white rounded-[10px] shadow p-3 flex-1 min-w-[100px] max-w-[160px] flex flex-col items-center text-center border border-[#f9e9c7] transition-shadow duration-200 relative"
              >
                <ShieldCheck size={28} color="#991313" className="mb-2" />
                <div className="font-bold text-[#991313] text-[13px] mb-1">
                  Guaranteed 24K Gold
                </div>
                <div className="text-[#7a1335] text-[11px] mb-1">
                  100% purity, certified and insured. No risk of adulteration or fraud.
                </div>
                <span className="absolute top-[8px] right-[8px] text-[#bf7e1a] text-[13px] opacity-15 font-black pointer-events-none">01</span>
              </div>
              {/* Card 2 */}
              <div
                className="bg-white rounded-[10px] shadow p-3 flex-1 min-w-[100px] max-w-[160px] flex flex-col items-center text-center border border-[#f9e9c7] transition-shadow duration-200 relative"
              >
                <Clock size={28} color="#991313" className="mb-2" />
                <div className="font-bold text-[#991313] text-[13px] mb-1">
                  Sell Anytime, Anywhere
                </div>
                <div className="text-[#7a1335] text-[11px] mb-1">
                  24x7 liquidity, instant sale and redemption. No need to visit a store.
                </div>
                <span className="absolute top-[8px] right-[8px] text-[#bf7e1a] text-[13px] opacity-15 font-black pointer-events-none">02</span>
              </div>
              {/* Card 3 */}
              <div
                className="bg-white rounded-[10px] shadow p-3 flex-1 min-w-[100px] max-w-[160px] flex flex-col items-center text-center border border-[#f9e9c7] transition-shadow duration-200 relative"
              >
                <Gift size={28} color="#991313" className="mb-2" />
                <div className="font-bold text-[#991313] text-[13px] mb-1">
                  Earn Income on Gold
                </div>
                <div className="text-[#7a1335] text-[11px] mb-1">
                  Get rewards, cashback, and interest on your digital gold savings.
                </div>
                <span className="absolute top-[8px] right-[8px] text-[#bf7e1a] text-[13px] opacity-15 font-black pointer-events-none">03</span>
              </div>
            </div>
            {/* Bonus section - make visible and responsive */}
            <div
              className="mt-3 text-white font-medium text-[11px] bg-[#bf7e1a] rounded-[8px] px-3 py-[8px] shadow border border-[#f9e9c7] max-w-[320px] text-center self-center relative mx-auto z-[2]"
            >
              <span className="font-bold text-white">Bonus:</span> Digital gold is easy to gift, track, and manage. Start your journey to smarter wealth today!
            </div>
          </div>
        </div>
      </section>
      {/* Convert digital to physical gold/silver */}
      <section
        ref={convertRef}
        className="bg-gradient-to-r from-[#fffbe8] to-[#f9f7f6] py-6 m-0 w-full flex flex-col items-center"
      >
        <div
          className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center gap-4 flex-wrap w-full"
        >
          {/* Left content */}
          <div className="flex-2 min-w-[160px] w-full md:w-auto">
            <div className="font-bold text-[16px] text-[#7a1335] mb-1 font-inherit tracking-[0.5px] flex items-center gap-2">
              Convert Digital to Physical Gold & Silver
              {/* <span className="bg-[#fff3cd] text-[#bfa21a] font-semibold text-[11px] rounded px-[7px] py-[2px] ml-2 border border-[#ffe066]">99.9%</span> */}
            </div>
            <div className="text-[#7a1335] text-[12px] mb-1 font-medium">
              24K Gold / Silver Coins & Bars delivered to your doorstep
            </div>
            <div className="text-[#7a1335] text-[11px] mb-2 leading-[1.6]">
              Convert your digital gold to physical gold by paying a nominal minting charge. Your delivery comes with free insurance, to ensure your coins and bars reach you safely. Enjoy the flexibility to redeem your investment in the form you desire, with complete transparency and security.
            </div>
            <button
              className="bg-[#7a1335] text-white border-none rounded-[16px] px-[16px] py-[6px] font-semibold text-[13px] mt-1 flex items-center gap-[6px] shadow cursor-pointer transition-transform duration-200 tracking-[0.5px]"
              onClick={() => navigate("/lbuyornaments")}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              Buy   99.9% Gold 
              <ArrowRight size={16} />
            </button>
            <div className="mt-2 text-[#bfa21a] font-medium text-[11px] flex items-center gap-1">
              <Truck size={16} color="#bfa21a" className="mr-1" />
              100% insured delivery & purity guaranteed
            </div>
          </div>
          {/* Right image */}
          <div className="flex-[1.2] flex items-center justify-center min-w-[120px]">
            <img
              src="/assets/golds.png"
              alt="Gold & Silver Coins"
              className="w-[120px] h-[120px] object-contain rounded-none bg-transparent shadow-none block"
            />
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section
        ref={faqRef}
        className="bg-[#991313] py-10 m-0 w-full flex flex-col items-center"
      >
        <div className="max-w-[900px] mx-auto text-[#7a1335] w-full">
          <div className="text-center font-bold text-[32px] mb-8 font-inherit text-[#ffe066] tracking-[0.5px]">
            Frequently Asked Questions
            <div className="w-[120px] h-[6px] mt-3 mx-auto bg-gradient-to-r from-[#ffe066] to-[#fff] rounded opacity-50" />
          </div>
          <div className="w-full flex justify-center">
            <FAQList />
          </div>
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
  // Show 2 feedbacks per page (smaller)
  const perPage = 2;
  const totalPages = Math.ceil(feedbacks.length / perPage);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPages]);
  const start = page * perPage;
  let visibleFeedbacks = feedbacks.slice(start, start + perPage);
  if (visibleFeedbacks.length < perPage) {
    visibleFeedbacks = [
      ...visibleFeedbacks,
      ...feedbacks.slice(0, perPage - visibleFeedbacks.length)
    ];
  }
  return (
    <div style={{
      width: "100%",
      maxWidth: 700,
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      minHeight: 200,
      padding: "0 6px",
    }}>
      <div style={{
        display: "flex",
        gap: 16,
        justifyContent: "center",
        alignItems: "stretch",
        width: "100%",
        maxWidth: 700,
        minHeight: 140,
        transition: "none",
      }}>
        {visibleFeedbacks.map((fb, idx) => (
          <div
            key={idx}
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px #e6e6e6",
              padding: "16px 10px 14px 10px",
              flex: 1,
              minWidth: 120,
              maxWidth: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "box-shadow 0.2s, transform 0.2s",
              minHeight: 120,
              height: 140,
              position: "relative",
              border: "1px solid #f9e9c7",
              cursor: "pointer",
              overflow: "hidden",
              backgroundImage: "linear-gradient(120deg, #fffbe8 80%, #f9f7f6 100%)",
              boxSizing: "border-box",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "translateY(-3px) scale(1.01)")}
            onMouseOut={e => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
          >
            <div style={{
              position: "absolute",
              top: 8,
              left: 8,
              opacity: 0.12,
              zIndex: 0,
            }}>
              <Quote size={28} color="#bf7e1a" />
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
                border: "2px solid #bf7e1a",
                padding: 1,
                marginBottom: 4,
                boxShadow: "0 1px 3px #f3e6d7",
                background: "#fff"
              }}>
                <img src={fb.img} alt={fb.name} style={{ width: 32, height: 32, borderRadius: "50%" }} />
              </div>
              <div style={{ fontWeight: 700, color: "#7a1335", fontSize: 12, marginBottom: 1 }}>{fb.name}</div>
              <div style={{ color: "#bfa21a", fontSize: 10, marginBottom: 2 }}>{fb.location}</div>
              <div style={{
                color: "#444",
                fontSize: 10,
                textAlign: "center",
                minHeight: 30,
                maxHeight: 40,
                overflow: "auto",
                display: "block",
                marginTop: 2,
                fontStyle: "italic",
                lineHeight: 1.3,
                letterSpacing: 0.1,
                padding: "0 1px"
              }}>
                {fb.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: "flex",
        gap: 4,
        marginTop: 8,
        justifyContent: "center",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -16,
      }}>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <span
            key={idx}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: idx === page ? "linear-gradient(90deg,#bf7e1a,#7a1335)" : "#e6e6e6",
              display: "inline-block",
              transition: "background 0.2s",
              border: idx === page ? "1px solid #fff" : "none",
              boxShadow: idx === page ? "0 0 3px #bf7e1a55" : "none"
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: "flex",
            gap: 10,
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
                  borderRadius: 8,
                  boxShadow: "0 1px 4px #f3e6d7",
                  padding: "10px 12px",
                  minWidth: 120,
                  maxWidth: 220,
                  flex: 1,
                  border: "1px solid #f7e0c7",
                  position: "relative",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  margin: "0 auto",
                }}
                onClick={() => toggle(realIdx)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ color: "#991313", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <RotateCcw size={14} color="#991313" />
                    {faq.question}
                  </div>
                  <span
                    style={{
                      color: "#bf7e1a",
                      fontSize: 18,
                      marginLeft: 8,
                      transition: "transform 0.2s",
                      transform: openIndex === realIdx ? "rotate(90deg)" : "rotate(0deg)",
                      userSelect: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ArrowRight size={14} />
                  </span>
                </div>
                {openIndex === realIdx && (
                  <div
                    style={{
                      color: "#444",
                      fontSize: 10,
                      fontWeight: 400,
                      marginTop: 8,
                      lineHeight: 1.4,
                      borderTop: "1px solid #f7e0c7",
                      paddingTop: 7,
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