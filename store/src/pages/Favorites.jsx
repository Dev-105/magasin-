import { useEffect, useState } from 'react';
import { productsAPI } from '../api/products';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getLikes();
      if (response.data.success) {
        setLikes(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center">Loading favorites...</div>;
  }

  if (!likes || likes.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center">
        <div className="text-center bg-white/50 backdrop-blur-sm rounded-3xl p-8">
          <i className="bi bi-heart-fill text-4xl text-rose-500 mb-4"></i>
          <h2 className="text-xl font-semibold">No favorites yet</h2>
          <p className="text-sm text-gray-500 mt-2">Like products to add them here.</p>
          <button onClick={() => navigate('/products')} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg">Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-sm text-gray-500">Products you liked</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {likes.map((like) => (
          <div key={like.id} className="bg-white rounded-xl p-2 cursor-pointer" onClick={() => navigate(`/products/${like.product_id}`)}>
            {like.product?.images && like.product.images[0] ? (
              <img src={like.product.images[0].image_url || like.product.images[0]} alt={like.product?.title} className="w-full h-36 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-36 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="bi bi-image text-3xl text-gray-400"></i>
              </div>
            )}
            <p className="mt-2 text-sm font-medium text-gray-900 truncate">{like.product?.title}</p>
            <p className="text-sm text-gray-600">{`MAD ${Number(like.product?.price || 0).toFixed(2)}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
