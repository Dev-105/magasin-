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
      // alert(error.response?.data?.message || 'Failed to submit review');
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
      // alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // alert('Failed to add to cart');
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

  // Theme styles that respect the product's theme
  const getThemeStyles = (themeName) => {
    const themes = {
      black: {
        primary: 'bg-gradient-to-r from-gray-800 to-gray-900',
        primaryHover: 'hover:from-gray-900 hover:to-gray-950',
        border: 'border-gray-700',
        borderLight: 'border-gray-700/30',
        text: 'text-gray-900',
        textGold: 'text-gray-900',
        buttonText: 'text-white',
        badge: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white',
        tag: 'bg-gray-800/60 text-gray-300 border-gray-700',
        starColor: 'text-amber-400',
        ring: 'ring-gray-600',
        iconColor: 'text-gray-400',
        buttonOutline: 'border-gray-600 text-gray-300 hover:bg-gray-800',
        quantityBg: 'bg-gray-800/60',
        reviewBg: 'bg-gray-800/30',
      },
      blue: {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700',
        primaryHover: 'hover:from-blue-700 hover:to-blue-800',
        border: 'border-blue-500',
        borderLight: 'border-blue-500/30',
        text: 'text-blue-400',
        textGold: 'text-blue-400',
        buttonText: 'text-white',
        badge: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
        tag: 'bg-blue-800/60 text-blue-300 border-blue-700',
        starColor: 'text-amber-400',
        ring: 'ring-blue-500',
        iconColor: 'text-blue-400',
        buttonOutline: 'border-blue-500 text-blue-300 hover:bg-blue-800',
        quantityBg: 'bg-blue-800/60',
        reviewBg: 'bg-blue-800/30',
      },
      green: {
        primary: 'bg-gradient-to-r from-emerald-600 to-teal-600',
        primaryHover: 'hover:from-emerald-700 hover:to-teal-700',
        border: 'border-emerald-500',
        borderLight: 'border-emerald-500/30',
        text: 'text-emerald-400',
        textGold: 'text-emerald-400',
        buttonText: 'text-white',
        badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
        tag: 'bg-emerald-800/60 text-emerald-300 border-emerald-700',
        starColor: 'text-amber-400',
        ring: 'ring-emerald-500',
        iconColor: 'text-emerald-400',
        buttonOutline: 'border-emerald-500 text-emerald-300 hover:bg-emerald-800',
        quantityBg: 'bg-emerald-800/60',
        reviewBg: 'bg-emerald-800/30',
      },
      purple: {
        primary: 'bg-gradient-to-r from-purple-600 to-indigo-600',
        primaryHover: 'hover:from-purple-700 hover:to-indigo-700',
        border: 'border-purple-500',
        borderLight: 'border-purple-500/30',
        text: 'text-purple-400',
        textGold: 'text-purple-400',
        buttonText: 'text-white',
        badge: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
        tag: 'bg-purple-800/60 text-purple-300 border-purple-700',
        starColor: 'text-amber-400',
        ring: 'ring-purple-500',
        iconColor: 'text-purple-400',
        buttonOutline: 'border-purple-500 text-purple-300 hover:bg-purple-800',
        quantityBg: 'bg-purple-800/60',
        reviewBg: 'bg-purple-800/30',
      },
      gold: {
        primary: 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700]',
        primaryHover: 'hover:from-[#FFD700] hover:to-[#D4AF37]',
        border: 'border-[#D4AF37]',
        borderLight: 'border-[#D4AF37]/40',
        text: 'text-[#D4AF37]',
        textGold: 'text-[#D4AF37]',
        buttonText: 'text-black',
        badge: 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black',
        tag: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40',
        starColor: 'text-[#D4AF37]',
        ring: 'ring-[#D4AF37]',
        iconColor: 'text-[#D4AF37]',
        buttonOutline: 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/20',
        quantityBg: 'bg-[#D4AF37]/20',
        reviewBg: 'bg-[#D4AF37]/10',
      },
    };
    return themes[themeName] || themes.gold;
  };

  const theme = getThemeStyles(product?.theme || 'gold');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin shadow-lg shadow-[#D4AF37]/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-3xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-6 text-[#D4AF37] font-medium animate-pulse tracking-wide">Loading royal piece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <i className="bi bi-emoji-frown text-6xl text-[#D4AF37]/40 mb-4"></i>
        <h2 className="text-2xl font-bold text-white mb-2">Royal Piece Not Found</h2>
        <p className="text-gray-400 mb-6">The treasure you're seeking doesn't exist in our collection.</p>
        <Link to="/products" className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300">
          Back to Treasury
        </Link>
      </div>
    );
  }

  const discountPrice = product.discount_percentage 
    ? product.price - (product.price * product.discount_percentage / 100)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button - Theme Respecting */}
        <button
          onClick={() => navigate('/products')}
          className={`mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black/60 backdrop-blur-md border-2 ${theme.borderLight} ${theme.text} hover:${theme.border} hover:shadow-lg transition-all duration-300 min-h-[44px]`}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Treasury
        </button>

        {/* Main Product Card - Glassmorphism Dark */}
        <div className={`bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl border-2 ${theme.borderLight} overflow-hidden`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border ${theme.borderLight}`}>
                {product.images && product.images[selectedImage] ? (
                  <>
                    <img 
                      src={product.images[selectedImage].image_url || product.images[selectedImage]} 
                      alt={product.title}
                      className="w-full h-auto object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center rounded-xl border-2 border-dashed border-[#D4AF37]/30 bg-black/60">
                    <i className="bi bi-gem text-[#D4AF37]/40 text-6xl"></i>
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
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                        selectedImage === index 
                          ? `ring-2 ${theme.ring} shadow-lg scale-105` 
                          : `opacity-60 hover:opacity-100 border ${theme.borderLight}`
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
              {/* Theme Badge - Theme Respecting */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg ${theme.badge}`}>
                  {product.theme?.toUpperCase() || 'PREMIUM'} Edition
                </span>
                {product.discount_percentage > 0 && (
                  <span className="px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 text-white animate-pulse shadow-lg">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
              </div>
              
              {/* Title - Theme Respecting */}
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${theme.text} leading-tight`}>
                {product.title}
              </h1>
              
              {/* Tags & Actions */}
              <div className={`flex flex-wrap items-center gap-4 py-2 border-t border-b ${theme.borderLight}`}>
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 hover:bg-[#D4AF37]/10 transition-all duration-300 border ${theme.borderLight} min-h-[44px]`}
                >
                  <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} ${isLiked ? theme.text : 'text-gray-500'} text-xl transition-all duration-300 ${likeAnimating ? 'scale-125' : ''}`}></i>
                  <span className={`font-medium ${isLiked ? theme.text : 'text-gray-400'}`}>{product.likes_count || 0}</span>
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
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                {product.description}
              </p>
              
              {/* Price Section - Theme Respecting */}
              <div className="space-y-2">
                {discountPrice ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-4xl md:text-5xl font-black ${theme.text}`}>
                        {`MAD ${Number(discountPrice).toFixed(2)}`}
                      </span>
                      <span className="text-lg line-through text-gray-500">
                        {`MAD ${Number(product.price).toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-green-500 text-sm font-medium">
                      You save {`MAD ${(product.price - discountPrice).toFixed(2)}`}!
                    </p>
                  </>
                ) : (
                  <span className={`text-4xl md:text-5xl font-black ${theme.text}`}>
                    {`MAD ${Number(product.price).toFixed(2)}`}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <i className={`bi ${product.stock > 0 ? 'bi-check-circle-fill text-green-500' : 'bi-x-circle-fill text-red-500'}`}></i>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>
              
              {/* Add to Cart Section */}
              {product.stock > 0 && (
                <div className="space-y-4 pt-4">
                  {/* Quantity Selector - Theme Respecting */}
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-medium">Quantity:</span>
                    <div className={`flex items-center gap-2 ${theme.quantityBg} rounded-lg p-1 border ${theme.borderLight}`}>
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className={`w-10 h-10 rounded-lg ${theme.text} hover:bg-white/10 transition-all duration-300 flex items-center justify-center`}
                      >
                        <i className="bi bi-dash-lg"></i>
                      </button>
                      <span className={`w-12 text-center text-xl font-bold ${theme.text}`}>{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className={`w-10 h-10 rounded-lg ${theme.text} hover:bg-white/10 transition-all duration-300 flex items-center justify-center`}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button - Theme Respecting */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`w-full ${theme.primary} ${theme.primaryHover} ${theme.buttonText} py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-h-[56px]`}
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
                    Free shipping on orders over MAD 50
                  </p>
                </div>
              )}
              
              {product.stock === 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                  <i className="bi bi-emoji-frown text-4xl text-red-400 mb-2 block"></i>
                  <p className="text-red-400 font-medium">Currently Out of Stock</p>
                  <p className="text-sm text-red-400/70 mt-1">Check back soon!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews Section - Theme Respecting */}
          <div className={`border-t ${theme.borderLight} p-6 lg:p-8 ${theme.reviewBg}`}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Review Form */}
              <div className="lg:w-1/2">
                <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                  <i className="bi bi-pencil-square"></i>
                  Write a Review
                </h3>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Rating Stars - Theme Respecting */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Your Rating</label>
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
                      <label className="block text-sm font-medium text-gray-400 mb-2">Your Review</label>
                      <textarea
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows="4"
                        className={`w-full bg-black/60 border-2 ${theme.borderLight} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white placeholder:text-gray-500 resize-none transition-all`}
                        placeholder="Share your experience with this royal piece..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className={`${theme.primary} ${theme.primaryHover} ${theme.buttonText} px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 flex items-center gap-2 min-h-[48px]`}
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
                  <div className={`bg-black/60 rounded-xl p-6 text-center border-2 ${theme.borderLight} backdrop-blur-sm`}>
                    <i className={`bi bi-box-arrow-in-right text-3xl ${theme.text} mb-3 block`}></i>
                    <p className="text-gray-400 mb-3">Login to write a review</p>
                    <Link to="/login" className={`${theme.primary} ${theme.buttonText} px-6 py-2 rounded-lg font-bold transition-all inline-block`}>
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
                    Royal Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={theme.starColor}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi ${i < Math.round(product.average_rating || 0) ? 'bi-star-fill' : 'bi-star'} text-sm`}></i>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      ({product.reviews?.length || 0})
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className={`bg-black/60 rounded-xl p-5 border ${theme.borderLight} hover:border-opacity-60 hover:shadow-lg transition-all duration-300`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${theme.primary} flex items-center justify-center font-bold ${theme.buttonText} shadow-lg`}>
                              {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {review.user?.username || 'Anonymous'}
                              </p>
                              <div className={theme.starColor}>
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'} text-xs`}></i>
                                ))}
                              </div>
                            </div>
                          </div>
                          <i className={`bi bi-quote text-2xl ${theme.text}/50`}></i>
                        </div>
                        <p className="text-gray-300 italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 bg-black/60 rounded-xl border ${theme.borderLight}`}>
                      <i className={`bi bi-chat-dots text-5xl ${theme.text}/40 mb-3 block`}></i>
                      <p className="text-gray-400">No reviews yet. Be the first to review!</p>
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