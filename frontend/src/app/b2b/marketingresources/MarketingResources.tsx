import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance"; // Make sure this path is correct
import { FaDownload, FaFileAlt, FaFileImage, FaFilePdf, FaArchive } from "react-icons/fa";
import { B2B_PRIMARY } from "../theme";
import { Loader } from "lucide-react"; // Using a modern loader icon

// Interface to match the API response structure
interface MarketingResource {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// More robust icon handler based on file type from the API
function getIcon(fileType: string) {
  const type = fileType.toLowerCase();
  
  if (type === "pdf") {
    return <FaFilePdf className="text-red-600 w-12 h-12" />;
  }
  if (["zip", "rar", "7z"].includes(type)) {
    return <FaArchive className="text-yellow-600 w-12 h-12" />;
  }
  if (["jpg", "jpeg", "png", "gif", "svg"].includes(type)) {
    return <FaFileImage className="text-blue-600 w-12 h-12" />;
  }
  // Default icon for other file types like doc, xlsx, etc.
  return <FaFileAlt className="text-gray-600 w-12 h-12" />;
}

export default function MarketingResources() {
  const [resources, setResources] = useState<MarketingResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/admin/marketing-resources');
      // Filter for active resources only, as an extra safeguard
      const activeResources = response.data.filter(
        (res: MarketingResource) => res.status === 'ACTIVE'
      );
      setResources(activeResources);
    } catch (err) {
      console.error("Failed to fetch marketing resources:", err);
      setError("Could not load resources. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-12 h-12 animate-spin" color={B2B_PRIMARY} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 text-red-600 bg-red-50 rounded-lg">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      );
    }

    if (resources.length === 0) {
      return (
        <div className="text-center py-20 text-gray-500">
          <FaFileAlt className="mx-auto w-16 h-16 text-gray-300 mb-4" />
          <h4 className="text-xl font-semibold">No Resources Available</h4>
          <p>Marketing materials will be uploaded here soon.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center border"
          >
            <div className="w-24 h-24 mb-4 flex items-center justify-center rounded-lg bg-white shadow-inner">
              {getIcon(res.fileType)}
            </div>
            <div className="font-bold text-[#7a1335] text-lg mb-1 text-center truncate w-full" title={res.title}>
              {res.title}
            </div>
            <div className="text-gray-600 text-sm mb-4 text-center h-10 overflow-hidden">
              {res.description}
            </div>
            <a
              href={res.fileUrl}
              download={res.fileName}
              target="_blank" // Opens in a new tab, safer for the user
              rel="noopener noreferrer"
              className="mt-auto flex items-center gap-2 px-6 py-2 rounded-lg bg-[#7a1335] text-white font-semibold hover:bg-[#a31d4b] transition-transform transform hover:scale-105"
            >
              <FaDownload /> Download
            </a>
            <div className="mt-3 text-xs text-gray-500 truncate w-full text-center" title={res.fileName}>
              {res.fileName}
            </div>
          </div>
        ))}
      </div>
    );
  };

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h3
				className="text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-4"
				style={{ color: B2B_PRIMARY }}
			>
				<FaFileAlt className="text-[#7a1335]" />
				Marketing Resources
			</h3>
      {renderContent()}
		</div>
	);
}