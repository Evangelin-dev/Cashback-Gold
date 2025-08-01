import { Activity, Award, ChevronLeft, ChevronRight, Clock, DollarSign, Edit, Filter, Handshake, Loader, Save, TrendingUp, User, UserCheck, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";

interface InventoryData {
  totalStock: number;
  inStoreStock: number;
  goldStock: number;
  silverStock: number;
  diamondStock: number;
  unit: string;
  updatedAt?: string;
}

type EditableInventory = Record<keyof Omit<InventoryData, 'unit' | 'updatedAt'>, string>;

const stats = [
	{ label: "Total Users", value: "1,240", color: "from-blue-500 to-blue-600", icon: Users, trend: "+12%" },
	{ label: "Gold Sold", value: "3.2kg", color: "from-yellow-500 to-yellow-600", icon: Award, trend: "+8%" },
	{ label: "Commission Earned", value: "₹1,20,000", color: "from-green-500 to-green-600", icon: DollarSign, trend: "+15%" },
	{ label: "Partners", value: "42", color: "from-purple-500 to-purple-600", icon: Handshake, trend: "+3%" },
];

const activityData = [
	{ time: "10:30 AM", desc: "User John Doe purchased 10g gold.", type: "user", icon: User },
	{ time: "09:15 AM", desc: "Partner request approved for S. Kumar.", type: "partner", icon: UserCheck },
	{ time: "Yesterday", desc: "Commission payout processed.", type: "partner", icon: DollarSign },
	{ time: "Yesterday", desc: "User Priya Sharma updated profile.", type: "user", icon: User },
	{ time: "2 days ago", desc: "Gold price updated.", type: "all", icon: TrendingUp },
	{ time: "2 days ago", desc: "Partner payout released.", type: "partner", icon: DollarSign },
	{ time: "3 days ago", desc: "User feedback received.", type: "user", icon: User },
	{ time: "3 days ago", desc: "New offer for partners.", type: "partner", icon: UserCheck },
	{ time: "4 days ago", desc: "System maintenance scheduled.", type: "all", icon: Activity },
	{ time: "4 days ago", desc: "User KYC approved.", type: "user", icon: User },
	{ time: "5 days ago", desc: "Partner commission updated.", type: "partner", icon: UserCheck },
	{ time: "5 days ago", desc: "User profile updated.", type: "user", icon: User },
];

const FILTERS = [
	{ label: "All", value: "all", icon: Activity },
	{ label: "Users", value: "user", icon: User },
	{ label: "Partners", value: "partner", icon: UserCheck },
	{ label: "Recent", value: "time", icon: Clock },
];

const AdminDashboard = () => {

	const [apiGoldPrice, setApiGoldPrice] = useState<string | null>(null);
	const [apiSilverPrice, setApiSilverPrice] = useState<string | null>(null);
	const [rateLoading, setRateLoading] = useState(true);
	const [rateError, setRateError] = useState<string | null>(null);


	const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
	const [inventoryLoading, setInventoryLoading] = useState(true);
	const [inventoryError, setInventoryError] = useState<string | null>(null);
	const [isInventoryInitialized, setIsInventoryInitialized] = useState(false);
	const [editInventory, setEditInventory] = useState(false);
	const [editStockValues, setEditStockValues] = useState<EditableInventory>({
	  totalStock: "", inStoreStock: "", goldStock: "", silverStock: "", diamondStock: ""
	});


	const [activityPage, setActivityPage] = useState(1);
	const [activityFilter, setActivityFilter] = useState("all");
	const pageSize = 6;

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
			console.error("Fetch rates error:", err);
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
			if (err.response && err.response.data && err.response.data.success === false) {
				setIsInventoryInitialized(false);
			} else {
				setInventoryError("Could not load inventory data.");
				console.error("Fetch inventory error:", err);
			}
		} finally {
			setInventoryLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRates();
		fetchInventory();
	}, [fetchRates, fetchInventory]);


	const handleSaveInventory = async () => {
		const numericPayload = {
			totalStock: Number(editStockValues.totalStock),
			inStoreStock: Number(editStockValues.inStoreStock),
			goldStock: Number(editStockValues.goldStock),
			silverStock: Number(editStockValues.silverStock),
			diamondStock: Number(editStockValues.diamondStock),
		};

		for (const key in numericPayload) {
			if (isNaN(numericPayload[key as keyof typeof numericPayload])) {
				alert(`Invalid number for ${key}. Please check your inputs.`);
				return;
			}
		}

		const fullPayload = { ...numericPayload, unit: 'gram' };

		setInventoryLoading(true);
		try {
			await axiosInstance.put('/api/inventory', fullPayload);
			alert("Inventory updated successfully!");
			setEditInventory(false);
			await fetchInventory();
		} catch (err) {
			alert("Failed to update inventory.");
			console.error("Save inventory error:", err);
		} finally {
			setInventoryLoading(false);
		}
	};

	const b2bInvoices = [{ id: "B2B-INV-001", customerName: "ABC Gold Traders", customerType: "b2b", goldType: "Gold Bar", quantity: 10, weight: "1kg", price: 6500000, date: "2024-06-01", status: "completed", paymentMethod: "Bank Transfer", address: "123 Market St, Mumbai" }];
	const partnerInvoices = [{ id: "PART-INV-001", customerName: "Sunrise Jewels", customerType: "partner", goldType: "Gold Coin", quantity: 50, weight: "500g", price: 3250000, date: "2024-06-02", status: "completed", paymentMethod: "UPI", address: "789 Partner Rd, Chennai" }];
	const b2bVendorCount = 5;
	let filteredActivities = activityData.filter(a => activityFilter === 'all' || a.type === activityFilter);
	const totalPages = Math.ceil(filteredActivities.length / pageSize);
	const pagedActivities = filteredActivities.slice((activityPage - 1) * pageSize, activityPage * pageSize);
	const getActivityTypeColor = (type: string) => {
		switch (type) {
			case "user": return "bg-blue-50 border-blue-200 text-blue-700";
			case "partner": return "bg-purple-50 border-purple-200 text-purple-700";
			default: return "bg-gray-50 border-gray-200 text-gray-700";
		}
	};


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
			  }} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-2"><Edit size={14}/> Edit</button>
			)}
		  </div>
				
				{inventoryLoading && <div className="text-center p-4"><Loader className="animate-spin text-[#7a1335] mx-auto w-6 h-6"/></div>}
				
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
						<button onClick={handleSaveInventory} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-2"><Save size={14}/> Save</button>
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
		  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
			{stats.map((stat, idx) => (
			  <div
				key={idx}
				className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-4 border border-gray-100 hover:border-gray-200 overflow-hidden"
			  >
				<div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
				<div className="relative z-10">
				  <div className="flex items-center justify-between mb-2">
					<div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
					  <stat.icon className="w-5 h-5 text-white" />
					</div>
					<div className="flex items-center space-x-1 text-green-600 text-xs font-medium">
					  <TrendingUp className="w-3 h-3" />
					  <span>{stat.trend}</span>
					</div>
				  </div>
				  <div className="space-y-1">
					<h3 className="text-lg sm:text-xl font-bold text-gray-800">{stat.value}</h3>
					<p className="text-gray-600 text-xs font-medium">{stat.label}</p>
				  </div>
				</div>
			  </div>
			))}
			<div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-4 border border-gray-100 hover:border-gray-200 overflow-hidden">
			  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
			  <div className="relative z-10">
				<div className="flex items-center justify-between mb-2">
				  <div className="p-2 rounded-xl bg-gradient-to-r from-pink-400 to-pink-600 shadow-lg">
					<Handshake className="w-5 h-5 text-white" />
				  </div>
				  <div className="flex items-center space-x-1 text-pink-600 text-xs font-medium">
					<TrendingUp className="w-3 h-3" />
					<span>+5%</span>
				  </div>
				</div>
				<div className="space-y-1">
				  <h3 className="text-lg sm:text-xl font-bold text-gray-800">{b2bVendorCount}</h3>
				  <p className="text-gray-600 text-xs font-medium">B2B Vendors</p>
				</div>
			  </div>
			</div>
		  </div>
		</div>

			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-indigo-100 rounded-lg">
								<Activity className="w-5 h-5 text-indigo-600" />
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
								<p className="text-sm text-gray-600">Track all platform activities in real-time</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Filter className="w-4 h-4 text-gray-500" />
							<div className="flex rounded-lg bg-gray-100 p-1">
								{FILTERS.map(f => (
									<button
										key={f.value}
										className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${ activityFilter === f.value ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"}`}
										onClick={() => { setActivityFilter(f.value); setActivityPage(1); }}
									>
										<f.icon className="w-4 h-4" />
										<span className="hidden sm:inline">{f.label}</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="p-6">
					<div className="space-y-4">
						{pagedActivities.map((activity, idx) => (
							<div
								key={idx}
								className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${getActivityTypeColor(activity.type)}`}
							>
								<div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
									<activity.icon className="w-4 h-4" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-800 mb-1">
										{activity.desc}
									</p>
									<div className="flex items-center space-x-2">
										<Clock className="w-3 h-3 text-gray-400" />
										<span className="text-xs text-gray-500 font-medium">{activity.time}</span>
										<span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${ activity.type === "user" ? "bg-blue-100 text-blue-700" : activity.type === "partner" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700" }`}>
											{activity.type}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
							<p className="text-sm text-gray-600">
								Showing {((activityPage - 1) * pageSize) + 1} to {Math.min(activityPage * pageSize, filteredActivities.length)} of {filteredActivities.length} activities
							</p>
							<div className="flex items-center space-x-2">
								<button
									className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={activityPage === 1}
									onClick={() => setActivityPage(activityPage - 1)}
								>
									<ChevronLeft className="w-4 h-4" />
									<span>Previous</span>
								</button>
								<div className="flex items-center space-x-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
										<button
											key={page}
											className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${ page === activityPage ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700" }`}
											onClick={() => setActivityPage(page)}
										>
											{page}
										</button>
									))}
								</div>
								<button
									className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={activityPage === totalPages}
									onClick={() => setActivityPage(activityPage + 1)}
								>
									<span>Next</span>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;