import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Outlet } from "react-router-dom";
import "../../../globals.css";
import Footer from "./Footer/Footer";

import LNavBar from "./NavBar/NavBar";


interface UserLayoutProps {
  children?: React.ReactNode;
}

const LogUserLayout: React.FC<UserLayoutProps> = () => {
  return (
    <div >
      <div style={{ marginBottom: "30px" }}>
        <LNavBar />
      </div>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-6 lg:p-8">
          <Outlet />
           {/* Floating WhatsApp Button */}
          <div
            style={{
              position: "fixed",
              right: 24,
              bottom: 24,
              zIndex: 1050,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 0,
            }}
           >
            <a
              href="https://wa.me/918190059995"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #25d366 60%, #128c7e 100%)",
                borderRadius: "50%",
                width: 62,
                height: 62,
                boxShadow: "0 8px 32px 0 rgba(37,211,102,0.18)",
                transition: "box-shadow 0.18s, transform 0.18s, background 0.18s",
                border: "3px solid #fff",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, #128c7e 60%, #25d366 100%)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 32px 0 rgba(37,211,102,0.28)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.08)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, #25d366 60%, #128c7e 100%)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px 0 rgba(37,211,102,0.18)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block" }}
              >
                <circle cx="24" cy="24" r="24" fill="#25d366" />
                <path
                  d="M24 12c-6.627 0-12 5.373-12 12 0 2.11.553 4.09 1.51 5.8L12 36l6.37-1.49A11.94 11.94 0 0 0 24 36c6.627 0 12-5.373 12-12S30.627 12 24 12Zm0 21.6c-1.73 0-3.41-.45-4.89-1.3l-.35-.2-3.78.89.81-3.68-.22-.37A9.6 9.6 0 1 1 24 33.6Zm5.26-7.13c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.93-.91 1.12-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.19 2.03 3.1 4.93 4.22.69.28 1.23.45 1.65.57.69.22 1.32.19 1.82.12.56-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z"
                  fill="#fff"
                />
              </svg>
            </a>
          </div>
          <Footer/>
        </main>
    </div>
  );
};

export default LogUserLayout;