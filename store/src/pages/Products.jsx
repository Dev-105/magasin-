import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../api/products';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    theme: '',
    min_price: '',
    max_price: '',
    tag: '',
    sort_by: 'price',
    sort_order: 'asc',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 12,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.current_page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page,
      };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) delete params[key];
      });
      
      const response = await productsAPI.getAll(params);
      if (response.data.success) {
        setProducts(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
          per_page: response.data.data.per_page,
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleSort = (field) => {
    setFilters({
      ...filters,
      sort_by: field,
      sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc',
    });
  };

  const themes = ['electronics', 'clothing', 'books', 'home', 'sports', 'toys'];
  const tags = ['new', 'sale', 'popular', 'featured', 'trending'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            name="theme"
            value={filters.theme}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Themes</option>
            {themes.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
          
          <select
            name="tag"
            value={filters.tag}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          <input
            type="number"
            name="min_price"
            placeholder="Min Price"
            value={filters.min_price}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-lg"
          />
          
          <input
            type="number"
            name="max_price"
            placeholder="Max Price"
            value={filters.max_price}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-lg"
          />
          
          <button
            onClick={() => setFilters({ theme: '', min_price: '', max_price: '', tag: '', sort_by: 'price', sort_order: 'asc' })}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Sort Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{pagination.total} products found</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort('price')}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Price {filters.sort_by === 'price' && (filters.sort_order === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('title')}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Name {filters.sort_by === 'title' && (filters.sort_order === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <i className="bi bi-emoji-frown text-6xl text-gray-400"></i>
          <p className="text-gray-500 mt-2">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
            disabled={pagination.current_page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
            disabled={pagination.current_page === pagination.last_page}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;