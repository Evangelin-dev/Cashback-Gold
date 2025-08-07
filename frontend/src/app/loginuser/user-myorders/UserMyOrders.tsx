import { FileText, Loader2, Package, ShoppingBag, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import axiosInstance from '../../../utils/axiosInstance';
import Portal from '../../user/Portal';

interface OrderSummary {
  id: number;
  orderId: string;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  totalAmount: number;
  orderItems: {
    ornament: {
      mainImage: string;
    };
  }[];
}

interface OrderDetails extends OrderSummary {
  shippingAddress: {
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  orderItems: {
    quantity: number;
    price: number;
    ornament: {
      id: number;
      name: string;
      mainImage: string;
    };
  }[];
}

const MyOrders = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/signuppopup');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<OrderSummary[]>('/api/orders/my-orders');
        setOrders(response.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const handleViewDetails = async (orderId: number) => {
    setIsDetailLoading(true);
    try {
      const response = await axiosInstance.get<OrderDetails>(`/api/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (err) {
      console.error(`Failed to fetch details for order ${orderId}:`, err);
      alert("Could not load order details.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const getStatusBadge = (status: OrderSummary['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-[#7a1436]">My Orders</h1>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#7a1436]" />
            <p className="mt-2 text-gray-500">Fetching your order history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/buyornaments')} className="mt-4 rounded-lg bg-[#7a1436] px-5 py-2.5 font-semibold text-white transition-transform hover:scale-105">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-4 rounded-lg border-2 border-gray-100 bg-gray-50 hover:border-gray-200 transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>{order.status}</span>
                      <p className="font-bold text-gray-800">Order ID: #{order.orderId}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Placed on: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-bold text-lg text-gray-800">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.totalAmount)}</p>
                    </div>
                    <button onClick={() => handleViewDetails(order.id)} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#7a1436] border-2 border-gray-200 hover:border-[#7a1436] transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(isDetailLoading || selectedOrder) && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
              {isDetailLoading ? (
                  <div className="p-10 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-[#7a1436]" /></div>
              ) : selectedOrder && (
                  <>
                    <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"><X /></button>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Order Details</h2>
                        <p className="text-sm text-gray-500 mb-4">Order ID: #{selectedOrder.orderId}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="p-3 rounded-lg bg-gray-50">
                                <p className="font-semibold text-gray-700">Order Date</p>
                                <p>{new Date(selectedOrder.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50">
                                <p className="font-semibold text-gray-700">Total Amount</p>
                                <p>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(selectedOrder.totalAmount)}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-800 mb-2">Items Ordered ({selectedOrder.orderItems.length})</h3>
                          <div className="space-y-3">
                            {selectedOrder.orderItems.map(item => (
                              <div key={item.ornament.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                                <img src={item.ornament.mainImage} alt={item.ornament.name} className="h-16 w-16 rounded-md object-cover" />
                                <div className="flex-grow">
                                  <p className="font-semibold text-gray-800">{item.ornament.name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-700">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-rose-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                          <address className="not-italic text-sm text-gray-600">
                            <p className="font-bold">{selectedOrder.shippingAddress.fullName}</p>
                            <p>{selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.addressLine2}</p>
                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
                            <p>Mobile: {selectedOrder.shippingAddress.mobile}</p>
                          </address>
                        </div>
                    </div>
                  </>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default MyOrders;