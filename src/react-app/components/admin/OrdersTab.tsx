"use client";
import React, { useState, useCallback } from 'react';
import { RefreshCw, Search, ShoppingCart, TrendingUp, Package, Users, Download, Filter } from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  full_name: string;
  mobile_number: string;
  full_address: string;
  product_id: number;
  product_name?: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrdersTabProps {
  orders: Order[];
  isLoading: boolean;
  orderPage: number;
  orderTotal: number;
  orderQuery: string;
  orderStatusFilter: string;
  selectedOrders: number[];
  bulkStatus: string;
  fetchOrders: (opts?: { page?: number; q?: string; status?: string }) => void;
  updateOrderStatus: (orderId: number, status: string) => void;
  deleteOrder: (orderId: number) => void;
  bulkUpdateStatus: () => void;
  bulkDeleteOrders: () => void;
  exportOrdersCSV: () => void;
  toggleOrderSelection: (id: number) => void;
  selectAllOrders: () => void;
  setOrderQuery: (query: string) => void;
  setOrderStatusFilter: (filter: string) => void;
  setBulkStatus: (status: string) => void;
  setNotice: (notice: string) => void;
  onOrderQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onOrderPageChange: (page: number) => void;
}

export default function OrdersTab({
  orders,
  isLoading,
  orderPage,
  orderTotal,
  orderQuery,
  orderStatusFilter,
  selectedOrders,
  bulkStatus,
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
  bulkUpdateStatus,
  bulkDeleteOrders,
  exportOrdersCSV,
  toggleOrderSelection,
  selectAllOrders,
  setBulkStatus,
  setNotice,
  onOrderQueryChange,
  onOrderStatusFilterChange,
  onOrderPageChange
}: OrdersTabProps) {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">৳{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              <input
                value={orderQuery}
                onChange={onOrderQueryChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchOrders({ page: 1, q: e.currentTarget.value });
                  }
                }}
                placeholder="Search orders..."
                className="pl-8 pr-3 py-2 border rounded-md"
              />
            </div>
            <select
              value={orderStatusFilter}
              onChange={onOrderStatusFilterChange}
              className="border rounded px-2 py-2 text-sm"
            >
              <option value="">All</option>
              {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s =>
                <option key={s} value={s}>{s}</option>
              )}
            </select>
            <button
              onClick={() => fetchOrders()}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onChange={selectAllOrders}
                className="mr-2"
              />
              <span>Select All ({selectedOrders.length} selected)</span>
            </label>

            {selectedOrders.length > 0 && (
              <>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={bulkUpdateStatus}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  onClick={bulkDeleteOrders}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete Selected
                </button>
              </>
            )}

            <button
              onClick={exportOrdersCSV}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.full_name}</div>
                        <div className="text-sm text-gray-500">{order.mobile_number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={order.full_address}>
                        {order.full_address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product_name || `Product ID: ${order.product_id}`} (x{order.quantity})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{order.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        className="border rounded px-2 py-1"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No orders found
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-600">
          <span>Page {orderPage} • Total {orderTotal}</span>
          <div className="space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => onOrderPageChange(Math.max(1, orderPage - 1))}
              disabled={orderPage <= 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => onOrderPageChange(orderPage + 1)}
              disabled={(orderPage * 10) >= orderTotal}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}