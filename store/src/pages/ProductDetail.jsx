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
        alert('Review submitted! Thank you.');
        setReviewForm({ rating: 5, comment: '' });
        fetchProduct(); // Refresh to show new review
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

    // Optimistic Update
    const originalLiked = isLiked;
    setIsLiked(!originalLiked);

    try {
      const response = await productsAPI.toggleLike(product.id);
      if (!response.data.success) {
        setIsLiked(originalLiked);
      } else {
        // Update product state if needed (to sync count if we showed it)
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const discountPrice = product.discount_percentage 
    ? product.price - (product.price * product.discount_percentage / 100)
    : null;

  const themeStyles = {
    black: { bg: 'bg-black', text: 'text-white', btn: 'bg-gray-800 hover:bg-gray-700', badge: 'bg-gray-700' },
    blue: { bg: 'bg-blue-900', text: 'text-white', btn: 'bg-blue-700 hover:bg-blue-600', badge: 'bg-blue-800' },
    green: { bg: 'bg-green-900', text: 'text-white', btn: 'bg-green-700 hover:bg-green-600', badge: 'bg-green-800' },
    purple: { bg: 'bg-purple-900', text: 'text-white', btn: 'bg-purple-700 hover:bg-purple-600', badge: 'bg-purple-800' },
    gold: { bg: 'bg-amber-600', text: 'text-white', btn: 'bg-amber-800 hover:bg-amber-700', badge: 'bg-amber-700' },
  };

  const currentTheme = themeStyles[product.theme] || { bg: 'bg-white', text: 'text-gray-800', btn: 'bg-blue-600 hover:bg-blue-700', badge: 'bg-gray-100' };

  return (
    <div className={`min-h-screen -m-8 p-8 transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className={`${product.theme ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white shadow-md'} rounded-2xl p-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="mb-6 group">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0].image_url || product.images[0]} 
                  alt={product.title}
                  className="w-full rounded-2xl shadow-2xl transition transform group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200/20 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-400">
                  <i className="bi bi-image text-gray-400 text-6xl"></i>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image.image_url || image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-xl cursor-pointer hover:ring-4 hover:ring-white/50 transition border-2 border-transparent shadow-md"
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${currentTheme.badge} mb-4 inline-block`}>
                {product.theme} Edition
              </span>
              <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">{product.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <button onClick={handleLike} className="flex items-center gap-2 group transition hover:scale-110">
                  <i className={`bi ${isLiked ? 'bi-heart-fill text-red-500' : 'bi-heart'} text-3xl`}></i>
                  <span className="font-bold">{product.likes_count || 0}</span>
                </button>
                <div className="h-4 w-px bg-white/20"></div>
                {product.tags && product.tags.map(tag => (
                  <span key={tag.id} className={`${currentTheme.badge} px-3 py-1 rounded-lg text-sm font-medium`}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-lg leading-relaxed opacity-90 mb-8 max-w-xl">{product.description}</p>
            
            <div className="mb-8">
              {discountPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white">${Number(discountPrice).toFixed(2)}</span>
                  <span className="text-2xl opacity-50 line-through">${Number(product.price).toFixed(2)}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold animate-pulse">
                    SAVE {product.discount_percentage}%
                  </span>
                </div>
              ) : (
                <span className="text-5xl font-black">${Number(product.price).toFixed(2)}</span>
              )}
            </div>
            
            <div className="mt-auto">
              {product.stock > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl w-fit border border-white/10">
                    <label className="text-sm font-bold uppercase tracking-wider opacity-70">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                      >-</button>
                      <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className={`flex-1 ${currentTheme.btn} py-5 rounded-2xl font-black text-xl shadow-2xl transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3`}
                    >
                      <i className="bi bi-cart-plus text-2xl"></i>
                      {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                    </button>
                  </div>
                  <p className="text-sm opacity-60 italic">
                    Only {product.stock} items left in stock. Order soon!
                  </p>
                </div>
              ) : (
                <div className="bg-red-500/20 border border-red-500/50 p-6 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-red-400">Currently Out of Stock</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-20 border-t border-white/10 pt-12">
          {/* Review Form */}
          {user ? (
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-12 shadow-inner">
              <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-bold opacity-70 uppercase tracking-widest mb-3">Rating</label>
                  <div className="flex gap-2 text-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className={`transition transform hover:scale-125 ${star <= reviewForm.rating ? 'text-amber-400' : 'text-white/20'}`}
                      >
                        <i className={`bi ${star <= reviewForm.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold opacity-70 uppercase tracking-widest mb-3">Comment</label>
                  <textarea
                    required
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-white/30 min-h-[120px]"
                    placeholder="Share your thoughts about this product..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition transform active:scale-95 disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-12 text-center">
              <p className="opacity-70 mb-4">You must be logged in to write a review.</p>
              <Link to="/login" className="text-blue-400 font-bold hover:underline">Login Now</Link>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`bi ${i < Math.round(product.average_rating || 0) ? 'bi-star-fill' : 'bi-star'}`}></i>
                ))}
              </div>
              <span className="font-bold">({product.reviews?.length || 0})</span>
            </div>
          </div>
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map(review => (
                <div key={review.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold">
                        {review.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold">{review.user?.username || 'Anonymous'}</p>
                        <div className="flex text-amber-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="opacity-80 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              <i className="bi bi-chat-dots text-5xl mb-4 block"></i>
              <p>No reviews yet for this product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;