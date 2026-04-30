import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.image_url || '/api/placeholder/300/300';
  const discountedPrice = product.discounted_price || product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/products/${product.id}`}>
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.average_rating || 0} ({product.reviews_count || 0})
            </span>
          </div>
          <div className="ml-auto flex items-center text-gray-500">
            <Heart className="w-4 h-4" />
            <span className="text-sm ml-1">{product.likes_count || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {product.discount_percentage > 0 ? (
              <div>
                <span className="text-lg font-bold text-red-600">
                  ${discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                ${product.price}
              </span>
            )}
          </div>
          <Link
            to={`/products/${product.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;