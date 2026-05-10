import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { productsAPI } from '../../api/products';

const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_percentage: 0,
    stock: '',
    theme: '',
    tags: [],
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageErrors, setImageErrors] = useState([]);

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

  const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!validTypes.includes(file.type)) {
      return 'Only JPEG, PNG, JPG, and GIF files are allowed';
    }
    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }
    return null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const errors = [];
    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      const error = validateImage(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    if (errors.length > 0) {
      setImageErrors(errors);
      setTimeout(() => setImageErrors([]), 5000);
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...previews]);
    }
    
    // Clear input value to allow re-uploading same file
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = [];
    
    if (!formData.title?.trim()) validationErrors.push('Title is required');
    if (!formData.description?.trim()) validationErrors.push('Description is required');
    if (!formData.price || parseFloat(formData.price) <= 0) validationErrors.push('Valid price is required');
    if (!formData.stock || parseInt(formData.stock) < 0) validationErrors.push('Valid stock quantity is required');
    if (!formData.theme) validationErrors.push('Theme is required');
    
    if (!editingProduct && images.length === 0) {
      validationErrors.push('At least one image is required');
    }
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    setUploading(true);
    
    try {
      let response;
      
      if (editingProduct) {
        const updatePayload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          discount_percentage: parseInt(formData.discount_percentage) || 0,
          stock: parseInt(formData.stock),
          theme: formData.theme,
          tags: formData.tags,
        };
        response = await adminAPI.updateProduct(editingProduct.id, updatePayload);
      } else {
        const createPayload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          discount_percentage: parseInt(formData.discount_percentage) || 0,
          stock: parseInt(formData.stock),
          theme: formData.theme,
          tags: formData.tags,
          images: images,
        };
        response = await adminAPI.createProduct(createPayload);
      }

      if (response.data.success) {
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
        
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-fade-in';
        successMsg.innerHTML = `<i class="bi bi-check-circle mr-2"></i>${editingProduct ? 'Product updated' : 'Product created'} successfully!`;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } else {
        alert(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        let errorMessage = 'Validation errors:\n';
        Object.keys(errors).forEach(key => {
          errorMessage += `• ${key}: ${errors[key].join(', ')}\n`;
        });
        alert(errorMessage);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Operation failed. Please check all fields and try again.');
      }
    } finally {
      setUploading(false);
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
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    setImages([]);
    setImagePreviews([]);
    setImageErrors([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      discount_percentage: product.discount_percentage || 0,
      stock: product.stock || '',
      theme: product.theme || '',
      tags: product.tags?.map(t => typeof t === 'object' ? t.name : t) || [],
    });
    setImages([]);
    setImagePreviews([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await adminAPI.deleteProduct(id);
        fetchProducts();
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-fade-in';
        successMsg.innerHTML = '<i class="bi bi-check-circle mr-2"></i>Product deleted successfully!';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } catch (error) {
        alert('Failed to delete product');
      }
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const themeColors = {
    black: 'bg-gray-800 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    purple: 'bg-purple-600 text-white',
    gold: 'bg-amber-600 text-white',
  };

  const themeNames = {
    black: 'Black Edition',
    blue: 'Blue Edition',
    green: 'Green Edition',
    purple: 'Purple Edition',
    gold: 'Gold Edition',
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-box-seam text-gray-600 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i>
          Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Image Errors Display */}
      {imageErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <i className="bi bi-exclamation-triangle-fill text-red-500 mt-0.5"></i>
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">Image validation errors:</p>
              <ul className="text-sm text-red-600 list-disc list-inside">
                {imageErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)}></div>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Create New Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <i className="bi bi-x-lg text-gray-600"></i>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                        placeholder="Enter product title"
                        required
                      />
                    </div>
                    
                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                        rows="4"
                        placeholder="Product description"
                        required
                      ></textarea>
                    </div>
                    
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price (MAD) *</label>
                      <div className="relative">
                        <i className="bi bi-currency-dollar absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Discount */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                      <div className="relative">
                        <i className="bi bi-percent absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="number"
                          name="discount_percentage"
                          value={formData.discount_percentage}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    
                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                      <div className="relative">
                        <i className="bi bi-box-seam absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                          placeholder="0"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                    
                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Theme *</label>
                      <div className="relative">
                        <i className="bi bi-palette absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <select
                          name="theme"
                          value={formData.theme}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select Theme</option>
                          <option value="black">Black Edition</option>
                          <option value="blue">Blue Edition</option>
                          <option value="green">Green Edition</option>
                          <option value="purple">Purple Edition</option>
                          <option value="gold">Gold Edition</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Tags</label>
                      <div className="flex flex-wrap gap-2 p-4 border border-gray-200 rounded-xl bg-gray-50/50 min-h-[80px]">
                        {availableTags.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">No tags available. Create tags first.</p>
                        ) : (
                          availableTags.map(tag => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => handleTagToggle(tag.name)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                formData.tags.includes(tag.name)
                                  ? 'bg-gray-900 text-white shadow-md'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm'
                              }`}
                            >
                              #{tag.name}
                              {formData.tags.includes(tag.name) && <i className="bi bi-check ml-2"></i>}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Images - Only for new products */}
                    {!editingProduct && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Product Images * {images.length > 0 && `(${images.length} selected)`}
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                            onChange={handleImageChange}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            <i className="bi bi-info-circle"></i>
                            Allowed formats: JPEG, PNG, JPG, GIF. Max size: 5MB per image
                          </p>
                          {imagePreviews.length > 0 && (
                            <div className="flex gap-3 mt-4 flex-wrap">
                              {imagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative group">
                                  <img 
                                    src={preview} 
                                    alt={`Preview ${idx + 1}`} 
                                    className="w-20 h-20 object-cover rounded-lg shadow-md" 
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <i className="bi bi-arrow-repeat animate-spin"></i>
                          <span>{editingProduct ? 'Updating...' : 'Creating...'}</span>
                        </>
                      ) : (
                        <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Products Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Theme</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Stock</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <i className="bi bi-inbox text-5xl text-gray-300 mb-3 block"></i>
                    <p className="text-gray-500">No products found</p>
                    </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      {product.images && product.images[0] ? (
                        <img 
                          src={product.images[0].image_url || product.images[0]} 
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded-xl shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                          <i className="bi bi-image text-gray-400 text-xl"></i>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{product.title}</p>
                        {product.discount_percentage > 0 && (
                          <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            -{product.discount_percentage}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${themeColors[product.theme] || 'bg-gray-100 text-gray-700'}`}>
                        {themeNames[product.theme] || product.theme || 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {product.discount_percentage > 0 ? (
                          <>
                            <span className="font-bold text-gray-900">
                              {`MAD ${(product.price - (product.price * product.discount_percentage / 100)).toFixed(2)}`}
                            </span>
                            <span className="text-xs text-gray-400 line-through ml-2">
                              {`MAD ${Number(product.price).toFixed(2)}`}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-gray-900">{`MAD ${Number(product.price).toFixed(2)}`}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                        product.stock <= 5 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        <i className={`bi ${product.stock <= 5 ? 'bi-exclamation-triangle' : 'bi-check-circle'} text-xs`}></i>
                        {product.stock} left
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          title="Edit"
                        >
                          <i className="bi bi-pencil-square text-lg"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === product.id ? (
                            <i className="bi bi-arrow-repeat animate-spin"></i>
                          ) : (
                            <i className="bi bi-trash3 text-lg"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center">
          <i className="bi bi-box-seam text-2xl text-gray-600 mb-2 block"></i>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          <p className="text-sm text-gray-500">Total Products</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center">
          <i className="bi bi-tags text-2xl text-gray-600 mb-2 block"></i>
          <p className="text-2xl font-bold text-gray-900">{availableTags.length}</p>
          <p className="text-sm text-gray-500">Total Tags</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center">
          <i className="bi bi-arrow-down-short text-2xl text-red-600 mb-2 block"></i>
          <p className="text-2xl font-bold text-gray-900">
            {products.filter(p => p.stock <= 5).length}
          </p>
          <p className="text-sm text-gray-500">Low Stock Items</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center">
          <i className="bi bi-percent text-2xl text-green-600 mb-2 block"></i>
          <p className="text-2xl font-bold text-gray-900">
            {products.filter(p => p.discount_percentage > 0).length}
          </p>
          <p className="text-sm text-gray-500">On Sale</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsList;