"use client";
import { useState, useEffect } from 'react';
import { 
  Shield, 
  UserX, 
  Wifi, 
  Trash2, 
  Plus, 
  Search, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  MapPin,
  Eye,
  RotateCcw
} from 'lucide-react';

interface BlockedEntity {
  id: number;
  type: 'phone' | 'ip' | 'address' | 'email';
  value: string;
  reason: string;
  blocked_at: string;
  blocked_by: string;
  auto_blocked: boolean;
  unblock_count: number;
  last_unblocked_at?: string;
  notes?: string;
}

interface UnblockHistory {
  id: number;
  entity_type: string;
  entity_value: string;
  unblocked_at: string;
  unblocked_by: string;
  reason: string;
  notes?: string;
}

export default function BlockedEntitiesManager() {
  const [blockedEntities, setBlockedEntities] = useState<BlockedEntity[]>([]);
  const [unblockHistory, setUnblockHistory] = useState<UnblockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blocked' | 'history'>('blocked');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<BlockedEntity | null>(null);
  const [showUnblockModal, setShowUnblockModal] = useState(false);

  // Add new blocked entity form
  const [newEntity, setNewEntity] = useState({
    type: 'phone' as 'phone' | 'ip' | 'address' | 'email',
    value: '',
    reason: '',
    notes: ''
  });

  // Unblock form
  const [unblockForm, setUnblockForm] = useState({
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchBlockedEntities();
    fetchUnblockHistory();
  }, []);

  const fetchBlockedEntities = async () => {
    try {
      const response = await fetch('/api/admin/fake-orders/blocked-entities');
      const data = await response.json();
      setBlockedEntities(data.entities || []);
    } catch (error) {
      console.error('Failed to fetch blocked entities:', error);
    }
  };

  const fetchUnblockHistory = async () => {
    try {
      const response = await fetch('/api/admin/fake-orders/unblock-history');
      const data = await response.json();
      setUnblockHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch unblock history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/fake-orders/blocked-entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block',
          ...newEntity
        })
      });

      if (response.ok) {
        setNewEntity({ type: 'phone', value: '', reason: '', notes: '' });
        setShowAddForm(false);
        fetchBlockedEntities();
      }
    } catch (error) {
      console.error('Failed to add blocked entity:', error);
    }
  };

  const handleUnblock = async () => {
    if (!selectedEntity) return;

    try {
      const response = await fetch('/api/admin/fake-orders/blocked-entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unblock',
          id: selectedEntity.id,
          reason: unblockForm.reason,
          notes: unblockForm.notes
        })
      });

      if (response.ok) {
        setShowUnblockModal(false);
        setSelectedEntity(null);
        setUnblockForm({ reason: '', notes: '' });
        fetchBlockedEntities();
        fetchUnblockHistory();
      }
    } catch (error) {
      console.error('Failed to unblock entity:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this blocked entity?')) return;

    try {
      const response = await fetch('/api/admin/fake-orders/blocked-entities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        fetchBlockedEntities();
      }
    } catch (error) {
      console.error('Failed to delete entity:', error);
    }
  };

  const filteredEntities = blockedEntities.filter(entity => {
    const matchesSearch = (entity.value?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (entity.reason?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || entity.type === filterType;
    return matchesSearch && matchesType;
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'ip': return <Wifi className="w-4 h-4" />;
      case 'address': return <MapPin className="w-4 h-4" />;
      case 'email': return <User className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getRiskColor = (autoBlocked: boolean, unblockCount: number) => {
    if (unblockCount > 2) return 'text-red-600 bg-red-50';
    if (autoBlocked) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blocked Entities Manager</h2>
          <p className="text-gray-600">Manage blocked phones, IPs, addresses, and emails</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Block Entity
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('blocked')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'blocked'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserX className="w-4 h-4 inline mr-2" />
            Blocked Entities ({blockedEntities.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Unblock History ({unblockHistory.length})
          </button>
        </nav>
      </div>

      {/* Blocked Entities Tab */}
      {activeTab === 'blocked' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search blocked entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="phone">Phone Numbers</option>
              <option value="ip">IP Addresses</option>
              <option value="address">Addresses</option>
              <option value="email">Email Addresses</option>
            </select>
          </div>

          {/* Blocked Entities List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredEntities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No blocked entities found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blocked
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEntities.map((entity) => (
                      <tr key={entity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${getRiskColor(entity.auto_blocked, entity.unblock_count)}`}>
                              {getEntityIcon(entity.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{entity.value || 'N/A'}</div>
                              <div className="text-sm text-gray-500 capitalize">{entity.type || 'unknown'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{entity.reason || 'No reason provided'}</div>
                          {entity.notes && (
                            <div className="text-sm text-gray-500">{entity.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(entity.blocked_at).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">by {entity.blocked_by}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {entity.auto_blocked ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Auto-blocked
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Manual
                              </span>
                            )}
                            {entity.unblock_count > 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Unblocked {entity.unblock_count}x
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedEntity(entity);
                                setShowUnblockModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Unblock
                            </button>
                            <button
                              onClick={() => handleDelete(entity.id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unblock History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {unblockHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No unblock history found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unblock Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unblocked By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unblockHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-green-50 text-green-600">
                            {getEntityIcon(record.entity_type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{record.entity_value}</div>
                            <div className="text-sm text-gray-500 capitalize">{record.entity_type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{record.reason}</div>
                        {record.notes && (
                          <div className="text-sm text-gray-500">{record.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.unblocked_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.unblocked_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Entity Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Block New Entity</h3>
            <form onSubmit={handleAddEntity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newEntity.type}
                  onChange={(e) => setNewEntity({...newEntity, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="phone">Phone Number</option>
                  <option value="ip">IP Address</option>
                  <option value="address">Address</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={newEntity.value}
                  onChange={(e) => setNewEntity({...newEntity, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter value to block"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={newEntity.reason}
                  onChange={(e) => setNewEntity({...newEntity, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Reason for blocking"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={newEntity.notes}
                  onChange={(e) => setNewEntity({...newEntity, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Block Entity
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unblock Modal */}
      {showUnblockModal && selectedEntity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Unblock Entity</h3>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Unblocking: {selectedEntity.value}
                  </p>
                  <p className="text-sm text-yellow-700">
                    This entity has been unblocked {selectedEntity.unblock_count} time(s) before.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Unblocking</label>
                <input
                  type="text"
                  value={unblockForm.reason}
                  onChange={(e) => setUnblockForm({...unblockForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Why are you unblocking this entity?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={unblockForm.notes}
                  onChange={(e) => setUnblockForm({...unblockForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes about this unblock"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUnblock}
                  disabled={!unblockForm.reason}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Unblock Entity
                </button>
                <button
                  onClick={() => {
                    setShowUnblockModal(false);
                    setSelectedEntity(null);
                    setUnblockForm({ reason: '', notes: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
