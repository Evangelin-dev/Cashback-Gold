import React, { useEffect, useRef, useState } from "react";

// Mock CustomImage component for demo
type CustomImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
};

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, width, height, style = {} }) => (
  <img 
    src={src} 
    alt={alt} 
    style={{ 
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style 
    }} 
  />
);

const features = [
  { icon: "/assets/delivery.png", title: "Delivery" },
  { icon: "/assets/sip.png", title: "SIP" },
  { icon: "/assets/gigt.png", title: "Gift" },
];

const whyChoose = [
  {
    icon: "/assets/0.png",
    title: "Guaranteed 24K Gold",
    desc: "Unlike local vendors, with Safe Gold you directly buy form the manufacturer",
  },
  {
    icon: "/assets/1.png",
    title: "Sell anytime from home",
    desc: "Unlike local vendors, with Safe Gold you directly buy form the manufacturer",
  },
  {
    icon: "/assets/2.png",
    title: "Earn income on gold",
    desc: "Unlike local vendors, with Safe Gold you directly buy form the manufacturer",
  },
  {
    icon: "/assets/3.png",
    title: "Safety Guaranteed",
    desc: "Unlike local vendors, with Safe Gold you directly buy form the manufacturer",
  },
  {
    icon: "/assets/4.png",
    title: "Convert to physical gold",
    desc: "Unlike local vendors, with Safe Gold you directly buy form the manufacturer",
  },
  {
    icon: "/assets/5.png",
    title: "Buy as low as Rs10",
    desc: "Unlike local vendors, with Safe Gold you directly buy form the manufacturer",
  },
];

const testimonials = [
  {
    name: "Admin",
    location: "chennai",
    img: "/assets/user.png",
    text:
      "I had an amazing experience purchasing from Greenheap! The craftsmanship is exquisite, and each piece truly stands out. Their customer service was exceptional, guiding me through every step. I felt valued as a customer and will definitely return for future purchases.",
  },
  {
    name: "Admin",
    location: "chennai",
    img: "/assets/user.png",
    text:
      "Purchasing from goldheapgold was a delightful experience! The designs are unique, and the quality of gold is exceptional. I received my order on time, beautifully packaged. Highly recommended!",
  },
  {
    name: "Admin",
    location: "chennai",
    img: "/assets/user.png",
    text:
      "I had an amazing experience purchasing from Greenheap! The craftsmanship is exquisite, and each piece truly stands out. Their customer service was exceptional, guiding me through every step. I felt valued as a customer and will definitely return for future purchases.",
  },
];

const faqs = [
  { q: "testing", a: "test" },
  { q: "How do I buy gold?", a: "You can buy gold through our platform using various payment methods." },
];

const partners = [
  { src: "/assets/amazon.png", alt: "Amazon Pay" },
  { src: "/assets/axis.png", alt: "Axis Bank" },
  { src: "/assets/cart.png", alt: "Caratlane" },
  { src: "/assets/tanis.png", alt: "Tanishq" },
  { src: "/assets/phonepe.png", alt: "PhonePe" },
];

