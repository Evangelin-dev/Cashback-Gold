
const Terms = () => {
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
          Terms and Conditions
        </h1>
      </div>
      {/* Terms Content Section */}
      <section>
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
          <h2 style={{ color: "#7a1335", fontWeight: 700, fontSize: 28, marginBottom: 18, textAlign: "center" }}>Terms and Conditions</h2>
          <div style={{ color: "#222", fontSize: 17, lineHeight: 1.8, fontWeight: 500, fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif", padding: "0 8px" }}>
            <p>Welcome to Greenheap Gold. By accessing or using our website <b>www.greenheapgold.com</b> and services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.</p>
            <ol style={{ paddingLeft: 18, marginTop: 18 }}>
              <li style={{ marginBottom: 14 }}><b>Definitions</b><br />
                “We,” “Us,” “Our” refers to Greenheap Gold, its owners, and operators.<br />
                “You,” “User,” “Customer” refers to any person accessing or using our website or services.<br />
                “Services” includes gold purchasing, chit fund schemes, and other offerings listed on our website.
              </li>
              <li style={{ marginBottom: 14 }}><b>Eligibility</b><br />
                You must be at least 18 years old and capable of entering into a legally binding contract. By using our services, you confirm that all provided information is accurate and complete.
              </li>
              <li style={{ marginBottom: 14 }}><b>Gold Purchase Policy</b><br />
                Prices of gold are subject to market fluctuations and may change at any time without notice.<br />
                Orders once placed and confirmed are non-refundable and non-cancellable.<br />
                Gold will be delivered physically or held in secure digital lockers depending on your selected plan.
              </li>
              <li style={{ marginBottom: 14 }}><b>Chit Fund Scheme</b><br />
                Participation in our chit fund is subject to verification through valid KYC documents.<br />
                Monthly contributions are mandatory. Failure to contribute on time may lead to penalties or disqualification.<br />
                Payouts and winnings are governed by internal draw procedures and government regulations.
              </li>
              <li style={{ marginBottom: 14 }}><b>Payments and Transactions</b><br />
                All payments must be made via approved payment gateways or bank transfers.<br />
                Greenheap Gold is not responsible for delays due to third-party payment processors.<br />
                Transaction history and receipts will be accessible via your user dashboard.
              </li>
              <li style={{ marginBottom: 14 }}><b>Account Security</b><br />
                You are responsible for maintaining the confidentiality of your login credentials. Any activity under your account will be deemed your responsibility.
              </li>
              <li style={{ marginBottom: 14 }}><b>Intellectual Property</b><br />
                All content on this website—logos, graphics, texts, and layouts—are the property of Greenheap Gold and may not be used without permission.
              </li>
              <li style={{ marginBottom: 14 }}><b>Prohibited Use</b><br />
                You agree not to:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>Engage in fraudulent or unlawful activity</li>
                  <li>Attempt to hack, tamper, or access restricted areas</li>
                  <li>Reproduce or redistribute content without permission</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>Limitation of Liability</b><br />
                Greenheap Gold will not be liable for:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>Losses due to market fluctuations in gold prices</li>
                  <li>Delay or failure in services due to force majeure events</li>
                  <li>Any indirect, incidental, or consequential damages</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>Termination</b><br />
                We reserve the right to suspend or terminate your account at our discretion, without notice, for violation of these Terms or suspected fraudulent activity.
              </li>
              <li style={{ marginBottom: 14 }}><b>Governing Law</b><br />
                These Terms are governed by the laws of India. Any dispute arising from these terms will be subject to the jurisdiction of the courts in <b>[Insert City, e.g., Chennai]</b>.
              </li>
              <li style={{ marginBottom: 14 }}><b>Contact Information</b><br />
                For questions or concerns, please contact:<br />
                <span role="img" aria-label="email">📧</span> Email: <b>support@greenheapgold.com</b><br />
                <span role="img" aria-label="phone">📞</span> Phone: <b>81900 59995</b>
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

export default Terms;