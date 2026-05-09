import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../api/products';
import { cartAPI } from '../api/cart';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Review states
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getById(id);
      if (response.data.success) {
        setProduct(response.data.data);
        setIsLiked(response.data.data.is_liked || false);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await productsAPI.addReview(product.id, reviewForm);
      if (response.data.success) {
        setReviewForm({ rating: 5, comment: '' });
        fetchProduct();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await cartAPI.addItem(product.id, quantity);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
    setAddingToCart(false);
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const originalLiked = isLiked;
    setIsLiked(!originalLiked);

    try {
      const response = await productsAPI.toggleLike(product.id);
      if (!response.data.success) {
        setIsLiked(originalLiked);
      } else {
        setProduct(prev => ({
          ...prev,
          likes_count: response.data.likes_count
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(originalLiked);
    }
  };

  // Theme accent colors (only for accents, not backgrounds)
  const themeAccents = {
    black: {
      primary: 'bg-gray-900 hover:bg-gray-800',
      border: 'border-gray-800',
      text: 'text-gray-900',
      badge: 'bg-gray-100 text-gray-800 border-gray-200',
      tag: 'bg-gray-100 text-gray-700',
      buttonOutline: 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
      ring: 'ring-gray-800',
    },
    blue: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-600',
      text: 'text-blue-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      tag: 'bg-blue-50 text-blue-600',
      buttonOutline: 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
      ring: 'ring-blue-600',
    },
    green: {
      primary: 'bg-green-600 hover:bg-green-700',
      border: 'border-green-600',
      text: 'text-green-600',
      badge: 'bg-green-50 text-green-700 border-green-200',
      tag: 'bg-green-50 text-green-600',
      buttonOutline: 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
      ring: 'ring-green-600',
    },
    purple: {
      primary: 'bg-purple-600 hover:bg-purple-700',
      border: 'border-purple-600',
      text: 'text-purple-600',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      tag: 'bg-purple-50 text-purple-600',
      buttonOutline: 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
      ring: 'ring-purple-600',
    },
    gold: {
      primary: 'bg-amber-600 hover:bg-amber-700',
      border: 'border-amber-600',
      text: 'text-amber-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      tag: 'bg-amber-50 text-amber-600',
      buttonOutline: 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white',
      ring: 'ring-amber-600',
    },
  };

  const theme = themeAccents[product?.theme] || themeAccents.black;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-bag-fill text-gray-600 text-2xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-6 text-gray-500 font-medium animate-pulse">Loading masterpiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <i className="bi bi-emoji-frown text-6xl text-gray-400 mb-4"></i>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all">
          Back to Shop
        </Link>
      </div>
    );
  }

  const discountPrice = product.discount_percentage 
    ? product.price - (product.price * product.discount_percentage / 100)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md transition-all duration-200"
        >
          <i className="bi bi-arrow-left"></i>
          Back to Products
        </button>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="group relative overflow-hidden rounded-2xl bg-gray-100">
                {product.images && product.images[selectedImage] ? (
                  <>
                    <img 
                      src={product.images[selectedImage].image_url || product.images[selectedImage]} 
                      alt={product.title}
                      className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                  </>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300">
                    <i className="bi bi-image text-gray-400 text-6xl"></i>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedImage === index 
                          ? `ring-2 ${theme.ring} shadow-md scale-105` 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={image.image_url || image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col space-y-6">
              {/* Theme Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.badge} shadow-sm`}>
                  {product.theme?.toUpperCase() || 'PREMIUM'} Edition
                </span>
                {product.discount_percentage > 0 && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse shadow-md">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              
              {/* Tags & Actions */}
              <div className="flex flex-wrap items-center gap-4 py-2 border-t border-b border-gray-100">
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                >
                  <i className={`bi ${isLiked ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-500'} text-xl`}></i>
                  <span className="font-medium text-gray-700">{product.likes_count || 0}</span>
                </button>
                
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map(tag => (
                    <span key={tag.id} className={`px-3 py-1 rounded-lg text-xs font-medium ${theme.tag}`}>
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
              
              {/* Price Section */}
              <div className="space-y-2">
                {discountPrice ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black text-gray-900">
                        ${Number(discountPrice).toFixed(2)}
                      </span>
                      <span className="text-xl line-through text-gray-400">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-green-600 text-sm font-medium">
                      You save ${(product.price - discountPrice).toFixed(2)}!
                    </p>
                  </>
                ) : (
                  <span className="text-5xl font-black text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <i className={`bi ${product.stock > 0 ? 'bi-check-circle-fill text-green-500' : 'bi-x-circle-fill text-red-500'}`}></i>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>
              
              {/* Add to Cart Section */}
              {product.stock > 0 && (
                <div className="space-y-4 pt-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">Quantity:</span>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg text-gray-600 hover:bg-white transition-all duration-200 flex items-center justify-center"
                      >
                        <i className="bi bi-dash-lg"></i>
                      </button>
                      <span className="w-12 text-center text-xl font-bold text-gray-900">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 rounded-lg text-gray-600 hover:bg-white transition-all duration-200 flex items-center justify-center"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button - Theme colored */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`w-full ${theme.primary} text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                  >
                    {addingToCart ? (
                      <>
                        <i className="bi bi-arrow-repeat animate-spin"></i>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus text-2xl"></i>
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500">
                    Free shipping on orders over $50
                  </p>
                </div>
              )}
              
              {product.stock === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <i className="bi bi-emoji-frown text-4xl text-red-400 mb-2 block"></i>
                  <p className="text-red-600 font-medium">Currently Out of Stock</p>
                  <p className="text-sm text-red-500/70 mt-1">Check back soon!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="border-t border-gray-100 p-6 lg:p-8 bg-gray-50/30">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Review Form */}
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <i className="bi bi-pencil-square"></i>
                  Write a Review
                </h3>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Rating Stars */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                      <div className="flex gap-2 text-2xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`transition-all duration-200 hover:scale-125 ${
                              star <= reviewForm.rating ? 'text-amber-400' : 'text-gray-300'
                            }`}
                          >
                            <i className={`bi ${star <= reviewForm.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                      <textarea
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows="4"
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
                        placeholder="Share your experience with this product..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className={`${theme.primary} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
                    >
                      {submittingReview ? (
                        <>
                          <i className="bi bi-arrow-repeat animate-spin"></i>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send"></i>
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                    <i className="bi bi-box-arrow-in-right text-3xl text-gray-400 mb-3 block"></i>
                    <p className="text-gray-600 mb-3">Login to write a review</p>
                    <Link to="/login" className="inline-block px-6 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all">
                      Login Now
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Reviews List */}
              <div className="lg:w-1/2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <i className="bi bi-chat-dots"></i>
                    Customer Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi ${i < Math.round(product.average_rating || 0) ? 'bi-star-fill' : 'bi-star'} text-sm`}></i>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                      ({product.reviews?.length || 0})
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${theme.primary} flex items-center justify-center font-bold text-white shadow-md`}>
                              {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {review.user?.username || 'Anonymous'}
                              </p>
                              <div className="flex text-amber-400 text-xs gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                ))}
                              </div>
                            </div>
                          </div>
                          <i className="bi bi-quote text-2xl text-gray-300"></i>
                        </div>
                        <p className="text-gray-600 italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                      <i className="bi bi-chat-dots text-5xl text-gray-300 mb-3 block"></i>
                      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;