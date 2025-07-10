import { useState } from "react";

const initialSchemes = [
	{
		id: 1,
		name: "Gold Plant 2024",
		duration: "18 months",
		minInvest: "₹5,000",
		status: "Active",
		description: "A special gold plant scheme for 2024 with attractive returns.",
	},
];

const emptyScheme = {
	id: 0,
	name: "",
	duration: "",
	minInvest: "",
	status: "Active",
	description: "",
};

const PlantScheme = () => {
	const [schemes, setSchemes] = useState(initialSchemes);
	const [showAdd, setShowAdd] = useState(false);
	const [newScheme, setNewScheme] = useState(emptyScheme);
	const [showError, setShowError] = useState(false);
	const [editIdx, setEditIdx] = useState<number | null>(null);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(schemes.length / itemsPerPage);
	const paginatedSchemes = schemes.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleAddChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setNewScheme((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddScheme = () => {
		if (
			!newScheme.name ||
			!newScheme.duration ||
			!newScheme.minInvest ||
			!newScheme.description
		) {
			setShowError(true);
			return;
		}
		if (editIdx !== null) {
			setSchemes((prev) =>
				prev.map((scheme, idx) =>
					idx === editIdx ? { ...newScheme, id: scheme.id } : scheme
				)
			);
			setEditIdx(null);
		} else {
			setSchemes((prev) => [
				...prev,
				{ ...newScheme, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
			]);
		}
		setShowAdd(false);
		setNewScheme(emptyScheme);
	};

	const handleEdit = (idx: number) => {
		setEditIdx(idx);
		setNewScheme(schemes[idx]);
		setShowAdd(true);
	};

	const handleStatusChange = (id: number, newStatus: string) => {
		setSchemes((prev) =>
			prev.map((scheme) =>
				scheme.id === id ? { ...scheme, status: newStatus } : scheme
			)
		);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Active":
				return "bg-green-100 text-green-700";
			case "Closed":
				return "bg-gray-200 text-gray-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-white p-2 sm:p-6">
			{/* Removed card centering, content now starts from top */}
			<div className="bg-white rounded-xl shadow-lg p-4  mx-auto">
				<h1 className="text-xl sm:text-2xl font-bold text-[#7a1335] mb-4 sm:mb-6">
					Gold Plant Schemes
				</h1>
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white rounded-lg overflow-hidden text-xs sm:text-sm">
						<thead>
							<tr>
								<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Scheme Name</th>
								<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Duration</th>
								<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Min Investment</th>
								<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Description</th>
								<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Status</th>
							</tr>
						</thead>
						<tbody>
							{paginatedSchemes.map((scheme) => (
								<tr key={scheme.id} className="border-b last:border-b-0">
									<td className="px-4 py-3 align-middle">{scheme.name}</td>
									<td className="px-4 py-3 align-middle">{scheme.duration}</td>
									<td className="px-4 py-3 align-middle">{scheme.minInvest}</td>
									<td className="px-4 py-3 text-gray-600 align-middle">
										{scheme.description}
									</td>
									<td className="px-4 py-3 align-middle">
										<div className="relative w-full max-w-[160px]">
											<select
												value={scheme.status}
												onChange={(e) =>
													handleStatusChange(scheme.id, e.target.value)
												}
												className={`block w-full px-3 py-2 rounded-full text-xs sm:text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500 transition ${getStatusColor(
													scheme.status
												)}`}
												style={{
													minWidth: 100,
													appearance: "none",
													backgroundPosition: "right 0.75rem center",
													backgroundRepeat: "no-repeat",
												}}
											>
												<option value="Active">Active</option>
												<option value="Closed">Closed</option>
											</select>
											<span
												style={{
													pointerEvents: "none",
													position: "absolute",
													right: 14,
													top: "50%",
													transform: "translateY(-50%)",
													fontSize: 12,
													color: "#888",
												}}
											>
												▼
											</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* Pagination Controls */}
				<div className="flex justify-center items-center gap-2 mt-4">
					<button
						className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
					>
						Prev
					</button>
					<span className="text-sm text-gray-700">
						Page {currentPage} of {totalPages}
					</span>
					<button
						className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
				</div>
				<button
					className="mt-4 sm:mt-6 bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-2 px-6 rounded transition w-full sm:w-auto"
					onClick={() => {
						setShowAdd(true);
						setEditIdx(null);
					}}
				>
					Add New Scheme
				</button>
				{showAdd && (
					<div
						style={{
							position: "fixed",
							inset: 0,
							zIndex: 50,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "rgba(0,0,0,0.4)",
							padding: 8,
						}}
					>
						<div
							style={{
								background: "#fff",
								borderRadius: "0.75rem",
								boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
								minWidth: 320,
								maxWidth: 420,
								width: "100%",
								padding: 24,
								position: "relative",
								margin: "0 auto",
							}}
						>
							<h2
								style={{
									fontSize: 20,
									fontWeight: 700,
									marginBottom: 16,
									color: "#7a1335",
									textAlign: "center",
								}}
							>
								{editIdx !== null ? "Edit Scheme" : "Add New Scheme"}
							</h2>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 16,
								}}
							>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 14,
											marginBottom: 4,
										}}
									>
										Scheme Name
									</label>
									<input
										type="text"
										name="name"
										value={newScheme.name}
										onChange={handleAddChange}
										style={{
											width: "100%",
											padding: "8px 12px",
											borderRadius: 4,
											border: "1px solid #ccc",
										}}
										placeholder="Scheme Name"
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 14,
											marginBottom: 4,
										}}
									>
										Duration
									</label>
									<input
										type="text"
										name="duration"
										value={newScheme.duration}
										onChange={handleAddChange}
										style={{
											width: "100%",
											padding: "8px 12px",
											borderRadius: 4,
											border: "1px solid #ccc",
										}}
										placeholder="e.g. 18 months"
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 14,
											marginBottom: 4,
										}}
									>
										Min Investment
									</label>
									<input
										type="text"
										name="minInvest"
										value={newScheme.minInvest}
										onChange={handleAddChange}
										style={{
											width: "100%",
											padding: "8px 12px",
											borderRadius: 4,
											border: "1px solid #ccc",
										}}
										placeholder="e.g. ₹5,000"
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 14,
											marginBottom: 4,
										}}
									>
										Description
									</label>
									<textarea
										name="description"
										value={newScheme.description}
										onChange={handleAddChange}
										style={{
											width: "100%",
											padding: "8px 12px",
											borderRadius: 4,
											border: "1px solid #ccc",
										}}
										placeholder="Description"
										rows={2}
									/>
								</div>
							</div>
							<div
								style={{
									display: "flex",
									gap: 8,
									justifyContent: "center",
									marginTop: 16,
								}}
							>
								<button
									style={{
										padding: "8px 16px",
										borderRadius: 4,
										background: "#7a1335",
										color: "#fff",
										fontWeight: 600,
										border: "none",
										cursor: "pointer",
									}}
									onClick={handleAddScheme}
								>
									{editIdx !== null ? "Save" : "Add"}
								</button>
								<button
									style={{
										padding: "8px 16px",
										borderRadius: 4,
										background: "#e5e7eb",
										color: "#374151",
										border: "none",
										cursor: "pointer",
									}}
									onClick={() => {
										setShowAdd(false);
										setNewScheme(emptyScheme);
										setEditIdx(null);
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
				{/* Creative Centered Error Popup */}
				{showError && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
							<span className="material-icons text-5xl text-[#7a1335] mb-2 animate-bounce">
								warning_amber
							</span>
							<h2 className="text-xl font-bold text-[#7a1335] mb-2 text-center">
								Missing Fields
							</h2>
							<div className="mb-4 text-gray-700 text-center">
								Please fill all fields.
							</div>
							<button
								className="px-6 py-2 rounded bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold shadow transition"
								onClick={() => setShowError(false)}
							>
								OK
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PlantScheme;

