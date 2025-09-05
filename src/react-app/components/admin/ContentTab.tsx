"use client";
import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

interface ContentTabProps {
  content: Record<string, any>;
  contentJson: string;
  isLoadingContent: boolean;
  contentError: string;
  contentSaving: boolean;
  activeContentTab: string;
  flatContent: Record<string, string>;
  updateFlatContent: (key: string, value: string) => void;
  addFlatField: () => void;
  removeFlatField: (key: string) => void;
  saveWebsiteContent: (e: React.FormEvent) => void;
  fetchWebsiteContent: () => void;
  setNotice: (notice: string) => void;
}

export default function ContentTab({
  content,
  contentJson,
  isLoadingContent,
  contentError,
  contentSaving,
  activeContentTab,
  flatContent,
  updateFlatContent,
  addFlatField,
  removeFlatField,
  saveWebsiteContent,
  fetchWebsiteContent,
  setNotice
}: ContentTabProps) {
  // For now, we'll just show a simplified version
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Website Content</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addFlatField}
            className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Field
          </button>
          <button
            onClick={fetchWebsiteContent}
            className="inline-flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
            type="button"
          >
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
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
            disabled={contentSaving}
          >
            {contentSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}