"use client";
import { useState, useEffect } from 'react';
import { 
  Globe, Palette, Code, Image, Eye, Save, Plus, Trash2, 
  RefreshCw, Monitor, Smartphone, Tablet, Settings, 
  ExternalLink, AlertCircle, CheckCircle, FileText, Tag
} from 'lucide-react';

interface WebsiteContentData {
  siteInfo: {
    siteName: string;
    siteDescription: string;
    logoUrl: string;
    faviconUrl: string;
    contactEmail: string;
    supportPhone: string;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    customCSS: string;
    headerScript: string;
    footerScript: string;
  };
  tracking: {
    googleAnalytics: string;
    googleTagManager: string;
  };
  content: Record<string, string>;
}

export default function WebsiteContent() {
  const [activeTab, setActiveTab] = useState('siteInfo');
  const [data, setData] = useState<WebsiteContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');
  const [previewMode, setPreviewMode] = useState('desktop');

  const tabs = [
    { id: 'siteInfo', label: 'Site Information', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'tracking', label: 'Tracking & Analytics', icon: Code },
    { id: 'content', label: 'Content Fields', icon: FileText }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch website content only (settings API removed)
      const contentRes = await fetch('/api/admin/website-content');
      const contentData = await contentRes.json();

      const content = contentData.content || {};
      setData({
        siteInfo: {
          siteName: content.siteInfo?.siteName || '',
          siteDescription: content.siteInfo?.siteDescription || '',
          logoUrl: content.siteInfo?.logoUrl || '',
          faviconUrl: content.siteInfo?.faviconUrl || '',
          contactEmail: content.siteInfo?.contactEmail || '',
          supportPhone: content.siteInfo?.supportPhone || ''
        },
        appearance: {
          theme: content.appearance?.theme || 'light',
          primaryColor: content.appearance?.primaryColor || '#059669',
          secondaryColor: content.appearance?.secondaryColor || '#10b981',
          customCSS: content.appearance?.customCSS || '',
          headerScript: content.appearance?.headerScript || '',
          footerScript: content.appearance?.footerScript || ''
        },
        tracking: {
          googleAnalytics: content.tracking?.googleAnalytics || '',
          googleTagManager: content.tracking?.googleTagManager || ''
        },
        content: content.content || {}
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (section: string) => {
    if (!data) return;
    
    setSaving(true);
    try {
      // Persist the entire structure in one place
      const response = await fetch('/api/admin/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data })
      });

      if (response.ok) {
        setMessage('Changes saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to save changes');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section: keyof WebsiteContentData, key: string, value: any) => {
    if (!data) return;
    setData({
      ...data,
      [section]: { ...data[section], [key]: value }
    });
  };

  const addContentField = () => {
    if (!data || !newFieldKey.trim()) return;
    setData({
      ...data,
      content: { ...data.content, [newFieldKey]: '' }
    });
    setNewFieldKey('');
  };

  const removeContentField = (key: string) => {
    if (!data) return;
    const newContent = { ...data.content };
    delete newContent[key];
    setData({ ...data, content: newContent });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading website content...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500">Failed to load website content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Globe className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Website Content Management</h1>
              <p className="text-blue-100 mt-1">Manage your website's appearance, content, and tracking</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-900">Content Sections</h3>
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
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm'
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

        {/* Content Area */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Site Information */}
            {activeTab === 'siteInfo' && (
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold">Site Information</h2>
                  </div>
                  <button
                    onClick={() => saveData('siteInfo')}
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
                      <label className="block text-sm font-semibold text-gray-700">Site Name</label>
                      <input
                        type="text"
                        value={data.siteInfo.siteName}
                        onChange={(e) => updateField('siteInfo', 'siteName', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your site name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        value={data.siteInfo.contactEmail}
                        onChange={(e) => updateField('siteInfo', 'contactEmail', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="contact@yoursite.com"
                      />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Site Description</label>
                      <textarea
                        value={data.siteInfo.siteDescription}
                        onChange={(e) => updateField('siteInfo', 'siteDescription', e.target.value)}
                        rows={4}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Describe your website..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Logo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={data.siteInfo.logoUrl}
                          onChange={(e) => updateField('siteInfo', 'logoUrl', e.target.value)}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="/logo.png"
                        />
                        {data.siteInfo.logoUrl && (
                          <div className="w-12 h-12 border-2 border-gray-200 rounded-lg overflow-hidden">
                            <img src={data.siteInfo.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Favicon URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={data.siteInfo.faviconUrl}
                          onChange={(e) => updateField('siteInfo', 'faviconUrl', e.target.value)}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="/favicon.png"
                        />
                        {data.siteInfo.faviconUrl && (
                          <div className="w-12 h-12 border-2 border-gray-200 rounded-lg overflow-hidden">
                            <img src={data.siteInfo.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Support Phone</label>
                      <input
                        type="tel"
                        value={data.siteInfo.supportPhone}
                        onChange={(e) => updateField('siteInfo', 'supportPhone', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+880-123-456789"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Palette className="w-5 h-5 text-purple-600 mr-2" />
                    <h2 className="text-lg font-semibold">Appearance & Styling</h2>
                  </div>
                  <button
                    onClick={() => saveData('appearance')}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Theme</label>
                      <select
                        value={data.appearance.theme}
                        onChange={(e) => updateField('appearance', 'theme', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={data.appearance.primaryColor}
                          onChange={(e) => updateField('appearance', 'primaryColor', e.target.value)}
                          className="w-16 h-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={data.appearance.primaryColor}
                          onChange={(e) => updateField('appearance', 'primaryColor', e.target.value)}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={data.appearance.secondaryColor}
                          onChange={(e) => updateField('appearance', 'secondaryColor', e.target.value)}
                          className="w-16 h-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={data.appearance.secondaryColor}
                          onChange={(e) => updateField('appearance', 'secondaryColor', e.target.value)}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Custom CSS</label>
                      <textarea
                        value={data.appearance.customCSS}
                        onChange={(e) => updateField('appearance', 'customCSS', e.target.value)}
                        rows={8}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono text-sm"
                        placeholder="/* Add your custom CSS here */"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Header Scripts</label>
                        <textarea
                          value={data.appearance.headerScript}
                          onChange={(e) => updateField('appearance', 'headerScript', e.target.value)}
                          rows={6}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono text-sm"
                          placeholder="<!-- Scripts for <head> section -->"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Footer Scripts</label>
                        <textarea
                          value={data.appearance.footerScript}
                          onChange={(e) => updateField('appearance', 'footerScript', e.target.value)}
                          rows={6}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono text-sm"
                          placeholder="<!-- Scripts before </body> -->"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking & Analytics */}
            {activeTab === 'tracking' && (
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold">Tracking & Analytics</h2>
                  </div>
                  <button
                    onClick={() => saveData('tracking')}
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
                      <label className="block text-sm font-semibold text-gray-700">Google Analytics ID</label>
                      <input
                        type="text"
                        value={data.tracking.googleAnalytics}
                        onChange={(e) => updateField('tracking', 'googleAnalytics', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="GA-XXXXXXXXX-X"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Google Tag Manager ID</label>
                      <input
                        type="text"
                        value={data.tracking.googleTagManager}
                        onChange={(e) => updateField('tracking', 'googleTagManager', e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Tracking Setup Instructions:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Google Analytics: Use your GA4 measurement ID</li>
                          <li>Google Tag Manager: Container ID for advanced tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Fields */}
            {activeTab === 'content' && (
              <div>
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-orange-600 mr-2" />
                      <h2 className="text-lg font-semibold">Dynamic Content Fields</h2>
                    </div>
                    <button
                      onClick={() => saveData('content')}
                      disabled={saving}
                      className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save All'}
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                      placeholder="Enter field name (e.g., hero_title)"
                      className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                    <button
                      onClick={addContentField}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {Object.keys(data.content).length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">No content fields yet</p>
                      <p className="text-gray-400">Add your first content field to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(data.content).map(([key, value]) => (
                        <div key={key} className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 text-orange-600 mr-2" />
                              <label className="text-sm font-semibold text-gray-700">{key}</label>
                            </div>
                            <button
                              onClick={() => removeContentField(key)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            value={value}
                            onChange={(e) => updateField('content', key, e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            rows={4}
                            placeholder="Enter content..."
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
