import { useEffect, useRef, useState } from "react";
import CustomImage from "../Image";

const images = [
  { src: "/banner/green-heap-gold-banner.png" },
  { src: "/banner/1.png" },
  { src: "/banner/2.png" },
  { src: "/banner/3.png" },
];

const AUTO_SCROLL_INTERVAL = 6000; // 3 seconds

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Auto-scroll logic
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, AUTO_SCROLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Manual navigation
  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    resetInterval();
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    resetInterval();
  };

  // Reset interval on manual navigation
  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, AUTO_SCROLL_INTERVAL);
  };

  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="carousel-inner">
        {images.map((img, idx) => (
          <div
            key={img.src}
            className={`carousel-item${idx === activeIndex ? " active" : ""}`}
            style={{
              transition: "opacity 0.8s",
              opacity: idx === activeIndex ? 1 : 0,
              position: idx === activeIndex ? "relative" : "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <CustomImage
              src={img.src}
              wrapperClss={"d-block w-100"}
              height="auto"
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        onClick={goToPrev}
        style={{ zIndex: 2 }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        onClick={goToNext}
        style={{ zIndex: 2 }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
