import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { Loader, Inbox, CheckCircle, XCircle, User } from 'lucide-react';

interface Ticket {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: 'PENDING' | 'RESOLVED' | 'CLOSED';
  submittedAt: string;
}

type Status = 'PENDING' | 'RESOLVED' | 'CLOSED';

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const styles = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Inbox size={14} /> },
    RESOLVED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <CheckCircle size={14} /> },
    CLOSED: { bg: 'bg-gray-200', text: 'text-gray-700', icon: <XCircle size={14} /> },
  };
  const style = styles[status] || styles.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text}`}>
      {style.icon}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void; count: number }> = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
      active
        ? 'bg-[#7a1335] text-white shadow'
        : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
    <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-gray-300'}`}>{count}</span>
  </button>
);

function SupportTicket() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Status>('PENDING');
  
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(1);
  const [ticketCounts, setTicketCounts] = useState({ PENDING: 0, RESOLVED: 0, CLOSED: 0 });

  const fetchTickets = useCallback(async (status: Status, currentPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/api/b2b/support/admin/support-tickets?page=${currentPage}&size=10&status=${status}`);
      
    
      setTickets(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      
    
      setTicketCounts(prev => ({...prev, [status]: response.data.totalElements || 0}));

    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Could not load support tickets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets(activeTab, page);
  }, [activeTab, page, fetchTickets]);

  const handleStatusChange = async (ticketId: number, newStatus: Status) => {
    try {
      await axiosInstance.put(`/api/b2b/support/admin/support-tickets/${ticketId}/status?status=${newStatus}`);
      alert("Status updated successfully!");
      fetchTickets(activeTab, page);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("An error occurred while updating the status.");
    }
  };

  const handleTabClick = (status: Status) => {
    setActiveTab(status);
    setPage(0);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 min-h-[80vh]">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#7a1335' }}>
        <Inbox /> Support Tickets Management
      </h3>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          <TabButton label="Pending" active={activeTab === 'PENDING'} onClick={() => handleTabClick('PENDING')} count={ticketCounts.PENDING} />
          <TabButton label="Resolved" active={activeTab === 'RESOLVED'} onClick={() => handleTabClick('RESOLVED')} count={ticketCounts.RESOLVED} />
          <TabButton label="Closed" active={activeTab === 'CLOSED'} onClick={() => handleTabClick('CLOSED')} count={ticketCounts.CLOSED} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">User ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Subject</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <Loader className="mx-auto animate-spin h-8 w-8 text-[#7a1335]" />
                  <p className="mt-2 text-gray-500">Loading tickets...</p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-red-500">{error}</td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  No tickets found in the "{activeTab.toLowerCase()}" category.
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                        <User size={14} className="text-gray-400"/> User #{ticket.userId}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800">{ticket.subject}</p>
                    <p className="text-xs text-gray-500 max-w-xs truncate" title={ticket.message}>
                      {ticket.message}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(ticket.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value as Status)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-[#7a1335] focus:outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Previous</button>
        <span className="text-sm font-medium">Page {page + 1} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

export default SupportTicket;