// Gentle scroll fade-in hook with direction
function useScrollFadeIn(threshold = 0.15, yOffset = 40, xOffset = 0) {
  const ref = useRef(null);
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

const LAboutUsPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll fade-in hooks for each section
  const bannerFade = useScrollFadeIn(0.1, 24);
  const introFade = useScrollFadeIn(0.13, 36, -80);
  const whyFade = useScrollFadeIn(0.13, 36);
  const testiFade = useScrollFadeIn(0.13, 36);
  const faqFade = useScrollFadeIn(0.13, 36);
  const partnersFade = useScrollFadeIn(0.13, 36);
  const goldPlantFade = useScrollFadeIn(0.13, 0, 80);

  return (
    <div className="bg-[#faf6f3] min-h-screen">
      {/* Banner */}
      <div
        className="w-full min-h-[250px] h-[30vh] max-h-[350px] sm:min-h-[300px] sm:h-[35vh] sm:max-h-[400px] lg:min-h-[350px] lg:h-[40vh] lg:max-h-[450px] flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/home/banner%202.png')",
          ...bannerFade.style,
        }}
        ref={bannerFade.ref}
      >
        <div className="absolute inset-0 " />
        <h1 className="relative z-10 text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center px-4">
          About Us
        </h1>
      </div>

      {/* Intro Section */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
          {/* Content */}
          <div
            className="w-full lg:w-1/2 flex flex-col justify-center"
            ref={introFade.ref}
            style={introFade.style}
          >
            <div className="bg-gradient-to-br from-[#fff8e7] to-[#f7eded] rounded-2xl lg:rounded-3xl shadow-lg px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9 border border-[#f9e9c7] overflow-hidden">
              <h2 className="font-bold mb-4 text-l sm:text-xl lg:text-2xl xl:text-3xl leading-tight text-[#991313] text-center">
                Get access to the <span className="font-black">safest</span> way of procuring...
                <br className="hidden sm:block" />
                <span className="inline-block mt-2 bg-gradient-to-r from-[#f9e9c7] to-[#fff8e7] rounded px-2 py-1 sm:px-3 text-lg sm:text-xl lg:text-2xl font-black shadow-md">
                  24K Gold / Silver
                </span>
              </h2>
              
              <div className="text-sm sm:text-base lg:text-lg text-[#4a2e1e] bg-white rounded-lg px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-4 shadow-md mb-4 text-center">
                We at <span className="text-[#991616] font-semibold">Digital Gold</span> want to make your gold journey <b>simple</b>, <b>transparent</b> and <b>trustworthy</b> so that you can get the optimum output of your savings.
              </div>
              
              <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="text-center border rounded py-2 px-2 sm:py-3 sm:px-3 lg:py-4 lg:px-4 bg-white shadow-md border-[#f9e9c7] transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:scale-105 min-w-[80px] sm:min-w-[100px] lg:min-w-[120px]"
                  >
                    <div className="flex items-center justify-center mb-1 sm:mb-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-[#f9e9c7] mx-auto shadow-sm">
                      <CustomImage src={f.icon} width="20" height="20" alt={f.title} style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div className="font-semibold text-[#991313] text-xs sm:text-sm lg:text-base">{f.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div
              className="rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-white w-full max-w-[400px] lg:max-w-[520px] aspect-square border-2 border-[#f9e9c7] flex items-center justify-center"
              ref={goldPlantFade.ref}
              style={goldPlantFade.style}
            >
              <CustomImage
                src="/assets/gold-plant.png"
                alt="Gold Plant"
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div
        className="bg-gradient-to-br from-[#fff8e7] to-[#f7eded] rounded-xl mx-4 mb-6 sm:mb-8 pb-4 shadow-lg"
        ref={whyFade.ref}
        style={whyFade.style}
      >
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="text-center mb-6">
            <div className="text-[#991313] font-bold">
              <span className="text-xl sm:text-2xl">✨</span>
            </div>
            <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#991313]">Why Choose Us?</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {whyChoose.map((item, idx) => (
              <div key={idx} className="w-full">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full border border-[#f0e3d1] transition-shadow duration-200 cursor-pointer hover:shadow-lg flex flex-col items-center min-h-[160px] sm:min-h-[180px] lg:min-h-[200px]">
                  <div className="flex items-center justify-center mb-2 sm:mb-3 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-[#f9e9c7] shadow-sm">
                    <CustomImage src={item.icon} width="24" height="24" alt={item.title} style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div className="font-semibold text-center text-[#991313] text-sm sm:text-base lg:text-lg mb-2">{item.title}</div>
                  <div className="text-center text-xs sm:text-sm lg:text-base text-[#4a2e1e] leading-5">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div
        className="container mx-auto px-4 py-6 lg:py-8"
        ref={testiFade.ref}
        style={testiFade.style}
      >
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#991313]">What Our Customers Say</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="w-full">
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full border border-[#f0e3d1] transition-shadow duration-200 cursor-pointer hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 shadow-sm">
                    <CustomImage src={testimonial.img} width="48" height="48" alt={testimonial.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-[#991313] text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">{testimonial.location}</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#4a2e1e] leading-5">
                  "{testimonial.text}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div
        className="bg-[#991313] rounded-xl mx-4 mb-6 sm:mb-8 shadow-lg"
        ref={faqFade.ref}
        style={faqFade.style}
      >
        <div className="container mx-auto px-4 py-6 lg:py-10">
          <div className="text-center mb-6 lg:mb-8">
            <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#ffe066]">
              Frequently Asked Questions
            </h3>
            <div className="mx-auto mt-2 mb-4 w-16 sm:w-20 lg:w-24 h-1 rounded-full bg-gradient-to-r from-[#ffe066] to-white opacity-70"></div>
          </div>
          
          <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="w-full max-w-2xl transition-transform duration-200 hover:-translate-y-1"
              >
                <div
                  className="rounded-xl lg:rounded-2xl shadow-lg border-2 border-[#f0e3d1] bg-white transition-shadow duration-200 cursor-pointer overflow-hidden"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") setOpenFaq(openFaq === idx ? null : idx);
                  }}
                  tabIndex={0}
                  aria-expanded={openFaq === idx}
                >
                  <div
                    className={`flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 font-semibold text-sm sm:text-base lg:text-lg text-[#991313] cursor-pointer select-none
                      ${openFaq === idx ? "bg-[#f9e9c7] border-b-2 border-[#f0e3d1]" : "bg-white"}
                    `}
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`text-lg sm:text-xl lg:text-2xl ml-3 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : "rotate-0"}`}
                    >▼</span>
                  </div>
                  <div
                    className="transition-all duration-400 ease-in-out bg-[#fff8e7] overflow-hidden"
                    style={{
                      maxHeight: openFaq === idx ? 150 : 0,
                      opacity: openFaq === idx ? 1 : 0,
                      padding: openFaq === idx ? "16px 16px" : "0 16px",
                    }}
                  >
                    <div className="text-[#4a2e1e] text-sm sm:text-base leading-5">{faq.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div
        className="container mx-auto px-4 py-6 lg:py-8"
        ref={partnersFade.ref}
        style={partnersFade.style}
      >
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#991313]">Our Trusted Partners</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
          {partners.map((partner, idx) => (
            <div key={idx} className="w-full max-w-[140px]">
              <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 lg:p-4 flex items-center justify-center border-2 border-[#f0e3d1] transition-shadow duration-200 cursor-pointer hover:shadow-lg min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]">
                <CustomImage 
                  src={partner.src} 
                  alt={partner.alt} 
                  width="100%" 
                  height="auto" 
                  style={{ 
                    objectFit: "contain", 
                    width: "100%", 
                    height: "auto",
                    maxHeight: "40px"
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LAboutUsPage;