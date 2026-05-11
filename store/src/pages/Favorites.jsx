import { useEffect, useState } from 'react';
import { productsAPI } from '../api/products';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getLikes();
      if (response.data.success) {
        setLikes(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-sm animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-[#D4AF37] text-sm font-medium animate-pulse">Loading royal favorites...</p>
      </div>
    );
  }

  if (!likes || likes.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center">
        <div className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-8 border-2 border-[#D4AF37]/20 max-w-md">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 rounded-full flex items-center justify-center mb-4">
            <i className="bi bi-heart-fill text-4xl text-[#D4AF37]"></i>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Royal Favorites Yet</h2>
          <p className="text-sm text-gray-400 mt-2">Like products to add them to your royal collection.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black rounded-xl font-bold hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300 min-h-[44px]"
          >
            Browse Treasury
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <i className="bi bi-heart-fill text-black text-lg"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
            Royal Favorites
          </h1>
        </div>
        <p className="text-sm text-gray-400 ml-13">Your curated collection of liked treasures</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {likes.map((like) => (
          <div 
            key={like.id} 
            onClick={() => navigate(`/products/${like.product_id}`)}
            className="group bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black h-40 md:h-48">
              {like.product?.images && like.product.images[0] ? (
                <>
                  <img 
                    src={like.product.images[0].image_url || like.product.images[0]} 
                    alt={like.product?.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <i className="bi bi-gem text-4xl text-[#D4AF37]/30"></i>
                </div>
              )}
              
              {/* Favorite Badge */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
                <i className="bi bi-heart-fill text-black text-xs"></i>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-3 md:p-4">
              <p className="text-sm md:text-base font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors duration-300">
                {like.product?.title}
              </p>
              <p className="text-sm md:text-base font-bold text-[#D4AF37] mt-1">
                {`MAD ${Number(like.product?.price || 0).toFixed(2)}`}
              </p>
              
              {/* View Details Link */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-xs text-[#D4AF37] flex items-center gap-1">
                  View Details <i className="bi bi-arrow-right text-xs"></i>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-[#D4AF37]/20 text-center">
        <p className="text-xs text-gray-500">
          <span className="text-[#D4AF37] font-bold">{likes.length}</span> royal treasures in your collection
        </p>
      </div>
    </div>
  );
};

export default Favorites;