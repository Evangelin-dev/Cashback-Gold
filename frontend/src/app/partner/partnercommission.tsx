import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; // For loading indicator
import axiosInstance from '../../utils/axiosInstance'; // Make sure this path is correct

// TypeScript interface to match the API response structure
interface Commission {
  id: number;
  partnerId: number;
  userId: number;
  orderType: string;
  orderAmount: number;
  commissionAmount: number;
  status: string;
  createdAt: string;
}

const PartnerCommission = () => {
  // State to hold the fetched commissions, loading status, and any errors
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchCommissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<Commission[]>('/api/partner/commissions');
        setCommissions(response.data || []);
      } catch (err) {
        console.error("Failed to fetch commissions:", err);
        setError("Could not load your commission history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Handle the loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3]">
        <Loader2 className="h-10 w-10 animate-spin text-[#7a1335]" />
      </div>
    );
  }

  // Handle the error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3] p-6">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3] p-2 sm:p-6">
      <h1 className="text-2xl font-bold text-[#7a1335] mb-6">Commission & Earnings</h1>
      
      {commissions.length === 0 ? (
        <div className="text-center bg-white rounded-lg p-12">
          <p className="text-lg text-gray-500">You have not earned any commissions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden text-xs sm:text-sm">
            <thead className="bg-[#fdf6f8]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">User ID</th>
                <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Order Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Commission</th>
                <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Status</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(c.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">User #{c.userId}</td>
                  <td className="px-4 py-3 text-gray-700">{c.orderType}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(c.orderAmount)}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(c.commissionAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "Approved" ? "bg-green-100 text-green-700" :
                      c.status === "Paid" ? "bg-blue-100 text-blue-700" :
                      "bg-[#fbeaf0] text-[#7a1335]"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {commissions.length > 0 && (
        <button className="mt-6 bg-[#7a1335] hover:bg-[#5a0e28] text-white font-semibold py-2 px-6 rounded transition">
          Download CSV
        </button>
      )}
    </div>
  );
};

export default PartnerCommission;