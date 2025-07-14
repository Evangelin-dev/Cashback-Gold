
const Refund = () => {
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
          Refund & Cancellation Policy
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
          <h2 style={{ color: "#7a1335", fontWeight: 700, fontSize: 28, marginBottom: 18, textAlign: "center" }}>Refund & Return Policy</h2>
          <div style={{ color: "#222", fontSize: 17, lineHeight: 1.8, fontWeight: 500, fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif", padding: "0 8px" }}>
            <p>At Greenheap Gold, we strive to provide high-quality gold products and exceptional customer service. If you are not fully satisfied with your purchase, our refund and return policy is designed to be simple and transparent.</p>
            <ol style={{ paddingLeft: 18, marginTop: 18 }}>
              <li style={{ marginBottom: 14 }}><b>7-Day Return Policy</b><br />
                If for any reason you are not satisfied with the gold item you purchased:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>You may return the product within 7 days from the date of delivery.</li>
                  <li>The gold must be unused, untampered, and returned in its original packaging with the invoice.</li>
                  <li>Once the item is received and inspected, a refund will be processed to your original payment method within 7–10 working days.</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>Delivery-Related Damage</b><br />
                If your product arrives damaged or tampered during transit:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>You must report the issue within 7 days of delivery by contacting our customer support at <b>support@greenheapgold.com</b> with photo or video proof.</li>
                  <li>Upon validation, we will initiate a refund or replacement at no additional cost.</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>Important Notes</b><br />
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>Return shipping charges (if applicable) will be borne by the customer unless the product was delivered damaged.</li>
                  <li>Customized gold orders or special schemes (like chit fund redemptions) may not be eligible for return unless defective.</li>
                  <li>Partial refunds may be issued if items show signs of use or damage not related to delivery.</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>How to Initiate a Return</b><br />
                To initiate a return or report delivery damage, please:
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  <li>Email us at <b>support@greenheapgold.com</b></li>
                  <li>Mention your Order ID, contact number, and reason for return</li>
                  <li>Attach relevant photos/videos (for damaged items)</li>
                  <li>Our team will guide you through the process</li>
                </ul>
              </li>
              <li style={{ marginBottom: 14 }}><b>Contact Us</b><br />
                For any refund or return-related questions:<br />
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

export default Refund;

