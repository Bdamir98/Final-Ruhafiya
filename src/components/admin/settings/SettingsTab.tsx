"use client";
import React from 'react';

export default function SettingsTab() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-2">Settings</h2>
      <p className="text-gray-600 text-sm">
        Basic settings can be added here in future (e.g., store preferences, payment settings).
      </p>
      <div className="mt-4 space-y-4">
        <div className="text-gray-500 text-sm">
          This section is under development. Contact your administrator for advanced configuration options.
        </div>
      </div>
    </div>
  );
}