import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/axiosInstance';


interface FAQ {
  id: number;
  question: string;
  answer: string;
  type: string;
}

const faqTypes = ['HOME', 'CHIT', 'SIP', 'SCHEME'];

const ManageFaq: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', type: 'SIP' });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);

  const pageSize = 5;


  const fetchFaqs = useCallback(async () => {
    setLoading(true);

    try {
      const searchParam = searchTerm ? searchTerm : 'reset';
      const typeParam = filterType === 'All' ? '' : `&type=${filterType}`;
      const url = `/api/faqs?${typeParam}&page=${currentPage}&size=${pageSize}`;
      const response = await axiosInstance.get(url);
      setFaqs(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setError(null);
    } catch (err) {
      setError('Failed to fetch FAQs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleAddNew = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', type: 'SIP' });
    setIsModalOpen(true);
  };


  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer, type: faq.type });
    setIsModalOpen(true);
  };


    const handleCreateFaq = async () => {
    const payload = {
      question: formData.question,
      answer: formData.answer,
      type: formData.type,
    };


    try {
      await axiosInstance.post('/api/faqs', payload);
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err: any) {
      console.error('CREATE operation failed:', err.response || err);
      alert(`Failed to create FAQ. Server responded with status: ${err.response?.status}`);
    }
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      handleUpdateFaq();
    } else {
      handleCreateFaq();
    }
  };

    const handleUpdateFaq = async () => {
    if (!editingFaq) return; 

    const payload = {
      question: formData.question,
      answer: formData.answer,
      type: formData.type,
    };

    console.log(`Attempting to UPDATE FAQ ${editingFaq.id} with payload:`, payload);

    try {
      await axiosInstance.put(`/api/faqs/${editingFaq.id}`, payload);
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err: any) {
      console.error('UPDATE operation failed:', err.response || err);
      alert(`Failed to update FAQ. Server responded with status: ${err.response?.status}`);
    }
  };


  const handleDelete = (id: number) => {
    setFaqToDelete(id);
    setIsDeleteConfirmOpen(true);
  };


  const confirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      await axiosInstance.delete(`/api/faqs/${faqToDelete}`);
      setIsDeleteConfirmOpen(false);
      setFaqToDelete(null);

      if (faqs.length === 1 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchFaqs();
      }
    } catch (err) {
      setError('Failed to delete FAQ.');
      console.error(err);
    }
  };


  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, filterType]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage FAQs</h1>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-[#7a1335] text-white rounded-md hover:bg-[#630f2a] transition-colors"
          >
            + Add New FAQ
          </button>
        </div>

        <div className="flex gap-4 mb-4 p-4 bg-white rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search by question..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
          />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
          >
            <option value="All">All Types</option>
            {faqTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faqs.map((faq) => (
                    <tr key={faq.id}>
                      <td className="px-6 py-4 whitespace-normal w-1/3 font-medium text-gray-900">{faq.question}</td>
                      <td className="px-6 py-4 whitespace-normal w-1/2 text-gray-600">{faq.answer}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">{faq.type}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(faq)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(faq.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg shadow-sm">
              <span className="text-sm text-gray-700">
                Showing page {currentPage + 1} of {totalPages} ({totalElements} total results)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#7a1335]"
                  required
                >
                  {faqTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#7a1335] text-white rounded-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this FAQ? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-6 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaq;