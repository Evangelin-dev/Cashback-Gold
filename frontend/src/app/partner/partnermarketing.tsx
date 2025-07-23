import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Image as ImageIcon, FileText, Download, Loader, Megaphone } from 'lucide-react';


interface MarketingResource {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface SchemeFlyer {
  id: number;
  url: string;
  name: string;
  type: string;
}

const captions = [
  "Invest in gold today! Secure your future. #GoldSIP",
  "Start your SIP journey with us and earn rewards! #CashbackGold",
  "The safest investment with the best returns. Explore our Gold Plant Scheme.",
  "Don't just save, grow your wealth with our flexible Saving Schemes."
];

const PartnerMarketing = () => {
  const [resources, setResources] = useState<MarketingResource[]>([]);
  const [flyers, setFlyers] = useState<SchemeFlyer[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resourcesResponse, flyersResponse] = await Promise.all([
        axiosInstance.get('/admin/marketing-resources'),
        axiosInstance.get('/api/flyers')
      ]);

      const activeResources = (resourcesResponse.data || []).filter(
        (res: MarketingResource) => res.status === 'ACTIVE'
      );
      setResources(activeResources);
      
      setFlyers(flyersResponse.data || []);

    } catch (err) {
      console.error('Failed to fetch marketing materials:', err);
      setError('Could not load marketing materials. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Loader className="mx-auto h-10 w-10 animate-spin text-[#7a1335]" />
          <p className="mt-4 text-gray-600">Loading Marketing Materials...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-20 text-red-600">{error}</div>;
    }

    if (resources.length === 0 && flyers.length === 0) {
      return (
        <div className="text-center py-20 text-gray-500">
          <Megaphone className="mx-auto h-10 w-10 mb-4" />
          <p className="font-semibold">No Marketing Materials Available</p>
          <p className="text-sm">Please check back later for new promotional content.</p>
        </div>
      );
    }

    return (
      <>
        {resources.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">General Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between border hover:border-[#7a1335] transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-[#7a1335] flex-shrink-0" />
                        <h3 className="font-bold text-gray-900">{resource.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 h-16">{resource.description}</p>
                  </div>
                  <a
                    href={resource.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-[#7a1335] text-white text-sm font-bold py-2 px-3 rounded-md hover:bg-[#630f2a] transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {flyers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Scheme Flyers & Banners</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {flyers.map((flyer) => (
                <div key={flyer.id} className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-3">
                    <img src={flyer.url} alt={flyer.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 text-center mb-3 h-10">{flyer.name}</p>
                  <a
                    href={flyer.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#7a1335] text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-[#630f2a] transition-colors"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#7a1335]">Marketing Tools</h1>
          <p className="text-gray-600 mt-1">Download promotional materials to share with your network.</p>
        </div>

        {renderContent()}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ready-to-Use Captions</h2>
          <div className="space-y-3">
            {captions.map((caption, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg text-gray-700 text-sm border-l-4 border-[#7a1335]">
                {caption}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerMarketing;