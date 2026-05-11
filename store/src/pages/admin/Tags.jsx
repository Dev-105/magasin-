import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

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
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-4 py-2 rounded-xl shadow-2xl z-50 animate-fade-in font-bold';
        successMsg.innerHTML = '<i class="bi bi-check-circle mr-2"></i>Royal tag created successfully';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create tag');
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete tag "${name}"? This will remove it from all royal products.`)) {
      try {
        await adminAPI.deleteTag(id);
        fetchTags();
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-4 py-2 rounded-xl shadow-2xl z-50 animate-fade-in font-bold';
        successMsg.innerHTML = '<i class="bi bi-check-circle mr-2"></i>Tag deleted successfully';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } catch (error) {
        // alert('Failed to delete tag');
      }
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTagColor = (index) => {
    const colors = [
      'from-[#D4AF37] to-[#FFD700]',
      'from-emerald-500 to-emerald-600',
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-rose-500 to-rose-600',
      'from-cyan-500 to-cyan-600',
    ];
    return colors[index % colors.length];
  };

  if (loading && tags.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin shadow-lg shadow-[#D4AF37]/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-[#D4AF37] font-medium">Loading royal tags...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <i className="bi bi-tags-fill text-black text-lg"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              Royal Tag Management
            </h1>
          </div>
          <p className="text-gray-400 mt-1 ml-13">Organize royal products with custom tags</p>
        </div>
        
        {/* Stats Badge */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-xl px-5 py-2.5 border border-[#D4AF37]/20">
          <i className="bi bi-tags text-[#D4AF37]"></i>
          <span className="text-sm text-gray-400">Total Tags:</span>
          <span className="text-lg font-bold text-[#D4AF37]">{tags.length}</span>
        </div>
      </div>

      {/* Add New Tag Form - Royal Gold */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border-2 border-[#D4AF37]/30">
        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 px-6 py-4 border-b border-[#D4AF37]/20">
          <h2 className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
            <i className="bi bi-plus-circle"></i>
            <span>Create New Royal Tag</span>
          </h2>
        </div>
        
        <form onSubmit={handleCreate} className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <i className="bi bi-tag absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50"></i>
              <input
                type="text"
                placeholder="Enter tag name (e.g., luxury, exclusive, premium)"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-[#D4AF37]/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Royal Tag</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            <i className="bi bi-info-circle"></i>
            Tag names should be unique and descriptive for royal categorization
          </p>
        </form>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50"></i>
          <input
            type="text"
            placeholder="Search royal tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/40 backdrop-blur-md border-2 border-[#D4AF37]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-white placeholder:text-gray-500"
          />
        </div>
        <button
          onClick={() => setSearchTerm('')}
          className="text-[#D4AF37] hover:text-[#FFD700] text-sm font-bold transition-colors min-h-[40px] px-4 rounded-lg hover:bg-[#D4AF37]/10"
        >
          <i className="bi bi-arrow-repeat mr-1"></i>
          Reset
        </button>
      </div>

      {/* Tags Grid View */}
      {filteredTags.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center border border-[#D4AF37]/20">
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-tag text-3xl text-[#D4AF37]/40"></i>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No royal tags found</h3>
          <p className="text-gray-400">
            {searchTerm ? `No tags matching "${searchTerm}"` : "Create your first royal tag to get started"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-[#D4AF37] hover:text-[#FFD700] text-sm font-bold"
            >
              Clear search →
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTags.map((tag, index) => (
              <div
                key={tag.id}
                className="group bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-500 overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Tag Header - Royal Gradient */}
                <div className={`bg-gradient-to-r ${getTagColor(index)} p-4 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <i className="bi bi-crown-fill text-white text-lg"></i>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg capitalize">{tag.name}</h3>
                        <p className="text-white/80 text-xs">Royal ID: #{tag.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(tag.id, tag.name)}
                      className="text-white/70 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300"
                    >
                      <i className="bi bi-trash text-lg"></i>
                    </button>
                  </div>
                </div>
                
                {/* Tag Stats */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <i className="bi bi-box-seam"></i>
                      <span className="text-sm">Products with this tag</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#D4AF37]">{tag.products_count}</span>
                      <span className="text-sm text-gray-500">products</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar - Gold */}
                  <div className="bg-black/60 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${getTagColor(index)} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, (tag.products_count / Math.max(...tags.map(t => t.products_count), 1)) * 100)}%` }}
                    ></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tag.name);
                        const tooltip = document.createElement('div');
                        tooltip.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-3 py-2 rounded-lg text-sm z-50 animate-fade-in font-bold';
                        tooltip.innerHTML = '<i class="bi bi-check2-circle mr-1"></i>Copied!';
                        document.body.appendChild(tooltip);
                        setTimeout(() => tooltip.remove(), 2000);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-300 text-sm font-bold border border-[#D4AF37]/30"
                    >
                      <i className="bi bi-clipboard"></i>
                      <span>Copy Name</span>
                    </button>
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.value = `Royal Tag: ${tag.name} | Products: ${tag.products_count}`;
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand('copy');
                        document.body.removeChild(input);
                        const tooltip = document.createElement('div');
                        tooltip.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-3 py-2 rounded-lg text-sm z-50 animate-fade-in font-bold';
                        tooltip.innerHTML = '<i class="bi bi-check2-circle mr-1"></i>Info copied!';
                        document.body.appendChild(tooltip);
                        setTimeout(() => tooltip.remove(), 2000);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-300 text-sm font-bold border border-[#D4AF37]/30"
                    >
                      <i className="bi bi-info-circle"></i>
                      <span>Copy Info</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Footer */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-[#D4AF37]/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <i className="bi bi-tags text-[#D4AF37]"></i>
                <span className="text-sm text-gray-400">
                  Showing <span className="font-bold text-[#D4AF37]">{filteredTags.length}</span> of <span className="font-bold text-[#D4AF37]">{tags.length}</span> royal tags
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <i className="bi bi-box-seam"></i>
                  <span>Total products tagged: {tags.reduce((sum, tag) => sum + tag.products_count, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTags;