import CustomImage from "../Image";

const Carousel = () => {
  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="1000">
          <CustomImage
            src={"/banner/green-heap-gold-banner.png"}
            wrapperClss={"d-block w-100"}
            height="auto"
          />
        </div>
        <div className="carousel-item" data-bs-interval="1000">
          <CustomImage
            src={"/banner/green-heap-gold-banner2.png"}
            wrapperClss={"d-block w-100"}
            height="auto"
          />
        </div>
        <div className="carousel-item" data-bs-interval="1000">
          <CustomImage
            src={"/banner/green-heap-gold-banner3.png"}
            wrapperClss={"d-block w-100"}
            height="auto"
          />
        </div>
        <div className="carousel-item" data-bs-interval="1000">
          <CustomImage
            src={"/banner/green-heap-gold-banner4.png"}
            wrapperClss={"d-block w-100"}
            height="auto"
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
