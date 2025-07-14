const ShippingPolicy = () => {
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
          Shipping Policy
        </h1>
      </div>
      {/* Policy Content Section */}
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
          <h2 style={{ color: "#7a1335", fontWeight: 700, fontSize: 28, marginBottom: 18, textAlign: "center" }}>Shipping Policy</h2>
          <div style={{ color: "#222", fontSize: 17, lineHeight: 1.8, fontWeight: 500, fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif", padding: "0 8px" }}>
            <p>At Greenheap Gold, we do not offer traditional shipping services. Instead, we act as a technology integrator, connecting customers directly with trusted gold merchants.</p>
            <ol style={{ paddingLeft: 18, marginTop: 18 }}>
              <li style={{ marginBottom: 14 }}><b>Store Pickup Only</b><br />
                All gold purchases made through <b>www.greenheapgold.com</b> are to be collected from our partner store as selected during checkout.<br />
                Once your order is confirmed and ready, you will receive a pickup notification via SMS/email.
              </li>
              <li style={{ marginBottom: 14 }}><b>Role of Greenheap Gold</b><br />
                Greenheap Gold is a platform that facilitates transactions between customers and verified shopkeepers.<br />
                We do not handle the physical delivery or logistics of the product.
              </li>
              <li style={{ marginBottom: 14 }}><b>Pickup Instructions</b><br />
                Please carry a valid ID proof and order confirmation when visiting the store to collect your item.<br />
                Ensure you inspect the product at the store before completing the collection.
              </li>
              <li style={{ marginBottom: 14 }}><b>No Shipping Involved</b><br />
                As there is no home delivery, Greenheap Gold is not liable for delays or issues related to shipping.<br />
                All logistics, exchange, or follow-ups post-purchase are handled directly by the partner store.
              </li>
              <li style={{ marginBottom: 14 }}><b>Contact Us</b><br />
                For support related to store details or pickup scheduling:<br />
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

export default ShippingPolicy;

