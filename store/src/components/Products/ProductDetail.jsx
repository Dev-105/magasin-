import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, likeProduct, unlikeProduct, addToCart } from '../../api';
import ProductReviews from './ProductReviews';
import LoadingSpinner from '../Common/LoadingSpinner';
import Alert from '../Common/Alert';
import { Heart, ShoppingCart, Star, Truck, Shield } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [alert, setAlert] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await getProduct(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setAlert({ type: 'error', message: 'Failed to load product' });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await unlikeProduct(id);
        setIsLiked(false);
        setProduct(prev => ({ ...prev, likes_count: prev.likes_count - 1 }));
      } else {
        await likeProduct(id);
        setIsLiked(true);
        setProduct(prev => ({ ...prev, likes_count: prev.likes_count + 1 }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({ product_id: parseInt(id), quantity });
      setAlert({ type: 'success', message: 'Product added to cart!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add to cart' });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>Product not found</div>;

  const imageUrl = product.images?.[0]?.image_url || '/api/placeholder/500/500';
  const discountedPrice = product.discounted_price || product.price;

  return (
    <div className="max-w-6xl mx-auto">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-gray-600 ml-1">
                  {product.average_rating || 0} ({product.reviews_count || 0} reviews)
                </span>
              </div>
              <button
                onClick={handleLike}
                className="ml-6 flex items-center gap-1 text-gray-600 hover:text-red-600 transition"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                <span>{product.likes_count}</span>
              </button>
            </div>
            
            <div className="mb-4">
              {product.discount_percentage > 0 ? (
                <div>
                  <span className="text-3xl font-bold text-red-600">
                    ${discountedPrice}
                  </span>
                  <span className="text-xl text-gray-500 line-through ml-3">
                    ${product.price}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                    -{product.discount_percentage}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-800">
                  ${product.price}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="mb-4">
              <span className="text-sm text-gray-500">Stock: {product.stock} items</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">2-year warranty on all products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ProductReviews productId={parseInt(id)} />
    </div>
  );
};

export default ProductDetail;