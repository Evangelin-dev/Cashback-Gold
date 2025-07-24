import { Building2, Calendar, ChevronLeft, ChevronRight, Eye, Filter, Search, User, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct

// --- INTERFACES ---

// Type for a single order object coming directly from the API
interface OrderFromApi {
  id: number;
  orderId: string;
  userId: number;
  customerName: string;
  customerType: 'user' | 'b2b';
  planType: 'CHIT' | 'SIP' | 'SCHEME';
  planName: string;
  duration: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  address: string;
}

// Type for the overall API response structure
interface ApiResponse {
  totalPages: number;
  currentPage: number;
  content: OrderFromApi[];
  totalElements: number;
}

// The internal type used by the component for rendering
type Order = {
  id: string;
  customerName: string;
  customerType: 'user' | 'b2b';
  goldType: string;
  planType: 'CHIT' | 'SIP' | 'SCHEME';
  quantity: number;
  weight: string;
  price: number;
  date: string;
  status: string;
  paymentMethod: string;
  address: string;
};

const AOrderHistory = () => {
  // --- STATE MANAGEMENT ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'user' | 'b2b'>('all');
  const [productFilter, setProductFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const itemsPerPage = 10;

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const customerTypes = ['user', 'b2b'];
        const planTypes = ['SCHEME', 'SIP', 'CHIT'];
        const endpoints: string[] = [];

        customerTypes.forEach(cType => {
          planTypes.forEach(pType => {
            endpoints.push(`/api/orders?page=0&size=10&customerType=${cType}&planType=${pType}`);
          });
        });

        const responses = await Promise.all(
          endpoints.map(url => axiosInstance.get<ApiResponse>(url))
        );

        const allApiOrders = responses.flatMap(res => res.data.content);

        const processedOrders: Order[] = allApiOrders.map(order => ({
          id: order.orderId,
          customerName: order.customerName,
          customerType: order.customerType,
          goldType: order.planName,
          planType: order.planType,
          quantity: 1, // Mocked data as it's not in the API response
          weight: order.duration, // Using duration as a stand-in
          price: order.amount,
          date: new Date(order.createdAt).toLocaleDateString('en-CA'), // Formats to YYYY-MM-DD
          status: order.status.toLowerCase(),
          paymentMethod: order.paymentMethod,
          address: order.address,
        }));

        setOrders(processedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const availableProducts = ['CHIT', 'SIP', 'SCHEME'];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesCustomerType = filterType === 'all' || order.customerType === filterType;
      const matchesProduct = productFilter === 'all' || order.planType.toLowerCase() === productFilter.toLowerCase();
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.goldType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCustomerType && matchesProduct && matchesSearch;
    });
  }, [filterType, productFilter, searchTerm, orders]);

  const handleCustomerTypeChange = (newType: 'all' | 'user' | 'b2b') => {
    setFilterType(newType);
    setProductFilter('all');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const userOrders = orders.filter(order => order.customerType === 'user');
  const b2bOrders = orders.filter(order => order.customerType === 'b2b');
  const totalUserValue = userOrders.reduce((sum, order) => sum + order.price, 0);
  const totalB2BValue = b2bOrders.reduce((sum, order) => sum + order.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Manage and track all gold selling orders</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">Total Orders</p><p className="text-2xl font-bold text-gray-900">{orders.length}</p></div><div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center"><Calendar className="h-6 w-6 text-blue-600" /></div></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">User Orders</p><p className="text-2xl font-bold text-gray-900">{userOrders.length}</p><p className="text-sm text-gray-500">${totalUserValue.toLocaleString()}</p></div><div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center"><User className="h-6 w-6 text-green-600" /></div></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500">B2B Orders</p><p className="text-2xl font-bold text-gray-900">{b2bOrders.length}</p><p className="text-sm text-gray-500">${totalB2BValue.toLocaleString()}</p></div><div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center"><Building2 className="h-6 w-6 text-blue-600" /></div></div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
              <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-full sm:w-80"/></div>
              <div className="flex items-center gap-2"><Filter className="text-gray-400 h-4 w-4" /><select value={filterType} onChange={(e) => handleCustomerTypeChange(e.target.value as 'all' | 'user' | 'b2b')} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"><option value="all">All Customers</option><option value="user">Individual Users</option><option value="b2b">B2B Customers</option></select></div>
              <div className="flex items-center gap-2">
                <select value={productFilter} onChange={(e) => {setProductFilter(e.target.value); setCurrentPage(1);}} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                  <option value="all">All Products</option>
                  {availableProducts.map((product) => (<option key={product} value={product.toLowerCase()}>{product}</option>))}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">Showing {paginatedOrders.length} of {filteredOrders.length} orders</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading orders...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">{error}</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{order.id}</div><div className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{order.date}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-2">{order.customerType === 'b2b' ? <Building2 className="h-4 w-4 text-blue-500" /> : <User className="h-4 w-4 text-green-500" />}<div><div className="text-sm font-medium text-gray-900">{order.customerName}</div><div className="text-sm text-gray-500 capitalize">{order.customerType}</div></div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{order.goldType}</div><div className="text-sm text-gray-500">{order.weight}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">${order.price.toLocaleString()}</div><div className="text-sm text-gray-500">{order.paymentMethod}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button onClick={() => openOrderDetails(order)} className="text-yellow-600 hover:text-yellow-900 flex items-center gap-1"><Eye className="h-4 w-4" />View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && !error && paginatedOrders.length === 0 && (
              <div className="text-center py-12"><div className="text-gray-500">No orders found matching your criteria.</div></div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && !error && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"><ChevronLeft className="h-4 w-4" />Previous</button>
              <div className="flex space-x-1">{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (<button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === page ? 'bg-yellow-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}`}>{page}</button>))}</div>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1">Next<ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={closeOrderDetails}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-900">Order Details</h2><button onClick={closeOrderDetails} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="space-y-2"><div><span className="text-sm font-medium text-gray-500">Order ID:</span><span className="ml-2 text-sm text-gray-900">{selectedOrder.id}</span></div><div><span className="text-sm font-medium text-gray-500">Date:</span><span className="ml-2 text-sm text-gray-900">{selectedOrder.date}</span></div><div><span className="text-sm font-medium text-gray-500">Status:</span><span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div><div><span className="text-sm font-medium text-gray-500">Payment Method:</span><span className="ml-2 text-sm text-gray-900">{selectedOrder.paymentMethod}</span></div></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2"><div><span className="text-sm font-medium text-gray-500">Name:</span><span className="ml-2 text-sm text-gray-900">{selectedOrder.customerName}</span></div><div><span className="text-sm font-medium text-gray-500">Type:</span><span className="ml-2 text-sm text-gray-900 capitalize flex items-center gap-1">{selectedOrder.customerType === 'b2b' ? <Building2 className="h-4 w-4 text-blue-500" /> : <User className="h-4 w-4 text-green-500" />}{selectedOrder.customerType}</span></div><div><span className="text-sm font-medium text-gray-500">Address:</span><span className="ml-2 text-sm text-gray-900">{selectedOrder.address}</span></div></div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><span className="text-sm font-medium text-gray-500">Product:</span><div className="text-sm text-gray-900">{selectedOrder.goldType}</div></div><div><span className="text-sm font-medium text-gray-500">Quantity:</span><div className="text-sm text-gray-900">{selectedOrder.quantity} units</div></div><div><span className="text-sm font-medium text-gray-500">Weight:</span><div className="text-sm text-gray-900">{selectedOrder.weight}</div></div></div>
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