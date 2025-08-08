import { Building2, Calendar, ChevronLeft, ChevronRight, Eye, Filter, Loader2, Search, User, X } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

// --- TYPE DEFINITIONS ---

interface OrderFromApi {
  id: number;
  orderId: string;
  userId: number;
  customerName: string;
  customerType: 'user' | 'b2b';
  planType: 'CHIT' | 'SIP' | 'SCHEME' | 'ORNAMENT';
  planName: string;
  duration: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  address: string;
}

interface ApiResponse {
  totalPages: number;
  currentPage: number;
  content: OrderFromApi[];
  totalElements: number;
}

type Order = {
  id: string;
  customerName: string;
  customerType: 'user' | 'b2b';
  productSummary: string;
  products: { name: string; quantity: string }[];
  planType: 'CHIT' | 'SIP' | 'SCHEME' | 'ORNAMENT';
  price: number;
  date: string;
  status: string;
  paymentMethod: string;
  address: string;
};

// --- DEBOUNCE HOOK for search performance ---
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const AOrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and Search
  const [customerFilter, setCustomerFilter] = useState<'all' | 'user' | 'b2b'>('all');
  const [productFilter, setProductFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // --- DATA FETCHING (with server-side filtering & pagination) ---
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const params = new URLSearchParams({
            page: (currentPage - 1).toString(),
            size: itemsPerPage.toString(),
        });

        if (customerFilter !== 'all') params.append('customerType', customerFilter);
        if (productFilter !== 'all') params.append('planType', productFilter.toUpperCase());
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        
        const response = await axiosInstance.get<ApiResponse>('/api/orders', { params });
        const { content, totalPages: apiTotalPages } = response.data;
        
        const processedOrders: Order[] = content.map(order => {
            let products = [{ name: order.planName, quantity: order.duration || '1' }];
            let productSummary = order.planName;

            // Handling for ORNAMENT orders with multiple items
            if (order.planType === 'ORNAMENT' && order.planName.includes(',')) {
                const items = order.planName.split(',').map(item => item.trim());
                productSummary = items.join(', '); // Join with a comma and space for the title attribute
                products = items.map(itemStr => {
                    const parts = itemStr.split(' x');
                    return { name: parts[0] || 'Unknown Product', quantity: parts[1] || '1' };
                });
            }
            
            return {
                id: order.orderId,
                customerName: order.customerName,
                customerType: order.customerType,
                productSummary: productSummary,
                products: products,
                planType: order.planType,
                price: order.amount,
                date: new Date(order.createdAt).toLocaleDateString('en-CA'),
                status: order.status.toLowerCase(),
                paymentMethod: order.paymentMethod,
                address: order.address,
            };
        });

        setOrders(processedOrders);
        setTotalPages(apiTotalPages || 1);
    } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not load order history. Please try again later.");
    } finally {
        setLoading(false);
    }
  }, [currentPage, customerFilter, productFilter, debouncedSearchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [customerFilter, productFilter, debouncedSearchTerm]);

  const availableProducts = ['CHIT', 'SIP', 'SCHEME', 'ORNAMENT'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
              <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-full sm:w-80" /></div>
              <div className="flex items-center gap-2"><Filter className="text-gray-400 h-4 w-4" /><select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value as 'all' | 'user' )} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"><option value="all">All Customers</option><option value="user">Individual Users</option></select></div>
              <div className="flex items-center gap-2">
                <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option value="all">All Products</option>
                  {availableProducts.map((product) => (<option key={product} value={product.toLowerCase()}>{product}</option>))}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">Showing {orders.length} orders</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-500"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">{error}</div>
            ) : (
              // UPDATED: Added table-fixed for a more stable layout
              <table className="w-full table-fixed">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Order Details</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[13%]">Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{order.id}</div><div className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{order.date}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2">{order.customerType === 'b2b' ? <Building2 className="h-4 w-4 text-blue-500" /> : <User className="h-4 w-4 text-green-500" />}<div><div className="text-sm font-medium text-gray-900 truncate" title={order.customerName}>{order.customerName}</div><div className="text-sm text-gray-500 capitalize">{order.customerType}</div></div></div></td>
                      {/* UPDATED: Applied max-width and truncate classes to prevent layout breaking */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate" title={order.productSummary}>
                          {order.productSummary}
                        </div>
                        <div className="text-sm text-gray-500">{order.planType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">${order.price.toLocaleString()}</div><div className="text-sm text-gray-500">{order.paymentMethod}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button onClick={() => openOrderDetails(order)} className="text-yellow-600 hover:text-yellow-900 flex items-center gap-1"><Eye className="h-4 w-4" />View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && !error && orders.length === 0 && (
              <div className="text-center py-12"><div className="text-gray-500">No orders found matching your criteria.</div></div>
            )}
          </div>
        </div>

        {totalPages > 1 && !loading && !error && (
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"><ChevronLeft className="h-4 w-4" />Previous</button>
             <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1">Next<ChevronRight className="h-4 w-4" /></button>
          </div>
        )}
      </div>

      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeOrderDetails}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-900">Order Details</h2><button onClick={closeOrderDetails} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="space-y-2 text-sm"><div><span className="font-medium text-gray-500">Order ID:</span><span className="ml-2 text-gray-900">{selectedOrder.id}</span></div><div><span className="font-medium text-gray-500">Date:</span><span className="ml-2 text-gray-900">{selectedOrder.date}</span></div><div><span className="font-medium text-gray-500">Status:</span><span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div><div><span className="font-medium text-gray-500">Payment Method:</span><span className="ml-2 text-gray-900">{selectedOrder.paymentMethod}</span></div></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm"><div><span className="font-medium text-gray-500">Name:</span><span className="ml-2 text-gray-900">{selectedOrder.customerName}</span></div><div><span className="font-medium text-gray-500">Type:</span><span className="ml-2 text-gray-900 capitalize flex items-center gap-1">{selectedOrder.customerType === 'b2b' ? <Building2 className="h-4 w-4 text-blue-500" /> : <User className="h-4 w-4 text-green-500" />}{selectedOrder.customerType}</span></div><div><span className="font-medium text-gray-500">Address:</span><span className="ml-2 text-gray-900">{selectedOrder.address}</span></div></div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedOrder.products.map((product, index) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-800">{product.name}</span>
                        <span className="font-medium text-gray-600">Qty: {product.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200"><div className="flex justify-between items-center"><span className="text-lg font-semibold text-gray-900">Total Amount:</span><span className="text-lg font-bold text-yellow-600">${selectedOrder.price.toLocaleString()}</span></div></div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end"><button onClick={closeOrderDetails} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AOrderHistory;