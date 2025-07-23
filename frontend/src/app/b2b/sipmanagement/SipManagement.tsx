import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const B2B_PRIMARY = "#7a1335";

const SIP_PLANS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

interface User {
  id: number;
  fullName: string;
  gender: string;
  dob: string;
  email: string;
  mobile: string;
  countryCode: string;
}

interface Sip {
  id: number;
  user: User;
  startDate: string;
  amount: number;
  duration: number;
  plan: string;
  planName: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  commission: string;
}

interface SipForm {
  name: string;
  gender: string;
  dob: string;
  email: string;
  mobile: string;
  countryCode: string;
  password: string;
  startDate: string;
  amount: string;
  duration: string;
  plan: string;
  customPlan: string;
  planName: string;
}

const initialForm: SipForm = {
  name: "", gender: "Male", dob: "", email: "", mobile: "",
  countryCode: "+91", password: "", startDate: "", amount: "",
  duration: "", plan: "monthly", customPlan: "", planName: ""
};

export default function SipManagement() {
  const [sips, setSips] = useState<Sip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState<SipForm>(initialForm);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);


  const fetchSips = useCallback(async (query = "") => {
    setIsLoading(true);
    try {

      const url = query
        ? `/api/sips/b2b/search?query=${query}`
        : '/api/sips/b2b/mine';

      const response = await axiosInstance.get(url);
      setSips(response.data);
    } catch (error) {
      console.error("Failed to fetch SIPs:", error);
      alert("Could not fetch your SIP data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSips(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, fetchSips]);


  const handleAddSip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIdx !== null) {
      alert("Local update applied. API for edit is not implemented yet.");
      setShowModal(false);
      return;
    }

    setIsModalSubmitting(true);
    const payload = {
      name: form.name,
      gender: form.gender,
      dob: form.dob,
      email: form.email,
      mobile: `${form.countryCode}${form.mobile}`, countryCode: form.countryCode,
      password: form.password,
      startDate: form.startDate,
      amount: Number(form.amount),
      duration: Number(form.duration),
      plan: form.plan === "custom" ? form.customPlan : form.plan,
      planName: form.planName
    };

    try {
      await axiosInstance.post('/api/sips', payload);
      alert("New SIP customer added successfully!");
      setShowModal(false);
      setForm(initialForm);
      fetchSips();
    } catch (error) {
      console.error("Failed to add SIP:", error);
      alert("An error occurred while adding the SIP. The user may already exist or the data is invalid.");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleApiStatusChange = async (sipId: number, newStatus: Sip['status']) => {
    try {
      await axiosInstance.patch(`/api/sips/${sipId}/status`, newStatus, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setSips(sips.map(sip => sip.id === sipId ? { ...sip, status: newStatus } : sip));
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Could not update the status.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (idx: number) => {
    const sip = sips[idx];
    setEditIdx(idx);
    setForm({
      name: sip.user.fullName,
      gender: sip.user.gender,
      dob: sip.user.dob,
      email: sip.user.email,
      mobile: sip.user.mobile,
      countryCode: sip.user.countryCode,
      password: '',
      startDate: sip.startDate,
      amount: String(sip.amount),
      duration: String(sip.duration),
      plan: SIP_PLANS.some(p => p.value === sip.plan) ? sip.plan : "custom",
      customPlan: SIP_PLANS.some(p => p.value === sip.plan) ? "" : sip.plan,
      planName: sip.planName || "",
    });
    setShowModal(true);
  };

  const handleDelete = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this SIP? This is a local action.")) {
      setSips(sips.filter((_, i) => i !== idx));
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", padding: "32px", margin: "0 auto", maxWidth: "1400px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <h1 style={{ color: B2B_PRIMARY, fontSize: "28px", fontWeight: "700", margin: 0 }}>
            SIP Customer Management
          </h1>
          <div style={{ backgroundColor: "#f1f5f9", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500" }}>
            Total SIPs: {sips.length}
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Search your customers by name, email or mobile..."
            style={{ border: "2px solid #e2e8f0", borderRadius: "8px", padding: "12px 16px", fontSize: "14px", flex: "1", minWidth: "250px", outline: "none" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            style={{ backgroundColor: B2B_PRIMARY, color: "white", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            onClick={() => {
              setForm(initialForm);
              setEditIdx(null);
              setShowModal(true);
            }}
          >
            + Add New SIP
          </button>
        </div>

        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <form onSubmit={handleAddSip} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
              <button type="button" style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: '#64748b' }} onClick={() => setShowModal(false)}>×</button>
              <h2 style={{ color: B2B_PRIMARY, fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>{editIdx !== null ? 'Edit SIP' : 'Add New SIP'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr', gap: '20px', marginBottom: '24px' }}>
                <InputField label="Customer Name *" name="name" value={form.name} onChange={handleChange} required />
                <SelectField label="Gender *" name="gender" value={form.gender} onChange={handleChange} options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} />
                <InputField label="Date of Birth *" name="dob" type="date" value={form.dob} onChange={handleChange} required />
                <InputField label="Email ID *" name="email" type="email" value={form.email} onChange={handleChange} required />
                <InputField label="Password *" name="password" type="password" value={form.password} onChange={handleChange} required />
                <PhoneField countryCode={form.countryCode} mobile={form.mobile} onChange={handleChange} />
                <InputField label="Start Date *" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
                <InputField label="SIP Amount *" name="amount" type="number" value={form.amount} onChange={handleChange} required />
                <InputField label="Duration (months) *" name="duration" type="number" value={form.duration} onChange={handleChange} required />
                <InputField label="Plan Name *" name="planName" value={form.planName} onChange={handleChange} required />
                <SelectField label="SIP Plan *" name="plan" value={form.plan} onChange={handleChange} options={[...SIP_PLANS, { value: "custom", label: "Custom" }]} />
                {form.plan === "custom" && <div style={{ gridColumn: 'span 2' }}><InputField label="Custom Plan Details" name="customPlan" value={form.customPlan} onChange={handleChange} required /></div>}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" disabled={isModalSubmitting} style={{ backgroundColor: B2B_PRIMARY, color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: isModalSubmitting ? 0.7 : 1 }}>
                  {isModalSubmitting ? 'Submitting...' : (editIdx !== null ? 'Update SIP' : 'Add SIP')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {['Name', 'Start Date', 'Amount', 'Duration', 'Mobile', 'Email', 'Plan', 'Plan Name', 'Status', 'Commission', 'Actions'].map(h => <th key={h} style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e2e8f0' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading your SIPs...</td></tr>
              ) : sips.length === 0 ? (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>{searchQuery ? 'No matching customers found.' : 'You have not added any SIP customers yet.'}</td></tr>
              ) : (
                sips.map((sip, idx) => (
                  <tr key={sip.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 12px', fontWeight: '500' }}>{sip.user.fullName}</td>
                    <td style={{ padding: '16px 12px' }}>{sip.startDate}</td>
                    <td style={{ padding: '16px 12px', fontWeight: '600' }}>₹{sip.amount.toLocaleString()}</td>
                    <td style={{ padding: '16px 12px' }}>{sip.duration} months</td>
                    <td style={{ padding: '16px 12px' }}>{sip.user.mobile}</td>
                    <td style={{ padding: '16px 12px' }}>{sip.user.email}</td>
                    <td style={{ padding: '16px 12px', textTransform: 'capitalize' }}>{sip.plan}</td>
                    <td style={{ padding: '16px 12px' }}>{sip.planName}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <StatusBadge status={sip.status} />
                    </td>
                    <td style={{ padding: '16px 12px', fontWeight: '600' }}>{sip.commission}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button style={{ backgroundColor: '#f0f9ff', color: '#0284c7', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }} onClick={() => handleEdit(idx)}>Edit</button>
                        <select style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px', fontSize: '12px' }} value={sip.status} onChange={(e) => handleApiStatusChange(sip.id, e.target.value as Sip['status'])}>
                          <option value="ACTIVE">Active</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        <button style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }} onClick={() => handleDelete(idx)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


const InputField = ({ label, ...props }: any) => (
  <div>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>{label}</label>
    <input style={{ width: '100%', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', outline: 'none' }} {...props} />
  </div>
);

const SelectField = ({ label, options, ...props }: any) => (
  <div>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>{label}</label>
    <select style={{ width: '100%', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', outline: 'none' }} {...props}>
      {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const PhoneField = ({ countryCode, mobile, onChange }: any) => (
  <div>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Mobile Number *</label>
    <div style={{ display: 'flex' }}>
      <select style={{ border: '2px solid #e2e8f0', borderRadius: '8px 0 0 8px', padding: '12px 8px', fontSize: '14px', outline: 'none' }} name="countryCode" value={countryCode} onChange={onChange}>
        <option value="+91">🇮🇳 +91</option> <option value="+1">🇺🇸 +1</option> <option value="+44">🇬🇧 +44</option>
      </select>
      <input style={{ flex: 1, border: '2px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 8px 8px 0', padding: '12px 16px', fontSize: '14px', outline: 'none' }} type="tel" name="mobile" value={mobile} onChange={onChange} required />
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: Sip['status'] }) => {
  const style = {
    ACTIVE: { bg: '#dcfce7', text: '#166534' },
    COMPLETED: { bg: '#dbeafe', text: '#1e40af' },
    CANCELLED: { bg: '#fef2f2', text: '#dc2626' }
  }[status];

  return (
    <span style={{ backgroundColor: style.bg, color: style.text, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
      {status}
    </span>
  );
};