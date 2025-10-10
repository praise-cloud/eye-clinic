import React, { useState, useEffect } from 'react'

const InventoryContent = () => {
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    // Mock data - replace with actual API call
    setInventory([
      { id: 1, item: 'Eye Drops - Latanoprost', quantity: 25, minStock: 10, category: 'Medication' },
      { id: 2, item: 'Disposable Tonometer Tips', quantity: 5, minStock: 20, category: 'Equipment' },
      { id: 3, item: 'Contact Lens Trial Set', quantity: 15, minStock: 5, category: 'Supplies' }
    ])
  }, [])

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= minStock) return 'text-red-600 bg-red-100'
    if (quantity <= minStock * 1.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatus(item.quantity, item.minStock)}`}>
                      {item.quantity <= item.minStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Update</button>
                    <button className="text-green-600 hover:text-green-900">Reorder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InventoryContent