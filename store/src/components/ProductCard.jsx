// ProductCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { productsAPI } from '../api/products';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product, onLikeToggle }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(product.is_liked || false);
  const [likesCount, setLikesCount] = useState(product.likes_count || 0);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const originalLiked = isLiked;
    const originalCount = likesCount;
    setIsLiked(!originalLiked);
    setLikesCount(prev => originalLiked ? prev - 1 : prev + 1);
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 300);

    try {
      const response = await productsAPI.toggleLike(product.id);
      if (!response.data.success) {
        setIsLiked(originalLiked);
        setLikesCount(originalCount);
      } else {
        const liked = response.data.liked ?? !originalLiked;
        const count = response.data.likes_count ?? (liked ? originalCount + 1 : originalCount - 1);
        setIsLiked(liked);
        setLikesCount(count);
        try { window.dispatchEvent(new CustomEvent('product-liked', { detail: { id: product.id, likes_count: count, is_liked: liked } })); } catch (e) {}
        if (onLikeToggle) onLikeToggle();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(originalLiked);
      setLikesCount(originalCount);
    }
  };

  const discountPrice = product.discount_percentage 
    ? product.price - (product.price * product.discount_percentage / 100)
    : null;

  const firstImage = product.images && product.images[0] 
    ? (product.images[0].image_url || product.images[0]) 
    : null;

  return (
    <div 
      className="group relative bg-gradient-to-br from-black to-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 border border-[#D4AF37]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="block overflow-hidden bg-gradient-to-br from-gray-900 to-black relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-gem text-[#D4AF37]/30 text-4xl animate-pulse"></i>
          </div>
        )}
        {firstImage ? (
          <img 
            src={firstImage} 
            alt={product.title}
            className={`w-full h-64 md:h-72 object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-64 md:h-72 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <i className="bi bi-gem text-[#D4AF37]/30 text-6xl"></i>
          </div>
        )}

        {/* Discount Badge - Gold */}
        {product.discount_percentage && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
            -{product.discount_percentage}% OFF
          </div>
        )}

        {/* Gold overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#D4AF37]/0 to-[#D4AF37]/0 transition-all duration-500 ${isHovered ? 'bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent' : ''}`}></div>
      </div>
      
      {/* Content */}
      <div className="p-5 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 transition-colors line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price Section - Gold */}
        <div className="mt-3 flex items-baseline gap-2">
          {discountPrice ? (
            <>
              <span className="text-2xl md:text-3xl font-bold text-[#D4AF37]">
                {`MAD ${Number(discountPrice).toFixed(2)}`}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {`MAD ${Number(product.price).toFixed(2)}`}
              </span>
            </>
          ) : (
            <span className="text-2xl md:text-3xl font-bold text-[#D4AF37]">
              {`MAD ${Number(product.price).toFixed(2)}`}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={handleLike}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-[#D4AF37]/10 group min-h-[44px]"
          >
            <i className={`bi ${isLiked ? 'bi-heart-fill text-[#D4AF37]' : 'bi-heart text-gray-500 group-hover:text-[#D4AF37]'} text-xl transition-all duration-200 ${likeAnimating ? 'scale-125' : ''}`}></i>
            <span className={`text-sm font-medium ${isLiked ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
              {likesCount}
            </span>
          </button>
          
          <Link 
            to={`/products/${product.id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105 transition-all duration-300 text-sm font-bold min-h-[44px]"
          >
            <span>View Details</span>
            <i className="bi bi-arrow-right text-sm"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;