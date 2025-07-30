import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/axiosInstance'; // Adjust path as needed
import { Loader2 } from 'lucide-react';

// --- Type Definitions to match your API response ---

type PayoutStatus = 'Pending' | 'Paid' | 'Rejected';

interface PayoutRequestData {
  id: number;
  partnerId: number;
  partnerName: string;
  partnerRole: string;
  amount: number;
  method: string;
  methodDetail: string;
  status: PayoutStatus;
  requestedAt: string;
}

interface PaginatedPayoutResponse {
  content: PayoutRequestData[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

const PayoutRequest = () => {
  // --- STATE MANAGEMENT ---
  const [requests, setRequests] = useState<PayoutRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null); // To show spinner on status change

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // You can adjust this value

  // --- DATA FETCHING ---
  const fetchPayouts = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<PaginatedPayoutResponse>('/admin/commissions/payouts', {
        params: {
          page: page - 1, // API is 0-indexed, UI is 1-indexed
          size: itemsPerPage,
        },
      });
      setRequests(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch payout requests:", err);
      setError("Could not load payout requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchPayouts(currentPage);
  }, [currentPage, fetchPayouts]);

  // --- HANDLER FUNCTIONS ---
  const handleStatusChange = async (id: number, newStatus: PayoutStatus) => {
    const currentRequest = requests.find(r => r.id === id);
    if (currentRequest?.status === newStatus) return;

    setIsUpdating(id);
    try {
      // The API only accepts 'Paid' or 'Rejected' as updatable statuses
      await axiosInstance.put(`/admin/commissions/payouts/${id}/status`, null, {
        params: { status: newStatus },
      });
      // Update the status locally for immediate UI feedback
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("There was an error updating the status.");
      // Optional: Re-fetch data to revert optimistic update on failure
      fetchPayouts(currentPage);
    } finally {
      setIsUpdating(null);
    }
  };

  // --- UI HELPER FUNCTIONS ---
  const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'UPI': return 'bg-orange-100 text-orange-800';
      case 'Bank': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // --- RENDER LOGIC ---
  if (loading && requests.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Loader2 className="h-12 w-12 animate-spin text-purple-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 text-center text-red-600">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payout Request Management</h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-[15%]">Partner</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-[15%]">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-[15%]">Request Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-[15%]">Withdraw Method</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-[25%]">Details</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{request.partnerName}</td>
                  <td className="py-4 px-6 text-gray-700 font-semibold">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(request.amount)}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {new Date(request.requestedAt).toLocaleString('en-GB')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(request.method)}`}>
                      {request.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 break-words">
                    {request.methodDetail}
                  </td>
                  <td className="py-4 px-6">
                    {isUpdating === request.id ? (
                      <div className="flex">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                      </div>
                    ) : (
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value as PayoutStatus)}
                        className={`w-full max-w-[120px] px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(request.status)}`}
                      >
                        {/* 
                          UPDATED LOGIC: 
                          - The "Pending" option is visible if it's the current status, but it is disabled and cannot be selected.
                          - "Paid" and "Rejected" are always available as the actionable options.
                        */}
                        <option value="Pending" disabled>{request.status === 'Pending' ? 'Pending' : '---'}</option>
                        <option value="Paid">Paid</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No payout requests found for this page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-white text-gray-700 shadow-sm border border-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="px-3 py-1 rounded bg-white text-gray-700 shadow-sm border border-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutRequest;