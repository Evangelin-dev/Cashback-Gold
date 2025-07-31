import { Trash2, UserPlus } from "lucide-react";
import React, { useState } from "react";

interface Nominee {
  name: string;
  relation: string;
  dob: string;
  gender: string;
}

const genderOptions = ["Male", "Female", "Other"];

const LNomineeies = () => {
  const [Nomineeies, setNomineeies] = useState<Nominee[]>([]);
  const [form, setForm] = useState<Nominee>({
    name: "",
    relation: "",
    dob: "",
    gender: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleGenderSelect = (gender: string) => {
    setForm({ ...form, gender });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.relation || !form.dob || !form.gender) {
      setError("All fields are required.");
      return;
    }
    setNomineeies([...Nomineeies, form]);
    setForm({ name: "", relation: "", dob: "", gender: "" });
    setShowForm(false);
    setError(null);
  };

  const deleteNominee = (index: number) => {
    setNomineeies(Nomineeies.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[#6a0822] rounded-full mb-2">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">Nominee Management</h1>
          <p className="text-xs text-gray-600 max-w-xl mx-auto">Manage and organize your Nominees with ease. Add new Nominees and keep track of their information in one secure place.</p>
        </div>

        {/* Add Nominee Button */}
        <div className="flex justify-center mb-4">
          <button
            className="px-5 py-2 bg-[#6a0822] text-white rounded-xl hover:bg-[#4a0617] transition-all duration-200 font-semibold text-base shadow flex items-center gap-2"
            onClick={() => setShowForm(!showForm)} 
          >
            <span className="text-xl">{showForm ? "✕" : <UserPlus className="w-5 h-5" />}</span>
            {showForm ? "Cancel" : "Add New Nominee"}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-4">
            <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-[#6a0822]" />
                <h2 className="text-lg font-bold text-gray-800">Add New Nominee</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:border-[#6a0822] focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400 text-sm"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  {/* Relation Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="relation"
                      type="text"
                      value={form.relation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:border-[#6a0822] focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400 text-sm"
                      placeholder="e.g., Spouse, Child, Parent"
                      required
                    />
                  </div>

                  {/* Date of Birth Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="dob"
                      type="date"
                      value={form.dob}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:border-[#6a0822] focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 text-sm"
                      required
                    />
                  </div>

                  {/* Gender Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {genderOptions.map((g) => (
                        <button
                          type="button"
                          key={g}
                          className={`px-4 py-2 rounded border font-medium transition-all duration-200 text-xs ${
                            form.gender === g
                              ? "bg-[#6a0822] text-white border-[#6a0822] shadow"
                              : "bg-white text-gray-700 border-gray-200 hover:border-[#6a0822] hover:text-[#6a0822]"
                          }`}
                          onClick={() => handleGenderSelect(g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-red-600 font-medium text-xs">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-[#6a0822] text-white rounded hover:bg-[#4a0617] transition-all duration-200 font-semibold text-sm shadow"
                  >
                    Add Nominee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nomineeies List Section */}
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-[#6a0822]" />
            <h2 className="text-lg font-bold text-gray-800">Your Nominees</h2>
            {Nomineeies.length > 0 && (
              <span className="ml-auto bg-[#6a0822] text-white px-3 py-1 rounded-full text-xs font-semibold">
                {Nomineeies.length} {Nomineeies.length === 1 ? 'Nominee' : 'Nominees'}
              </span>
            )}
          </div>

          {Nomineeies.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-8 h-8 text-gray-300 mb-2 mx-auto" />
              <h3 className="text-base font-semibold text-gray-600 mb-1">No Nominees yet</h3>
              <p className="text-gray-500 text-xs">Click "Add New Nominee" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {Nomineeies.map((Nominee, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</p>
                        <p className="text-base font-bold text-gray-800">{Nominee.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Relation</p>
                        <p className="text-base font-semibold text-gray-700">{Nominee.relation}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</p>
                        <p className="text-base font-semibold text-gray-700">{Nominee.dob}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</p>
                        <p className="text-base font-semibold text-gray-700">{Nominee.gender}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNominee(index)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Delete Nominee"
                    >
                      <Trash2 className="w-5 h-5" />
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

export default LNomineeies;