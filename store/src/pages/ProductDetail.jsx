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
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
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
    // optimistic update
    setIsLiked(!originalLiked);
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 300);

    try {
      const response = await productsAPI.toggleLike(product.id);
      if (!response.data.success) {
        setIsLiked(originalLiked);
      } else {
        const liked = response.data.liked ?? !originalLiked;
        const count = response.data.likes_count ?? (liked ? (product.likes_count || 0) + 1 : (product.likes_count || 0) - 1);
        setIsLiked(liked);
        setProduct(prev => ({
          ...prev,
          likes_count: count
        }));
        try { window.dispatchEvent(new CustomEvent('product-liked', { detail: { id: product.id, likes_count: count, is_liked: liked } })); } catch (e) {}
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(originalLiked);
    }
  };

  // Enhanced Theme Gradients & Colors
  const themeStyles = {
    black: {
      primary: 'bg-gradient-to-r from-gray-800 to-gray-900',
      primaryHover: 'hover:from-gray-900 hover:to-gray-950',
      primaryLight: 'from-gray-100 to-gray-200',
      border: 'border-gray-800',
      text: 'text-gray-900',
      textLight: 'text-gray-700',
      badge: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white',
      tag: 'bg-gray-100 text-gray-800 border-gray-200',
      starColor: 'text-amber-400',
      buttonOutline: 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
      ring: 'ring-gray-800',
      accent: 'from-gray-700 to-gray-800',
      reviewBg: 'bg-gray-50',
      iconColor: 'text-gray-700',
      gradientBg: 'bg-gradient-to-br from-gray-50 to-gray-100',
    },
    blue: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700',
      primaryHover: 'hover:from-blue-700 hover:to-blue-800',
      primaryLight: 'from-blue-50 to-blue-100',
      border: 'border-blue-600',
      text: 'text-blue-600',
      textLight: 'text-blue-500',
      badge: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      tag: 'bg-blue-50 text-blue-700 border-blue-200',
      starColor: 'text-amber-400',
      buttonOutline: 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
      ring: 'ring-blue-600',
      accent: 'from-blue-600 to-indigo-600',
      reviewBg: 'bg-blue-50/30',
      iconColor: 'text-blue-500',
      gradientBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    },
    green: {
      primary: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      primaryHover: 'hover:from-emerald-700 hover:to-teal-700',
      primaryLight: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-600',
      text: 'text-emerald-600',
      textLight: 'text-emerald-500',
      badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      tag: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      starColor: 'text-amber-400',
      buttonOutline: 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white',
      ring: 'ring-emerald-600',
      accent: 'from-emerald-600 to-teal-600',
      reviewBg: 'bg-emerald-50/30',
      iconColor: 'text-emerald-500',
      gradientBg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    },
    purple: {
      primary: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      primaryHover: 'hover:from-purple-700 hover:to-indigo-700',
      primaryLight: 'from-purple-50 to-indigo-50',
      border: 'border-purple-600',
      text: 'text-purple-600',
      textLight: 'text-purple-500',
      badge: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
      tag: 'bg-purple-50 text-purple-700 border-purple-200',
      starColor: 'text-amber-400',
      buttonOutline: 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
      ring: 'ring-purple-600',
      accent: 'from-purple-600 to-indigo-600',
      reviewBg: 'bg-purple-50/30',
      iconColor: 'text-purple-500',
      gradientBg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    },
    gold: {
      primary: 'bg-gradient-to-r from-amber-500 to-orange-600',
      primaryHover: 'hover:from-amber-600 hover:to-orange-700',
      primaryLight: 'from-amber-50 to-orange-50',
      border: 'border-amber-600',
      text: 'text-amber-600',
      textLight: 'text-amber-500',
      badge: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
      tag: 'bg-amber-50 text-amber-700 border-amber-200',
      starColor: 'text-amber-400',
      buttonOutline: 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white',
      ring: 'ring-amber-600',
      accent: 'from-amber-500 to-orange-600',
      reviewBg: 'bg-amber-50/30',
      iconColor: 'text-amber-500',
      gradientBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    },
  };

  const theme = themeStyles[product?.theme] || themeStyles.black;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className={`bi bi-bag-fill ${theme.iconColor} text-2xl animate-pulse`}></i>
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
        <Link to="/products" className={`${theme.primary} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all`}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const discountPrice = product.discount_percentage 
    ? product.price - (product.price * product.discount_percentage / 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white border ${theme.border} ${theme.text} hover:shadow-md transition-all duration-200`}
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
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                {product.images && product.images[selectedImage] ? (
                  <>
                    <img 
                      src={product.images[selectedImage].image_url || product.images[selectedImage]} 
                      alt={product.title}
                      className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300">
                    <i className={`bi bi-image ${theme.textLight} text-6xl`}></i>
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
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${theme.badge}`}>
                  {product.theme?.toUpperCase() || 'PREMIUM'} Edition
                </span>
                {product.discount_percentage > 0 && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse shadow-md">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
              </div>
              
              {/* Title */}
              <h1 className={`text-4xl lg:text-5xl font-bold ${theme.text} leading-tight`}>
                {product.title}
              </h1>
              
              {/* Tags & Actions */}
              <div className="flex flex-wrap items-center gap-4 py-2 border-t border-b border-gray-100">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:${theme.reviewBg} transition-all duration-200 border border-gray-200`}
                >
                  {(() => {
                    const themeColorMap = {
                      black: 'text-gray-900',
                      blue: 'text-blue-600',
                      green: 'text-green-600',
                      purple: 'text-purple-600',
                      gold: 'text-amber-600',
                    };
                    const themeColorClass = themeColorMap[product.theme] || 'text-red-500';
                    return (
                      <>
                        <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} ${isLiked ? themeColorClass : 'text-gray-500'} text-xl transition-transform duration-200 ${likeAnimating ? 'scale-125' : ''}`}></i>
                        <span className={`font-medium ${isLiked ? 'text-current' : theme.textLight}`}>{product.likes_count || 0}</span>
                      </>
                    );
                  })()}
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
                      <span className={`text-5xl font-black ${theme.text}`}>
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
                  <span className={`text-5xl font-black ${theme.text}`}>
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
                    <div className={`flex items-center gap-2 ${theme.reviewBg} rounded-xl p-1 border border-gray-200`}>
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className={`w-10 h-10 rounded-lg ${theme.textLight} hover:bg-white transition-all duration-200 flex items-center justify-center`}
                      >
                        <i className="bi bi-dash-lg"></i>
                      </button>
                      <span className="w-12 text-center text-xl font-bold text-gray-900">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className={`w-10 h-10 rounded-lg ${theme.textLight} hover:bg-white transition-all duration-200 flex items-center justify-center`}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button - Theme colored gradient */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`w-full ${theme.primary} ${theme.primaryHover} text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
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
          <div className={`border-t border-gray-100 p-6 lg:p-8 ${theme.reviewBg}`}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Review Form */}
              <div className="lg:w-1/2">
                <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                  <i className="bi bi-pencil-square"></i>
                  Write a Review
                </h3>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Rating Stars - Theme colored */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                      <div className="flex gap-2 text-3xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`transition-all duration-200 hover:scale-125 ${theme.starColor}`}
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
                        className={`w-full bg-white border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 ${theme.ring} focus:border-transparent text-gray-900 placeholder-gray-400 resize-none`}
                        placeholder="Share your experience with this product..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className={`${theme.primary} ${theme.primaryHover} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
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
                  <div className={`bg-white rounded-xl p-6 text-center border ${theme.border}`}>
                    <i className={`bi bi-box-arrow-in-right text-3xl ${theme.textLight} mb-3 block`}></i>
                    <p className="text-gray-600 mb-3">Login to write a review</p>
                    <Link to="/login" className={`${theme.primary} text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all inline-block`}>
                      Login Now
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Reviews List */}
              <div className="lg:w-1/2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-2xl font-bold ${theme.text} flex items-center gap-2`}>
                    <i className="bi bi-chat-dots"></i>
                    Customer Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={theme.starColor}>
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
                              <div className={theme.starColor}>
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'} text-xs`}></i>
                                ))}
                              </div>
                            </div>
                          </div>
                          <i className={`bi bi-quote text-2xl ${theme.textLight}`}></i>
                        </div>
                        <p className="text-gray-600 italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                      <i className={`bi bi-chat-dots text-5xl ${theme.textLight} mb-3 block`}></i>
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