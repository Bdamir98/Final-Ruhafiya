"use client";
import { useState, useEffect } from 'react';
import { 
  Settings, Save, RefreshCw, Globe, Store, Bell, Shield, 
  Palette, Plug, User, Mail, Phone, DollarSign, Clock,
  Eye, EyeOff, Plus, Trash2, AlertCircle, CheckCircle
} from 'lucide-react';
import SettingsTabs from './SettingsTabs';

interface SettingsData {
  general: any;
  store: any;
  notifications: any;
  security: any;
  integrations: any;
  appearance: any;
  [key: string]: any;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Plug }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section: string, data: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data })
      });
      
      const result = await response.json();
      if (result.success) {
        setSettings(prev => prev ? { ...prev, [section]: result.settings[section] } : null);
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to save settings');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: { ...settings[section], [key]: value }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">System Settings</h1>
              <p className="text-green-100 mt-1">Configure store operations, security, and business settings</p>
            </div>
          </div>
          {message && (
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              message.includes('success') ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
            }`}>
              {message.includes('success') ? 
                <CheckCircle className="w-5 h-5 mr-2" /> : 
                <AlertCircle className="w-5 h-5 mr-2" />
              }
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-900">Settings Categories</h3>
            </div>
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-left mb-1 transition-all ${
                      activeTab === tab.id
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold">General Configuration</h2>
                  </div>
                  <button
                    onClick={() => saveSettings('general', settings.general)}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Currency</label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Timezone</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="Asia/Dhaka">Asia/Dhaka</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Language</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSetting('general', 'language', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="bn">Bengali</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">System Controls</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-blue-900">Maintenance Mode</label>
                          <p className="text-xs text-blue-700">Temporarily disable site for maintenance</p>
                        </div>
                        <input
                          type="checkbox"
                          id="maintenanceMode"
                          checked={settings.general.maintenanceMode}
                          onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-blue-900">Allow Registration</label>
                          <p className="text-xs text-blue-700">Enable new user registration</p>
                        </div>
                        <input
                          type="checkbox"
                          id="allowRegistration"
                          checked={settings.general.allowRegistration}
                          onChange={(e) => updateSetting('general', 'allowRegistration', e.target.checked)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Store Settings */}
            {activeTab === 'store' && (
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Store className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold">Store Configuration</h2>
                  </div>
                  <button
                    onClick={() => saveSettings('store', settings.store)}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Store Name</label>
                      <input
                        type="text"
                        value={settings.store.storeName}
                        onChange={(e) => updateSetting('store', 'storeName', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Enter your store name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Store Address</label>
                      <input
                        type="text"
                        value={settings.store.storeAddress}
                        onChange={(e) => updateSetting('store', 'storeAddress', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Full store address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Default Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settings.store.taxRate}
                        onChange={(e) => updateSetting('store', 'taxRate', parseFloat(e.target.value))}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Shipping Fee</label>
                      <input
                        type="number"
                        value={settings.store.shippingFee}
                        onChange={(e) => updateSetting('store', 'shippingFee', parseFloat(e.target.value))}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-3">Store Operations</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-green-900">Auto-approve Orders</label>
                          <p className="text-xs text-green-700">Automatically approve new orders without manual review</p>
                        </div>
                        <input
                          type="checkbox"
                          id="autoApproveOrders"
                          checked={settings.store.autoApproveOrders}
                          onChange={(e) => updateSetting('store', 'autoApproveOrders', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-green-900">Inventory Tracking</label>
                          <p className="text-xs text-green-700">Track product stock levels and availability</p>
                        </div>
                        <input
                          type="checkbox"
                          id="inventoryTracking"
                          checked={settings.store.inventoryTracking}
                          onChange={(e) => updateSetting('store', 'inventoryTracking', e.target.checked)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <SettingsTabs
              activeTab={activeTab}
              settings={settings}
              updateSetting={updateSetting}
              saveSettings={saveSettings}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
