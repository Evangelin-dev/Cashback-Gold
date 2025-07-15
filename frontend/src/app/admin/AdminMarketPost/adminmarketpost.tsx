import { Download, Edit2, Eye, FileText, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

type Resource = {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  downloadCount: number;
  fileUrl: string;
};

const MarketingResourcesUpload = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [newResource, setNewResource] = useState<{
    title: string;
    description: string;
    file: File | null;
    status: 'ACTIVE' | 'INACTIVE';
  }>({
    title: '',
    description: '',
    file: null,
    status: 'ACTIVE',
  });


  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/marketing-resources');
      setResources(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError("Could not load resources. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const paginatedResources = resources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewResource({ ...newResource, file: e.dataTransfer.files[0] });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource({ ...newResource, file: e.target.files[0] });
    }
  };


  const resetUploadForm = () => {
    setNewResource({ title: '', description: '', file: null, status: 'ACTIVE' });
    setShowUploadModal(false);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }


  const handleUpload = async () => {
    if (!newResource.title || !newResource.description || !newResource.file) {
      alert('Please fill in all fields and select a file');
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    
    formData.append('file', newResource.file);

    const jsonData = {
      title: newResource.title,
      description: newResource.description,
      status: newResource.status
    };
    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    try {
      await axiosInstance.post('/admin/marketing-resources', formData);
      
      resetUploadForm();
      fetchResources();
    } catch (err: any) {
      console.error("Upload failed:", err);
      const errorMessage = err.response?.data?.message || "An error occurred during upload.";
      alert(`Upload Failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };


  const handleSaveEdit = async () => {
    if (!editingResource) return;

    const payload = {
      title: editingResource.title,
      description: editingResource.description,
      status: editingResource.status,
    };

    try {
      await axiosInstance.put(`/admin/marketing-resources/${editingResource.id}`, payload);
      setEditingResource(null);
      fetchResources();
    } catch (err) {
      console.error("Update failed:", err);
      alert("An error occurred while updating. Please try again.");
    }
  };


  const handleDelete = async () => {
    if (!resourceToDelete) return;

    try {
      await axiosInstance.delete(`/admin/marketing-resources/${resourceToDelete.id}`);
      setShowDeleteConfirm(false);
      setResourceToDelete(null);
      fetchResources();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("An error occurred while deleting. Please try again.");
    }
  };

  const openDeleteConfirm = (resource: Resource) => {
    setResourceToDelete(resource);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketing Resources</h1>
              <p className="text-gray-600 mt-2">Upload and manage marketing resources</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#7a1436] text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus size={20} />
              <span className='font-bold'>Upload New Resource</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg"><FileText className="text-blue-600" size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Resources</p>
                <p className="text-2xl font-bold text-green-600">{resources.filter(r => r.status === 'ACTIVE').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg"><Eye className="text-green-600" size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-600">{resources.reduce((acc, r) => acc + r.downloadCount, 0)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg"><Download className="text-purple-600" size={24} /></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Current Resources</h2>
          </div>
          {loading && <div className="p-4 text-center">Loading...</div>}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedResources.reverse().map((resource) => (
                      <tr key={resource.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{resource.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-[150px] truncate">
                            {resource.fileName.length > 15
                              ? `${resource.fileName.slice(0, 12)}...`
                              : resource.fileName}
                          </div>                            <div className="text-sm text-gray-500">{resource.fileType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(resource.uploadDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.downloadCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${resource.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {resource.status.charAt(0) + resource.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"><Download size={16} /></a>
                            <button onClick={() => setEditingResource(resource)} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => openDeleteConfirm(resource)} className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedResources.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-500">No resources found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-4">
                  <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
                  <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                  <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
              )}
            </>
          )}
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 top-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload New Resource</h2>
                <button onClick={resetUploadForm}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter resource title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} rows={3} placeholder="Enter resource description" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">{newResource.file ? newResource.file.name : 'Drag and drop a file or click to browse'}</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} id="file-upload" className="hidden" />
                    <label htmlFor="file-upload" className="mt-2 inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-md cursor-pointer hover:bg-purple-200">Browse Files</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button onClick={resetUploadForm} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button onClick={handleUpload} disabled={isUploading} className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:opacity-50">{isUploading ? 'Uploading...' : 'Upload'}</button>
              </div>
            </div>
          </div>
        )}

        {editingResource && (
          <div className="fixed inset-0 top-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Resource</h2>
                <button onClick={() => setEditingResource(null)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={editingResource.title} onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={editingResource.description} onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editingResource.status} onChange={(e) => setEditingResource({ ...editingResource, status: e.target.value as 'ACTIVE' | 'INACTIVE' })} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button onClick={() => setEditingResource(null)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-purple-600 text-white rounded-md">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 top-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete the resource "{resourceToDelete?.title}"?</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-md">Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MarketingResourcesUpload;