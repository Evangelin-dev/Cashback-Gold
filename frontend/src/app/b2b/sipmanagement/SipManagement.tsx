
import { useState } from "react";
const B2B_PRIMARY = "#7a1335"; // Primary color for B2B

const SIP_PLANS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

const initialSips = [
  {
    name: "Rahul Sharma",
    startDate: "2024-06-01",
    amount: 5000,
    duration: 12,
    plan: "monthly",
    planName: "Gold Saver",
    status: "Active",
    commission: "₹500",
    mobile: "9876543210",
    email: "rahul@example.com",
    password: "password123",
    gender: "Male",
  },
  {
    name: "Priya Patel",
    startDate: "2024-07-15",
    amount: 10000,
    duration: 24,
    plan: "quarterly",
    planName: "Premium Plan",
    status: "Active",
    commission: "₹1000",
    mobile: "9123456789",
    email: "priya@example.com",
    password: "secure456",
    gender: "Female",
  },
];
export default function SipManagement() {
  const [sips, setSips] = useState<Sip[]>(initialSips);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [form, setForm] = useState<SipForm>({
    name: "",
    startDate: "",
    amount: "",
    duration: "",
    plan: "monthly",
    customPlan: "",
    planName: "",
    mobile: "",
    email: "",
    password: "",
    gender: "Male",
    countryCode: "+91",
  });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx !== null) {
      setSips(sips.map((sip: Sip, idx: number) =>
        idx === editIdx
          ? {
              ...sip,
              ...form,
              amount: Number(form.amount),
              duration: Number(form.duration),
              plan: form.plan === "custom" && form.customPlan ? form.customPlan : form.plan,
              planName: form.planName,
              mobile: form.countryCode + form.mobile,
              email: form.email,
              password: form.password,
              gender: form.gender,
            }
          : sip
      ));
      setEditIdx(null);
    } else {
      setSips([
        ...sips,
        {
          name: form.name,
          startDate: form.startDate,
          amount: Number(form.amount),
          duration: Number(form.duration),
          commission: "₹0",
          status: "Active",
          plan: form.plan === "custom" && form.customPlan ? form.customPlan : form.plan,
          planName: form.planName,
          mobile: form.countryCode + form.mobile,
          email: form.email,
          password: form.password,
          gender: form.gender,
        },
      ]);
    }
    setForm({
      name: "",
      startDate: "",
      amount: "",
      duration: "",
      plan: "monthly",
      customPlan: "",
      planName: "",
      mobile: "",
      email: "",
      password: "",
      gender: "Male",
      countryCode: "+91",
    });
    setShowModal(false);
  };

  const handleEdit = (idx: number) => {
    const sip = sips[idx];
    setEditIdx(idx);
    let countryCode = "+91";
    let mobile = sip.mobile;
    const match = sip.mobile.match(/^(\+\d{1,3})(\d{7,15})$/);
    if (match) {
      countryCode = match[1];
      mobile = match[2];
    }
    setForm({
      name: sip.name,
      startDate: sip.startDate,
      amount: String(sip.amount),
      duration: String(sip.duration),
      plan: SIP_PLANS.some((p: { label: string; value: string }) => p.value === sip.plan) ? sip.plan : "custom",
      customPlan: SIP_PLANS.some((p: { label: string; value: string }) => p.value === sip.plan) ? "" : sip.plan,
      planName: sip.planName || "",
      mobile: mobile || "",
      email: sip.email || "",
      password: sip.password || "",
      gender: sip.gender || "Male",
      countryCode: countryCode,
    });
    setShowModal(true);
  };


  



// Type definitions
type Sip = {
  name: string;
  startDate: string;
  amount: number;
  duration: number;
  plan: string;
  planName: string;
  status: string;
  commission: string;
  mobile: string;
  email: string;
  password: string;
  gender: string;
};

type SipForm = {
  name: string;
  startDate: string;
  amount: string;
  duration: string;
  plan: string;
  customPlan: string;
  planName: string;
  mobile: string;
  email: string;
  password: string;
  gender: string;
  countryCode: string;
};


  const handleStatusChange = (idx: number, newStatus: string) => {
    setSips(sips.map((sip, i) => i === idx ? { ...sip, status: newStatus } : sip));
  };

  const handleDelete = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this SIP?")) {
      setSips(sips.filter((_, i) => i !== idx));
    }
  };

  const filteredSips = sips.filter(sip =>
    sip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sip.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sip.mobile.includes(searchQuery)
  );

  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        padding: "32px",
        margin: "0 auto",
        maxWidth: "1400px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <h1 style={{
            color: B2B_PRIMARY,
            fontSize: "28px",
            fontWeight: "700",
            margin: 0
          }}>
            SIP Customer Management
          </h1>
          <div style={{
            backgroundColor: "#f1f5f9",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            Total SIPs: {sips.length}
          </div>
        </div>

        {/* Search and Add Section */}
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "32px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="🔍 Search by name, email or mobile..."
            style={{
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
              flex: "1",
              minWidth: "250px",
              outline: "none"
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = B2B_PRIMARY}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          <button
            style={{
              backgroundColor: B2B_PRIMARY,
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
            onClick={() => {
              setForm({
                name: "",
                startDate: "",
                amount: "",
                duration: "",
                plan: "monthly",
                customPlan: "",
                planName: "",
                mobile: "",
                email: "",
                password: "",
                gender: "Male",
                countryCode: "+91",
              });
              setEditIdx(null);
              setShowModal(true);
            }}
          >
            + Add New SIP
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '32px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}>
              <button
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#64748b'
                }}
                onClick={() => setShowModal(false)}
                type="button"
              >
                ×
              </button>
              
              <h2 style={{
                color: B2B_PRIMARY,
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '24px'
              }}>
                {editIdx !== null ? 'Edit SIP' : 'Add New SIP'}
              </h2>

              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Customer Name *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Enter customer name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Gender *
                    </label>
                    <select
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Start Date *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      SIP Amount *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      type="number"
                      placeholder="Enter amount"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Duration (months) *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      type="number"
                      placeholder="Enter duration"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Mobile Number *
                    </label>
                    <div style={{ display: 'flex' }}>
                      <select
                        style={{
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px 0 0 8px',
                          padding: '12px 8px',
                          fontSize: '14px',
                          outline: 'none',
                          minWidth: '100px'
                        }}
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleChange}
                        required
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+81">🇯🇵 +81</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+65">🇸🇬 +65</option>
                      </select>
                      <input
                        style={{
                          flex: 1,
                          border: '2px solid #e2e8f0',
                          borderLeft: 'none',
                          borderRadius: '0 8px 8px 0',
                          padding: '12px 16px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        type="tel"
                        placeholder="Enter mobile number"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Email ID *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Password *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      type="password"
                      placeholder="Enter password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      SIP Plan *
                    </label>
                    <select
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      name="plan"
                      value={form.plan}
                      onChange={handleChange}
                      required
                    >
                      {SIP_PLANS.map(plan => (
                        <option key={plan.value} value={plan.value}>{plan.label}</option>
                      ))}
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                      Plan Name *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Enter plan name"
                      name="planName"
                      value={form.planName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {form.plan === "custom" && (
                    <div style={{ gridColumn: window.innerWidth > 768 ? 'span 2' : '1' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                        Custom Plan *
                      </label>
                      <input
                        style={{
                          width: '100%',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        placeholder="Enter custom plan details"
                        name="customPlan"
                        value={form.customPlan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: B2B_PRIMARY,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={handleAddOrUpdate}
                  >
                    {editIdx !== null ? 'Update SIP' : 'Add SIP'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{
          overflowX: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          backgroundColor: 'white'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Gender</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Start Date</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Duration</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Mobile</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Plan</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Plan Name</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Commission</th>
                <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSips.map((sip, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 12px', fontWeight: '500' }}>{sip.name}</td>
                  <td style={{ padding: '16px 12px' }}>{sip.gender || '-'}</td>
                  <td style={{ padding: '16px 12px' }}>{sip.startDate}</td>
                  <td style={{ padding: '16px 12px', fontWeight: '600' }}>₹{sip.amount.toLocaleString()}</td>
                  <td style={{ padding: '16px 12px' }}>{sip.duration} months</td>
                  <td style={{ padding: '16px 12px' }}>{sip.mobile}</td>
                  <td style={{ padding: '16px 12px' }}>{sip.email}</td>
                  <td style={{ padding: '16px 12px', textTransform: 'capitalize' }}>{sip.plan}</td>
                  <td style={{ padding: '16px 12px' }}>{sip.planName}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{
                      backgroundColor: sip.status === 'Active' ? '#dcfce7' : sip.status === 'Completed' ? '#dbeafe' : '#fef2f2',
                      color: sip.status === 'Active' ? '#166534' : sip.status === 'Completed' ? '#1e40af' : '#dc2626',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {sip.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', fontWeight: '600' }}>{sip.commission}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        style={{
                          backgroundColor: '#f0f9ff',
                          color: '#0284c7',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <select
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                        value={sip.status}
                        onChange={(e) => handleStatusChange(idx, e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        style={{
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSips.length === 0 && (
                <tr>
                  <td colSpan={12} style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#9ca3af',
                    fontSize: '16px'
                  }}>
                    {searchQuery ? 'No matching SIPs found.' : 'No SIPs available. Add your first SIP to get started!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}