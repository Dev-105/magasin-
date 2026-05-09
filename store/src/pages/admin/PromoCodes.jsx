import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    max_usage: '',
    expires_at: '',
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllPromoCodes();
      if (response.data.success) {
        setPromoCodes(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.createPromoCode(formData);
      if (response.data.success) {
        setShowForm(false);
        setFormData({ code: '', discount_percentage: '', max_usage: '', expires_at: '' });
        fetchPromoCodes();
      }
    } catch (error) {
      alert('Failed to create promo code');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this promo code?')) {
      try {
        await adminAPI.deletePromoCode(id);
        fetchPromoCodes();
      } catch (error) {
        alert('Failed to delete promo code');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading promo codes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Promo Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Promo Code
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Promo Code</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Discount %"
              value={formData.discount_percentage}
              onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
              className="px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Max Usage"
              value={formData.max_usage}
              onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="datetime-local"
              placeholder="Expires At"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Discount</th>
                <th className="px-4 py-3 text-left">Max Usage</th>
                <th className="px-4 py-3 text-left">Used</th>
                <th className="px-4 py-3 text-left">Expires</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo.id} className="border-t">
                  <td className="px-4 py-3 font-mono">{promo.code}</td>
                  <td className="px-4 py-3">{promo.discount_percentage}%</td>
                  <td className="px-4 py-3">{promo.max_usage || '∞'}</td>
                  <td className="px-4 py-3">{promo.used_count || 0}</td>
                  <td className="px-4 py-3">
                    {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPromoCodes;