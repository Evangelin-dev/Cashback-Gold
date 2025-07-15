"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { Upload, Trash2, Image, Loader } from 'lucide-react';

// Define the structure of a Flyer
interface FlyerImage {
  id: number;
  url: string;
  name: string;
  uploadDate: string;
  type: string;
}

// Configuration for the scheme cards to be displayed
const PLAN_CONFIG = [
  { title: "Digi Gold SIP Plan", type: "SIP_PLAN" },
  { title: "Gold Plant Scheme", type: "GOLD_PLANT" },
  { title: "Saving Scheme", type: "SAVING_PLAN" },
];

// Reusable FlyerCard component
const FlyerCard: React.FC<{
  title: string;
  type: string;
  flyer: FlyerImage | null;
  isLoading: boolean;
  onUpload: (file: File, type: string) => void;
  onDelete: (flyer: FlyerImage) => void;
}> = ({ title, type, flyer, isLoading, onUpload, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file, type);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border border-gray-200">
      <h3 className="text-lg font-bold text-[#7a1335] mb-4">{title}</h3>
      <div className="w-full h-56 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center text-gray-500">
            <Loader className="animate-spin h-8 w-8" />
            <p className="mt-2 text-sm">Processing...</p>
          </div>
        ) : flyer ? (
          <>
            <img src={flyer.url} alt={flyer.name} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button
                onClick={() => onDelete(flyer)}
                className="bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition"
                aria-label="Delete Flyer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <Image size={48} />
            <p className="mt-2 text-sm">No flyer uploaded</p>
          </div>
        )}
      </div>
      <button
        onClick={triggerFileUpload}
        disabled={isLoading}
        className="w-full mt-4 bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        <Upload size={16} />
        {flyer ? "Replace Flyer" : "Upload Flyer"}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};


const SchemesFlyer = () => {
  // State to hold a map of flyer types to flyer data
  const [flyers, setFlyers] = useState<Record<string, FlyerImage | null>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<FlyerImage | null>(null);
  
  const fetchFlyers = useCallback(async () => {
    setLoadingStates(PLAN_CONFIG.reduce((acc, { type }) => ({ ...acc, [type]: true }), {}));
    try {
      const fetchPromises = PLAN_CONFIG.map(({ type }) =>
        axiosInstance.get(`/api/flyers?type=${type}`)
          .then(res => ({ type, data: res.data[0] || null })) // API returns an array, take the first or null
      );
      
      const results = await Promise.all(fetchPromises);
      
      const flyersData = results.reduce((acc, { type, data }) => {
        acc[type] = data;
        return acc;
      }, {} as Record<string, FlyerImage | null>);

      setFlyers(flyersData);

    } catch (err) {
      console.error("Failed to fetch flyers:", err);
      alert("An error occurred while fetching flyers.");
    } finally {
      setLoadingStates({});
    }
  }, []);

  useEffect(() => {
    fetchFlyers();
  }, [fetchFlyers]);


  const handleUpload = async (file: File, type: string) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));

    // --- This is the key logic: Delete existing flyer before uploading a new one ---
    const existingFlyer = flyers[type];
    if (existingFlyer) {
      try {
        await axiosInstance.delete(`/api/flyers/${existingFlyer.id}`);
      } catch (err) {
        console.error("Failed to delete existing flyer before upload:", err);
        alert("Could not replace the existing flyer. Please try again.");
        setLoadingStates(prev => ({ ...prev, [type]: false }));
        return;
      }
    }
    
    // Proceed with the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await axiosInstance.post('/api/flyers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (err) {
      console.error("Flyer upload failed:", err);
      alert("An error occurred during flyer upload.");
    } finally {
        // Refresh all flyers to get the latest state
        await fetchFlyers();
        setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };


  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    const { type, id } = showDeleteConfirm;
    
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    setShowDeleteConfirm(null);
    
    try {
        await axiosInstance.delete(`/api/flyers/${id}`);
        await fetchFlyers();
    } catch (err) {
        console.error("Failed to delete flyer:", err);
        alert("Error deleting flyer.");
    } finally {
        setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };
  
  const modalRoot = typeof window !== 'undefined' ? document.getElementById('modal-root') : null;

  return (
    <div className="bg-gray-50 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-[#7a1335] mb-6 border-b pb-4">Manage Scheme Flyers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLAN_CONFIG.map(({ title, type }) => (
                <FlyerCard
                    key={type}
                    title={title}
                    type={type}
                    flyer={flyers[type] || null}
                    isLoading={!!loadingStates[type]}
                    onUpload={handleUpload}
                    onDelete={setShowDeleteConfirm}
                />
            ))}
        </div>
        
        {modalRoot && showDeleteConfirm && ReactDOM.createPortal(
            <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center w-full max-w-sm mx-4">
                    <div className="bg-red-100 rounded-full p-3 mb-4">
                        <Trash2 className="text-red-600" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
                    <p className="mb-6 text-gray-600 text-center">Are you sure you want to delete the flyer for <strong>{showDeleteConfirm.type.replace("_", " ")}</strong>?</p>
                    <div className="flex gap-4 w-full">
                        <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">Cancel</button>
                        <button onClick={handleDelete} className="flex-1 px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition">Delete</button>
                    </div>
                </div>
            </div>,
            modalRoot
        )}
    </div>
  );
};

export default SchemesFlyer;