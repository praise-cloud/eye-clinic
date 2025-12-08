import React, { useState } from 'react';
import useUser from '../hooks/useUser';
import useUser from '../hooks/useUser';

// Helper to map old Tailwind colors to new semantic classes
const getStatClasses = (color) => {
    if (color.includes('blue')) return { icon: 'stat-primary', bg: 'stat-bg-primary' };
    if (color.includes('green')) return { icon: 'stat-success', bg: 'stat-bg-success' };
    if (color.includes('yellow')) return { icon: 'stat-warning', bg: 'stat-bg-warning' };
    if (color.includes('red')) return { icon: 'stat-danger', bg: 'stat-bg-danger' };
    return {};
};

// Main application component
const InventoryScreen = () => {
    const { user } = useUser();
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemFormData, setItemFormData] = useState({
        item_code: '', item_name: '', category: '', description: '',
        manufacturer: '', model_number: '', serial_number: '',
        current_quantity: 0, minimum_quantity: 0, maximum_quantity: 100,
        unit_of_measure: 'pieces', unit_cost: 0, supplier_name: '',
        supplier_contact: '', purchase_date: '', expiry_date: '',
        location: '', status: 'active', last_updated_by: '', notes: '', image_path: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showUpdateQuantityModal, setShowUpdateQuantityModal] = useState(false);
    const [quantityUpdateData, setQuantityUpdateData] = useState({ item: null, newQuantity: 0, notes: '' });

    // State to manage which section is currently active for navigation
    const [activeSection, setActiveSection] = useState('inventory'); // Hardcoded for this screen

    // Fetch inventory items from backend
    const fetchInventoryItems = async () => {
      if (!window.electronAPI) return;
      setLoading(true);
      try {
        const filters = {
          search: searchQuery,
          category: categoryFilter,
          status: statusFilter
        };
        const res = await window.electronAPI.getInventoryItems(filters);
        if (res.success) {
          setInventoryItems(res.items);
        } else {
          console.error('Failed to fetch inventory items:', res.error);
        }
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch and real-time listener for inventory items
    React.useEffect(() => {
      fetchInventoryItems();

      if (window.electronAPI) {
        const unsubscribe = window.electronAPI.onIpcEvent('data:update', (payload) => {
          if (payload.table === 'inventory') {
            console.log('Realtime inventory update received:', payload);
            fetchInventoryItems(); // Re-fetch inventory items to reflect changes
          }
        });
        return unsubscribe;
      }
    }, [searchQuery, categoryFilter, statusFilter]); // Re-fetch when filters change

    // Defines the navigation structure and icons
    const navItems = [
        { id: 'dashboard', icon: 'fas fa-th-large', label: 'Dashboard' },
        { id: 'patients', icon: 'fas fa-users', label: 'Patients' },
        { id: 'messages', icon: 'fas fa-envelope', label: 'Messages' },
        { id: 'tests', icon: 'fas fa-clipboard-check', label: 'Tests' },
        { id: 'inventory', icon: 'fas fa-box-open', label: 'Inventory' },
        { id: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
        { id: 'settings', icon: 'fas fa-cog', label: 'Settings' },
        { id: 'logout', icon: 'fas fa-sign-out-alt', label: 'Logout' },
    ];

    const statsData = [
        { label: 'Total Patients', number: '0', icon: 'fas fa-users', color: 'text-blue-500' },
        { label: "Today's Appointments", number: '0', icon: 'fas fa-calendar-check', color: 'text-green-500' },
        { label: 'Pending Appointments', number: '0', icon: 'fas fa-clock', color: 'text-yellow-500' },
        { label: 'Monthly Revenue', number: '₦0', icon: 'fa-solid fa-coins', color: 'text-red-500' },
    ];

    // Function to change the active section on click
    const handleNavClick = (sectionId) => {
        if (sectionId === 'logout') {
            // Handle logout action (e.g., clear session/state)
            console.log('User logged out');
        } else {
            setActiveSection(sectionId);
        }
    };

    // Helper functions for CRUD operations
    const handleAddEditItem = async () => {
        if (!window.electronAPI) return;
        setLoading(true);
        try {
            let res;
            if (editingItem) {
                res = await window.electronAPI.updateInventoryItem(editingItem.id, itemFormData);
            } else {
                res = await window.electronAPI.createInventoryItem(itemFormData);
            }

            if (res.success) {
                setShowAddEditModal(false);
                setEditingItem(null);
                setItemFormData({
                    item_code: '', item_name: '', category: '', description: '',
                    manufacturer: '', model_number: '', serial_number: '',
                    current_quantity: 0, minimum_quantity: 0, maximum_quantity: 100,
                    unit_of_measure: 'pieces', unit_cost: 0, supplier_name: '',
                    supplier_contact: '', purchase_date: '', expiry_date: '',
                    location: '', status: 'active', last_updated_by: '', notes: '', image_path: ''
                });
                fetchInventoryItems(); // Re-fetch to update the list
            } else {
                alert(res.error || 'Failed to save inventory item.');
            }
        } catch (error) {
            console.error('Error saving inventory item:', error);
            alert('Error saving inventory item: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async () => {
        if (!window.electronAPI || !showDeleteConfirm) return;
        setLoading(true);
        try {
            const res = await window.electronAPI.deleteInventoryItem(showDeleteConfirm.id);
            if (res.success) {
                setShowDeleteConfirm(null);
                fetchInventoryItems(); // Re-fetch to update the list
            } else {
                alert(res.error || 'Failed to delete inventory item.');
            }
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            alert('Error deleting inventory item: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async () => {
        if (!window.electronAPI || !quantityUpdateData.item) return;
        setLoading(true);
        try {
            const res = await window.electronAPI.updateInventoryQuantity(
                quantityUpdateData.item.id,
                quantityUpdateData.newQuantity,
                'admin_user_id', // TODO: Replace with actual current user ID
                quantityUpdateData.notes
            );
            if (res.success) {
                setShowUpdateQuantityModal(false);
                setQuantityUpdateData({ item: null, newQuantity: 0, notes: '' });
                fetchInventoryItems(); // Re-fetch to update the list
            } else {
                alert(res.error || 'Failed to update quantity.');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error updating quantity: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Component to render the Inventory content
    const InventorySection = () => (
        <section id="inventory-section" className="content-section">
            <div className="section-header">
                <h2>INVENTORY</h2>
                <p>Manage medical supplies and equipment</p>
            </div>
            <div className="card">
                <div className="card-controls">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                    <div className="filters">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="dropdown-select"
                        >
                            <option value="">All Categories</option>
                            <option value="equipment">Equipment</option>
                            <option value="supplies">Supplies</option>
                            <option value="medication">Medication</option>
                            <option value="consumables">Consumables</option>
                            <option value="other">Other</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="dropdown-select"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="disposed">Disposed</option>
                        </select>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingItem(null);
                            setItemFormData({
                                item_code: '', item_name: '', category: '', description: '',
                                manufacturer: '', model_number: '', serial_number: '',
                                current_quantity: 0, minimum_quantity: 0, maximum_quantity: 100,
                                unit_of_measure: 'pieces', unit_cost: 0, supplier_name: '',
                                supplier_contact: '', purchase_date: '', expiry_date: '',
                                location: '', status: 'active', last_updated_by: '', notes: '', image_path: ''
                            });
                            setShowAddEditModal(true);
                        }}
                    >
                        <i className="fas fa-plus"></i> Add Item
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Current Qty</th>
                                <th>Min Qty</th>
                                <th>Status</th>
                                <th>Expiry Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-400 dark:text-gray-500 py-4">Loading inventory...</td>
                                </tr>
                            ) : inventoryItems.length > 0 ? (
                                inventoryItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.item_code}</td>
                                        <td>{item.item_name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.current_quantity}</td>
                                        <td>{item.minimum_quantity}</td>
                                        <td>{item.status}</td>
                                        <td>{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="action-buttons">
                                            <button
                                                className="icon-btn edit"
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setItemFormData({
                                                        item_code: item.item_code,
                                                        item_name: item.item_name,
                                                        category: item.category,
                                                        description: item.description || '',
                                                        manufacturer: item.manufacturer || '',
                                                        model_number: item.model_number || '',
                                                        serial_number: item.serial_number || '',
                                                        current_quantity: item.current_quantity,
                                                        minimum_quantity: item.minimum_quantity,
                                                        maximum_quantity: item.maximum_quantity,
                                                        unit_of_measure: item.unit_of_measure,
                                                        unit_cost: item.unit_cost,
                                                        supplier_name: item.supplier_name || '',
                                                        supplier_contact: item.supplier_contact || '',
                                                        purchase_date: item.purchase_date || '',
                                                        expiry_date: item.expiry_date || '',
                                                        location: item.location || '',
                                                        status: item.status,
                                                        notes: item.notes || '',
                                                        image_path: item.image_path || ''
                                                    });
                                                    setShowAddEditModal(true);
                                                }}
                                            >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="icon-btn"
                                                title="Update Quantity"
                                                onClick={() => {
                                                    setQuantityUpdateData({ item: item, newQuantity: item.current_quantity, notes: '' });
                                                    setShowUpdateQuantityModal(true);
                                                }}
                                            >
                                                <i className="fas fa-boxes"></i>
                                            </button>
                                            <button
                                                className="icon-btn delete"
                                                onClick={() => setShowDeleteConfirm(item)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-400 dark:text-gray-500 py-4">No inventory items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );


    // Main render function
    return (
        <>
            <AppStyles /> 
            
            <div className="app-container">
                {/* Header */}
                <header className="app-header">
                    <div className="header-content">
                        <div className="logo">
                            <i className="fas fa-eye"></i>
                            <h1>KORENE EYE CLINIC</h1>
                        </div>
                        <div className="header-actions">
                            <div className="user-info">
                                <img 
                                    src="https://placehold.co/30x30/6c757d/ffffff?text=A" 
                                    alt="Admin Avatar" 
                                    className="avatar" 
                                    onError={(e) => {e.target.onerror = null; e.target.src='https://placehold.co/30x30/6c757d/ffffff?text=A'}} 
                                /> 
                                <span className="hidden-on-mobile">{user?.name || 'Admin'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="main-content-wrapper">
                    {/* Sidebar Navigation */}
                    <nav className="sidebar">
                        <ul className="nav-menu">
                            {navItems.map((item) => (
                                <li key={item.id} className={`nav-item ${activeSection === item.id ? 'active' : ''}`}>
                                    <a 
                                        href={`#${item.id}`} 
                                        className="nav-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(item.id);
                                        }}
                                    >
                                        <i className={item.icon}></i>
                                        <span>{item.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Content Area */}
                    <div className="content-area">
                        {activeSection === 'inventory' && <InventorySection />}
                        {activeSection !== 'inventory' && (
                            <div className="widget">
                                <div className="empty-state-content">
                                    <p>Content for the **{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}** section is not yet implemented in this view.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Item Modal */}
            {showAddEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Item Code"
                                value={itemFormData.item_code}
                                onChange={(e) => setItemFormData({ ...itemFormData, item_code: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={itemFormData.item_name}
                                onChange={(e) => setItemFormData({ ...itemFormData, item_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            <select
                                value={itemFormData.category}
                                onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            >
                                <option value="">Select Category</option>
                                <option value="equipment">Equipment</option>
                                <option value="supplies">Supplies</option>
                                <option value="medication">Medication</option>
                                <option value="consumables">Consumables</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea
                                placeholder="Description"
                                value={itemFormData.description}
                                onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            <input
                                type="number"
                                placeholder="Current Quantity"
                                value={itemFormData.current_quantity}
                                onChange={(e) => setItemFormData({ ...itemFormData, current_quantity: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            <input
                                type="number"
                                placeholder="Minimum Quantity"
                                value={itemFormData.minimum_quantity}
                                onChange={(e) => setItemFormData({ ...itemFormData, minimum_quantity: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                             <input
                                type="date"
                                placeholder="Expiry Date"
                                value={itemFormData.expiry_date}
                                onChange={(e) => setItemFormData({ ...itemFormData, expiry_date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddEditModal(false);
                                    setEditingItem(null);
                                    setItemFormData({
                                        item_code: '', item_name: '', category: '', description: '',
                                        manufacturer: '', model_number: '', serial_number: '',
                                        current_quantity: 0, minimum_quantity: 0, maximum_quantity: 100,
                                        unit_of_measure: 'pieces', unit_cost: 0, supplier_name: '',
                                        supplier_contact: '', purchase_date: '', expiry_date: '',
                                        location: '', status: 'active', last_updated_by: '', notes: '', image_path: ''
                                    });
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEditItem}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {editingItem ? 'Update' : 'Add'} Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Quantity Modal */}
            {showUpdateQuantityModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Update Quantity for {quantityUpdateData.item?.item_name}</h3>
                        <div className="space-y-4">
                            <input
                                type="number"
                                placeholder="New Quantity"
                                value={quantityUpdateData.newQuantity}
                                onChange={(e) => setQuantityUpdateData({ ...quantityUpdateData, newQuantity: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                            <textarea
                                placeholder="Notes (e.g., 'Stock adjustment', 'Used in surgery')"
                                value={quantityUpdateData.notes}
                                onChange={(e) => setQuantityUpdateData({ ...quantityUpdateData, notes: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowUpdateQuantityModal(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateQuantity}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Update Quantity
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Delete Inventory Item</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete {showDeleteConfirm.item_name} ({showDeleteConfirm.item_code})?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteItem}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InventoryScreen;
};

export default App;
