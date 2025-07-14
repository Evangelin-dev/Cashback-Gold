
const PrivacyPlicyPage = () => {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Banner section with background image and centered title */}
      <div
        style={{
          width: "100%",
          height: "38vh",
          minHeight: 260,
          background: `url('/home/banner 2.png') center center/cover no-repeat`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginTop: 120, // 44px top bar + ~48px nav bar
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.32)",
            zIndex: 1,
          }}
        ></div>
        <h1
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "2.8rem",
            letterSpacing: 0.5,
            zIndex: 2,
            position: "relative",
            textAlign: "center",
            fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif",
          }}
        >
          Privacy and Policy
        </h1>
      </div>
      {/* Terms Content Section */}
      <section
       >
        <div
          style={{
            flex: 1,
            minWidth: 1200,
            maxWidth: 600,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 12px #f9e9c7",
            padding: "32px 18px 28px 18px",
            margin: "40px auto 0 auto", // Add top margin for space after banner, center horizontally
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <h2 style={{ color: "#7a1335", fontWeight: 700, fontSize: 28, marginBottom: 18, textAlign: "center" }}>Privacy Policy</h2>
          <div style={{ color: "#222", fontSize: 17, lineHeight: 1.8, fontWeight: 500, fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif", padding: "0 8px" }}>
            <p>At Greenheap Gold, your privacy is our priority. This Privacy Policy outlines how we collect, use, protect, and disclose your personal information when you visit our website <b>www.greenheapgold.com</b> or use our services.</p>
            <ol style={{ paddingLeft: 18, marginTop: 18 }}>
              <li style={{ marginBottom: 14 }}><b>Information We Collect</b><br />
                We may collect the following types of information:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li><b>Personal Details:</b> Name, email address, phone number, date of birth, and address.</li>
                  <li><b>Financial Information:</b> Payment details, transaction history, bank account numbers (for chit fund schemes).</li>
                  <li><b>Identity Verification:</b> PAN card, Aadhaar number, or other official IDs for KYC compliance.</li>
                  <li><b>Device & Usage Info:</b> IP address, browser type, pages visited, time spent, and cookies.</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>How We Use Your Information</b><br />
                We use your information to:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>Facilitate gold purchases and manage chit fund participation</li>
                  <li>Process payments securely</li>
                  <li>Communicate offers, updates, and alerts</li>
                  <li>Comply with legal obligations (e.g., KYC, AML guidelines)</li>
                  <li>Improve our website performance and customer experience</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>Sharing of Information</b><br />
                We do not sell your data. However, we may share your information with:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>Trusted partners for payment processing and identity verification</li>
                  <li>Government authorities when required by law or regulation</li>
                  <li>Technology providers who help us operate the platform (under strict confidentiality)</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>Data Security</b><br />
                We implement industry-standard encryption, firewalls, and secure access protocols to protect your information. However, no online platform is 100% secure, and we encourage users to practice safe browsing.
              </li>
              <li style={{ marginBottom: 14 }}><b>Your Rights</b><br />
                You have the right to:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt-out of promotional emails and SMS</li>
                  <li>Request a copy of the data we hold</li>
                </ul>
                To exercise these rights, please contact us at <b>[insert email address]</b>.
              </li>
              <li style={{ marginBottom: 14 }}><b>Cookies</b><br />
                We use cookies to improve user experience and analyze traffic. You can control cookie settings through your browser.
              </li>
              <li style={{ marginBottom: 14 }}><b>Third-Party Links</b><br />
                Our website may contain links to third-party sites. We are not responsible for their privacy practices.
              </li>
              <li style={{ marginBottom: 14 }}><b>Updates to Policy</b><br />
                We may update this Privacy Policy periodically. Changes will be reflected on this page with a revised "Effective Date."
              </li>
              <li style={{ marginBottom: 14 }}><b>Contact Us</b><br />
                For any privacy-related questions or requests, contact:<br />
                Email: <b>support@greenheapgold.com</b><br />
                Phone: <b>81900 59995</b>
              </li>
            </ol>
          </div>
        </div>
        {/* Spacer for horizontal layout */}
        <div style={{ flex: 0.2 }} />
      </section>
      {/* Add bottom spacing to ensure all content is visible */}
      <div style={{ height: 60 }} />
    </div>
  );
};

export default PrivacyPlicyPage;

