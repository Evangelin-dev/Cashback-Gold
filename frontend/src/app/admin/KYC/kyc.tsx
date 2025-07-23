import { useState, useEffect, useCallback } from "react";
import { FaCheckCircle, FaHourglassHalf, FaIdCard, FaRegEye, FaTimesCircle, FaUser, FaBuilding, FaHandshake, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance"; // Make sure this path is correct

// Type definitions based on your API response
type KycStatus = "PENDING" | "APPROVED" | "REJECTED";
type UserType = "USER" | "B2B" | "PARTNER";

interface KycRequest {
    id: number;
    userId: number;
    userType: UserType;
    aadharUrl?: string | null;
    panUrl?: string | null;
    gstCertificateUrl?: string | null;
    addressProofUrl?: string | null;
    bankStatementUrl?: string | null;
    status: KycStatus;
    submittedAt: string;
	panCardUrl?: string | null
}

type ModalState = { url: string; label: string } | null;

const KYC = () => {
    const [modal, setModal] = useState<ModalState>(null);
    const [requests, setRequests] = useState<KycRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<UserType>("USER");
    const [currentPage, setCurrentPage] = useState<Record<UserType, number>>({
        USER: 1,
        B2B: 1,
        PARTNER: 1,
    });
    const [totalPages, setTotalPages] = useState<Record<UserType, number>>({
        USER: 1,
        B2B: 1,
        PARTNER: 1,
    });
    const [totalElements, setTotalElements] = useState<Record<UserType, number>>({
        USER: 0,
        B2B: 0,
        PARTNER: 0,
    });
    const itemsPerPage = 5;

    // Fetch data from API
    const fetchKycRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // API uses 0-indexed pages, so we subtract 1
            const pageIndex = currentPage[activeTab] - 1;
            const url = `/api/kyc/admin?userType=${activeTab}&page=${pageIndex}&size=${itemsPerPage}`;
            
            const response = await axiosInstance.get(url);
            
            setRequests(response.data.content);
            setTotalPages(prev => ({ ...prev, [activeTab]: response.data.totalPages }));
            setTotalElements(prev => ({...prev, [activeTab]: response.data.totalElements }));

        } catch (err) {
            console.error(`Failed to fetch KYC requests for ${activeTab}:`, err);
            setError(`Could not load requests for ${activeTab}. Please try again.`);
            setRequests([]); // Clear requests on error
        } finally {
            setLoading(false);
        }
    }, [activeTab, currentPage]);

    useEffect(() => {
        fetchKycRequests();
    }, [fetchKycRequests]);

    // Handle status update with optimistic UI change
    const handleStatusChange = async (id: number, status: KycStatus) => {
        const originalRequests = [...requests];
        
        // Optimistic update
        const updatedRequests = requests.map(req => 
            req.id === id ? { ...req, status } : req
        );
        setRequests(updatedRequests);

        try {
            await axiosInstance.put(`/api/kyc/admin/${id}/status?status=${status}`);
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status. Reverting change.");
            // Revert on error
            setRequests(originalRequests);
        }
    };

    const getStatusColor = (status: KycStatus) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-700";
            case "PENDING": return "bg-[#fbeaf0] text-[#7a1335]";
            case "REJECTED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getTabIcon = (type: UserType) => {
        switch (type) {
            case "USER": return <FaUser className="text-sm" />;
            case "B2B": return <FaBuilding className="text-sm" />;
            case "PARTNER": return <FaHandshake className="text-sm" />;
        }
    };

    const handlePageChange = (type: UserType, page: number) => {
        if (page > 0 && page <= totalPages[type]) {
            setCurrentPage(prev => ({ ...prev, [type]: page }));
        }
    };

    const getDocumentInfo = (req: KycRequest) => {
        switch (req.userType) {
            case "USER": return {
                firstDoc: { label: "Aadhaar", url: req.aadharUrl },
                secondDoc: { label: "PAN", url: req.panUrl }
            };
            case "B2B": return {
                firstDoc: { label: "GST Cert.", url: req.gstCertificateUrl },
                secondDoc: { label: "PAN", url: req.panCardUrl }
            };
            case "PARTNER": return {
                firstDoc: { label: "Address Proof", url: req.addressProofUrl },
                secondDoc: { label: "Bank Statement", url: req.bankStatementUrl }
            };
            default: return {
                firstDoc: { label: "Doc 1", url: null },
                secondDoc: { label: "Doc 2", url: null }
            };
        }
    };
    
    const renderPagination = (type: UserType) => {
		const totalP = totalPages[type];
		const current = currentPage[type];
        const totalE = totalElements[type];
		
		if (totalP <= 1) return null;

		return (
			<div className="flex items-center justify-between mt-4 px-4">
				<div className="text-xs sm:text-sm text-gray-500">
					Showing {((current - 1) * itemsPerPage) + 1} to {Math.min(current * itemsPerPage, totalE)} of {totalE} results
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => handlePageChange(type, current - 1)}
						disabled={current === 1}
						className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
					>
						<FaChevronLeft className="text-xs" />
					</button>
					<span className="text-sm font-medium">{current} / {totalP}</span>
					<button
						onClick={() => handlePageChange(type, current + 1)}
						disabled={current === totalP}
						className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
					>
						<FaChevronRight className="text-xs" />
					</button>
				</div>
			</div>
		);
	};
    
    const renderTable = () => {
        if (loading) return <div className="text-center py-10">Loading requests...</div>;
        if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
        if (requests.length === 0) return (
            <div className="text-center py-8 text-gray-400 text-sm">No {activeTab} KYC requests found.</div>
        );

        const { firstDoc, secondDoc } = getDocumentInfo(requests[0]);

        return (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-[#fbeaf0] border-b border-gray-200">
                            <th className="px-3 py-3 sm:px-6 sm:py-4 text-[#7a1335] font-semibold text-left text-sm">{activeTab}</th>
                            <th className="px-3 py-3 sm:px-6 sm:py-4 text-[#7a1335] font-semibold text-center text-sm">{firstDoc.label}</th>
                            <th className="px-3 py-3 sm:px-6 sm:py-4 text-[#7a1335] font-semibold text-center text-sm">{secondDoc.label}</th>
                            <th className="px-3 py-3 sm:px-6 sm:py-4 text-[#7a1335] font-semibold text-center text-sm">Status</th>
                            <th className="px-3 py-3 sm:px-6 sm:py-4 text-[#7a1335] font-semibold text-center text-sm">Submitted</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {requests.map((req) => {
                            const { firstDoc, secondDoc } = getDocumentInfo(req);
                            return (
                                <tr key={req.id} className="hover:bg-[#fbeaf0] transition-colors">
                                    <td className="px-3 py-4 sm:px-6 sm:py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#7a1335] shadow-sm">
                                            {getTabIcon(req.userType)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-[#7a1335] text-sm">{req.userType} ID: {req.userId}</div>
                                            <div className="text-xs text-gray-400">Request ID: {req.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 sm:px-6 sm:py-4 text-center">
                                        {firstDoc.url ? (
                                            <button
                                                className="flex items-center gap-1 mx-auto text-blue-600 hover:text-blue-800 font-medium underline transition-colors text-sm"
                                                onClick={() => setModal({ url: firstDoc.url!, label: `${req.userType} ID ${req.userId} - ${firstDoc.label}` })}
                                            >
                                                <FaRegEye className="text-xs sm:text-sm" /> View
                                            </button>
                                        ) : <span className="text-gray-400 text-sm">-</span>}
                                    </td>
                                    <td className="px-3 py-4 sm:px-6 sm:py-4 text-center">
                                        {secondDoc.url ? (
                                            <button
                                                className="flex items-center gap-1 mx-auto text-blue-600 hover:text-blue-800 font-medium underline transition-colors text-sm"
                                                onClick={() => setModal({ url: secondDoc.url!, label: `${req.userType} ID ${req.userId} - ${secondDoc.label}` })}
                                            >
                                                <FaRegEye className="text-xs sm:text-sm" /> View
                                            </button>
                                        ) : <span className="text-gray-400 text-sm">-</span>}
                                    </td>
                                    <td className="px-3 py-4 sm:px-6 sm:py-4 text-center">
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusChange(req.id, e.target.value as KycStatus)}
                                            className={`appearance-none px-3 py-2 pr-8 rounded-full text-xs font-bold cursor-pointer transition-all border-2 border-transparent hover:border-[#7a1335] focus:border-[#7a1335] focus:outline-none ${getStatusColor(req.status)}`}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="APPROVED">Approved</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-4 sm:px-6 sm:py-4 text-center text-gray-500 text-sm">{new Date(req.submittedAt).toLocaleDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    };
    
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-white p-1 sm:p-6">
			{modal && (
				<div className="fixed top-0 inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative animate-fade-in">
						<button
							className="absolute top-3 right-4 text-gray-400 text-3xl hover:text-red-500 transition-colors"
							onClick={() => setModal(null)}
							aria-label="Close"
						>×</button>
						<h2 className="text-lg font-bold mb-4 text-[#7a1335] flex items-center gap-2">
							<FaRegEye /> {modal.label}
						</h2>
						<div className="w-full h-[75vh] rounded-lg border bg-gray-100">
							<iframe src={modal.url} title={modal.label} className="w-full h-full rounded-lg border-none" />
						</div>
					</div>
				</div>
			)}

			<div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-6 w-full max-w-full sm:max-w-6xl mx-auto">
				<div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2">
					<h1 className="text-lg sm:text-2xl font-bold text-[#7a1335] flex items-center gap-2">
						<FaIdCard className="text-xl sm:text-2xl" /> KYC Requests
					</h1>
					<span className="text-xs sm:text-sm text-gray-500">{totalElements[activeTab]} total requests</span>
				</div>

				<div className="flex border-b border-gray-200 mb-6">
					{(["USER", "B2B", "PARTNER"] as UserType[]).map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
								activeTab === tab
									? "border-[#7a1335] text-[#7a1335] bg-[#fbeaf0]"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							{getTabIcon(tab)}
							{tab.charAt(0) + tab.slice(1).toLowerCase()}
						</button>
					))}
				</div>
                
                {renderTable()}
				{renderPagination(activeTab)}
			</div>
		</div>
	);
};

export default KYC;