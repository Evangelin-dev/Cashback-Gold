import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

interface SavingPlanType {
	id: number;
	name: string;
	duration: string;
	amount: string;
	description: string;
	status: 'ACTIVE' | 'CLOSED';
	keyPoint1: string;
	keyPoint2: string;
	keyPoint3: string;
}

const emptyPlan: Omit<SavingPlanType, 'id'> = {
	name: "",
	duration: "",
	amount: "",
	description: "",
	status: "ACTIVE",
	keyPoint1: "",
	keyPoint2: "",
	keyPoint3: "",
};

const SavingPlan = () => {
	const [plans, setPlans] = useState<SavingPlanType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [showAddModal, setShowAddModal] = useState(false);
	const [editingPlan, setEditingPlan] = useState<SavingPlanType | null>(null);
	const [formData, setFormData] = useState(emptyPlan);

	const [showError, setShowError] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [planToDelete, setPlanToDelete] = useState<SavingPlanType | null>(null);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(plans.length / itemsPerPage);
	const paginatedPlans = plans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


	const fetchPlans = useCallback(async () => {
		setLoading(true);
		try {
			const response = await axiosInstance.get('/api/saving-plans');
			setPlans(response.data);
			setError(null);
		} catch (err) {
			console.error("Failed to fetch saving plans:", err);
			setError("Could not load saving plans.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	const handleCreatePlan = async (planData: Omit<SavingPlanType, 'id'>) => {
		try {
			await axiosInstance.post('/api/saving-plans', planData);
			fetchPlans();
			closeModal();
		} catch (err) {
			console.error("Failed to create plan:", err);
			alert("An error occurred while creating the plan.");
		}
	};

	const handleUpdatePlan = async (planData: SavingPlanType) => {
		const { id, ...payload } = planData;
		try {
			await axiosInstance.put(`/api/saving-plans/${id}`, payload);
			fetchPlans();
			closeModal();
		} catch (err) {
			console.error("Failed to update plan:", err);
			alert("An error occurred while updating the plan.");
		}
	};

	const handleStatusChange = async (id: number, newStatus: 'ACTIVE' | 'CLOSED') => {
		const originalPlans = [...plans];

		const updatedPlans = plans.map(plan =>
			plan.id === id ? { ...plan, status: newStatus } : plan
		);
		setPlans(updatedPlans);

		try {
			await axiosInstance.put(`/api/saving-plans/${id}/status?status=${newStatus}`);
		} catch (err) {
			console.error("Failed to toggle status:", err);
			alert("Failed to update status. Reverting change.");
			setPlans(originalPlans);
		}
	};

	const handleDelete = async () => {
		if (!planToDelete) return;
		try {
			await axiosInstance.delete(`/api/saving-plans/${planToDelete.id}`);
			setShowDeleteConfirm(false);
			setPlanToDelete(null);
			fetchPlans();
		} catch (err) {
			console.error("Failed to delete plan:", err);
			alert("An error occurred while deleting the plan.");
		}
	};


	const openAddModal = () => {
		setEditingPlan(null);
		setFormData(emptyPlan);
		setShowAddModal(true);
	};

	const openEditModal = (plan: SavingPlanType) => {
		setEditingPlan(plan);
		setFormData(plan);
		setShowAddModal(true);
	};

	const closeModal = () => {
		setShowAddModal(false);
		setEditingPlan(null);
		setFormData(emptyPlan);
	};

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.duration || !formData.amount || !formData.description || !formData.keyPoint1) {
			setShowError(true);
			return;
		}

		if (editingPlan) {
			handleUpdatePlan({ ...formData, id: editingPlan.id });
		} else {
			handleCreatePlan(formData);
		}
	};

	const openDeleteConfirm = (plan: SavingPlanType) => {
		setPlanToDelete(plan);
		setShowDeleteConfirm(true);
	};

	const getStatusColor = (status: string) => {
		return status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-white p-2 sm:p-6">
			<div className="bg-white rounded-xl shadow-lg p-4 mx-auto">
				<h1 className="text-xl sm:text-2xl font-bold text-[#7a1335] mb-4 sm:mb-6">Chit Jewels Saving Plans</h1>
				{loading && <div className="text-center py-4">Loading plans...</div>}
				{error && <div className="text-center py-4 text-red-500">{error}</div>}
				{!loading && !error && (
					<>
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white rounded-lg overflow-hidden text-xs sm:text-sm">
								<thead>
									<tr>
										<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Plan Name</th>
										<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Duration</th>
										<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Amount</th>
										<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Description</th>
										<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Status</th>
										<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Key Points</th>
										<th className="px-2 sm:px-4 py-2 text-[#7a1335]">Actions</th>
									</tr>
								</thead>
								<tbody>
									{paginatedPlans.reverse().map((plan) => (
										<tr key={plan.id} className="border-b last:border-b-0">
											<td className="px-4 py-3 align-top">{plan.name}</td>
											<td className="px-4 py-3 align-top">{plan.duration}</td>
											<td className="px-4 py-3 align-top">{plan.amount}</td>
											<td className="px-4 py-3 text-gray-600 align-top"><div
												className="text-sm text-gray-900 max-w-[150px] truncate"
												title={plan.description}
											>
												{plan.description.length > 12
													? `${plan.description.slice(0, 7)}...`
													: plan.description}
											</div></td>

											<td className="px-4 py-3 align-top">
												<select
													value={plan.status}
													onChange={(e) => handleStatusChange(plan.id, e.target.value as 'ACTIVE' | 'CLOSED')}
													className={`block w-full px-3 py-2 rounded-full font-medium border-0 focus:ring-2 focus:ring-purple-500 transition cursor-pointer ${getStatusColor(plan.status)}`}
												>
													<option value="ACTIVE">Active</option>
													<option value="CLOSED">Closed</option>
												</select>
											</td>
											<td className="px-4 py-3 text-gray-600 align-top">
												<ul className="list-disc pl-4 space-y-1">
													{plan.keyPoint1 && <li>{plan.keyPoint1}</li>}
													{plan.keyPoint2 && <li>{plan.keyPoint2}</li>}
													{plan.keyPoint3 && <li>{plan.keyPoint3}</li>}
												</ul>
											</td>
											<td className="px-4 py-3 align-top text-center space-x-2">
												<button onClick={() => openEditModal(plan)} className="text-blue-600 hover:underline">Edit</button>
												<button onClick={() => openDeleteConfirm(plan)} className="text-red-600 hover:underline">Delete</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{totalPages > 1 && (
							<div className="flex justify-center items-center gap-2 mt-4">
								<button className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
								<span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
								<button className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
							</div>
						)}
					</>
				)}
				<button
					className="mt-4 sm:mt-6 bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-2 px-6 rounded transition w-full sm:w-auto"
					onClick={openAddModal}
				>Add New Plan</button>
				{showAddModal && (
					<div className="fixed overflow-y-auto h-full pt-5 inset-0 top-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
						<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
							<h2 className="text-lg font-bold text-[#7a1335] text-center">
								{editingPlan ? "Edit Plan" : "Add New Plan"}
							</h2>
							<form onSubmit={handleSubmit} className="space-y-3">
								<div>
									<label className="block text-sm mb-1 font-medium text-gray-700">Plan Name</label>
									<input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" required />
								</div>
								<div>
									<label className="block text-sm mb-1 font-medium text-gray-700">Duration</label>
									<input type="text" name="duration" value={formData.duration} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" required />
								</div>
								<div>
									<label className="block text-sm mb-1 font-medium text-gray-700">Amount</label>
									<input type="text" name="amount" value={formData.amount} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" required />
								</div>
								<div>
									<label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
									<textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" rows={2} required />
								</div>
								<div>
									<label className="block text-sm mb-1 font-medium text-gray-700">Key Points</label>
									<input type="text" name="keyPoint1" value={formData.keyPoint1} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md mb-2" placeholder="Key Point 1 (Required)" required />
									<input type="text" name="keyPoint2" value={formData.keyPoint2} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md mb-2" placeholder="Key Point 2 (Optional)" />
									<input type="text" name="keyPoint3" value={formData.keyPoint3} onChange={handleFormChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Key Point 3 (Optional)" />
								</div>
								<div className="flex gap-4 justify-center pt-4">
									<button type="submit" className="py-2 px-6 rounded bg-[#7a1335] text-white font-semibold transition-transform hover:scale-105">
										{editingPlan ? "Save Changes" : "Add Plan"}
									</button>
									<button type="button" onClick={closeModal} className="py-2 px-6 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
				{showError && (
					<div className="fixed top-0 inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
							<div className="mb-4 text-gray-700 text-center">Please fill all required fields.</div>
							<button className="px-6 py-2 rounded bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold shadow transition" onClick={() => setShowError(false)}>OK</button>
						</div>
					</div>
				)}
				{showDeleteConfirm && (
					<div className="fixed top-0 inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
						<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
							<h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
							<p className="text-gray-600 mb-6">Are you sure you want to delete the plan "{planToDelete?.name}"?</p>
							<div className="flex justify-center gap-4">
								<button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 bg-gray-200 rounded-md">Cancel</button>
								<button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-md">Delete</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SavingPlan;