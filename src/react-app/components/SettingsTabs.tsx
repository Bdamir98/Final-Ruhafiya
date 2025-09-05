"use client";
import { useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  settings: any;
  updateSetting: (section: string, key: string, value: any) => void;
  saveSettings: (section: string, data: any) => void;
  saving: boolean;
}

export default function SettingsTabs({ 
  activeTab, 
  settings, 
  updateSetting, 
  saveSettings, 
  saving 
}: SettingsTabsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [newIP, setNewIP] = useState('');

  const addIPToWhitelist = () => {
    if (newIP && !settings.security.ipWhitelist.includes(newIP)) {
      const updatedList = [...settings.security.ipWhitelist, newIP];
      updateSetting('security', 'ipWhitelist', updatedList);
      setNewIP('');
    }
  };

  const removeIPFromWhitelist = (ip: string) => {
    const updatedList = settings.security.ipWhitelist.filter((item: string) => item !== ip);
    updateSetting('security', 'ipWhitelist', updatedList);
  };

  return (
    <>
      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Notification Settings</h2>
            <button
              onClick={() => saveSettings('notifications', settings.notifications)}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                    Enable Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="orderStatusUpdates"
                    checked={settings.notifications.orderStatusUpdates}
                    onChange={(e) => updateSetting('notifications', 'orderStatusUpdates', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="orderStatusUpdates" className="ml-2 text-sm text-gray-700">
                    Order Status Updates
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newOrderAlert"
                    checked={settings.notifications.newOrderAlert}
                    onChange={(e) => updateSetting('notifications', 'newOrderAlert', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newOrderAlert" className="ml-2 text-sm text-gray-700">
                    New Order Alerts
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowStockAlerts"
                    checked={settings.notifications.lowStockAlerts}
                    onChange={(e) => updateSetting('notifications', 'lowStockAlerts', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lowStockAlerts" className="ml-2 text-sm text-gray-700">
                    Low Stock Alerts
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">SMS & Reports</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 text-sm text-gray-700">
                    Enable SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dailyReports"
                    checked={settings.notifications.dailyReports}
                    onChange={(e) => updateSetting('notifications', 'dailyReports', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dailyReports" className="ml-2 text-sm text-gray-700">
                    Daily Reports
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weeklyReports"
                    checked={settings.notifications.weeklyReports}
                    onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="weeklyReports" className="ml-2 text-sm text-gray-700">
                    Weekly Reports
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="customerMessages"
                    checked={settings.notifications.customerMessages}
                    onChange={(e) => updateSetting('notifications', 'customerMessages', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="customerMessages" className="ml-2 text-sm text-gray-700">
                    Customer Messages
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Security Settings</h2>
            <button
              onClick={() => saveSettings('security', settings.security)}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto Logout Time (minutes)</label>
                <input
                  type="number"
                  value={settings.security.autoLogoutTime}
                  onChange={(e) => updateSetting('security', 'autoLogoutTime', Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => updateSetting('security', 'passwordExpiry', Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireStrongPasswords"
                  checked={settings.security.requireStrongPasswords}
                  onChange={(e) => updateSetting('security', 'requireStrongPasswords', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireStrongPasswords" className="ml-2 text-sm text-gray-700">
                  Require Strong Passwords
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">IP Whitelist</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  placeholder="Enter IP address"
                  className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addIPToWhitelist}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {settings.security.ipWhitelist.map((ip: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{ip}</span>
                    <button
                      onClick={() => removeIPFromWhitelist(ip)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Settings */}
      {activeTab === 'integrations' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Integration Settings</h2>
            <button
              onClick={() => saveSettings('integrations', settings.integrations)}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.integrations.googleAnalytics}
                  onChange={(e) => updateSetting('integrations', 'googleAnalytics', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={settings.integrations.googleTagManager}
                  onChange={(e) => updateSetting('integrations', 'googleTagManager', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.integrations.whatsappNumber}
                  onChange={(e) => updateSetting('integrations', 'whatsappNumber', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="+8801XXXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Messenger Page ID</label>
                <input
                  type="text"
                  value={settings.integrations.messengerPageId}
                  onChange={(e) => updateSetting('integrations', 'messengerPageId', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                <select
                  value={settings.integrations.paymentGateway}
                  onChange={(e) => updateSetting('integrations', 'paymentGateway', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="manual">Manual/Cash on Delivery</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMS Provider</label>
                <select
                  value={settings.integrations.smsProvider}
                  onChange={(e) => updateSetting('integrations', 'smsProvider', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="twilio">Twilio</option>
                  <option value="nexmo">Nexmo</option>
                  <option value="local">Local Provider</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Appearance Settings</h2>
            <button
              onClick={() => saveSettings('appearance', settings.appearance)}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={settings.appearance.secondaryColor}
                  onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={settings.appearance.logoUrl}
                  onChange={(e) => updateSetting('appearance', 'logoUrl', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                <input
                  type="text"
                  value={settings.appearance.faviconUrl}
                  onChange={(e) => updateSetting('appearance', 'faviconUrl', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
              <textarea
                value={settings.appearance.customCSS}
                onChange={(e) => updateSetting('appearance', 'customCSS', e.target.value)}
                rows={6}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="/* Add your custom CSS here */"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Script</label>
              <textarea
                value={settings.appearance.headerScript}
                onChange={(e) => updateSetting('appearance', 'headerScript', e.target.value)}
                rows={4}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="<!-- Scripts to be added in <head> -->"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Script</label>
              <textarea
                value={settings.appearance.footerScript}
                onChange={(e) => updateSetting('appearance', 'footerScript', e.target.value)}
                rows={4}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="<!-- Scripts to be added before </body> -->"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
