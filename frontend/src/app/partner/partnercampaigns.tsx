import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Megaphone, Award, Loader } from 'lucide-react';

type Campaign = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  multiplier: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED';
};

const PartnerCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/admin/campaigns');
      
      const activeCampaigns = response.data.filter(
        (campaign: Campaign) => campaign.status === 'ACTIVE'
      );
      
      setCampaigns(activeCampaigns);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setError('Could not load available campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader className="mx-auto h-10 w-10 animate-spin text-[#7a1335]" />
          <p className="mt-4 text-gray-600">Loading Campaigns...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-20 text-red-600">{error}</div>;
    }

    if (campaigns.length === 0) {
      return (
        <div className="text-center py-20 text-gray-500">
          <Megaphone className="mx-auto h-10 w-10 mb-4" />
          <p className="font-semibold">No Active Campaigns</p>
          <p className="text-sm">Please check back later for new offers and bonuses.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-[#fbeaf0]">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-[#7a1335] uppercase tracking-wider">Campaign</th>
              <th className="px-6 py-3 text-left font-semibold text-[#7a1335] uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left font-semibold text-[#7a1335] uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left font-semibold text-[#7a1335] uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left font-semibold text-[#7a1335] uppercase tracking-wider">Multiplier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{campaign.name}</td>
                <td className="px-6 py-4 whitespace-normal max-w-xs">{campaign.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(campaign.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(campaign.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                    <Award size={12}/>
                    {campaign.multiplier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7a1335]">Active Campaigns & Bonuses</h1>
          <p className="text-gray-600 mt-1">Check out the current offers available to you.</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default PartnerCampaigns;