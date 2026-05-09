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
    // optimistic UI: toggle locally
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
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container (no link) */}
      <div className="block overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-image text-gray-400 text-4xl animate-pulse"></i>
          </div>
        )}
        {firstImage ? (
          <img 
            src={firstImage} 
            alt={product.title}
            className={`w-full h-64 object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <i className="bi bi-image text-gray-400 text-5xl"></i>
          </div>
        )}

        {/* Discount Badge */}
        {product.discount_percentage && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
            -{product.discount_percentage}%
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 transition-colors line-clamp-1">
          {product.title}
        </h3>
        
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price Section */}
        <div className="mt-3 flex items-baseline gap-2">
          {discountPrice ? (
            <>
              <span className="text-2xl font-bold text-gray-900">
                ${Number(discountPrice).toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${Number(product.price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={handleLike}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-red-50 group"
          >
            <i className={`bi ${isLiked ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-500 group-hover:text-red-500'} text-lg transition-transform duration-200 ${likeAnimating ? 'scale-125' : ''}`}></i>
            <span className={`text-sm font-medium ${isLiked ? 'text-current' : 'text-gray-600'}`}>
              {likesCount}
            </span>
          </button>
          
          <Link 
            to={`/products/${product.id}`}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-md text-sm font-medium"
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