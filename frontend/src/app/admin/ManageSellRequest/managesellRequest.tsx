

import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

// SectionFilterPagination: search and pagination controls for each section
interface SectionFilterPaginationProps {
	filter: string;
	setFilter: (v: string) => void;
	page: number;
	setPage: (v: number) => void;
	pageSize: number;
	setPageSize: (v: number) => void;
	total: number;
	totalPages: number;
}

const SectionFilterPagination: React.FC<SectionFilterPaginationProps> = ({ filter, setFilter, page, setPage, pageSize, setPageSize, total, totalPages }) => (
	<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
		<div className="flex items-center gap-2">
			<input
				type="text"
				className="border px-2 py-1 rounded"
				placeholder="Search..."
				value={filter}
				onChange={e => { setFilter(e.target.value); setPage(1); }}
			/>
			<span className="text-xs text-gray-500 ml-2">Total: {total}</span>
		</div>
		<div className="flex items-center gap-2">
			<button
				className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
				disabled={page <= 1}
				onClick={() => setPage(page - 1)}
			>Prev</button>
			<span className="text-xs">Page {page} of {totalPages}</span>
			<button
				className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
				disabled={page >= totalPages}
				onClick={() => setPage(page + 1)}
			>Next</button>
			<select
				className="border px-1 py-1 rounded text-xs ml-2"
				value={pageSize}
				onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
			>
				{[5, 10, 20, 50].map(size => (
					<option key={size} value={size}>{size} / page</option>
				))}
			</select>
		</div>
	</div>
);

const PAGE_SIZE = 10;


