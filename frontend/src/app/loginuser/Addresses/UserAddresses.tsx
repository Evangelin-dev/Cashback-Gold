import { Home, Loader2, Plus, Trash2, Edit, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import Portal from '../../user/Portal';

interface Address {
  id: number;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  mobile: string;
}

type AddressFormData = Omit<Address, 'id'>;

const emptyFormState: AddressFormData = {
  fullName: '',
  mobile: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};

const UserAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get<Address[]>('/user/addresses');
      setAddresses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setError("Could not load your addresses. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData(emptyFormState);
    setIsFormVisible(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);

    setFormData({
      fullName: address.fullName,
      mobile: address.mobile,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
    });
    setIsFormVisible(true);
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;

    try {
        await axiosInstance.delete(`/user/addresses/${showDeleteConfirm.id}`);
        setAddresses(addresses.filter(addr => addr.id !== showDeleteConfirm.id));
    } catch (err) {
        console.error("Failed to delete address:", err);
        alert("Failed to delete address. Please try again.");
    } finally {
        setShowDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingAddress) {
    
        await axiosInstance.put(`/user/addresses/${editingAddress.id}`, formData);
      } else {
    
        await axiosInstance.post('/user/addresses', formData);
      }
      setIsFormVisible(false);
      fetchAddresses(); 
    } catch (err: any) {
      const apiError = err.response?.data?.message || (editingAddress ? "Failed to update address." : "Failed to add address.");
      setError(apiError);
      alert(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-[#7a1436]">My Addresses</h1>
          <button onClick={handleAddNew} className="flex items-center gap-2 rounded-lg bg-[#7a1436] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#7a1436]" />
            <p className="mt-2 text-gray-500">Loading your addresses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-10">
            <Home className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">You haven't saved any addresses yet.</p>
            <p className="text-sm text-gray-400">Add an address to make your checkout faster.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(address => (
              <div key={address.id} className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => handleEdit(address)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(address)} className="p-2 rounded-full hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {/* UPDATED to display 'fullName' */}
                <p className="font-bold text-gray-800 pr-20">{address.fullName}</p>
                <p className="text-sm text-gray-600">{address.addressLine1}, {address.addressLine2}</p>
                <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.postalCode}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">Mobile: {address.mobile}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormVisible && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{editingAddress ? 'Edit Address' : 'Add a New Address'}</h2>
              <button onClick={() => setIsFormVisible(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UPDATED input 'name' to 'fullName' */}
                <input name="fullName" value={formData.fullName} onChange={handleFormChange} placeholder="Full Name" required className="p-2 border rounded-md sm:col-span-2" />
                <input name="mobile" value={formData.mobile} onChange={handleFormChange} placeholder="Mobile Number" required className="p-2 border rounded-md" />
                <input name="postalCode" value={formData.postalCode} onChange={handleFormChange} placeholder="Postal Code" required className="p-2 border rounded-md" />
                <input name="addressLine1" value={formData.addressLine1} onChange={handleFormChange} placeholder="Address Line 1 (House No, Building)" required className="sm:col-span-2 p-2 border rounded-md" />
                <input name="addressLine2" value={formData.addressLine2} onChange={handleFormChange} placeholder="Address Line 2 (Street, Area)" className="sm:col-span-2 p-2 border rounded-md" />
                <input name="city" value={formData.city} onChange={handleFormChange} placeholder="City" required className="p-2 border rounded-md" />
                <input name="state" value={formData.state} onChange={handleFormChange} placeholder="State" required className="p-2 border rounded-md" />
                <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                   <button type="button" onClick={() => setIsFormVisible(false)} disabled={isSubmitting} className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-300">Cancel</button>
                   <button type="submit" disabled={isSubmitting} className="flex items-center justify-center rounded-lg bg-[#7a1436] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#5a0f28] disabled:bg-gray-400">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Address'}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {showDeleteConfirm && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="m-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
              <h3 className="text-xl font-bold text-gray-800">Delete Address?</h3>
              <p className="mt-2 text-gray-600">Are you sure you want to permanently delete this address?</p>
              <div className="mt-6 flex justify-center gap-4">
                <button onClick={() => setShowDeleteConfirm(null)} className="rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-800 transition-colors hover:bg-gray-300">Cancel</button>
                <button onClick={handleDelete} className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700">Confirm</button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default UserAddresses;