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

  // Add offset to push content below fixed navbar (top bar + nav = 44px + nav height)
  // Adjust this value if your nav height changes
  const NAVBAR_TOTAL_HEIGHT = 44 + 48; // 44px top bar + ~48px nav bar

  return (
    <div >
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
            ref={schemeRef}
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
      <section
      className={`mb-5 mt-6 pt-6 ${style.home_scheme_section}`}
      ref={bannerRef}
    >
      <h3
        className="text-center"
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginTop: "180px",
          marginBottom: "24px",
          position: "relative",
          zIndex: 2,
          color: "#bf7e1a",
        }}
      >
        Quick overview of schemes
      </h3>

      <div
        className="w-100 d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-4 mt-4"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {schemes.map((scheme) => {
          // Determine button label based on scheme.title (since 'type' is not present)
          let buttonLabel = "Buy scheme";
          const titleLower = scheme.title.toLowerCase();
          if (titleLower.includes("chit")) buttonLabel = "Buy Chit";
          else if (titleLower.includes("sip")) buttonLabel = "Start SIP";
          else if (titleLower.includes("gold")) buttonLabel = "Buy Gold";
          return (
            <div
              key={scheme.id}
              className="bg-white d-flex align-items-center justify-content-center position-relative"
              style={{
                borderRadius: 18,
                maxWidth: 400,
                minWidth: 220,
                height: 500,
                overflow: "hidden",
                boxShadow: "0 4px 24px #e6d7b7",
                border: "10px solid #bf7e1a",
              }}
            >
              <img
                src={scheme.image}
                alt={scheme.title}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
              <button
                style={{
                  position: "absolute",
                  left: 14,
                  bottom: 10,
                  background: "#8a2342",
                  color: "#fff",
                  border: "none",
                  borderRadius: 40,
                  padding: "10px 28px 10px 22px",
                  fontWeight: 500,
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 2px 8px #c4912e33",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() => navigate(scheme.link)}
              >
                {buttonLabel}
                <span
                  style={{
                    fontSize: 22,
                    marginLeft: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="26"
                    height="22"
                    viewBox="0 0 26 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5 4L22 11M22 11L15.5 18M22 11H4"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
        style={{
          width: "100%",
          minHeight: 220,
          background: "#8a2342",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 0 0 0",
          padding: 0,
          overflow: "hidden"
        }}>
        <img
          src="/assets/red_banner.png"
          alt="Discover Our Jewel Collection"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover"
          }}
        />
      </div>

      {/* Clients Say's Section */}
      <section
        style={{ background: "#fff", padding: "48px 0 0 0" }}
        ref={useScrollFadeIn("left", 700, 0)}
      >
        <h3 style={{
          textAlign: "center",
          color: "#7a1335",
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 32,
          fontFamily: "inherit"
        }}>
          <span style={{
            display: "inline-block",
            borderBottom: "2px solid #bf7e1a",
            paddingBottom: 4,
            marginBottom: 8
          }}>Clients Say's?</span>
        </h3>
        <ClientFeedbackCarousel />
      </section>
      {/* Grow your wealth smarter */}
      <div
        ref={wealthRef}
        style={{
          background: "#f3ffe8",
          borderRadius: 32,
          maxWidth: 98 + "%",
          width: "98%",
          margin: "40px auto",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "none",
          border: "none",
          position: "relative",
          minHeight: 140,
        }}
      >
        {/* Icon and text */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, paddingLeft: 48 }}>
          {/* Icon */}
          <span style={{ display: "flex", alignItems: "center" }}>
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
              <rect x="8" y="32" width="8" height="14" rx="2" fill="#9B1C1C"/>
              <rect x="22" y="22" width="8" height="24" rx="2" fill="#9B1C1C"/>
              <rect x="36" y="12" width="8" height="34" rx="2" fill="#9B1C1C"/>
              <circle cx="44" cy="44" r="11" fill="#FFE066"/>
              <path d="M44 40v5m0 0v-5m0 5h-3m3 0h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: 32,
              color: "#7a1335",
              marginBottom: 2,
              lineHeight: 1.1,
              letterSpacing: 0,
            }}>
              Grow your wealth smarter
            </div>
            <div style={{
              fontSize: 20,
              color: "#7a1335",
              fontWeight: 400,
              marginTop: 2,
              lineHeight: 1.3,
            }}>
              Start an SIP to invest in gold every month.
            </div>
          </div>
        </div>
        {/* Button on the right */}
        <button
          style={{
            background: "linear-gradient(90deg, #bf7e1a 0%, #8a2342 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 32,
            padding: "18px 44px",
            fontWeight: 500,
            fontSize: 20,
            marginRight: 48,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "none",
            cursor: "pointer",
            transition: "background 0.18s, transform 0.18s",
            outline: "none",
          }}
          onClick={() => navigate("/lgoldsip")}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          Start investing
          <span style={{ fontSize: 24, marginLeft: 10, display: "flex", alignItems: "center" }}>
            <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 4L22 11M22 11L15.5 18M22 11H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
      {/* Why choose digital gold */}
      <section
        ref={whyRef}
        style={{
          background: "#991313", // changed from gradient to new maroon
          padding: "60px 0 40px 0",
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {/* Left side image */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 220,
            }}
          >
            <img
              src="/assets/physical.png"
              alt="Gold Jar"
              style={{
                width: 400,
                height: 400,
                objectFit: "contain",
                borderRadius: 24,
                background: "linear-gradient(135deg, #fffbe8 60%, #f9f7f6 100%)",
                boxShadow: "0 8px 32px #e6d7b7",
                display: "block",
                border: "4px solid #bf7e1a",
                padding: 0,
                margin: 0,
                transition: "transform 0.2s",
                cursor: "pointer"
              }}
              onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
          </div>
          {/* Right side content */}
          <div style={{ flex: 2, minWidth: 320 }}>
            <div
              style={{
                textAlign: "left",
                fontWeight: 700,
                fontSize: 34,
                color: "#bf7e1a",
                marginBottom: 18,
                fontFamily: "inherit",
                letterSpacing: 0.5,
                lineHeight: 1.2,
              }}
            >
              Why Choose <span style={{ color: "#bf7e1a" }}>Digital Gold</span>?
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 24,
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Card 1 */}
              <div
                style={{
                  background: "#fff", // changed to white for contrast
                  borderRadius: 18,
                  boxShadow: "0 2px 12px #e6e6e6",
                  padding: 32,
                  flex: "1 1 220px",
                  minWidth: 220,
                  maxWidth: 320,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "2px solid #f9e9c7",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  position: "relative",
                }}
              >
                <img
                  src="/assets/0.png"
                  alt="Guaranteed 24K Gold"
                  style={{ width: 54, height: 54, marginBottom: 16 }}
                />
                <div
                  style={{
                    fontWeight: 700,
                    color: "#991313",
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  Guaranteed 24K Gold
                </div>
                <div style={{ color: "#7a1335", fontSize: 15, marginBottom: 8 }}>
                  100% purity, certified and insured. No risk of adulteration or fraud.
                </div>
                <span style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  color: "#bf7e1a",
                  fontSize: 22,
                  opacity: 0.15,
                  fontWeight: 900,
                  pointerEvents: "none"
                }}>01</span>
              </div>
              {/* Card 2 */}
              <div
                style={{
                  background: "#fff", // changed to white for contrast
                  borderRadius: 18,
                  boxShadow: "0 2px 12px #e6e6e6",
                  padding: 32,
                  flex: "1 1 220px",
                  minWidth: 220,
                  maxWidth: 320,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "2px solid #f9e9c7",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  position: "relative",
                }}
              >
                <img
                  src="/assets/1.png"
                  alt="Sell anytime from home"
                  style={{ width: 54, height: 54, marginBottom: 16 }}
                />
                <div
                  style={{
                    fontWeight: 700,
                    color: "#991313",
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  Sell Anytime, Anywhere
                </div>
                <div style={{ color: "#7a1335", fontSize: 15, marginBottom: 8 }}>
                  24x7 liquidity, instant sale and redemption. No need to visit a store.
                </div>
                <span style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  color: "#bf7e1a",
                  fontSize: 22,
                  opacity: 0.15,
                  fontWeight: 900,
                  pointerEvents: "none"
                }}>02</span>
              </div>
              {/* Card 3 */}
              <div
                style={{
                  background: "#fff", // changed to white for contrast
                  borderRadius: 18,
                  boxShadow: "0 2px 12px #e6e6e6",
                  padding: 32,
                  flex: "1 1 220px",
                  minWidth: 220,
                  maxWidth: 320,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "2px solid #f9e9c7",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  position: "relative",
                }}
              >
                <img
                  src="/assets/2.png"
                  alt="Earn income on gold"
                  style={{ width: 54, height: 54, marginBottom: 16 }}
                />
                <div
                  style={{
                    fontWeight: 700,
                    color: "#991313",
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  Earn Income on Gold
                </div>
                <div style={{ color: "#7a1335", fontSize: 15, marginBottom: 8 }}>
                  Get rewards, cashback, and interest on your digital gold savings.
                </div>
                <span style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  color: "#bf7e1a",
                  fontSize: 22,
                  opacity: 0.15,
                  fontWeight: 900,
                  pointerEvents: "none"
                }}>03</span>
              </div>
            </div>
            {/* Bonus section - make visible and responsive */}
            <div
              style={{
                marginTop: 32,
                color: "#fff",
                fontWeight: 500,
                fontSize: 17,
                background: "#bf7e1a",
                borderRadius: 12,
                padding: "18px 28px",
                boxShadow: "0 2px 8px #f3e6d7",
                border: "1.5px solid #f9e9c7",
                maxWidth: 600,
                textAlign: "center",
                alignSelf: "center",
                // Remove absolute positioning and right, use margin auto for centering
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto",
                zIndex: 2,
              }}
            >
              <span style={{ fontWeight: 700, color: "#fff" }}>Bonus:</span> Digital gold is easy to gift, track, and manage. Start your journey to smarter wealth today!
            </div>
          </div>
        </div>
      </section>
      {/* Convert digital to physical gold/silver */}
      <section
        ref={convertRef}
        style={{
          background: "linear-gradient(90deg, #fffbe8 60%, #f9f7f6 100%)",
          padding: "60px 0 40px 0",
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {/* Left content */}
          <div style={{ flex: 2, minWidth: 320 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 28,
                color: "#7a1335",
                marginBottom: 12,
                fontFamily: "inherit",
                letterSpacing: 0.5,
              }}
            >
              Convert Digital to Physical Gold & Silver
            </div>
            <div
              style={{
                color: "#7a1335",
                fontSize: 18,
                marginBottom: 10,
                fontWeight: 500,
              }}
            >
              24K Gold / Silver Coins & Bars delivered to your doorstep
            </div>
            <div
              style={{
                color: "#7a1335",
                fontSize: 16,
                marginBottom: 22,
                lineHeight: 1.6,
              }}
            >
              Convert your digital gold to physical gold by paying a nominal minting charge. Your delivery comes with free insurance, to ensure your coins and bars reach you safely. Enjoy the flexibility to redeem your investment in the form you desire, with complete transparency and security.
            </div>
            <button
              style={{
                background: "linear-gradient(90deg, #bf7e1a 0%, #8a2342 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 30,
                padding: "12px 38px 12px 28px",
                fontWeight: 600,
                fontSize: 20,
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 4px 16px #c4912e33",
                cursor: "pointer",
                transition: "background 0.2s",
                letterSpacing: 0.5,
              }}
              onClick={() => navigate("/lbuyornaments")}
            >
              Buy Gold
              <span style={{ fontSize: 24, marginLeft: 10, display: "flex", alignItems: "center" }}>
                <svg width="28" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 4L22 11M22 11L15.5 18M22 11H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div
              style={{
                marginTop: 24,
                color: "#bfa21a",
                fontWeight: 500,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg width="22" height="22" fill="#bfa21a" style={{ marginRight: 6 }} viewBox="0 0 24 24"><path d="M12 2L2 7v2c0 5.25 3.66 10.74 10 13 6.34-2.26 10-7.75 10-13V7l-10-5zm0 2.18L19.5 7.09V9c0 4.42-2.97 8.87-7.5 10.93C5.47 17.87 2.5 13.42 2.5 9V7.09l7.5-2.91z"/></svg>
              100% insured delivery & purity guaranteed
            </div>
          </div>
          {/* Right image */}
          <div
            style={{
              flex: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 260,
            }}
          >
            <img
              src="/assets/golds.png"
              alt="Gold & Silver Coins"
              style={{
                width: 360,
                height: 360,
                objectFit: "contain",
                borderRadius: 0,
                background: "transparent",
                boxShadow: "none",
                display: "block"
              }}
            />
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section
        ref={faqRef}
        style={{
          background: "#991313", // maroon background
          padding: "60px 0 40px 0",
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            color: "#7a1335",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: 32,
              marginBottom: 32,
              fontFamily: "inherit",
              color: "#ffe066",
              letterSpacing: 0.5,
            }}
          >
            Frequently Asked Questions
            <div
              style={{
                width: 120,
                height: 6,
                margin: "12px auto 0 auto",
                background: "linear-gradient(90deg, #ffe066 0%, #fff 100%)",
                borderRadius: 4,
                opacity: 0.5,
              }}
            />
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
               <div className="mt-8 flex justify-center flex-wrap gap-32 px-4">
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