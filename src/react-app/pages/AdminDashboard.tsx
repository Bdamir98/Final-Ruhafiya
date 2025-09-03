"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Package, Users, TrendingUp, LogOut, RefreshCw, Plus, FileText, Bell, Settings as SettingsIcon, Search, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  shipping_charge: number;
  is_active: boolean;
  stock_quantity: number;
}

interface AdminUser {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  last_login_at?: string | null;
  created_at?: string;
}

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message?: string | null;
  created_at: string;
}

interface Customer {
  id: number;
  full_name: string;
  mobile_number: string;
  full_address: string;
  email?: string;
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'content' | 'users' | 'customers' | 'notifications' | 'settings' | 'analytics'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, shipping_charge: 0, is_active: true, stock_quantity: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<{ name: string; price: number; shipping_charge: number; is_active: boolean; stock_quantity: number }>({ name: '', price: 0, shipping_charge: 0, is_active: true, stock_quantity: 0 });
  const [contentJson, setContentJson] = useState<string>('{}');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string>('');
  const [contentSaving, setContentSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [content, setContent] = useState<Record<string, any>>({});
  const [flatContent, setFlatContent] = useState<Record<string, string>>({});
  const [activeContentTab, setActiveContentTab] = useState('hero');
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [savingProductId, setSavingProductId] = useState<number | null>(null);
  const [togglingProductId, setTogglingProductId] = useState<number | null>(null);
  // pagination + search state
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');

  const [productPage, setProductPage] = useState(1);
  const [productTotal, setProductTotal] = useState(0);
  const [productQuery, setProductQuery] = useState('');
  const [productActiveFilter, setProductActiveFilter] = useState<string>('');

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersQuery, setUsersQuery] = useState('');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersTotal, setCustomersTotal] = useState(0);
  const [customersQuery, setCustomersQuery] = useState('');
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifPage, setNotifPage] = useState(1);
  const [notifTotal, setNotifTotal] = useState(0);
  const [notifQuery, setNotifQuery] = useState('');
  const [creatingNotif, setCreatingNotif] = useState(false);
  const [newNotif, setNewNotif] = useState({ type: '', title: '', message: '' });
  const router = useRouter();

  // Bulk selection state
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      router.replace('/admin/login');
      return;
    }
    fetchOrders();
    // Preload products and content for faster tab switch
    fetchProducts();
    fetchWebsiteContent();
  }, [router]);

  const fetchOrders = async (opts?: { page?: number; q?: string; status?: string }) => {
    try {
      const page = opts?.page ?? orderPage;
      const sp = new URLSearchParams();
      sp.set('page', String(page));
      sp.set('pageSize', '10');
      if (opts?.q ?? orderQuery) sp.set('q', (opts?.q ?? orderQuery));
      if (opts?.status ?? orderStatusFilter) sp.set('status', (opts?.status ?? orderStatusFilter));
      const response = await fetch(`/api/admin/orders?${sp.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders);
        setOrderTotal(data.total ?? data.orders?.length ?? 0);
        setOrderPage(data.page ?? page);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFlatContent = (key: string, value: string) => {
    setFlatContent(prev => ({ ...prev, [key]: value }));
  };

  const addFlatField = () => {
    const newKey = `field_${Date.now()}`;
    setFlatContent(prev => ({ ...prev, [newKey]: '' }));
  };

  const removeFlatField = (key: string) => {
    setFlatContent(prev => {
      const newContent = { ...prev };
      delete newContent[key];
      return newContent;
    });
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditFields({
      name: p.name,
      price: Number(p.price),
      shipping_charge: Number(p.shipping_charge),
      is_active: !!p.is_active,
      stock_quantity: Number((p as any).stock_quantity ?? 0),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    try {
      setSavingProductId(id);
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFields.name,
          price: Number(editFields.price),
          shipping_charge: Number(editFields.shipping_charge),
          is_active: editFields.is_active,
          stock_quantity: Number(editFields.stock_quantity),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.map(p => (p.id === id ? data.product : p)));
        setEditingId(null);
        setNotice('Product updated');
        setTimeout(() => setNotice(''), 2000);
      }
    } catch (e) {
      console.error('Failed to update product', e);
    } finally {
      setSavingProductId(null);
    }
  };

  const toggleProductActive = async (id: number) => {
    try {
      setTogglingProductId(id);
      const res = await fetch(`/api/admin/products/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.map(p => (p.id === id ? data.product : p)));
        setNotice(data.product.is_active ? 'Product activated' : 'Product deactivated');
        setTimeout(() => setNotice(''), 2000);
      }
    } catch (e) {
      console.error('Failed to toggle product', e);
    } finally {
      setTogglingProductId(null);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setNotice('Product deleted');
        setTimeout(() => setNotice(''), 2000);
      } else {
        alert('Failed to delete product');
      }
    } catch (e) {
      alert('Error deleting product');
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchOrders(); // refresh
        setNotice('Order deleted');
        setTimeout(() => setNotice(''), 2000);
      } else {
        alert('Failed to delete order');
      }
    } catch (e) {
      alert('Error deleting order');
    }
  };

  // Bulk selection functions
  const toggleOrderSelection = (id: number) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAllOrders = () => {
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map(o => o.id));
  };

  const bulkUpdateStatus = async () => {
    if (!selectedOrders.length || !bulkStatus) return;
    if (!window.confirm(`Update status for ${selectedOrders.length} selected orders?`)) return;
    for (const id of selectedOrders) {
      await updateOrderStatus(id, bulkStatus);
    }
    setSelectedOrders([]);
    setBulkStatus('');
    setNotice('Bulk status update completed');
    setTimeout(() => setNotice(''), 2000);
  };

  const bulkDeleteOrders = async () => {
    if (!selectedOrders.length) return;
    if (!window.confirm(`Delete ${selectedOrders.length} selected orders? This action cannot be undone.`)) return;
    for (const id of selectedOrders) {
      await deleteOrder(id);
    }
    setSelectedOrders([]);
  };

  // CSV export functions
  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportOrdersCSV = () => {
    const csv = 'ID,Order Number,Customer,Phone,Address,Product,Amount,Status,Date\n' + orders.map(o => `${o.id},"${o.order_number}","${o.full_name}","${o.mobile_number}","${o.full_address}","${o.product_name}",${o.total_amount},"${o.status}","${new Date(o.created_at).toLocaleDateString()}"`).join('\n');
    downloadCSV(csv, 'orders.csv');
  };

  const fetchProducts = async (opts?: { page?: number; q?: string; active?: string }) => {
    setIsLoadingProducts(true);
    try {
      const page = opts?.page ?? productPage;
      const sp = new URLSearchParams();
      sp.set('page', String(page));
      sp.set('pageSize', '10');
      if (opts?.q ?? productQuery) sp.set('q', (opts?.q ?? productQuery));
      if (opts?.active ?? productActiveFilter) sp.set('active', (opts?.active ?? productActiveFilter));
      const res = await fetch(`/api/admin/products?${sp.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
        setProductTotal(data.total ?? (data.products?.length ?? 0));
        setProductPage(data.page ?? page);
      }
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingProduct(true);
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
          shipping_charge: Number(newProduct.shipping_charge),
          is_active: newProduct.is_active,
          stock_quantity: Number(newProduct.stock_quantity),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => [...prev, data.product]);
        setNewProduct({ name: '', price: 0, shipping_charge: 0, is_active: true, stock_quantity: 0 });
        setNotice('Product created');
        setTimeout(() => setNotice(''), 2000);
      }
    } catch (e) {
      console.error('Failed to create product', e);
    } finally {
      setCreatingProduct(false);
    }
  };

  // Users API
  const fetchUsers = async (pageArg?: number, qArg?: string) => {
    try {
      const page = pageArg ?? usersPage;
      const sp = new URLSearchParams();
      sp.set('page', String(page));
      sp.set('pageSize', '10');
      const q = qArg ?? usersQuery;
      if (q) sp.set('q', q);
      const res = await fetch(`/api/admin/users?${sp.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setUsersTotal(data.total ?? (data.users?.length ?? 0));
        setUsersPage(data.page ?? page);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        setNotice('User deleted');
        setTimeout(() => setNotice(''), 2000);
      } else {
        alert('Failed to delete user');
      }
    } catch (e) {
      alert('Error deleting user');
    }
  };

  // Notifications API
  const fetchNotifications = async (pageArg?: number, qArg?: string) => {
    try {
      const page = pageArg ?? notifPage;
      const sp = new URLSearchParams();
      sp.set('page', String(page));
      sp.set('pageSize', '10');
      const q = qArg ?? notifQuery;
      if (q) sp.set('q', q);
      const res = await fetch(`/api/admin/notifications?${sp.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setNotifTotal(data.total ?? (data.notifications?.length ?? 0));
        setNotifPage(data.page ?? page);
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  const createNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingNotif(true);
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif),
      });
      const data = await res.json();
      if (res.ok) {
        // Prepend new notification and reset form
        setNotifications(prev => [data.notification, ...prev]);
        setNewNotif({ type: '', title: '', message: '' });
        setNotice('Notification created');
        setTimeout(() => setNotice(''), 2000);
      }
    } catch (e) {
      console.error('Failed to create notification', e);
    } finally {
      setCreatingNotif(false);
    }
  };

  const fetchWebsiteContent = async () => {
    setIsLoadingContent(true);
    setContentError('');
    try {
      const res = await fetch('/api/admin/website-content');
      const data = await res.json();
      if (res.ok) {
        setContent(data.content || {});
        setContentJson(JSON.stringify(data.content || {}, null, 2));
        // Convert nested structure to flat key-value pairs
        const flatObj: Record<string, string> = {};
        const flattenObject = (obj: any, prefix = '') => {
          Object.entries(obj).forEach(([key, value]) => {
            const newKey = prefix ? `${prefix}_${key}` : key;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              flattenObject(value, newKey);
            } else {
              flatObj[newKey] = typeof value === 'string' ? value : JSON.stringify(value);
            }
          });
        };
        flattenObject(data.content || {});
        setFlatContent(flatObj);
      }
    } catch (e) {
      console.error('Failed to fetch website content', e);
      setContentError('Failed to fetch content');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const fetchCustomers = async (opts?: { page?: number; q?: string }) => {
    setIsLoadingCustomers(true);
    try {
      const page = opts?.page ?? customersPage;
      const sp = new URLSearchParams();
      sp.set('page', String(page));
      sp.set('pageSize', '10');
      const q = opts?.q ?? customersQuery;
      if (q) sp.set('q', q);

      const response = await fetch(`/api/admin/customers?${sp.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setCustomers(data.customers || []);
        setCustomersTotal(data.total ?? 0);
        setCustomersPage(data.page ?? page);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };


  const saveWebsiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentError('');
    try {
      setContentSaving(true);

      // Convert flat content back to nested structure for saving
      const nestedContent: Record<string, any> = {};
      Object.entries(flatContent).forEach(([key, value]) => {
        const keys = key.split('_');
        let current = nestedContent;

        keys.forEach((k, index) => {
          if (index === keys.length - 1) {
            current[k] = value;
          } else {
            if (!current[k]) current[k] = {};
            current = current[k];
          }
        });
      });

      console.log('Flat content:', flatContent);
      console.log('Nested content to save:', nestedContent);

      const res = await fetch('/api/admin/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: nestedContent }),
      });

      console.log('API response status:', res.status);
      const responseData = await res.json();
      console.log('API response data:', responseData);

      if (!res.ok) {
        setContentError(responseData.error || 'Failed to save');
        console.error('Save failed:', responseData);
      } else {
        setNotice('Content saved');
        setTimeout(() => setNotice(''), 2000);
        // Refresh content to show updated data
        await fetchWebsiteContent();
        // Trigger frontend content refresh
        window.dispatchEvent(new CustomEvent('contentRefresh'));
      }
    } catch (e) {
      console.error('Save error:', e);
      setContentError('Failed to save content');
    } finally {
      setContentSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.replace('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Analytics data processing
  const orderTrendsData = Object.entries(orders.reduce((acc: Record<string, number>, o) => {
    const date = new Date(o.created_at).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(([date, orders]) => ({ date, orders }));

  const revenueData = Object.entries(orders.reduce((acc: Record<string, number>, o) => {
    const date = new Date(o.created_at).toDateString();
    acc[date] = (acc[date] || 0) + o.total_amount;
    return acc;
  }, {} as Record<string, number>)).map(([date, revenue]) => ({ date, revenue }));

  const productData = Object.entries(orders.reduce((acc: Record<string, number>, o) => {
    const productKey = o.product_name || `Product ${o.product_id}`;
    acc[productKey] = (acc[productKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(([name, orders]) => ({ name, orders }));

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {notice && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow">
          {notice}
        </div>
      )}
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white/90 backdrop-blur border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-xl font-semibold tracking-tight">Ruhafiya Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${activeTab==='orders' ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent hover:bg-gray-50 text-gray-700'}`}>
            <ShoppingCart className="w-5 h-5 mr-2"/> Orders
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${activeTab==='products' ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent hover:bg-gray-50 text-gray-700'}`}>
            <Package className="w-5 h-5 mr-2"/> Products
          </button>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${activeTab==='content' ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent hover:bg-gray-50 text-gray-700'}`}>
            <FileText className="w-5 h-5 mr-2"/> Website Content
          </button>

          <button onClick={() => { setActiveTab('customers'); fetchCustomers(); }} className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${activeTab==='customers' ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent hover:bg-gray-50 text-gray-700'}`}>
            <Users className="w-5 h-5 mr-2"/> Customers
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${activeTab==='notifications' ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent hover:bg-gray-50 text-gray-700'}`}>
            <Bell className="w-5 h-5 mr-2"/> Notifications
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${activeTab==='settings' ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent hover:bg-gray-50 text-gray-700'}`}>
            <SettingsIcon className="w-5 h-5 mr-2"/> Settings
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${activeTab==='analytics' ? 'border-green-600 bg-green-50 text-green-700' : 'border-transparent hover:bg-gray-50 text-gray-700'}`}>
            <BarChart3 className="w-5 h-5 mr-2"/> Analytics
          </button>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full inline-flex items-center justify-center px-3 py-2 border rounded-md hover:bg-gray-50">
            <LogOut className="w-4 h-4 mr-2"/> Logout
          </button>
        </div>
      </aside>

      {/* Topbar for small screens */}
      <header className="lg:hidden bg-white/90 backdrop-blur shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Ruhafiya Admin</h1>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 capitalize">{activeTab}</h2>
          </div>

        {activeTab === 'orders' && (
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
                <input value={orderQuery} onChange={(e)=>setOrderQuery(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') fetchOrders({ page: 1, q: e.currentTarget.value }); }} placeholder="Search orders..." className="pl-8 pr-3 py-2 border rounded-md" />
              </div>
              <select value={orderStatusFilter} onChange={(e)=>{ setOrderStatusFilter(e.target.value); fetchOrders({ page: 1, status: e.target.value }); }} className="border rounded px-2 py-2 text-sm">
                <option value="">All</option>
                {['pending','confirmed','shipped','delivered','cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={()=>fetchOrders()} className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50">
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
                          {['pending','confirmed','shipped','delivered','cancelled'].map(s => (
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
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=Math.max(1, orderPage-1); setOrderPage(p); fetchOrders({ page: p }); }} disabled={orderPage<=1}>Prev</button>
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=orderPage + 1; setOrderPage(p); fetchOrders({ page: p }); }} disabled={(orderPage*10) >= orderTotal}>Next</button>
            </div>
          </div>
        </div>
        </>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                    <input value={productQuery} onChange={(e)=>setProductQuery(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') fetchProducts({ page: 1, q: e.currentTarget.value }); }} placeholder="Search products..." className="pl-8 pr-3 py-2 border rounded-md" />
                  </div>
                  <select value={productActiveFilter} onChange={(e)=>{ setProductActiveFilter(e.target.value); fetchProducts({ page: 1, active: e.target.value }); }} className="border rounded px-2 py-2 text-sm">
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <button onClick={()=>fetchProducts()} className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50" disabled={isLoadingProducts}>
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
                              <input className="border rounded px-2 py-1 w-48" value={editFields.name} onChange={e => setEditFields({ ...editFields, name: e.target.value })} />
                            ) : (
                              p.name
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {editingId === p.id ? (
                              <input type="number" className="border rounded px-2 py-1 w-28" value={editFields.price} onChange={e => setEditFields({ ...editFields, price: Number(e.target.value) })} />
                            ) : (
                              <>৳{p.price}</>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {editingId === p.id ? (
                              <input type="number" className="border rounded px-2 py-1 w-28" value={editFields.shipping_charge} onChange={e => setEditFields({ ...editFields, shipping_charge: Number(e.target.value) })} />
                            ) : (
                              <>৳{p.shipping_charge}</>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {editingId === p.id ? (
                              <input type="number" className="border rounded px-2 py-1 w-24" value={editFields.stock_quantity} onChange={e => setEditFields({ ...editFields, stock_quantity: Number(e.target.value) })} />
                            ) : (
                              <>{(p as any).stock_quantity ?? 0}</>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {editingId === p.id ? (
                              <label className="inline-flex items-center space-x-2">
                                <input type="checkbox" checked={editFields.is_active} onChange={e => setEditFields({ ...editFields, is_active: e.target.checked })} />
                                <span>{editFields.is_active ? 'Yes' : 'No'}</span>
                              </label>
                            ) : (
                              p.is_active ? 'Yes' : 'No'
                            )}
                          </td>
                          <td className="px-4 py-2 space-x-2">
                            {editingId === p.id ? (
                              <>
                                <button className="px-2 py-1 text-sm bg-green-600 text-white rounded disabled:opacity-60" onClick={() => saveEdit(p.id)} disabled={savingProductId === p.id}>
                                  {savingProductId === p.id ? 'Saving...' : 'Save'}
                                </button>
                                <button className="px-2 py-1 text-sm border rounded" onClick={cancelEdit} disabled={savingProductId === p.id}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <button className="px-2 py-1 text-sm border rounded" onClick={() => startEdit(p)} disabled={togglingProductId === p.id}>Edit</button>
                                <button className="px-2 py-1 text-sm border rounded disabled:opacity-60" onClick={() => toggleProductActive(p.id)} disabled={togglingProductId === p.id}>
                                  {togglingProductId === p.id ? 'Updating...' : (p.is_active ? 'Deactivate' : 'Activate')}
                                </button>
                                <button className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700" onClick={() => deleteProduct(p.id)}>
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
                  <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=Math.max(1, productPage-1); setProductPage(p); fetchProducts({ page: p }); }} disabled={productPage<=1}>Prev</button>
                  <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=productPage + 1; setProductPage(p); fetchProducts({ page: p }); }} disabled={(productPage*10) >= productTotal}>Next</button>
                </div>
              </div>
            </div>

            <form onSubmit={createProduct} className="bg-white shadow rounded-lg p-6 space-y-4">
              <h3 className="text-md font-semibold text-gray-900 flex items-center"><Plus className="w-4 h-4 mr-2"/>Create Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input className="border rounded px-3 py-2" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required disabled={creatingProduct} />
                <input type="number" className="border rounded px-3 py-2" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} min={0} required disabled={creatingProduct} />
                <input type="number" className="border rounded px-3 py-2" placeholder="Shipping Charge" value={newProduct.shipping_charge} onChange={e => setNewProduct({ ...newProduct, shipping_charge: Number(e.target.value) })} min={0} disabled={creatingProduct} />
                <input type="number" className="border rounded px-3 py-2" placeholder="Stock Qty" value={newProduct.stock_quantity} onChange={e => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })} min={0} disabled={creatingProduct} />
                <label className="inline-flex items-center space-x-2">
                  <input type="checkbox" checked={newProduct.is_active} onChange={e => setNewProduct({ ...newProduct, is_active: e.target.checked })} disabled={creatingProduct} />
                  <span>Active</span>
                </label>
              </div>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60" disabled={creatingProduct}>
                {creatingProduct ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                  <input value={usersQuery} onChange={(e)=>setUsersQuery(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') fetchUsers(1, e.currentTarget.value); }} placeholder="Search users..." className="pl-8 pr-3 py-2 border rounded-md" />
                </div>
                <button onClick={()=>fetchUsers()} className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><RefreshCw className="w-4 h-4 mr-2"/>Refresh</button>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="px-4 py-2">{u.id}</td>
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.is_active ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length===0 && (<tr><td className="px-4 py-6 text-center text-gray-500" colSpan={6}>No users</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-600">
              <span>Page {usersPage} • Total {usersTotal}</span>
              <div className="space-x-2">
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=Math.max(1, usersPage-1); setUsersPage(p); fetchUsers(p); }} disabled={usersPage<=1}>Prev</button>
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=usersPage+1; setUsersPage(p); fetchUsers(p); }} disabled={(usersPage*10) >= usersTotal}>Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                  <input value={customersQuery} onChange={(e)=>setCustomersQuery(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') fetchCustomers({ page: 1, q: e.currentTarget.value }); }} placeholder="Search customers..." className="pl-8 pr-3 py-2 border rounded-md" />
                </div>
                <button onClick={()=>fetchCustomers()} className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><RefreshCw className="w-4 h-4 mr-2"/>Refresh</button>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td className="px-4 py-2">{c.id}</td>
                      <td className="px-4 py-2">{c.full_name}</td>
                      <td className="px-4 py-2">{c.mobile_number}</td>
                      <td className="px-4 py-2 max-w-xs truncate" title={c.full_address}>{c.full_address}</td>
                      <td className="px-4 py-2">{c.total_orders}</td>
                      <td className="px-4 py-2">৳{c.total_spent.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                  {customers.length===0 && (<tr><td className="px-4 py-6 text-center text-gray-500" colSpan={7}>No customers yet</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-600">
              <span>Page {customersPage} • Total {customersTotal}</span>
              <div className="space-x-2">
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=Math.max(1, customersPage-1); setCustomersPage(p); fetchCustomers({ page: p }); }} disabled={customersPage<=1}>Prev</button>
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=customersPage+1; setCustomersPage(p); fetchCustomers({ page: p }); }} disabled={(customersPage*10) >= customersTotal}>Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                  <input value={notifQuery} onChange={(e)=>setNotifQuery(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') fetchNotifications(1, e.currentTarget.value); }} placeholder="Search notifications..." className="pl-8 pr-3 py-2 border rounded-md" />
                </div>
                <button onClick={()=>fetchNotifications()} className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><RefreshCw className="w-4 h-4 mr-2"/>Refresh</button>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map(n => (
                    <tr key={n.id}>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          n.type === 'order' ? 'bg-green-100 text-green-800' :
                          n.type === 'product' ? 'bg-blue-100 text-blue-800' :
                          n.type === 'user' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {n.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-medium">{n.title}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 max-w-md truncate" title={n.message || ''}>{n.message || ''}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{new Date(n.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                  {notifications.length===0 && (<tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No notifications yet</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-600">
              <span>Page {notifPage} • Total {notifTotal}</span>
              <div className="space-x-2">
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=Math.max(1, notifPage-1); setNotifPage(p); fetchNotifications(p); }} disabled={notifPage<=1}>Prev</button>
                <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={()=>{ const p=notifPage+1; setNotifPage(p); fetchNotifications(p); }} disabled={(notifPage*10) >= notifTotal}>Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Settings</h2>
            <p className="text-gray-600 text-sm">Basic settings can be added here in future (e.g., store preferences, payment settings).</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-semibold mb-4">Order Trends</h3>
                <LineChart width={400} height={300} data={orderTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                </LineChart>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-4">Revenue Analytics</h3>
                <BarChart width={400} height={300} data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-4">Product Performance</h3>
                <PieChart width={400} height={300}>
                  <Pie dataKey="orders" data={productData} cx={200} cy={150} outerRadius={80} fill="#8884d8" label />
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Website Content</h2>
              <div className="flex items-center gap-2">
                <button type="button" onClick={addFlatField} className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50">
                  <Plus className="w-4 h-4 mr-2"/> Add Field
                </button>
                <button onClick={fetchWebsiteContent} className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50" type="button">
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </button>
              </div>
            </div>

            <form onSubmit={saveWebsiteContent} className="p-6 space-y-6">
              {isLoadingContent ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(flatContent).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">{key}</label>
                        <button
                          type="button"
                          onClick={() => removeFlatField(key)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        value={value}
                        onChange={(e) => updateFlatContent(key, e.target.value)}
                        className="w-full border rounded px-3 py-2 min-h-[60px]"
                        placeholder="Enter content..."
                        disabled={contentSaving}
                      />
                    </div>
                  ))}

                  {Object.keys(flatContent).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No content fields. Click "Add Field" to create your first field.
                    </div>
                  )}
                </div>
              )}

              {contentError && <div className="text-red-600 text-sm">{contentError}</div>}
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60" disabled={contentSaving}>
                  {contentSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
          </div>
        </div>
      </div>
    );
  }
