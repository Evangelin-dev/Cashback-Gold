import { Activity, Award, ChevronLeft, ChevronRight, Clock, DollarSign, Edit, Filter, Handshake, Loader, Save, TrendingUp, User, UserCheck, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";

// --- TYPE DEFINITIONS ---
interface InventoryData {
	totalStock: number;
	inStoreStock: number;
	goldStock: number;
	silverStock: number;
	diamondStock: number;
	unit: string;
	updatedAt?: string;
}

interface AccountSummaryData {
    totalUsers: number;
    partners: number;
    goldSoldGrams: number;
    goldSoldDisplay: string;
    commissionEarnedInr: number;
    commissionEarnedDisplay: string;
    b2bVendors: number;
}

type EditableInventory = Record<keyof Omit<InventoryData, 'unit' | 'updatedAt'>, string>;

// Static data for recent activity
const activityData = [
	{ time: "10:30 AM", desc: "User John Doe purchased 10g gold.", type: "user", icon: User },
	{ time: "09:15 AM", desc: "Partner request approved for S. Kumar.", type: "partner", icon: UserCheck },
	{ time: "Yesterday", desc: "Commission payout processed.", type: "partner", icon: DollarSign },
];

const AdminDashboard = () => {
	// --- STATE ---
	const [apiGoldPrice, setApiGoldPrice] = useState<string | null>(null);
	const [apiSilverPrice, setApiSilverPrice] = useState<string | null>(null);
	const [rateLoading, setRateLoading] = useState(true);
	const [rateError, setRateError] = useState<string | null>(null);

	const [summaryData, setSummaryData] = useState<AccountSummaryData | null>(null);
	const [summaryLoading, setSummaryLoading] = useState(true);
	const [summaryError, setSummaryError] = useState<string | null>(null);

	const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
	const [inventoryLoading, setInventoryLoading] = useState(true);
	const [inventoryError, setInventoryError] = useState<string | null>(null);
	const [isInventoryInitialized, setIsInventoryInitialized] = useState(false);
	const [editInventory, setEditInventory] = useState(false);
	const [editStockValues, setEditStockValues] = useState<EditableInventory>({
		totalStock: "", inStoreStock: "", goldStock: "", silverStock: "", diamondStock: ""
	});

	const [activityFilter, setActivityFilter] = useState("all");

	// --- API FETCHING ---
	const fetchRates = useCallback(async () => {
		setRateLoading(true);
		setRateError(null);
		try {
			const response = await axiosInstance.get('/api/metal-rates');
			const { goldRateInrPerGram, silverRateInrPerGram } = response.data;
			setApiGoldPrice(goldRateInrPerGram.toFixed(2));
			setApiSilverPrice(silverRateInrPerGram.toFixed(2));
		} catch (err) {
			setRateError("Failed to fetch rates.");
		} finally {
			setRateLoading(false);
		}
	}, []);

	const fetchInventory = useCallback(async () => {
		setInventoryLoading(true);
		setInventoryError(null);
		try {
			const response = await axiosInstance.get('/api/inventory');
			setInventoryData(response.data);
			setIsInventoryInitialized(true);
		} catch (err: any) {
			if (err.response?.status === 404) {
				setIsInventoryInitialized(false);
			} else {
				setInventoryError("Could not load inventory data.");
			}
		} finally {
			setInventoryLoading(false);
		}
	}, []);

	const fetchSummary = useCallback(async () => {
		setSummaryLoading(true);
		setSummaryError(null);
		try {
			const response = await axiosInstance.get<AccountSummaryData>('/account-summary');
			setSummaryData(response.data);
		} catch (err) {
			setSummaryError("Failed to fetch summary.");
		} finally {
			setSummaryLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRates();
		fetchInventory();
		fetchSummary();
	}, [fetchRates, fetchInventory, fetchSummary]);

	// --- HANDLERS ---
	const handleSaveInventory = async () => {
		const numericPayload = Object.fromEntries(
			Object.entries(editStockValues).map(([key, value]) => [key, Number(value)])
		);

		if (Object.values(numericPayload).some(isNaN)) {
			alert("Invalid number found. Please check your inputs.");
			return;
		}

		const fullPayload = { ...numericPayload, unit: 'gram' };
		setInventoryLoading(true);
		try {
			await axiosInstance.put('/api/inventory', fullPayload);
			setEditInventory(false);
			await fetchInventory();
		} catch (err) {
			alert("Failed to update inventory.");
		} finally {
			setInventoryLoading(false);
		}
	};
    
    // --- DYNAMIC DATA FOR UI ---
    const summaryCards = summaryData ? [
        { label: "Total Users", value: summaryData.totalUsers.toLocaleString(), color: "from-blue-500 to-blue-600", icon: Users },
        { label: "Gold Sold", value: summaryData.goldSoldDisplay, color: "from-yellow-500 to-yellow-600", icon: Award },
        { label: "Commission Earned", value: summaryData.commissionEarnedDisplay, color: "from-green-500 to-green-600", icon: DollarSign },
        { label: "Partners", value: summaryData.partners.toLocaleString(), color: "from-purple-500 to-purple-600", icon: Handshake },
        { label: "B2B Vendors", value: summaryData.b2bVendors.toLocaleString(), color: "from-pink-400 to-pink-600", icon: Handshake }
    ] : [];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8">
			<div className="mb-4 sm:mb-6">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div>
						<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
						<p className="text-xs sm:text-sm text-gray-600">Welcome back! Here's what's happening with your platform.</p>
					</div>
					<div className="hidden sm:flex items-center space-x-2 bg-white px-2 py-1 rounded-full shadow-sm border">
						<Activity className="w-4 h-4 text-green-500" />
						<span className="text-xs font-medium text-gray-700">Live</span>
					</div>
				</div>
			</div>

			<div className="mb-4 sm:mb-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Live Market Prices</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					<div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
						<h3 className="text-base font-bold text-[#7a1335] mb-1">Gold Rate</h3>
						{rateLoading ? <Loader className="animate-spin text-[#7a1335] w-5 h-5" /> :
							rateError ? <p className="text-red-500 font-semibold text-xs">{rateError}</p> :
								<p className="text-xl sm:text-2xl font-bold text-gray-800">₹{apiGoldPrice}<span className="text-sm font-medium text-gray-500">/gram</span></p>
						}
					</div>
					<div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
						<h3 className="text-base font-bold text-[#7a1335] mb-1">Silver Rate</h3>
						{rateLoading ? <Loader className="animate-spin text-[#7a1335] w-5 h-5" /> :
							rateError ? <p className="text-red-500 font-semibold text-xs">{rateError}</p> :
								<p className="text-xl sm:text-2xl font-bold text-gray-800">₹{apiSilverPrice}<span className="text-sm font-medium text-gray-500">/gram</span></p>
						}
					</div>
				</div>
			</div>

			<div className="mb-4 sm:mb-6">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800">Inventory Overview</h2>
					{isInventoryInitialized && !editInventory && inventoryData && (
						<button onClick={() => {
							setEditStockValues({
								totalStock: String(inventoryData.totalStock),
								inStoreStock: String(inventoryData.inStoreStock),
								goldStock: String(inventoryData.goldStock),
								silverStock: String(inventoryData.silverStock),
								diamondStock: String(inventoryData.diamondStock),
							});
							setEditInventory(true);
						}} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-2"><Edit size={14} /> Edit</button>
					)}
				</div>

				{inventoryLoading && <div className="text-center p-4"><Loader className="animate-spin text-[#7a1335] mx-auto w-6 h-6" /></div>}

				{!inventoryLoading && !isInventoryInitialized && !editInventory && (
					<div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-2 rounded-r-lg text-center">
						<p className="font-bold text-xs">Inventory Not Initialized</p>
						<p className="text-xs">Please set up your initial stock values.</p>
						<button onClick={() => setEditInventory(true)} className="mt-2 px-3 py-1.5 bg-yellow-400 text-white rounded-lg text-xs font-medium">Setup Now</button>
					</div>
				)}

				{!inventoryLoading && (isInventoryInitialized || editInventory) && (
					<div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
						<div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
							{[
								{ key: "totalStock", label: "Total Stock" }, { key: "inStoreStock", label: "In Store" },
								{ key: "goldStock", label: "Gold" }, { key: "silverStock", label: "Silver" },
								{ key: "diamondStock", label: "Diamond" }
							].map(item => (
								<div key={item.key}>
									<p className="text-xs font-medium text-gray-600 mb-1">{item.label}</p>
									{editInventory ? (
										<input
											type="number"
											value={editStockValues[item.key as keyof EditableInventory]}
											onChange={e => setEditStockValues(vals => ({ ...vals, [item.key]: e.target.value }))}
											className="text-base font-bold text-gray-900 border border-gray-300 rounded-md px-2 py-1 w-full"
										/>
									) : (
										inventoryData && (
											<p className="text-lg font-bold text-gray-900">
												{(inventoryData[item.key as keyof InventoryData] as number).toLocaleString()}
												<span className="text-xs font-medium text-gray-500 ml-1">{inventoryData.unit}</span>
											</p>
										)
									)}
								</div>
							))}
						</div>
						{editInventory && (
							<div className="flex gap-2 mt-4 border-t pt-3">
								<button onClick={handleSaveInventory} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-2"><Save size={14} /> Save</button>
								<button onClick={() => setEditInventory(false)} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">Cancel</button>
							</div>
						)}
						{inventoryData?.updatedAt && !editInventory && (
							<p className="text-xs text-gray-400 mt-2 text-right">Last updated: {new Date(inventoryData.updatedAt).toLocaleString()}</p>
						)}
					</div>
				)}
			</div>
            
            <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Account Summary</h2>
                {summaryLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 animate-pulse">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="bg-gray-200 h-28 rounded-xl"></div>
                        ))}
                    </div>
                ) : summaryError ? (
                    <p className="text-red-500 text-center">{summaryError}</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                        {summaryCards.map((stat, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-4 border border-gray-100 hover:border-gray-200 overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                                            <stat.icon className="w-5 h-5 text-[#7a1436]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{stat.value}</h3>
                                        <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
		</div>
	);
};

export default AdminDashboard;