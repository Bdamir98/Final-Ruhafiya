"use client";
import React from 'react';
import { ShoppingCart, Package, Users, LogOut, Bell, Settings as SettingsIcon, BarChart3, Shield } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onNavClick: (tab: string) => void;
  onLogout: () => void;
  totalUnreadNotifications: number;
}

export default function AdminSidebar({
  activeTab,
  onNavClick,
  onLogout,
  totalUnreadNotifications
}: AdminSidebarProps) {
  const menuItems = [
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'content', label: 'Website Content', icon: null as any },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: totalUnreadNotifications },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'fraud', label: 'Fraud Detection', icon: Shield },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white/90 backdrop-blur border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-xl font-semibold tracking-tight">Ruhafiya Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => onNavClick(id as any)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-left border-l-4 ${
                activeTab === id
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-transparent hover:bg-gray-50 text-gray-700'
              }`}
            >
              {Icon && <Icon className="w-5 h-5 mr-2" />}
              {!Icon && <span className="w-5 h-5 mr-2"></span>}
              {label}
              {badge && badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <header className="lg:hidden bg-white/90 backdrop-blur shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Ruhafiya Admin</h1>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile navigation menu */}
          <nav className="flex flex-wrap gap-2 pb-4">
            {menuItems.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => onNavClick(id as any)}
                className={`flex items-center px-3 py-2 rounded-md text-sm border ${
                  activeTab === id
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-transparent hover:bg-gray-50 text-gray-700'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 mr-1" />}
                {!Icon && <span className="w-4 h-4 mr-1"></span>}
                {label}
                {badge && badge > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}