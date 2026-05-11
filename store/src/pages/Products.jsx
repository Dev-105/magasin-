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
    fetchProducts();
    fetchTags();
  }, []);

  useEffect(() => {
    applyLocalFiltersAndPaginate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, allProducts, pagination.current_page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({ per_page: 1000 });
      if (response.data.success) {
        const payload = response.data.data;
        let fetched = [];
        if (Array.isArray(payload)) fetched = payload;
        else if (payload && Array.isArray(payload.data)) fetched = payload.data;
        else fetched = payload || [];

        setAllProducts(fetched);
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

    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      filtered = filtered.filter(p => (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }

    if (filters.tag) {
      filtered = filtered.filter(p => {
        if (!p.tags) return false;
        return p.tags.some(t => (t.name || t).toString() === filters.tag);
      });
    }

    if (filters.min_price) {
      const min = Number(filters.min_price) || 0;
      filtered = filtered.filter(p => Number(p.price) >= min);
    }
    if (filters.max_price) {
      const max = Number(filters.max_price) || Infinity;
      filtered = filtered.filter(p => Number(p.price) <= max);
    }

    if (filters.sort_by) {
      const dir = filters.sort_order === 'asc' ? 1 : -1;
      filtered.sort((a, b) => {
        if (filters.sort_by === 'price') return (Number(a.price) - Number(b.price)) * dir;
        if (filters.sort_by === 'title') return a.title.localeCompare(b.title) * dir;
        return 0;
      });
    }

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
      {/* Hero Section - Royal Gold */}
      <div className="relative bg-gradient-to-r from-black via-[#0a0a0a] to-black rounded-2xl overflow-hidden mb-6 md:mb-10 border border-[#D4AF37]/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="relative px-4 py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in-up">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Royal Collection</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto animate-fade-in-up">Discover premium craftsmanship curated for the discerning connoisseur.</p>
        </div>
      </div>

      {/* Filter Bar - Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setShowFilters(!showFilters)} className="w-full bg-black/60 backdrop-blur-md rounded-xl px-6 py-4 shadow-xl border border-[#D4AF37]/20 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center space-x-3">
            <i className="bi bi-funnel text-[#D4AF37] text-xl"></i>
            <span className="font-medium text-white">Refine Collection</span>
            {getActiveFilterCount() > 0 && <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black text-xs px-2 py-1 rounded-full font-bold">{getActiveFilterCount()}</span>}
          </div>
          <i className={`bi bi-chevron-${showFilters ? 'up' : 'down'} text-[#D4AF37] transition-transform`}></i>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filters - Glassmorphism Dark */}
        <aside className={`lg:block lg:w-80 lg:sticky lg:top-24 lg:h-screen lg:overflow-y-auto ${showFilters ? 'block' : 'hidden'} fixed inset-0 z-50 lg:relative lg:z-auto bg-black lg:bg-transparent rounded-2xl shadow-2xl lg:shadow-none p-5 lg:p-0`}>
          <div className="lg:hidden flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-[#D4AF37]">Refine Collection</h3>
            <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-white/5 transition-all"><i className="bi bi-x-lg text-[#D4AF37] text-xl"></i></button>
          </div>

          <div className="space-y-5">
            {/* Search */}
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 border border-[#D4AF37]/20">
              <label className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 block"><i className="bi bi-search mr-2"></i> Search Treasury</label>
              <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by title or description" className="w-full px-4 py-3 bg-black/60 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white placeholder:text-gray-500 transition-all" />
            </div>

            {/* Tag Filter */}
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 border border-[#D4AF37]/20">
              <label className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 block"><i className="bi bi-bookmark mr-2"></i> Categories</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag} onClick={() => handleFilterChange({ target: { name: 'tag', value: filters.tag === tag ? '' : tag } })} className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all duration-300 ${filters.tag === tag ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold shadow-lg' : 'bg-black/60 text-gray-300 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 border border-[#D4AF37]/20">
              <label className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide mb-3 block"><i className="bi bi-currency-dollar mr-2"></i> Price Range (MAD)</label>
              <div className="space-y-3">
                <input type="number" name="min_price" placeholder="Minimum Price" value={filters.min_price} onChange={handleFilterChange} className="w-full px-4 py-3 bg-black/60 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white placeholder:text-gray-500" />
                <input type="number" name="max_price" placeholder="Maximum Price" value={filters.max_price} onChange={handleFilterChange} className="w-full px-4 py-3 bg-black/60 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white placeholder:text-gray-500" />
              </div>
            </div>

            <button onClick={clearAllFilters} className="w-full bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 text-[#D4AF37] py-3 rounded-xl font-bold hover:from-[#D4AF37]/30 hover:to-[#FFD700]/30 transition-all duration-300 flex items-center justify-center space-x-2 border border-[#D4AF37]/40 min-h-[44px]">
              <i className="bi bi-eraser"></i>
              <span>Clear All Filters</span>
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 mb-6 border border-[#D4AF37]/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-300 text-sm"><span className="font-bold text-[#D4AF37]">{pagination.total}</span> royal pieces</p>
              <div className="flex gap-2">
                <button onClick={() => handleSort('price')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 min-h-[44px] ${activeSort === 'price' ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg' : 'bg-black/60 text-gray-300 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'}`}>
                  <i className="bi bi-currency-dollar"></i>Price
                  {activeSort === 'price' && <i className={`bi bi-chevron-${filters.sort_order === 'asc' ? 'up' : 'down'} text-xs`}></i>}
                </button>
                <button onClick={() => handleSort('title')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 min-h-[44px] ${activeSort === 'title' ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg' : 'bg-black/60 text-gray-300 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'}`}>
                  <i className="bi bi-sort-alpha-down"></i>Name
                  {activeSort === 'title' && <i className={`bi bi-chevron-${filters.sort_order === 'asc' ? 'up' : 'down'} text-xs`}></i>}
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-black/40 rounded-xl border border-[#D4AF37]/10 overflow-hidden animate-pulse">
                  <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-[#D4AF37]/20 rounded w-3/4"></div>
                    <div className="h-3 bg-[#D4AF37]/10 rounded w-full"></div>
                    <div className="h-3 bg-[#D4AF37]/10 rounded w-2/3"></div>
                    <div className="h-6 bg-[#D4AF37]/20 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-12 text-center border border-[#D4AF37]/20">
              <i className="bi bi-emoji-frown text-6xl text-[#D4AF37]/40 mb-4 block"></i>
              <h3 className="text-xl font-bold text-white mb-2">No royal pieces found</h3>
              <p className="text-gray-400">Adjust your filters to discover more treasures.</p>
              <button onClick={clearAllFilters} className="mt-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-6 py-2.5 rounded-lg font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 min-h-[44px]">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}

          {pagination.last_page > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
              <button onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))} disabled={pagination.current_page === 1} className="px-6 py-2.5 rounded-lg border border-[#D4AF37]/30 bg-black/60 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]">
                <i className="bi bi-chevron-left"></i>Previous
              </button>
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, pagination.last_page))].map((_, i) => {
                  let pageNum;
                  if (pagination.last_page <= 5) pageNum = i+1;
                  else if (pagination.current_page <= 3) pageNum = i+1;
                  else if (pagination.current_page >= pagination.last_page - 2) pageNum = pagination.last_page - 4 + i;
                  else pageNum = pagination.current_page - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setPagination(prev => ({ ...prev, current_page: pageNum }))} className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 ${pagination.current_page === pageNum ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg' : 'bg-black/60 text-gray-300 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'}`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.last_page, prev.current_page + 1) }))} disabled={pagination.current_page === pagination.last_page} className="px-6 py-2.5 rounded-lg border border-[#D4AF37]/30 bg-black/60 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]">
                Next<i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for mobile filters */}
      {showFilters && (<div className="lg:hidden fixed inset-0 bg-black/80 z-40" onClick={() => setShowFilters(false)}></div>)}
    </div>
  );
};

export default Products;