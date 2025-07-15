import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axiosInstance from '../../../utils/axiosInstance'; 


type SchemeStatus = 'ACTIVE' | 'CLOSED';

interface Scheme {
  id: number;
  name: string;
  duration: string;
  minInvest: string;
  status: SchemeStatus;
  description: string;
  keyPoint1: string;
  keyPoint2: string | null;
  keyPoint3: string | null;
}

const emptyScheme: Omit<Scheme, 'id'> = {
  name: "",
  duration: "",
  minInvest: "",
  status: "ACTIVE",
  description: "",
  keyPoint1: "",
  keyPoint2: "",
  keyPoint3: "",
};

const PlantScheme = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [schemesError, setSchemesError] = useState<string | null>(null);

  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [formData, setFormData] = useState(emptyScheme);
  
  const [showError, setShowError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Scheme | null>(null);

  
  const fetchSchemes = useCallback(async () => {
    setLoadingSchemes(true);
    try {
      const response = await axiosInstance.get('/api/gold-plants');
      setSchemes(response.data);
      setSchemesError(null);
    } catch (err) {
      console.error("Failed to fetch schemes:", err);
      setSchemesError("Could not load schemes.");
    } finally {
      setLoadingSchemes(false);
    }
  }, []);

  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  const handleCreateScheme = async () => {
    try {
      await axiosInstance.post('/api/gold-plants', formData);
      alert('Scheme created successfully!');
      fetchSchemes();
      closeModal();
    } catch (err) {
      console.error("Failed to create scheme:", err);
      alert("Error creating scheme.");
    }
  };

   const handleUpdateScheme = async () => {
    // 1. Guard clause: Ensure we are in edit mode. This is correct.
    if (!editingScheme) return;

    // 2. The payload is simply the formData state itself. It already has the correct shape.
    const payload = formData; 
    
    try {
      // 3. Use the 'id' from `editingScheme` for the URL.
      await axiosInstance.put(`/api/gold-plants/${editingScheme.id}`, payload);
      
      alert('Scheme updated successfully!');
      fetchSchemes();
      closeModal();
    } catch (err) {
      console.error("Failed to update scheme:", err);
      alert("Error updating scheme.");
    }
  };

  const handleDeleteScheme = async () => {
    if (!showDeleteConfirm) return;
    try {
      await axiosInstance.delete(`/api/gold-plants/${showDeleteConfirm.id}`);
      alert('Scheme deleted successfully!');
      fetchSchemes();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete scheme:", err);
      alert("Error deleting scheme.");
    }
  };

  const handleStatusChange = async (id: number, newStatus: SchemeStatus) => {
    const originalSchemes = [...schemes];
    const updatedSchemes = schemes.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setSchemes(updatedSchemes);
    try {
      await axiosInstance.patch(`/api/gold-plants/${id}/status?status=${newStatus}`);
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to update status. Reverting change.");
      setSchemes(originalSchemes);
    }
  };

  
  const openAddSchemeModal = () => {
    setEditingScheme(null);
    setFormData(emptyScheme);
    setShowAddSchemeModal(true);
  };

  const openEditSchemeModal = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setFormData(scheme);
    setShowAddSchemeModal(true);
  };
  
  const closeModal = () => {
    setShowAddSchemeModal(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.duration || !formData.minInvest || !formData.description || !formData.keyPoint1) {
      setShowError("Please fill all required fields.");
      return;
    }
    if (editingScheme) handleUpdateScheme();
    else handleCreateScheme();
  };

  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700";
  };
  
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return <div>Error: Modal container not found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h1 className="text-xl sm:text-2xl font-bold text-[#7a1335] mb-6">Gold Plant Schemes</h1>
      {loadingSchemes ? <div className="text-center py-10">Loading schemes...</div> : 
       schemesError ? <div className="text-center py-10 text-red-500">{schemesError}</div> : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-[#7a1335]">Scheme Name</th>
                  <th className="px-4 py-2 text-[#7a1335]">Duration</th>
                  <th className="px-4 py-2 text-[#7a1335]">Min Investment</th>
                  <th className="px-4 py-2 text-[#7a1335]">Status</th>
                  <th className="px-4 py-2 text-[#7a1335]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map(scheme => (
                  <tr key={scheme.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">{scheme.name}</td>
                    <td className="px-4 py-3">{scheme.duration}</td>
                    <td className="px-4 py-3">{scheme.minInvest}</td>
                    <td className="px-4 py-3">
                        <select value={scheme.status} onChange={(e) => handleStatusChange(scheme.id, e.target.value as SchemeStatus)} className={`px-3 py-1.5 rounded-full font-medium cursor-pointer ${getStatusColor(scheme.status)}`}>
                            <option value="ACTIVE">Active</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </td>
                    <td className="px-4 py-3 space-x-3 text-center">
                        <button onClick={() => openEditSchemeModal(scheme)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => setShowDeleteConfirm(scheme)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={openAddSchemeModal} className="mt-6 bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-2 px-6 rounded transition w-full sm:w-auto">Add New Scheme</button>
        </>
      )}
      
      {showAddSchemeModal && ReactDOM.createPortal(
        <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-[#7a1335] mb-4 text-center">{editingScheme ? "Edit Scheme" : "Add New Scheme"}</h2>
                <form onSubmit={handleSubmitScheme} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Scheme Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <input type="text" name="duration" value={formData.duration} onChange={handleFormChange} className="w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Min Investment</label>
                        <input type="text" name="minInvest" value={formData.minInvest} onChange={handleFormChange} className="w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full p-2 border rounded-md" rows={3} required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Key Points</label>
                        <input type="text" name="keyPoint1" value={formData.keyPoint1} onChange={handleFormChange} className="w-full p-2 border rounded-md mb-2" placeholder="Key Point 1 (Required)" required/>
                        <input type="text" name="keyPoint2" value={formData.keyPoint2 || ''} onChange={handleFormChange} className="w-full p-2 border rounded-md mb-2" placeholder="Key Point 2 (Optional)"/>
                        <input type="text" name="keyPoint3" value={formData.keyPoint3 || ''} onChange={handleFormChange} className="w-full p-2 border rounded-md" placeholder="Key Point 3 (Optional)"/>
                    </div>
                    <div className="flex gap-4 justify-center pt-4">
                        <button type="submit" className="px-6 py-2 rounded bg-[#7a1335] text-white font-semibold">{editingScheme ? "Save" : "Add"}</button>
                        <button type="button" onClick={closeModal} className="px-6 py-2 rounded bg-gray-200">Cancel</button>
                    </div>
                </form>
            </div>
        </div>,
        modalRoot
      )}

      {(showError || showDeleteConfirm) && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in w-full max-w-sm">
                {showError ? (
                    <>
                        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                        <p className="mb-4 text-gray-700 text-center">{showError}</p>
                        <button onClick={() => setShowError(null)} className="px-6 py-2 rounded bg-[#7a1335] text-white font-semibold">OK</button>
                    </>
                ) : showDeleteConfirm ? (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-600 text-center">Are you sure you want to delete "{showDeleteConfirm.name}"?</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 rounded bg-gray-200">Cancel</button>
                            <button onClick={handleDeleteScheme} className="px-6 py-2 rounded bg-red-600 text-white font-semibold">Delete</button>
                        </div>
                    </>
                ) : null}
            </div>
        </div>,
        modalRoot
      )}
    </div>
  );
};

export default PlantScheme;