const ManageSellRequest = () => {
	// Data
	const [cashbackGold, setCashbackGold] = useState<any[]>([]);
	const [savingPlans, setSavingPlans] = useState<any[]>([]);
	const [goldPlants, setGoldPlants] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);

	// Filter and pagination state for each section
	const [cbFilter, setCbFilter] = useState('');
	const [cbPage, setCbPage] = useState(1);
	const [cbPageSize, setCbPageSize] = useState(PAGE_SIZE);

	const [spFilter, setSpFilter] = useState('');
	const [spPage, setSpPage] = useState(1);
	const [spPageSize, setSpPageSize] = useState(PAGE_SIZE);

	const [gpFilter, setGpFilter] = useState('');
	const [gpPage, setGpPage] = useState(1);
	const [gpPageSize, setGpPageSize] = useState(PAGE_SIZE);

	useEffect(() => {
		const userStr = localStorage.getItem('currentUser');
		let user = null;
		try {
			user = userStr ? JSON.parse(userStr) : null;
		} catch {
			user = null;
		}
		setIsAdmin(user?.role?.toLowerCase() === 'admin');
		if (user?.role?.toLowerCase() === 'admin') {
			setLoading(true);
			setError(null);
			Promise.all([
				axiosInstance.get('/api/cashback-gold-user/recalls'),
				axiosInstance.get('/api/saving-plans/terminations'),
				axiosInstance.get('/api/gold-plants/recalls'),
			])
				.then(([cashbackRes, savingRes, goldRes]) => {
					setCashbackGold(cashbackRes.data || []);
					setSavingPlans(savingRes.data || []);
					setGoldPlants(goldRes.data || []);
				})
				.catch(err => {
					setError(err?.response?.data?.message || 'Failed to fetch sell requests');
				})
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	// Filtering and pagination helpers
	function filterAndPaginate(data: any[], filter: string, page: number, pageSize: number, columns: TableColumn[]) {
		let filtered = data;
		if (filter.trim()) {
			const f = filter.trim().toLowerCase();
			filtered = data.filter(row =>
				columns.some(col => (row[col.key]?.toString().toLowerCase().includes(f)))
			);
		}
		const total = filtered.length;
		const totalPages = Math.max(1, Math.ceil(total / pageSize));
		const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
		return { paged, total, totalPages };
	}



				// Columns for each section
					// Cashback Gold columns (API: /api/cashback-gold-user/recalls)
					const cbColumns: TableColumn[] = [
						{ label: 'User Name', key: 'userName' },
						{ label: 'User Email', key: 'userEmail' },
						{ label: 'Scheme Name', key: 'schemeName' },
						{ label: 'Total Amount Paid', key: 'totalAmountPaid', format: (v: any) => v !== undefined ? `₹${v?.toLocaleString?.() ?? v}` : '-' },
						{ label: 'Gold Accumulated', key: 'goldAccumulated', format: (v: any) => v !== undefined ? `${v}g` : '-' },
						{ label: 'Recall Type', key: 'recallType', format: (v: any) => v || '-' },
						{ label: 'Recall Final Amount', key: 'recallFinalAmount', format: (v: any) => v != null ? `₹${v?.toLocaleString?.() ?? v}` : '-' },
						{ label: 'Status', key: 'status' },
					];

					// Saving Plan columns (API: /api/saving-plans/terminations)
					const spColumns: TableColumn[] = [
						{ label: 'Enrollment ID', key: 'enrollmentId' },
						{ label: 'Plan Name', key: 'planName' },
						{ label: 'Start Date', key: 'startDate', format: (v: any) => v ? v : '-' },
						{ label: 'Status', key: 'status' },
						{ label: 'Invested Amount', key: 'investedAmount', format: (v: any) => v !== undefined ? `₹${v?.toLocaleString?.() ?? v}` : '-' },
						{ label: 'Gold Accumulated', key: 'goldAccumulated', format: (v: any) => v !== undefined ? `${v}g` : '-' },
						{ label: 'Lock-in Completed', key: 'lockinCompleted', format: (v: any) => v ? 'Yes' : 'No' },
						{ label: 'Recalled', key: 'recalled', format: (v: any) => v ? 'Yes' : 'No' },
					];

					// Gold Plant columns (API: /api/gold-plants/recalls)
					const gpColumns: TableColumn[] = [
						{ label: 'Enrollment ID', key: 'enrollmentId' },
						{ label: 'Plan Name', key: 'planName' },
						{ label: 'Start Date', key: 'startDate', format: (v: any) => v ? v : '-' },
						{ label: 'Status', key: 'status' },
						{ label: 'Total Amount Paid', key: 'totalAmountPaid', format: (v: any) => v !== undefined ? `₹${v?.toLocaleString?.() ?? v}` : '-' },
						{ label: 'Total Gold Accumulated', key: 'totalGoldAccumulated', format: (v: any) => v !== undefined ? `${v}g` : '-' },
						{ label: 'Total Bonus', key: 'totalBonus', format: (v: any) => v !== undefined ? `₹${v?.toLocaleString?.() ?? v}` : '-' },
					];

				// Filtered and paginated data for each section
				const cbResult = filterAndPaginate(cashbackGold, cbFilter, cbPage, cbPageSize, cbColumns);
				const spResult = filterAndPaginate(savingPlans, spFilter, spPage, spPageSize, spColumns);
				const gpResult = filterAndPaginate(goldPlants, gpFilter, gpPage, gpPageSize, gpColumns);


				// SectionFilterPagination: search and pagination controls for each section
				interface SectionFilterPaginationProps {
					filter: string;
					setFilter: (v: string) => void;
					page: number;
					setPage: (v: number) => void;
					pageSize: number;
					setPageSize: (v: number) => void;
					total: number;
					totalPages: number;
				}


						return (
							<div className="p-2">
								<h2 className="text-base font-bold mb-2">User Sell Requests</h2>
								{!isAdmin ? (
									<div className="text-red-600 font-bold text-sm">Access denied. You must be an admin to view this page.</div>
								) : (
									<>
										{/* Cashback Gold Section */}
										<h3 className="text-sm font-semibold mt-3 mb-1">Cashback Gold Sell Requests</h3>
										<SectionFilterPagination
											filter={cbFilter}
											setFilter={setCbFilter}
											page={cbPage}
											setPage={setCbPage}
											pageSize={cbPageSize}
											setPageSize={setCbPageSize}
											total={cbResult.total}
											totalPages={cbResult.totalPages}
										/>
										<TableSection
											loading={loading}
											error={error}
											data={cbResult.paged}
											columns={cbColumns}
											compact
										/>

										{/* Saving Plan Section */}
										<h3 className="text-sm font-semibold mt-4 mb-1">Saving Plan Sell Requests</h3>
										<SectionFilterPagination
											filter={spFilter}
											setFilter={setSpFilter}
											page={spPage}
											setPage={setSpPage}
											pageSize={spPageSize}
											setPageSize={setSpPageSize}
											total={spResult.total}
											totalPages={spResult.totalPages}
										/>
										<TableSection
											loading={loading}
											error={error}
											data={spResult.paged}
											columns={spColumns}
											compact
										/>

										{/* Gold Plant Section */}
										<h3 className="text-sm font-semibold mt-4 mb-1">Gold Plant Sell Requests</h3>
										<SectionFilterPagination
											filter={gpFilter}
											setFilter={setGpFilter}
											page={gpPage}
											setPage={setGpPage}
											pageSize={gpPageSize}
											setPageSize={setGpPageSize}
											total={gpResult.total}
											totalPages={gpResult.totalPages}
										/>
										<TableSection
											loading={loading}
											error={error}
											data={gpResult.paged}
											columns={gpColumns}
											compact
										/>

										{error && (
											<div className="text-red-600 mt-2 text-xs">{error}</div>
										)}
									</>
								)}
							</div>
						);


		};


		// TableSection: generic table for each section
		interface TableColumn {
			label: string;
			key: string;
			format?: (v: any) => string;
		}

		interface TableSectionProps {
			loading: boolean;
			error: string | null;
			data: any[];
			columns: TableColumn[];
			compact?: boolean;
		}

		const TableSection: React.FC<TableSectionProps> = ({ loading, error, data, columns, compact }) => (
			<div className={compact ? 'overflow-x-auto mb-2' : 'overflow-x-auto mb-6'}>
				<table className={compact ? 'min-w-full bg-white border rounded text-xs' : 'min-w-full bg-white border rounded shadow'}>
					<thead>
						<tr className={compact ? 'bg-gray-100' : 'bg-gray-100'}>
							{columns.map((col: TableColumn) => (
								<th key={col.key} className={compact ? 'py-1 px-2 border font-medium' : 'py-2 px-3 border'}>{col.label}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan={columns.length} className={compact ? 'text-center py-2' : 'text-center py-4'}>Loading...</td></tr>
						) : data && data.length > 0 ? (
							data.map((row: any, idx: number) => (
								<tr key={idx} className={compact ? 'border-b' : 'border-b'}>
									{columns.map((col: TableColumn) => (
										<td key={col.key} className={compact ? 'py-1 px-2 border' : 'py-2 px-3 border'}>
											{col.format ? col.format(row[col.key]) : row[col.key] ?? '-'}
										</td>
									))}
								</tr>
							))
						) : (
							<tr><td colSpan={columns.length} className={compact ? 'text-center py-2 text-gray-500' : 'text-center py-4 text-gray-500'}>No data found.</td></tr>
						)}
					</tbody>
				</table>
			</div>
		);

export default ManageSellRequest;
