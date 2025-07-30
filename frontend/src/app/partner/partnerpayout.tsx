import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';


interface Earnings {
  totalEarnings: number;
  alreadyRequested: number;
  withdrawalBalance: number;
}

interface BankDetail {
  id: number;
  userId: number;
  bank: string;
  account: string;
  ifsc: string;
  upiId: string;
  status: string;
  description: string;
}

interface Payout {
  id: number;
  partnerId: number;
  amount: number;
  method: string;
  methodDetail: string;
  status: string;
  requestedAt: string;
}

const PartnerPayout = () => {

    const [earnings, setEarnings] = useState<Earnings | null>(null);
    const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
    const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);


    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("UPI");
    const [selectedDetail, setSelectedDetail] = useState("");


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);


    const fetchData = async () => {
        try {
            const [earningsRes, detailsRes, historyRes] = await Promise.all([
                axiosInstance.get<Earnings>('/api/partner/earnings'),
                axiosInstance.get<BankDetail[]>('/api/bank-accounts'),
                axiosInstance.get<Payout[]>('/api/partner/payout-history')
            ]);

            setEarnings(earningsRes.data);
            setBankDetails(detailsRes.data || []);
            setPayoutHistory(historyRes.data || []);

        } catch (err) {
            console.error("Failed to fetch payout data:", err);
            setError("Could not load your payout information. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDetail || !amount) {
            alert("Please select a payout method and enter an amount.");
            return;
        }

        setIsRequesting(true);
        try {
            await axiosInstance.post('/api/partner/request-payout', {
                amount: Number(amount),
                method: method,
                methodDetail: selectedDetail
            });
            setAmount("");
            setSelectedDetail("");
            fetchData();
        } catch (err) {
            console.error("Payout request failed:", err);
            alert("There was an error submitting your request. Please try again.");
        } finally {
            setIsRequesting(false);
        }
    };
    

    const availablePayoutDetails = useMemo(() => {
        if (method === 'Bank') {
            return bankDetails.filter(d => d.bank && d.account);
        }
        if (method === 'UPI') {
            return bankDetails.filter(d => d.upiId);
        }
        return [];
    }, [method, bankDetails]);


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fbeaf0] to-[#f7dbe3]">
                <Loader2 className="h-10 w-10 animate-spin text-[#7a1335]" />
            </div>
        );
    }

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
            <h1 className="text-2xl font-bold text-[#7a1335] mb-6">Payouts</h1>
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8">
                <div className="mb-4">
                    <div className="text-lg font-semibold text-gray-700">
                        Total Earnings:{" "}
                        <span className="text-[#7a1335]">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(earnings?.totalEarnings || 0)}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Withdrawal Balance:{" "}
                        <span className="text-green-700 font-semibold">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(earnings?.withdrawalBalance || 0)}
                        </span>
                    </div>
                    <div className="text-xs text-gray-400">
                        Minimum payout: ₹1,000
                    </div>
                </div>
                <form onSubmit={handleRequest} className="flex flex-col sm:flex-row gap-2 items-end">
                    <input
                        type="number"
                        min={1000}
                        max={earnings?.withdrawalBalance || 1000}
                        placeholder="Amount (min ₹1,000)"
                        className="px-3 py-2 border rounded w-full sm:w-40"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <select
                        className="px-3 py-2 border rounded w-full sm:w-40"
                        value={method}
                        onChange={(e) => {
                            setMethod(e.target.value);
                            setSelectedDetail('');
                        }}
                    >
                        <option value="UPI">UPI</option>
                        <option value="Bank">Bank Account</option>
                    </select>
                    <select
                        className="px-3 py-2 border rounded w-full sm:w-56"
                        value={selectedDetail}
                        onChange={(e) => setSelectedDetail(e.target.value)}
                        required
                        disabled={availablePayoutDetails.length === 0}
                    >
                        <option value="" disabled>Select Detail</option>
                        {availablePayoutDetails.map((d) => {
                            const detailValue = method === 'Bank' ? `Bank: ${d.bank} - Acct: ...${d.account.slice(-4)}` : `UPI: ${d.upiId}`;
                            return <option key={d.id} value={detailValue}>{detailValue}</option>
                        })}
                        {availablePayoutDetails.length === 0 && <option disabled>No {method} details found</option>}
                    </select>
                    <button
                        type="submit"
                        disabled={isRequesting}
                        className="bg-[#7a1335] hover:bg-[#5a0e28] text-white font-semibold px-6 py-2 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isRequesting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Request Payout'}
                    </button>
                </form>
            </div>
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payout History</h2>
                <div className="overflow-x-auto">
                    {payoutHistory.length === 0 ? (
                         <div className="text-center text-gray-500 py-8">You have no payout history.</div>
                    ) : (
                        <table className="min-w-full bg-white rounded-lg overflow-hidden text-xs sm:text-sm">
                            <thead className="bg-[#fdf6f8]">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Amount</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Method</th>
                                    <th className="px-4 py-3 text-left font-semibold text-[#7a1335]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payoutHistory.map((p) => (
                                    <tr key={p.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                        <td className="px-4 py-3">{new Date(p.requestedAt).toLocaleDateString('en-GB')}</td>
                                        <td className="px-4 py-3">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p.amount)}</td>
                                        <td className="px-4 py-3">{p.methodDetail}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                p.status === "Paid" ? "bg-green-100 text-green-700" :
                                                p.status === "Approved" ? "bg-blue-100 text-blue-700" :
                                                "bg-[#fbeaf0] text-[#7a1335]"
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerPayout;