import { useState, useEffect } from 'react';
import { X, Edit, Save, Trash2, Plus, Tag, ShoppingCart, Clock, MapPin, Mail, Phone, User, Check, X as XIcon } from 'lucide-react';

export default function CustomerProfile({ 
  customer, 
  onClose, 
  onUpdate,
  onDelete,
  onCreateOrder
}: {
  customer: any;
  onClose: () => void;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCreateOrder: (customerId: number) => void;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(customer);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    await onUpdate(customer.id, formData);
    setIsEditing(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    const updatedCustomer = {
      ...customer,
      notes: [
        ...(customer.notes || []),
        {
          id: Date.now(),
          content: newNote,
          created_by: 'Admin',
          created_at: new Date().toISOString()
        }
      ]
    };
    
    await onUpdate(customer.id, { notes: updatedCustomer.notes });
    setNewNote('');
  };

  const handleAddTag = () => {
    if (!newTag.trim() || customer.tags?.includes(newTag)) return;
    
    const updatedTags = [...(customer.tags || []), newTag];
    onUpdate(customer.id, { tags: updatedTags });
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = customer.tags?.filter((tag: string) => tag !== tagToRemove) || [];
    onUpdate(customer.id, { tags: updatedTags });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
            ) : (
              customer.full_name
            )}
          </h2>
          <div className="flex space-x-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                title="Save Changes"
              >
                <Save size={20} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="Edit Customer"
              >
                <Edit size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex -mb-px space-x-8">
              {['overview', 'orders', 'notes', 'addresses'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{customer.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{customer.mobile_number || 'No phone'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <span>Member since {formatDate(customer.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{customer.total_orders} orders</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-5 h-5 text-gray-400 mr-2" />
                      <span>Lifetime value: ${customer.lifetime_value?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags?.map((tag: string) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button 
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300"
                          >
                            <XIcon className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                      <div className="flex">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Add tag..."
                          className="text-xs border rounded-l px-2 py-1 w-24"
                        />
                        <button
                          onClick={handleAddTag}
                          className="px-1.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-r"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Recent Orders</h3>
                    {customer.recent_orders?.length > 0 ? (
                      <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                          {customer.recent_orders.map((order: any) => (
                            <li key={order.id} className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  Order #{order.order_number}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {order.status}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    {order.items_count} items • ${order.total_amount}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{formatDate(order.created_at)}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">No recent orders</div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Customer Notes</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <div className="p-4 border-b">
                        <div className="flex">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                            placeholder="Add a note about this customer..."
                            className="flex-1 border rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleAddNote}
                            className="bg-blue-600 text-white px-4 py-2 rounded-r text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      {customer.notes?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {customer.notes.map((note: any) => (
                            <li key={note.id} className="px-4 py-4">
                              <div className="flex justify-between">
                                <p className="text-sm text-gray-800">{note.content}</p>
                                <span className="text-xs text-gray-500">
                                  {formatDate(note.created_at)} by {note.created_by}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No notes yet. Add a note to record important information about this customer.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {customer.all_orders?.length > 0 ? (
                    customer.all_orders.map((order: any) => (
                      <li key={order.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            Order #{order.order_number}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {order.items_count} items • ${order.total_amount}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800">
                            View details
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This customer hasn't placed any orders yet.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => onCreateOrder(customer.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" />
                          Create Order
                        </button>
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="p-4 border-b">
                  <div className="flex">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      placeholder="Add a note about this customer..."
                      className="flex-1 border rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddNote}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
                {customer.notes?.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {customer.notes.map((note: any) => (
                      <li key={note.id} className="px-4 py-4">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-800">{note.content}</p>
                          <span className="text-xs text-gray-500">
                            {formatDate(note.created_at)} by {note.created_by}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No notes yet. Add a note to record important information about this customer.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Saved Addresses</h3>
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-0.5 mr-2 h-4 w-4" />
                    Add Address
                  </button>
                </div>
                
                {customer.addresses?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customer.addresses.map((address: any) => (
                      <div key={address.id} className="border rounded-lg p-4 relative">
                        {address.is_default && (
                          <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Default
                          </span>
                        )}
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {address.address_line1}
                            </p>
                            {address.address_line2 && (
                              <p className="text-sm text-gray-500">{address.address_line2}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p className="text-sm text-gray-500">{address.country}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-3">
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                          {!address.is_default && (
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              Set as default
                            </button>
                          )}
                          <button className="text-sm text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No saved addresses</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This customer hasn't saved any addresses yet.
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Add Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between border-t">
          <div>
            {isDeleting ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600">Are you sure?</span>
                <button
                  onClick={async () => {
                    await onDelete(customer.id);
                    setIsDeleting(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsDeleting(true)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete Customer
              </button>
            )}
          </div>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              onClick={() => onCreateOrder(customer.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
