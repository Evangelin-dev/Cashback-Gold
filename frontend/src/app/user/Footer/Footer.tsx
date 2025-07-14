import CustomImage from "../../components/custom/Image";
import logoStyle from "../NavBar/styles.module.css";

// Remove next/link, use <a> for navigation in React Router projects

const Footer = () => {
  return (
    <footer
      style={{
        background: `url('/assets/footerb.png') center center/cover no-repeat, #fffbe9`,
        position: "relative",
      }}
    >
      <div className="container py-5">
        <div className="row">
          {/* About */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="mb-3">
              <CustomImage
                src="/assets/green.png"
                wrapperClss={`${logoStyle.logo_img_container} m-0 pb-3`}
                height="75px"
                width="100px"
                alt="Logo"
              />
            </div>
            <div style={{ fontSize: "1.1rem", color: "#222" }}>
              Our organization offers a structured and transparent approach of
              purchasing and accumulating 24K gold through digital and easy
              conversion to physical gold. Full compliance with all relevant
              laws and regulations.
            </div>
          </div>
          {/* Useful Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <div
              style={{
                color: "#7a1335",
                fontWeight: 600,
                fontSize: "1.25rem",
              }}
            >
              Useful Links
            </div>
            <ul
              className="list-unstyled mt-3"
              style={{ fontSize: "1.05rem" }}
            >
              <li>
                <a
                  href="/about-us"
                  className="text-dark text-decoration-none"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="terms"
                  className="text-dark text-decoration-none"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="privacy"
                  className="text-dark text-decoration-none"
                >
                  Privacy Policy

                </a>
              </li>
              <li>
                <a
                  href="refund"
                  className="text-dark text-decoration-none"
                >
                  Refund & Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="/shippingpolicy"
                  className="text-dark text-decoration-none"
                >
                 Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="/SIPplandisclaimer"
                  className="text-dark text-decoration-none"
                >
                  SIPPlan Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/contactus"
                  className="text-dark text-decoration-none"
                >
                  Contact Us
                </a>
              </li>
              
            </ul>
          </div>
          {/* Contact Us */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div
              style={{
                color: "#7a1335",
                fontWeight: 600,
                fontSize: "1.25rem",
              }}
            >
              Contact Us
            </div>
            <div className="mt-3" style={{ fontSize: "1.05rem" }}>
              <div className="mb-2" style={{ display: "flex", alignItems: "flex-start" }}>
                <img
                  src="/home/Location.png"
                  alt="Location"
                  style={{ width: 22, height: 22, marginRight: 8, marginTop: -2 }}
                />
                <span>
                  No. 1/PL922, 66th Street, 11th Sector,
                  <br />
                  Kalaignar Karunanidhi Nagar,
                  <br />
                  Tamil Nadu, Chennai, India.
                </span>
              </div>
              <div className="mb-2" style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/home/Mail_1.png" 
                  alt="Mail"
                  style={{ width: 22, height: 22, marginRight: 8 }}
                />
                <span>
                  spprtgreenheapdigigold@gmail.com
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/home/call 1.png"
                  alt="Phone"
                  style={{ width: 22, height: 22, marginRight: 8 }}
                />
                <span>
                  +91 81900 59995
                </span>
              </div>
            </div>
          </div>
          {/* Follow Us */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div
              style={{
                color: "#7a1335",
                fontWeight: 600,
                fontSize: "1.25rem",
              }}
            >
              Follow Us
            </div>
            <div className="d-flex align-items-center gap-3 mt-3 mb-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#991313",
                
                  padding: 0,
                }}
              >
                <img src="/home/Facebook.png" alt="Facebook" style={{ width: 28, height: 28 }} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#991313",
                  padding: 0,
                }}
              >
                <img src="/home/insta.png" alt="Instagram" style={{ width: 28, height: 28 }} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#991313",
                  
                  padding: 0,
                }}
              >
                <img src="/home/X.png" alt="X" style={{ width: 28, height: 28 }} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#991313",
                
                  padding: 0,
                }}
              >
                <img src="/home/Youtube.png" alt="YouTube" style={{ width: 28, height: 28 }} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#991313",
                  padding: 0,
                }}
              >
                <img src="/home/Linkedin.png" alt="LinkedIn" style={{ width: 28, height: 28 }} />
              </a>
            </div>
            <div className="d-flex gap-2 mt-2">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/assets/black-play-img.png"
                  alt="Google Play"
                  style={{ height: 40 }}
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img
                  src="/assets/black-store-img.png"
                  alt="App Store"
                  style={{ height: 40 }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/918190059995"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 9999,
        }}
      >
        <i
          className="fa fa-whatsapp"
          style={{ fontSize: "2.5rem", color: "#25D366" }}
        ></i>
      </a>
      {/* Copyright */}
      <div
        style={{
          background: "#7a1335",
          color: "#fff",
          textAlign: "center",
          padding: "12px 0",
          fontSize: "1.05rem",
        }}
      >
        © 2024 Greenheap Gold And Silver Jewellery Private Limited.
      </div>
    </footer>
  );
};

export default Footer;
