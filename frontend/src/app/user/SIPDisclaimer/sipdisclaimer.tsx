
const SIPPlanDisclaimer = () => {
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
          SIP Gold Saving Plan – Disclaimer

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
          <h2 style={{ color: "#7a1335", fontWeight: 700, fontSize: 28, marginBottom: 18, textAlign: "center" }}>SIP Gold Saving Plan – Disclaimer</h2>
          <div style={{ color: "#222", fontSize: 17, lineHeight: 1.8, fontWeight: 500, fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif", padding: "0 8px" }}>
            <p>At Greenheap Gold, our SIP (Systematic Investment Plan) enables customers to save regularly and accumulate gold in a disciplined and flexible manner.</p>
            <p>By enrolling in our SIP plan, you agree to the following terms:</p>
            <ol style={{ paddingLeft: 18, marginTop: 18 }}>
              <li style={{ marginBottom: 14 }}><b>Flexible Refund Anytime</b><br />
                You may request a refund at any time during your SIP tenure.<br />
                The refund will be processed based on the total amount you have contributed till date.
              </li>
              <li style={{ marginBottom: 14 }}><b>Service Charge Deduction</b><br />
                A 6% service charge will be deducted from the total contributed amount.<br />
                The remaining balance will be refunded immediately to your registered bank account or wallet.
              </li>
              <li style={{ marginBottom: 14 }}><b>Simple Refund Process</b><br />
                You can click the ‘Refund’ option in your dashboard to initiate a refund request.<br />
                Refunds are typically credited within 2–4 business days after the service charge deduction.
              </li>
              <li style={{ marginBottom: 14 }}><b>No Lock-in Period</b><br />
                There is no lock-in period. You are free to pause, stop, or withdraw from the SIP plan at any time without penalties.
              </li>
              <li style={{ marginBottom: 14 }}><b>Disclaimer</b><br />
                Greenheap Gold serves as a platform for systematic gold saving.<br />
                Refunds are based on the amount saved, not on the prevailing gold market rate at the time of refund.
              </li>
            </ol>
            <p style={{ marginTop: 18, fontWeight: 600 }}>Need Help?</p>
            <div style={{ marginBottom: 8 }}>
              <span role="img" aria-label="email">📧</span> Email: <b>support@greenheapgold.com</b><br />
              <span role="img" aria-label="phone">📞</span> Phone: <b>81900 59995</b>
            </div>
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

export default SIPPlanDisclaimer;

