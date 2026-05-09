import { Link } from 'react-router-dom';
import { useState } from 'react';
import { productsAPI } from '../api/products';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product, onLikeToggle }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(product.is_liked || false);
  const [likesCount, setLikesCount] = useState(product.likes_count || 0);
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

    try {
      const response = await productsAPI.toggleLike(product.id);
      if (!response.data.success) {
        setIsLiked(originalLiked);
        setLikesCount(originalCount);
      } else if (onLikeToggle) {
        onLikeToggle();
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
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="block overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
        
        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transform transition-transform duration-300 hover:scale-105">
            Quick View
          </span>
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        
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
            <i className={`bi ${isLiked ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-500 group-hover:text-red-500'} text-lg transition-colors`}></i>
            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
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