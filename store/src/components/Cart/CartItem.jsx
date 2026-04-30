import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove, updating }) => {
  const product = item.product;
  const imageUrl = product.images?.[0]?.image_url || '/api/placeholder/100/100';
  const price = product.discounted_price || product.price;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center">
      <div className="md:col-span-5 flex items-center gap-4">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-20 h-20 object-cover rounded"
        />
        <Link to={`/products/${product.id}`} className="hover:text-blue-600">
          <h3 className="font-semibold">{product.title}</h3>
        </Link>
      </div>
      
      <div className="md:col-span-3">
        <span className="font-semibold">${parseFloat(price).toFixed(2)}</span>
      </div>
      
      <div className="md:col-span-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={updating || item.quantity <= 1}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <span className="w-12 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={updating || item.quantity >= product.stock}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="md:col-span-1 flex justify-between items-center">
        <span className="font-bold">${parseFloat(item.subtotal).toFixed(2)}</span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;