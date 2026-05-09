import { Link } from 'react-router-dom';
import { useState } from 'react';
import { productsAPI } from '../api/products';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product, onLikeToggle }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(product.is_liked || false);
  const [likesCount, setLikesCount] = useState(product.likes_count || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Optimistic Update
    const originalLiked = isLiked;
    const originalCount = likesCount;
    
    setIsLiked(!originalLiked);
    setLikesCount(prev => originalLiked ? prev - 1 : prev + 1);

    try {
      const response = await productsAPI.toggleLike(product.id);
      if (!response.data.success) {
        // Revert if failed
        setIsLiked(originalLiked);
        setLikesCount(originalCount);
      } else if (onLikeToggle) {
        onLikeToggle();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert if failed
      setIsLiked(originalLiked);
      setLikesCount(originalCount);
    }
  };

  const discountPrice = product.discount_percentage 
    ? product.price - (product.price * product.discount_percentage / 100)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/products/${product.id}`}>
        {product.images && product.images[0] ? (
          <img 
            src={product.images[0].image_url || product.images[0]} 
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <i className="bi bi-image text-gray-400 text-4xl"></i>
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        
        <div className="mt-2 flex items-center gap-2">
          {discountPrice ? (
            <>
              <span className="text-xl font-bold text-red-600">${Number(discountPrice).toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">${Number(product.price).toFixed(2)}</span>
              <span className="text-sm text-green-600">-{product.discount_percentage}%</span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-800">${Number(product.price).toFixed(2)}</span>
          )}
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <button 
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
          >
            <i className={`bi ${isLiked ? 'bi-heart-fill text-red-500' : 'bi-heart'}`}></i>
            <span className="text-sm">{likesCount}</span>
          </button>
          
          <Link 
            to={`/products/${product.id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;