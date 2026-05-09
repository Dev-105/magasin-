import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllTags();
      if (response.data.success) {
        setTags(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      const response = await adminAPI.createTag({ name: newTagName });
      if (response.data.success) {
        setNewTagName('');
        fetchTags();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create tag');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tag? This will remove it from all products.')) {
      try {
        await adminAPI.deleteTag(id);
        fetchTags();
      } catch (error) {
        alert('Failed to delete tag');
      }
    }
  };

  if (loading && tags.length === 0) {
    return <div className="text-center py-12">Loading tags...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Tags</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Tag</h2>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            placeholder="Tag Name (e.g. tech, fashion)"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Tag
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold text-center">Products Count</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 font-medium">{tag.name}</td>
                <td className="px-6 py-3 text-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {tag.products_count} products
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleDelete(tag.id)}
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
  );
};

export default AdminTags;
