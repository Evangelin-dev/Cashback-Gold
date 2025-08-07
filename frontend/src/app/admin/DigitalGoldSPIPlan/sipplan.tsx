import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom'; // 1. Import ReactDOM for portals
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct

// 2. Updated type to match the API response structure
interface SPIPlan {
  id: number;
  name: string;
  duration: string;
  minInvest: string;
  description: string;
  status: 'ACTIVE' | 'CLOSED';
  keyPoint1: string;
  keyPoint2: string | null;
  keyPoint3: string | null;
}

// 3. Updated empty plan object to match the new type
const emptyPlan: Omit<SPIPlan, 'id'> = {
  name: "",
  duration: "",
  minInvest: "",
  description: "",
  status: "ACTIVE",
  keyPoint1: "",
  keyPoint2: "",
  keyPoint3: "",
};

const SIPPlan = () => {
  const [spiPlans, setSPIPlans] = useState<SPIPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SPIPlan | null>(null);
  const [formData, setFormData] = useState(emptyPlan);

  const [showError, setShowError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SPIPlan | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(spiPlans.length / itemsPerPage);
  const paginatedPlans = spiPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- API Functions ---
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/cashback-gold-schemes');
      setSPIPlans(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch SIP plans:", err);
      setError("Could not load SIP plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleCreatePlan = async (planData: Omit<SPIPlan, 'id'>) => {
    try {
      await axiosInstance.post('/api/cashback-gold-schemes', planData);
      alert('Plan created successfully!');
      fetchPlans();
      closeModal();
    } catch (err) {
      console.error("Failed to create plan:", err);
      alert("An error occurred while creating the plan.");
    }
  };

  const handleUpdatePlan = async (planData: SPIPlan) => {
    const { id, ...payload } = planData;
    try {
      await axiosInstance.put(`/api/cashback-gold-schemes/${id}`, payload);
      alert('Plan updated successfully!');
      fetchPlans();
      closeModal();
    } catch (err) {
      console.error("Failed to update plan:", err);
      alert("An error occurred while updating the plan.");
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'ACTIVE' | 'CLOSED') => {
    const originalPlans = [...spiPlans];

    const updatedPlans = spiPlans.map(plan =>
      plan.id === id ? { ...plan, status: newStatus } : plan
    );
    setSPIPlans(updatedPlans);

    try {
      await axiosInstance.patch(`/api/cashback-gold-schemes/${id}/status?status=${newStatus}`);
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to update status. Reverting change.");
      setSPIPlans(originalPlans);
    }
  };

  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      await axiosInstance.delete(`/api/cashback-gold-schemes/${planToDelete.id}`);
      alert("Plan deleted successfully!");
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
      fetchPlans();
    } catch (err) {
      console.error("Failed to delete plan:", err);
      alert("An error occurred while deleting the plan.");
    }
  };

  // --- Form and Modal Logic ---
  const openAddModal = () => {
    setEditingPlan(null);
    setFormData(emptyPlan);
    setShowAddModal(true);
  };

  const openEditModal = (plan: SPIPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingPlan(null);
    setFormData(emptyPlan);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.duration || !formData.minInvest || !formData.description || !formData.keyPoint1) {
      setShowError(true);
      return;
    }

    if (editingPlan) {
      handleUpdatePlan({ ...formData, id: editingPlan.id });
    } else {
      handleCreatePlan(formData);
    }
  };

  const openDeleteConfirm = (plan: SPIPlan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirm(true);
  };

  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700";
  };

  // Get the portal root element, ensuring it exists.
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    return <div>Error: Modal container not found. Check public/index.html</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-white p-2 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg p-4 mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-[#7a1335] mb-4 sm:mb-6">Cashback Gold Plans</h1>
        {loading && <div className="text-center py-4">Loading plans...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-[#7a1335]">Plan Name</th>
                    <th className="px-2 sm:px-4 py-2 text-[#7a1335]">duration</th>
                    <th className="px-2 sm:px-4 py-2 text-[#7a1335]">Monthly Amount</th>
                    <th className="px-2 sm:px-4 py-2 text-[#7a1335]">Description</th>
                    <th className="px-2 sm:px-4 py-2 text-[#7a1335]">Status</th>
                    <th className="px-2 sm:px-4 py-2 text-[#7a1335]">Key Points</th>
                    <th className="px-2 sm:px-4 py-2 text-[#7a1335]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPlans.map((plan) => (
                    <tr key={plan.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 align-top">{plan.name}</td>
                      <td className="px-4 py-3 align-top">{plan.duration}</td>
                      <td className="px-4 py-3 align-top">{plan.minInvest}</td>
                      <td className="px-4 py-3 text-gray-600 align-top"><div
                        className="text-sm text-gray-900 max-w-[150px] truncate"
                        title={plan.description}
                      >
                        {plan.description.length > 12
                          ? `${plan.description.slice(0, 7)}...`
                          : plan.description}
                      </div></td>
                      <td className="px-4 py-3 align-top">
                        <select
                          value={plan.status}
                          onChange={e => handleStatusChange(plan.id, e.target.value as 'ACTIVE' | 'CLOSED')}
                          className={`block w-full px-3 py-2 rounded-full font-medium border-0 focus:ring-2 focus:ring-purple-500 transition cursor-pointer ${getStatusColor(plan.status)}`}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600 align-top">
                        <ul className="list-disc pl-4 space-y-1">
                          {plan.keyPoint1 && <li>{plan.keyPoint1}</li>}
                          {plan.keyPoint2 && <li>{plan.keyPoint2}</li>}
                          {plan.keyPoint3 && <li>{plan.keyPoint3}</li>}
                        </ul>
                      </td>
                      <td className="px-4 py-3 align-top text-center space-x-2">
                        <button onClick={() => openEditModal(plan)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => openDeleteConfirm(plan)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
                <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
        <button
          className="mt-4 sm:mt-6 bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-2 px-6 rounded transition w-full sm:w-auto"
          onClick={openAddModal}
        >Add New Cashback Gold</button>

        {/* 4. Render all modals into the #modal-root div using portals */}
        {showAddModal && ReactDOM.createPortal(
          <div className="fixed inset-0 overflow-y-auto h-full top-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-5">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-lg font-bold  text-[#7a1335] text-center">
                {editingPlan ? "Edit Cashback Gold Plan" : "Add New Cashback Gold Plan"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1 font-medium text-gray-700">Plan Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-gray-700">duration</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-gray-700">Monthly Amount</label>
                  <input type="text" name="minInvest" value={formData.minInvest} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" rows={2} required />
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-gray-700">Key Points</label>
                  <input type="text" name="keyPoint1" value={formData.keyPoint1} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md mb-2" placeholder="Key Point 1 (Required)" required />
                  <input type="text" name="keyPoint2" value={formData.keyPoint2 || ''} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md mb-2" placeholder="Key Point 2 (Optional)" />
                  <input type="text" name="keyPoint3" value={formData.keyPoint3 || ''} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Key Point 3 (Optional)" />
                </div>
                <div className="flex gap-4 justify-center pt-4">
                  <button type="submit" className="py-2 px-6 rounded bg-[#7a1335] text-white font-semibold transition-transform hover:scale-105">
                    {editingPlan ? "Save Changes" : "Add Plan"}
                  </button>
                  <button type="button" onClick={closeModal} className="py-2 px-6 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          modalRoot
        )}
        {showError && ReactDOM.createPortal(
          <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
              <div className="mb-4 text-gray-700 text-center">Please fill all required fields.</div>
              <button
                className="px-6 py-2 rounded bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold shadow transition"
                onClick={() => setShowError(false)}
              >OK</button>
            </div>
          </div>,
          modalRoot
        )}
        {showDeleteConfirm && ReactDOM.createPortal(
          <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete the plan "{planToDelete?.name}"?</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-md">Delete</button>
              </div>
            </div>
          </div>,
          modalRoot
        )}
      </div>
    </div>
  );
};

export default SIPPlan;