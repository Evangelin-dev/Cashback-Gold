import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { Loader2 } from 'lucide-react';


type CommissionStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';

interface CommissionData {
  id: number;
  partnerId: number;
  userId: number;
  orderType: string;
  orderAmount: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: string;
}

interface PaginatedCommissionResponse {
  content: CommissionData[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

const Commission = () => {

  const [commissions, setCommissions] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;


  const fetchCommissions = useCallback(async (page: number, type: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: (page - 1).toString(),
        size: itemsPerPage.toString(),
      });
    
      if (type !== 'all') {
        params.append('type', type);
      }
      
      const response = await axiosInstance.get<PaginatedCommissionResponse>('/admin/commissions', { params });
      setCommissions(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);

    } catch (err) {
      console.error("Failed to fetch commissions:", err);
      setError("Could not load commission data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);


  useEffect(() => {
    fetchCommissions(currentPage, filter);
  }, [currentPage, filter, fetchCommissions]);
  

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);
  

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case 'Approved':
      case 'Paid':
        return "bg-green-100 text-green-700";
      case 'Rejected':
        return "bg-red-100 text-red-700";
      case 'Pending':
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };


  if (loading && commissions.length === 0) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3]">
            <Loader2 className="h-12 w-12 animate-spin text-[#7a1335]" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3] p-6 text-center text-red-600">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-[#7a1335] mb-6">Commission Summary</h1>
          {/* Filter */}
          <div className="mb-4 flex gap-3 items-center">
            <label className="font-semibold text-[#7a1335]">Filter by Type:</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 border rounded bg-white text-gray-700 focus:ring-2 focus:ring-[#7a1335] focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="partner">Partner</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-[#7a1335] font-semibold">Partner ID</th>
                  <th className="text-left py-3 px-4 text-[#7a1335] font-semibold">User ID</th>
                  <th className="text-left py-3 px-4 text-[#7a1335] font-semibold">Order Type</th>
                  <th className="text-left py-3 px-4 text-[#7a1335] font-semibold">Order Amount</th>
                  <th className="text-left py-3 px-4 text-[#7a1335] font-semibold">Commission</th>
                  <th className="text-left py-3 px-4 text-[#7a1335] font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-[#7a1335] font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-800 font-medium">#{commission.partnerId}</td>
                    <td className="py-4 px-4 text-gray-800">#{commission.userId}</td>
                    <td className="py-4 px-4 text-gray-800">{commission.orderType}</td>
                    <td className="py-4 px-4 text-gray-800">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(commission.orderAmount)}
                    </td>
                    <td className="py-4 px-4 text-green-600 font-semibold">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(commission.commissionAmount)}
                    </td>
                    <td className="py-4 px-4 text-gray-800">
                      {new Date(commission.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(commission.status)}`}>
                        {commission.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {commissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No commissions found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-4 mb-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
          {/* <div className="mt-6">
            <button className="bg-[#7a1335] hover:bg-[#5a0e28] text-white font-semibold py-3 px-6 rounded transition-colors">
              Download Report
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Commission;