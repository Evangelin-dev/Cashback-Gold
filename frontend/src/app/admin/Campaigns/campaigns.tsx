import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

type Campaign = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  multiplier: string;
  status: string;
};

const formatStatusForDisplay = (status: string) => {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    multiplier: '',
    status: 'ACTIVE'
  });

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admin/campaigns');
      const formattedData = response.data.map((campaign: any) => ({
        ...campaign,
        status: formatStatusForDisplay(campaign.status),
      }));
      setCampaigns(formattedData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setError('Could not load campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  const paginatedCampaigns = campaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editingCampaign) {
        await axiosInstance.put(`/api/admin/campaigns/${editingCampaign.id}`, formData);
      } else {
        await axiosInstance.post('/api/admin/campaigns', formData);
      }
      resetForm();
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to save campaign:', err);
      alert('An error occurred while saving the campaign.');
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      multiplier: campaign.multiplier,
      status: campaign.status.toUpperCase()
    });
    setShowModal(true);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await axiosInstance.delete(`/api/admin/campaigns/${campaignToDelete.id}`);
      setShowDeleteConfirm(false);
      setCampaignToDelete(null);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      alert('An error occurred while deleting the campaign.');
    }
  };


  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      multiplier: '',
      status: 'ACTIVE'
    });
    setEditingCampaign(null);
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
              <p className="text-gray-600 mt-1">Manage active campaigns and bonuses</p>
            </div>
            <button
              onClick={() => { setEditingCampaign(null); setShowModal(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Campaign
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading && <p className="p-4 text-center">Loading campaigns...</p>}
            {error && <p className="p-4 text-center text-red-500">{error}</p>}
            {!loading && !error && (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Multiplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{campaign.name}</div></td>
                        <td className="px-6 py-4"><div className="text-sm text-gray-900 max-w-xs truncate">{campaign.description}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{campaign.startDate}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{campaign.endDate}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{campaign.multiplier}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>{campaign.status}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(campaign)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteClick(campaign)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedCampaigns.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-500">No campaigns found.</td></tr>
                    )}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 py-4">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 top-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="multiplier" className="block text-sm font-medium text-gray-700 mb-1">Multiplier</label>
                    <input type="text" id="multiplier" name="multiplier" value={formData.multiplier} onChange={handleInputChange} required placeholder="e.g., 2x, 1.5x" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SCHEDULED">Scheduled</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">{editingCampaign ? 'Update Campaign' : 'Add Campaign'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 top-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete the "{campaignToDelete?.name}" campaign? This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCampaigns;