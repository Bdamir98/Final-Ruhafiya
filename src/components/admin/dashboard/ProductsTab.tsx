"use client";
import React, { useState } from 'react';
import { RefreshCw, Search, Package, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  shipping_charge: number;
  is_active: boolean;
  stock_quantity: number;
}

interface ProductsTabProps {
  products: Product[];
  isLoadingProducts: boolean;
  productPage: number;
  productTotal: number;
  productQuery: string;
  productActiveFilter: string;
  newProduct: {
    name: string;
    price: number;
    shipping_charge: number;
    is_active: boolean;
    stock_quantity: number;
  };
  editingId: number | null;
  editFields: {
    name: string;
    price: number;
    shipping_charge: number;
    is_active: boolean;
    stock_quantity: number;
  };
  creatingProduct: boolean;
  savingProductId: number | null;
  togglingProductId: number | null;
  fetchProducts: (opts?: { page?: number; q?: string; active?: string }) => void;
  createProduct: (e: React.FormEvent) => void;
  startEdit: (product: Product) => void;
  saveEdit: (id: number) => void;
  cancelEdit: () => void;
  toggleProductActive: (id: number) => void;
  deleteProduct: (id: number) => void;
  setNewProduct: React.Dispatch<React.SetStateAction<{
    name: string;
    price: number;
    shipping_charge: number;
    is_active: boolean;
    stock_quantity: number;
  }>>;
  setEditFields: React.Dispatch<React.SetStateAction<{
    name: string;
    price: number;
    shipping_charge: number;
    is_active: boolean;
    stock_quantity: number;
  }>>;
  setNotice: (notice: string) => void;
  onProductQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductActiveFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onProductPageChange: (page: number) => void;
}

export default function ProductsTab({
  products,
  isLoadingProducts,
  productPage,
  productTotal,
  productQuery,
  productActiveFilter,
  newProduct,
  editingId,
  editFields,
  creatingProduct,
  savingProductId,
  togglingProductId,
  fetchProducts,
  createProduct,
  startEdit,
  saveEdit,
  cancelEdit,
  toggleProductActive,
  deleteProduct,
  setNewProduct,
  setEditFields,
  setNotice,
  onProductQueryChange,
  onProductActiveFilterChange,
  onProductPageChange
}: ProductsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              <input
                value={productQuery}
                onChange={onProductQueryChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchProducts({ page: 1, q: e.currentTarget.value });
                  }
                }}
                placeholder="Search products..."
                className="pl-8 pr-3 py-2 border rounded-md"
              />
            </div>
            <select
              value={productActiveFilter}
              onChange={onProductActiveFilterChange}
              className="border rounded px-2 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button
              onClick={() => fetchProducts()}
              className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
              disabled={isLoadingProducts}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </button>
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shipping</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((p: Product) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">
                      {editingId === p.id ? (
                        <input
                          className="border rounded px-2 py-1 w-48"
                          value={editFields.name}
                          onChange={e => setEditFields({ ...editFields, name: e.target.value })}
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === p.id ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-28"
                          value={editFields.price}
                          onChange={e => setEditFields({ ...editFields, price: Number(e.target.value) })}
                        />
                      ) : (
                        <>৳{p.price}</>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === p.id ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-28"
                          value={editFields.shipping_charge}
                          onChange={e => setEditFields({ ...editFields, shipping_charge: Number(e.target.value) })}
                        />
                      ) : (
                        <>৳{p.shipping_charge}</>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === p.id ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-24"
                          value={editFields.stock_quantity}
                          onChange={e => setEditFields({ ...editFields, stock_quantity: Number(e.target.value) })}
                        />
                      ) : (
                        <>{(p as any).stock_quantity ?? 0}</>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === p.id ? (
                        <label className="inline-flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editFields.is_active}
                            onChange={e => setEditFields({ ...editFields, is_active: e.target.checked })}
                          />
                          <span>{editFields.is_active ? 'Yes' : 'No'}</span>
                        </label>
                      ) : (
                        p.is_active ? 'Yes' : 'No'
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {editingId === p.id ? (
                        <>
                          <button
                            className="px-2 py-1 text-sm bg-green-600 text-white rounded disabled:opacity-60"
                            onClick={() => saveEdit(p.id)}
                            disabled={savingProductId === p.id}
                          >
                            {savingProductId === p.id ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            className="px-2 py-1 text-sm border rounded"
                            onClick={cancelEdit}
                            disabled={savingProductId === p.id}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-2 py-1 text-sm border rounded"
                            onClick={() => startEdit(p)}
                            disabled={togglingProductId === p.id}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 text-sm border rounded disabled:opacity-60"
                            onClick={() => toggleProductActive(p.id)}
                            disabled={togglingProductId === p.id}
                          >
                            {togglingProductId === p.id ? 'Updating...' : (p.is_active ? 'Deactivate' : 'Activate')}
                          </button>
                          <button
                            className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => deleteProduct(p.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={8}>No products</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-600">
          <span>Page {productPage} • Total {productTotal}</span>
          <div className="space-x-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => onProductPageChange(Math.max(1, productPage - 1))}
              disabled={productPage <= 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => onProductPageChange(productPage + 1)}
              disabled={(productPage * 10) >= productTotal}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={createProduct} className="bg-white shadow rounded-lg p-6 space-y-4">
        <h3 className="text-md font-semibold text-gray-900 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            required
            disabled={creatingProduct}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            min={0}
            required
            disabled={creatingProduct}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Shipping Charge"
            value={newProduct.shipping_charge}
            onChange={e => setNewProduct({ ...newProduct, shipping_charge: Number(e.target.value) })}
            min={0}
            disabled={creatingProduct}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Stock Qty"
            value={newProduct.stock_quantity}
            onChange={e => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })}
            min={0}
            disabled={creatingProduct}
          />
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newProduct.is_active}
              onChange={e => setNewProduct({ ...newProduct, is_active: e.target.checked })}
              disabled={creatingProduct}
            />
            <span>Active</span>
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
          disabled={creatingProduct}
        >
          {creatingProduct ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}