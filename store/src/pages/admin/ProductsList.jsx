import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { productsAPI } from '../../api/products';

const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_percentage: 0,
    stock: '',
    theme: '',
    tags: [], // Array of tag names
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchTags();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({ per_page: 100 });
      if (response.data.success) {
        setProducts(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const fetchTags = async () => {
    try {
      const response = await adminAPI.getAllTags();
      if (response.data.success) {
        setAvailableTags(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagToggle = (tagName) => {
    const newTags = formData.tags.includes(tagName)
      ? formData.tags.filter(t => t !== tagName)
      : [...formData.tags, tagName];
    setFormData({ ...formData, tags: newTags });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        images: images,
      };

      let response;
      if (editingProduct) {
        response = await adminAPI.updateProduct(editingProduct.id, dataToSend);
      } else {
        response = await adminAPI.createProduct(dataToSend);
      }

      if (response.data.success) {
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      discount_percentage: 0,
      stock: '',
      theme: '',
      tags: [],
    });
    setImages([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      discount_percentage: product.discount_percentage,
      stock: product.stock,
      theme: product.theme,
      tags: product.tags?.map(t => t.name) || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <i className="bi bi-plus-lg mr-2"></i> Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select a Theme</option>
                  <option value="black">Black</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Tags</label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                  {availableTags.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No tags created yet. Please create tags first.</p>
                  ) : (
                    availableTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.name)}
                        className={`px-3 py-1 rounded-full text-xs transition ${
                          formData.tags.includes(tag.name)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {tag.name}
                        {formData.tags.includes(tag.name) && <i className="bi bi-check ml-1"></i>}
                      </button>
                    ))
                  )}
                </div>
              </div>
              {!editingProduct && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Image</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Theme</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0].image_url || product.images[0]} 
                        alt="" 
                        className="w-12 h-12 object-cover rounded shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                        <i className="bi bi-image text-gray-400"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{product.title}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {product.theme}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold">${Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock <= 5 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-lg text-right">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Edit"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
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

export default AdminProductsList;
