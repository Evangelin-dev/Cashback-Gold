import { Trash2, UserPlus, Loader2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";

interface Nominee {
  id: number;
  fullName: string;
  relationship: string;
  dob: string;
  gender: string;
}

type NewNominee = Omit<Nominee, 'id'>;

const genderOptions = ["Male", "Female", "Other"];
const initialFormState: NewNominee = {
  fullName: "",
  relationship: "",
  dob: "",
  gender: "",
};

const LNominees = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [form, setForm] = useState<NewNominee>(initialFormState);
  
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

 
  const fetchNominees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<Nominee[]>('/user/nominees');
      setNominees(response.data);
    } catch (err) {
      setError("Failed to load nominees. Please refresh the page.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNominees();
  }, [fetchNominees]);

  const handleDeleteNominee = async (nomineeId: number) => {
    setDeletingId(nomineeId);
    try {
      await axiosInstance.delete(`/user/nominees/${nomineeId}`);
     
      fetchNominees(); 
    } catch (err) {
      setError("Failed to delete nominee.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.relationship || !form.dob || !form.gender) {
      setError("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await axiosInstance.post('/user/nominees', form);
     
      setForm(initialFormState);
      setShowForm(false);
      fetchNominees();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add nominee.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6a0822] rounded-full mb-3">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Nominee Management</h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">Add, view, and manage your nominees in one secure place.</p>
        </div>

        {!showForm && (
            <div className="flex justify-center mb-6">
                <button
                    className="px-5 py-2.5 bg-[#6a0822] text-white rounded-lg hover:bg-[#4a0617] transition-all duration-200 font-semibold text-base shadow-lg flex items-center gap-2"
                    onClick={() => { setShowForm(true); setError(null); }}
                >
                    <UserPlus className="w-5 h-5" />
                    Add New Nominee
                </button>
            </div>
        )}

        {showForm && (
          <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Add New Nominee</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter full name" />
                <InputField label="Relationship" name="relationship" value={form.relationship} onChange={handleChange} placeholder="e.g., Spouse, Child" />
                <InputField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <div className="flex gap-2 flex-wrap">
                    {genderOptions.map((g) => (
                      <button type="button" key={g}
                        className={`px-4 py-2 rounded-md border font-medium transition-all duration-200 text-sm ${form.gender === g ? "bg-[#6a0822] text-white border-[#6a0822]" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                        onClick={() => setForm({ ...form, gender: g })}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={isSubmitting} className="w-32 px-5 py-2 bg-[#6a0822] text-white rounded-lg hover:bg-[#4a0617] font-semibold text-sm shadow disabled:bg-gray-400 flex items-center justify-center">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Add Nominee"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Your Nominees</h2>
          {isLoading ? (
            <div className="text-center py-8"><Loader2 className="w-8 h-8 mx-auto animate-spin text-[#6a0822]" /></div>
          ) : nominees.length === 0 ? (
            <div className="text-center py-10">
              <UserPlus className="w-10 h-10 text-gray-300 mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-700">No Nominees Found</h3>
              <p className="text-gray-500 text-sm">Click "Add New Nominee" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...nominees].reverse().map((nominee) => (
                <div key={nominee.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 group">
                  <div className="flex items-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                      <DetailItem label="Name" value={nominee.fullName} />
                      <DetailItem label="Relation" value={nominee.relationship} />
                      <DetailItem label="Date of Birth" value={nominee.dob} />
                      <DetailItem label="Gender" value={nominee.gender} />
                    </div>
                    <button onClick={() => handleDeleteNominee(nominee.id)} disabled={deletingId === nominee.id} className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-100" title="Delete Nominee">
                      {deletingId === nominee.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; }> = 
({ label, name, value, onChange, type = "text", placeholder }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
        <input name={name} type={type} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#6a0822] focus:ring-1 focus:ring-[#6a0822] transition-all duration-200 text-sm" placeholder={placeholder} required />
    </div>
);

const DetailItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
);

export default LNominees;