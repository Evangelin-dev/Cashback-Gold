"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axiosInstance from '../../../utils/axiosInstance';

interface FlyerImage {
  id: number;
  url: string;
  name: string;
  uploadDate: string;
  type: string;
}

const PLAN_TYPES = ["GOLD_PLANT", "SIP_PLAN", "SAVING_PLAN"];

const SchemesFlyer = () => {
  const [flyerImages, setFlyerImages] = useState<FlyerImage[]>([]);
  const [loadingFlyers, setLoadingFlyers] = useState(true);
  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<FlyerImage | null>(null);
  

  const [selectedPlanType, setSelectedPlanType] = useState(PLAN_TYPES[0]);


  const fetchFlyers = useCallback(async () => {
    setLoadingFlyers(true);
    try {
    
      const response = await axiosInstance.get('/api/flyers'); 
      setFlyerImages(response.data);
    } catch (err) {
      console.error("Failed to fetch flyers:", err);
    } finally {
      setLoadingFlyers(false);
    }
  }, []);

  useEffect(() => {
    fetchFlyers();
  }, [fetchFlyers]);


  const handleFlyerUpload = async (files: FileList) => {
    if (files.length === 0) return;

    const uploadPromises = Array.from(files).map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', selectedPlanType);

      return axiosInstance.post('/api/flyers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    });

    try {
      await Promise.all(uploadPromises);
      alert('Flyer(s) uploaded successfully!');
      fetchFlyers();
    } catch (err) {
      console.error("Flyer upload failed:", err);
      alert("An error occurred during flyer upload.");
    }
  };


  const handleDeleteFlyer = async () => {
    if (!showDeleteConfirm) return;
    try {
        await axiosInstance.delete(`/api/flyers/${showDeleteConfirm.id}`);
        alert("Flyer deleted successfully!");
        fetchFlyers();
        setShowDeleteConfirm(null);
    } catch (err) {
        console.error("Failed to delete flyer:", err);
        alert("Error deleting flyer.");
    }
  };
  
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return <div>Error: Modal container not found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#7a1335]">Schemes Flyer</h2>
        <button
          onClick={() => setShowFlyerModal(true)}
          className="bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-2 px-4 rounded transition text-sm sm:text-base"
        >Upload Flyer</button>
      </div>
      {loadingFlyers ? <div className="text-center py-10">Loading flyers...</div> : 
       flyerImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {flyerImages.map(image => (
            <div key={image.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img src={image.url} alt={image.name} className="w-full h-full object-cover"/>
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                <button onClick={() => setShowDeleteConfirm(image)} className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg shadow-md hover:bg-red-600 transition-colors">×</button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs truncate">{image.name}</p>
                <p className="text-white/80 text-xs">{new Date(image.uploadDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">🖼️</div>
          <p className="text-gray-500 text-lg">No flyer images uploaded yet</p>
        </div>
      )}

      {showFlyerModal && ReactDOM.createPortal(
        <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-[#7a1335] mb-4 text-center">Upload Scheme Flyer</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan Type</label>
                    <select
                        value={selectedPlanType}
                        onChange={(e) => setSelectedPlanType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                        {PLAN_TYPES.map(type => (
                            <option key={type} value={type}>{type.replace("_", " ")}</option>
                        ))}
                    </select>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#7a1335] transition-colors relative">
                    <div className="text-4xl text-gray-400 mb-4">📁</div>
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <input type="file" accept="image/*" multiple onChange={(e) => handleFlyerUpload(e.target.files!)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                </div>
            </div>
            <div className="text-center mt-6">
              <button onClick={() => setShowFlyerModal(false)} className="px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Close</button>
            </div>
          </div>
        </div>,
        modalRoot
      )}

      {showDeleteConfirm && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in w-full max-w-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
                <p className="mb-6 text-gray-600 text-center">Are you sure you want to delete "{showDeleteConfirm.name}"?</p>
                <div className="flex gap-4">
                    <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 rounded bg-gray-200">Cancel</button>
                    <button onClick={handleDeleteFlyer} className="px-6 py-2 rounded bg-red-600 text-white font-semibold">Delete</button>
                </div>
            </div>
        </div>,
        modalRoot
      )}
    </div>
  );
};

export default SchemesFlyer;