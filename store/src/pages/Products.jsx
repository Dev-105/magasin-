import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../api/products';
import { adminAPI } from '../api/admin';

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
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
  const [showFilters, setShowFilters] = useState(false);
  const [activeSort, setActiveSort] = useState('price');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    // Fetch all products and tags once on mount
    fetchProducts();
    fetchTags();
  }, []);

  // Recompute filtered & paginated products when filters, allProducts or current page change
  useEffect(() => {
    applyLocalFiltersAndPaginate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, allProducts, pagination.current_page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Request a large per_page so we can filter client-side
      const response = await productsAPI.getAll({ per_page: 1000 });
      if (response.data.success) {
        const payload = response.data.data;
        let fetched = [];
        if (Array.isArray(payload)) fetched = payload;
        else if (payload && Array.isArray(payload.data)) fetched = payload.data;
        else fetched = payload || [];

        setAllProducts(fetched);

        // initialize pagination
        const totalItems = fetched.length;
        const lastPage = Math.max(1, Math.ceil(totalItems / pagination.per_page));
        setPagination(prev => ({ ...prev, last_page: lastPage, total: totalItems, current_page: 1 }));
        setProducts(fetched.slice(0, pagination.per_page));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const fetchTags = async () => {
    try {
      const response = await adminAPI.getAllTags();
      if (response.data && response.data.success) {
        setAvailableTags(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const applyLocalFiltersAndPaginate = () => {
    let filtered = allProducts.slice();

    // Search
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      filtered = filtered.filter(p => (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }

    // Tag
    if (filters.tag) {
      filtered = filtered.filter(p => {
        if (!p.tags) return false;
        return p.tags.some(t => (t.name || t).toString() === filters.tag);
      });
    }

    // Price
    if (filters.min_price) {
      const min = Number(filters.min_price) || 0;
      filtered = filtered.filter(p => Number(p.price) >= min);
    }
    if (filters.max_price) {
      const max = Number(filters.max_price) || Infinity;
      filtered = filtered.filter(p => Number(p.price) <= max);
    }

    // Sorting
    if (filters.sort_by) {
      const dir = filters.sort_order === 'asc' ? 1 : -1;
      filtered.sort((a, b) => {
        if (filters.sort_by === 'price') return (Number(a.price) - Number(b.price)) * dir;
        if (filters.sort_by === 'title') return a.title.localeCompare(b.title) * dir;
        return 0;
      });
    }

    // Update pagination
    const totalItems = filtered.length;
    const lastPage = Math.max(1, Math.ceil(totalItems / pagination.per_page));
    const currentPage = Math.min(pagination.current_page, lastPage);
    setPagination(prev => ({ ...prev, total: totalItems, last_page: lastPage, current_page: currentPage }));

    const start = (currentPage - 1) * pagination.per_page;
    setProducts(filtered.slice(start, start + pagination.per_page));
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleSort = (field) => {
    setActiveSort(field);
    setFilters(prev => ({ ...prev, sort_by: field, sort_order: prev.sort_order === 'asc' ? 'desc' : 'asc' }));
  };

  const clearAllFilters = () => {
    setFilters({ search: '', min_price: '', max_price: '', tag: '', sort_by: 'price', sort_order: 'asc' });
    setActiveSort('price');
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const tags = availableTags.map(t => t.name);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.tag) count++;
    if (filters.min_price) count++;
    if (filters.max_price) count++;
    return count;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl overflow-hidden mb-8 md:mb-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 animate-fade-in-up">Our Collection</h1>
          <p className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto animate-fade-in-up animation-delay-200">Discover premium products crafted with excellence. From everyday essentials to luxury items.</p>
        </div>
      </div>

      {/* Filter Bar - Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setShowFilters(!showFilters)} className="w-full bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-md flex items-center justify-between transition-all duration-200">
          <div className="flex items-center space-x-3">
            <i className="bi bi-funnel text-gray-700 text-xl"></i>
            <span className="font-medium text-gray-800">Filters</span>
            {getActiveFilterCount() > 0 && <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">{getActiveFilterCount()}</span>}
          </div>
          <i className={`bi bi-chevron-${showFilters ? 'up' : 'down'} text-gray-600 transition-transform`}></i>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:block lg:w-80 lg:sticky lg:top-24 lg:h-screen lg:overflow-y-auto ${showFilters ? 'block' : 'hidden'} fixed inset-0 z-50 lg:relative lg:z-auto bg-white lg:bg-transparent lg:rounded-none rounded-3xl shadow-2xl lg:shadow-none p-6 lg:p-0`}>
          <div className="lg:hidden flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-gray-100"><i className="bi bi-x-lg text-gray-600"></i></button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 block"><i className="bi bi-search mr-2"></i> Search</label>
              <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by title or description" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white/60" />
            </div>

            {/* Tag Filter */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 block"><i className="bi bi-bookmark mr-2"></i> Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag} onClick={() => handleFilterChange({ target: { name: 'tag', value: filters.tag === tag ? '' : tag } })} className={`px-3 py-1.5 rounded-xl text-sm capitalize transition-all duration-200 ${filters.tag === tag ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100">
              <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 block"><i className="bi bi-currency-dollar mr-2"></i> Price Range</label>
              <div className="space-y-3">
                <input type="number" name="min_price" placeholder="Min Price" value={filters.min_price} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 bg-white/60" />
                <input type="number" name="max_price" placeholder="Max Price" value={filters.max_price} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 bg-white/60" />
              </div>
            </div>

            <button onClick={clearAllFilters} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"><i className="bi bi-eraser"></i><span>Clear All Filters</span></button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm"><span className="font-semibold text-gray-900">{pagination.total}</span> premium products</p>
              <div className="flex gap-2">
                <button onClick={() => handleSort('price')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeSort === 'price' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><i className="bi bi-currency-dollar"></i>Price{activeSort === 'price' && <i className={`bi bi-chevron-${filters.sort_order === 'asc' ? 'up' : 'down'} text-xs`}></i>}</button>
                <button onClick={() => handleSort('title')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeSort === 'title' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><i className="bi bi-sort-alpha-down"></i>Name{activeSort === 'title' && <i className={`bi bi-chevron-${filters.sort_order === 'asc' ? 'up' : 'down'} text-xs`}></i>}</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i=> <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"><div className="h-64 bg-gray-200"></div><div className="p-5 space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-200 rounded w-full"></div><div className="h-3 bg-gray-200 rounded w-2/3"></div><div className="h-6 bg-gray-200 rounded w-1/3"></div></div></div>)}</div>
          ) : products.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 text-center"><i className="bi bi-emoji-frown text-6xl text-gray-400 mb-4 block"></i><h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3><p className="text-gray-500">Try adjusting your filters or clear them to see all products.</p><button onClick={clearAllFilters} className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all duration-200">Clear Filters</button></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{products.map(product => <ProductCard key={product.id} product={product} />)}</div>
          )}

          {pagination.last_page > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
              <button onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))} disabled={pagination.current_page === 1} className="px-6 py-2 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"><i className="bi bi-chevron-left"></i>Previous</button>
              <div className="flex items-center gap-2">{[...Array(Math.min(5, pagination.last_page))].map((_, i) => {let pageNum; if (pagination.last_page <= 5) pageNum = i+1; else if (pagination.current_page <= 3) pageNum = i+1; else if (pagination.current_page >= pagination.last_page - 2) pageNum = pagination.last_page - 4 + i; else pageNum = pagination.current_page - 2 + i; return (<button key={pageNum} onClick={() => setPagination(prev => ({ ...prev, current_page: pageNum }))} className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${pagination.current_page === pageNum ? 'bg-gray-900 text-white shadow-md' : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100'}`}>{pageNum}</button>);})}</div>
              <button onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.last_page, prev.current_page + 1) }))} disabled={pagination.current_page === pagination.last_page} className="px-6 py-2 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">Next<i className="bi bi-chevron-right"></i></button>
            </div>
          )}
        </div>
      </div>

      {showFilters && (<div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)}></div>)}
    </div>
  );
};

export default Products;
